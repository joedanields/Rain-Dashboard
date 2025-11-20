/*
 * ESP32 Rain Dashboard - Sensor Data Transmitter
 * 
 * This sketch reads sensor data and sends it to the computer
 * via USB serial connection in JSON format.
 * 
 * Hardware Requirements:
 * - ESP32 Development Board
 * - DHT11 Temperature & Humidity Sensor
 * - Rain Sensor Module (optional)
 * 
 * Wiring (Based on your friend's setup):
 * - DHT11 Data Pin -> GPIO 18
 * - Rain Sensor Analog Out -> GPIO 34 (if available)
 * - Rain Sensor Digital Out -> GPIO 5 (optional)
 */

#include <DHT.h>
#include <ArduinoJson.h>

// DHT Sensor Configuration (UPDATED to match your hardware)
#define DHTPIN 18         // GPIO 18 (matches your friend's setup)
#define DHTTYPE DHT11     // DHT11 sensor
DHT dht(DHTPIN, DHTTYPE);

// Rain Sensor Configuration
#define RAIN_ANALOG_PIN 34    // Analog pin for rain sensor
#define RAIN_DIGITAL_PIN 5    // Digital pin for rain sensor (optional)

// Timing Configuration
unsigned long lastUpdate = 0;
const unsigned long updateInterval = 2000;  // Send data every 2 seconds

void setup() {
  // Initialize Serial Communication
  // Changed to 9600 to match your friend's baud rate
  Serial.begin(9600);
  
  // Wait for serial port to connect
  delay(1000);
  
  Serial.println("ESP32 Rain Dashboard Sensor System");
  Serial.println("Initializing...");
  
  // Initialize DHT sensor
  dht.begin();
  
  // Initialize Rain Sensor pins (if you have rain sensor)
  pinMode(RAIN_ANALOG_PIN, INPUT);
  pinMode(RAIN_DIGITAL_PIN, INPUT);
  
  Serial.println("Setup complete. Starting data transmission...");
  delay(2000);
}

void loop() {
  unsigned long currentTime = millis();
  
  // Send data at regular intervals
  if (currentTime - lastUpdate >= updateInterval) {
    lastUpdate = currentTime;
    
    // Read sensor data
    float temperature = dht.readTemperature();    // Celsius
    float humidity = dht.readHumidity();          // Percentage
    int rainfallRaw = analogRead(RAIN_ANALOG_PIN); // 0-4095 (12-bit ADC)
    bool isRaining = digitalRead(RAIN_DIGITAL_PIN) == LOW; // Usually LOW when wet
    
    // Convert rainfall to percentage (inverse: 4095 = dry, 0 = wet)
    float rainfallPercent = 100.0 - ((rainfallRaw / 4095.0) * 100.0);
    
    // Check if DHT reading failed
    if (isnan(temperature) || isnan(humidity)) {
      Serial.println("{\"error\":\"Failed to read from DHT sensor\"}");
      return;
    }
    
    // Create JSON document
    StaticJsonDocument<256> doc;
    
    doc["temperature"] = round(temperature * 10) / 10.0;  // 1 decimal place
    doc["humidity"] = round(humidity * 10) / 10.0;        // 1 decimal place
    doc["rainfall"] = round(rainfallPercent * 10) / 10.0; // 1 decimal place
    doc["isRaining"] = isRaining;
    doc["rainfallRaw"] = rainfallRaw;
    doc["timestamp"] = currentTime;
    
    // Serialize JSON to Serial
    serializeJson(doc, Serial);
    Serial.println();  // Important: newline for readline() in Python
  }
}
