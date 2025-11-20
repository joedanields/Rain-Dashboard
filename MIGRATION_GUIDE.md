# 🚀 Quick Setup Guide - Migrating from Blynk to Flask Backend

## What Changed?

Your friend was using **Blynk IoT** (cloud platform with WiFi). We're switching to **USB Serial + Flask** (local, no WiFi needed).

## ✅ What Stays the Same
- ✅ ESP32 hardware
- ✅ DHT11 sensor on GPIO 18
- ✅ Same wiring
- ✅ Baud rate: 9600
- ✅ 2-second data updates

## 🔄 What's Different
- ❌ No WiFi needed
- ❌ No Blynk account needed
- ✅ USB cable to computer
- ✅ Flask reads data locally
- ✅ JSON format instead of Blynk virtual pins

---

## 📋 Step-by-Step Setup

### Step 1: ESP32 Code (Your Friend's Laptop)

1. **Keep hardware as-is** - Don't change any wiring!

2. **Install Arduino Libraries** (if not already installed):
   - Open Arduino IDE
   - Sketch → Include Library → Manage Libraries
   - Install: "DHT sensor library" by Adafruit
   - Install: "ArduinoJson" (version 6.x)

3. **Upload New Code**:
   - Open `esp32_simple_dht11.ino`
   - Tools → Board → ESP32 Dev Module
   - Tools → Port → Select your COM port
   - Click Upload

4. **Verify it works**:
   - Open Serial Monitor (Ctrl+Shift+M)
   - Set baud rate to **9600**
   - You should see JSON output like:
     ```json
     {"temperature":25.5,"humidity":60.2,"rainfall":0,"isRaining":false,"timestamp":12345}
     ```

5. **Note the COM port** (e.g., COM3, COM4, COM5)

### Step 2: Flask Backend (Your Computer)

1. **Update config.py**:
   ```python
   SERIAL_PORT = 'COM5'  # Change to your ESP32's COM port
   BAUD_RATE = 9600      # Already updated to match
   ```

2. **Install Python packages**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Run Flask server**:
   ```bash
   python app.py
   ```

4. **Check connection**:
   - You should see: `✓ Serial connection established on COM5`
   - Backend receives data automatically

5. **Test the API**:
   - Open browser: http://localhost:5000/api/sensor-data
   - You should see JSON with temperature and humidity

---

## 🔍 Key Differences from Blynk Code

### Old Blynk Code:
```cpp
#include <WiFi.h>
#include <BlynkSimpleEsp32.h>

char ssid[] = "KITE-STUDENTS-5F-AW";
char pass[] = "K!tE#2o25$";

void sendSensorData(){
  Blynk.virtualWrite(V0, t);  // Send to cloud
  Blynk.virtualWrite(V1, h);
}

void setup(){
  Blynk.begin(BLYNK_AUTH_TOKEN, ssid, pass);  // WiFi connection
}

void loop(){
  Blynk.run();  // Keep connection alive
  timer.run();
}
```

### New Serial Code:
```cpp
#include <ArduinoJson.h>
// No WiFi libraries needed!

void loop(){
  // Read sensor
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  
  // Create JSON
  StaticJsonDocument<256> doc;
  doc["temperature"] = t;
  doc["humidity"] = h;
  
  // Send via USB Serial
  serializeJson(doc, Serial);
  Serial.println();  // Newline is important!
}
```

---

## 📊 Data Flow Comparison

### Blynk (Old):
```
ESP32 → WiFi → Blynk Cloud → Blynk App/Dashboard
```

### Flask (New):
```
ESP32 → USB Cable → Computer → Flask → React Dashboard
```

---

## ✨ Benefits of New Setup

1. **No WiFi needed** - Works offline
2. **Faster** - No cloud latency
3. **Free** - No Blynk subscription
4. **Local control** - All data stays on your computer
5. **More flexible** - Full control over backend

---

## 🐛 Common Issues

### Issue: "Serial port busy" or "Access denied"
**Solution**: Close Arduino Serial Monitor before running Flask

### Issue: Flask can't find COM port
**Solution**: 
- Check Device Manager (Windows)
- Update `config.py` with correct port
- Try different USB cable

### Issue: JSON parse error in Flask
**Solution**: 
- Open Arduino Serial Monitor
- Verify JSON format is correct
- Check baud rate is 9600 in both places

### Issue: Still want to use Blynk too?
**Solution**: You can keep both! 
- Use Blynk code for cloud access
- Use Serial code for local dashboard
- Just upload different sketches as needed

---

## 📞 Next Steps

1. ✅ Upload `esp32_simple_dht11.ino` to ESP32
2. ✅ Run Flask backend with `python app.py`
3. ✅ Test API endpoint in browser
4. 🔜 Build React dashboard to display data

Your setup is ready! The ESP32 will send data continuously, Flask receives it, and you can now build a React frontend to visualize everything.
