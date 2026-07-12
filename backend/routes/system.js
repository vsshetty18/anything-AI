const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const screenshotsDir = path.join(__dirname, '..', '..', 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// POST /api/system/open-website - opens URL in default browser (OS-level fallback)
router.post('/system/open-website', (req, res) => {
  const { url } = req.body;

  if (!url || !url.trim()) {
    return res.status(400).json({ success: false, message: 'URL is required.' });
  }

  let target = url.trim();
  if (!/^https?:\/\//i.test(target)) {
    target = 'https://' + target;
  }

  let command;
  if (process.platform === 'darwin') {
    command = `open "${target}"`;
  } else if (process.platform === 'win32') {
    command = `start "" "${target}"`;
  } else {
    command = `xdg-open "${target}"`;
  }

  exec(command, (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Could not open website: ' + err.message });
    }
    return res.json({ success: true });
  });
});

// POST /api/system/screenshot - OS-level fallback screenshot (used when not running inside Electron)
router.post('/system/screenshot', (req, res) => {
  const fileName = `screenshot-${Date.now()}.png`;
  const filePath = path.join(screenshotsDir, fileName);

  let command;
  if (process.platform === 'darwin') {
    command = `screencapture -x "${filePath}"`;
  } else if (process.platform === 'win32') {
    command = `powershell -command "Add-Type -AssemblyName System.Windows.Forms; $b = [System.Windows.Forms.SystemInformation]::VirtualScreen; $bmp = New-Object System.Drawing.Bitmap $b.Width, $b.Height; $g = [System.Drawing.Graphics]::FromImage($bmp); $g.CopyFromScreen($b.Location, [System.Drawing.Point]::Empty, $b.Size); $bmp.Save('${filePath.replace(/\\/g, '\\\\')}')"`;
  } else {
    command = `import -window root "${filePath}"`; // requires imagemagick on Linux
  }

  exec(command, (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Screenshot failed. Use the desktop app screenshot button instead.'
      });
    }
    return res.json({ success: true, fileName, filePath });
  });
});

module.exports = router;
