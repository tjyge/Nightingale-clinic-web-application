import React from 'react';
import PropTypes from 'prop-types';
import './CustomButton.css';

/**
 * CustomButton - A reusable button component with optional icon
 * @param {Object} props - Component props
 * @param {string} props.text - Button text
 * @param {string} props.iconPath - Path to the icon SVG file (e.g., '/assets/addAccount.svg')
 * @param {function} props.onClick - Click handler function
 * @param {string} [props.variant='white'] - Button color variant ('white', 'black', 'red')
 * @param {string} props.className - Additional CSS class (optional)
 * @returns {JSX.Element} Button component
 */
const CustomButton = ({ text, iconPath, onClick, variant = 'white', className }) => {
  const variantClass = `custom-button-${variant}`; // Generate class based on variant

  return (
    <button
      className={`custom-button ${variantClass} ${className || ''}`} // Add variant class
      onClick={onClick}
    >
      {iconPath && (
        <img
          src={iconPath}
          alt=""
          className="button-icon"
        />
      )}
      <span className="button-text">{text}</span>
    </button>
  );
};

CustomButton.propTypes = {
  text: PropTypes.string.isRequired,
  iconPath: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['white', 'black', 'red']), // Add variant prop type
  className: PropTypes.string
};

export default CustomButton;
