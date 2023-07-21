from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from sqlalchemy_utils import database_exists, create_database

############################################################

db = SQLAlchemy()


def init_app(app: Flask) -> None:
    db.init_app(app)
    with app.app_context():
        if not database_exists(db.engine.url):
            create_database(db.engine.url)
        db.create_all()
        app.db = db


from .users import Users
from .restaurants import Restaurants
from .dishes import Dishes
from .comments import Comments
from .replies import Replies
from .voucherTemplate import VoucherTemplate
from .vouchers import Vouchers
from .vouchersAutoReleaseTimer import VouchersAutoReleaseTimer

############################################################


def get_database_size() -> str:
    """Get database size

    Returns:
        int: Database size
    """
    from app.config import database

    query = text(f"SELECT pg_size_pretty(pg_database_size('{database}'))")
    result = db.session.execute(query)

    return result.fetchone()[0]
