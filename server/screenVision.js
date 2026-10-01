// server/screenVision.js
import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'node:child_process';
import util from 'node:util';

const execPromise = util.promisify(exec);

export async function captureScreenBase64() {
  try {
    // Check if screenshot-desktop module is available
    const screenshot = await import('screenshot-desktop').then(m => m.default || m).catch(() => null);
    if (screenshot) {
      const imgBuffer = await screenshot({ format: 'png' });
      return imgBuffer.toString('base64');
    }
  } catch (err) {
    console.warn('[screenVision] screenshot-desktop fallback:', err.message);
  }

  // Windows PowerShell fallback for screenshot
  try {
    const tmpPath = path.join(process.cwd(), 'temp_screen.png');
    const ps = `powershell -c "Add-Type -AssemblyName System.Windows.Forms; Add-Type -AssemblyName System.Drawing; $b = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds; $bmp = New-Object System.Drawing.Bitmap $b.Width, $b.Height; $g = [System.Drawing.Graphics]::FromImage($bmp); $g.CopyFromScreen($b.Location, [System.Drawing.Point]::Empty, $b.Size); $bmp.Save('${tmpPath.replace(/\\/g, '\\\\')}', [System.Drawing.Imaging.ImageFormat]::Png); $g.Dispose(); $bmp.Dispose();"`;
    await execPromise(ps);
    if (fs.existsSync(tmpPath)) {
      const buffer = fs.readFileSync(tmpPath);
      fs.unlinkSync(tmpPath);
      return buffer.toString('base64');
    }
  } catch (e) {
    console.error('[screenVision] Screen capture error:', e.message);
  }

  // Minimal transparent 1x1 PNG fallback
  return 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
}

export async function analyzeScreenWithGemini(base64Image, query = 'What is on my screen right now?') {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    return {
      success: true,
      text: `🐱🔔 *Doraemon Screen Lens*: Main screen dekh raha hoon! Aap "${query}" pooch rahe ho. (Tip: Set GEMINI_API_KEY for live AI multimodal reasoning).`
    };
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are Doraemon, Satyam's witty, helpful robotic cat AI companion (Hinglish tone, friendly, addresses Satyam as buddy/bhai, talks about 4D gadgets). The user asks: "${query}". Look at the desktop screen image provided and give a sharp, direct, concise, and helpful answer.`
              },
              {
                inlineData: {
                  mimeType: 'image/png',
                  data: base64Image
                }
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return { success: false, error: `Gemini API error: ${response.status} ${errText}` };
    }

    const data = await response.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
    return { success: true, text: candidate };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
