from app import models, services


from flask_jwt_extended import current_user, jwt_required
from flask_restx import Namespace, Resource, fields

api = Namespace("vouchers", description="Vouchers related operations")

############################################################
# Models

auto_release_model = api.model(
    "AutoRelease",
    {
        "amount": fields.Integer(required=True, description="Voucher amount"),
        "start_date": fields.Float(required=True, description="Voucher start date"),
        "end_date": fields.Float(required=True, description="Voucher end date"),
        "interval": fields.Integer(required=True, description="Voucher interval"),
    },
)

new_voucher_model = api.model(
    "NewVoucher",
    {
        "type": fields.String(required=True, description="Voucher type"),
        "discount": fields.String(required=True, description="Voucher discount"),
        "condition": fields.String(required=True, description="Voucher condition"),
        "description": fields.String(required=True, description="Voucher description"),
        "expire": fields.Float(required=True, description="Voucher expire date"),
        "shareable": fields.Boolean(required=True, description="Voucher shareable"),
        "total_amount": fields.Integer(
            required=True, description="Voucher total amount"
        ),
        "auto_release": fields.Nested(auto_release_model, required=False),
    },
)

template_info_model = api.model(
    "TemplateInfo",
    {
        "template_id": fields.Integer(required=True, description="Voucher id"),
        "restaurant_id": fields.Integer(required=True, description="Template id"),
        "type": fields.String(required=True, description="Voucher type"),
        "discount": fields.String(required=True, description="Voucher discount"),
        "condition": fields.String(required=True, description="Voucher condition"),
        "description": fields.String(required=True, description="Voucher description"),
        "expire": fields.Float(required=True, description="Voucher expire date"),
        "shareable": fields.Boolean(required=True, description="Voucher shareable"),
        "remain_amount": fields.Integer(
            required=True, description="Voucher remain amount"
        ),
        "total_amount": fields.Integer(
            required=True, description="Voucher total amount"
        ),
    },
)

auto_release_info_model = api.model(
    "AutoReleaseInfo",
    {
        "timer_id": fields.Integer(required=True, description="Voucher id"),
        "restaurant_id": fields.Integer(required=True, description="Template id"),
        "template_id": fields.Integer(required=True, description="Template id"),
        "amount": fields.Integer(required=True, description="Voucher amount"),
        "start_date": fields.Float(required=True, description="Voucher start date"),
        "end_date": fields.Float(required=True, description="Voucher end date"),
        "interval": fields.Integer(required=True, description="Voucher interval"),
    },
)


info_model = api.model(
    "Info",
    {
        "template_info": fields.Nested(template_info_model, required=True),
        "auto_release_info": fields.Nested(auto_release_info_model, required=False),
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
@api.response(200, "Success", model=info_model)
@api.response(401, "Unauthorized, invalid JWT token or user not have a restaurant")
class NewVoucherTemplate(Resource):
    @api.doc("new_voucher_template", body=new_voucher_model)
    @jwt_required()
    @api.marshal_with(info_model)
    def post(self) -> tuple[dict, int]:
        """Create a new voucher template.

        Returns:
        A tuple containing a dictionary with the message, template information and auto-release information (if applicable) and an HTTP status code.
        """
        info = api.payload

        user: models.Users = current_user

        template_res = services.vouchers.create_voucher_template_v1(user, info)

        if template_res == 400:
            return {"message": "Expire date is invalid"}, 400
        elif template_res == 401:
            return {
                "message": "Unauthorized, invalid JWT token or user not have a restaurant"
            }, 401

        if not info.get("auto_release"):
            return {
                "message": "Success",
                "template_info": template_res,
                "auto_release_info": None,
            }, 200

        auto_release_res = services.vouchers.create_auto_release_voucher_v1(
            template_res, info["auto_release"]
        )
        if auto_release_res == 400:
            return {"message": "Start date or end date is invalid"}, 400

        return {
            "message": "Success",
            "template_info": template_res,
            "auto_release_info": auto_release_res,
        }, 200
