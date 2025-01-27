"""
This module defined the Payment model for our application
The Payment model represents individual payments made within the app
This model is used to create and manage payment records within the application's database
Uses the schema specified by SCHEMA .env variable
Converts Payment instance into a dictionary for easy JSON serialization
Defines relationships between payments & foreign keys for easy querying
"""


from datetime import datetime, timezone
from .db import db, environment, SCHEMA


class Payment(db.Model):
    """
    Create payments model according to db Schema
    Use timezone.utc for datetime to keep all datetimes consistent
    """
    __tablename__ = 'payments'

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    expense_id = db.Column(db.Integer, db.ForeignKey('expenses.id'), nullable=False)
    payer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    paid_at = db.Column(db.Datetime, default=datetime.now(timezone.utc))
    created_at = db.Column(db.Datetime, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.Datetime, default=datetime.now(timezone.utc))

    # relationships defined for easier querying
    # here we link each payment to an instance of 'expense' and an instance of 'user'
    # so that we can direclty access a the expense or user related to a given payment
    # i.e. payment.expense, payment.payer
    expense = db.relationship('Expense', back_populates='payments')
    payer = db.relationship('User', back_populates='payment')

    def to_dict(self):
        """
        Converts payment instance into a dictionary
        Creates dictionary representation of payment instance,
        returns a dictionary containing payment instance's information
        so that data can be converted to json format
        for api responses, etc
        """
        return {
            'id': self.id,
            'expense_id': self.expense_id,
            'payer_id': self.payer_id,
            'paid_at': self.paid_at,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
