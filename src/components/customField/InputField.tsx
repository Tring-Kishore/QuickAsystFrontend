import React, { useState } from 'react';
import './InputField.scss';
import eyeCloseIcon from '../../assets/images/eyeclose.svg';
import eyeOpenIcon from '../../assets/images/eye.svg';
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean; 
  containerClassName?: string;
}
const InputField: React.FC<InputFieldProps> = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const { containerClassName} = props;
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  let inputType;
  if(props.name === "password"){
    if(showPassword){
      inputType = 'text'
    }
    else{
      inputType = 'password'
    }
  }
  else{
    inputType = 'text'
  }
  return (
    <div className={`input-container ${containerClassName || ''}`}>
      <input
        {...props}
        className={`${props.className} ${props.error ? 'error' : ''}`}
        type={inputType}
      />
      {props.name === 'password' && (
        <button
          type="button"
          className="password-toggle"
          onClick={togglePasswordVisibility}
        >
          <img className='image-password'
            src={showPassword ? eyeCloseIcon : eyeOpenIcon}
            
          />
        </button>
      )}
    </div>
  );
};
export default InputField;
