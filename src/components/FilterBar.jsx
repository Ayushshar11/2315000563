import React, { useEffect, useState } from 'react';
import { logger } from '../logger';
import { getUniqueTypes } from '../utils';

// FilterBar component for filtering notifications by type
const FilterBar = ({ notifications, selectedType, onTypeChange }) => {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    logger.logComponentMount('FilterBar');

    // Extract unique types from notifications
    const uniqueTypes = getUniqueTypes(notifications);
    setTypes(uniqueTypes);

    return () => {
      logger.logComponentUnmount('FilterBar');
    };
  }, [notifications]);

  const handleTypeChange = (e) => {
    const type = e.target.value;
    logger.logEventHandler('FilterBar', 'Type filter changed', { type });
    logger.logStateChange('FilterBar', { selectedType }, { selectedType: type });
    onTypeChange(type);
  };

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="type-filter">Filter by Type:</label>
        <select id="type-filter" value={selectedType} onChange={handleTypeChange}>
          <option value="all">All Types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
