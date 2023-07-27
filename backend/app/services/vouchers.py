from app import models, services

############################################################


def create_voucher_template_v1(info: dict) -> models.VoucherTemplate:
    pass


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
