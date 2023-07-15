# pylint: disable=redefined-outer-name, unused-import

import time
import base64

from . import app, client, user_random
from flask.testing import FlaskClient


############################################################
# /users/register
############################################################


def test_register_success(client: FlaskClient) -> None:
    res = client.post("/users/register", json=next(user_random()))

    assert res.status_code == 200
    assert "token" in res.json


def test_register_invalid_email(client: FlaskClient) -> None:
    user = next(user_random())
    user["email"] = "johndoe"
    res = client.post("/users/register", json=user)

    assert res.status_code == 400


def test_register_email_already_registered(client: FlaskClient) -> None:
    user = next(user_random())
    client.post("/users/register", json=user)
    res = client.post("/users/register", json=user)

    assert res.status_code == 400


def test_register_invalid_password(client: FlaskClient) -> None:
    user = next(user_random())
    user["password"] = "password"
    res = client.post("/users/register", json=user)

    assert res.status_code == 403


############################################################
# /users/login
############################################################


def test_login_success(client: FlaskClient) -> None:
    user = next(user_random())
    client.post("/users/register", json=user)
    payload = {"email": user["email"], "password": user["password"]}
    res = client.post("/users/login", json=payload)

    assert res.status_code == 200
    assert "token" in res.json


def test_login_invalid_email(client: FlaskClient) -> None:
    user = next(user_random())
    client.post("/users/register", json=user)
    payload = {"email": "aaa", "password": user["password"]}
    res = client.post("/users/login", json=payload)

    assert res.status_code == 400

    payload = {"email": "not_exist@example.com", "password": user["password"]}
    res = client.post("/users/login", json=payload)

    assert res.status_code == 400


def test_login_invalid_password(client: FlaskClient) -> None:
    user = next(user_random())
    client.post("/users/register", json=user)
    payload = {"email": user["email"], "password": "123"}
    res = client.post("/users/login", json=payload)

    assert res.status_code == 401


############################################################
# /check/email_available/<string:email>
############################################################


def test_check_email_available_success(client: FlaskClient) -> None:
    res = client.post("/users/check/email_available/test@gmail.com")

    assert res.status_code == 200


def test_check_email_available_invalid_email(client: FlaskClient) -> None:
    res = client.post("/users/check/email_available/abc")

    assert res.status_code == 400


def test_check_email_available_email_already_registered(client: FlaskClient) -> None:
    user = next(user_random())
    client.post("/users/register", json=user)
    res = client.post(f"/users/check/email_available/{user['email']}")

    assert res.status_code == 400


############################################################
# /get/by_id/<int:user_id>
############################################################


def test_get_user_randomy_id_success(client: FlaskClient) -> None:
    user = next(user_random())
    client.post("/users/register", json=user)
    res = client.get("/users/get/by_id/1")

    assert res.status_code == 200
    assert user["name"] == res.json["name"]
    assert user["gender"] == res.json["gender"]
    assert user["email"] == res.json["email"]


def test_get_user_randomy_id_not_found(client: FlaskClient) -> None:
    res = client.get("/users/get/by_id/999")

    assert res.status_code == 404


############################################################
# /get/by_email/<string:email>
############################################################


def test_get_user_randomy_email_success(client: FlaskClient) -> None:
    user = next(user_random())
    client.post("/users/register", json=user)
    res = client.get(f"/users/get/by_email/{user['email']}")

    assert res.status_code == 200
    assert user["name"] == res.json["name"]
    assert user["gender"] == res.json["gender"]
    assert user["email"] == res.json["email"]


def test_get_user_randomy_email_not_found(client: FlaskClient) -> None:
    res = client.get("/users/get/by_email/not_exist@example.com")

    assert res.status_code == 404


############################################################
# /get/all
############################################################


def test_get_all_users_success(client: FlaskClient) -> None:
    client.post("/users/register", json=next(user_random()))
    client.post("/users/register", json=next(user_random()))
    client.post("/users/register", json=next(user_random()))
    res = client.get("/users/get/all")

    assert res.status_code == 200
    assert len(res.json["Users"]) == 3


############################################################
# /delete
############################################################


def test_delete_user_success(client: FlaskClient) -> None:
    user = next(user_random())
    token = client.post("/users/register", json=user).json["token"]
    res = client.delete("/users/delete", headers={"Authorization": f"Bearer {token}"})

    assert res.status_code == 200

    res = client.get(f"/users/get/by_email/{user['email']}")

    assert res.status_code == 404


def test_delete_user_unauthorized(client: FlaskClient) -> None:
    client.post("/users/register", json=next(user_random()))
    res = client.delete("/users/delete")

    assert res.status_code == 401


def test_delete_user_unauthorized_old_token(client: FlaskClient) -> None:
    user = next(user_random())
    token = client.post("/users/register", json=user).json["token"]
    payload = {"email": user["email"], "password": user["password"]}

    # Because the minimal token expires time difference is 1 second
    time.sleep(1)
    client.post("/users/login", json=payload)

    res = client.delete("/users/delete", headers={"Authorization": f"Bearer {token}"})

    assert res.status_code == 401


############################################################
# /reset/name/<string:new_name>
############################################################


def test_reset_name_success(client: FlaskClient) -> None:
    token = client.post("/users/register", json=next(user_random())).json["token"]
    new_name = "New Name"
    headers = {"Authorization": f"Bearer {token}"}
    res = client.post(f"/users/reset/name/{new_name}", headers=headers)

    assert res.status_code == 200

    res = client.get("/users/get/by_id/1")

    assert res.status_code == 200
    assert res.json["name"] == new_name


def test_reset_name_unauthorized(client: FlaskClient) -> None:
    client.post("/users/register", json=next(user_random()))
    new_name = "New Name"
    res = client.post(f"/users/reset/name/{new_name}")

    assert res.status_code == 401


############################################################
# /reset/gender/<string:new_gender>
############################################################


def test_reset_gender_success(client: FlaskClient) -> None:
    token = client.post("/users/register", json=next(user_random())).json["token"]
    new_gender = "Female"
    headers = {"Authorization": f"Bearer {token}"}
    res = client.post(f"/users/reset/gender/{new_gender}", headers=headers)

    assert res.status_code == 200

    res = client.get("/users/get/by_id/1")

    assert res.status_code == 200
    assert res.json["gender"] == new_gender


def test_reset_gender_unauthorized(client: FlaskClient) -> None:
    client.post("/users/register", json=next(user_random()))
    new_gender = "Female"
    res = client.post(f"/users/reset/gender/{new_gender}")

    assert res.status_code == 401


############################################################
# /reset/photo
############################################################


def test_reset_photo_success(client: FlaskClient) -> None:
    user = next(user_random())
    token = client.post("/users/register", json=user).json["token"]
    headers = {"Authorization": f"Bearer {token}"}
    photo = base64.b64encode(b"test_photo").decode("utf-8")
    res = client.post("/users/reset/photo", headers=headers, json={"base64": photo})

    assert res.status_code == 200

    res = client.get(f"/users/get/by_email/{user['email']}")

    assert res.status_code == 200
    assert res.json["photo"] == photo


def test_reset_photo_unauthorized(client: FlaskClient) -> None:
    client.post("/users/register", json=next(user_random()))
    photo = base64.b64encode(b"test_photo").decode("utf-8")
    res = client.post("/users/reset/photo", json={"base64": photo})

    assert res.status_code == 401


def test_reset_photo_invalid_format(client: FlaskClient) -> None:
    user = next(user_random())
    token = client.post("/users/register", json=user).json["token"]
    headers = {"Authorization": f"Bearer {token}"}
    res = client.post(
        "/users/reset/photo", headers=headers, json={"base64": "invalid_format"}
    )

    assert res.status_code == 400


############################################################
# /reset/password/with_old_password
############################################################


def test_reset_password_success(client: FlaskClient) -> None:
    user = next(user_random())
    token = client.post("/users/register", json=user).json["token"]
    headers = {"Authorization": f"Bearer {token}"}
    payload = {"old_password": user["password"], "new_password": "Abc1234567"}
    res = client.post(
        "/users/reset/password/with_old_password", headers=headers, json=payload
    )

    assert res.status_code == 200


def test_reset_password_unauthorized(client: FlaskClient) -> None:
    user = next(user_random())
    token = client.post("/users/register", json=user).json["token"]
    headers = {"Authorization": f"Bearer {token}"}
    payload = {"old_password": "wrong_password", "new_password": "Abc1234567"}
    res = client.post(
        "/users/reset/password/with_old_password", headers=headers, json=payload
    )

    assert res.status_code == 401


def test_reset_password_invalid_format(client: FlaskClient) -> None:
    user = next(user_random())
    token = client.post("/users/register", json=user).json["token"]
    headers = {"Authorization": f"Bearer {token}"}
    payload = {"old_password": user["password"], "new_password": "invalid_password"}
    res = client.post(
        "/users/reset/password/with_old_password", headers=headers, json=payload
    )

    assert res.status_code == 400


def test_reset_password_same_password(client: FlaskClient) -> None:
    user = next(user_random())
    token = client.post("/users/register", json=user).json["token"]
    headers = {"Authorization": f"Bearer {token}"}
    payload = {"old_password": user["password"], "new_password": user["password"]}
    res = client.post(
        "/users/reset/password/with_old_password", headers=headers, json=payload
    )

    assert res.status_code == 406
