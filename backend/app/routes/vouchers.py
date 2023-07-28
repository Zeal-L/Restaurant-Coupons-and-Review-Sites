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


template_info_model = api.model(
    "Info",
    {
        "template_id": fields.Integer(required=True, description="Voucher id"),
        "restaurant_id": fields.Integer(required=True, description="Template id"),
        "restaurant_name": fields.String(required=True, description="Restaurant name"),
        "type": fields.String(required=True, description="Voucher type"),
        "discount": fields.String(required=True, description="Voucher discount"),
        "condition": fields.String(required=True, description="Voucher condition"),
        "description": fields.String(required=True, description="Voucher description"),
        "expire": fields.Float(required=True, description="Voucher expire date"),
        "shareable": fields.Boolean(required=True, description="Voucher shareable"),
        "is_collected": fields.Boolean(
            required=False, description="Voucher is collected"
        ),
        "remain_amount": fields.Integer(
            required=True, description="Voucher remain amount"
        ),
        "total_amount": fields.Integer(
            required=True, description="Voucher total amount"
        ),
        "auto_release_info": fields.Nested(auto_release_info_model, required=False),
    },
)

template_info_list_model = api.model(
    "InfoList",
    {
        "info": fields.List(fields.Nested(template_info_model), required=True),
    },
)

voucher_info_model = api.model(
    "VoucherInfo",
    {
        "voucher_id": fields.Integer(required=True, description="Voucher id"),
        "owner_id": fields.Integer(required=True, description="Owner id"),
        "is_used": fields.Boolean(required=True, description="Voucher is used"),
        "used_time": fields.Float(required=False, description="Voucher used time"),
        "template_id": fields.Integer(required=True, description="Voucher id"),
        "restaurant_id": fields.Integer(required=True, description="Template id"),
        "restaurant_name": fields.String(required=True, description="Restaurant name"),
        "type": fields.String(required=True, description="Voucher type"),
        "discount": fields.String(required=True, description="Voucher discount"),
        "condition": fields.String(required=True, description="Voucher condition"),
        "description": fields.String(required=True, description="Voucher description"),
        "expire": fields.Float(required=True, description="Voucher expire date"),
        "shareable": fields.Boolean(required=True, description="Voucher shareable"),
        "remain_amount": fields.Integer(
            required=True, description="Voucher remain amount"
        ),
        "is_collected": fields.Boolean(
            required=False, description="Voucher is collected"
        ),
        "total_amount": fields.Integer(
            required=True, description="Voucher total amount"
        ),
    },
)

voucher_info_list_model = api.model(
    "VoucherInfoList",
    {
        "info": fields.List(fields.Nested(voucher_info_model), required=True),
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
@api.response(200, "Success", model=template_info_model)
@api.response(401, "Unauthorized, invalid JWT token or user not have a restaurant")
class NewVoucherTemplate(Resource):
    @api.doc("new_voucher_template", body=new_voucher_model)
    @jwt_required()
    @api.marshal_with(template_info_model)
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
            "template_id": template_res.template_id,
            "restaurant_id": template_res.restaurant_id,
            "restaurant_name": template_res.restaurant.name,
            "type": template_res.type,
            "discount": template_res.discount,
            "condition": template_res.condition,
            "description": template_res.description,
            "expire": template_res.expire,
            "shareable": template_res.shareable,
            "is_collected": False,
            "remain_amount": template_res.remain_amount,
            "auto_release_info": auto_release_res,
        }, 200


############################################################


@api.route("/get/template/by_id/<int:template_id>")
@api.param(
    "Authorization",
    "JWT Authorization header",
    type="string",
    required=False,
    _in="header",
)
@api.param("template_id", "Template id", type="int", required=True)
@api.response(200, "Success", body=template_info_model)
@api.response(403, "Template not exist")
class GetTemplateById(Resource):
    @api.doc("get_template_by_id")
    @api.marshal_with(template_info_model)
    @jwt_required(optional=True)
    def get(self, template_id: int) -> tuple[dict, int]:
        """Get voucher template by id.
        Args:
            template_id (int): The ID of the template to get voucher templates for.

        Returns:
            A tuple containing a dictionary with the voucher template information and an HTTP status code.
        """
        template = models.VoucherTemplate.get_voucher_template_by_id(template_id)
        if template is None:
            return {"message": "Template not exist"}, 403

        auto_release = models.VouchersAutoReleaseTimer.get_by_template_id(
            template.template_id
        )

        is_collected = False

        if user := current_user:
            if models.Vouchers.query.filter_by(
                owner_id=user.user_id, template_id=template.template_id
            ).first():
                is_collected = True

        temp = {
            "template_id": template.template_id,
            "restaurant_id": template.restaurant_id,
            "restaurant_name": template.restaurant.name,
            "type": template.type,
            "discount": template.discount,
            "condition": template.condition,
            "description": template.description,
            "expire": template.expire,
            "shareable": template.shareable,
            "is_collected": is_collected,
            "remain_amount": template.remain_amount,
            "total_amount": template.total_amount,
            "auto_release_info": auto_release,
        }

        return temp, 200


############################################################


@api.route("/get/template/by_restaurant/<int:restaurant_id>")
@api.param(
    "Authorization",
    "JWT Authorization header",
    type="string",
    required=False,
    _in="header",
)
@api.param("restaurant_id", "Restaurant id", type="int", required=True)
@api.response(200, "Success", body=template_info_list_model)
@api.response(403, "Restaurant not exist")
class GetByRestaurant(Resource):
    @api.doc("get_by_restaurant")
    @api.marshal_with(template_info_list_model)
    @jwt_required(optional=True)
    def get(self, restaurant_id: int) -> tuple[dict, int]:
        """Get all voucher templates and auto release info for a given restaurant.

        Args:
            restaurant_id (int): The ID of the restaurant to get voucher templates for.

        Returns:
            A tuple containing a dictionary with the voucher template information and an HTTP status code.

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

            is_collected = False

            if user := current_user:
                if models.Vouchers.query.filter_by(
                    owner_id=user.user_id, template_id=template.template_id
                ).first():
                    is_collected = True

            temp = {
                "template_id": template.template_id,
                "restaurant_id": template.restaurant_id,
                "restaurant_name": template.restaurant.name,
                "type": template.type,
                "discount": template.discount,
                "condition": template.condition,
                "description": template.description,
                "expire": template.expire,
                "shareable": template.shareable,
                "is_collected": is_collected,
                "remain_amount": template.remain_amount,
                "total_amount": template.total_amount,
                "auto_release_info": auto_release,
            }

            info.append(temp)

        return {"info": info}, 200


############################################################


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


############################################################


@api.route("/user/collect/<int:template_id>")
@api.param("template_id", "Template id", type="int", required=True)
@api.param(
    "Authorization",
    "JWT Authorization header",
    type="string",
    required=True,
    _in="header",
)
@api.response(200, "Success")
@api.response(
    400, "Voucher already collected, user can only collect one voucher for one template"
)
@api.response(401, "Unauthorized, invalid JWT token")
@api.response(403, "Template not exist")
class CollectVoucher(Resource):
    @api.doc("collect_voucher")
    @jwt_required()
    def post(self, template_id: int) -> tuple[dict, int]:
        """
        Collect a voucher for the user associated with the JWT token.

        Returns:
            A tuple containing a dictionary with a success message and an HTTP status code.
            If the template does not exist, returns a 403 error.
        """
        user: models.Users = current_user

        if models.Vouchers.query.filter_by(
            owner_id=user.user_id, template_id=template_id
        ).first():
            return {
                "message": "Voucher already collected, user can only collect one voucher for one template"
            }, 400

        template = models.VoucherTemplate.get_voucher_template_by_id(template_id)

        if template is None:
            return {"message": "Template not exist"}, 403

        models.Vouchers.create_voucher(
            template_id=template_id,
            owner_id=user.user_id,
        )

        template.set_remain_amount(template.remain_amount - 1)

        return {"message": "Success"}, 200


############################################################


# TODO: get_single_vouchers_by_user
@api.route("/get/voucher/by_id/<int:voucher_id>")
@api.param("voucher_id", "Voucher id", type="int", required=True)
@api.response(200, "Success", body=voucher_info_model)
@api.response(403, "Voucher not exist")
class GetVoucherById(Resource):
    @api.doc("get_voucher_by_id")
    @jwt_required()
    @api.marshal_with(voucher_info_model)
    def get(self, voucher_id: int) -> tuple[dict, int]:
        """
        Get a voucher by id.

        Returns:
            A tuple containing a dictionary with a success message and an HTTP status code.
            If the voucher does not exist, returns a 403 error.
        """
        voucher = models.Vouchers.get_voucher_by_id(voucher_id)

        if voucher is None:
            return {"message": "Voucher not exist"}, 403

        return {"voucher": voucher.to_dict()}, 200


############################################################

# TODO: get_all_vouchers_by_user
# @api.route("/get/voucher/by_user")
# @api.param(
#     "Authorization",
#     "JWT Authorization header",
#     type="string",
#     required=True,
#     _in="header",
# )

############################################################

# TODO: user_use_voucher

############################################################

# TODO: verify_voucher

############################################################

# TODO: transfer_voucher
