import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import SensorCard from './components/SensorCard';
import StatusIndicator from './components/StatusIndicator';
import DataChart from './components/DataChart';
import StatsCard from './components/StatsCard';
import WeatherAlert from './components/WeatherAlert';
import { FiDownload, FiMoon, FiSun } from 'react-icons/fi';

// Backend API URL
const API_URL = 'http://localhost:5000/api/sensor-data';
const POLLING_INTERVAL = 1000; // Poll every 1 second for serial monitoring

function App() {
  const [sensorData, setSensorData] = useState({
    temperature: null,
    humidity: null,
    rainfall: null,
    isRaining: false,
    timestamp: null
  });
  
  const [historicalData, setHistoricalData] = useState([]);
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({
    avgTemp: 0,
    maxTemp: 0,
    minTemp: 0,
    avgHumidity: 0,
    totalReadings: 0
  });

  // Calculate statistics
  const calculateStats = useCallback((data) => {
    if (data.length === 0) return;
    
    const temps = data.map(d => d.temperature).filter(t => t != null);
    const humidities = data.map(d => d.humidity).filter(h => h != null);
    
    if (temps.length > 0) {
      const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
      const maxTemp = Math.max(...temps);
      const minTemp = Math.min(...temps);
      const avgHumidity = humidities.reduce((a, b) => a + b, 0) / humidities.length;
      
      setStats({
        avgTemp: avgTemp.toFixed(1),
        maxTemp: maxTemp.toFixed(1),
        minTemp: minTemp.toFixed(1),
        avgHumidity: avgHumidity.toFixed(1),
        totalReadings: data.length
      });
    }
  }, []);

  // Generate alerts based on sensor data
  const generateAlerts = useCallback((data) => {
    const newAlerts = [];
    
    if (data.temperature > 35) {
      newAlerts.push({
        id: Date.now() + 1,
        type: 'warning',
        title: 'High Temperature',
        message: `Temperature is ${data.temperature}°C - Heat warning in effect`
      });
    }
    
    if (data.temperature < 10) {
      newAlerts.push({
        id: Date.now() + 2,
        type: 'info',
        title: 'Low Temperature',
        message: `Temperature dropped to ${data.temperature}°C - Cold conditions`
      });
    }
    
    if (data.humidity > 80) {
      newAlerts.push({
        id: Date.now() + 3,
        type: 'info',
        title: 'High Humidity',
        message: `Humidity at ${data.humidity}% - Expect muggy conditions`
      });
    }
    
    if (data.humidity < 30) {
      newAlerts.push({
        id: Date.now() + 4,
        type: 'warning',
        title: 'Low Humidity',
        message: `Humidity at ${data.humidity}% - Very dry air`
      });
    }
    
    if (data.rainfall > 0 || data.isRaining) {
      newAlerts.push({
        id: Date.now() + 5,
        type: 'danger',
        title: 'Rain Detected',
        message: `Rainfall detected: ${data.rainfall}mm - Take necessary precautions`
      });
    }
    
    setAlerts(newAlerts);
    
    // Show toast for critical alerts
    newAlerts.forEach(alert => {
      if (alert.type === 'danger' || alert.type === 'warning') {
        toast[alert.type === 'danger' ? 'error' : 'warning'](alert.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    });
  }, []);

  // Fetch sensor data via HTTP polling
  const fetchSensorData = useCallback(async () => {
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      
      if (result.success && result.data) {
        const data = result.data;
        
        // Update sensor data
        setSensorData({
          temperature: data.temperature,
          humidity: data.humidity,
          rainfall: data.rainfall || 0,
          isRaining: data.rainfall > 0,
          timestamp: data.timestamp || new Date().toISOString()
        });
        
        // Update connection status
        setConnected(result.connected);
        setLastUpdate(new Date());
        
        // Update historical data (keep last 50 readings)
        setHistoricalData(prev => {
          const newData = [...prev, {
            temperature: data.temperature,
            humidity: data.humidity,
            rainfall: data.rainfall || 0,
            timestamp: Date.now()
          }];
          return newData.slice(-50);
        });
        
        // Generate alerts
        generateAlerts(data);
      }
    } catch (error) {
      console.error('Failed to fetch sensor data:', error);
      setConnected(false);
    }
  }, [generateAlerts]);

  // Setup polling
  useEffect(() => {
    // Initial fetch
    fetchSensorData();
    
    // Poll every second
    const interval = setInterval(fetchSensorData, POLLING_INTERVAL);
    
    return () => clearInterval(interval);
  }, [fetchSensorData]);

  // Calculate stats when historical data updates
  useEffect(() => {
    calculateStats(historicalData);
  }, [historicalData, calculateStats]);

  // Export data function
  const exportData = () => {
    const dataStr = JSON.stringify({
      currentData: sensorData,
      historicalData: historicalData,
      statistics: stats,
      exportedAt: new Date().toISOString()
    }, null, 2);
    
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sensor-data-${Date.now()}.json`;
    link.click();
    
    toast.success('Data exported successfully!', {
      position: "top-right",
      autoClose: 3000,
    });
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      {/* Animated Background Orbs */}
      <div className="background-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <ToastContainer />

      {/* Header */}
      <motion.header 
        className="app-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-content">
          <motion.h1 
            className="app-title"
            animate={{ 
              textShadow: connected 
                ? ['0 0 10px rgba(74, 222, 128, 0.5)', '0 0 20px rgba(74, 222, 128, 0.8)', '0 0 10px rgba(74, 222, 128, 0.5)']
                : '0 0 10px rgba(239, 68, 68, 0.5)'
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🌧️ Rain Dashboard
          </motion.h1>
          
          <div className="header-controls">
            <motion.button
              className="control-btn"
              onClick={toggleDarkMode}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {darkMode ? <FiSun /> : <FiMoon />}
            </motion.button>
            
            <motion.button
              className="control-btn export-btn"
              onClick={exportData}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiDownload /> Export Data
            </motion.button>
          </div>
        </div>

        <StatusIndicator 
          connected={connected}
          lastUpdate={lastUpdate}
          mode="Serial Monitoring"
        />
      </motion.header>

      {/* Main Content */}
      <main className="app-content">
        {/* Statistics Grid */}
        <motion.section 
          className="stats-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <StatsCard 
            title="Avg Temperature"
            value={stats.avgTemp}
            unit="°C"
            icon="🌡️"
            color="#f59e0b"
          />
          <StatsCard 
            title="Max Temperature"
            value={stats.maxTemp}
            unit="°C"
            icon="🔥"
            color="#ef4444"
          />
          <StatsCard 
            title="Min Temperature"
            value={stats.minTemp}
            unit="°C"
            icon="❄️"
            color="#3b82f6"
          />
          <StatsCard 
            title="Avg Humidity"
            value={stats.avgHumidity}
            unit="%"
            icon="💧"
            color="#06b6d4"
          />
        </motion.section>

        {/* Sensor Cards */}
        <motion.section 
          className="sensor-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <SensorCard
            title="Temperature"
            value={sensorData.temperature}
            unit="°C"
            icon="🌡️"
            color="linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)"
            historicalData={historicalData.map(d => d.temperature)}
          />
          <SensorCard
            title="Humidity"
            value={sensorData.humidity}
            unit="%"
            icon="💧"
            color="linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)"
            historicalData={historicalData.map(d => d.humidity)}
          />
          <SensorCard
            title="Rainfall"
            value={sensorData.rainfall}
            unit="mm"
            icon="🌧️"
            color="linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)"
            historicalData={historicalData.map(d => d.rainfall)}
          />
        </motion.section>

        {/* Charts */}
        <motion.section 
          className="charts-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <DataChart
            title="Temperature Trend"
            data={historicalData}
            dataKey="temperature"
            color="#f59e0b"
            unit="°C"
          />
          <DataChart
            title="Humidity Trend"
            data={historicalData}
            dataKey="humidity"
            color="#06b6d4"
            unit="%"
          />
        </motion.section>

        {/* Alerts */}
        <AnimatePresence>
          {alerts.length > 0 && (
            <motion.section 
              className="alerts-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="section-title">⚠️ Active Alerts</h2>
              <div className="alerts-grid">
                {alerts.map(alert => (
                  <WeatherAlert key={alert.id} alert={alert} />
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Rain Status Large Display */}
        <motion.section 
          className="rain-status-large"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div 
            className={`rain-indicator ${sensorData.isRaining ? 'raining' : 'no-rain'}`}
            animate={{
              boxShadow: sensorData.isRaining
                ? ['0 0 20px rgba(139, 92, 246, 0.5)', '0 0 40px rgba(139, 92, 246, 0.8)', '0 0 20px rgba(139, 92, 246, 0.5)']
                : '0 0 20px rgba(100, 116, 139, 0.2)'
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <h2>{sensorData.isRaining ? '🌧️ RAINING' : '☀️ NO RAIN'}</h2>
            <p className="rain-amount">{sensorData.rainfall} mm</p>
            <p className="reading-count">Total Readings: {stats.totalReadings}</p>
          </motion.div>
        </motion.section>
      </main>
    </div>
  );
}

export default App;
