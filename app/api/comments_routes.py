from flask import Blueprint, request
from app.models import Comment, db
from flask_login import login_required, current_user
# from app.forms import CommentForm

comment_routes = Blueprint('comments', __name__)


@comment_routes.route('/<int:comment_id>', methods=["PUT"])
@login_required
def edit_comment(comment_id):
    comment_text = request.form.get("comment_text")
    
    # Validate comment_text
    if not comment_text:
        return {"error": "Content cannot be empty"}, 400
    
    # # Find the comment
    comment = Comment.query.get(comment_id)
    print(comment)
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


@comment_routes.route('/<int:comment_id>', methods=["DELETE"])
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