import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle } from 'react-icons/fa';
import { thunkLogout } from "../../redux/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { NavLink, useNavigate } from "react-router-dom";

function ProfileButton() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();
  const navigate = useNavigate()

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
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

  const navigateToComments = (e) => {
    e.preventDefault();
    navigate("/comments")
    closeMenu()
  }

  const navigateToDashboard = (e) => {
    e.preventDefault();
    navigate('/users/dashboard')
  }

  const navigateToProfile = (e) => {
    e.preventDefault();
    navigate('/users/profile')
  }

  const navigateToFriends = (e) => {
    e.preventDefault();
    navigate('/friends')
  }

  return (
    <>
      <button onClick={toggleMenu}>
        <FaUserCircle />
      </button>
      {showMenu && (
        <ul className={"profile-dropdown"} ref={ulRef}>
          {user ? (
            <>
            {/* Should we add links to different pages here? */}
              <li>{user.username}</li>
              <li>{user.email}</li>
              <li>
                <button onClick={navigateToProfile}>Profile</button>
              </li>
              <li>
                <button onClick={navigateToDashboard}>Dashboard</button>
              </li>
              <li><button onClick={navigateToComments}>User Comments</button></li>
              <li>
                <button onClick={navigateToFriends}>Friends</button>
              </li>
              <li>
                {/* Should we remove this? */}
                <button onClick={logout}>Log Out</button>
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
    </>
  );
}

export default ProfileButton;
