import { useState } from "react";
import { useDispatch } from "react-redux";
import { friendActions } from "../../redux";
import { useModal } from "../../context/Modal";
import "./RemoveFriendRequest.css";

const RemoveFriendRequestModal = ({ request }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [error, setError] = useState("");

  const handleRemoval = async () => {
    setError("");

    const requestId = request.id;
    if (!requestId) {
      setError("Invalid request data.");
      return;
    }

    try {
      await dispatch(friendActions.rejectFriendRequest(requestId));
      closeModal();
    } catch (e) {
      setError("Failed to remove friend request. Please try again.");
    }
  };

  return (
    <div className="remove-friend-modal">
      <h3>Remove Friend Request</h3>
      {error && <p className="error">{error}</p>}
      <p>Are you sure you want to remove this friend request?</p>
      <p className="friend-name">{request.firstName}</p>
      <div className="modal-footer">
        <button onClick={handleRemoval} className="remove-button">
          Remove
        </button>
        <button onClick={closeModal} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default RemoveFriendRequestModal;