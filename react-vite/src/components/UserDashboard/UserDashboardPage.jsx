import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem"
import CreateExpenseModal from "../CreateExpenseModal/CreateExpenseModal"
import AddFriendModal from "../AddFriendModal/AddFriendModal"
import { loadAllUserExpensesThunk } from "../../redux/expense"

function UserDashboardPage() {
    const user = useSelector(state => state.session)
    const expense = useSelector(state => state.expenses)
    const dispatch = useDispatch()

    useEffect(() => {
        // Add the thunk actions for amount user owes and amount user is owed
        //     We may need to modify the backend to have the route diaply the total amounts
        dispatch(loadAllUserExpensesThunk())
    }, [dispatch])
    
    return (
    <>
        <div>
            <h2>{user.user.first_name}'s' Dashboard</h2>
            <button>
                <OpenModalMenuItem
                    modalComponent={<CreateExpenseModal />}
                    itemText={"Create"}
                />
            </button>
            <button>
                <OpenModalMenuItem
                    modalComponent={<AddFriendModal/>}
                    itemText={"Add Friend"}
                />
            </button>
            <div>
                <div>Total Amount: {expense.expenses.totalAmountOwed}</div>
                <div>Amount Owed: {expense.expenses.totalOwedAmount}</div>
                <div>User Owes: {expense.expenses.totalOwesAmount}</div>
            </div>

            <div>
                <h3>You Owe:</h3>
                <div>
                    <span>{expense.expenses.owesExpenses.map(participant => participant.createdBy)}</span>
                    <span></span>
                </div>
            </div>
        </div>
        
    </>
)}

export default UserDashboardPage