import base64
import binascii
import email as Email
import imaplib
import random
import string
from email.header import Header, decode_header
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from smtplib import SMTP_SSL

from app import config


def check_photo_format_v1(photo: str) -> bool:
    """Check if photo is in base64 format

    Args:
        photo (str): Photo

    Returns:
        bool: True if photo is in correct format, False otherwise
    """

    # # Remove the "data:image/png;base64," prefix if it exists
    # photo = photo.removeprefix("data:image/png;base64,")

    try:
        base64.b64decode(photo)
        return True
    except binascii.Error:
        return False


def generate_random_number(length: int) -> str:
    """
    Generates a random string of digits with the specified length.

    Args:
        length (int): The length of the random string to generate.

    Returns:
        str: A random string of digits with the specified length.
    """
    letters = string.digits
    return "".join(random.choice(letters) for _ in range(length))

def generate_random_string_and_number(length: int) -> str:
    """
    Generates a random string of uppercase letters with the specified length.

    Args:
        length (int): The length of the random string to generate.

    Returns:
        str: A random string of uppercase letters with the specified length.
    """

    letters = string.ascii_uppercase
    return "".join(random.choice(letters) for _ in range(length))


def send_email(receiver: str, content: dict) -> None:
    """
    Sends an email to the specified receiver using the SMTP protocol over SSL.

    Args:
        receiver (str): The email address of the receiver.
        content (dict): A dictionary containing the email header and body.

    Returns:
        None
    """

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


def read_latest_email():
    """
    Reads the latest email from the Gmail inbox using the IMAP protocol.

    Returns:
        str: The subject of the latest email.
        str: The sender of the latest email.
        str: The body of the latest email.
    """
    # create an IMAP4 class with SSL
    imap = imaplib.IMAP4_SSL("imap.gmail.com")

    # authenticate
    imap.login(config.email_address, config.specific_password)

    # select mailbox
    imap.select("inbox")

    # search for latest email
    _, message_numbers_raw = imap.search(None, "ALL")
    message_numbers = message_numbers_raw[0].split(b" ")
    latest_message_number = message_numbers[-1]

    # fetch the email message by ID
    _, message_raw = imap.fetch(latest_message_number, "(RFC822)")
    message = Email.message_from_bytes(message_raw[0][1])

    # decode the email subject and sender
    subject = decode_header(message["Subject"])[0][0]
    sender = decode_header(message["From"])[0][0]

    # get the email body
    if message.is_multipart():
        # iterate over email parts
        for part in message.walk():
            # extract content type of email
            content_type = part.get_content_type()
            content_disposition = str(part.get("Content-Disposition"))

            # get the email body
            if content_type == "text/plain" and "attachment" not in content_disposition:
                body = part.get_payload(decode=True).decode()
                break
    else:
        # extract content type of email
        content_type = message.get_content_type()

        # get the email body
        if content_type == "text/plain":
            body = message.get_payload(decode=True).decode()

    # close the mailbox and logout
    imap.close()
    imap.logout()

    return subject, sender, body
