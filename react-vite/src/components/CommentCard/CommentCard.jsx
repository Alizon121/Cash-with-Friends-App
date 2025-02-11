import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { commentActions, userActions } from '../../redux';

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
    <div>
      {editing ? (
        <textarea
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
        />
      ) : (
          <p><strong>{user.first_name}</strong> said: "<strong>{comment.comment_text}</strong>"</p>
      )}
      <button onClick={handleEdit}>{editing ? 'Save' : 'Edit'}</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default CommentCard;
