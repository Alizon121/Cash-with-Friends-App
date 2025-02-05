import { useModal } from "../../context/Modal"
import { useDispatch } from "react-redux"
import "./SettleForm.css"

function SettleFormModal({expenseId}) {
    const {closeModal} = useModal()
    const dispatch = useDispatch()

    const handleSettle = async() => {
        // Provide additional logic to settle an expense below
        await dispatch()
        closeModal()
    }

    return (
        <div className="settle_form_container">
            <h2>Settle</h2>
            <p>Pay{}</p>
            <div>
                <button id="settle_button" onClick={handleSettle}>Save</button>
                <button id="cancel_settle_button" onClick={closeModal}>Cancel</button>
            </div>
        </div>
    )
}

export default SettleFormModal