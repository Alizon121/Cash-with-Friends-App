// import styles from "./ExpenseDetails.module.css"
// import { useParams } from 'react-router-dom'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'

const ExpenseDetails = () => {
    const dispatch = useDispatch(); // used to dispatch actions to the Redux store

    const amount_owed = useSelector((state) => state.expenses.amount_owed);

    // This useEffect will fetch the details of an expense when the component mounts
    useEffect(() => {
        dispatch(amount_owed());
    }, [dispatch, amount_owed]);

    console.log(amount_owed)

    return (

        //! What is the best way to get the user from the front end?
        // For the purpose of displaying the user's name for 'Created By:'

        <>
            <div>
                <h3>Total owed to you: {amount_owed.amount}</h3>
                <p>For: {amount_owed.description}</p>
                <p>Created By: CURRENT USER </p>
            </div>
            <div>
                <h4>Owes you:</h4>
                {amount_owed.participants.map((participant, index) => (
                    <div key={index}>
                        {participant}
                        {amount_owed.amount}
                        <button>Delete</button>
                    </div>
                ))}
            </div>
        </>
    )
}

export default ExpenseDetails
