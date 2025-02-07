import { csrfFetch } from "./csrf";

////////////////////////////// Action Creators///////////////////////

// Make an action for settling/updating an expense -ASL
const SETTLE_EXPENSE = "SETTLE_EXPENSE"
const settle = (expense) => {
    type = SETTLE_EXPENSE,
    payload = expense
}

// Make an action creater for creating an expense -ASL
const CREATE_EXPENSE = "CREATE_EXPENSE"
const create = (expense) => {
    type = CREATE_EXPENSE
    payload = expense
}

////////////////////// Thunk Actions ////////////////////////////

// Make a thunk action that will settle an expense -ASL
export const settleExpenseThunk = (expenseId) => async dispatch => {
    const response = await csrfFetch(`/api/expenses/${expenseId}`, {
        method: 'POST',
        body: JSON.stringify(payload)
    })

    if (response.ok) {
        const result = await response.json()
        dispatch(settle)
        return result
    }
}

// Thunk action for creating an expense
export const createExpenseThunk = (payload) => async dispatch => {
    const response = await csrfFetch("/api/expenses/", {
        method: 'POST',
        body: JSON.stringify(payload)
    })

    if (response.ok) {
        const result = await response.json()
        dispatch(create) 
        return result
    } else {
        const errorResult = await response.json()
        console.error(errorResult)
        throw new Error("Failed to create expense")
    }
}

// Make the expense reducer -ASL
const expenseReducer = (state={}, action) => {
    switch(action.type) {
        case SETTLE_EXPENSE: {
            const settledExpense = action.payload
            return {
                ...state,
                [settledExpense.id]:settledExpense
            }
        }
        case CREATE_EXPENSE: {
            return {
                ...state,
                [action.payload.id]: {
                    ...action.payload
                }
            }
        }
        default:
            return state
    }
}

export default expenseReducer