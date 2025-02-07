import ExpenseDetails from "./ExpenseDetailsAmtOwed"
import { useNavigate, useParams } from "react-router-dom"
import OpenModalButton from "../OpenModalButton"
import DeleteExpenseModal from "./DeleteExpenseModal"
import UpdateExpenseModal from "./UpdateExpenseModal"

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
                <ExpenseDetails />
            </div>

            <div>
                    <OpenModalButton
                    buttonText="Delete Expense"
                    modalComponent={<DeleteExpenseModal />}
                    />
            </div>
            <div>
                    <OpenModalButton
                    buttonText="Update Details"
                    modalComponent={<UpdateExpenseModal />}
                    />
            </div>
        </>
    )
}

export default AmountOwedPage
