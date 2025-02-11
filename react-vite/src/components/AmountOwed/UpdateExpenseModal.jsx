import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal"
import { useEffect, useState } from "react";
import { updateExpenseThunk } from "../../redux/expense";

function UpdateExpenseModal({ expenseId, currentExpense, onUpdateSuccess }) {

    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const [description, setDescription] = useState(currentExpense.description);
    const [amount, setAmount] = useState(currentExpense.amount);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setDescription(currentExpense.description);
        setAmount(currentExpense.amount)
    }, [currentExpense]);

    const handleUpdate = () => {
        const updatedExpenseData = {
            description,
            amount: parseFloat(amount)
        };

        const newErrors = {};

        if (typeof amount !== "number") {
            newErrors.amount = "Amount must be a number"
        }

        if (amount == 0) {
            newErrors.amount = "Amount must be greater than 0"
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        dispatch(updateExpenseThunk(expenseId, updatedExpenseData))
            .then(() => {
                closeModal();
                onUpdateSuccess();
            })
    }

    return (
        <>
            <div>
                <h1>Update Details</h1>
            </div>
            <div>
                <h2>FOR:</h2>
                <p>DESCRIPTION</p>
                <input
                    placeholder="New Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <h2>EXPENSE TOTAL:</h2>
                <p>TOTAL</p>
                <input
                    type='number'
                    min='1'
                    placeholder="New Total"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                />
                {errors.amount && <p className='error'>{errors.amount}</p>}
            </div>
            <div>
                <h2>OWES YOU:</h2>
                {currentExpense?.participants.map((participant, index) => (
                    <div key={index}>
                    {participant}
                    {currentExpense?.amount}
                    </div>
                ))}
            </div>
            <div>
                <button onClick={() => {
                    closeModal();
                    onUpdateSuccess();
                }}>CLOSE</button>
                <button onClick={handleUpdate}>UPDATE</button>
            </div>
        </>
    )
}

export default UpdateExpenseModal
