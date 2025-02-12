import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      navigate("/users/dashboard")
      closeModal();
    }
  };

  return (
    <div className="login_form">
      <div id="login_header">
        <h2>Log In</h2>
      </div>
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
          {errors.email && <p>{errors.email}</p>}
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
