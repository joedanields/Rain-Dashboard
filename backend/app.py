from flask import Flask, jsonify
from flask_cors import CORS
import serial
import json
import threading
import time
from config import SERIAL_PORT, BAUD_RATE, SERIAL_TIMEOUT

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Global variable to store latest sensor data
latest_data = {
    "temperature": 0,
    "humidity": 0,
    "rainfall": 0,
    "timestamp": ""
}

# Serial connection object
ser = None
serial_connected = False

def init_serial():
    """Initialize serial connection to ESP32"""
    global ser, serial_connected
    try:
        ser = serial.Serial()
        ser.baudrate = BAUD_RATE
        ser.port = SERIAL_PORT
        ser.timeout = SERIAL_TIMEOUT
        ser.open()
        serial_connected = True
        print(f"✓ Serial connection established on {SERIAL_PORT}")
        return True
    except serial.SerialException as e:
        print(f"✗ Failed to connect to serial port: {e}")
        serial_connected = False
        return False

def read_serial_data():
    """Background thread to continuously read serial data"""
    global latest_data, serial_connected
    
    while True:
        try:
            if not serial_connected:
                print("Attempting to reconnect to serial port...")
                if init_serial():
                    time.sleep(2)  # Wait for ESP32 to stabilize
                else:
                    time.sleep(5)  # Wait before retry
                    continue
            
            if ser and ser.in_waiting > 0:
                # Read line from serial port
                line = ser.readline().decode('utf-8').strip()
                
                if line:
                    print(f"Received: {line}")
                    
                    # Parse JSON data
                    try:
                        data = json.loads(line)
                        latest_data = data
                        print(f"✓ Data updated: Temp={data.get('temperature')}°C, Humidity={data.get('humidity')}%")
                        
                    except json.JSONDecodeError as e:
                        print(f"JSON parse error: {e}")
                        
        except serial.SerialException as e:
            print(f"Serial error: {e}")
            serial_connected = False
            if ser:
                ser.close()
                
        except Exception as e:
            print(f"Unexpected error: {e}")
            
        time.sleep(0.1)  # Small delay to prevent CPU overload

# REST API endpoint
@app.route('/api/sensor-data', methods=['GET'])
def get_sensor_data():
    """Return latest sensor data as JSON"""
    return jsonify({
        "success": True,
        "connected": serial_connected,
        "data": latest_data
    })

@app.route('/api/status', methods=['GET'])
def get_status():
    """Return connection status"""
    return jsonify({
        "serial_connected": serial_connected,
        "port": SERIAL_PORT,
        "baud_rate": BAUD_RATE
    })

if __name__ == '__main__':
    # Start serial reading thread
    serial_thread = threading.Thread(target=read_serial_data, daemon=True)
    serial_thread.start()
    
    # Run Flask app
    print("=" * 50)
    print("🚀 Flask Server Starting - Serial Monitoring Mode")
    print("=" * 50)
    print(f"📡 Serial Port: {SERIAL_PORT}")
    print(f"⚡ Baud Rate: {BAUD_RATE}")
    print(f"🌐 API Endpoint: http://localhost:5000/api/sensor-data")
    print(f"📊 Status Endpoint: http://localhost:5000/api/status")
    print("=" * 50)
    
    app.run(debug=True, host='0.0.0.0', port=5000)
