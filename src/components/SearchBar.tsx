import React, { useState } from 'react';
import Select, { type MultiValue } from 'react-select';

// Options array with labels and tags
const options = [
  { value: '1', label: 'John Doe', tags: ['developer', 'react'] },
  { value: '2', label: 'Jane Smith', tags: ['designer', 'tailwind'] },
  { value: '3', label: 'Mike Johnson', tags: ['manager', 'node'] },
];

// Custom filter function to search by label or tags
const filterOption = (option: any, inputValue: string) => {
  const input = inputValue.toLowerCase();
  return (
    option.label.toLowerCase().includes(input) || // Search by label
    option.data.tags.some((tag: string) => tag.toLowerCase().includes(input)) // Search by tags
  );
};

const SearchByTagsComponent = () => {
  // State to store selected options
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

  // Handle the change in the select component
  const handleChange = (newValue: MultiValue<any>) => {
    // Cast the MultiValue (readonly) to a mutable array (any[])
    setSelectedOptions([...newValue]);
  };

  return (
    <Select
      isMulti
      options={options}
      value={selectedOptions}
      onChange={handleChange} // Use the custom handler here
      filterOption={filterOption} // Use the custom filter function here
      isSearchable
    />
  );
};

export default SearchByTagsComponent;
