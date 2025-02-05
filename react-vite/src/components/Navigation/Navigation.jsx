import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
// import FriendsList from "./FriendsList";
import { useSelector } from "react-redux";
import LoginFormModal from "../LoginFormModal";
import "./Navigation.css";
import OpenModalMenuItem from "./OpenModalMenuItem";
// import OpenModalButton from "../OpenModalButton/OpenModalButton";

function Navigation() {

  const sessionUser = useSelector(state => state.session.user)

  return (
    <>
        <div>
          <li>
            <NavLink to="/">Cash with Friends</NavLink>
          </li>
        </div>
    { sessionUser ? ( 
      <ul>
        <button>Logout</button>
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
          <button>Demo</button>
        </div>
      )
    }
    </>
  );
}

export default Navigation;
