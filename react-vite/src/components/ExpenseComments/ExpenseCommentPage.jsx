import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { commentActions, expenseActions } from "../../redux";
import CommentCard from "../CommentCard"; // or whatever we decide to call our edit/delete comment modal unless it's two?

function ExpenseCommentPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const commentsById = useSelector((state) => state.comments.comments);
  const expenseId = useSelector((state) => state.expenses[id]);
  const friends = useSelector((state) => state.friends.list);

  useEffect(() => {
    dispatch(commentActions.getExpenseComments(id));
  }, [dispatch, id]);

  const comments = Object.values(commentsById);

  return (
    <div className="expense-comments-container">
      <header className="expense-comments-header">
      </header>

      <div className="main-content">
        {/* Comments Section */}
        <section className="comments-section">
          <h2>Comments:</h2>
          <div className="expense-description">
            <p>Expense: <span className="expense-name">{id?.name || "Loading..."}</span></p>
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
