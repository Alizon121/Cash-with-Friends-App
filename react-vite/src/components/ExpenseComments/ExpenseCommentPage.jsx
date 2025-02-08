import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { commentActions, expenseActions } from "../../redux";
import CommentCard from "../CommentCard";
import { useModal } from "../../context/Modal";
import OpenModalButton from "../OpenModalButton";
import AddCommentModal from "../AddCommentModal";

function ExpenseCommentPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  console.log("EXPENSE ID FROM PARAMS: ", id);
  const expenseId = parseInt(id, 10);
  console.log("PARSED ID: ", expenseId);
  const commentsById = useSelector((state) => state.comments.comments);
  const { setModalContent } = useModal();

  useEffect(() => {
    dispatch(commentActions.getExpenseComments(expenseId));
    dispatch(expenseActions.loadAllUserExpensesThunk());
  }, [dispatch, expenseId]);

  const expensesOwed = useSelector((state) => state.expenses?.expenses?.expensesOwed || []);
  const owesExpenses = useSelector((state) => state.expenses?.expenses?.owesExpenses || []);
  
  useEffect(() => {
    setTimeout(() => {
      console.log("OWED (AFTER FETCH):", expensesOwed);
      console.log("OWES (AFTER FETCH):", owesExpenses);
    }, 500);
  }, [expensesOwed, owesExpenses]);

  const allExpenses = [...expensesOwed, ...owesExpenses];
  console.log("ALL EXPENSES: ", allExpenses);

  const expense = allExpenses.find((expense) => expense.id === expenseId);
  console.log("EXPENSE: ", expense);

  const expenseDetails = allExpenses.map(expense => ({
    id: expense.id,
    description: expense.description
  }));

  console.log("THE DEEEETS: ", expenseDetails);

  const comments = Object.values(commentsById);

  return (
    <div className="expense-comments-container">
      <header className="expense-comments-header"></header>
      <div className="main-content">
        {/* Comments Section */}
        <section className="comments-section">
          <h2>Comments:</h2>
          <div className="expense-description">
            <p>
              Expense: {" "}
              {expense ? expense.description : "Loading..."}
            </p>
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
          <OpenModalButton
            modalComponent={
              <AddCommentModal
                onClose={() => setModalContent(null)}
                buttonText="Add Comment"
                onModalClose={() => setModalContent(null)}
              />
            }
          />
        </section>
      </div>
    </div>
  );
}

export default ExpenseCommentPage;
