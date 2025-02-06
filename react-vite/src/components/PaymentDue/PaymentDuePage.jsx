import ExpenseDetails from "./ExpenseDetailsPmtDue"
import { useNavigate, useParams } from 'react-router-dom'

function PaymentDuePage() {

    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <>
            <div>
                <h2>Expenses</h2>
                <button onClick={() => navigate(`/expenses/${id}/comments`)}>View Comments</button>
            </div>

            <div>
                {/* <ExpenseDetails /> */}
            </div>
        </>
    )
}

export default PaymentDuePage
