import styles from "./Navigation.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import ProfileButton from "./ProfileButton"; // Import the ProfileButton component
import { useSelector } from "react-redux";
import LoginFormModal from "../LoginFormModal";
import OpenModalMenuItem from "./OpenModalMenuItem";
import { thunkLogin, thunkLogout } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useState } from "react";

function Navigation() {
  const [errors, setErrors] = useState();
  const sessionUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDemoUser = async () => {
    const demoEmail = "demo@aa.io";
    const demoPassword = "password";

    setErrors({});
    return dispatch(thunkLogin({ email: demoEmail, password: demoPassword }))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
        else setErrors({ general: "The demo login failed. Please try again later" });
      });
  };

  const logout = async (e) => {
    e.preventDefault();
    await dispatch(thunkLogout());
    navigate("/");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <NavLink to="/">Cash with Friends</NavLink>
      </div>
      {sessionUser ? (
        <div className={styles.navRight}>
          <button onClick={logout} className={styles.logoutButton}>Logout</button>
          <div className={styles.profile}>
            <ProfileButton />  {/* Render ProfileButton instead of FaUserCircle */}
            <span>{sessionUser.username}</span>
          </div>
        </div>
      ) : (
        <div className={styles.authButtons}>
          <button className={styles.authButton}>
            <OpenModalMenuItem itemText={"Login"} modalComponent={<LoginFormModal />} />
          </button>
          <button onClick={handleDemoUser} className={styles.demoButton}>Demo</button>
        </div>
      )}
    </nav>
  );
}

export default Navigation;
