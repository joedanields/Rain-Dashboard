from flask import Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import serial
import json
import threading
import time
from config import SERIAL_PORT, BAUD_RATE, SERIAL_TIMEOUT

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend
socketio = SocketIO(app, cors_allowed_origins="*")

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
                        
                        # Emit data to all connected WebSocket clients
                        socketio.emit('sensor_update', data)
                        
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

# WebSocket events
@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    print('Client connected')
    emit('connection_response', {'connected': True})

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    print('Client disconnected')

@socketio.on('request_data')
def handle_request_data():
    """Send latest data when requested"""
    emit('sensor_update', latest_data)

if __name__ == '__main__':
    # Start serial reading thread
    serial_thread = threading.Thread(target=read_serial_data, daemon=True)
    serial_thread.start()
    
    # Run Flask app with SocketIO
    print("Starting Flask server...")
    print(f"API endpoint: http://localhost:5000/api/sensor-data")
    print(f"WebSocket endpoint: ws://localhost:5000")
    
    socketio.run(app, debug=True, host='0.0.0.0', port=5000, allow_unsafe_werkzeug=True)
