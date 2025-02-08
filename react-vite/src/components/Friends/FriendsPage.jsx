// react-vite/src/components/Friends/FriendsPage.jsx
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { friendActions } from "../../redux";
import "./Friends.css";

function FriendsPage() {
  const dispatch = useDispatch();
  const friendsById = useSelector((state) => state.friends.friends);
  const pendingRequestsById = useSelector((state) => state.friends.pendingRequests);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const friends = Object.values(friendsById);
  const pendingRequests = Object.values(pendingRequestsById);

  return (
    <div className="friends-container">
      <h1>My Friends</h1>
      {loading && <p>Loading friends and requests...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <>
          <div className="friends-section">
            <h2>Friends List</h2>
            {friends.length === 0 && <p>You have no friends yet. Start adding some!</p>}
            {friends.map((friend) => (
              <div key={friend.id} className="friend-card">
                <p>
                  👤 <strong>{friend.firstName}</strong> ({friend.username})
                </p>
              </div>
            ))}
          </div>

          <div className="pending-requests-section">
            <h2>Pending Friend Requests</h2>
            {pendingRequests.length === 0 && <p>No pending friend requests.</p>}
            {pendingRequests.map((request) => (
              <div key={request.id} className="friend-card">
                <p>
                  ✉️ <strong>{request.firstName}</strong> ({request.username})
                </p>
                <button
                  onClick={() => dispatch(friendActions.acceptFriendRequest(request.id))}
                  className="accept-button"
                >
                  Accept
                </button>
                <button
                  onClick={() => dispatch(friendActions.rejectFriendRequest(request.id))}
                  className="reject-button"
                >
                  Reject
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default FriendsPage;