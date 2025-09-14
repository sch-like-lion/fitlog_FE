export default function Input({ 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  required = false,
  disabled = false,
  className = "",
  ...props 
}) {
  return (
    <input 
      className={`
        p-4
        border
        border-gray-300
        rounded-lg
        focus:outline-none focus:ring-2 focus:ring-blue-500
        disabled:bg-gray-100 disabled:cursor-not-allowed
        ${className ? ` ${className}` : ''}
      `}
      type={type} 
      placeholder={placeholder} 
      value={value} 
      onChange={onChange} 
      required={required}
      disabled={disabled}
      {...props}
    />
  );
}