import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { commentActions, expenseActions, userActions } from "../../redux";
import CommentCard from "../CommentCard";
import { useModal } from "../../context/Modal";
import OpenModalButton from "../OpenModalButton";
import AddCommentModal from "../AddCommentModal";
import "./ExpenseComments.css";

function ExpenseCommentPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const expenseId = parseInt(id, 10);
  const commentsById = useSelector((state) => state.comments?.comments);
  const users = useSelector((state) => state.users.users || {});
  const { setModalContent } = useModal();

  useEffect(() => {
    dispatch(commentActions.getExpenseComments(expenseId));
    dispatch(expenseActions.loadAllUserExpensesThunk());
    dispatch(userActions.getUsers());
  }, [dispatch, expenseId]);

  const expensesOwed = useSelector(
    (state) => state.expenses?.expensesOwed || []
  );
  const owesExpenses = useSelector(
    (state) => state.expenses?.owesExpenses || []
  );
  const allExpenses = [...expensesOwed, ...owesExpenses];
  const expense = allExpenses.find((expense) => expense.id === expenseId);
  const comments = Object.values(commentsById);

  return (
    <div className="expense-comments-container">
      <header className="expense-comments-header"></header>
      <div className="main-content">

        <section className="comments-section">
          <h2>Comments:</h2>
          <div className="expense-card">
            <p>
              <span className="expense-title">Expense:</span>
              <span className="expense-description">
                {expense ? expense.description : "Loading..."}
              </span>
            </p>
          </div>

          {/* Comments Section */}
          <ul className="expense-comments">
            {comments.length > 0 ? (
              comments.map((comment) => {
                const user = comment.user || { first_name: "Uknown User" };
                return (
                  <CommentCard key={`comment-${comment.id}`} comment={comment} user={user} />
                );
              })
            ) : (
              <p>No comments yet.</p>
            )}
          </ul>

          {/* Add Comment Button */}
          <div className="add-comment-btn">
            <OpenModalButton
              modalComponent={
                <AddCommentModal
                  onClose={() => setModalContent(null)}
                  onModalClose={() => setModalContent(null)}
                />
              }
              buttonText="Add Comment"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default ExpenseCommentPage;
