import styles from "./AddFriendModal.module.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFriendByUsername, getPendingRequests, getSentRequests } from "../../redux/friends";
import { useModal } from "../../context/Modal";

const AddFriendModal = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const { closeModal } = useModal();

  const friends = useSelector((state) => state.friends.friends);
  const pendingRequests = useSelector((state) => state.friends.pendingRequests);
  const sentRequests = useSelector((state) => state.friends.sentRequests);

  useEffect(() => {
    dispatch(getPendingRequests());
    dispatch(getSentRequests());
  }, [dispatch]);

  const userFriendsUsernames = Object.values(friends).map((user) => user.username);
  const pendingRequestUsernames = Object.values(pendingRequests).map((request) => request.username);
  const sentRequestUsernames = Object.values(sentRequests).map((request) => request.username);

  const handleAddFriend = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required.";
    }

    if (userFriendsUsernames.includes(username)) {
      newErrors.username = "Don't be needy, User is already your friend.";
    }

    if (pendingRequestUsernames.includes(username)) {
      newErrors.username = "Check your pending requests.";
    }

    if (sentRequestUsernames.includes(username)) {
      newErrors.username = "You already sent a request to this user.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await dispatch(addFriendByUsername({ username, nickname }));
      setSuccessMessage("Friend request sent successfully!");
      setUsername("");
      setNickname("");
    } catch (err) {
      setErrors({ username: err.message || "Failed to send friend request." });
    }
  };

  return (
    <div className={styles.addFriendModal}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <h2>Add a Friend</h2>
        </div>
        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
        {/* <label className={styles.addFriendLabel} htmlFor="username">Username:</label> */}
        <div className={styles.formGroup}>
          <input
            class={styles.addFriendInputs}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Add username"
          />
          {errors.username && <p className={styles.error}>{errors.username}</p>}
        </div>
        {/* <label className={styles.addFriendLabel} htmlFor="nickname">Nickname (optional):</label> */}
        <div className={styles.formGroup}>
          <input
            class={styles.addFriendInputs}
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Add nickname (optional)"
          />
        </div>
        <div className={styles.buttonGroup}>
          <button onClick={handleAddFriend} className={styles.addButton}>
            Add
          </button>
          <button onClick={closeModal} className={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFriendModal;
