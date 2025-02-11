import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { commentActions, expenseActions, userActions } from "../../redux";
import CommentCard from "../CommentCard";
import { useModal } from "../../context/Modal";
import OpenModalButton from "../OpenModalButton";
import AddCommentModal from "../AddCommentModal";

function ExpenseCommentPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const expenseId = parseInt(id, 10);
  const commentsById = useSelector((state) => state.comments.comments);
  const users = useSelector((state) => state.users.users || {});
  const { setModalContent } = useModal();

  useEffect(() => {
    dispatch(commentActions.getExpenseComments(expenseId));
    dispatch(expenseActions.loadAllUserExpensesThunk());
    dispatch(userActions.getUsers());
  }, [dispatch, expenseId]);

  const expensesOwed = useSelector(
    (state) => state.expenses?.expenses?.expensesOwed || []
  );
  const owesExpenses = useSelector(
    (state) => state.expenses?.expenses?.owesExpenses || []
  );
  const allExpenses = [...expensesOwed, ...owesExpenses];
  const expense = allExpenses.find((expense) => expense.id === expenseId);
  const comments = Object.values(commentsById);

  return (
    <div className="expense-comments-container">
      <header className="expense-comments-header"></header>
      <div className="main-content">

        {/* Comments Section */}
        <section className="comments-section">
          <h2>Comments:</h2>
          <div className="expense-description">
            <p>Expense: {expense ? expense.description : "Loading..."}</p>
          </div>
          <ul className="expense-comments">
            {comments.length > 0 ? (
              comments.map((comment) => {
                const user = users[comment.user_id];
                return (
                  <CommentCard key={comment.id} comment={comment} user={user} />
                );
              })
            ) : (
              <p>No comments yet.</p>
            )}
          </ul>

          {/* Add Comment Button */}
          <OpenModalButton
            modalComponent={
              <AddCommentModal
                onClose={() => setModalContent(null)}
                onModalClose={() => setModalContent(null)}
              />
            } buttonText="Add Comment"
          />
        </section>
      </div>
    </div>
  );
}

export default ExpenseCommentPage;
