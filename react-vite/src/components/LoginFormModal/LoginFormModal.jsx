import { useState, useEffect, useInsertionEffect } from "react";
import { thunkLogin } from "../../redux/session";
import { useSelector, useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../../redux/users";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const users = useSelector(state => state.users.users)
  const { closeModal } = useModal();
  const navigate = useNavigate()

  const emails = Object.values(users).map(user => user.email)

  useEffect(() => {
    dispatch(getUsers()) 
  }, [dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add validations to login
    const newErrors = {}
    if (!emails.includes(email)) newErrors.email = "Invalid email"

    if (Object.values(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try{ 
      const response = await dispatch(thunkLogin({
        email,
        password,
      })
    );
    if (response) {
      navigate("/users/dashboard")
      closeModal();
    }
  } catch (error) {
    if (error instanceof Error) {
      setErrors({general: error.message});
    } else {
      setErrors({general: "Error: Invalid credentials"})
    }
  }
    
  };

  return (
    <div className="login_form">
      <div id="login_header">
        <h2>Log In</h2>
      </div>
      {errors.general && <p className="error">{errors.general}</p>}
      <p id="sub_header_login">Sign in or create a new account</p>
      <form className="login_form_container" onSubmit={handleSubmit}>
          <label>
            <input
              id="login_email_input"
              type="text"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          {errors.email && <p className="error">{errors.email}</p>}
          <label>
            <input
            id="login_password_input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {errors.password && <p>{errors.password}</p>}
        <div className="login_form_button">
          <button type="submit">Log In</button>
        </div>
        <a id="login_create_new_account" onClick={closeModal}>Create New Account</a>
      </form>
    </div>
  );
}

export default LoginFormModal;
