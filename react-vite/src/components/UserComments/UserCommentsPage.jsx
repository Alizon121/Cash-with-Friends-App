import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { commentActions } from "../../redux";
import CommentCard from "../CommentCard";

function UserCommentPage() {
  const dispatch = useDispatch();
  const userComments = useSelector((state) => state.comments.comments);
  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(commentActions.getUserComments());
  }, [dispatch]);

  const comments = Object.values(userComments);

  return (
    <div className="user-comments-container">
      <header className="user-comments-header">
        <h1>{user?.first_name}'s Comments</h1>
      </header>

      <div className="main-content">
        {/* User Info Section */}
        <aside className="user-info-sidebar">
          <img
            src={user?.avatar || "/default-avatar.png"}
            alt={user?.first_name}
            className="user-avatar"
          />
          <h2>{user?.name}</h2>
          <p>Email: {user?.email}</p>
        </aside>

        {/* Comments Section */}
        <section className="comments-section">
          <h2>Comments:</h2>
          <ul className="user-comments">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <CommentCard key={comment.id} comment={comment} />
              ))
            ) : (
              <p>No comments yet.</p>
            )}
          </ul>

          {/* Add Comment Button */}
          <button className="add-comment-button">Add Comment</button>
        </section>
      </div>
    </div>
  );
}

export default UserCommentPage;
