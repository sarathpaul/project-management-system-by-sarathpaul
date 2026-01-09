import React, { useState } from 'react';

// Define the shape of a single option
interface Option {
  id: string;
  name: string;
  email: string;
  initials: string;
}

// Define the Props the component will accept
interface MultiSelectProps {
  options: Option[];
  label: string;
  selectedValues: string[];
  onChange: (selected: string[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ options, label, selectedValues, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (val: string) => {
    const newSelection = selectedValues.includes(val)
      ? selectedValues.filter((item) => item !== val) // Remove if exists
      : [...selectedValues, val]; // Add if not exists
    
    onChange(newSelection); // Send the update back to the parent
  };

  return (
    <div className='w-full relative'>
      <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>{label}</label>
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          cursor: 'pointer',
          background: '#fff',
          display: 'flex',
          justifyContent: 'space-between'
        }}
        className='rounded-sm'
      >
        {selectedValues.length > 0 ? `${selectedValues.length} Selected` : "Select..."}
        <span>{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          width: '100%',
          border: '1px solid #ccc',
          background: '#fff',
          zIndex: 10,
          maxHeight: '150px',
          overflowY: 'auto'
        }}>
          {options.map((opt) => (
            <div 
              key={opt.id}
              onClick={() => toggleOption(opt.id)}
              style={{ padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <input 
                type="checkbox" 
                checked={selectedValues.includes(opt.id)} 
                readOnly 
              />
              <span style={{ marginLeft: '8px' }}>{opt.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;