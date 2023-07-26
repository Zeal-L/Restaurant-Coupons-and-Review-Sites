from app import models, services


from flask_jwt_extended import current_user, jwt_required
from flask_restx import Namespace, Resource, fields

api = Namespace("vouchers", description="Vouchers related operations")

############################################################
# Models

new_voucher_model = api.model(
    "NewVoucher",
    {
        "type": fields.String(required=True, description="Voucher type"),
        "discount": fields.String(required=True, description="Voucher discount"),
        "condition": fields.String(required=True, description="Voucher condition"),
        "description": fields.String(required=True, description="Voucher description"),
        "expire": fields.Date(required=True, description="Voucher expire date"),
        "shareable": fields.Boolean(required=True, description="Voucher shareable"),
        "remain_amount": fields.Integer(
            required=True, description="Voucher remain amount"
        ),
        "total_amount": fields.Integer(
            required=True, description="Voucher total amount"
        ),
    },
)

############################################################


