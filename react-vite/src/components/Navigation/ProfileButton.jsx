import styles from "./ProfileButton.module.css";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import { thunkLogout } from "../../redux/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { useNavigate } from "react-router-dom";

function ProfileButton() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();
  const navigate = useNavigate();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevents menu from closing when clicking inside it
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = async (e) => {
    e.preventDefault();
    await dispatch(thunkLogout());
    navigate("/");
    closeMenu();
  };

  return (
    <div className={styles.profileButtonContainer}>
      <button onClick={toggleMenu} className={styles.profileIcon}>
        <FaUserCircle size={24} />
      </button>
      {showMenu && (
        <ul className={styles.profileDropdown} ref={ulRef}>
          {user ? (
            <>
              <li className={styles.userInfo}>{user.username}</li>
              <li className={styles.userInfo}>{user.email}</li>
              <li>
                <button onClick={() => navigate("/users/profile")}>Profile</button>
              </li>
              <li>
                <button onClick={() => navigate("/users/dashboard")}>Dashboard</button>
              </li>
              <li>
                <button onClick={() => navigate("/comments")}>User Comments</button>
              </li>
              <li>
                <button onClick={() => navigate("/friends")}>Friends</button>
              </li>
              <li>
                <button onClick={logout} className={styles.logoutButton}>Log Out</button>
              </li>
            </>
          ) : (
            <>
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </>
          )}
        </ul>
      )}
    </div>
  );
}

export default ProfileButton;
