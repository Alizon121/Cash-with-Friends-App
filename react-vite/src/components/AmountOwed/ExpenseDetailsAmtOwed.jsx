import styles from "./ExpenseDetails.module.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { amountOwedThunk } from "../../redux/expense";
import { useParams, useNavigate } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import DeleteExpenseModal from "./DeleteExpenseModal";
import UpdateExpenseModal from "./UpdateExpenseModal";

const ExpenseDetailsAmtOwed = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [deletedExpenseId, setDeletedExpenseId] = useState(null);
  const amount_owed = useSelector((state) => state.expenses);
  const current_user = useSelector((state) => state.session);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(amountOwedThunk(id));
    }
  }, [dispatch, id, deletedExpenseId]);

  if (!amount_owed[id]) {
    return <div>No payments owed for this expense</div>;
  }

  const handleUpdateSuccess = () => {
    if (id) {
      dispatch(amountOwedThunk(id));
    }
  };

  const handleExpenseDelete = (id) => {
    setDeletedExpenseId(id);
  };

  const currentExpense = amount_owed[id];

  const formattedPrice = currentExpense?.amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <h2 className={styles.header}>Expense Details</h2>
        <div onClick={() => navigate(`/expenses/${id}/comments`)} className={styles.viewComments}>
          View Comments
        </div>
      </div>

      <div className={styles.totalAmount}>
        <div className={styles.totalAmountLeft}>
          <p className={styles.totalText}>Total owed to you:</p>
          <p>${amount_owed[id]?.amount}</p>
        </div>
        <div className={styles.details}>
          <p>For: {amount_owed[id]?.description}</p>
          <p>Created By: {current_user.user.username}</p>
        </div>
      </div>


      <div className={styles.owesYouSection}>
        <p className={styles.owesYouHeader}>Owes you:</p>
        <div>
        {amount_owed[id]?.participants.map((participant, index) => (
          <div key={index} className={styles.participantRow}>
            <div className={styles.participant}>
              <p>{`${participant}`}</p>
              <p className={styles.participantAmount}>{`${formattedPrice}`}</p>
            </div>
            {/* <p className={styles.participantAmount}>${participant.amount}</p> */}
          </div>
        ))}
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <OpenModalButton
          buttonText="Delete Expense"
          modalComponent={<DeleteExpenseModal expenseId={Number(id)} onDelete={() => handleExpenseDelete(id)} currentExpense={currentExpense} />}
          className={styles.deleteExpense}
        />

        <OpenModalButton
          buttonText="Update Details"
          modalComponent={<UpdateExpenseModal expenseId={id} currentExpense={currentExpense} onUpdateSuccess={handleUpdateSuccess} />}
          className={styles.updateExpense}
        />
      </div>
    </div>
  );
};

export default ExpenseDetailsAmtOwed;
