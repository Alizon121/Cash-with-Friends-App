import { useState } from "react";
import { useDispatch } from "react-redux";
import { friendActions } from "../../redux";

const AddFriendModal = ({ closeModal }) => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    try {
      // Dispatch a Redux action or make an API call to search users
      const response = await dispatch(friendActions.searchUsers(searchQuery));
      setResults(response); // Populate the results
    } catch (err) {
      setError("Failed to fetch users. Please try again.");
    }
  };

  const handleSendRequest = async (userId) => {
    setError("");
    try {
      // Dispatch a Redux action to send a friend request
      await dispatch(friendActions.sendFriendRequest(userId));
      alert("Friend request sent!");
      setResults(results.filter((user) => user.id !== userId)); // Remove user from results after sending request
    } catch (err) {
      setError("Failed to send friend request. Please try again.");
    }
  };

  return (
    <div className="add-friend-modal">
      <div className="modal-content">
        <h2>Add a Friend</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          placeholder="Search by username or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
        <div className="search-results">
          {results.length === 0 && <p>No users found.</p>}
          {results.map((user) => (
            <div key={user.id} className="user-card">
              <p>
                👤 <strong>{user.firstName}</strong> ({user.username})
              </p>
              <button
                onClick={() => handleSendRequest(user.id)}
                className="add-friend-button"
              >
                Add Friend
              </button>
            </div>
          ))}
        </div>
        <button onClick={closeModal} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default AddFriendModal;