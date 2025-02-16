import { csrfFetch } from "./csrf";

/******************************* ACTION TYPES *******************************************/

export const LOAD_FRIENDS = "friends/loadFriends";
export const LOAD_PENDING_REQUESTS = "friends/loadPendingRequests";
export const ADD_FRIEND = "friends/addFriend";
export const DELETE_FRIEND = "friends/deleteFriend";
export const REMOVE_FRIEND_REQUEST = "friends/removeFriendRequest";
export const LOAD_SENT_REQUESTS = "friends/loadSentRequests";
export const REMOVE_SENT_REQUEST = "friends/removeSentRequest";
export const CLEAR_FRIENDS_STATE = "friends/clearFriendsState";


/******************************* ACTION CREATORS *******************************************/

export const loadFriends = (friends) => ({
  type: LOAD_FRIENDS,
  payload: friends,
});

export const addFriend = (friend) => ({
  type: ADD_FRIEND,
  payload: friend,
});


export const loadPendingRequests = (pendingRequests) => ({
  type: LOAD_PENDING_REQUESTS,
  payload: pendingRequests,
});

export const removeFriend = (friendId) => ({
  type: DELETE_FRIEND,
  payload: friendId,
});

export const deleteRequest = (friendId) => ({
  type: REMOVE_FRIEND_REQUEST,
  payload: friendId,
});

export const loadSentRequests = (sentRequests) => ({
  type: LOAD_SENT_REQUESTS,
  payload: sentRequests,
});

export const removeSentRequest = (friendId) => ({
  type: REMOVE_SENT_REQUEST,
  payload: friendId,
});

export const clearFriendsState = () => ({
  type: CLEAR_FRIENDS_STATE,
});



/******************************* THUNK ACTIONS *******************************************/

// Get friends for a user
export const getFriends = () => async (dispatch) => {
  try {
      const res = await csrfFetch("/api/friends/");
      const data = await res.json();
      dispatch(loadFriends(data.friends));
  } catch (error) {
      console.error("Error loading friends:", error);
  }
};

export const thunkFetchFriends = () => async (dispatch) => {
  const response = await fetch("/api/friends/", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
  });
  if (response.ok) {
      const data = await response.json();
      dispatch(loadFriends(data.friends));
  } else {
      console.error("Failed to fetch friends");
  }
};

// Add a friend to a User
export const createFriend = (userId, friendData) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/friends/`, {
      method: "POST",
      body: JSON.stringify(friendData),
    });
    if (!res.ok) throw Error("Failed to create friend");
    const friend = await res.json();
    dispatch(addFriend(friend));
    return friend;
  } catch (e) {
    console.error("Error creating friend", e);
    throw e;
  }
};

// Delete a friend
export const deleteFriend = (friendId, userId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/friends/${friendId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw Error("Failed to delete friend");
    dispatch(removeFriend(friendId, userId));
  } catch (e) {
    console.error("Error deleting friend", e);
    throw e;
  }
};

// Delete a Friend Request
export const removeRequest = (friendId, userId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/users/${userId}/friends/${friendId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw Error("Failed to delete friend request");
    dispatch(deleteRequest(friendId, userId));
  } catch (e) {
    console.error("Error deleting friend request", e);
    throw e;
  }
};

export const getPendingRequests = () => async (dispatch) => {
  try {
    const res = await csrfFetch("/api/friends/requests/");
    const data = await res.json();
    dispatch(loadPendingRequests(data.PendingRequests));
  } catch (error) {
    console.error("Error loading pending requests:", error);
  }
};

// Accept a friend request
export const acceptFriendRequest = (friendId) => async (dispatch) => {
  try {
    await csrfFetch("/api/friends/", {
      method: "PUT",
      body: JSON.stringify({ friend_id: friendId, accept: true }),
    });
    dispatch(getFriends());
    dispatch(getPendingRequests());
  } catch (error) {
    console.error("Error accepting friend request:", error);
  }
};

// Reject a friend request
export const rejectFriendRequest = (friendId) => async (dispatch) => {
  try {
    await csrfFetch("/api/friends/", {
      method: "PUT",
      body: JSON.stringify({ friend_id: friendId, accept: false }),
    });
    dispatch(getPendingRequests());
  } catch (error) {
    console.error("Error rejecting friend request:", error);
  }
};

export const addFriendByUsername = (friendData) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/friends/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(friendData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to send friend request");
    }

    const data = await response.json();
    dispatch(addFriend(data));
    return data;
  } catch (error) {
    console.error("Error sending friend request:", error.message);
    throw error;
  }
};


// Fetch Sent Friend Requests
export const getSentRequests = () => async (dispatch) => {
  try {
    const res = await csrfFetch("/api/friends/sent/");
    if (res.ok) {
      const data = await res.json();
      dispatch(loadSentRequests(data.SentRequests));
    }
  } catch (error) {
    console.error("Error fetching sent requests:", error);
  }
};

// Cancel Sent Friend Request
export const cancelSentRequest = (friendId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/friends/sent/${friendId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      dispatch(removeSentRequest(friendId));
    }
  } catch (error) {
    console.error("Error canceling sent request:", error);
  }
};


/******************************* INITIAL STATE AND REDUCER *******************************************/

const initialState = {
  friends: {},
  pendingRequests: {},
  sentRequests: {}, 
};

const friendsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_FRIENDS: {
      const friendsById = action.payload.reduce((acc, friend) => {
        acc[friend.id] = friend;
        return acc;
      }, {});
      return {
        ...state,
        friends: friendsById,
      };
    }
    case LOAD_PENDING_REQUESTS: {
      const pendingById = action.payload.reduce((acc, request) => {
        acc[request.id] = request;
        return acc;
      }, {});
      return {
        ...state,
        pendingRequests: pendingById,
      };
    }
    case LOAD_SENT_REQUESTS: {
      const sentById = action.payload.reduce((acc, request) => {
        acc[request.id] = request;
        return acc;
      }, {});
      return {
        ...state,
        sentRequests: sentById,
      };
    }
    case ADD_FRIEND: {
      return {
        ...state,
        friends: {
          ...state.friends,
          [action.payload.id]: action.payload,
        },
      };
    }
    case DELETE_FRIEND: {
      const newFriends = { ...state.friends };
      delete newFriends[action.payload];
      return {
        ...state,
        friends: newFriends,
      };
    }
    case REMOVE_FRIEND_REQUEST: {
      const newPendingRequests = { ...state.pendingRequests };
      delete newPendingRequests[action.payload];
      return {
        ...state,
        pendingRequests: newPendingRequests,
      };
    }
    case REMOVE_SENT_REQUEST: {
      const newSentRequests = { ...state.sentRequests };
      delete newSentRequests[action.payload];
      return {
        ...state,
        sentRequests: newSentRequests,
      };
    }
    case CLEAR_FRIENDS_STATE: {
      return initialState; // Reset the friends slice to its initial state
    }
    default:
      return state;
  }
};

export default friendsReducer;