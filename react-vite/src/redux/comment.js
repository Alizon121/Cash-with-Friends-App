import { csrfFetch } from "./csrf";

/******************************* ACTION TYPES *******************************************/

export const LOAD_COMMENTS = "comments/loadComments";
export const ADD_COMMENT = "comments/addComment";
export const UPDATE_COMMENT = "comments/updateComment";
export const DELETE_COMMENT = "comments/deleteComment";

/******************************* ACTION CREATORS *******************************************/

export const loadComments = (comments, descriptions = []) => ({
  type: LOAD_COMMENTS,
  payload: { comments, descriptions },
});

export const addComment = (comment) => ({
  type: ADD_COMMENT,
  payload: comment,
});

export const reviseComment = (updatedComment) => ({
  type: UPDATE_COMMENT,
  payload: updatedComment,
});

export const removeComment = (commentId) => ({
  type: DELETE_COMMENT,
  payload: commentId,
});

/******************************* THUNK ACTIONS *******************************************/

// Get Comments for the current User
export const getUserComments = () => async (dispatch, getState) => {
  const userId = getState().session.user.id;
  const url = `/api/users/${userId}/comments`;

  try {
    const res = await csrfFetch(url);
    if (!res.ok) throw Error("Failed to get user comments");
    const data = await res.json();
    console.log("USER COMMENTS DATA:", data);

    if (!data.comments || !Array.isArray(data.comments)) {
      console.warn(`Invalid response format from ${url}:`, data);
      dispatch(loadComments([], []));
      return;
    }

    dispatch(loadComments(data.comments, data.description));
  } catch (e) {
    console.error("Error loading user comments", e);
  }
};
// Get Comments for the expense by id
export const getExpenseComments = (id) => async (dispatch) => {
  if (!id) {
    console.error("getExpenseComments called with an undefined id");
    return;
  }
  
  const url = `/api/expenses/${id}/comments`;

  try {
    const res = await csrfFetch(url);
    if (!res.ok) throw Error("Failed to get expense comments");
    const data = await res.json();

    if (!data.comments || !Array.isArray(data.comments)) {
      console.warn(`Invalid response format from ${url}:`, data);
      dispatch(loadComments(data.comments));
      return;
    }

    dispatch(loadComments(data.comments));
  } catch (e) {
    console.error("Error loading expense comments", e);
  }
};

// Add a Comment to an Expense
export const createComment = (id, commentData) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/expenses/${id}/comments`, {
      method: "POST",
      body: JSON.stringify(commentData),
    });
    if (!res.ok) throw Error("Failed to create comment");
    const comment = await res.json();
    dispatch(addComment(comment));
    return comment;
  } catch (e) {
    console.error("Error creating comment", e);
    throw e;
  }
};

// Delete a Comment
export const deleteComment = (commentId, id) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/comments/${commentId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw Error("Failed to delete comment");
    dispatch(removeComment(commentId, id));
  } catch (e) {
    console.error("Error deleting comment", e);
    throw e;
  }
};

// Update a Comment
export const updateComment = (commentData) => async (dispatch) => {
  const { id } = commentData;
  try {
    const res = await csrfFetch(`/api/comments/${id}`, {
      method: "PUT",
      body: JSON.stringify(commentData),
    });
    if (!res.ok) throw new Error("Failed to update comment.");
    const { comment } = await res.json();
    dispatch(reviseComment(comment));
    return comment;
  } catch (e) {
    console.error("Error updating comment:", e);
    throw e;
  }
};

/******************************* INITIAL STATE AND REDUCER *******************************************/

const initialState = {
  comments: {},
};

const commentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_COMMENTS: {
      const commentsById = action.payload.comments.reduce((acc, comment, index) => {
        acc[comment.id] = {
          ...comment,
          description: action.payload.descriptions[index],
        };
        return acc;
      }, {});
      return {
        ...state,
        comments: commentsById,
      };
    }
    case ADD_COMMENT: {
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.payload.id]: action.payload,
        },
      };
    }
    case UPDATE_COMMENT: {
      const updatedComment = action.payload;
      if (!updatedComment) return state;
      return {
        ...state,
        comments: {
          ...state.comments,
          [updatedComment.id]: updatedComment,
        },
      };
    }

    case DELETE_COMMENT: {
      const newComments = { ...state.comments };
      delete newComments[action.payload];
      return {
        ...state,
        comments: newComments,
      };
    }
    default:
      return state;
  }
};

export default commentsReducer;
