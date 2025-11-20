import React from 'react';
import { motion } from 'framer-motion';
import './StatusIndicator.css';

const StatusIndicator = ({ connected, lastUpdate }) => {
  return (
    <motion.div 
      className="status-container"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="status-left">
        <div className="status-indicator">
          <motion.div 
            className={`status-dot ${connected ? 'connected' : 'disconnected'}`}
            animate={connected ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="status-text">
            {connected ? '🟢 Connected' : '🔴 Disconnected'}
          </span>
        </div>
        {connected && (
          <motion.div 
            className="signal-bars"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="signal-bar"></span>
            <span className="signal-bar"></span>
            <span className="signal-bar"></span>
            <span className="signal-bar"></span>
          </motion.div>
        )}
      </div>
      
      {lastUpdate && (
        <motion.div 
          className="last-update"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="update-icon">⏱️</span>
          <span>Last update: {new Date(lastUpdate).toLocaleTimeString()}</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StatusIndicator;
