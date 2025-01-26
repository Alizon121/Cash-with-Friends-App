from .db import db, environment, SCHEMA
from datetime import datetime, timezone

class Payment(db.Model):
    """
    Create payments model according to db Schema
    Use timezone.utc for datetime to keep all datetimes consistent
    """
    __tablename__ = 'payments'

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    expense_id = db.Column(db.Integer, nullable=False) # FOREIGN KEY
    payer_id = db.Column(db.Integer, nullable=False) # FOREIGN KEY
    paid_at = db.Column(db.Datetime, default=datetime.now(timezone.utc))
    created_at = db.Column(db.Datetime, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.Datetime, default=datetime.now(timezone.utc))

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
