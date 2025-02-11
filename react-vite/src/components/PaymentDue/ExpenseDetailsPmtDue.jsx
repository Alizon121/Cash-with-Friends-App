import Styles from "./ExpenseDetails.module.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { paymentDueThunk } from "../../redux/expense";

const ExpenseDetailsPmtDue = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const payment_due = useSelector((state) => state.expenses.expenses);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            dispatch(paymentDueThunk(id));
        }
    }, [dispatch, id]);

    if (!payment_due) {
        return <div>No payment due for this expense</div>;
    }

    const currentExpense = payment_due[id]

    const formattedPrice = currentExpense?.amount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      });

    return (
        <div className={Styles.container}>
            <div className={Styles.headerContainer}>
                <h2 className={Styles.header}>Expense</h2>
                <div onClick={() => navigate(`/expenses/${id}/comments`)} className={Styles.viewComments}>View Comments</div>
            </div>
            <div className={Styles.totalAmount}>
                <p className={Styles.totalText}>
                    Total you owe:
                </p>
                <p>
                    {formattedPrice}
                </p>
            </div>

                <div className={Styles.youOweText}>
                    <p>You Owe:</p>
                </div>
            <div className={Styles.oweSection}>
                <div className={Styles.oweSectionDetails}>
                    <p>{payment_due[id]?.created_by}</p>
                    <p className={Styles.oweAmount}>{formattedPrice}</p>
                <button className={Styles.settleButton}>Settle</button>
                </div>
            </div>

            <div className={Styles.details}>
                <p>For: {payment_due[id]?.description}</p>
            </div>
            <div className={Styles.details}>
                <p>Created By: {payment_due[id]?.created_by}</p>
            </div>

            <div className={Styles.participants}>
                <p>Other Participants:</p>
                {payment_due[id]?.participants.map((participant, index) => (
                    <div key={index} className={Styles.participant}>
                        {participant}
                    </div>
                ))}
            </div>

        </div>
    );
};

export default ExpenseDetailsPmtDue;
