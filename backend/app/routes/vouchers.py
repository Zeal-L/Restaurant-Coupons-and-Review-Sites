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

@api.route("/new")
@api.param(
    "Authorization",
    "JWT Authorization header",
    type="string",
    required=True,
    _in="header",
)
@api.response(200, "Success")
@api.response(401, "Unauthorized, invalid JWT token or user not have a restaurant")
class NewVoucherTemplate(Resource):
    @api.doc("new_voucher_template", body=new_voucher_model)
    @jwt_required()
    def post(self) -> tuple[dict, int]:

        info = api.payload

        user: models.Users = current_user
