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


def test_get_by_id_success(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    comment_id = next(
        comment_random(client, restaurant["restaurant_id"], restaurant["token"])
    )

    reply_id = next(reply_random(client, comment_id, restaurant["token"]))

    res = client.get(f"/replies/get/by_id/{reply_id}")

    assert res.status_code == 200


def test_get_by_id_not_found(client: FlaskClient) -> None:
    res = client.get("/replies/get/by_id/999")

    assert res.status_code == 404


############################################################
# /replies/get/count/by_comment/<int:comment_id>
############################################################


def test_get_count_by_comment_success(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    comment_id = next(
        comment_random(client, restaurant["restaurant_id"], restaurant["token"])
    )

    _reply_ids = [
        next(reply_random(client, comment_id, restaurant["token"])) for _ in range(10)
    ]

    res = client.get(f"/replies/get/count/by_comment/{comment_id}")

    assert res.status_code == 200
    assert res.json["count"] == 10


############################################################
# /replies/get/by_comment
############################################################


def test_get_by_comment_success(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    comment_id = next(
        comment_random(client, restaurant["restaurant_id"], restaurant["token"])
    )

    reply_ids = [
        next(reply_random(client, comment_id, restaurant["token"])) for _ in range(10)
    ]

    res = client.get(
        "/replies/get/by_comment",
        json={"comment_id": comment_id, "start": 0, "end": 10},
    )

    assert res.status_code == 200
    assert len(res.json["reply_ids"]) == 10
    assert res.json["reply_ids"] == reply_ids


def test_get_by_comment_invalid_range(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    comment_id = next(
        comment_random(client, restaurant["restaurant_id"], restaurant["token"])
    )

    _reply_ids = [
        next(reply_random(client, comment_id, restaurant["token"])) for _ in range(10)
    ]

    res = client.get(
        "/replies/get/by_comment",
        json={"comment_id": comment_id, "start": -1, "end": 10},
    )

    assert res.status_code == 400

    res = client.get(
        "/replies/get/by_comment",
        json={"comment_id": comment_id, "start": 3, "end": 2},
    )

    assert res.status_code == 400

    res = client.get(
        "/replies/get/by_comment",
        json={"comment_id": comment_id, "start": 0, "end": 100},
    )

    assert res.status_code == 400


def test_get_by_comment_not_found(client: FlaskClient) -> None:
    res = client.get(
        "/replies/get/by_comment",
        json={"comment_id": 999, "start": 0, "end": 10},
    )

    assert res.status_code == 404


############################################################
# /replies/report/<int:reply_id>
############################################################


def test_report_success(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    comment_id = next(
        comment_random(client, restaurant["restaurant_id"], restaurant["token"])
    )

    reply_id = next(reply_random(client, comment_id, restaurant["token"]))

    token = client.post("/users/register", json=next(user_random())).json["token"]

    res = client.post(
        f"/replies/report/{reply_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 200


def test_report_success_5_times(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    comment_id = next(
        comment_random(client, restaurant["restaurant_id"], restaurant["token"])
    )

    reply_id = next(reply_random(client, comment_id, restaurant["token"]))

    for _ in range(5):
        token = client.post("/users/register", json=next(user_random())).json["token"]

        res = client.post(
            f"/replies/report/{reply_id}",
            headers={"Authorization": f"Bearer {token}"},
        )

        assert res.status_code == 200

    res = client.get(f"/replies/get/by_id/{reply_id}")

    assert res.status_code == 404


def test_report_already_reported(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    comment_id = next(
        comment_random(client, restaurant["restaurant_id"], restaurant["token"])
    )

    reply_id = next(reply_random(client, comment_id, restaurant["token"]))

    token = client.post("/users/register", json=next(user_random())).json["token"]

    res = client.post(
        f"/replies/report/{reply_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 200

    res = client.post(
        f"/replies/report/{reply_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 400


def test_report_report_own_reply(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    comment_id = next(
        comment_random(client, restaurant["restaurant_id"], restaurant["token"])
    )

    reply_id = next(reply_random(client, comment_id, restaurant["token"]))

    res = client.post(
        f"/replies/report/{reply_id}",
        headers={"Authorization": f"Bearer {restaurant['token']}"},
    )

    assert res.status_code == 403


def test_report_reply_not_found(client: FlaskClient) -> None:
    token = client.post("/users/register", json=next(user_random())).json["token"]

    res = client.post(
        "/replies/report/999",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 404
