import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { commentActions } from '../../redux';
import "./CommentCard.css";

const CommentCard = ({ comment, user }) => {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [newCommentText, setNewCommentText] = useState(comment.comment_text);

  const handleEdit = () => {
      if (editing && newCommentText !== comment.comment_text) {
        dispatch(commentActions.updateComment({ ...comment, comment_text: newCommentText }));
      }
      setEditing(!editing);
  };
    
  const handleDelete = () => {
    dispatch(commentActions.deleteComment(comment.id));
  };

  return (
    <div className="comment-card">
      {editing ? (
        <textarea
          className="comment-edit-textarea"
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
        />
      ) : (
        <p className="comment-text">
          <strong className="comment-author">{user.first_name}</strong> said: 
          <span className="comment-content"> "{comment.comment_text}"</span>
        </p>
      )}
      <div className="comment-actions">
        <button className="btn-edit" onClick={handleEdit}>
          {editing ? 'Save' : 'Edit'}
        </button>
        <button className="btn-delete" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default CommentCard;