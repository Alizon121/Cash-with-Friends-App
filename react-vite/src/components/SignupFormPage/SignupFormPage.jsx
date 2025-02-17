import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css" 

function SignupFormPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Navigate to="/users/dashboard" replace={true} />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({})

    const newErrors = {}

    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords must match"
    if (username.length < 4) newErrors.username = "Username must be at least 4 characters."
    if (password.length < 6) newErrors.password = "Password must be greater than 6 characters."

    if (Object.values(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const response = await dispatch(
      thunkSignup({
        first_name: firstName,
        last_name: lastName,
        email,
        username,
        password,
        confirm_password: confirmPassword
      })
    );

    if (response?.errors) {
      const apiErrors = response.errors.errors
      const updatedErrors = {}
      if (apiErrors.email) {
        updatedErrors.email =apiErrors.email
      }
      if (response.errors.errors.username) {
        updatedErrors.username = apiErrors.username
      }
      setErrors(updatedErrors)
    } else {
      navigate("/users/dashboard")
    }
  };

  return (
    <>
      <h1>Split the Bill. Make Life Easier.</h1>
      {errors.server && <p>{errors.server}</p>}
        <form className="signup_form_container" onSubmit={handleSubmit}>
          <label className="signup_first_name_label">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </label>
            <label>
              <input
                type="text"
                value={lastName}
                placeholder="Last Name"
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </label>
            <label>
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            {errors.email && <p>{errors.email}</p>}
            <label>
              <input
                type="text"
                value={username}
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
            {errors.username && <p>{errors.username}</p>}
            <label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {errors.password && <p>{errors.password}</p>}
            <label>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </label>
            {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        <button id="signup_form_button" type="submit">Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormPage;
