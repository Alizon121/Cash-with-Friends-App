import styles from "./FriendsList.module.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFriends } from "../../redux/friends";
import { FaUserCircle} from "react-icons/fa";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import AddFriendModal from "../AddFriendModal/AddFriendModal";

const FriendsList = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const friends = useSelector((state) => Object.values(state.friends.friends || {}));

  useEffect(() => {
    if (sessionUser) {
      dispatch(getFriends());
    } else {
      console.error("User is not logged in. Cannot fetch friends.");
    }
  }, [dispatch, sessionUser]);

  if (!sessionUser) {
    return <p className={styles.message}>Please log in to see your friends list.</p>;
  }

  if (friends.length === 0) {
    return <p className={styles.message}>You have no friends yet. Start adding some!</p>;
  }

  return (
     <div className="friends-list">
      <h3>Friends</h3>
      {/* + Button Connected to AddFriendModal */}
      <button className={styles.addFriendButton}>
        <OpenModalMenuItem
          modalComponent={<AddFriendModal />}
          itemText="+"
        />
      </button>
      <ul>
        {friends.map((friend) => (
          <li key={friend.id}>
            <p>
              👤 <strong>{friend.username}</strong>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendsList;