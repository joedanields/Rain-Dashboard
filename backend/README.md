# Flask Backend with ESP32 Serial Communication

This Flask backend receives sensor data from ESP32 via USB serial connection and serves it to your React dashboard through REST API and WebSocket.

## Features

✅ USB Serial communication with ESP32  
✅ REST API endpoint for polling sensor data  
✅ WebSocket support for real-time updates  
✅ Auto-reconnection if serial connection drops  
✅ CORS enabled for React frontend  

## Prerequisites

- Python 3.8 or higher
- ESP32 connected via USB cable
- Uploaded Arduino sketch (see `../esp32/` folder)

## Installation

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Find Your ESP32 COM Port

**Windows:**
- Open Device Manager → Ports (COM & LPT)
- Look for "Silicon Labs CP210x USB to UART Bridge" or similar
- Note the COM port number (e.g., COM5)

**Linux:**
```bash
ls /dev/ttyUSB* /dev/ttyACM*
# Usually /dev/ttyUSB0 or /dev/ttyACM0
```

**Mac:**
```bash
ls /dev/cu.usbserial-*
```

### 3. Configure Serial Port

Edit `config.py` and set your COM port:

```python
SERIAL_PORT = 'COM5'  # Change to your ESP32's port
BAUD_RATE = 115200
```

## Running the Server

```bash
python app.py
```

You should see:
```
✓ Serial connection established on COM5
Starting Flask server...
API endpoint: http://localhost:5000/api/sensor-data
WebSocket endpoint: ws://localhost:5000
```

## API Endpoints

### GET `/api/sensor-data`
Returns the latest sensor readings.

**Response:**
```json
{
  "success": true,
  "connected": true,
  "data": {
    "temperature": 25.5,
    "humidity": 60.2,
    "rainfall": 15.3,
    "isRaining": false,
    "timestamp": 12345
  }
}
```

### GET `/api/status`
Returns connection status.

**Response:**
```json
{
  "serial_connected": true,
  "port": "COM5",
  "baud_rate": 115200
}
```

## WebSocket Events

### Client → Server

**`connect`** - Establish WebSocket connection  
**`request_data`** - Request latest sensor data  
**`disconnect`** - Close connection

### Server → Client

**`connection_response`** - Confirmation of connection  
**`sensor_update`** - Real-time sensor data (emitted automatically when new data arrives)

## React Frontend Integration

### Option 1: REST API (Polling)

```javascript
// Poll every 2 seconds
useEffect(() => {
  const interval = setInterval(async () => {
    const response = await fetch('http://localhost:5000/api/sensor-data');
    const data = await response.json();
    setSensorData(data.data);
  }, 2000);
  
  return () => clearInterval(interval);
}, []);
```

### Option 2: WebSocket (Real-time)

Install Socket.IO client:
```bash
npm install socket.io-client
```

```javascript
import { io } from 'socket.io-client';

useEffect(() => {
  const socket = io('http://localhost:5000');
  
  socket.on('connect', () => {
    console.log('Connected to Flask server');
  });
  
  socket.on('sensor_update', (data) => {
    console.log('Sensor update:', data);
    setSensorData(data);
  });
  
  return () => socket.disconnect();
}, []);
```

## Troubleshooting

### "Failed to connect to serial port"

1. Check if ESP32 is connected via USB
2. Verify correct COM port in `config.py`
3. Make sure Arduino sketch is uploaded to ESP32
4. Close Arduino Serial Monitor if open (it locks the port)
5. On Linux, you may need permissions:
   ```bash
   sudo usermod -a -G dialout $USER
   # Then logout and login
   ```

### "JSON parse error"

- Verify ESP32 is sending valid JSON with `\n` at the end
- Open Arduino Serial Monitor to check data format
- Ensure baud rate matches (115200)

### CORS errors

- Make sure Flask backend is running
- Check that `flask-cors` is installed
- Frontend should use correct backend URL

## Project Structure

```
backend/
├── app.py           # Main Flask application
├── config.py        # Configuration settings
├── requirements.txt # Python dependencies
└── README.md        # This file
```

## Next Steps

1. Start the Flask backend: `python app.py`
2. Create React frontend to consume the API
3. Build dashboard UI with charts and real-time updates
4. Add data logging/storage if needed

## Support

For issues or questions, check:
- ESP32 is properly connected and sketch uploaded
- Serial port settings match in both Arduino and Flask
- Python dependencies installed correctly
