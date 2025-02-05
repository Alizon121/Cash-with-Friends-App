import { csrfFetch } from "./csrf";

// Make an action for settling/updating an expense
const SETTLE_EXPENSE = "SETTLE_EXPENSE"

// action for fetching expense details for payment_due page
const PAYMENT_DUE = "PAYMENT_DUE"

// Make an action creator for settling/updating an expense
const settle = (expense) => {
    type = SETTLE_EXPENSE,
    payload = expense
}

// Action creator to fetch expense details for payment_due page
const paymentDue = (expense) => {
    type = PAYMENT_DUE,
    payload = expense
}

// Make a thunk action that will settle an expense
export const settleExpenseThunk = (expenseId) => async dispatch => {
    const response = await csrfFetch(`expenses/${expenseId}`, {
        method: 'POST',
        body: JSON.stringify(payload)
    })

    if (response.ok) {
        const result = await response.json()
        dispatch(settle)
        return result
    }
}

// Fetch expense details for payment_due page
export const paymentDueThunk = (expenseId) => async dispatch => {
    const response = await csrfFetch(`/api/expenses/${expenseId}/payment_due`, {
        method: 'GET',
        body: JSON.stringify(payload)
    })

    if (response.ok) {
        const result = await response.json()
        dispatch(paymentDue)
        return result
    }
}

const expenseReducer = (state={}, action) => {
    switch(action.type) {
        case SETTLE_EXPENSE: {
            const settledExpense = action.payload
            return {
                ...state,
                [settledExpense.id]:settledExpense
            }
        }
        default:
            return state
    }
}

export default expenseReducer
