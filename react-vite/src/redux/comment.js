import { csrfFetch } from "./csrf";

/******************************* ACTION TYPES *******************************************/

export const LOAD_COMMENTS = "comments/loadComments";
export const ADD_COMMENT = "comments/addComment";
export const UPDATE_COMMENT = "comments/updateComment";
export const DELETE_COMMENT = "comments/deleteComment";

/******************************* ACTION CREATORS *******************************************/

export const loadComments = (comments) => ({
  type: LOAD_COMMENTS,
  payload: comments,
});

export const addComment = (comment) => ({
  type: ADD_COMMENT,
  payload: comment,
});

export const reviseComment = (updatedComment) => ({
  type: UPDATE_COMMENT,
  payload: { updatedComment },
});

export const removeComment = (commentId) => ({
  type: DELETE_COMMENT,
  payload: commentId,
});

/******************************* THUNK ACTIONS *******************************************/

// Get Comments for an expense
// export const getComments = (type, id) => async (dispatch) => {
//   let url = "";
//   if (type === "expenses") {
//     if (!id) {
//       console.error("getComments called with an undefined expenseId");
//       return;
//     }
//     url = `/api/expenses/${id}/comments`;
//   } else if (type === "user") {
//     url = `/api/comments`;
//   } else {
//     throw Error('Invalid type. Use "expenses" or "user"');
//   }

//   try {
//     const res = await csrfFetch(url);
//     if (!res.ok) throw Error("Failed to get comments");
//     const data = await res.json();

//     if (!data.comments || data.comments.length === 0) {
//       console.log(`No comments found for ${type} with id ${id}`);
//       return;
//     }

//     dispatch(loadComments(data.comments));
//   } catch (e) {
//     console.error("Error loading comments", e);
//   }
// };

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
    const updatedComment = await res.json();
    dispatch(reviseComment(updatedComment));
    return updatedComment;
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
      const commentsById = action.payload.reduce((acc, comment) => {
        console.log("COMMMEEENNNNTTTSSS: ", comment);
        acc[comment.id] = comment;
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
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.payload.id]: action.payload,
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
