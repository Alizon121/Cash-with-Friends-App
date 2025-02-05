// import styles from "./ExpenseDetails.module.css"
// import { useParams } from 'react-router-dom'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'

const ExpenseDetails = () => {
    const dispatch = useDispatch(); // used to dispatch actions to the Redux store

    const amount_owed = useSelector((state) => state.expenses.amountOwed);

    // This useEffect will fetch the details of an expense when the component mounts
    useEffect(() => {
        dispatch(payment_due());
    }, [dispatch, amount_owed]);

    console.log(amount_owed)
}

export default ExpenseDetails
