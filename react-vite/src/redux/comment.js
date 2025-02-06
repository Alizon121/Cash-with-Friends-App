import { csrfFetch } from "./csrf";

// Make an Action Creator to load all the Comments
const LOAD_USER_COMMENTS = "LOAD_USER_COMMENTS"
const loadUserComments = (comments) => {
    return  {
        type: LOAD_USER_COMMENTS,
        payload: comments
    }
}

// Make a thunk action that gets all current user comments
export const loadCurrentUserComments = () => async dispatch => {
    const response = await csrfFetch("/api/comments")

    if (response.ok) {
        const result = await response.json()
        dispatch(loadUserComments(result))
    }
}

// Make Comments Reducer
const commentsReducer = (state={}, action) => {
    switch(action.type) {
        case(LOAD_USER_COMMENTS): {
            const userComments = {}
            return userComments
        }
        default: 
            return state
    }
}

export default commentsReducer