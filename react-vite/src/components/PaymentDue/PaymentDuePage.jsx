import ExpenseDetails from "./ExpenseDetails"

function PaymentDuePage() {

    return (
        <>
            <h2>Payment Due</h2>

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

export default PaymentDuePage
