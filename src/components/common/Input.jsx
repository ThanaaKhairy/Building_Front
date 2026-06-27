import React from 'react';

const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  success,
  disabled = false,
  className = '',
  children, // ✅ أضف children
  ...props
}) => {
  const statusClass = error ? 'error' : success ? 'success' : '';

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span style={{ color: '#E74C3C', marginRight: '4px' }}>*</span>}
        </label>
      )}
      
      {type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`form-control ${statusClass}`}
          {...props}
        >
          {children} {/* ✅ children بتاعة الـ options */}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`form-control ${statusClass}`}
          {...props}
        />
      )}
      
      {error && <span style={{ color: '#E74C3C', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>{error}</span>}
    </div>
  );
};

export default Input;