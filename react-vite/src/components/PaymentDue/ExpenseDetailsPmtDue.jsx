import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { paymentDueThunk } from '../../redux/expense';

const ExpenseDetailsPmtDue = () => {
    const dispatch = useDispatch();
    const { id } = useParams(); // Get expenseId from URL params

    const payment_due = useSelector((state) => state.expenses.expenses);

    useEffect(() => {
        if (id) {
            dispatch(paymentDueThunk(id));
        }
    }, [dispatch, id]);

    if (!payment_due) {
        return <div>No payment due for this expense</div>;
    }

    return (
        <>
            <h3>Total you owe: {payment_due[id]?.amount}</h3>

            <div>
                <p>You Owe:</p>
                <div>
                    <p>{payment_due[id]?.created_by}</p>
                    <p>{payment_due[id]?.amount}</p>
                    <button>Settle</button>
                </div>
                <div>
                    <p>For: {payment_due[id]?.description}</p>
                    <p>Created By: {payment_due[id]?.created_by}</p>
                    <div>
                        <p>Other Participants</p>
                        {payment_due[id]?.participants.map((participant, index) => (
                            <div key={index}>
                                {participant}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ExpenseDetailsPmtDue;
