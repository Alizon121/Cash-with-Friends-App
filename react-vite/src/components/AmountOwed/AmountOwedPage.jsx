import ExpenseDetails from "./ExpenseDetailsAmtOwed"
import { useNavigate, useParams } from "react-router-dom"

function AmountOwedPage() {

    const { id } = useParams()
    const navigate = useNavigate()

    return (
        <>
            <div>
                <h2>Expense Details</h2>
                <button onClick={() => navigate(`/expenses/${id}/comments`)}>View Comments</button>
            </div>

            <div>
                {/* <ExpenseDetails /> */}
            </div>

            <div>
                <button>Delete Expense</button>
                <button>Update Details</button>
            </div>
        </>
    )
}

export default AmountOwedPage
