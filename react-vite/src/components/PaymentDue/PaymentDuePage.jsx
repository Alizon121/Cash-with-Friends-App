import ExpenseDetailsPmtDue from "./ExpenseDetailsPmtDue";
import { useNavigate, useParams } from "react-router-dom";

function PaymentDuePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <>
      <div>
        <ExpenseDetailsPmtDue />
      </div>
    </>
  );
}

export default PaymentDuePage;
