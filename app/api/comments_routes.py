from flask import Blueprint, request
from app.models import Comment, Expense, db
from flask_login import login_required, current_user
from forms import CommentForm

comment_routes = Blueprint('comments', __name__)


@comment_routes.route('/expenses/<int:id>/comments', methods=["POST"])
@login_required
def add_comment(expense_id):
    form = CommentForm()
    if not form.validate_on_submit():
        return {"error": "Invalid form submission"}, 400

    comment_text = form.comment_text.data

    # Validate the expense's existence
    expense = Expense.query.get(expense_id)
    if not expense: 
        return {"error": "Expense not found"}, 404
    
    # Add the new comment
    new_comment = Comment(
        comment_text=comment_text,
        expense_id=expense_id,
        user_id=current_user.id
    )
    db.session.add(new_comment)
    db.session.commit()
    
    # Return the new comment
    return {"comment": new_comment.to_dict()}, 201


@comment_routes.route('/comments/<int:comment_id>', methods=["PUT"])
@login_required
def edit_comment(comment_id):
    comment_text = request.comment_text.data("comment_text")
    
    # Validate comment_text
    if not comment_text:
        return {"error": "Content cannot be empty"}, 400
    
    # Find the comment
    comment = Comment.query.get(comment_id)
    if not comment:
        return {"error": "Comment not found"}, 404

    # Auth check
    if comment.user_id != current_user.id:
        return {"error": "Unauthorized"}, 403
    
    # Update the comment
    comment.comment_text = comment_text
    db.session.commit()
    
    # Return the updated comment
    return {"comment": comment.to_dict()}, 200


@comment_routes.route('/comments/<comment_id>', methods=["DELETE"])
@login_required
def delete_comment(comment_id):
    comment = Comment.query.get(comment_id)
    if not comment:
        return {"error": "Comment not found"}, 404
    
    # Auth check
    if comment.user_id != current_user.id:
        return {"error": "Unauthorized"}, 403
    
    # "do the thing" lol --- > delete the comment from the database
    db.session.delete(comment)
    db.session.commit()
    
    return {"message": "Comment deleted successfully"}, 200

 
@comment_routes.route('/expenses/<int:id>/comments')
@login_required
def comments(expense_id):
    """
    Query for all comments for a specific expense and returns them in a list of dictionaries
    """
    
    # Validate the expense's existence 
    expense = Expense.query.get(expense_id)
    if not expense: 
        return {"error": "Expense not found"}, 404
    
    # Query for all comments for the expense with "filter_by" and expense_id and .all()
    comments = Comment.query.filter_by(expense_id=expense_id).all()
    return {'comments': [comment.to_dict() for comment in comments]}