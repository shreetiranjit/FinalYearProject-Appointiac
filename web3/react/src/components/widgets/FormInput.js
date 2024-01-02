import React from 'react';

const FormInput = ({ id, type, value, placeholder, onChange, error, disabled = false }) => {
  return (
    <div className="my-2">
      <label htmlFor={id} className="text-sm text-gray-600">{placeholder}</label>
      <div className="mt-1">
        <input
          id={id}
          name={id}
          type={type}
          required
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
          placeholder={placeholder}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    </div>
  );
};

export default FormInput;
