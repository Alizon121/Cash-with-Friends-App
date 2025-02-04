import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import FriendsList from "./FriendsList";

import "./Navigation.css";

function Navigation() {
  return (
    <ul>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>

      <li>
        <ProfileButton />
      </li>

      <li>
        <FriendsList/>
      </li>
    </ul>
  );
}

export default Navigation;
