import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem"
import CreateExpenseModal from "../CreateExpenseModal/CreateExpenseModal"
import AddFriendModal from "../AddFriendModal/AddFriendModal"
import { loadAllUserExpensesThunk } from "../../redux/expense"
import SettleFormModal from "../SettleFormModal/SettleFormModal"
import { useNavigate } from "react-router-dom"
import { getUsers } from "../../redux/users"
import "./UserDashboard.css"

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
    {/* Dashboard Header */}
        <div>
            <div className="dashboard_header_container">
                <h2>{user.user.first_name}'s' Dashboard</h2>
                <div className="dashboard_create_add_buttons_container">
                    <button id="dashboard_create_expense_button">
                        <OpenModalMenuItem
                            modalComponent={<CreateExpenseModal />}
                            itemText={"Create"}
                            
                        />
                    </button>
                    <button id="dashboard_add_friend_button">
                        <OpenModalMenuItem
                            modalComponent={<AddFriendModal/>}
                            itemText={"Add Friend"}
                        />
                    </button>
                </div>
            </div>
        {/* Dashboard sub-header */}
            <div className="dashboard_expenses_summary_container">
                <div>Total Amount: {expense?.totalAmountOwed?.toFixed(2)}</div>
                <span>|</span>
                <div>Amount Owed: {expense?.totalOwedAmount?.toFixed(2)}</div>
                <span>|</span>
                <div>User Owes: {expense?.totalOwesAmount?.toFixed(2)}</div>
            </div>

            {/* Body Title Headers */}
            <div className="dashboard_body_titles">
                <div>
                    <h3 id="dashboard_owes_title">You Owe</h3>
                </div>
                <div>
                    <h3 id="dashboard_you_are_owed_title">You Are Owed</h3>
                </div>
            </div>

             {/*Body  */}
            <div className="dashboard_owe_and_owed_container">
                <div>
                        <div className="dashboard_you_owe_container">
                            {expense?.owesExpenses?.map(participant => (
                            <div key={participant.id}>
                                <div className="dashboard_body_created_amount">
                                    <div>{participant.createdBy}</div>
                                    <div>{participant.amount.toFixed(2)}</div>
                                </div>
                                <span className="dashboard_settle_details_container">
                                    {
                                    participant.amount === 0 ?    
                                    <button disabled={true}>
                                        <OpenModalMenuItem
                                            itemText={"Settle"}
                                            modalComponent={<SettleFormModal onSettle={() => handleSettleExpense(participant.id)} settled={participant.settled} expenseId={participant.id} amount={participant?.amount.toFixed(2)}/>}
                                        />
                                    </button> :
                                    <button id="dashboard_settle_button" disabled={false}>
                                    <OpenModalMenuItem
                                        itemText={"Settle"}
                                        modalComponent={<SettleFormModal onSettle={() => handleSettleExpense(participant.id)} settled={participant.settled} expenseId={participant.id} amount={participant?.amount.toFixed(2)}/>}
                                    />
                                    </button>
                                    }
                                    <button id="dashboard_you_owe_details_button" onClick={() => navigatePaymentDuePage(participant.id)}>
                                        Details
                                    </button>
                                </span>
                            </div>
                            ))}
                        </div>
                </div>
                <div className="divider"></div>
                <div className="dashboard_you_are_owed_container">
                    {expense?.expensesOwed && expense?.expensesOwed.length > 0 ? 
                        expense?.expensesOwed.map(expense => (
                            <div className="dashboard_you_are_owed_info_container" key={expense.id}>
                                {expense.username.map(user => (
                                    <div className="dashboard_you_are_owed_user_amount_details" key={user.id}>  
                                        <div className="dashboard_you_are_owed_user_expenses">
                                            <div>{user}</div>
                                            <div>
                                                {(expense.amount/((expense.username).length)).toFixed(2)}
                                            </div>
                                        </div>
                                        <div className="dashboard_you_are_owed_details_container">
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