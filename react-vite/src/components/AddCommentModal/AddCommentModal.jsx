import { useState } from "react";
import { useDispatch } from "react-redux";
import { commentActions } from "../../redux";
import { useParams } from "react-router-dom";

function AddCommentModal({ onClose }) {
    const dispatch = useDispatch();
    const [commentText, setCommentText] = useState("");
      const { id } = useParams();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const commentData = { comment_text: commentText };
      await dispatch(commentActions.createComment(id, commentData));
      setCommentText("");
      onClose();
    };

  return (
    <div>
      <h2>Add a Comment</h2>
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Write your comment here"
      />
      <button onClick={handleSubmit}>Submit</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

export default AddCommentModal;
