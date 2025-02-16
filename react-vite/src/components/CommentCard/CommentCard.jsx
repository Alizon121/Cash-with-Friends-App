import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { commentActions } from "../../redux";
import { useLocation } from "react-router-dom";
import "./CommentCard.css";

const CommentCard = ({ comment, showExpenseInfo }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const currentUser = useSelector((state) => state.session.user);
  const updatedComment = useSelector(state => state.comments[comment.id]);
  const commentUser = useSelector((state) => state.users?.users[comment.user_id])
  const isCommentOwner = currentUser.id === comment.user_id;
  const [editing, setEditing] = useState(false);
  const [newCommentText, setNewCommentText] = useState(comment.comment_text);

  const handleEdit = async () => {
    if (editing && newCommentText !== comment.comment_text) {
      const updatedComment = await dispatch(
        commentActions.updateComment({
          ...comment,
          comment_text: newCommentText,
        })
      );

      if (updatedComment) {
        setNewCommentText(updatedComment.comment_text);
      }
    }
    setEditing(!editing);
  };

  useEffect(() => {
    if (updatedComment) {
      setNewCommentText(updatedComment.comment_text);
    }
  }, [updatedComment]); 

  const handleDelete = () => {
    dispatch(commentActions.deleteComment(comment.id));
  };

  return (
    <div className="comment-card">
      {location.pathname === "/comments" || showExpenseInfo ? (
        <>
          <p className="expense-info">
            <span className="expense-description">{comment.description} </span>
            <span className="expense-creation">
              {new Date(comment.created_at).toLocaleString()}
            </span>
          </p>
        </>
      ) : null}
      {editing ? (
        <textarea
          className="comment-edit-textarea"
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
        />
      ) : (
        <p className="comment-text">
          <strong className="comment-author">{commentUser?.first_name}</strong> said:
          <span className="comment-content"> "{newCommentText}"</span>
        </p>
      )}
      {isCommentOwner && (
        <div className="comment-actions">
          <button className="btn-edit" onClick={handleEdit}>
            {editing ? "Save" : "Edit"}
          </button>
          <button className="btn-delete" onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentCard;
