import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { friendActions } from "../../redux";
import "./Friends.css";
import RemoveFriendRequestModal from "../RemoveFriendRequestModal/RemoveFriendRequestModal";
import RemoveFriendModal from "../RemoveFriendModal/RemoveFriendModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";

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

  const friends = useMemo(() => Object.values(friendsById), [friendsById]);
  const pendingRequests = useMemo(() => Object.values(pendingRequestsById), [pendingRequestsById]);

  return (
    <div className="friends-container">
      <h1 id="friends-page-header">Friends</h1>
      {loading && <p>Loading friends and requests...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <>
          {/* Friends Section */}
            <div className="friends-section-headers">
              <h3>Friends</h3>
              <h3>Incoming Requests</h3>
            </div>
          <div className="friends-and-pending-friend-request">
            <div className="friends-section">
              {friends.length === 0 && <p>You have no friends yet. Start adding some!</p>}
              {friends.map((friend) => (
                <div key={friend.id} className="friend-card">
                  <p>
                    👤 <strong>{friend.firstName}</strong> 
                  </p>
                  {/* Delete Button */}
                  <button id="friends-delete-button">
                    <OpenModalMenuItem
                      modalComponent={<RemoveFriendModal friend={friend} />}
                      itemText="Delete"
                    />
                  </button>
                </div>
              ))}
            </div>
            <div id="divider"></div>
            {/* Pending Requests Section */}
            <div className="pending-requests-section">
              {pendingRequests.length === 0 && <p>No pending friend requests.</p>}
              {pendingRequests.map((request) => (
                <div key={request.id} className="pending-friends-card">
                  <p>
                    👤 <strong>{request.firstName}</strong> 
                  </p>
                  <div className="friends-pending-accept-delete-buttons">
                      {/* Add Button */}
                      <button
                        onClick={() => dispatch(friendActions.acceptFriendRequest(request.id))}
                        id="accept-button"
                      >
                        Add
                      </button>
                      {/* Delete Button */}
                      <button id="pending-friends-delete-button">
                        <OpenModalMenuItem
                          modalComponent={<RemoveFriendRequestModal request={request} />}
                          itemText="Delete"
                        />
                      </button>
                  </div>    
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default FriendsPage;