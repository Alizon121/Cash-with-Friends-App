"""
Seeds the database with demo Payment instances
Includes TRUNCATE/DELETE statements to unseed database
in both development and production environments
"""


from app.models import db, environment, SCHEMA
from app.models.payment import Payment
from sqlalchemy.sql import text


def seed_payments():
    """
    Seeds the database with initial payment data
    Creates and adds demo Payment instances to the database session
    """
    demo_payment_1 = Payment(
        expense_id=1, payer_id=1
    )
    demo_payment_2 = Payment(
        expense_id=2, payer_id=2
    )
    demo_payment_3 = Payment(
        expense_id=3, payer_id=3
    )

    db.session.add(demo_payment_1)
    db.session.add(demo_payment_2)
    db.session.add(demo_payment_3)

    db.session.commit()

def undo_payments():
    """
    Removes all payment data from the database

    In production (postgres), truncates the payments table and resets identity
    TRUNCATE removes all data from the table
    RESET IDENTITY resets the auto-incrementing PK
    CASCADE deletes any depenent entities

    In development (sqlite3), deletes the payemnts table
    DELETE will remove all data and reset the PKs
    """
    if environment == "production":
        db.session.execute(f'TRUNCATE table {SCHEMA}.payments RESTART IDENTITY CASCADE')
    else:
        db.session.execute(text("DELETE FROM payments"))

    db.session.commit()
