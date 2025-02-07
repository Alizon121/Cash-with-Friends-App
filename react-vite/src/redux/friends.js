import { csrfFetch } from "./csrf"

////////////////// Action Creators ///////////////////////
// Make an action creator for adding a friend
const ADD_FRIEND = "ADD_FRIEND"
const addFriend = (friend) => {
    type = ADD_FRIEND
    payload = friend
}

////////////////////Thunk Actions////////////////////
export const addFriendThunk = (payload) => async dispatch => {
    const response = await csrfFetch("")
}