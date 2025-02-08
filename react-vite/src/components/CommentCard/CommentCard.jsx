import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { commentActions } from '../../redux';

const CommentCard = ({ comment }) => {
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
    dispatch(commentActions.deleteComment(comment.commentId));
  };
  
  return (
    <div>
      {editing ? (
        <textarea
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
        />
      ) : (
          <p>{comment.user_id} said: {comment.comment_text}</p>
      )}
      <button onClick={handleEdit}>{editing ? 'Save' : 'Edit'}</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default CommentCard;
