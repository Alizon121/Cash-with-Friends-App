import { csrfFetch } from "./csrf";

// Make an action for settling/updating an expense
const SETTLE_EXPENSE = "SETTLE_EXPENSE"

// action for fetching expense details for payment_due page
// and for amount_owed
const PAYMENT_DUE = "PAYMENT_DUE"
const AMOUNT_OWED = "AMOUNT_OWED"

// Make an action creator for settling/updating an expense
const settle = (expense) => ({
    type: SETTLE_EXPENSE,
    payload: expense
})

// Action creator to fetch expense details for payment_due page
// And for amount_owed page
const paymentDue = (expense) => ({
    type: PAYMENT_DUE,
    payload: expense
});

const amountOwed = (expense) => ({
    type: AMOUNT_OWED,
    payload: expense
})

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
// and for amount_owed page
export const paymentDueThunk = (expenseId) => async (dispatch) => {
    const response = await csrfFetch(`/api/expenses/${expenseId}/payment_due`, {
        method: 'GET'
    });

    if (response.ok) {
        const result = await response.json();
        dispatch(paymentDue(result.Expenses[0]));
        return result;
    }
};



export const amountOwedThunk = (expenseId) => async dispatch => {
    const response = await csrfFetch(`/api/expenses/${expenseId}/amount_owed`, {
        method: 'GET',
    })

    if (response.ok) {
        const result = await response.json()
        dispatch(amountOwed(result))
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
        case PAYMENT_DUE: {
            const paymentDue = action.payload;
            return {
                ...state,
                expenses: {
                    ...state.expenses,
                    [paymentDue.id]: paymentDue
                }
            };
        }
        case AMOUNT_OWED: {
            const amountOwed = action.payload;
            return {
                ...state,
                expenses: {
                    ...state.expenses,
                    [amountOwed.id]: amountOwed
                }
            };
        }
        default:
            return state
    }
}

export default expenseReducer
