import base64
import binascii
import datetime
import json
import random
import re
import smtplib
import string
from email.header import Header
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from smtplib import SMTP_SSL
import time

import app.config as config
from app.models import UserORM

############################################################


def check_email_format_v1(email: str) -> bool:
    """Check if email is in correct format

    Args:
        email (str): User email

    Returns:
        bool: True if email is in correct format, False otherwise
    """

    return bool(
        email is not None
        and re.match(r"^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$", email)
    )


############################################################


def check_email_exists_v1(email: str) -> bool:
    """Check if email exists in database

    Args:
        email (str): User email

    Returns:
        bool: True if email exists, False otherwise
    """

    return bool(UserORM.query.filter_by(email=email).first())


############################################################


def user_register_v1(name: str, gender: str, email: str, password: str) -> str or int:
    """Registers a new user with the given name, gender, email and password.

    Args:
        name (str): User name
        gender (str): User gender
        email (str): User email
        password (str): User password

    Returns:
        str: User token if registration is successful, 400 otherwise
    """

    if not check_email_format_v1(email) or check_email_exists_v1(email):
        return 400

    new_user = UserORM.create_user(name, gender, email, password)

    return new_user.token


############################################################


def user_login_v1(email: str, password: str) -> str or int:
    """Logs in a user with the given email and password.

    Args:
        email (str): User email
        password (str): User password

    Returns:
        str: User token if login is successful, 400 if email is invalid, 401 if password is incorrect
    """

    if not check_email_format_v1(email) or not check_email_exists_v1(email):
        return 400

    user: UserORM = UserORM.query.filter_by(email=email).first()
    if not user.check_password(password):
        return 401

    user.refresh_token()

    return user.token


############################################################


def check_photo_format_v1(photo: str) -> bool:
    """Check if photo is in base64 format

    Args:
        photo (str): User photo

    Returns:
        bool: True if photo is in correct format, False otherwise
    """

    try:
        base64.b64decode(photo)
        return True
    except binascii.Error:
        return False


############################################################


def create_email_reset_code_v1(user: UserORM, new_email: str) -> str or int:
    """Send a reset code for the given email.

    Args:
        email (str): User email

    Returns:
        int: Reset code if email is valid, 400 otherwise
    """

    if not check_email_format_v1(new_email) or check_email_exists_v1(new_email):
        return 400

    reset_code = _generate_random_number(6)

    reset_json = {
        "code": reset_code,
        "expiration": time.time() + 5 * 60,
        "new_email": new_email,
    }

    user.set_email_reset_code(json.dumps(reset_json))

    try:
        _send_email(
            new_email,
            {
                "header": "Donut Voucher E-mail Reset Code",
                "body": f"Your reset code is {reset_code}.\nPlease use this code to reset your email.\nThis code will expire in 5 minutes.",
            },
        )
    except smtplib.SMTPResponseException:
        return 500

    return reset_code

############################################################

def verify_and_reset_email_v1(user: UserORM, reset_code):

    if user.email_reset_code is None:
        return 400

    reset_json = json.loads(user.email_reset_code)

    if reset_code != reset_json["code"]:
        return 403

    if time.time() > reset_json["expiration"]:
        return 406

    user.set_email_reset_code(None)
    user.set_email(reset_json["new_email"])

    return user.refresh_token()


############################################################
# Private helper functions


def _generate_random_number(length: int) -> str:
    letters = string.digits
    return "".join(random.choice(letters) for _ in range(length))


def _send_email(receiver: str, content: dict) -> None:
    host_server = "smtp.gmail.com"

    msg = MIMEMultipart()
    msg["subject"] = Header(content["header"], "utf_8")
    msg["From"] = config.email_address
    msg["To"] = Header(receiver, "UTF-8")

    msg.attach(MIMEText(content["body"], "plain", "utf-8"))

    stmp = SMTP_SSL(host_server)

    stmp.login(config.email_address, config.specific_password)
    stmp.sendmail(config.email_address, receiver, msg.as_string())
    stmp.quit()
