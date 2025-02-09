import { csrfFetch } from "./csrf";

/***************** Action Creators *************************/

// Make an action for settling/updating an expense -ASL
const SETTLE_EXPENSE = "SETTLE_EXPENSE"
const settle = (expense) => ({
    type: SETTLE_EXPENSE,
    payload: expense
})

// Make an action creater for creating an expense -ASL
const CREATE_EXPENSE = "CREATE_EXPENSE"
const create = (expense) => ({
    type: CREATE_EXPENSE,
    payload: expense
})

// Make an action creator for grabbing all user expense data -ASL
const LOAD_ALL_USER_EXPENSES = "LOAD_ALL_USER_EXPENSES"
const loadAll = (expense) => ({
    type: LOAD_ALL_USER_EXPENSES,
    payload: expense
})

// Make an action creator for deleting an expense -ASL
const DELETE_EXPENSE = "DELETE_EXPENSE"
const deleteExpense = (id) => ({
    type: DELETE_EXPENSE,
    payload: {id}
})

// action for fetching expense details for payment_due page
// and for amount_owed
const PAYMENT_DUE = "PAYMENT_DUE"
const AMOUNT_OWED = "AMOUNT_OWED"


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



/******************* Thunk Actions *******************/

// Make a thunk action for grabbing all using expense info -ASL
export const loadAllUserExpensesThunk = () => async dispatch => {
    const response = await csrfFetch("/api/expenses/users/dashboard")

    if (response.ok) {
        const result = await response.json()
        dispatch(loadAll(result))
        return result
    } else {
        const errorResult = await response.json()
        console.error(errorResult)
    }
}

// Make a thunk action that will settle an expense -ASL
export const settleExpenseThunk = (settled, expenseId) => async dispatch => {
    console.log(typeof expenseId)
    const response = await csrfFetch(`/api/expenses/${expenseId}/settle`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({settled})
    })

    if (response.ok) {
        const result = await response.json()
        dispatch(settle(result))
        return result
    }
}

// Thunk action for creating an expense -ASL
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

// Thunk action for deleting an expense -ASL
export const deleteExpenseThunk = (id) => async dispatch => {
    // console.log("IJAHBFIHABSFLUHASBFLUHASFB", typeof id)
    const response = await csrfFetch(`/api/expenses/${id}`, {
        method: 'DELETE',
    })

    if (response.ok) {
        dispatch(deleteExpense(id))
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
        console.log("Fetched Data:", result);
        dispatch(amountOwed(result.Expense[0]))
        return result
    }
}


// Make the expense reducer -ASL
const expenseReducer = (state={}, action) => {
    switch(action.type) {
        case LOAD_ALL_USER_EXPENSES: {
            const expenses = action.payload
            return {
                ...state,
                expenses: {
                    ...state.expenses,
                    ...expenses
                }
            }
        }
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
                ...state.expense,
                [action.payload.id]: action.payload
            };
        }
        case DELETE_EXPENSE: {
            const newState = {...state}
            delete newState[action.payload.id]
            return newState
        }
        default:
            return state
    }
}

export default expenseReducer
