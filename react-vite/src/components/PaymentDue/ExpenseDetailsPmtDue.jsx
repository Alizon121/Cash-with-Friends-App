// import styles from "./ExpenseDetails.module.css"
// import { useParams } from 'react-router-dom'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'

const ExpenseDetails = () => {
    const dispatch = useDispatch(); // used to dispatch actions to the Redux store

    const payment_due = useSelector((state) => state.expenses.payment_due);

    // This useEffect will fetch the details of an expense when the component mounts
    useEffect(() => {
        dispatch(payment_due());
    }, [dispatch, payment_due]);

    console.log(payment_due)

    // ! What is the best way to find the owner of the expense?
    // For displaying their name in "You Owe: " and in "Created By: "
    // ^ GET FROM AUTHENTICATE ROUTE!

    return (
        <>
            <h3>Total you owe: {payment_due.amount}</h3>

            <div>
                <p>You Owe:</p>
                <div>
                    <p>EXPENSE OWNER</p>
                    <p>{payment_due.amount}</p>
                    <button>Settle</button>
                </div>
                <div>
                    <p>For: {payment_due.description}</p>
                    <p>Created By: EXPENSE OWNER</p>
                    <div>
                        <p>Other Participants</p>
                        {amount_owed.participants.map((participant, index) => (
                            <div key={index}>
                                {participant}
                            <button>Delete</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ExpenseDetails
