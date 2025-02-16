import styles from "./FriendsList.module.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFriends } from "../../redux/friends";
import { FaUserCircle } from "react-icons/fa";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import AddFriendModal from "../AddFriendModal/AddFriendModal";

const FriendsList = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const friends = useSelector((state) => Object.values(state.friends.friends || {}));

  useEffect(() => {
    if (sessionUser) {
      dispatch(getFriends());
    }
  }, [dispatch, sessionUser]);

  if (!sessionUser) {
    return <p className={styles.message}>Please log in to see your friends list.</p>;
  }

  // Filter out pending friend requests
  const acceptedFriends = friends.filter(friend => !friend.pending_status);

  if (acceptedFriends.length === 0) {
    return <p className={styles.message}>You have no friends yet. Start adding some!</p>;
  }

  return (
    <div className={styles.friendsListContainer}>
      {/* Header with Title + Add Friend Button */}
      <div className={styles.friendsHeader}>
        <h3>Friends</h3>
        <button className={styles.addFriendButton}>
          <OpenModalMenuItem
            modalComponent={<AddFriendModal />}
            itemText={
              <div className={styles.addFriendContent}>
                <span className={styles.plusSign}>+</span>
                <div className={styles.iconWrapper}>
                  <FaUserCircle className={styles.addFriendIcon} />
                </div>
              </div>
            }
          />
        </button>
      </div>

      {/* Friends List */}
      <ul className={styles.friendsList}>
        {acceptedFriends.map(friend => (
          <li key={`${friend.user_id}-${friend.friend_id}`} className={styles.friendItem}>
            <FaUserCircle className={styles.profileIcon} />
            <span className={styles.friendName}>{friend.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendsList;
