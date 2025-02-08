import { csrfFetch } from "./csrf";

/******************************* ACTION TYPES *******************************************/

export const LOAD_FRIENDS = "friends/loadFriends";
export const LOAD_PENDING_REQUESTS = "friends/loadPendingRequests";
export const ADD_FRIEND = "friends/addFriend";
export const DELETE_FRIEND = "friends/deleteFriend";
export const REMOVE_FRIEND_REQUEST = "friends/removeFriendRequest";

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
    const res = await csrfFetch(`/api/users/${userId}/friends`, {
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
    const res = await csrfFetch(`/api/users/${userId}/friends/${friendId}`, {
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


/******************************* INITIAL STATE AND REDUCER *******************************************/

const initialState = {
  friends: {},
  pendingRequests: {}, // Added this to store pending requests
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
    default:
      return state;
  }
};

export default friendsReducer;