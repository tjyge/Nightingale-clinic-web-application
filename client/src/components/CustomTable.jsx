import React from 'react';
import PropTypes from 'prop-types';
import './CustomTable.css';
import editIcon from '../assets/edit.svg';

/**
 * CustomTable - A reusable table component with customizable columns and actions
 * @param {Object} props - Component props
 * @param {Array} props.columns - Array of column objects with keys: id, label
 * @param {Array} props.data - Array of data objects to display in table rows
 * @param {Function} props.onEdit - Function to call when edit button is clicked
 * @param {boolean} props.showActions - Whether to show the actions column (default: true)
 * @returns {JSX.Element} Table component
 */
const CustomTable = ({ columns, data, onEdit, showActions = true }) => {
  return (
    <table className="custom-table">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.id}>{column.label}</th>
          ))}
          {showActions && <th className="actions-column">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index} data-testid="service-row">
            {columns.map((column) => (
              <td key={`${index}-${column.id}`}>{item[column.id]}</td>
            ))}
            {showActions && (
              <td className="actions-cell">
                <button onClick={() => onEdit(item)} className="icon-button">
                  <img src={editIcon} alt="Edit" className="edit-icon" />
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

CustomTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  onEdit: PropTypes.func,
  showActions: PropTypes.bool
};

export default CustomTable;
