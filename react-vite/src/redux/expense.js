import { csrfFetch } from "./csrf";

// Make an action for settling/updating an expense
const SETTLE_EXPENSE = "SETTLE_EXPENSE"
// Make an action creator for settling/updating an expense
const settle = (expense) => {
    type = SETTLE_EXPENSE,
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