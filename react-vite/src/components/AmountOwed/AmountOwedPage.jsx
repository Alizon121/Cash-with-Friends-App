import ExpenseDetails from "./ExpenseDetailsAmtOwed"

function AmountOwedPage() {

    return (
        <>
            <div>
                <h2>Expense Details</h2>
                <button>View Comments</button>
            </div>

            <div>
                <ExpenseDetails />
            </div>

            <div>
                <button>Delete Expense</button>
                <button>Update Details</button>
            </div>
        </>
    )
}

export default AmountOwedPage
