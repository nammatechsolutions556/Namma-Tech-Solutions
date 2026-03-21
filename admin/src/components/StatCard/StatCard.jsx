import React from "react";
import "./StatCard.css";

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="stat-card" style={{ borderLeft: `5px solid ${color}` }}>
      <div className="stat-info">
        <h4>{title}</h4>
        <h2>{value}</h2>
      </div>

      <div className="stat-icon" style={{ background: color }}>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;