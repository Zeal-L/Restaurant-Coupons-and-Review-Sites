import base64
import random
from faker import Faker
from flask.testing import FlaskClient


def user_random() -> dict:
    """
    This function generates a random user dictionary with the following keys:
    - name: a random name generated by the Faker library
    - email: a random email generated by the Faker library
    - password: a string "Abc123456"
    """
    fake = Faker()
    yield {
        "name": fake.name(),
        "email": fake.email(),
        "password": "Abc123456",
    }


def restaurant_random(client: FlaskClient) -> dict:
    """
    This function generates a random restaurant dictionary with the following keys:
    - token: a token generated by the client.post method
    - restaurant_id: a restaurant id generated by the client.post method
    """
    token = client.post("/users/register", json=next(user_random())).json["token"]

    fake = Faker()
    with open("backend/tests/test_image.jpg", "rb") as image:
        image_base64 = base64.b64encode(image.read()).decode("utf-8")
        res = client.post(
            "/restaurants/new",
            json={
                "name": f"Test Restaurant {random.randint(0, 100000)}",
                "address": fake.address(),
                "image": image_base64,
            },
            headers={"Authorization": f"Bearer {token}"},
        )

        yield {"token": token, "restaurant_id": res.json["restaurant_id"]}


def dish_random(client: FlaskClient, token: str) -> int:
    """
    This function generates a random dish dictionary with the following keys:
    - name: a string "Test Dish" and a random integer between 0 and 100000
    - price: a random integer between 0 and 1000
    - description: a random text generated by the Faker library
    - image: a base64 encoded image from the test_image.jpg file
    """

    fake = Faker()
    with open("backend/tests/test_image.jpg", "rb") as image:
        image_base64 = base64.b64encode(image.read()).decode("utf-8")
        res = client.post(
            "/dishes/new",
            json={
                "name": f"Test Dish {random.randint(0, 100000)}",
                "price": random.randint(0, 1000),
                "description": fake.text(),
                "image": image_base64,
            },
            headers={"Authorization": f"Bearer {token}"},
        )

        yield res.json["dish_id"]


def comment_random(client: FlaskClient, restaurant_id: int, token: str) -> int:
    """
    This function generates a random comment dictionary with the following keys:
    - restaurant_id: the id of the restaurant to which the comment is related
    - content: a random text generated by the Faker library
    - rate: a random float between 0 and 5
    - anonymity: a random boolean value
    """
    fake = Faker()

    res = client.post(
        "/comments/new",
        json={
            "restaurant_id": restaurant_id,
            "content": fake.text(),
            "rate": random.randint(0, 50) / 10,
            "anonymity": random.choice([True, False]),
        },
        headers={"Authorization": f"Bearer {token}"},
    )

    yield res.json["comment_id"]


def reply_random(client: FlaskClient, comment_id: int, token: str) -> int:

    fake = Faker()

    res = client.post(
        "/replies/new",
        json={
            "comment_id": comment_id,
            "content": fake.text(),
            "anonymity": random.choice([True, False]),
        },
        headers={"Authorization": f"Bearer {token}"},
    )

    yield res.json["reply_id"]