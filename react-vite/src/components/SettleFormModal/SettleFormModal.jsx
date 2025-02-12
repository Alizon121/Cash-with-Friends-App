import { useModal } from "../../context/Modal"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { settleExpenseThunk } from "../../redux/expense"
import "./SettleForm.css"

function SettleFormModal({onSettle, settled, expenseId, amount}) {
    const {closeModal} = useModal()
    const dispatch = useDispatch()

    // We need to handle changing the payment amount to 0 when settle is clicked
    const handleSettle = async(e) => {
        e.preventDefault()

        if (settled === false) {
            settled = true
        }
        if (amount > 0) {
            amount = 0
        }
        const payload = {
            settled,
            amount
        }

        await dispatch(settleExpenseThunk(payload, expenseId))
        onSettle(expenseId)
        closeModal()
    }

    return (
        <div className="settle_form_container">
            <h2 id="settle_form_header">Settle</h2>
            <div className="settle_form_pay_buttons_container">
                    <p id="settle_form_pay">Select "Save" to pay amount</p>
                    <li id="settle_form_amount">Pending Amount: ${amount}</li>
                <div className="settle_form_button_container">
                    <button id="settle_button" onClick={handleSettle}>Save</button> 
                    <button id="cancel_settle_button" onClick={closeModal}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default SettleFormModal