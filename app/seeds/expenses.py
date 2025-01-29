from app.models import db, environment, SCHEMA
from app.models.expenses import Expense
from app.models.user import User
from sqlalchemy.sql import text

# Add an expense
def seed_expense():
    
   marnie = User.query.filter_by(username="marnie").first()
   bobbie = User.query.filter_by(username="bobbie").first()
   Demo = User.query.filter_by(username="Demo").first()
   chillguy12 = User.query.filter_by(username="chillguy12").first()
   daGuy12 = User.query.filter_by(username="daGuy12").first()
   daDude12 = User.query.filter_by(username="daDude12").first()

   dinner = Expense(
        description="AYCE dinner with friends", 
        amount=90.00, 
        settled=False, 
        created_by=1,  # I think we have to change to a variable from the Frontend (e.g. username)
        participants=[marnie,bobbie]
    )
   party = Expense(
        description="Unforgettable birthday at the club", 
        amount=150.00, 
        settled=False, 
        created_by=3, # I think we have to change to a variable from the Frontend (e.g. username)
        participants=[Demo,chillguy12]
    )
   birthday = Expense(
        description="Aunt's birthday!", 
        amount=30.00, 
        settled=False, 
        created_by=5, # I think we have to change to a variable from the Frontend (e.g. username)
        participants=[marnie,Demo]
    )
   rent = Expense(
        description="House rent", 
        amount=750.00, 
        settled=True, 
        created_by=4,
        participants=[daGuy12]
    )
   hiking = Expense(
        description="Hiking in Zion", 
        amount=20.00, 
        settled=False, 
        created_by=4,
        participants=[marnie, bobbie]
    )
   gas = Expense(
        description="Gas to get to the place.", 
        amount=30.00, 
        settled=False, 
        created_by=6,
        participants=[chillguy12,daDude12]
    )
   utilities = Expense(
        description="Gas, water, electricity!", 
        amount=50.00, 
        settled=False, 
        created_by=7,
        participants=[daGuy12,daDude12]
    )
   wifi = Expense(
        description="Wifi!!", 
        amount=18.00, 
        settled=False, 
        created_by=5,
        participants=[Demo, daDude12,chillguy12]
    )
   brunch = Expense(
        description="Brunch with the crew", 
        amount=30.00, 
        settled=False, 
        created_by=6,
        participants=[chillguy12,daDude12]
    )
   spotify = Expense(
        description="Spotify shared account.", 
        amount=30.00, 
        settled=False, 
        created_by=3,
        participants=[Demo]
    )
    

   db.session.add(dinner)
   db.session.add(party)
   db.session.add(birthday)
   db.session.add(rent)
   db.session.add(hiking)
   db.session.add(gas)
   db.session.add(utilities)
   db.session.add(wifi)
   db.session.add(brunch)
   db.session.add(spotify)
   db.session.commit()

    # Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
    # have a built in function to do this. With postgres in production TRUNCATE
    # removes all the data from the table, and RESET IDENTITY resets the auto
    # incrementing primary key, CASCADE deletes any dependent entities.  With
    # sqlite3 in development you need to instead use DELETE to remove all data and
    # it will reset the primary keys for you as well.

def undo_expenses():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.expenses RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM expenses"))

    db.session.commit()
