# pylint: disable=redefined-outer-name

"""
    pseudo-plugin for pytest that creates a Flask app instance with the TestingConfig configuration object.
    https://stackoverflow.com/questions/46792418/pytest-fails-on-a-directory-with-multiple-test-files-when-modularizing-fixtures
"""

import pytest
from app import create_app, config
from flask import Flask
from flask.testing import FlaskClient


@pytest.fixture(scope="session")
def app() -> Flask:
    """
    Fixture that creates a Flask app instance with the TestingConfig configuration object.
    The app context is pushed and then popped after the test session is completed.
    """
    app = create_app(con=config.TestingConfig)
    with app.app_context() as ctx:
        ctx.push()
        yield app
        ctx.pop()


@pytest.fixture(scope="function")
def client(app: Flask) -> FlaskClient:
    """
    Fixture that creates a Flask test client instance with a new database session.
    The database is created before the test function is run and dropped after the test function is run.
    """
    app.db.create_all()
    yield app.test_client()
    app.db.session.close_all()
    app.db.drop_all()
