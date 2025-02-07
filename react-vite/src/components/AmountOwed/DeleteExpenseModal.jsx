import { useModal } from "../../context/Modal"

function DeleteExpenseModal() {

    const { closeModal } = useModal();

    return (
        <>
            <div>
                <h1>Delete</h1>
                <button onClick={closeModal}>X</button>
            </div>

            <div>
                <h2>
                    ARE YOU SURE YOU WANT TO DELETE THIS EXPENSE?
                </h2>
                <p></p>
            </div>

            <div>
                <button>DELETE</button>
                <button onClick={closeModal}>CLOSE</button>
            </div>
        </>
    )
}

export default DeleteExpenseModal
