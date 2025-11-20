/*
 * ESP32 Rain Dashboard - Simple DHT11 Version
 * 
 * This version matches your friend's hardware setup exactly.
 * Only DHT11 sensor, no WiFi/Blynk, sends data via USB Serial.
 * 
 * Hardware:
 * - ESP32 Development Board
 * - DHT11 Temperature & Humidity Sensor
 * 
 * Wiring:
 * - DHT11 VCC -> 3.3V
 * - DHT11 GND -> GND
 * - DHT11 Data -> GPIO 18
 */

#include <DHT.h>
#include <ArduinoJson.h>

#define DHTPIN 18
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

unsigned long lastUpdate = 0;
const unsigned long updateInterval = 2000;  // Send data every 2 seconds

void setup() {
  Serial.begin(9600);
  delay(1000);
  
  Serial.println("ESP32 Rain Dashboard - Simple DHT11");
  Serial.println("Initializing DHT11 sensor...");
  
  dht.begin();
  
  Serial.println("Setup complete. Starting data transmission...");
  delay(2000);
}

void loop() {
  unsigned long currentTime = millis();
  
  if (currentTime - lastUpdate >= updateInterval) {
    lastUpdate = currentTime;
    
    delay(1000);  // Small delay before reading
    float h = dht.readHumidity();
    float t = dht.readTemperature();
    
    if (isnan(h) || isnan(t)) {
      Serial.println("{\"error\":\"Failed to read from DHT sensor\"}");
      return;
    }
    
    // Create JSON document
    StaticJsonDocument<256> doc;
    
    doc["temperature"] = round(t * 10) / 10.0;
    doc["humidity"] = round(h * 10) / 10.0;
    doc["rainfall"] = 0;  // No rain sensor in current setup
    doc["isRaining"] = false;
    doc["timestamp"] = currentTime;
    
    // Send JSON to Serial
    serializeJson(doc, Serial);
    Serial.println();  // Important: newline for Python readline()
  }
}
