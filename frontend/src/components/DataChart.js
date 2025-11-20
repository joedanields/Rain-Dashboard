import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './DataChart.css';

const DataChart = ({ data, title, dataKey, color, unit }) => {
  // Prepare chart data
  const chartData = data.slice(-20).map((item, index) => ({
    time: new Date(item.timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    }),
    value: item[dataKey],
    index: index
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{payload[0].payload.time}</p>
          <p className="tooltip-value">
            {payload[0].value?.toFixed(1)} {unit}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      className="data-chart-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>
        <div className="chart-live-indicator">
          <span className="live-dot"></span>
          <span className="live-text">LIVE</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="time" 
            stroke="rgba(255,255,255,0.6)"
            style={{ fontSize: '12px' }}
            interval="preserveStartEnd"
            tickMargin={10}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.6)"
            style={{ fontSize: '12px' }}
            tickMargin={10}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color}
            strokeWidth={3}
            fill={`url(#gradient-${dataKey})`}
            animationDuration={300}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default DataChart;
