import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem"
import CreateExpenseModal from "../CreateExpenseModal/CreateExpenseModal"
import AddFriendModal from "../AddFriendModal/AddFriendModal"
import { loadAllUserExpensesThunk } from "../../redux/expense"
import SettleFormModal from "../SettleFormModal/SettleFormModal"
import { useNavigate } from "react-router-dom"

function UserDashboardPage() {
    const user = useSelector(state => state.session)
    const expense = useSelector(state => state.expenses)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        // Add the thunk actions for amount user owes and amount user is owed
        //     We may need to modify the backend to have the route diaply the total amounts
        dispatch(loadAllUserExpensesThunk())
    }, [dispatch])

    // Make helper funciton to navigate to payment_due details page
    const navigatePaymentDuePage = async (id) => {
        navigate(`/expenses/${id}/payment_due`)
    }
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
                <div>Total Amount: {expense.expenses?.totalAmountOwed}</div>
                <div>Amount Owed: {expense.expenses?.totalOwedAmount}</div>
                <div>User Owes: {expense.expenses?.totalOwesAmount}</div>
            </div>


            <div>
                <h3>You Owe:</h3>
                <div>
                    <div>
                        {expense.expenses?.owesExpenses.map(participant => (
                        <>
                            <span>
                                <div>{participant.createdBy}</div>
                                <div>{participant.amount}</div>
                            </span>
                            <span>
                                <button>
                                    <OpenModalMenuItem
                                        itemText={"Settle"}
                                        modalComponent={<SettleFormModal settled={participant.settled}/>}
                                    />
                                </button>
                                <button onClick={() => navigatePaymentDuePage(participant.id)}>
                                    Details
                                </button>
                            </span>
                        </>
                        ))}
                        </div>
                </div>
            </div>
        </div>
        
    </>
)}

export default UserDashboardPage