# pylint: disable=redefined-outer-name

import random
import pytest
from faker import Faker
from app import create_app, config
from flask import Flask
from flask.testing import FlaskClient


@pytest.fixture(scope="session")
def app() -> Flask:
    app = create_app(con=config.TestingConfig)
    with app.app_context() as ctx:
        ctx.push()
        yield app
        ctx.pop()


@pytest.fixture(scope="function")
def client(app: Flask) -> FlaskClient:
    app.db.create_all()
    yield app.test_client()
    app.db.session.close_all()
    app.db.drop_all()


def user_random() -> dict:
    fake = Faker()
    yield {
        "name": fake.name(),
        "gender": random.choice(["male", "female", "other"]),
        "email": fake.email(),
        "password": "Abc123456",
    }
