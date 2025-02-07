import { csrfFetch } from "./csrf";

/******************************* ACTION TYPES *******************************************/

export const LOAD_FRIENDS = "friends/loadFriends";
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
export const getFriends = (userId) => async (dispatch) => {
  try {
    const res = await csrfFetch("/api/users/friends");
    if (!res.ok) throw Error("Failed to get friends");
    const data = await res.json();

    if (!data.friends || data.friends.length === 0) {
      console.log(`No friends found`);
      return;
    }

    dispatch(loadFriends(data.friends));
  } catch (e) {
    console.error("Error loading friends", e);
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

/******************************* INITIAL STATE AND REDUCER *******************************************/

const initialState = {
  friends: {},
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
      const newfriends = { ...state.friends };
      delete newfriends[action.payload];
      return {
        ...state,
        friends: newfriends,
      };
    }
    case REMOVE_FRIEND_REQUEST: {
      const requests = { ...state.friends };
      delete requests[action.payload];
      return {
        ...state,
        friends: requests,
      };
    }
    default:
      return state;
  }
};

export default friendsReducer;
