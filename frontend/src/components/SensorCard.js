import React from 'react';
import { motion } from 'framer-motion';
import './SensorCard.css';

const SensorCard = ({ title, value, unit, icon, color, delay = 0 }) => {
  return (
    <motion.div 
      className="sensor-card" 
      style={{ '--card-color': color }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ 
        scale: 1.03,
        boxShadow: `0 20px 40px ${color}33`
      }}
    >
      <div className="sensor-card-bg"></div>
      <div className="sensor-icon-wrapper">
        <motion.div 
          className="sensor-icon"
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1
          }}
        >
          {icon}
        </motion.div>
      </div>
      <div className="sensor-content">
        <h3 className="sensor-title">{title}</h3>
        <div className="sensor-value">
          {value !== null && value !== undefined ? (
            <>
              <motion.span 
                className="value-number"
                key={value}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {value}
              </motion.span>
              <span className="value-unit">{unit}</span>
            </>
          ) : (
            <span className="value-loading">--</span>
          )}
        </div>
        <div className="sensor-sparkline">
          <svg width="100%" height="30" viewBox="0 0 100 30">
            <motion.path
              d="M0,15 Q25,10 50,15 T100,15"
              fill="none"
              stroke={color}
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

export default SensorCard;
