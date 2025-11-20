import React from 'react';
import { motion } from 'framer-motion';
import './WeatherAlert.css';

const WeatherAlert = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="alerts-container">
      {alerts.map((alert, index) => (
        <motion.div
          key={index}
          className={`alert-card ${alert.severity}`}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div className="alert-icon">{alert.icon}</div>
          <div className="alert-content">
            <h4 className="alert-title">{alert.title}</h4>
            <p className="alert-message">{alert.message}</p>
            <span className="alert-time">{alert.time}</span>
          </div>
          <div className="alert-badge">{alert.severity.toUpperCase()}</div>
        </motion.div>
      ))}
    </div>
  );
};

export default WeatherAlert;
