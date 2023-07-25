from flask.testing import FlaskClient

from .util import user_random, restaurant_random, comment_random

############################################################
# /comments/new
############################################################


def test_new_success(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))

    res = client.post(
        "/comments/new",
        json={
            "restaurant_id": restaurant["restaurant_id"],
            "content": "Test Comment",
            "rate": 5,
            "anonymity": False,
        },
        headers={"Authorization": f"Bearer {restaurant['token']}"},
    )

    assert res.status_code == 200


def test_new_invalid_comment_length(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))

    res = client.post(
        "/comments/new",
        json={
            "restaurant_id": restaurant["restaurant_id"],
            "content": "Test Comment" * 100,
            "rate": 5,
            "anonymity": False,
        },
        headers={"Authorization": f"Bearer {restaurant['token']}"},
    )

    assert res.status_code == 400


def test_new_invalid_rate(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))

    res = client.post(
        "/comments/new",
        json={
            "restaurant_id": restaurant["restaurant_id"],
            "content": "Test Comment",
            "rate": 10,
            "anonymity": False,
        },
        headers={"Authorization": f"Bearer {restaurant['token']}"},
    )

    assert res.status_code == 403


def test_new_restaurant_not_found(client: FlaskClient) -> None:
    token = client.post("/users/register", json=next(user_random())).json["token"]
    res = client.post(
        "/comments/new",
        json={
            "restaurant_id": 999,
            "content": "Test Comment",
            "rate": 5,
            "anonymity": False,
        },
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 404


############################################################
# /comments/delete/<int:comment_id>
############################################################


def test_delete_success(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    comment_id = next(
        comment_random(client, restaurant["restaurant_id"], restaurant["token"])
    )

    res = client.delete(
        f"/comments/delete/{comment_id}",
        headers={"Authorization": f"Bearer {restaurant['token']}"},
    )

    assert res.status_code == 200

    res = client.get(f"/comments/get/{comment_id}")

    assert res.status_code == 404


def test_delete_comment_not_found(client: FlaskClient) -> None:
    token = client.post("/users/register", json=next(user_random())).json["token"]

    res = client.delete(
        "/comments/delete/999",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 404


def test_delete_unauthorized(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    comment_id = next(
        comment_random(client, restaurant["restaurant_id"], restaurant["token"])
    )

    token = client.post("/users/register", json=next(user_random())).json["token"]

    res = client.delete(
        f"/comments/delete/{comment_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 401


############################################################
# /comments/get/by_id/<int:comment_id>
############################################################


def test_get_by_id_success(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    json = {
        "restaurant_id": restaurant["restaurant_id"],
        "content": "Test Comment",
        "rate": 5,
        "anonymity": False,
    }
    res = client.post(
        "/comments/new",
        json=json,
        headers={"Authorization": f"Bearer {restaurant['token']}"},
    )

    res = client.get(
        f"/comments/get/by_id/{res.json['comment_id']}",
    )

    assert res.status_code == 200
    assert json["restaurant_id"] == res.json["restaurant_id"]
    assert json["content"] == res.json["content"]
    assert json["rate"] == res.json["rate"]
    assert json["anonymity"] == res.json["anonymity"]


def test_get_by_id_comment_not_found(client: FlaskClient) -> None:
    res = client.get(
        "/comments/get/by_id/999",
    )

    assert res.status_code == 404


############################################################
# /comments/get/by_restaurant/<int:restaurant_id>
############################################################


def test_get_by_restaurant_success(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    comment_ids = [
        next(comment_random(client, restaurant["restaurant_id"], restaurant["token"]))
    ]
    comment_ids.append(
        next(comment_random(client, restaurant["restaurant_id"], restaurant["token"]))
    )
    comment_ids.append(
        next(comment_random(client, restaurant["restaurant_id"], restaurant["token"]))
    )
    comment_ids.append(
        next(comment_random(client, restaurant["restaurant_id"], restaurant["token"]))
    )

    res = client.get(
        f"/comments/get/by_restaurant/{restaurant['restaurant_id']}",
    )

    assert res.status_code == 200
    assert len(res.json["comment_ids"]) == 4
    assert comment_ids == res.json["comment_ids"]


def test_get_by_restaurant_restaurant_not_found(client: FlaskClient) -> None:
    res = client.get(
        "/comments/get/by_restaurant/999",
    )

    assert res.status_code == 404


############################################################
# /comments/report/<int:comment_id>
############################################################


def test_report_success(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    comment_id = next(
        comment_random(client, restaurant["restaurant_id"], restaurant["token"])
    )

    user_info = client.post("/users/register", json=next(user_random())).json

    res = client.post(
        f"/comments/report/{comment_id}",
        headers={"Authorization": f"Bearer {user_info['token']}"},
    )

    assert res.status_code == 200

    res = client.get(f"/comments/get/by_id/{comment_id}")

    assert user_info["user_id"] in res.json["report_by"]


def test_report_success_5_times(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    comment_id = next(
        comment_random(client, restaurant["restaurant_id"], restaurant["token"])
    )

    for _ in range(5):
        user_info = client.post("/users/register", json=next(user_random())).json

        res = client.post(
            f"/comments/report/{comment_id}",
            headers={"Authorization": f"Bearer {user_info['token']}"},
        )

        assert res.status_code == 200

    res = client.get(f"/comments/get/by_id/{comment_id}")

    assert res.status_code == 404


def test_report_already_reported(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    comment_id = next(
        comment_random(client, restaurant["restaurant_id"], restaurant["token"])
    )

    user_info = client.post("/users/register", json=next(user_random())).json

    res = client.post(
        f"/comments/report/{comment_id}",
        headers={"Authorization": f"Bearer {user_info['token']}"},
    )

    assert res.status_code == 200

    res = client.post(
        f"/comments/report/{comment_id}",
        headers={"Authorization": f"Bearer {user_info['token']}"},
    )

    assert res.status_code == 400


def test_report_report_own_comment(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    comment_id = next(
        comment_random(client, restaurant["restaurant_id"], restaurant["token"])
    )

    res = client.post(
        f"/comments/report/{comment_id}",
        headers={"Authorization": f"Bearer {restaurant['token']}"},
    )

    assert res.status_code == 403


def test_report_comment_not_found(client: FlaskClient) -> None:
    user_info = client.post("/users/register", json=next(user_random())).json

    res = client.post(
        "/comments/report/999",
        headers={"Authorization": f"Bearer {user_info['token']}"},
    )

    assert res.status_code == 404


############################################################
# /comments/liked_by/add/<int:comment_id>
############################################################


def test_liked_by_add_success(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    comment_id = next(
        comment_random(client, restaurant["restaurant_id"], restaurant["token"])
    )

    user_info = client.post("/users/register", json=next(user_random())).json

    res = client.post(
        f"/comments/liked_by/add/{comment_id}",
        headers={"Authorization": f"Bearer {user_info['token']}"},
    )

    assert res.status_code == 200

    res = client.get(f"/comments/get/by_id/{comment_id}")

    assert user_info["user_id"] in res.json["liked_by"]


def test_liked_by_add_already_liked(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    comment_id = next(
        comment_random(client, restaurant["restaurant_id"], restaurant["token"])
    )

    user_info = client.post("/users/register", json=next(user_random())).json

    res = client.post(
        f"/comments/liked_by/add/{comment_id}",
        headers={"Authorization": f"Bearer {user_info['token']}"},
    )

    assert res.status_code == 200

    res = client.post(
        f"/comments/liked_by/add/{comment_id}",
        headers={"Authorization": f"Bearer {user_info['token']}"},
    )

    assert res.status_code == 400


def test_liked_by_add_cannot_like_their_own_comment(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    comment_id = next(
        comment_random(client, restaurant["restaurant_id"], restaurant["token"])
    )
    res = client.post(
        f"/comments/liked_by/add/{comment_id}",
        headers={"Authorization": f"Bearer {restaurant['token']}"},
    )

    assert res.status_code == 403


def test_liked_by_add_comment_not_found(client: FlaskClient) -> None:
    user_info = client.post("/users/register", json=next(user_random())).json

    res = client.post(
        "/comments/liked_by/add/999",
        headers={"Authorization": f"Bearer {user_info['token']}"},
    )

    assert res.status_code == 404


def test_liked_by_add_will_romeve_dislike(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    comment_id = next(
        comment_random(client, restaurant["restaurant_id"], restaurant["token"])
    )
    user_info = client.post("/users/register", json=next(user_random())).json

    res = client.post(
        f"/comments/disliked_by/add/{comment_id}",
        headers={"Authorization": f"Bearer {user_info['token']}"},
    )

    assert res.status_code == 200

    res = client.post(
        f"/comments/liked_by/add/{comment_id}",
        headers={"Authorization": f"Bearer {user_info['token']}"},
    )

    assert res.status_code == 200

    res = client.get(f"/comments/get/by_id/{comment_id}")

    assert user_info["user_id"] in res.json["liked_by"]
    assert res.json["disliked_by"] is None


############################################################
# /comments/liked_by/remove/<int:comment_id>
############################################################


def test_liked_by_remove_success(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    comment_id = next(
        comment_random(client, restaurant["restaurant_id"], restaurant["token"])
    )
    user_info = client.post("/users/register", json=next(user_random())).json

    res = client.post(
        f"/comments/liked_by/add/{comment_id}",
        headers={"Authorization": f"Bearer {user_info['token']}"},
    )

    assert res.status_code == 200

    res = client.delete(
        f"/comments/liked_by/remove/{comment_id}",
        headers={"Authorization": f"Bearer {user_info['token']}"},
    )

    assert res.status_code == 200

    res = client.get(f"/comments/get/by_id/{comment_id}")

    assert res.json["liked_by"] is None


def test_liked_by_remove_not_liked(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    comment_id = next(
        comment_random(client, restaurant["restaurant_id"], restaurant["token"])
    )
    user_info = client.post("/users/register", json=next(user_random())).json

    res = client.delete(
        f"/comments/liked_by/remove/{comment_id}",
        headers={"Authorization": f"Bearer {user_info['token']}"},
    )

    assert res.status_code == 400


def test_liked_by_remove_comment_not_found(client: FlaskClient) -> None:
    user_info = client.post("/users/register", json=next(user_random())).json

    res = client.delete(
        "/comments/liked_by/remove/999",
        headers={"Authorization": f"Bearer {user_info['token']}"},
    )

    assert res.status_code == 404


############################################################
# /comments/disliked_by/add/<int:comment_id>
############################################################


def test_disliked_by_add_success(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    comment_id = next(
        comment_random(client, restaurant["restaurant_id"], restaurant["token"])
    )
    user_info = client.post("/users/register", json=next(user_random())).json

    res = client.post(
        f"/comments/disliked_by/add/{comment_id}",
        headers={"Authorization": f"Bearer {user_info['token']}"},
    )

    assert res.status_code == 200

    res = client.get(f"/comments/get/by_id/{comment_id}")

    assert user_info["user_id"] in res.json["disliked_by"]


def test_disliked_by_add_already_disliked(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    comment_id = next(
        comment_random(client, restaurant["restaurant_id"], restaurant["token"])
    )
    user_info = client.post("/users/register", json=next(user_random())).json

    res = client.post(
        f"/comments/disliked_by/add/{comment_id}",
        headers={"Authorization": f"Bearer {user_info['token']}"},
    )

    assert res.status_code == 200

    res = client.post(
        f"/comments/disliked_by/add/{comment_id}",
        headers={"Authorization": f"Bearer {user_info['token']}"},
    )

    assert res.status_code == 400


def test_disliked_by_add_cannot_dislike_their_own_comment(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    comment_id = next(
        comment_random(client, restaurant["restaurant_id"], restaurant["token"])
    )
    res = client.post(
        f"/comments/disliked_by/add/{comment_id}",
        headers={"Authorization": f"Bearer {restaurant['token']}"},
    )

    assert res.status_code == 403


def test_disliked_by_add_comment_not_found(client: FlaskClient) -> None:
    user_info = client.post("/users/register", json=next(user_random())).json

    res = client.post(
        "/comments/disliked_by/add/999",
        headers={"Authorization": f"Bearer {user_info['token']}"},
    )

    assert res.status_code == 404


def test_disliked_by_add_will_romeve_like(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    comment_id = next(
        comment_random(client, restaurant["restaurant_id"], restaurant["token"])
    )
    user_info = client.post("/users/register", json=next(user_random())).json

    res = client.post(
        f"/comments/liked_by/add/{comment_id}",
        headers={"Authorization": f"Bearer {user_info['token']}"},
    )

    assert res.status_code == 200

    res = client.post(
        f"/comments/disliked_by/add/{comment_id}",
        headers={"Authorization": f"Bearer {user_info['token']}"},
    )

    assert res.status_code == 200

    res = client.get(f"/comments/get/by_id/{comment_id}")

    assert user_info["user_id"] in res.json["disliked_by"]
    assert res.json["liked_by"] is None


############################################################
# /comments/disliked_by/remove/<int:comment_id>
############################################################


def test_disliked_by_remove_success(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    comment_id = next(
        comment_random(client, restaurant["restaurant_id"], restaurant["token"])
    )
    user_info = client.post("/users/register", json=next(user_random())).json

    res = client.post(
        f"/comments/disliked_by/add/{comment_id}",
        headers={"Authorization": f"Bearer {user_info['token']}"},
    )

    assert res.status_code == 200

    res = client.delete(
        f"/comments/disliked_by/remove/{comment_id}",
        headers={"Authorization": f"Bearer {user_info['token']}"},
    )

    assert res.status_code == 200

    res = client.get(f"/comments/get/by_id/{comment_id}")

    assert res.json["disliked_by"] is None


def test_disliked_by_remove_not_disliked(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    comment_id = next(
        comment_random(client, restaurant["restaurant_id"], restaurant["token"])
    )
    user_info = client.post("/users/register", json=next(user_random())).json

    res = client.delete(
        f"/comments/disliked_by/remove/{comment_id}",
        headers={"Authorization": f"Bearer {user_info['token']}"},
    )

    assert res.status_code == 400


def test_disliked_by_remove_comment_not_found(client: FlaskClient) -> None:
    user_info = client.post("/users/register", json=next(user_random())).json

    res = client.delete(
        "/comments/disliked_by/remove/999",
        headers={"Authorization": f"Bearer {user_info['token']}"},
    )

    assert res.status_code == 404
