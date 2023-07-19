from app.models import Users, Restaurants

from app.services.restaurants import new_restaurant_v1

from flask_jwt_extended import current_user, jwt_required

from flask_restx import Namespace, Resource, fields

api = Namespace("restaurants", description="Restaurants related operations")


############################################################
# Restaurant Models

new_restaurant_model = api.model(
    "New Restaurant",
    {
        "name": fields.String(required=True, description="Restaurant name"),
        "address": fields.String(required=True, description="Restaurant address"),
        "image": fields.String(required=True, description="Restaurant image in base64"),
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
@api.response(400, "Invalid photo format, must be base64")
@api.response(401, "Unauthorized, invalid JWT token")
class NewRestaurant(Resource):
    @api.doc("new_restaurant", body=new_restaurant_model)
    @jwt_required()
    def post(self) -> tuple[dict, int]:
        info = api.payload

        user: Users = current_user

        res = new_restaurant_v1(user, info["name"], info["address"], info["image"])

        if res == 400:
            return {"message": "Invalid photo format, must be base64"}, 400

        return {"message": "Success"}, 200
