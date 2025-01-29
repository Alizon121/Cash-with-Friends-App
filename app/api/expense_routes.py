from flask import Blueprint, redirect, jsonify
from flask_login import login_required, LoginManager, current_user
from app.models import User
from app.models.expenses import Expense, expense_participants



expense_routes = Blueprint('expenses', __name__)


@expense_routes.route("/users/dashboard", methods=["GET"])
@login_required
def pending_expenses():
    '''
        Query for current users pending expenses and amount owed 
    '''
    # Use authorization logic here:
    if current_user.is_authenticated:
        expense_data=[]

        # Query to get what the user is owed
        '''
        {'id': 1, 'description': 'AYCE dinner with friends', 'amount': 90.0, 
        'settled': False, 'created_by': 1, 
        'created_at': '2025-01-28T19:45:08.554022', 
        'updated_at': '2025-01-28T19:45:08.554039'
        }
        '''
        user_is_owed = User.query.get(current_user.id).expenses[0].to_dict()
        
        # Error message for no user being owed something
        if not user_is_owed:
            return jsonify({"Message": "User is currently not owed any amount."})
        
        owed_data= {
            "id": user_is_owed["id"],
            "amount": user_is_owed["amount"],
            "settled": user_is_owed["settled"],
            # "createdAt": user_is_owed["created_at"]
        }

        expense_data.append(owed_data)

        # Query to get what the user owes
        user_owes = User.query.get(current_user.id).participant_expenses

        if not user_owes:
            return jsonify({"Message": "User does not currently owe anything."})

        for expense in user_owes:
            owes_data = {
                "id": expense.id,
                "userId": current_user.id, 
                "amount": (expense.amount/len(expense.participants)),
                "description": expense.description,
                "settled": expense.settled,
                "createdBy": expense.created_by,
                "participants": [user.username for user in expense.participants],
                # "createdAt": user_owes.created_at
            }
        
        expense_data.append(owes_data)

        return jsonify({"Expenses": expense_data})
    
    else:
        return {"error": "unauthorized"}, 403


@expense_routes.route("/<int:id>/payment_due")
def amount_user_owes(id):
    '''
        Query for current users amount OWES details
    '''

    '''
        What the expense_owes var returns:
        {'id': 2, 'description': 'Unforgettable birthday at the club', 
        'amount': 150.0, 'settled': False, 'created_by': 3, 
        'created_at': '2025-01-28T19:45:08.554022', 
        'updated_at': '2025-01-28T19:45:08.554039'}
    '''
    if current_user.is_authenticated:
        # Make a list var for returning json:
        expense_data=[]

        # Query to get the what the user details for a specific expense
        expense_owes = Expense.query.join(
            expense_participants, Expense.id == expense_participants.c.expense_id
        ).filter(
            expense_participants.c.user_id == current_user.id,
            Expense.id == id
        ).first()

        # Query to get who the participants are in the expense
        # Will serve to get the user's amount owed
        def get_num_participants():
            find_participants = User.query.get(current_user.id).participant_expenses
            user_data = {data for data in find_participants if data.id == id} #find_participants[0].participants
            for participant in user_data:
                return len(participant.participants)
            
        def get_other_participants():
            find_participants = User.query.get(current_user.id).participant_expenses
            user_data = {data for data in find_participants if data.id == id} #find_participants[0].participants
            for participant in user_data:
                return [users.username for users in participant.participants]


        if not expense_owes:
            return jsonify({"Message": "User does not owe any expenses"})
        
        owe_data = {
            "id": expense_owes.id,
            "description": expense_owes.description,
            "amount": (expense_owes.amount/get_num_participants()),
            "settled": expense_owes.settled,
            "participants": get_other_participants()
        }


        expense_data.append(owe_data)

        return jsonify({"Expenses": expense_data})
    else:
        return {"error": "unauthorized"}, 403


@expense_routes.route("/<int:id>/amount_owed", methods=["GET"])
@login_required
def amount_user_is_owed(id):
    '''
        Query for current users amount OWED details
    '''
    expense_data = []

    if current_user.is_authenticated:
        # Query for the user's created expenses
        user_is_owed = User.query.get(current_user.id).expenses

        # Select only the expense that corresponds with id in path:
        expense_detail = [data for data in user_is_owed if data.id==id]

        # Query for a particpant's individual amount (see below):
        particpant_owes = User.query.

        # Iterate over the queried data and add to dict:
        for expense in expense_detail:
            is_owed_data = {
                "id":expense.id,
                "description": expense.description,
                "amount": expense.amount,
                "settled": expense.settled,
                "participants": [user.username for user in expense.participants],
                # Query for a participants's individual amount (see above)
                "particpant_amount": ""
            }
        print("KOKOKOKOKOKOKOKOKOKOKOKOK", [user.to_dict() for user in expense.participants])