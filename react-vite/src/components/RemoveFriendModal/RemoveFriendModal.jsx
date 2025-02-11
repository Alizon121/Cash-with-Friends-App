import { useState } from "react";
import { useDispatch } from "react-redux";
import { friendActions } from "../../redux";
import { useModal } from "../../context/Modal";

const RemoveFriendModal = ({ friend }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [error, setError] = useState("");

  const handleRemoval = async () => {
    setError("");

    const friendId = friend.id; // Ensure the correct ID is used
    if (!friendId) {
      setError("Invalid friend data.");
      return;
    }

    try {
      // Dispatch the action to delete the friend
      await dispatch(friendActions.deleteFriend(friendId));
      closeModal(); // Close the modal on success
    } catch (e) {
      setError("Failed to remove friend. Please try again.");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Remove Friend</h3>
        {error && <p className="error">{error}</p>}
        <p>Are you sure you want to remove <strong>{friend.firstName}</strong> ({friend.username}) from your friends list?</p>
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

export default RemoveFriendModal;
