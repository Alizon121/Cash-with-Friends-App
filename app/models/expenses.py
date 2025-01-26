from .db import db, environment, SCHEMA
from datetime import datetime, timezone

class Expense(db.Model):
    __tablename__= "expenses"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(250), nullable=True)
    amount = db.Column(db.Float, nullable=False)
    settled = db.Column(db.Boolean, default=False)
    created_by = db.Column(db.String(250), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    # I am not sure what method I should use to dynamically update a time
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utcnow))

    def to_dict(self):
        return {
            "id": self.id,
            "description":self.description,
            "amount": self.amount,
            "settled": self.settled,
            "created_by": self.created_by,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }

# Add the foreign keys here?
