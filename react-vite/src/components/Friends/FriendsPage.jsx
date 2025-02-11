import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { friendActions } from "../../redux";
import "./Friends.css";
import RemoveFriendRequestModal from "../RemoveFriendRequestModal/RemoveFriendRequestModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";



function FriendsPage() {
  const dispatch = useDispatch();
  const friendsById = useSelector((state) => state.friends.friends);
  const pendingRequestsById = useSelector((state) => state.friends.pendingRequests);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const fetchFriendsAndRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        await dispatch(friendActions.getFriends());
        await dispatch(friendActions.getPendingRequests());
      } catch (err) {
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFriendsAndRequests();
  }, [dispatch]);

  const friends = useMemo(() => Object.values(friendsById), [friendsById]);
  const pendingRequests = useMemo(() => Object.values(pendingRequestsById), [pendingRequestsById]);

  const handleDeleteFriend = async (friendId) => {
    try {
      await dispatch(friendActions.deleteFriend(friendId));
    } catch (err) {
      setError("Failed to delete friend. Please try again.");
    }
  };

  const openModal = (request) => {
    setSelectedRequest(request);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setModalOpen(false);
  };

  return (
    <div className="friends-container">
      <h1>Friends</h1>
      {loading && <p>Loading friends and requests...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <>
          <div className="friends-section">
            <h2>Friends</h2>
            {friends.length === 0 && <p>You have no friends yet. Start adding some!</p>}
            {friends.map((friend) => (
              <div key={friend.id} className="friend-card">
                <p>
                  👤 <strong>{friend.firstName}</strong> ({friend.username})
                </p>
                <button
                  onClick={() => handleDeleteFriend(friend.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <div className="pending-requests-section">
            <h2>Incoming Requests</h2>
            {pendingRequests.length === 0 && <p>No pending friend requests.</p>}
            {pendingRequests.map((request) => (
              <div key={request.id} className="friend-card">
                <p>
                  👤 <strong>{request.firstName}</strong> ({request.username})
                </p>
                <button
                  onClick={() => dispatch(friendActions.acceptFriendRequest(request.id))}
                  className="accept-button"
                >
                  Add
                </button>
                <button>
                <OpenModalMenuItem
                modalComponent={<RemoveFriendRequestModal request={request} />}
                itemtext="Remove-Friend-request"
                />
                Remove
               </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal Section */}
      {modalOpen && selectedRequest && (
        <RemoveFriendRequestModal
          request={selectedRequest}
          closeModal={closeModal}
        />
      )}
    </div>
  );
}

export default FriendsPage;