import React, { useState, useEffect } from "react";
import "./Account.scss";
import profilepic from "../../assets/images/profilepic.jpg";
import { GET_USER_PROFILE, EDIT_PROFILE, GET_UPLOAD_SIGNED_URL } from "./accountAPI/AccountAPI";
import { useQuery, useMutation } from "@apollo/client";
import InputField from "../../components/customField/InputField";
import { CircularProgress } from "@mui/material";
import { showErrorToast, showSuccessToast } from "../../components/CustomToast/CustomToast";
import closeIcon from '../../assets/images/closeIcon.svg';
import moment from "moment";
import client from "../../client";

const Account = () => {
  const { data, loading, error, refetch } = useQuery(GET_USER_PROFILE);
  const [editProfile] = useMutation(EDIT_PROFILE);
  const [isEditClick, setIsEditClick] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(profilepic);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    avatarUrl: ""
  });

  useEffect(() => {
    if (data?.get_user_profile?.[0]) {
      const user = data.get_user_profile;
      setFormData({
        firstName: user[0].u_first_name || "",
        lastName: user[0].u_last_name || "",
        phoneNumber: user[0].u_phone_number || "",
        email: user[0].u_email_id || "",
        avatarUrl: user[0].u_avatar_url || ""
      });
      
      const imageKey = user[0].u_avatar_url;
      console.log('the imag url is ',user[0].u_avatar_url);

      if (imageKey) {
        if (imageKey.startsWith('http')) {
          setProfileImageUrl(imageKey);
        } else {
          setProfileImageUrl(`${process.env.REACT_APP_DEV_LINK}${imageKey}`);
          console.log(`${process.env.REACT_APP_DEV_LINK}${imageKey}`);
          
        }
      } else {
        setProfileImageUrl(profilepic);
      }
    }
  }, [data]);
  
  const toggleEdit = () => setIsEditClick(!isEditClick);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUploadtoS3(file, (url) => {
        console.log('the url is ',url);
        
        setProfileImageUrl(url);
        setFormData(prev => ({...prev, avatarUrl: url}));

      });
    }
  };

  const handleUploadtoS3 = async (file: File, setImageURL: (url: string) => void) => {
    try {
      setIsUploading(true);
      const originalName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
      const sanitizedFileName = originalName.replace(/[^a-zA-Z0-9]/g, '-');
      const extension = file.name.substring(file.name.lastIndexOf('.'));
      const newFileName = `images/${moment().unix()}-${sanitizedFileName}${extension}`;
      
      const { data: signedUrlData } = await client.query({  
        query: GET_UPLOAD_SIGNED_URL,
        variables: { 
          key: newFileName,
          bucketName: process.env.REACT_APP_BUCKET_NAME
        },
        fetchPolicy: 'network-only'
      });
      
      const preSignedUrl = signedUrlData?.getUploadSignedUrl?.preSignedUrl;
  
      if (!preSignedUrl) {
        throw new Error("Failed to get presigned URL");
      }
      const uploadRes = await fetch(preSignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type }
      });
  
      if (!uploadRes.ok) {
        throw new Error("Upload to S3 failed");
      }
  
      await editProfile({
        variables: {
          emailId: formData.email,
          input: {
            u_first_name: formData.firstName,
            u_last_name: formData.lastName,
            u_phone_number: formData.phoneNumber,
            u_avatar_url: newFileName
          }
        }
      });
      const uploadedURL = `https://${process.env.REACT_APP_BUCKET_NAME}.s3.amazonaws.com/${newFileName}`;
      setImageURL(uploadedURL);
      setFormData(prev => ({
        ...prev, 
        avatarUrl: newFileName
      }));
      await refetch();
      
      showSuccessToast('Profile image updated successfully!');
    } catch (err) {
      console.error("Image upload failed", err);
      showErrorToast('Image upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      await editProfile({
        variables: {
          emailId: formData.email,
          input: {
            u_first_name: formData.firstName,
            u_last_name: formData.lastName,
            u_phone_number: formData.phoneNumber,
            u_avatar_url: formData.avatarUrl
          }
        }
      });
      await refetch();
      toggleEdit();
      showSuccessToast('Profile updated successfully!');
    } catch (err: any) {
      console.error("Error updating profile:", err);
      if (err.message.includes('user_u_phone_number_key')) {
        showErrorToast('This phone number is already registered to another account');
      } else {
        showErrorToast('Failed to update profile');
      }
    }
  };

  const profileDetails = [
    {
      key: "fullName",
      label: "Full Name",
      value: `${formData.firstName} ${formData.lastName}`,
      editable: true,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const names = e.target.value.split(' ');
        setFormData({
          ...formData,
          firstName: names[0] || "",
          lastName: names.slice(1).join(' ') || ""
        });
      }
    },
    {
      key: "phoneNumber",
      label: "Phone Number",
      value: formData.phoneNumber,
      editable: true,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "phoneNumber")
    },
    { 
      key: "email", 
      label: "Email", 
      value: formData.email, 
      editable: false 
    },
  ];

  if (loading) {
    return <div className="circular-progress"><CircularProgress/></div>
  }
  
  if (error) {
    return <div className="topbar-outer-class">Error loading profile</div>
  }

  return (
    <div className="account-outer-class">
      <div className="account-heading-div">
        <div className="myaccount-heading">
          <p>My Account</p>
        </div>
        <div className="edit-profile-button">
          {!isEditClick && (
            <button className="edit-profile-btn" onClick={toggleEdit}>
              Edit Profile
            </button>
          )}
        </div>
      </div>
      <div className="account-profile-outer">
        <div className={`account-profile ${isEditClick ? "account-profile-edit" : ""}`}>
          <div className="account-profile-divider divider-1">
            <div className="account-profile-img-div">
              {isEditClick ? (
                <div className="profle-edit">
                  <label htmlFor="profile-upload">
                    {isUploading && (
                      <div className="uploading-overlay">
                        <CircularProgress color="inherit" />
                      </div>
                    )}
                    <img src={closeIcon} alt="close Icon" className="closeIcon" />
                    <p>Upload</p>
                    <img src={profileImageUrl} alt="profile" />
                  </label>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    className="image-upload-input"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </div>
              ) : (
                <img src={profileImageUrl} alt="profile" className="profilepc" />
              )}
            </div>
          </div>
          <div className="account-profile-divider divider-2">
            {!isEditClick ? (
              <div className="account-profile-content">
                {profileDetails.map((detail) => (
                  <div key={detail.key} className="account-profile-details">
                    <p className="account-details-key">{detail.label}</p>
                    <p className="account-details-value">{detail.value || "-"}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="account-profile-inputs">
                <div className="profile-inputs">
                  {profileDetails.slice(0, 2).map((detail) => (
                    <div key={detail.key} className="profile-form-group">
                      <label>{detail.label}</label>
                      <InputField
                        className="profile-input"
                        value={detail.value}
                        onChange={detail.onChange}
                        disabled={!detail.editable}
                        containerClassName="profile-input-container"
                      />
                    </div>
                  ))}
                </div>
                <div className="single-input">
                  <div className="single-profile-input">
                    <label>{profileDetails[2].label}</label>
                    <InputField
                      type="text"
                      className="single-input-field"
                      value={profileDetails[2].value}
                      disabled={!profileDetails[2].editable}
                      containerClassName="single-input-container"
                    />
                  </div>
                </div>
                <div className="profile-edit-btns">
                  <button className="edit-profile-cancel" onClick={toggleEdit}>
                    Cancel
                  </button>
                  <button className="edit-profile-save" onClick={handleSave} disabled={isUploading}>
                    {isUploading ? <CircularProgress size={20} /> : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
