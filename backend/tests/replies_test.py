from flask.testing import FlaskClient

from .util import user_random, restaurant_random, comment_random, reply_random

############################################################
# /replies/new
############################################################


def test_new_success(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    comment_id = next(
        comment_random(client, restaurant["restaurant_id"], restaurant["token"])
    )

    res = client.post(
        "/replies/new",
        json={
            "comment_id": comment_id,
            "content": "This is a reply",
            "anonymity": False,
        },
        headers={"Authorization": f"Bearer {restaurant['token']}"},
    )

    assert res.status_code == 200

    res = client.get(f"/replies/get/by_id/{res.json['reply_id']}")

    assert res.status_code == 200
    assert res.json["content"] == "This is a reply"


def test_new_invalid_length(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    comment_id = next(
        comment_random(client, restaurant["restaurant_id"], restaurant["token"])
    )

    res = client.post(
        "/replies/new",
        json={
            "comment_id": comment_id,
            "content": "This is a reply" * 100,
            "anonymity": False,
        },
        headers={"Authorization": f"Bearer {restaurant['token']}"},
    )

    assert res.status_code == 400


def test_new_not_found(client: FlaskClient) -> None:
    token = client.post("/users/register", json=next(user_random())).json["token"]

    res = client.post(
        "/replies/new",
        json={
            "comment_id": 999,
            "content": "This is a reply",
            "anonymity": False,
        },
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 404


############################################################
# /replies/delete/<int:reply_id>
############################################################


def test_delete_success(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    comment_id = next(
        comment_random(client, restaurant["restaurant_id"], restaurant["token"])
    )
    reply_id = next(reply_random(client, comment_id, restaurant["token"]))

    res = client.delete(
        f"/replies/delete/{reply_id}",
        headers={"Authorization": f"Bearer {restaurant['token']}"},
    )

    assert res.status_code == 200

    res = client.get(f"/replies/get/by_id/{reply_id}")

    assert res.status_code == 404


def test_delete_not_owner(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    comment_id = next(
        comment_random(client, restaurant["restaurant_id"], restaurant["token"])
    )
    reply_id = next(reply_random(client, comment_id, restaurant["token"]))

    token = client.post("/users/register", json=next(user_random())).json["token"]

    res = client.delete(
        f"/replies/delete/{reply_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 401


def test_delete_not_found(client: FlaskClient) -> None:
    token = client.post("/users/register", json=next(user_random())).json["token"]

    res = client.delete(
        "/replies/delete/999",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 404


############################################################
# /replies/get/by_id/<int:reply_id>
############################################################
