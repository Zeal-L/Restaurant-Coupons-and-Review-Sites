import base64

from flask.testing import FlaskClient

from .util import user_random, restaurant_random, dish_random

############################################################
# /dishes/new
############################################################


def test_new_success(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))

    image_path = "backend/tests/test_image.jpg"
    with open(image_path, "rb") as image_file:
        image_base64 = base64.b64encode(image_file.read()).decode("utf-8")

    res = client.post(
        "/dishes/new",
        json={
            "name": "Test Dish",
            "price": 10.0,
            "description": "Test Description",
            "image": image_base64,
        },
        headers={"Authorization": f"Bearer {restaurant['token']}"},
    )

    assert res.status_code == 200


def test_new_invalid_image(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))

    res = client.post(
        "/dishes/new",
        json={
            "name": "Test Dish",
            "price": 10.0,
            "description": "Test Description",
            "image": "invalid",
        },
        headers={"Authorization": f"Bearer {restaurant['token']}"},
    )

    assert res.status_code == 400


def test_new_user_does_not_own_restaurant(client: FlaskClient) -> None:
    token = client.post("/users/register", json=next(user_random())).json["token"]

    image_path = "backend/tests/test_image.jpg"
    with open(image_path, "rb") as image_file:
        image_base64 = base64.b64encode(image_file.read()).decode("utf-8")

    res = client.post(
        "/dishes/new",
        json={
            "name": "Test Dish",
            "price": 10.0,
            "description": "Test Description",
            "image": image_base64,
        },
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 404


############################################################
# /dishes/get/by_id/<int:dish_id>
############################################################


def test_get_by_id_success(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    dish_id = next(dish_random(client, restaurant["token"]))

    res = client.get(f"/dishes/get/by_id/{dish_id}")

    assert res.status_code == 200


def test_get_by_id_dish_does_not_exist(client: FlaskClient) -> None:
    res = client.get("/dishes/get/by_id/999")

    assert res.status_code == 404


############################################################
# /dishes/get/by_restaurant/<int:restaurant_id>
############################################################


def test_get_by_restaurant_success(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    dish_ids = [next(dish_random(client, restaurant["token"]))]
    dish_ids.append(next(dish_random(client, restaurant["token"])))
    dish_ids.append(next(dish_random(client, restaurant["token"])))

    res = client.get(f"/dishes/get/by_restaurant/{restaurant['restaurant_id']}")

    assert res.status_code == 200
    assert len(res.json["dish_ids"]) == 3
    assert res.json["dish_ids"] == dish_ids


def test_get_by_restaurant_not_found(client: FlaskClient) -> None:
    res = client.get("/dishes/get/by_restaurant/999")

    assert res.status_code == 404


############################################################
# /dishes/delete/by_id/<int:dish_id>
############################################################


def test_delete_success(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    dish_id = next(dish_random(client, restaurant["token"]))

    res = client.delete(
        f"/dishes/delete/by_id/{dish_id}",
        headers={"Authorization": f"Bearer {restaurant['token']}"},
    )

    assert res.status_code == 200

    res = client.get(f"/dishes/get/by_id/{dish_id}")

    assert res.status_code == 404


def test_delete_dish_user_does_not_own_restaurant(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    dish_id = next(dish_random(client, restaurant["token"]))
    token = client.post("/users/register", json=next(user_random())).json["token"]

    res = client.delete(
        f"/dishes/delete/by_id/{dish_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 404


def test_delete_dish_does_not_exist(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))

    res = client.delete(
        "/dishes/delete/by_id/999",
        headers={"Authorization": f"Bearer {restaurant['token']}"},
    )

    assert res.status_code == 404


############################################################
# /dishes/reset/name/<int:dish_id>/<string:name>
############################################################


def test_reset_name_success(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    dish_id = next(dish_random(client, restaurant["token"]))

    res = client.put(
        f"/dishes/reset/name/{dish_id}/New Name",
        headers={"Authorization": f"Bearer {restaurant['token']}"},
    )

    assert res.status_code == 200

    res = client.get(f"/dishes/get/by_id/{dish_id}")

    assert res.status_code == 200
    assert res.json["name"] == "New Name"


def test_reset_name_user_does_not_own_dish(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    dish_id = next(dish_random(client, restaurant["token"]))
    token = client.post("/users/register", json=next(user_random())).json["token"]

    res = client.put(
        f"/dishes/reset/name/{dish_id}/New Name",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 404


############################################################
# /dishes/reset/price/<int:dish_id>/<float:price>
############################################################


def test_reset_price_success(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    dish_id = next(dish_random(client, restaurant["token"]))

    res = client.put(
        f"/dishes/reset/price/{dish_id}/10.0",
        headers={"Authorization": f"Bearer {restaurant['token']}"},
    )

    assert res.status_code == 200

    res = client.get(f"/dishes/get/by_id/{dish_id}")

    assert res.status_code == 200
    assert res.json["price"] == 10.0


def test_reset_price_user_does_not_own_dish(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    dish_id = next(dish_random(client, restaurant["token"]))
    token = client.post("/users/register", json=next(user_random())).json["token"]

    res = client.put(
        f"/dishes/reset/price/{dish_id}/10.0",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 404


############################################################
# /dishes/reset/description/<int:dish_id>/<string:description>
############################################################


def test_reset_description_success(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    dish_id = next(dish_random(client, restaurant["token"]))

    res = client.put(
        f"/dishes/reset/description/{dish_id}/New Description",
        headers={"Authorization": f"Bearer {restaurant['token']}"},
    )

    assert res.status_code == 200

    res = client.get(f"/dishes/get/by_id/{dish_id}")

    assert res.status_code == 200
    assert res.json["description"] == "New Description"


def test_reset_description_user_does_not_own_dish(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    dish_id = next(dish_random(client, restaurant["token"]))
    token = client.post("/users/register", json=next(user_random())).json["token"]

    res = client.put(
        f"/dishes/reset/description/{dish_id}/New Description",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 404


############################################################
# /dishes/reset/image/<int:dish_id>
############################################################


def test_reset_image_success(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    dish_id = next(dish_random(client, restaurant["token"]))

    with open("backend/tests/test_image.jpg", "rb") as image_file:
        image_base64 = base64.b64encode(image_file.read()).decode("utf-8")

    res = client.put(
        f"/dishes/reset/image/{dish_id}",
        json={"base64": image_base64},
        headers={"Authorization": f"Bearer {restaurant['token']}"},
    )

    assert res.status_code == 200

    res = client.get(f"/dishes/get/by_id/{dish_id}")

    assert res.status_code == 200
    assert res.json["image"] == image_base64


def test_reset_image_user_does_not_own_dish(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    dish_id = next(dish_random(client, restaurant["token"]))
    token = client.post("/users/register", json=next(user_random())).json["token"]

    with open("backend/tests/test_image.jpg", "rb") as image_file:
        image_base64 = base64.b64encode(image_file.read()).decode("utf-8")

    res = client.put(
        f"/dishes/reset/image/{dish_id}",
        json={"base64": image_base64},
        headers={"Authorization": f"Bearer {token}"},
    )

    assert res.status_code == 404


def test_reset_image_invalid_image(client: FlaskClient) -> None:
    restaurant = next(restaurant_random(client))
    dish_id = next(dish_random(client, restaurant["token"]))

    res = client.put(
        f"/dishes/reset/image/{dish_id}",
        json={"base64": "invalid"},
        headers={"Authorization": f"Bearer {restaurant['token']}"},
    )

    assert res.status_code == 400
