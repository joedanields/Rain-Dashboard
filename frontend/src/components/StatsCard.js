import React from 'react';
import { motion } from 'framer-motion';
import './StatsCard.css';

const StatsCard = ({ icon, title, value, change, trend, color, delay = 0 }) => {
  const isPositive = trend === 'up';
  
  return (
    <motion.div 
      className="stats-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05, y: -5 }}
    >
      <div className="stats-icon-container" style={{ background: color }}>
        <span className="stats-icon">{icon}</span>
      </div>
      <div className="stats-content">
        <h4 className="stats-title">{title}</h4>
        <div className="stats-value-row">
          <span className="stats-value">{value}</span>
          {change && (
            <span className={`stats-change ${isPositive ? 'positive' : 'negative'}`}>
              {isPositive ? '↑' : '↓'} {Math.abs(change)}%
            </span>
          )}
        </div>
        <div className="stats-progress-bar">
          <motion.div 
            className="stats-progress-fill"
            style={{ background: color }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(Math.abs(change || 50), 100)}%` }}
            transition={{ duration: 1, delay: delay + 0.2 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
