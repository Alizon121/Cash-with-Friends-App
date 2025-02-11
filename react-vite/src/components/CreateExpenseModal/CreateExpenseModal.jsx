import { useState } from "react";
import { createExpenseThunk } from "../../redux/expense";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function CreateExpenseModal() {
    const [amount, setAmount] = useState(Number(0).toFixed(2))
    const [forDescription, setForDescription] =useState("")
    const [comment, setComment] = useState("")
    const [participants, setParticipants] = useState(null)
    const [errors, setErrors] = useState({})
    const dispatch = useDispatch()
    const {closeModal} = useModal()
    const navigate = useNavigate()
    
    // Date logic -ASL
    const now = new Date(Date.now());
    // Get individual components
    const month = String(now.getMonth() + 1).padStart(2, '0');  // Months are 0-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const year = now.getFullYear();
    
    const handleSubmit = async (e) => {
        e.preventDefault()

        const newErrors = {}

        if (!amount) newErrors.amount = "Amount is required"
        if (amount < 0.01) newErrors.amount = "Amount must be greater than 1"

        if (!forDescription) newErrors.forDescription = "Description is required"
        if (!participants) newErrors.participants = "Provide at least one participant"

        if (Object.keys(newErrors).length > 0) { 
            setErrors(newErrors); 
            return; 
        }

        const payload = {
            amount: amount,
            description: forDescription,
            date: `${month}/${day}/${year}`,
            participants: participants,
            settled: false
        }

        try {
            await dispatch(createExpenseThunk(payload))
            navigate("/users/dashboard")
            closeModal()
        } catch (e) {
            console.error("Unable to create the expense")
        }
    }
    return (
        <>
            <h2>Create an Expense</h2>
            <form onSubmit={handleSubmit}>
                <div>Invite: 
                    <input

                    />
                    {errors.participants && <p className="error">{errors.participants}</p>}
                </div>
                <div>Amount: 
                    <input
                        type="number"
                        min="1.00"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                    />
                    {errors.amount && <p className="error">{errors.amount}</p>}
                </div>
                <div>
                    For: 
                    <input
                        type="text"
                        value={forDescription}
                        onChange={e => setForDescription(e.target.value)}
                    />
                    {errors.forDescription && <p className="error">{errors.forDescription}</p>}
                </div>
                <div>Date: {`${month}/${day}/${year}`}</div>
                <div>
                    Comment:
                    <input
                        type="text"
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                    />     
                </div>
                {errors.forDescription && <p className="error">{errors.forDescription}</p>}
                <div className="create_expense_buttons">
                    <button type="submit">Create</button>
                    <button type="button" onClick={closeModal}>Cancel</button>
                </div>
            </form>
        </>
    )
}

export default CreateExpenseModal