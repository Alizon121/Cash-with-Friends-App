import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { commentActions, expenseActions } from "../../redux";
import CommentCard from "../CommentCard"; // or whatever we decide to call our edit/delete comment modal unless it's two?

function ExpenseCommentPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const commentsById = useSelector((state) => state.comments.comments);
  const expense = useSelector((state) => state.expenses[id]);
  const friends = useSelector((state) => state.friends.list);

  useEffect(() => {
    dispatch(commentActions.getComments("expenses", id));
    // dispatch(expenseActions.getExpense(id));
  }, [dispatch, id]);

  const comments = Object.values(commentsById);

  return (
    <div className="expense-comments-container">
      <header className="expense-comments-header">
      </header>

      <div className="main-content">
        {/* Friends Sidebar */}
        <aside className="friends-sidebar">
          <h2>FRIENDS</h2>
          <button className="add-friend-button">➕</button>
          <ul>
            {friends?.map((friend) => (
              <li key={friend.id} className="friend-item">
                <img src={friend.avatar || "/default-avatar.png"} alt={friend.name} className="friend-avatar" />
                {friend.name}
              </li>
            ))}
          </ul>
        </aside>

        {/* Comments Section */}
        <section className="comments-section">
          <h2>Comments:</h2>
          <div className="expense-description">
            <p>Expense: <span className="expense-name">{expense?.name || "Loading..."}</span></p>
          </div>

          <ul className="expense-comments">
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

export default ExpenseCommentPage;
