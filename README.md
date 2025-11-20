# 🌧️ Rain Dashboard - Serial Monitoring Mode

**Professional IoT monitoring system with direct ESP32 serial communication**

Real-time rain monitoring dashboard with ESP32 connected via USB serial, Flask backend for serial monitoring, and React frontend with live charts, intelligent alerts, and premium UI/UX.

## 🎯 Architecture

```
ESP32 (DHT11) → USB Serial → Flask Backend → HTTP API → React Frontend
                  COM5/9600     PySerial      JSON      1-sec polling
```

## ✨ Features

- **📡 Serial Monitoring**: Direct USB connection with auto-recovery
- **🎨 Premium UI**: Animated gradients, glassmorphism, 60fps animations
- **📊 Live Charts**: Real-time graphs tracking last 50 readings
- **🚨 Smart Alerts**: Threshold-based notifications with toast popups
- **💾 Data Export**: Download sensor logs as JSON
- **🌙 Dark Mode**: Professional theme switching

## 🚀 Quick Start

### Backend
```powershell
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend
```powershell
cd frontend
npm install
npm start
```

### ESP32
1. Open `esp32/esp32_simple_dht11.ino` in Arduino IDE
2. Install libraries: DHT sensor library, ArduinoJson
3. Upload to ESP32 (Board: ESP32 Dev Module)
4. Connect via USB (COM5, 9600 baud)

## 🔌 Hardware

**Components**: ESP32 DevKit (₹300), DHT11 (₹150), USB Cable (₹50)

**Wiring**:
```
DHT11 → ESP32
VCC   → 3.3V
GND   → GND
DATA  → GPIO 18
```

## ⚙️ Configuration

**Backend** (`backend/config.py`):
```python
SERIAL_PORT = 'COM5'
BAUD_RATE = 9600
```

**Frontend** (`frontend/src/App.js`):
```javascript
const API_URL = 'http://localhost:5000/api/sensor-data';
const POLLING_INTERVAL = 1000; // 1 second
```

## 📊 API

**GET `/api/sensor-data`**
```json
{
  "success": true,
  "connected": true,
  "data": {
    "temperature": 28.5,
    "humidity": 65.2,
    "rainfall": 0
  }
}
```

## 🔧 Troubleshooting

**Serial connection failed?**
1. Check COM port in Device Manager
2. Update `backend/config.py`
3. Close Arduino serial monitor
4. Reconnect USB

**No data updates?**
1. Verify baud rate (9600)
2. Check DHT11 wiring (GPIO 18)
3. Test ESP32 in Arduino serial monitor

## 🛠️ Tech Stack

- **Hardware**: ESP32, DHT11
- **Backend**: Python, Flask, PySerial
- **Frontend**: React, Recharts, Framer Motion

## 📈 Performance

- Serial: 2-second intervals from ESP32
- Polling: 1-second HTTP requests
- UI: 60fps animations
- Buffer: Last 50 readings

## 🏆 Hackathon Ready

✅ Full-stack IoT  
✅ Real-time monitoring  
✅ Professional UI  
✅ Complete docs  

---

**Serial Monitoring Mode - Simple, Fast, Reliable** 🎯
