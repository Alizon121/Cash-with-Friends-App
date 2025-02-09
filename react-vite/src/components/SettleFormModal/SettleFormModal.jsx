import { useModal } from "../../context/Modal"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { settleExpenseThunk } from "../../redux/expense"
import "./SettleForm.css"

function SettleFormModal({settled, expenseId, amount}) {
    const {closeModal} = useModal()
    const dispatch = useDispatch()
    // const [settle, setSettle] = useState(settled)
    // const [payment, setPayment] = useState(amount)
    // Set the default value to the fetched amount

    // We need to handle changing the payment amount to 0 when settle is clicked
    

    // This logic will ned to be refactored
    const handleSettle = async(e) => {
        e.preventDefault()

        if (settled === false) {
            settled = true
        }
        if (amount > 0) {
            amount = 0
        }
        console.log(settled)
        const payload = {
            settled,
            amount
        }

        await dispatch(settleExpenseThunk(payload, expenseId))
        closeModal()
    }

    return (
        <div className="settle_form_container">
            <h2>Settle</h2>
            <p>Pay ${amount}</p>
            <div>
                <button id="settle_button" onClick={handleSettle}>Save</button> 
                <button id="cancel_settle_button" onClick={closeModal}>Cancel</button>
            </div>
        </div>
    )
}

export default SettleFormModal