# 📸 PixieBooth - Digital Photo Booth

A modern React-based photo booth application that recreates the classic photo booth experience in your browser.

## ✨ Features

- **Coin-operated interface** with animated curtain
- **Multiple photo options**: 1, 2, 3, or 6 photos (2×3 grid)
- **20+ professional filters** (Vintage, Golden Hour, Film Noir, etc.)
- **Real-time webcam preview** with live filter effects
- **Instant photo strip download** in high quality
- **Mobile-friendly** design

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/AnchalSV31/Photobooth

# Install dependencies
npm install

# Start the application
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and allow camera permissions.

## 🎮 How to Use

1. Click "INSERT COIN HERE" and click the golden coin
2. Choose how many photos you want (1, 2, 3, or 6)
3. Select your favorite filter
4. Click the camera button and follow the countdown
5. Download your photo strip!

## 🛠️ Tech Stack

- React 18
- Vite (build tool)
- react-webcam (camera access)
- framer-motion (animations)
- html2canvas (photo downloads)
- CSS3 (styling)

## 📁 Project Structure

```
src/
├── components/
│   ├── Hero.jsx
│   ├── PhotoBooth.jsx      # Coin insertion & curtain
│   └── PhotoStudio.jsx     # Main photo capture
├── App.js
└── index.js
```

## 📱 Browser Support

Works on Chrome, Firefox, Safari, and Edge. Requires camera permissions and HTTPS/localhost for security.

## 📄 License

MIT License - feel free to use for personal and commercial projects.

---

**Made with React ⚛️**



# React + Vite
# Use command "npm run dev" In VITE-PROJECT folder to run the project