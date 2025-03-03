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
const deleteExpense = (expense) => ({
    type: DELETE_EXPENSE,
    payload: expense
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

const UPDATE_EXPENSE = "UPDATE_EXPENSE"
const updateExpense = (expense) => ({
    type: UPDATE_EXPENSE,
    payload: expense
})

const CLEAR_EXPENSE_STATE = "CLEAR_EXPENSE_STATE"
export const clearExpenseState = () => ({
    type: CLEAR_EXPENSE_STATE
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
    // console.log("APIHFPIAWHFPIAOSHF", payload)
    const response = await csrfFetch("/api/expenses/", {
        method: 'POST',
        body: JSON.stringify(payload)
    })

     if (response.ok) {
        const result = await response.json()
        console.log("POJAPFIA", result)

        dispatch(create(result))
        return result
    } else {
        const errorResult = await response.json()
        throw new Error("Failed to create expense")
    }
}

// Thunk action for deleting an expense -ASL
export const deleteExpenseThunk = (id) => async dispatch => {
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
        // console.log("Fetched Data:", result);
        dispatch(amountOwed(result.Expense[0]))
        return result
    }
}

export const updateExpenseThunk = (id, updatedExpenseData) => async dispatch => {
    const response = await csrfFetch(`/api/expenses/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedExpenseData)
    })

    if (response.ok) {
        dispatch(updateExpense(id))
    }
}


// Make the expense reducer -ASL
const expenseReducer = (state={}, action) => {
    switch(action.type) {
        case LOAD_ALL_USER_EXPENSES: {
            const expenses = action.payload 
            return {
                ...expenses
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
            const newExpense = action.payload.payload;
            console.log("WE ARE CREATING THE EXPENSE", newExpense)
            return {
                ...state,
                expensesOwed: state?.expenses?.expensesOwed 
                    ? [...state.expenses.expensesOwed, newExpense] 
                    : [newExpense],  // If `expensesOwed` doesn't exist, initialize it
        
                oweExpenses: state?.expenses?.oweExpenses 
                    ? [...state.expenses.oweExpenses] 
                    : [],  // Ensure it doesn't break if `oweExpenses` is undefined
        
                totalAmountOwed: state?.expenses?.totalAmountOwed 
                    ? state.expenses.totalAmountOwed + (newExpense?.amount || 0) 
                    : newExpense?.amount || 0,  // Initialize if it doesn’t exist
        
                totalOwedAmount: state?.expenses?.totalOwedAmount 
                    ? state.expenses.totalOwedAmount + (newExpense?.amount || 0) 
                    : newExpense?.amount || 0,  // Fix typo and initialize
        
                totalOwesAmount: state?.expenses?.totalOwesAmount 
                    ? state.expenses.totalOwesAmount + 0 
                    : 0  // Initialize if missing
            };
        }
        case PAYMENT_DUE: {
            const paymentDue = action.payload;
            return {
                ...state,
                ...paymentDue
                // ...state,
                // expenses: {
                //     ...state.expenses,
                //     [paymentDue.id]: paymentDue
                }
            };
        case AMOUNT_OWED: {
            const amountOwed = action.payload;
            return {
                ...state,
                ...state.expense,
                [action.payload.id]: action.payload
            };
        }
        case DELETE_EXPENSE: {
            const deletedExpense = state.expenses?.expensesOwed?.find(expense => expense.id === action.payload);
            return {
                ...state,
                expensesOwed: state.expenses?.expensesOwed.filter(expense => expense.id !== action.payload),
                totalAmountOwed: state.expenses?.totalAmountOwed-(deletedExpense ? deletedExpense.amount : 0),
                totalOwedAmount: state.expenses?.totalOwedAmount-(deletedExpense ? deletedExpense.amount : 0)
                }
        }
        case UPDATE_EXPENSE:
            const updatedExpenses = { ...state.expenses };
            updatedExpenses[action.payload.id] = action.payload;
            return {
                ...state,
                expenses: updatedExpenses
            }

            case CLEAR_EXPENSE_STATE: {
                return {
                    expensesOwed: [],
                    owesExpenses: [],
                    totalAmountOwed: 0,
                    totalOwedAmount: 0,
                    totalOwesAmount: 0
                };
            }
        default:
            return state
    }
}

export default expenseReducer
