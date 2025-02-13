import Styles from "./ExpenseDetails.module.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate} from "react-router-dom";
import { useState } from "react";
import { paymentDueThunk } from "../../redux/expense";

const ExpenseDetailsPmtDue = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const payment_due = useSelector((state) => state.expenses.expenses.owesExpenses);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            dispatch(paymentDueThunk(id)).then(() => setLoading(false));
        }
    }, [dispatch, id]);

    if (!payment_due) {
        return <div>No payment due for this expense</div>;
    }

    console.log(id)
    console.log(payment_due)

    // if (loading) {
    //     return <div>Loading...</div>
    // }

    const currentExpense = payment_due.find(expense => expense.id === Number(id));

    console.log(currentExpense)

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
                    <p>{currentExpense[id]?.created_by}</p>
                    <p className={Styles.oweAmount}>{formattedPrice}</p>
                <button className={Styles.settleButton}>Settle</button>
                </div>
            </div>

            <div className={Styles.details}>
                <p>For: {currentExpense?.description}</p>
            </div>
            <div className={Styles.details}>
                <p>Created By: {currentExpense?.createdBy}</p>
            </div>

            <div className={Styles.participants}>
                <p>Other Participants:</p>
                {currentExpense?.participants.map((participant, index) => (
                    <div key={index} className={Styles.participant}>
                        {participant}
                    </div>
                ))}
            </div>

        </div>
    );
};

export default ExpenseDetailsPmtDue;
