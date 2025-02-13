import styles from "./UpdateExpenseModal.module.css";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useEffect, useState } from "react";
import { updateExpenseThunk } from "../../redux/expense";

function UpdateExpenseModal({ expenseId, currentExpense, formattedPrice, onUpdateSuccess }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const [description, setDescription] = useState(currentExpense.description);
  const [amount, setAmount] = useState(currentExpense.amount);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setDescription(currentExpense.description);
    setAmount(currentExpense.amount);
  }, [currentExpense]);

  const handleUpdate = () => {
    const updatedExpenseData = {
      description,
      amount: parseFloat(amount),
    };

    const newErrors = {};

    if (isNaN(amount)) {
      newErrors.amount = "Amount must be a number";
    }

    if (amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    dispatch(updateExpenseThunk(expenseId, updatedExpenseData)).then(() => {
      closeModal();
      onUpdateSuccess();
    });
  };



  return (
    <div className={styles.modal}>
      <div className={styles.header}>
        <h1 className={styles.title}>Update Details</h1>
      </div>
      <div className={styles.section}>
        <h2 className={styles["section-title"]}>FOR:</h2>
        <input
          className={styles.input}
          placeholder="New Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className={styles.section}>
        <h2 className={styles["section-title"]}>EXPENSE TOTAL:</h2>
        <input
          type="number"
          min="0"
          className={styles.input}
          placeholder="New Total"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
        />
        {errors.amount && <p className={styles.error}>{errors.amount}</p>}
      </div>
      <div className={styles.section}>
        <h2 className={styles["section-title"]}>PARTICIPANTS:</h2>
        {currentExpense?.participants.map((participant, index) => (
          <div key={index}>
            {`${participant}: ${formattedPrice}\n`}
          </div>
        ))}
      </div>
      <div className={styles["button-container"]}>
        <button
          className={`${styles.button} ${styles.close}`}
          onClick={() => {
            closeModal();
            onUpdateSuccess();
          }}
        >
          CLOSE
        </button>
        <button className={`${styles.button} ${styles.update}`} onClick={handleUpdate}>
          UPDATE
        </button>
      </div>
    </div>
  );
}

export default UpdateExpenseModal;
