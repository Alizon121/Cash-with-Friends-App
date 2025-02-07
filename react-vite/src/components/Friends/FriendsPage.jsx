// react-vite/src/components/Friends/FriendsPage.jsx
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { friendActions } from "../../redux";
import UserProfilePage from "../UserProfile/UserProfilePage";
import "./Friends.css";


function FriendsPage() {
  const dispatch = useDispatch();
  const friends = useSelector((state) => state.friends.allFriends);

  useEffect(() => {
    dispatch(friendActions.getFriends());
  }, [dispatch]);

  return (
    <div>
      {Object.values(friends).map((friend) => (
        <UserProfilePage key={friend.id} friend={friend} />
      ))}
    </div>
  );
}

export default FriendsPage;
