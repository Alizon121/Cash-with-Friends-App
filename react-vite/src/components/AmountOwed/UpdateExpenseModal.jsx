import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal"
import { useEffect, useState } from "react";
import { updateExpenseThunk } from "../../redux/expense";

function UpdateExpenseModal({ expenseId, currentExpense, onUpdateSuccess }) {

    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const [description, setDescription] = useState(currentExpense.description);
    const [amount, setAmount] = useState(currentExpense.amount);

    useEffect(() => {
        setDescription(currentExpense.description);
        setAmount(currentExpense.amount)
    }, [currentExpense]);

    const handleUpdate = () => {
        const updatedExpenseData = {
            description,
            amount: parseFloat(amount)
        };

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
                <button onClick={closeModal}>X</button>
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
                    placeholder="New Total"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
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
