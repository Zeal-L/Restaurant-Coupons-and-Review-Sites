import base64

from flask.testing import FlaskClient

from .util import user_random, restaurant_random

############################################################
# /restaurants/new
############################################################


def test_register_success(client: FlaskClient) -> None:
    token = client.post("/users/register", json=next(user_random())).json["token"]

    with open("backend/tests/test_image.jpg", "rb") as image:
        image_base64 = base64.b64encode(image.read()).decode("utf-8")

        res = client.post(
            "/restaurants/new",
            json={
                "name": "Test Restaurant",
                "address": "Test Address",
                "image": image_base64,
            },
            headers={"Authorization": f"Bearer {token}"},
        )

        assert res.status_code == 200


def test_register_invalid_image(client: FlaskClient) -> None:
    token = client.post("/users/register", json=next(user_random())).json["token"]

    res = client.post(
        "/restaurants/new",
        json={
            "name": "Test Restaurant",
            "address": "Test Address",
            "image": "invalid",
        },
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 400


def test_register_already_has_restaurant(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))

    with open("backend/tests/test_image.jpg", "rb") as image:
        image_base64 = base64.b64encode(image.read()).decode("utf-8")
        res = client.post(
            "/restaurants/new",
            json={
                "name": "Test Restaurant",
                "address": "Test Address",
                "image": image_base64,
            },
            headers={"Authorization": f"Bearer {restaurant['token']}"},
        )

        assert res.status_code == 403


############################################################
# /restaurants/delete
############################################################


def test_delete_success(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))

    res = client.delete(
        "/restaurants/delete",
        json={"restaurant_id": restaurant["restaurant_id"]},
        headers={"Authorization": f"Bearer {restaurant['token']}"},
    )

    assert res.status_code == 200

    res = client.get(
        f"/restaurants/get/by_id/{restaurant['restaurant_id']}",
        headers={"Authorization": f"Bearer {restaurant['token']}"},
    )

    assert res.status_code == 404


def test_delete_user_does_not_own_restaurant(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    token = client.post("/users/register", json=next(user_random())).json["token"]

    res = client.delete(
        "/restaurants/delete",
        json={"restaurant_id": restaurant["restaurant_id"]},
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 404


############################################################
# /restaurants/get/by_id/<int:restaurant_id>
############################################################


def test_get_restaurant_by_id_success(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    res = client.get(
        f"/restaurants/get/by_id/{restaurant['restaurant_id']}",
        headers={"Authorization": f"Bearer {restaurant['token']}"},
    )

    assert res.status_code == 200


def test_get_restaurant_by_id_not_found(client: FlaskClient) -> None:
    res = client.get("/restaurants/get/by_id/999")
    assert res.status_code == 404


############################################################
# /restaurants/get/by_token
############################################################


def test_get_restaurant_by_token_success(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    res = client.get(
        "/restaurants/get/by_token",
        headers={"Authorization": f"Bearer {restaurant['token']}"},
    )

    assert res.status_code == 200


def test_get_restaurant_by_token_user_does_not_own_restaurant(
    client: FlaskClient,
) -> None:
    token = client.post("/users/register", json=next(user_random())).json["token"]

    res = client.get(
        "/restaurants/get/by_token",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 404


############################################################
# /restaurants/reset/name/<string:name>
############################################################


def test_reset_name_success(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    res = client.put(
        "/restaurants/reset/name/New Name",
        headers={"Authorization": f"Bearer {restaurant['token']}"},
    )

    assert res.status_code == 200

    res = client.get(
        f"/restaurants/get/by_id/{restaurant['restaurant_id']}",
    )

    assert res.json["name"] == "New Name"


def test_reset_name_user_does_not_own_restaurant(client: FlaskClient) -> None:
    token = client.post("/users/register", json=next(user_random())).json["token"]

    res = client.put(
        "/restaurants/reset/name/New Name",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 404


############################################################
# /restaurants/reset/address/<string:address>
############################################################


def test_reset_address_success(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    res = client.put(
        "/restaurants/reset/address/New Address",
        headers={"Authorization": f"Bearer {restaurant['token']}"},
    )

    assert res.status_code == 200

    res = client.get(
        f"/restaurants/get/by_id/{restaurant['restaurant_id']}",
    )

    assert res.json["address"] == "New Address"


def test_reset_address_user_does_not_own_restaurant(client: FlaskClient) -> None:
    token = client.post("/users/register", json=next(user_random())).json["token"]

    res = client.put(
        "/restaurants/reset/address/New Address",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 404


############################################################
# /restaurants/reset/image/<string:image>
############################################################


def test_reset_image_success(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))

    with open("backend/tests/test_image.jpg", "rb") as image:
        image_base64 = base64.b64encode(image.read()).decode("utf-8")
        res = client.put(
            "/restaurants/reset/image",
            json={"base64": image_base64},
            headers={"Authorization": f"Bearer {restaurant['token']}"},
        )

        assert res.status_code == 200

        res = client.get(
            f"/restaurants/get/by_id/{restaurant['restaurant_id']}",
        )

        assert res.json["image"] == image_base64


def test_reset_iamge_invalid_image(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))

    res = client.put(
        "/restaurants/reset/image",
        json={"base64": "invalid_base64_string"},
        headers={"Authorization": f"Bearer {restaurant['token']}"},
    )

    assert res.status_code == 400


def test_reset_iamge_does_not_own_restaurant(client: FlaskClient) -> None:
    token = client.post("/users/register", json=next(user_random())).json["token"]

    with open("backend/tests/test_image.jpg", "rb") as image:
        image_base64 = base64.b64encode(image.read()).decode("utf-8")
        res = client.put(
            "/restaurants/reset/image",
            json={"base64": image_base64},
            headers={"Authorization": f"Bearer {token}"},
        )

        assert res.status_code == 404
