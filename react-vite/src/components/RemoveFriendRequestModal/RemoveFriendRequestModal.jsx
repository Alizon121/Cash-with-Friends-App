import { useState } from "react";
import { useDispatch } from "react-redux";
import { friendActions } from "../../redux";

const RemoveFriendRequestModal = ({ request, closeModal }) => {
    const dispatch = useDispatch();
    const [error, setError] = useState("");

    const handleRemoval = async () => {
        setError("");

        const requestId = request.id || request.friendRequestId;
        if (!requestId) {
            setError("Invalid request data.");
            return;
        }

        const errors = await dispatch(friendActions.removeRequest(requestId));

        if (errors) {
            setError(errors.server || "Failed to remove friend request.");
        } else {
            closeModal();
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h3>Remove Friend Request</h3>
                {error && <p className="error">{error}</p>}
                <p>Are you sure you want to remove friend request?</p>
                <p>{request.firstName}</p>
                <button onClick={handleRemoval} className="remove-button">Remove</button>
                <button onClick={closeModal} className="close-button">Close</button>
            </div>
        </div>
    );
};

export default RemoveFriendRequestModal;