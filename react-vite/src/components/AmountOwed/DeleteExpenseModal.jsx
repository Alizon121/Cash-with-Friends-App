import { useModal } from "../../context/Modal"
import { deleteExpenseThunk } from "../../redux/expense";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";

function DeleteExpenseModal({expenseId, onDelete}) {
    const { closeModal } = useModal();
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const handleDelete = async (e) => {
        try {e.preventDefault()
        await dispatch(deleteExpenseThunk(expenseId))
        closeModal()
        onDelete(expenseId)
        navigate("/users/dashboard")
        } catch(e){
            console.error("Failed to delete an expense", e)
        }
    }

    return (
        <>
            <div>
                <h1>Delete</h1>
                {/* <button onClick={closeModal}>X</button> */}
            </div>

            <div>
                <h2>
                    ARE YOU SURE YOU WANT TO DELETE THIS EXPENSE?
                </h2>
                <p></p>
            </div>

            <div>
                <button onClick={handleDelete}>DELETE</button>
                <button onClick={closeModal}>CLOSE</button>
            </div>
        </>
    )
}

export default DeleteExpenseModal
