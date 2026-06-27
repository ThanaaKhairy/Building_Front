import React from 'react';

const Card = ({ children, title, icon, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      {title && (
        <div className="card-title">
          {icon && <span>{icon}</span>}
          {title}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;