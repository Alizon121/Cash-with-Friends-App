// import styles from "./ExpenseDetails.module.css"
// import { useParams } from 'react-router-dom'
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { amountOwedThunk } from "../../redux/expense";
import { useParams } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import DeleteExpenseModal from "./DeleteExpenseModal";
import UpdateExpenseModal from "./UpdateExpenseModal";

const ExpenseDetailsAmtOwed = () => {
  const dispatch = useDispatch(); // used to dispatch actions to the Redux store
  const { id } = useParams();

  const amount_owed = useSelector((state) => state.expenses);
  const current_user = useSelector((state) => state.session);

  // console.log(current_user.user.username)

  // This useEffect will fetch the details of an expense when the component mounts
  useEffect(() => {
    if (id) {
      dispatch(amountOwedThunk(id));
    }
  }, [dispatch, id]);

  if (!amount_owed[id]) {
    return <div>No payments owed for this expense</div>;
  }

  return (
    //! What is the best way to get the user from the front end?
    // For the purpose of displaying the user's name for 'Created By:'

    <>
      <div>
        <h3>Total owed to you: {amount_owed[id]?.amount}</h3>
        <p>For: {amount_owed[id]?.description}</p>
        <p>Created By: {current_user.user.username} </p>
      </div>
      <div>
        <h4>Owes you:</h4>
        {amount_owed[id]?.participants.map((participant, index) => (
          <div key={index}>
            {participant}
            {amount_owed?.amount}
            <button>Delete</button>
          </div>
        ))}
      </div>
      <div>
        <div>
          <OpenModalButton
            buttonText="Delete Expense"
            modalComponent={<DeleteExpenseModal />}
          />
        </div>
        <div>
          <OpenModalButton
            buttonText="Update Details"
            modalComponent={<UpdateExpenseModal />}
          />
        </div>
      </div>
    </>
  );
};

export default ExpenseDetailsAmtOwed;
