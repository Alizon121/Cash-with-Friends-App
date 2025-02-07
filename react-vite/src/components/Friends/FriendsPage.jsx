// react-vite/src/components/Friends/FriendsPage.jsx
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { friendActions } from "../../redux";
import "./Friends.css";

function FriendsPage() {
  const dispatch = useDispatch();
  const friendsById = useSelector((state) => state.friends.friends);

  useEffect(() => {
    dispatch(friendActions.getFriends());
  }, [dispatch]);

  const friends = Object.values(friendsById);

  return (
    <div className="friends-container">
      <h1>My Friends</h1>
      {Object.values(friends).map((friend) => (
        <div key={friend.id} className="friend-card">
          <p>
            👤 <strong>{friend.firstName}</strong> ({friend.username})
          </p>
        </div>
      ))}
    </div>
  );
}

export default FriendsPage;
