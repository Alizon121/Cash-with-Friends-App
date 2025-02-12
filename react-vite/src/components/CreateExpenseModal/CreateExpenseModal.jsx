import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { createExpenseThunk } from "../../redux/expense";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function CreateExpenseModal() {
    const [amount, setAmount] = useState(Number(0).toFixed(2))
    const [forDescription, setForDescription] =useState("")
    const [comment, setComment] = useState("")
    const [selectedValue, setSelectedValue] = useState([])
    const [errors, setErrors] = useState({})
    const [selectedFriends, setSelectedFriends] = useState([])
    const friends = useSelector(state => state.friends)
    const dispatch = useDispatch()
    const {closeModal} = useModal()
    const navigate = useNavigate()
    const usernames = Object.values(friends.friends).map(user => user.username)

    // Add logic for selecting participants
    const handleChange = (event) =>  {
        const options = event.target.options;
        const selectedValues = [];
        for (let i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                selectedValues.push(options[i].value);
            }
        }
    setSelectedFriends(selectedValues);
    // console.log(selectedValues);
    }


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
        if (!selectedValue) newErrors.selectedFriends = "Provide at least one friend"

        if (Object.keys(newErrors).length > 0) { 
            setErrors(newErrors); 
            return; 
        }

        const payload = {
            amount: Number(amount),
            description: forDescription,
            date: `${month}/${day}/${year}`,
            participants: selectedFriends
        }

        try {
            await dispatch(createExpenseThunk(payload))
            setAmount(0)
            setForDescription("")
            setSelectedValue("")
            navigate("/")
            closeModal()
        } catch (e) {
            console.error("Unable to create the expense", e)
        }
    }
    return (
        <>
            <h2>Create an Expense</h2>
            <form onSubmit={handleSubmit}>
                <div>Invite: 
                    <select
                        onChange={handleChange}
                        value={selectedFriends}
                        multiple
                    > 
                        {usernames ? usernames.map((username, index) => (
                            <option key={index} value={username}>{username}</option>
                        )): 
                            <option>Add friends to create an expense</option>
                        }
                    </select>
                    {errors.selectedFriends && <p className="error">{errors.selectedFriends}</p>}
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