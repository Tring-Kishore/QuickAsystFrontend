import InputField from "../../components/customField/InputField";
import { useForm } from "react-hook-form";
import SignInLogo from "../../assets/images/Quickasystlogo.svg";
import { signIn } from "@aws-amplify/auth";
import "./SignIn.scss";
import { useNavigate } from "react-router-dom";
const SignIn = () => {
  type FormValue = {
    email: string;
    password: string;
  };

  const inputfields: {
    id: string;
    name: keyof FormValue;
    className: string;
    placeholder: string;
    type: string;
    validation: any;
  }[] = [
    {
      id: "email",
      name: "email",
      className: "email",
      placeholder: "Enter email",
      type: "text",
      validation: {
        required: "Email is required",
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Invalid email",
        },
      },
    },
    {
      id: "password",
      name: "password",
      className: "password",
      placeholder: "Enter password",
      type: "password",
      validation: {
        required: "Password is required",
        minLength: {
          value: 6,
          message: "Password should be minimum 6 characters",
        },
      },
    },
  ];

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValue>();

  const onSubmit = async (data: FormValue) => {
    try {
      console.log('initial step of sign ',data);
      
      const { email, password } = data;
      const user = await signIn({ username: email, password: password });
      console.log("User signed in successfully:", user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error signing in:", error);
      
    }
  };

  return (
    <div className="outer-class-signin">
      <div className="image-div">
        <div className="image-section-signin">
          <div className="textin-image">
            <div className="textin-small-para">
              <p>Quickasyst Admin Dashboard</p>
            </div>
            <div className="textin-big-para">
              <p>Manage your ticketing empire from one central hub</p>
            </div>
          </div>
        </div>
      </div>
      <div className="content">

      <div className="content-signin">
        <div className="signin-logo">
          <img src={SignInLogo} alt="signin logo" />
        </div>
        <div className="signin-content">
          <p className="signin-content-heading">
            Welcome to Quickasyst Portal
          </p>
          <p className="signin-content-para">Login to access admin portal</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {inputfields.map((field) => (
            <div key={field.id} className="form-group">
              <label>{field.name}</label>
              <InputField
                className={field.className}
                placeholder={field.placeholder}
                type={field.type}
                error={!!errors[field.name]}
                {...register(field.name, field.validation)}
              />
              {errors[field.name] && (
                <p className="error-message">{errors[field.name]?.message}</p>
              )}
            </div>
          ))}
          <div className="forget-password">
            <p className="forget-password-text">Forgot Password?</p>
          </div>
          <button type="submit" className="signin-button">
            Sign In
          </button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default SignIn;
