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
}

export default ExpenseDetails
