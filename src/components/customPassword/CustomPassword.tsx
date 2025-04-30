import { useState } from 'react';
import { useMutation } from '@apollo/client';
import InputField from '../customField/InputField';
import './CustomPassword.scss';
import { CHANGE_PASSWORD_MUTATION } from './customPasswordAPI/CustomPasswordAPI';
interface CustomPasswordProps {
    onClose: () => void;
  }
const CustomPassword = ({onClose}:CustomPasswordProps) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [changePassword, { loading }] = useMutation(CHANGE_PASSWORD_MUTATION);

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (newPassword !== retypePassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const { data } = await changePassword({
        variables: {
          oldPassword,
          newPassword,
        },
      });
      setSuccess(data.changePassword.message);
      setTimeout(onClose,1500);
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    }
  };

  return (
    <div className='changePassword-outer-class'>
      <div className="custom-password-container">
        <div className="custom-password-heading">
          <p className='password-heading'>Reset Password</p>
          <p className='password-sub-heading'>Enter your new password</p>
        </div>
        <div className="custom-password-input-fields">
          <div className="password-input-field-group">
            <label>Old password</label>
            <InputField 
              placeholder='Enter old password' 
              type='password' 
              name='password'
              value={oldPassword}
              onChange={(e: any) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="password-input-field-group">
            <label>New password</label>
            <InputField 
              placeholder='Enter new password' 
              type='password' 
              name='password'
              value={newPassword}
              onChange={(e: any) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="password-input-field-group">
            <label>Retype password</label>
            <InputField 
              placeholder='Enter retype password' 
              type='password' 
              name='password'
              value={retypePassword}
              onChange={(e: any) => setRetypePassword(e.target.value)}
            />
          </div>
        </div>
        {error && <p className='error-message'>{error}</p>}
        {success && <p className='success-message'>{success}</p>}
        <div className="custom-password-btns">
          <button className='cancel' onClick={onClose}>Cancel</button>
          <button className='submit' onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default CustomPassword;
