import ExpenseDetails from "./ExpenseDetailsPmtDue"

function PaymentDuePage() {

    return (
        <>
            <div>
                <h2>Expenses</h2>
                <button>View Comments</button>
            </div>

            <div>
                <ExpenseDetails />
            </div>
        </>
    )
}

export default PaymentDuePage
