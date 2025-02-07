import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem"
import CreateExpenseModal from "../CreateExpenseModal/CreateExpenseModal"
import AddFriendModal from "../AddFriendModal/AddFriendModal"

function UserDashboardPage() {
    const user = useSelector(state => state.session)
    const dispatch = useDispatch()

    // useEffect(() => {
        // Add the thunk actions for amount user owes and amount user is owed
            // We may need to modify the backend to have the route diaply the total amounts
    //     dispatch()
    // })
    
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
                <span></span>
            </div>
        </div>
        
    </>
)}

export default UserDashboardPage