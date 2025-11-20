# 🚀 Quick Start Guide

This guide will help you get the entire Rain Dashboard system running in minutes.

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- ✅ **Python 3.8+** installed (`python --version`)
- ✅ **Node.js 14+** installed (`node --version`)
- ✅ **ESP32** connected via USB cable
- ✅ **Arduino sketch** uploaded to ESP32
- ✅ **COM port** identified (Device Manager on Windows)

## 🎯 Three Ways to Start

### Option 1: Automated Script (Easiest)

**Windows PowerShell:**
```powershell
cd Rain-Dashboard
.\start.ps1
```

This script will:
1. Check if Python and Node.js are installed
2. Start Flask backend in a new window
3. Install npm packages (first time only)
4. Start React frontend in a new window
5. Dashboard opens automatically

### Option 2: Manual Start (Recommended for Learning)

**Terminal 1 - Flask Backend:**
```bash
cd backend
pip install -r requirements.txt
python app.py
```

**Terminal 2 - React Frontend:**
```bash
cd frontend
npm install
npm start
```

**Terminal 3 - Arduino Serial Monitor (Optional):**
- Open Arduino IDE
- Tools → Serial Monitor
- Set baud rate to 9600
- View raw JSON data from ESP32

### Option 3: Step-by-Step (First Time Setup)

#### Step 1: Setup ESP32 (One Time)

1. **Install Arduino Libraries:**
   - Open Arduino IDE
   - Sketch → Include Library → Manage Libraries
   - Install: "DHT sensor library" by Adafruit
   - Install: "ArduinoJson" (version 6.x)

2. **Upload Sketch:**
   - Open `esp32/esp32_simple_dht11.ino`
   - Tools → Board → ESP32 Dev Module
   - Tools → Port → Select your COM port
   - Click Upload

3. **Verify Data:**
   - Open Serial Monitor (Ctrl+Shift+M)
   - Set baud rate to 9600
   - You should see JSON data

4. **Note COM Port:**
   - Windows: COM3, COM4, COM5, etc.
   - Find in Device Manager → Ports (COM & LPT)

#### Step 2: Configure Backend

1. **Open `backend/config.py`**

2. **Set your COM port:**
   ```python
   SERIAL_PORT = 'COM5'  # Change to your port
   BAUD_RATE = 9600      # Keep as is
   ```

3. **Install Python packages:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

#### Step 3: Start Backend

```bash
cd backend
python app.py
```

You should see:
```
✓ Serial connection established on COM5
Starting Flask server...
API endpoint: http://localhost:5000/api/sensor-data
WebSocket endpoint: ws://localhost:5000
```

#### Step 4: Start Frontend

**New terminal:**
```bash
cd frontend
npm install       # First time only
npm start
```

Browser opens automatically at `http://localhost:3000`

## 🔍 Verify Everything Works

### 1. Check ESP32
- Arduino Serial Monitor shows JSON every 2 seconds
- Format: `{"temperature":25.5,"humidity":60.2,...}`

### 2. Check Flask Backend
- Terminal shows "Serial connection established"
- Visit: http://localhost:5000/api/sensor-data
- Should return JSON with sensor data

### 3. Check React Dashboard
- Browser opens at http://localhost:3000
- Status shows "🟢 Connected"
- Sensor cards show live values
- Values update every 2 seconds

## 🐛 Troubleshooting

### Issue: Flask can't connect to serial port

**Solution:**
1. Close Arduino Serial Monitor (it locks the port)
2. Check correct COM port in `config.py`
3. Try different USB cable/port
4. On Windows, check Device Manager

### Issue: React shows "Disconnected"

**Solution:**
1. Make sure Flask backend is running
2. Check Flask terminal for errors
3. Try toggling connection mode (WebSocket ↔ Polling)
4. Check browser console (F12) for errors

### Issue: Sensor data shows "--"

**Solution:**
1. Check ESP32 is connected and powered
2. Verify Arduino sketch is uploaded
3. Check DHT11 wiring (GPIO 18)
4. Open Arduino Serial Monitor to verify data

### Issue: "Module not found" errors

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
rm -rf node_modules
npm install
```

## 📊 What You Should See

### Flask Terminal:
```
✓ Serial connection established on COM5
Received: {"temperature":25.5,"humidity":60.2,"rainfall":0,"isRaining":false,"timestamp":12345}
Starting Flask server...
 * Running on http://0.0.0.0:5000
```

### React Terminal:
```
Compiled successfully!

You can now view rain-dashboard-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.x:3000
```

### Dashboard (Browser):
- Beautiful gradient purple background
- Three sensor cards showing live values
- Green "Connected" status
- Rain status indicator
- Values updating in real-time

## 🎯 Next Steps After Setup

1. **Customize Dashboard:**
   - Edit `frontend/src/App.css` for colors
   - Modify `frontend/src/App.js` for layout

2. **Add More Features:**
   - Historical data charts
   - Data logging to file/database
   - Email/SMS alerts
   - Mobile app

3. **Deploy to Network:**
   - Access from other devices on local network
   - Use computer's IP address instead of localhost

## 📱 Access from Other Devices

1. **Find your computer's IP:**
   ```bash
   ipconfig  # Windows
   ifconfig  # Linux/Mac
   ```

2. **Update Frontend:**
   - Edit `frontend/src/App.js`
   - Change `BACKEND_URL` to `http://192.168.x.x:5000`

3. **Access dashboard:**
   - From phone/tablet: `http://192.168.x.x:3000`

## 🛑 Stopping the Services

### If using start.ps1:
- Close the Flask terminal window
- Close the React terminal window

### If started manually:
- Press `Ctrl+C` in Flask terminal
- Press `Ctrl+C` in React terminal

## 💡 Pro Tips

1. **Keep Arduino Serial Monitor closed** when Flask is running
2. **Use WebSocket mode** for fastest updates
3. **Check browser console** (F12) to debug frontend issues
4. **Check Flask terminal** for backend errors
5. **Restart Flask** if ESP32 disconnects and reconnects

## 📞 Need Help?

1. Check detailed READMEs:
   - `backend/README.md`
   - `frontend/README.md`
   - `esp32/README.md`

2. Check `MIGRATION_GUIDE.md` if migrating from Blynk

3. Verify hardware connections in `esp32/README.md`

---

**You're all set! Happy monitoring! 🌧️📊**
