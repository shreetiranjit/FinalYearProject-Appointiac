import React from "react";

const RadioButtonGroup = ({ label, options, value, onChange, name }) => {
  return (
    <div>
      <label>{label}</label>
      <div className="flex space-x-4 mt-5">
        {options.map((option, index) => (
          <div key={index}>
            <input
              type="radio"
              id={option}
              name={name}
              value={option}
              checked={value === option}
              onChange={onChange}
            />
            <label htmlFor={option}>{option}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadioButtonGroup;
