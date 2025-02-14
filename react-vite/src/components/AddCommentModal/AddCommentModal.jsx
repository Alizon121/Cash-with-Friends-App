import { useState } from "react";
import { useDispatch } from "react-redux";
import { commentActions } from "../../redux";
import { useParams, useNavigate } from "react-router-dom";
import "./AddComment.css";

function AddCommentModal({ onClose }) {
    const dispatch = useDispatch();
    const navi = useNavigate();
    const [commentText, setCommentText] = useState("");
    const { id } = useParams();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const commentData = { comment_text: commentText };
      await dispatch(commentActions.createComment(id, commentData));
      setCommentText("");
      onClose();
      navi(0);
    };

  return (
    <div className="add-comment-modal">
      <h2 className="modal-header">Create a Comment</h2>
      <textarea
        className="comment-textarea"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Add comment"
      />
      <div className="modal-footer">
        <button className="btn-add" onClick={handleSubmit}>Add</button>
        <button className="btn-cancel" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default AddCommentModal;