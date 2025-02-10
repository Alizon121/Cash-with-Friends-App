

function CreateExpenseModal() {


    return (
        <>
            <div>Invite: </div>
            <div>Amount: </div>
            <div>For: </div>
            <div>Date: {Date.now()}</div>
            <div>Comment: </div>
            <div className="create_expense_buttons">
                <button>Create</button>
                <button>Cancel</button>
            </div>
        </>
    )
}

export default CreateExpenseModal