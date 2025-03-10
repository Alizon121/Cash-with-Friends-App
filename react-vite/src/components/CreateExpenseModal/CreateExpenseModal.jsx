import { useState } from "react";
import { useSelector } from "react-redux";
import { createExpenseThunk, loadAllUserExpensesThunk } from "../../redux/expense";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./CreateExpense.css"

function CreateExpenseModal() {
    const [amount, setAmount] = useState(0)
    const [forDescription, setForDescription] =useState("")
    const [comment, setComment] = useState("")
    const [errors, setErrors] = useState({})
    const [selectedFriends, setSelectedFriends] = useState("")
    const currentUser = useSelector(state => state.session.user)
    const users = useSelector(state => state.users.users)
    const usernames = Object.values(users).map(user => user.username)
    const dispatch = useDispatch()
    const {closeModal} = useModal()
    const navigate = useNavigate()
    // const regex = /^(\w+(,\s)?)*$/;
    
    // Date logic -ASL
    const now = new Date(Date.now());
    // Get individual components
    const month = String(now.getMonth() + 1).padStart(2, '0');  // Months are 0-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const year = now.getFullYear();
    
    // Logic for validations and submission
    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const newErrors = {}
        
        // Amount validations
        if (!amount) newErrors.amount = "Amount is required"
        if (amount < 1.00) newErrors.amount = "Amount must be greater than 1"
        
        // Description validations
        if (!forDescription) newErrors.forDescription = "Description is required"

        const participantErrors = []
        if (!selectedFriends) {
            participantErrors.push("Provide only one friend.");
        } 

        if (selectedFriends.split(", ").length > 1) {
            participantErrors.push("Please provide only one username")
        }

        // else if (!regex.test(selectedFriends)) {
        //     participantErrors.push("Usernames must be separated by ', '");
        // } 
        
        else {
            const participants = selectedFriends.split(", ");
            if (participants.includes(currentUser.username)) {
                participantErrors.push("Current user cannot be part of this expense.");
            }
            participants.forEach(user => {
                if (!usernames.includes(user)) {
                    participantErrors.push(`Invalid username: ${user}`);
                }
            });
        }

        if (participantErrors.length > 0) {
            newErrors.selectedFriends = participantErrors.join(" ");
        }
        // // Particiipants validations (selectedFriends)
        // if (!selectedFriends) newErrors.selectedFriends = "Provide at least one friend"
        // if (!regex.test(selectedFriends)) {newErrors.selectedFriends = "Usernames must be separated by ', '"
        // } else {
        //     if (selectedFriends.includes(currentUser.username)) {newErrors.selectedFriends = "Current user cannot be part of this expense"
        //     }
        //     selectedFriends.split(", ").filter(element => 
        //         {if (!usernames.includes(element)) newErrors.selectedFriends = "Please provide a valid username"}
        //     )
        // }
        if (Object.keys(newErrors).length > 0) { 
            setErrors(newErrors); 
            return; 
        }

        const payload = {
            amount: Number(amount),
            description: forDescription,
            date: `${month}/${day}/${year}`,
            participants: selectedFriends.split(", ")
        }

        try {
            await dispatch(createExpenseThunk(payload))
            await dispatch(loadAllUserExpensesThunk())
            setAmount(0)
            setForDescription("")
            setSelectedFriends("")
            navigate("/")
            closeModal()
        } catch (e) {
            newErrors.server = "Server error. Unable to create expense"
            console.error("Unable to create the expense", e)
            setErrors(newErrors)
        }
    }
    return (
        <div className="create_expense_container">
            <h2>Create an Expense</h2>
            {errors.server && <p className="error">{errors.server}</p>}
            <form className="create_expense_form_container" onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            placeholder="Add Usernames"
                            value={selectedFriends}
                            onChange={(e) => setSelectedFriends(e.target.value)}
                        />
                        {errors.selectedFriends && <p className="error">{errors.selectedFriends}</p>}
                    </div>
                    <div> 
                        <input
                            type="number"
                            placeholder="Amount"
                            min="1.00"
                            value={amount}
                            onChange={e => setAmount(Number(e.target.value))}
                        />
                        {errors.amount && <p className="error">{errors.amount}</p>}
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Add Comment"
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                        />     
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="What is this for?"
                            value={forDescription}
                            onChange={e => setForDescription(e.target.value)}
                        />
                        {errors.forDescription && <p className="error">{errors.forDescription}</p>}
                    </div>
                    <div id="create_expense_form_date">Date: {`${month}/${day}/${year}`}</div>
                    {/* {errors.forDescription && <p className="error">{errors.forDescription}</p>} */}
                    <div className="create_expense_buttons">
                        <button id="create_expense_submit_button" type="submit">Create</button>
                        <button id="create_expense_cancel_button" type="button" onClick={closeModal}>Cancel</button>
                    </div>
            </form>
        </div>
    )
}

export default CreateExpenseModal