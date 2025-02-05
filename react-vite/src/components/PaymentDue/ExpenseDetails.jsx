import styles from "./ExpenseDetails.module.css"
import { useParams } from 'react-router-dom'

const ExpenseDetails = () => {
    const { expenseId } = useParams();

}

export default ExpenseDetails
