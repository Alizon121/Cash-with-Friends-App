import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFriendByUsername, getPendingRequests, getSentRequests } from "../../redux/friends";
import "./AddFriendModal.css";

const AddFriendModal = ({ closeModal }) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Retrieve friends, pending requests, and sent requests from Redux store
  const friends = useSelector((state) => state.friends.friends);
  const pendingRequests = useSelector((state) => state.friends.pendingRequests);
  const sentRequests = useSelector((state) => state.friends.sentRequests);

  // Fetch pending and sent requests when the modal opens
  useEffect(() => {
    dispatch(getPendingRequests());
    dispatch(getSentRequests());
  }, [dispatch]);

  // Map usernames for easier validation
  const userFriendsUsernames = Object.values(friends).map((user) => user.username);
  const pendingRequestUsernames = Object.values(pendingRequests).map((request) => request.username);
  const sentRequestUsernames = Object.values(sentRequests).map((request) => request.username);

  const handleAddFriend = async (e) => {
    e.preventDefault();

    // Reset messages
    setErrors({});
    setSuccessMessage("");

    // Add validations here
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

    // If validation errors exist, stop execution
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Dispatch the API call
    try {
      await dispatch(addFriendByUsername({ username, nickname }));
      setSuccessMessage("Friend request sent successfully!");
      setUsername("");
      setNickname("");
    } catch (err) {
      const errorMessage = err.message || "Failed to send friend request.";
      setErrors({ username: errorMessage });
    }
  };

  return (
    <div className="add-friend-modal">
      <div className="modal-content">
        <h2>Add a Friend</h2>
        {successMessage && <p className="success-message">{successMessage}</p>}
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
          {errors.username && <p className="error">{errors.username}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="nickname">Nickname (optional):</label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Enter nickname"
          />
        </div>
        <div className="button-group">
          <button onClick={handleAddFriend} className="add-button">
            Add
          </button>
          <button onClick={closeModal} className="cancel-button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFriendModal;