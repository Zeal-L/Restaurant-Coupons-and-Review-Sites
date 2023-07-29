from flask import Flask
from flask_restx import Api, Resource
from flask_jwt_extended import JWTManager, decode_token
from . import users, restaurants, dishes, comments, replies, vouchers

from app import models

############################################################

jwt = JWTManager()


@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header: dict, jwt_payload: dict) -> models.Users or None:
    """Callback function for JWTManager to get user from token

    Args:
        _jwt_header (dict): JWT header
        jwt_data (dict): JWT data

    Returns:
        UserORM: User object if user exists, None otherwise
    """

    identity = jwt_payload["sub"]
    return models.Users.query.filter_by(email=identity).one_or_none()


@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(_jwt_header: dict, jwt_payload: dict) -> bool:
    """
    Callback function for JWTManager to check if token is in blocklist.
    Determine if you are blacklisted by matching the expiration time to the user token.
    Args:
        _jwt_header (dict): JWT header
        jwt_payload (dict): JWT data

    Returns:
        bool: True if token is in blocklist, False otherwise
    """

    identity = jwt_payload["sub"]
    user = models.Users.query.filter_by(email=identity).one_or_none()
    if user is None:
        return True

    return jwt_payload["exp"] != decode_token(user.token)["exp"]


############################################################

api = Api(
    title="API Doc",
    version="1.0",
    description="3900Project API Doc",
)


def init_app(app: Flask) -> None:
    jwt.init_app(app)

    api.add_namespace(users.api)
    api.add_namespace(restaurants.api)
    api.add_namespace(dishes.api)
    api.add_namespace(comments.api)
    api.add_namespace(replies.api)
    api.add_namespace(
        vouchers.api,
    )

    api.init_app(app)


############################################################


@api.route("/database/size")
@api.response(200, "Success")
class DatabaseSize(Resource):
    @api.doc("get_database_size")
    def get(self) -> tuple[dict, int]:
        """Get database size

        Returns:
            dict: Database size
        """

        return {
            "message": f"The size of the database is {models.get_database_size()}"
        }, 200


@api.route("/database/generate/fake_data")
@api.response(200, "Success")
class Fake_Data(Resource):
    @api.doc("generate_fake_data")
    def get(self) -> tuple[dict, int]:
        """Generate fake data, it will also delete all current data in the database

        Returns:
            dict: Fake data
        """
        import csv
        import random
        import requests
        from tqdm import tqdm
        from faker import Faker
        from faker_food import FoodProvider
        from werkzeug.security import generate_password_hash

        fake = Faker()
        fake.add_provider(FoodProvider)

        # Delete all current data in the database
        models.db.session.close_all()
        models.db.drop_all()
        models.db.create_all()


        # Generate Fake Users
        for _ in tqdm(range(100)):
            name = fake.name()
            gender = random.choice(["male", "female", "other"])
            photo = people_url = requests.get(
                "https://loremflickr.com/500/500/people", allow_redirects=True
            ).url
            email = fake.email()
            password = fake.password()
            password_hash = generate_password_hash(password)




        return {"message": "Fake data generated"}, 200
