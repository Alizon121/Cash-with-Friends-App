from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Friend, User

friends_routes = Blueprint("friends", __name__)

@friends_routes.route("/", methods=["POST"])
@login_required
def send_friend_request():
    """Send a friend request to another user."""
    data = request.get_json()
    username = data.get("username")

    if not username:
        return jsonify({"message": "Username is required"}), 400

    friend = User.query.filter_by(username=username).first()
    if not friend:
        return jsonify({"message": "User not found"}), 404

    if friend.id == current_user.id:
        return jsonify({"message": "You cannot send a friend request to yourself"}), 400

    existing_friendship = Friend.query.filter(
        ((Friend.user_id == current_user.id) & (Friend.friend_id == friend.id)) |
        ((Friend.friend_id == current_user.id) & (Friend.user_id == friend.id))
    ).first()

    if existing_friendship:
        if existing_friendship.pending_status:
            return jsonify({"message": "Oh, you already sent that request. Don't be annoying!"}), 400
        return jsonify({"message": "You are already friends with this user."}), 400

    new_friend_request = Friend(user_id=current_user.id, friend_id=friend.id, pending_status=True)
    db.session.add(new_friend_request)
    db.session.commit()

    return jsonify({"message": "Friend request sent successfully!"}), 201



@friends_routes.route("/", methods=["PUT"])
@login_required
def respond_to_friend_request():
    """Accept or reject a friend request."""
    data = request.get_json()
    friend_id = data.get("friend_id")
    accept = data.get("accept")

    if not friend_id:
        return jsonify({"message": "Friend ID is required"}), 400

    friend_request = Friend.query.filter_by(user_id=friend_id, friend_id=current_user.id, pending_status=True).first()
    if not friend_request:
        return jsonify({"message": "Friend request not found"}), 404

    if accept:
        friend_request.pending_status = False
        db.session.commit()
        return jsonify({"message": "Friend request accepted"}), 200
    else:
        db.session.delete(friend_request)
        db.session.commit()
        return jsonify({"message": "Friend request rejected"}), 200


@friends_routes.route("/<int:friend_id>", methods=["DELETE"])
@login_required
def remove_friend(friend_id):
    """Remove a friend or cancel a pending request."""
    friendship = Friend.query.filter(
        ((Friend.user_id == current_user.id) & (Friend.friend_id == friend_id)) |
        ((Friend.friend_id == current_user.id) & (Friend.user_id == friend_id))
    ).first()

    if not friendship:
        return jsonify({"message": "Friend not found"}), 404

    db.session.delete(friendship)
    db.session.commit()
    return jsonify({"message": "Friend removed"}), 200



@friends_routes.route("/requests/", methods=["GET"])
@login_required
def get_pending_friend_requests():
    """Retrieve all pending friend requests for the logged-in user."""
    pending_requests = Friend.query.filter_by(friend_id=current_user.id, pending_status=True).all()
    pending_list = [{
        "id": request.user_id,
        "firstName": User.query.get(request.user_id).first_name,
        "lastName": User.query.get(request.user_id).last_name,
        "email": User.query.get(request.user_id).email,
        "username": User.query.get(request.user_id).username
    } for request in pending_requests]

    return jsonify({"PendingRequests": pending_list}), 200

@friends_routes.route("/", methods=["GET"])
@login_required
def get_all_friends():
    """Retrieve all accepted friends of the logged-in user."""
    friendships = Friend.query.filter(
        ((Friend.user_id == current_user.id) | (Friend.friend_id == current_user.id)) &
        (Friend.pending_status == False)
    ).all()

    if not friendships:
        return jsonify({"message": "No friends yet, would you like to add some?"}), 200

    friends_list = []
    for friendship in friendships:
        friend_id = friendship.friend_id if friendship.user_id == current_user.id else friendship.user_id
        friend = User.query.get(friend_id)

        friends_list.append({
            "id": friend.id,
            "firstName": friend.first_name,
            "lastName": friend.last_name,
            "email": friend.email,
            "username": friend.username,
            "createdAt": friendship.created_at.isoformat()
        })

    return jsonify({"friends": friends_list}), 200

@friends_routes.route('/')
@login_required
def get_friends():
    user = current_user
    friends = user.friends  # Assuming a many-to-many relationship between users
    return jsonify([friend.to_dict() for friend in friends])

@friends_routes.route("/sent/", methods=["GET"])
@login_required
def get_sent_friend_requests():
    """Retrieve all friend requests sent by the logged-in user."""
    sent_requests = Friend.query.filter_by(user_id=current_user.id, pending_status=True).all()
    sent_list = [{
        "id": request.friend_id,
        "firstName": User.query.get(request.friend_id).first_name,
        "lastName": User.query.get(request.friend_id).last_name,
        "email": User.query.get(request.friend_id).email,
        "username": User.query.get(request.friend_id).username
    } for request in sent_requests]

    return jsonify({"SentRequests": sent_list}), 200

@friends_routes.route("/sent/<int:friend_id>", methods=["DELETE"])
@login_required
def cancel_sent_request(friend_id):
    """Cancel a sent friend request."""
    sent_request = Friend.query.filter_by(user_id=current_user.id, friend_id=friend_id, pending_status=True).first()

    if not sent_request:
        return jsonify({"message": "Sent request not found"}), 404

    db.session.delete(sent_request)
    db.session.commit()
    return jsonify({"message": "Friend request canceled successfully"}), 200

