# ESP32 Rain Sensor Arduino Sketch

This Arduino sketch reads data from sensors connected to the ESP32 and transmits it via USB serial connection to your computer.

## 🔧 Current Hardware Setup

Your friend is using:
- ESP32 Development Board
- DHT11 Temperature & Humidity Sensor
- GPIO 18 for DHT11 data pin
- Baud rate: 9600

## 📦 Required Libraries

Install these libraries through Arduino IDE Library Manager:

1. **DHT sensor library** by Adafruit
   - Go to Sketch → Include Library → Manage Libraries
   - Search for "DHT sensor library"
   - Install "DHT sensor library by Adafruit"

2. **ArduinoJson** by Benoit Blanchon
   - Search for "ArduinoJson"
   - Install version 6.x (not version 7)

## 🔌 Hardware Connections

### DHT11 Temperature & Humidity Sensor (Current Setup)
- VCC → 3.3V (ESP32)
- GND → GND (ESP32)
- DATA → GPIO 18 (ESP32)

### Rain Sensor Module (Optional - Not in current setup)
- VCC → 3.3V or 5V (ESP32)
- GND → GND (ESP32)
- AO (Analog Out) → GPIO 34 (ESP32)
- DO (Digital Out) → GPIO 5 (ESP32) - Optional

## 📝 Which Sketch to Use?

### Option 1: Simple DHT11 Only (RECOMMENDED FOR NOW)
Use `esp32_simple_dht11.ino` - This matches your friend's current hardware exactly
- Only DHT11 sensor
- No rain sensor needed
- Baud rate: 9600

### Option 2: Full Version with Rain Sensor
Use `esp32_rain_sensor.ino` - For when you add rain sensor later
- DHT11 sensor
- Rain sensor support
- Baud rate: 9600

## 📤 Upload Instructions

1. Connect ESP32 to your computer via USB cable
2. Open `esp32_simple_dht11.ino` in Arduino IDE
3. Select your board:
   - Tools → Board → ESP32 Arduino → ESP32 Dev Module
4. Select your port:
   - Tools → Port → COM5 (or your ESP32's port)
5. Click Upload button
6. Open Serial Monitor (Ctrl+Shift+M) to verify data transmission
   - **IMPORTANT**: Set Serial Monitor baud rate to 9600

## 📊 Data Format

The ESP32 sends JSON data every 2 seconds:

```json
{
  "temperature": 25.5,
  "humidity": 60.2,
  "rainfall": 15.3,
  "isRaining": false,
  "rainfallRaw": 3500,
  "timestamp": 12345
}
```

## 🔧 Troubleshooting

### "Failed to read from DHT sensor"

1. Check if DHT11 is connected to GPIO 18
2. Verify DHT wiring (VCC, GND, Data)
3. Make sure DHT sensor library is installed
4. DHT11 needs a moment to stabilize after power-on

### Arduino IDE can't find ESP32 board

1. Install ESP32 board support:
   - File → Preferences
   - Add to Additional Boards Manager URLs:
     `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
   - Tools → Board → Boards Manager
   - Search "esp32" and install

### Serial Monitor shows gibberish

- Make sure baud rate is set to 9600 in Serial Monitor
- Both ESP32 code and Flask backend must use same baud rate

### Can't upload to ESP32

- Hold BOOT button while uploading
- Check correct COM port is selected
- Close Serial Monitor before uploading
- Try a different USB cable

## 🔄 Migrating from Blynk Code

Your friend's original code used:
- Blynk IoT platform (WiFi)
- `Serial.begin(9600)`
- DHT11 on GPIO 18
- 2-second intervals

**Changes made:**
- ✅ Removed WiFi and Blynk dependencies
- ✅ Kept same GPIO 18 and baud rate 9600
- ✅ Added JSON format for Flask backend
- ✅ Same 2-second update interval
- ✅ No code changes needed on hardware side!
