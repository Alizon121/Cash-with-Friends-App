import { csrfFetch } from "./csrf";
import { clearExpenseState } from "./expense";
import { clearFriendsState } from "./friends";


/*********************** Actions **************************************/
const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

// Add action for loading all users -ASL
// const LOAD_ALL_USERS = 'session/loadAllUsers'

/**************************** Action Creators **************************/
const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

const removeUser = () => ({
  type: REMOVE_USER
});

// // Create an action creator for loading all users -ASL
// const loadAllUsers = (users) => ({
//   type: LOAD_ALL_USERS,
//   payload: users

// })

/********************************* Thunk Actions **********************/
export const thunkAuthenticate = () => async (dispatch) => {
	const response = await fetch("/api/auth/");
	if (response.ok) {
		const data = await response.json();
		if (data.errors) {
			return;
		}

		dispatch(setUser(data));
	}
};

export const thunkLogin = (credentials) => async dispatch => {
  const {email, password} = credentials
  const response = await csrfFetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password
    })
  });

  if(response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages
  } else {
    return { server: "Something went wrong. Please try again" }
  }
};

export const thunkSignup = (user) => async (dispatch) => {
try { const response = await csrfFetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });

  if(response.ok) {
    const data = await response.json();
    console.log("DATATADATADATD", data)
    dispatch(setUser(data));
    return data
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages
  } else {
    return { server: "Something went wrong. Please try again" }
  }} catch (e){
    const errors = await e.json()
    return {"errors": errors}
  }
};

export const thunkLogout = () => async (dispatch) => {
  await fetch("/api/auth/logout");
  dispatch(removeUser());
  dispatch(clearFriendsState()); // Clear the friends state on logout
  dispatch(clearExpenseState())
};

// export const thunkLoadAllUsers = () => async dispatch => {
//   const resposne = await csrfFetch(`/api/users/`)
// }

const initialState = { user: null };

function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      const newState={...state}
      delete newState.user
      return newState
      // return { ...state};
    default:
      return state;
  }
}

export const thunkUpdateUser = (userData) => async (dispatch) => {
  console.log("📤 Sending profile update request:", userData);

  const response = await fetch("/api/users/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
  });

  console.log("🔍 API Response Status:", response.status);

  if (response.ok) {
      const updatedUser = await response.json();
      console.log("✅ Successfully updated:", updatedUser);

      dispatch(setUser(updatedUser));  // Ensure Redux state updates
      return null; // No errors
  } else {
      const errorResponse = await response.json();
      console.log("⚠️ Validation Errors:", errorResponse);

      return errorResponse; // Return validation errors
  }
};



export default sessionReducer;
