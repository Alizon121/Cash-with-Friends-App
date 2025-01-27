from app.models import db, environment, SCHEMA
from app.models.expenses import Expense
from sqlalchemy.sql import text

# Add an expense
def seed_expense():
    dinner = Expense(
        description="AYCE dinner with friends", 
        amount=90.00, 
        settled=False, 
        created_by=1,  # I think we have to change to a variable from the Frontend (e.g. username)
        particpants=[{
                      "username":"marnie", 
                      "settled":False
                    },
                    {
                      "username":"bobbie", 
                      "settled":False
                    }
                    ]
    )
    party = Expense(
        description="Unforgettable birthday at the club", 
        amount=150.00, 
        settled=False, 
        created_by=3, # I think we have to change to a variable from the Frontend (e.g. username)
        particpants=[{
                      "username":"Kingkoopa1", 
                      "settled":False
                    },
                    {
                      "username":"ChiefKeef<3", 
                      "settled":True
                    }
                    ]
    )
    birthday = Expense(
        description="Aunt's birthday!", 
        amount=30.00, 
        settled=False, 
        created_by=5, # I think we have to change to a variable from the Frontend (e.g. username)
        particpants=[{
                      "username":"marnie", 
                      "settled":True
                    },
                    {
                      "username":"Demo", 
                      "settled":True
                    }
                    ]
    )
    rent = Expense(
        description="House rent", 
        amount=750.00, 
        settled=True, 
        created_by=4, # I think we have to change to a variable from the Frontend (e.g. username)
        particpants=[{
                      "username":"mario12", 
                      "settled":True
                    }
                    ]
    )

    db.session.add(dinner)
    db.session.add(party)
    db.session.add(birthday)
    db.session.add(rent)
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
