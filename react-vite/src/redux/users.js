import { csrfFetch } from "./csrf";

/******************************* ACTION TYPES *******************************************/

export const LOAD_USERS = "users/loadUsers";

/******************************* ACTION CREATORS *******************************************/

export const loadUsers = (users) => ({
  type: LOAD_USERS,
  payload: users,
});

/******************************* THUNK ACTIONS *******************************************/

// Get all Users
export const getUsers = () => async (dispatch) => {
  try {
    const res = await csrfFetch('/api/users/');
    if (!res.ok) throw Error("Failed to get users");
      const data = await res.json();
    dispatch(loadUsers(data.users));
  } catch (e) {
    console.error("Error loading users", e);
  }
};

/******************************* INITIAL STATE AND REDUCER *******************************************/

const initialState = {
  users: {},
};

const usersReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_USERS: {
          if (!Array.isArray(action.payload)) {
            console.error("Expected array but got:", action.payload);
            return state;
          }
  
          const usersObj = action.payload.reduce((acc, user) => {
            acc[user.id] = user;
            return acc;
          }, {});
  
          return { ...state, users: usersObj };
        }
      default:
        return state;
    }
  };

export default usersReducer;
