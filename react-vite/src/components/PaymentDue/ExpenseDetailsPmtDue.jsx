import Styles from "./ExpenseDetails.module.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation} from "react-router-dom";
import { useState } from "react";
import { paymentDueThunk } from "../../redux/expense";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import SettleFormModal from "../SettleFormModal/SettleFormModal";

const ExpenseDetailsPmtDue = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const paymentDue = useSelector((state) => state.expenses);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // Helper func for handling the updating the page when settle button is clicked
    const handleSettleExpense = (expenseId) => {
        dispatch(paymentDueThunk(expenseId))
    }

    useEffect(() => {
        if (id) {
            dispatch(paymentDueThunk(id)).then(() => setLoading(false));
        }
    }, [dispatch, id]);

    if (!paymentDue) {
        return <div>No payment due for this expense</div>;
    }

    if (loading) {
        return <div>Loading...</div>
    }

    const formattedPrice = paymentDue?.amount.toLocaleString('en-US', {
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
                    <p>{paymentDue?.created_by}</p>
                    <p className={Styles.oweAmount}>{formattedPrice}</p>
                    {paymentDue?.amount === 0 ? 
                        <button className={Styles.settleButton} disabled={true}>
                            <OpenModalMenuItem
                                itemText={"Settle"}
                                modalComponent={<SettleFormModal onSettle={() => handleSettleExpense(paymentDue?.id)} settled={paymentDue?.settled} expenseId={paymentDue?.id} amount={paymentDue?.amount.toFixed(2)}/>}
                            />
                        </button> :
                         <button className={Styles.settleButton} disabled={false}>
                         <OpenModalMenuItem
                             itemText={"Settle"}
                             modalComponent={<SettleFormModal onSettle={() => handleSettleExpense(paymentDue?.id)} settled={paymentDue?.settled} expenseId={paymentDue?.id} amount={paymentDue?.amount.toFixed(2)}/>}
                         />
                     </button> 
                    }
                </div>
            </div>

            <div className={Styles.details}>
                <p>For: {paymentDue?.description}</p>
            </div>
            <div className={Styles.details}>
                <p>Created By: {paymentDue?.created_by}</p>
            </div>

            <div className={Styles.participants}>
                <p>Other Participants:</p>
                {paymentDue?.participants.map((participant, index) => (
                    <div key={index} className={Styles.participant}>
                        {participant}
                    </div>
                ))}
            </div>

        </div>
    );
};

export default ExpenseDetailsPmtDue;
