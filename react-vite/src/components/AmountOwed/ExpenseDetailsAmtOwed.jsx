// import styles from "./ExpenseDetails.module.css"
// import { useParams } from 'react-router-dom'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { amountOwedThunk } from '../../redux/expense';
import { useParams } from 'react-router-dom';

const ExpenseDetails = () => {
    const dispatch = useDispatch(); // used to dispatch actions to the Redux store
    const { id } = useParams();

    const amount_owed = useSelector((state) => state.expenses.expense);

    // This useEffect will fetch the details of an expense when the component mounts
    useEffect(() => {
        if (id) {
            dispatch(amountOwedThunk(id));
        }
    }, [dispatch, id])

    console.log(amount_owed[id])

    return (

        //! What is the best way to get the user from the front end?
        // For the purpose of displaying the user's name for 'Created By:'

        <>
            <div>
                <h3>Total owed to you: {amount_owed[id]?.amount}</h3>
                <p>For: {amount_owed[id]?.description}</p>
                <p>Created By: CURRENT USER </p>
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
        </>
    )
}

export default ExpenseDetails
