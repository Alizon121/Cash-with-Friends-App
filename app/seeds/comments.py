from app.models import db, environment, SCHEMA
from app.models.comments import Comment
from sqlalchemy.sql import text


def seed_comments():
    demo_comment_1 = Comment(
        expense_id=1, 
        user_id=1, 
        comment_text="We definitely have to plan another dinner together!"
    )
    demo_comment_2 = Comment(
        expense_id=1, 
        user_id=2, 
        comment_text="Y'all eat too much!"
    )
    demo_comment_3 = Comment(
        expense_id=1, 
        user_id=3, 
        comment_text="GREAT time, bois!"
    )
    demo_comment_4 = Comment(
        expense_id=1, 
        user_id=1, 
        comment_text="I'm gonna go workout."
    )
    demo_comment_5 = Comment(
        expense_id=2, 
        user_id=2, 
        comment_text="What do y'all want to do for next time?"
    )
    demo_comment_6 = Comment(
        expense_id=3, 
        user_id=3, 
        comment_text="It's Vegas, what happens here, stays here!"
    )
    demo_comment_7 = Comment(
        expense_id=4, 
        user_id=1, 
        comment_text="What a lovely bunch of coconuts!"
    )
    demo_comment_8 = Comment(
        expense_id=5, 
        user_id=2, 
        comment_text="Y'all ever seen 'Snakes on a Plane'?"
    )
    demo_comment_9 = Comment(
        expense_id=6, 
        user_id=3, 
        comment_text="It came by the light of the moon"
    )
    demo_comment_10 = Comment(
        expense_id=7, 
        user_id=1, 
        comment_text="*showers with praise*"
    )
    demo_comment_11 = Comment(
        expense_id=8, 
        user_id=2, 
        comment_text="Banana"
    )
    demo_comment_12 = Comment(
        expense_id=9, 
        user_id=3, 
        comment_text="That's what I said!"
    )
    demo_comment_13 = Comment(
        expense_id=10, 
        user_id=1, 
        comment_text="Once upon a midnight dreary"
    )
    demo_comment_14 = Comment(
        expense_id=7, 
        user_id=2, 
        comment_text="That's what she said."
    )

    db.session.add_all([demo_comment_1, 
                        demo_comment_2, 
                        demo_comment_3, 
                        demo_comment_4, 
                        demo_comment_5, 
                        demo_comment_6, 
                        demo_comment_7, 
                        demo_comment_8, 
                        demo_comment_9, 
                        demo_comment_10, 
                        demo_comment_11, 
                        demo_comment_12, 
                        demo_comment_13, 
                        demo_comment_14])

    db.session.commit()


def undo_comments():
    """
    Removes all comment data from the database

    In production (postgres), truncates the comments table and resets identity
    TRUNCATE removes all data from the table
    RESET IDENTITY resets the auto-incrementing PK
    CASCADE deletes any depenent entities

    In development (sqlite3), deletes the comments table
    DELETE will remove all data and reset the PKs
    """
    if environment == "production":
        db.session.execute(f'TRUNCATE table {SCHEMA}.comments RESTART IDENTITY CASCADE')
    else:
        db.session.execute(text("DELETE FROM comments"))

    db.session.commit()
