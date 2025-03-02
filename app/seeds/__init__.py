from flask.cli import AppGroup
from .users import seed_users, undo_users
from .expenses import seed_expense, undo_expenses
from .payments import seed_payments, undo_payments
from .comments import seed_comments, undo_comments
from .friends import seed_friends, undo_friends

from app.models.db import db, environment, SCHEMA
from sqlalchemy.sql import text


def undo_expense_participants():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.expense_participants RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM expense_participants"))

    db.session.commit()

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding, truncate all tables prefixed with schema name
        # Add a truncate command here for every table that will be seeded.
        # db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
        # db.session.execute(f"TRUNCATE table {SCHEMA}.expenses RESTART IDENTITY CASCADE;")
        # db.session.execute(f"TRUNCATE table {SCHEMA}.payments RESTART IDENTITY CASCADE;")
        # db.session.execute(f"TRUNCATE table {SCHEMA}.comments RESTART IDENTITY CASCADE;")
        # db.session.execute(f"TRUNCATE table {SCHEMA}.friends RESTART IDENTITY CASCADE;")
        # db.session.execute(f"TRUNCATE table {SCHEMA}.expense_participants RESTART IDENTITY CASCADE;")
        # db.session.commit()

        
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
        undo_expenses()
        undo_payments()
        undo_comments()
        undo_friends()
        undo_expense_participants()
    seed_users()
    # Add other seed functions here
    seed_expense()
    seed_payments()
    seed_comments()
    seed_friends()


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_expense_participants()
    undo_expenses()
    undo_payments()
    undo_comments()
    undo_friends()
