import styles from "./FriendsList.module.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFriends } from "../../redux/friends";
import { FaUserCircle} from "react-icons/fa";

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
    <div className={styles.friendsListContainer}>
      <div className={styles.friendsHeader}>
        <h3>FRIENDS</h3>
        <p>|</p>
        <button className={styles.addFriendButton}>
          +<FaUserCircle />
        </button>
      </div>
      <ul className={styles.friendsList}>
        {friends.map((friend) => (
          <li key={friend.id} className={styles.friendItem}>
            <FaUserCircle className={styles.profileIcon} />
            <span className={styles.friendName}>{friend.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendsList;
