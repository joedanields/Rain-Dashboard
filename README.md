# Rain Dashboard - ESP32 + Flask + React

A real-time rain monitoring dashboard that collects sensor data from ESP32 via USB serial connection and displays it on a React web interface.

## 🎯 Project Overview

This project consists of three main components:

1. **ESP32 Microcontroller** - Reads sensor data (temperature, humidity, rainfall)
2. **Flask Backend** - Receives data via USB serial and serves it through REST API/WebSocket
3. **React Frontend** - Displays real-time sensor data in an interactive dashboard

## 📁 Project Structure

```
Rain-Dashboard/
├── backend/              # Flask server with serial communication
│   ├── app.py           # Main Flask application
│   ├── config.py        # Serial port configuration
│   ├── requirements.txt # Python dependencies
│   └── README.md        # Backend setup instructions
│
├── esp32/               # Arduino sketch for ESP32
│   ├── esp32_rain_sensor.ino  # Main Arduino code
│   └── README.md        # ESP32 setup instructions
│
└── README.md            # This file
```

## 🚀 Quick Start

### 1. Setup ESP32

1. Navigate to `esp32/` folder
2. Follow instructions in `esp32/README.md`
3. Upload sketch to ESP32
4. Note your COM port

### 2. Setup Flask Backend

1. Navigate to `backend/` folder
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure serial port in `config.py`
4. Run server:
   ```bash
   python app.py
   ```

### 3. Setup React Frontend (Coming Soon)

The React dashboard will connect to Flask backend via:
- **REST API**: `http://localhost:5000/api/sensor-data`
- **WebSocket**: `ws://localhost:5000`

## 🔌 How It Works

```
┌─────────┐  USB Serial  ┌─────────┐  HTTP/WS  ┌─────────┐
│  ESP32  │─────────────→│  Flask  │──────────→│  React  │
│ Sensors │  JSON Data   │ Backend │   JSON    │Dashboard│
└─────────┘              └─────────┘           └─────────┘
```

1. ESP32 reads sensor data (DHT22, rain sensor)
2. Sends JSON via USB serial every 2 seconds
3. Flask reads serial data with PySerial
4. Flask serves data via REST API or WebSocket
5. React dashboard displays real-time updates

## 📊 Data Format

```json
{
  "temperature": 25.5,
  "humidity": 60.2,
  "rainfall": 15.3,
  "isRaining": false,
  "timestamp": 12345
}
```

## 🛠️ Technologies Used

- **Hardware**: ESP32, DHT22, Rain Sensor
- **Embedded**: Arduino IDE, C++
- **Backend**: Python, Flask, PySerial, Flask-SocketIO
- **Frontend**: React (to be implemented)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## 📧 Support

For detailed setup instructions, see README files in respective folders:
- Backend: `backend/README.md`
- ESP32: `esp32/README.md`