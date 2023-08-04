from datetime import datetime
from app import models, services, config

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.job import Job

from flask import Flask

my_app = None

scheduler = BackgroundScheduler()
scheduler.start()


def init_app(app: Flask) -> None:
    global my_app
    my_app = app


############################################################


def create_voucher_template_v1(
    user: models.Users, info: dict
) -> int or models.VoucherTemplate:
    """
    Create a voucher template for a restaurant.

    Args:
    - user: a `models.Users` instance representing the owner of the restaurant.
    - info: a dictionary containing the following keys:
        - "type": a string representing the type of the voucher.
        - "discount": a float representing the discount amount.
        - "condition": a float representing the minimum amount required to use the voucher.
        - "description": a string representing the description of the voucher.
        - "expire": a float representing the expiration date of the voucher in timestamp.
        - "shareable": a boolean indicating whether the voucher is shareable.
        - "total_amount": an integer representing the total amount of the voucher.

    Returns:
    - If the restaurant does not exist, return 401.
    - If the expiration date is invalid, return 400.
    - Otherwise, return the created `models.VoucherTemplate` instance.
    """
    restaurant: models.Restaurants = models.Restaurants.get_restaurant_by_owner(
        user.user_id
    )

    # check if restaurant exist
    if restaurant is None:
        return 401

    # check if expire date is valid expire is in timestamp
    if info["expire"] < datetime.now().timestamp():
        return 400

    return models.VoucherTemplate.create_voucher_template(
        restaurant_id=restaurant.restaurant_id,
        voucher_type=info["type"],
        discount=info["discount"],
        condition=info["condition"],
        description=info["description"],
        expire=info["expire"],
        shareable=info["shareable"],
        remain_amount=info["total_amount"],
        total_amount=info["total_amount"],
    )


def create_auto_release_voucher_v1(
    template: models.VoucherTemplate, info: dict
) -> int or models.VouchersAutoReleaseTimer:
    """
    Create an auto-release voucher for a restaurant.

    Args:
    - template: a `models.VoucherTemplate` instance representing the voucher template.
    - info: a dictionary containing the following keys:
        - "amount": an integer representing the amount of the voucher to be released.
        - "start_date": a float representing the start date of the auto-release voucher in timestamp.
        - "end_date": a float representing the end date of the auto-release voucher in timestamp.
        - "interval": an integer representing the interval of the auto-release voucher in minutes.

    Returns:
    - If the end date is invalid, return 400.
    - Otherwise, return the created `models.VouchersAutoReleaseTimer` instance.
    """
    # check end date is valid
    if info["end_date"] < datetime.now().timestamp():
        return 400

    if info["start_date"] > datetime.now().timestamp() + 60:
        scheduler.add_job(
            func=auto_release_create_job,
            args=[
                template.template_id,
                info["amount"],
                info["end_date"],
                info["interval"],
            ],
            trigger="date",
            run_date=datetime.fromtimestamp(info["start_date"]),
        )
    else:
        auto_release_create_job(
            template.template_id, info["amount"], info["end_date"], info["interval"]
        )

    return models.VouchersAutoReleaseTimer.create_vouchers_auto_release_timer(
        restaurant_id=template.restaurant_id,
        template_id=template.template_id,
        amount=info["amount"],
        start_date=info["start_date"],
        end_date=info["end_date"],
        interval=info["interval"],
    )


def auto_release_create_job(
    template_id: int, amount: int, end_date: float, interval: int
) -> None:
    """
    Create a job to auto-release vouchers.

    Args:
    - template_id: an integer representing the ID of the voucher template.
    - amount: an integer representing the amount of the voucher to be released.
    - end_date: a float representing the end date of the auto-release voucher in timestamp.
    - interval: an integer representing the interval of the auto-release voucher in minutes.

    Returns:
    - None
    """
    print("auto_release_create_job")
    job: Job = scheduler.add_job(
        func=auto_release_publish,
        args=[template_id, amount],
        trigger="interval",
        minutes=interval,
    )

    scheduler.add_job(
        func=scheduler.remove_job,
        args=[job.id],
        trigger="date",
        run_date=datetime.fromtimestamp(end_date),
    )


def auto_release_publish(template_id: int, amount: int):
    """
    Publishes auto-released vouchers to users who have favorited the restaurant.

    Args:
    - template_id: an integer representing the ID of the voucher template.
    - amount: an integer representing the amount of the voucher to be released.

    Returns:
    - None
    """
    with my_app.app_context():
        print("auto_release_publish")
        template: models.VoucherTemplate = (
            models.VoucherTemplate.get_voucher_template_by_id(template_id)
        )

        template.set_remain_amount(template.remain_amount + int(amount))
        template.set_total_amount(template.total_amount + int(amount))

        users = services.restaurants.get_all_user_who_favorite_v1(
            template.restaurant_id
        )

        for user in users:
            user: models.Users = user

            body = "Coupon info:\n"
            body += f"type: {template.type}\n"
            body += f"discount: {template.discount}\n"
            body += f"condition: {template.condition}\n"
            body += f"description: {template.description}\n\n"
            body += f"link: http://localhost:{config.frontend_port}/restaurant/{template.restaurant_id}/Voucher"

            restaurant = models.Restaurants.get_restaurant_by_id(template.restaurant_id)

            services.util.send_email(
                user.email,
                {
                    "header": f"Donut Voucher: Your favorite restaurant, {restaurant.name}, just released {amount} coupon!",
                    "body": body,
                },
            )


def delete_all_voucher_by_voucherTemplate_v1(
    voucherTemplate: models.VoucherTemplate,
) -> int:
    """Deletes all voucher owned by the given voucherTemplate.

    Args:
        voucherTemplate (VoucherTemplate): The voucherTemplate object for the owner of the voucher.

    """

    vouchers: list[models.Vouchers] = models.Vouchers.get_vouchers_by_voucher_template(
        voucherTemplate.voucher_template_id
    )

    for voucher in vouchers:
        models.Vouchers.delete_voucher(voucher.voucher_id)

    return 200
