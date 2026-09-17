import React from "react";

const Input = ({
  label,
  name,
  type = "text",
  placeholder,
  borderColor = "#ccc",
  onChange,
  value,
  disabled = false,
  error,
}) => {
  return (
    <div className="mb-4 w-full">
      
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      {/* Input */}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-2 rounded-md focus:outline-none transition ${
          disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"
        }`}
        style={{
          border: `1px solid ${error ? "red" : borderColor}`,
        }}
      />

      {/* Error message */}
      {error && (
        <p className="text-red-500 text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;