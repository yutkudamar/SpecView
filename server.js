const express = require('express');
const cors    = require('cors');
const si      = require('systeminformation');
const path    = require('path');

const app  = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/specs', async (req, res) => {
  try {
    const [cpu, mem, graphics, os, disk, battery] = await Promise.all([
      si.cpu(), si.mem(), si.graphics(), si.osInfo(), si.diskLayout(), si.battery(),
    ]);

    res.json({
      success: true,
      specs: {
        cpu: {
          brand:         cpu.brand,
          manufacturer:  cpu.manufacturer,
          cores:         cpu.cores,
          physicalCores: cpu.physicalCores,
          speed:         cpu.speed,
          speedMax:      cpu.speedMax,
        },
        ram: {
          total: (mem.total / 1073741824).toFixed(1),
          used:  ((mem.total - mem.available) / 1073741824).toFixed(1),
          free:  (mem.available / 1073741824).toFixed(1),
        },
        gpu: graphics.controllers.map(g => ({
          model: g.model, vendor: g.vendor, vram: g.vram,
        })),
        os: {
          distro: os.distro, release: os.release,
          arch: os.arch, platform: os.platform, hostname: os.hostname,
        },
        disk: disk.map(d => ({
          name: d.name, type: d.type,
          size: (d.size / 1073741824).toFixed(0), vendor: d.vendor,
        })),
        battery: {
          hasBattery: battery.hasBattery,
          percent:    battery.percent,
          isCharging: battery.isCharging,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => console.log(`→ http://localhost:${PORT}`));