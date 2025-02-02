from app.models import db, environment, SCHEMA
from app.models.friends import Friend
from app.models.user import User
from sqlalchemy.sql import text

def seed_friends():
    # Query users
    demo = User.query.filter_by(username="Demo").first()
    marnie = User.query.filter_by(username="marnie").first()
    bobbie = User.query.filter_by(username="bobbie").first()
    chillguy12 = User.query.filter_by(username="chillguy12").first()
    daGuy12 = User.query.filter_by(username="daGuy12").first()
    daDude12 = User.query.filter_by(username="daDude12").first()

    # Create Friendships
    friendships = [
        Friend(user_id=demo.id, friend_id=marnie.id, pending_status=False),  # Accepted Friend
        Friend(user_id=demo.id, friend_id=bobbie.id, pending_status=True),   # Pending friend request
        Friend(user_id=marnie.id, friend_id=chillguy12.id, pending_status=False),  # Accepted Friend
        Friend(user_id=bobbie.id, friend_id=daGuy12.id, pending_status=False),     # Accepted Friend
        Friend(user_id=chillguy12.id, friend_id=daDude12.id, pending_status=False),  # Accepted Friend

        Friend(user_id=daGuy12.id, friend_id=demo.id, pending_status=True),   # Pending
        Friend(user_id=daDude12.id, friend_id=marnie.id, pending_status=True) # Pending
    ]

    # Add and commit to DB
    db.session.add_all(friendships)
    db.session.commit()

# Undo function to reset the table
def undo_friends():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.friends RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM friends"))

    db.session.commit()
