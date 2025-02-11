import { useState } from "react";
import { useDispatch } from "react-redux";
import { friendActions } from "../../redux";
import { useModal } from "../../context/Modal";

const RemoveFriendRequestModal = ({ request }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [error, setError] = useState("");

  const handleRemoval = async () => {
    setError("");

    const requestId = request.id; // Ensure the correct ID is used
    if (!requestId) {
      setError("Invalid request data.");
      return;
    }

    try {
      // Dispatch the action to reject the friend request (PUT with `accept: false`)
      await dispatch(friendActions.rejectFriendRequest(requestId));
      closeModal(); // Close the modal on success
    } catch (e) {
      setError("Failed to remove friend request. Please try again.");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Remove Friend Request</h3>
        {error && <p className="error">{error}</p>}
        <p>Are you sure you want to remove this friend request?</p>
        <p>{request.firstName}</p>
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