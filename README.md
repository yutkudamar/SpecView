# SpecView

A minimal hardware inspector built with Node.js and Express.  
Click a button — see your CPU, GPU, RAM, storage, and OS at a glance.

![preview](https://img.shields.io/badge/node-%3E%3D18-brightgreen) ![license](https://img.shields.io/badge/license-MIT-blue)

## Features

- CPU model, core count, and clock speed
- RAM usage with live progress bar
- GPU model and VRAM
- Storage drives and type
- OS info and hostname
- Battery status (if applicable)

## Getting Started

**Requirements:** Node.js 18+

```bash
# 1. Clone the repo
git clone https://github.com/your-username/specview.git
cd specview

# 2. Install dependencies
npm install

# 3. Start the server
node server.js
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
specview/
├── server.js        # Express backend — reads system info
├── package.json
└── public/
    ├── index.html   # UI
    ├── style.css    # Styles
    └── app.js       # Frontend logic
```

## Tech Stack

- [Node.js](https://nodejs.org)
- [Express](https://expressjs.com)
- [systeminformation](https://systeminformation.io)

## License

MIT
