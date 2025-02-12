import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem"
import CreateExpenseModal from "../CreateExpenseModal/CreateExpenseModal"
import AddFriendModal from "../AddFriendModal/AddFriendModal"
import { loadAllUserExpensesThunk } from "../../redux/expense"
import SettleFormModal from "../SettleFormModal/SettleFormModal"
import { useNavigate } from "react-router-dom"
import { getUsers } from "../../redux/users"

function UserDashboardPage() {
    const user = useSelector(state => state.session)
    const expense = useSelector(state => state.expenses, shallowEqual)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    
    useEffect(() => {
        dispatch(getUsers())
        dispatch(loadAllUserExpensesThunk())
    }, [dispatch])

    const handleSettleExpense = (expenseId) => {
        dispatch(loadAllUserExpensesThunk())
        // setRefreshKey((prevKey) => prevKey + 1)
    }

    // Make helper funciton to navigate to payment_due details page
    const navigatePaymentDuePage = async (id) => {
        navigate(`/expenses/${id}/payment_due`)
    }

    // Make a helper function to navigate to amount_owed details page:
    const navigateAmountOwedPage = async(id) => {
        navigate(`/expenses/${id}/amount_owed`)
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
                <div>Total Amount: {expense?.totalAmountOwed?.toFixed(2)}</div>
                <div>Amount Owed: {expense?.totalOwedAmount?.toFixed(2)}</div>
                <div>User Owes: {expense?.totalOwesAmount?.toFixed(2)}</div>
            </div>


            <div>
                <h3>You Owe:</h3>
                <div>
                    <div>
                        {expense?.owesExpenses?.map(participant => (
                        <div key={participant.id}>
                            <span>
                                <div>{participant.createdBy}</div>
                                <div>{participant.amount.toFixed(2)}</div>
                            </span>
                            <span>
                                {
                                participant.amount === 0 ?    
                                <button disabled={true}>
                                    <OpenModalMenuItem
                                        itemText={"Settle"}
                                        modalComponent={<SettleFormModal onSettle={() => handleSettleExpense(participant.id)} settled={participant.settled} expenseId={participant.id} amount={participant?.amount.toFixed(2)}/>}
                                    />
                                </button> :
                                 <button disabled={false}>
                                 <OpenModalMenuItem
                                     itemText={"Settle"}
                                     modalComponent={<SettleFormModal onSettle={() => handleSettleExpense(participant.id)} settled={participant.settled} expenseId={participant.id} amount={participant?.amount.toFixed(2)}/>}
                                 />
                             </button>
                                }
                                <button onClick={() => navigatePaymentDuePage(participant.id)}>
                                    Details
                                </button>
                            </span>
                        </div>
                        ))}
                        </div>
                </div>
                <div>
                    <h3>You Are Owed:</h3>
                    {expense?.expensesOwed && expense?.expensesOwed.length > 0 ? 
                        expense?.expensesOwed.map(expense => (
                            <div key={expense.id}>
                                {expense.username.map(user => (
                                    <div key={user.id}>  
                                        <div>
                                            <div>{user}</div>
                                            <div>
                                                {(expense.amount/((expense.username).length)).toFixed(2)}
                                            </div>
                                        </div>
                                        <div>
                                            <button onClick={() => navigateAmountOwedPage(expense.id)}>
                                                Details
                                            </button>
                                        </div>       
                                    </div>
                                ))}
                            </div>
                        )) : <p>No expenses found</p>
                    }
                </div>
            </div>
        </div>
        
    </>
)}

export default UserDashboardPage