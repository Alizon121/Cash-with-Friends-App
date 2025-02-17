import { useState } from "react";
import { useDispatch } from "react-redux";
import { commentActions } from "../../redux";
import { useParams, useNavigate } from "react-router-dom";
import "./AddComment.css";

function AddCommentModal({ onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [commentText, setCommentText] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateComment = () => {
    const newErrors = {};

    if (!commentText.trim()) {
      newErrors.commentText = "Comment cannot be empty.";
    } else if (commentText.length < 3) {
      newErrors.commentText = "Comment must be at least 3 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateComment()) return;

    setLoading(true);
    const commentData = { comment_text: commentText };

    try {
      await dispatch(commentActions.createComment(id, commentData));
      setCommentText("");
      onClose();
      navigate(0);
    } catch (res) {
      const data = await res.json();
      setErrors({ server: data?.error || "An unexpected error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-comment-modal">
      <h2 className="modal-header">Create a Comment</h2>
      
      {errors.server && <p className="error-message">{errors.server}</p>}
      {errors.commentText && <p className="error-message">{errors.commentText}</p>}

      <form onSubmit={handleSubmit} className="add-comment-form">
        <textarea
          className="comment-textarea"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add comment..."
        />

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn-add" type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCommentModal;