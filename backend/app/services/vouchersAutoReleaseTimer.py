from app import models, services

############################################################


def delete_all_vouchersAutoReleaseTimer_by_restaurant_v1(
    restaurant: models.Restaurants,
) -> None:
    """Deletes all vouchersAutoReleaseTimer owned by the given restaurant.

    Args:
        restaurant (Restaurants): The restaurant object for the owner of the vouchersAutoReleaseTimer.

    """

    timers: list[
        models.VouchersAutoReleaseTimer
    ] = models.VouchersAutoReleaseTimer.get_all_timers_by_restaurant(
        restaurant.restaurant_id
    )

    for timer in timers:
        models.VouchersAutoReleaseTimer.delete_timer_by_id(
            timer.timer_id
        )
