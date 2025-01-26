from .db import db, environment, SCHEMA
from datetime import datetime, timezone

class Payment(db.Model):
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
        return {
            'id': self.id,
            'expense_id': self.expense_id,
            'payer_id': self.payer_id,
            'paid_at': self.paid_at,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
