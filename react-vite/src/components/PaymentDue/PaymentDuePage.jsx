import ExpenseDetails from "./ExpenseDetailsPmtDue";
import { useNavigate, useParams } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";

function PaymentDuePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <>
      <div>
                <h2>Expenses</h2>
                <button onClick={() => navigate(`/expenses/${id}/comments`)}>View Comments</button>
            </div>

            <div>
                <ExpenseDetails />
            </div>

            <div>
                <li>
                    <OpenModalButton
                    buttonText="Expense Details"
                    />
                </li>
            </div>
    </>
  );
}

export default PaymentDuePage;
