// react-vite/src/components/Friends/FriendsPage.jsx
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { friendActions } from "../../redux";
import "./Friends.css";

function FriendsPage() {
  const dispatch = useDispatch();
  const friends = useSelector((state) => state.friends.allFriends);

  useEffect(() => {
    dispatch(friendActions.getFriends());
  }, [dispatch]);

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