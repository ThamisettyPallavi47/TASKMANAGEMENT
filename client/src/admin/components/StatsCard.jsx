import React from "react";
import "./StatsCard.css";

const StatsCard = ({ icon: Icon, title, value, trend, trendLabel, iconColor, iconBg }) => {
    return (
        <div className="stats-card">
            <div className="stats-icon-container" style={{ backgroundColor: iconBg, color: iconColor }}>
                <Icon size={24} />
            </div>
            <div className="stats-content">
                <div className="stats-header">
                    <h3 className="stats-value">{value}</h3>
                    {trend && <span className="stats-trend positive">{trend}</span>}
                    {trendLabel && <span className="stats-label">{trendLabel}</span>}
                </div>
                <p className="stats-title">{title}</p>
            </div>
        </div>
    );
};

export default StatsCard;
