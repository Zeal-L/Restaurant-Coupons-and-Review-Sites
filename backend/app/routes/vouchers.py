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

info_list_model = api.model(
    "InfoList",
    {
        "info": fields.List(fields.Nested(info_model), required=True),
    },
)

reset_model = api.model(
    "Reset",
    {
        "template_id": fields.Integer(required=False, description="Template id"),
        "type": fields.String(required=False, description="Voucher type"),
        "discount": fields.String(required=False, description="Voucher discount"),
        "condition": fields.String(required=False, description="Voucher condition"),
        "description": fields.String(required=False, description="Voucher description"),
        "expire": fields.Float(required=False, description="Voucher expire date"),
        "shareable": fields.Boolean(required=False, description="Voucher shareable"),
        "remain_amount": fields.Integer(
            required=False, description="Voucher remain amount"
        ),
        "total_amount": fields.Integer(
            required=False, description="Voucher total amount"
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
                "template_info": template_res,
                "auto_release_info": None,
            }, 200

        auto_release_res = services.vouchers.create_auto_release_voucher_v1(
            template_res, info["auto_release"]
        )
        if auto_release_res == 400:
            return {"message": "Start date or end date is invalid"}, 400

        return {
            "template_info": template_res,
            "auto_release_info": auto_release_res,
        }, 200


@api.route("/get/by_restaurant/<int:restaurant_id>")
@api.param("restaurant_id", "Restaurant id", type="int", required=True)
@api.response(200, "Success", body=info_list_model)
@api.response(403, "Restaurant not exist")
class GetByRestaurant(Resource):
    @api.doc("get_by_restaurant")
    @api.marshal_with(info_list_model)
    def get(self, restaurant_id: int) -> tuple[dict, int]:
        """Get all voucher templates and auto release info for a given restaurant.

        Args:
        - restaurant_id (int): The ID of the restaurant to get voucher templates for.

        Returns:
        - A tuple containing a dictionary with the voucher template information and an HTTP status code.

        If the restaurant does not exist, returns a 403 error.
        """
        if models.Restaurants.get_restaurant_by_id(restaurant_id) is None:
            return {"message": "Restaurant not exist"}, 403

        template_list = models.VoucherTemplate.get_voucher_templates_by_restaurant(
            restaurant_id
        )

        info = []

        for template in template_list:
            auto_release = models.VouchersAutoReleaseTimer.get_by_template_id(
                template.template_id
            )

            temp = {
                "template_info": template,
                "auto_release_info": auto_release,
            }

            info.append(temp)

        return {"info": info}, 200


@api.route("/reset/template")
@api.param(
    "Authorization",
    "JWT Authorization header",
    type="string",
    required=True,
    _in="header",
)
@api.response(200, "Success")
@api.response(401, "Unauthorized")
@api.response(403, "Template not exist")
class ResetTemplate(Resource):
    @api.doc("reset_template", body=reset_model)
    @jwt_required()
    def put(self) -> tuple[dict, int]:
        """
        Update an existing voucher template.

        Returns:
            A tuple containing a dictionary with a success message and an HTTP status code.
            If the template does not exist, returns a 403 error.
        """
        user: models.Users = current_user

        info = api.payload

        template = models.VoucherTemplate.get_voucher_template_by_id(
            info["template_id"]
        )

        if template is None:
            return {"message": "Template not exist"}, 403

        if template.restaurant.owner_id != user.user_id:
            return {"message": "Unauthorized"}, 401

        if info.get("type"):
            template.set_type(info["type"])

        if info.get("discount"):
            template.set_discount(info["discount"])

        if info.get("condition"):
            template.set_condition(info["condition"])

        if info.get("description"):
            template.set_description(info["description"])

        if info.get("expire"):
            template.set_expire(info["expire"])

        if info.get("shareable"):
            template.set_shareable(info["shareable"])

        if info.get("remain_amount"):
            template.set_remain_amount(info["remain_amount"])

        if info.get("total_amount"):
            template.set_total_amount(info["total_amount"])

        return {"message": "Success"}, 200
