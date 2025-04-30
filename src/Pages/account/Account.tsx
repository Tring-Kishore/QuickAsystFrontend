import React, { useState, useEffect } from "react";
import "./Account.scss";
import profilepic from "../../assets/images/profilepic.jpg";
import { GET_USER_PROFILE, EDIT_PROFILE } from "./accountAPI/AccountAPI";
import { useQuery, useMutation } from "@apollo/client";
import InputField from "../../components/customField/InputField";

const Account = () => {
  const { data, loading, error } = useQuery(GET_USER_PROFILE);
  const [editProfile] = useMutation(EDIT_PROFILE);
  const [isEditClick, setIsEditClick] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(profilepic);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    avatarUrl: ""
  });
  useEffect(() => {
    if (data?.get_user_profile?.[0]) {
      const user = data.get_user_profile[0];
      setFormData({
        firstName: user.u_first_name || "",
        lastName: user.u_last_name || "",
        phoneNumber: user.u_phone_number || "",
        email: user.u_email_id || "",
        avatarUrl: user.u_avatar_url || ""
      });
      const imageKey = user.u_avatar_url;
      const devlink = process.env.REACT_APP_DEV_LINK;
      setProfileImageUrl(imageKey ? `${devlink}${imageKey}` : profilepic);
    }
  }, [data]);
  const toggleEdit = () => setIsEditClick(!isEditClick);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
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
      toggleEdit();
    } catch (err : any) {
      console.error("Error updating profile:", err);
      if (err.message.includes('user_u_phone_number_key')) {
        alert('This phone number is already registered to another account');
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

  if (loading){
     return <div className="topbar-outer-class">Loading...</div>
    }
  if (error){
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
              <img src={profileImageUrl} alt="profile" />
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
                  <button className="edit-profile-save" onClick={handleSave}>
                    Save Changes
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
