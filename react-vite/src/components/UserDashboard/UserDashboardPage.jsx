import { useSelector } from "react-redux"
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem"
import CreateExpenseModal from "../CreateExpenseModal/CreateExpenseModal"

function UserDashboardPage() {
    const user = useSelector(state => state.session)
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
        </div>
        
    </>
)}

export default UserDashboardPage