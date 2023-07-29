import csv
import base64
import random
import requests
from retrying import retry
from tqdm import tqdm
from faker import Faker
from faker_food import FoodProvider
from werkzeug.security import generate_password_hash
from flask_jwt_extended import create_access_token
from concurrent.futures import ThreadPoolExecutor, as_completed


from flask import Flask, jsonify
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


# The following callbacks are used for customizing jwt response/error messages.
# The original ones may not be in a very pretty format (opinionated)
@jwt.expired_token_loader
def expired_token_callback():
    return (
        jsonify(
            {
                "message": "The token has expired.",
            }
        ),
        401,
    )


@jwt.invalid_token_loader
def invalid_token_callback(error):
    return (
        jsonify(
            {
                "message": f"Signature verification failed.\n{error}",
            }
        ),
        401,
    )


@jwt.unauthorized_loader
def missing_token_callback(error):
    return (
        jsonify(
            {
                "message": f"Request does not contain an access token.\n{error}",
            }
        ),
        401,
    )


@jwt.needs_fresh_token_loader
def token_not_fresh_callback():
    return (
        jsonify(
            {
                "message": "The token is not fresh.",
            }
        ),
        401,
    )


@jwt.revoked_token_loader
def revoked_token_callback():
    return (
        jsonify(
            {
                "message": "The token has been revoked.",
            }
        ),
        401,
    )


############################################################

api = Api(
    title="API Doc",
    version="1.0",
    description="3900Project API Doc",
)

my_app = None


def init_app(app: Flask) -> None:
    jwt.init_app(app)

    global my_app
    my_app = app

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

        # Delete all current data in the database
        models.db.session.close_all()
        models.db.drop_all()
        models.db.create_all()

        # Generate Fake Users
        user_info = []
        print("Generating fake users...")
        with ThreadPoolExecutor(max_workers=16) as executor:
            futures = [executor.submit(generate_user) for _ in range(100)]
            user_info.extend(
                future.result()
                for future in tqdm(as_completed(futures), total=len(futures))
            )

        # Generate Fake Restaurants
        restaurant_info = []
        print("Generating fake restaurants...")
        with ThreadPoolExecutor(max_workers=16) as executor:
            futures = [
                executor.submit(generate_restaurant, user_info[i]["user_id"])
                for i in range(20)
            ]
            restaurant_info.extend(
                future.result()
                for future in tqdm(as_completed(futures), total=len(futures))
            )

        # Generate Fake Dishes
        for restaurant in tqdm(restaurant_info, desc="Generating fake dishes..."):
            with ThreadPoolExecutor(max_workers=32) as executor:
                futures = [
                    executor.submit(generate_dish, restaurant["restaurant_id"])
                    for _ in range(50)
                ]
                for _future in tqdm(
                    as_completed(futures),
                    total=len(futures),
                    desc=f"For restaurant id:{restaurant['restaurant_id']} - {restaurant['name']}",
                ):
                    pass

        # Generate Fake Comments
        for restaurant in tqdm(restaurant_info, desc="Generating fake comments..."):
            with ThreadPoolExecutor(max_workers=32) as executor:
                user_ids = [user["user_id"] for user in user_info]
                futures = [
                    executor.submit(
                        generate_comments, user_ids, restaurant["restaurant_id"]
                    )
                    for _ in range(100)
                ]
                for _future in as_completed(futures):
                    pass

        # Organize return data
        user_info = [
            {
                "user_id": user["user_id"],
                "email": user["email"],
                "password": user["password"],
            }
            for user in user_info
        ]

        restaurant_info = [
            {
                "restaurant_id": restaurant["restaurant_id"],
                "owner_id": restaurant["owner_id"],
                "name": restaurant["name"],
            }
            for restaurant in restaurant_info
        ]

        return {
            "message": "Fake data generated",
            "users": user_info,
            "restaurants": restaurant_info,
        }, 200


def generate_comments(user_ids: list, restaurant_id: int) -> dict:
    with my_app.app_context():
        fake = Faker()
        fake.add_provider(FoodProvider)

        sender = random.choice(user_ids)
        user_ids = [user_id for user_id in user_ids if user_id != sender]

        liked_by = random.sample(user_ids, random.randint(0, len(user_ids)))
        disliked_by = random.sample(user_ids, random.randint(0, len(user_ids)))

        for user_id in liked_by:
            if user_id in disliked_by:
                disliked_by.remove(user_id)

        new_comment = models.Comments(
            user_id=sender,
            restaurant_id=restaurant_id,
            content=fake.dish_description(),
            rate=round(random.randint(10, 50) / 10 * 2) / 2,
            date=fake.date(),
            anonymity=random.choice([True, False]),
            report_by=None,
            liked_by=liked_by,
            disliked_by=disliked_by,
        )
        models.db.session.add(new_comment)
        models.db.session.commit()


def generate_dish(restaurant_id: int) -> dict:
    with my_app.app_context():
        fake = Faker()
        fake.add_provider(FoodProvider)

        @retry(stop_max_attempt_number=3)
        def _():
            return requests.get(
                "https://loremflickr.com/500/500/food",
                allow_redirects=True,
                timeout=5,
            )

        res = _()

        new_dish = models.Dishes(
            restaurant_id=restaurant_id,
            name=fake.dish(),
            price=round(random.uniform(1, 100), 1),
            description=fake.dish_description(),
            image=base64.b64encode(res.content).decode("utf-8"),
        )
        models.db.session.add(new_dish)
        models.db.session.commit()


def generate_restaurant(owner_id: int) -> dict:
    with my_app.app_context():
        fake = Faker()

        @retry(stop_max_attempt_number=3)
        def _():
            return requests.get(
                "https://loremflickr.com/500/500/restaurant",
                allow_redirects=True,
                timeout=5,
            )

        res = _()

        new_restaurant = models.Restaurants(
            owner_id=owner_id,
            name=fake.company(),
            address=fake.address(),
            image=base64.b64encode(res.content).decode("utf-8"),
        )
        models.db.session.add(new_restaurant)
        models.db.session.commit()

        return {
            "restaurant_id": new_restaurant.restaurant_id,
            "owner_id": new_restaurant.owner_id,
            "name": new_restaurant.name,
            "restaurant": new_restaurant,
        }


def generate_user() -> dict:
    with my_app.app_context():
        fake = Faker()

        @retry(stop_max_attempt_number=3)
        def _():
            return requests.get(
                "https://loremflickr.com/500/500/people",
                allow_redirects=True,
                timeout=5,
            )

        res = _()
        email = fake.email()
        password = fake.password()

        new_user = models.Users(
            name=fake.name(),
            email=email,
            password_hash=generate_password_hash(password),
            photo=base64.b64encode(res.content).decode("utf-8"),
            token=create_access_token(identity=email),
            favorite_restaurants=None,
        )

        models.db.session.add(new_user)
        models.db.session.commit()

        return {
            "user_id": new_user.user_id,
            "email": email,
            "password": password,
            "user": new_user,
        }
