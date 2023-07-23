from app import models, services

############################################################


def delete_all_voucherTemplate_by_restaurant_v1(restaurant: models.Restaurants) -> int:
    """Deletes all voucherTemplate owned by the given restaurant.
    Also deletes all voucher owned by the voucherTemplate.

    Args:
        restaurant (Restaurants): The restaurant object for the owner of the voucherTemplate.

    """

    voucherTemplates: list[
        models.VoucherTemplate
    ] = models.VoucherTemplate.get_voucher_templates_by_restaurant(
        restaurant.restaurant_id
    )

    for voucherTemplate in voucherTemplates:
        services.vouchers.delete_all_voucher_by_voucherTemplate_v1(voucherTemplate)
