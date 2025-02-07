import { useModal } from "../../context/Modal"

function UpdateExpenseModal() {

    const { closeModal } = useModal();

    return (
        <>
            <div>
                <h1>Update Details</h1>
                <button onClick={closeModal}>X</button>
            </div>

            <div>
                <h2>FOR:</h2>
                <p>DESCRIPTION</p>
                <input placeholder="New Description"></input>

                <h2>EXPENSE TOTAL:</h2>
                <p>TOTAL</p>
                <input placeholder="New Total"></input>

                <h2>PARTICIPANTS</h2>
                <p></p>
            </div>

            <div>
                <button onClick={closeModal}>CLOSE</button>
                <button>UPDATE</button>
            </div>
        </>
    )
}

export default UpdateExpenseModal
