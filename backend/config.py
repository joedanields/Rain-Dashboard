"""
Configuration file for Flask backend
Modify these settings according to your setup
"""

# Serial Port Configuration
# Windows: Usually 'COM3', 'COM4', 'COM5', etc.
# Linux: Usually '/dev/ttyUSB0' or '/dev/ttyACM0'
# Mac: Usually '/dev/cu.usbserial-*'
SERIAL_PORT = 'COM5'  # Change this to your ESP32's port

# Serial Communication Settings
BAUD_RATE = 9600  # Changed to match ESP32 baud rate
SERIAL_TIMEOUT = 1  # Timeout in seconds

# Flask Server Settings
FLASK_HOST = '0.0.0.0'
FLASK_PORT = 5000
FLASK_DEBUG = True
