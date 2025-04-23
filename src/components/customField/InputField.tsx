import React, { useState } from 'react';
import './InputField.scss';
import eyeCloseIcon from '../../asserts/Sharp.svg';
import eyeOpenIcon from '../../asserts/eye.svg';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean; // Add error prop
}

const InputField: React.FC<InputFieldProps> = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = props.name === 'password' 
    ? (showPassword ? 'text' : 'password') 
    : props.type;

  return (
    <div className="input-container">
      <input
        {...props}
        className={`${props.className} ${props.error ? 'error' : ''}`} // Add error class if error prop is true
        type={inputType}
      />
      {props.name === 'password' && (
        <button
          type="button"
          className="password-toggle"
          onClick={togglePasswordVisibility}
        >
          <img
            src={showPassword ? eyeCloseIcon : eyeOpenIcon}
            width={20}
            height={20}
          />
        </button>
      )}
    </div>
  );
};

export default InputField;
