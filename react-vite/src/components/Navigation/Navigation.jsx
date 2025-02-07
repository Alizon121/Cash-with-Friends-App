import { NavLink, useNavigate } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import { useSelector } from "react-redux";
import LoginFormModal from "../LoginFormModal";
import "./Navigation.css";
import OpenModalMenuItem from "./OpenModalMenuItem";
import { thunkLogin, thunkLogout } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useState } from "react";

function Navigation() {
  const [errors, setErrors] = useState()
  const sessionUser = useSelector(state => state.session.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  console.log("NAVIGATION", sessionUser)

  const handleDemoUser = async () => {
    // e.preventDefault();
    const demoEmail = 'demo@aa.io'
    const demoPassword = 'password'

    setErrors({})
    return dispatch(thunkLogin({ email: demoEmail, password: demoPassword }))
    // .then(closeModal)
    .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) setErrors(data.errors);
            else setErrors({general: "The demo login failed. Please try again later"})
        }
        );
}

const logout = async (e) => {
  e.preventDefault();
  await dispatch(thunkLogout());
  navigate("/")
};

  return (
    <>
        <div>
          <li>
            <NavLink to="/">Cash with Friends</NavLink>
          </li>
        </div>
    { sessionUser ? ( 
      <ul>
        <button onClick={logout}>Logout</button>
        <li>
          <ProfileButton />
        </li>
      </ul>
      ) : (
        <div>
          <button>
            <OpenModalMenuItem
              itemText={"Login"}
              modalComponent={<LoginFormModal/>}
            />
          </button>
          <button onClick={handleDemoUser}>Demo</button>
          
        </div>
      )
    }
    </>
  );
}

export default Navigation;
