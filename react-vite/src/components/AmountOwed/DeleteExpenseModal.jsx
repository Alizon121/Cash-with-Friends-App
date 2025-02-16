import styles from "./DeleteExpenseModal.module.css";
import { useModal } from "../../context/Modal";
import { deleteExpenseThunk } from "../../redux/expense";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function DeleteExpenseModal({ expenseId, onDelete, currentExpense }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    try {
      e.preventDefault();
      await dispatch(deleteExpenseThunk(expenseId));
      closeModal();
      onDelete(expenseId);
      navigate("/users/dashboard");
    } catch (e) {
      console.error("Failed to delete an expense", e);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.header}>
        <h2 className={styles.title}>Delete</h2>
      </div>
      <div className={styles.section}>
        <h2 className={styles["section-title"]}>ARE YOU SURE YOU WANT TO DELETE THIS EXPENSE?</h2>
        <h3 className={styles["amount"]}>{ `$${currentExpense?.amount}` }</h3>
      </div>
      <div className={styles["button-container"]}>
        <button className={`${styles.button} ${styles.delete}`} onClick={handleDelete}>DELETE</button>
        <button className={`${styles.button} ${styles.close}`} onClick={closeModal}>CLOSE</button>
      </div>
    </div>
  );
}

export default DeleteExpenseModal;
