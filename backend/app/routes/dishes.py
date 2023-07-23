from app import models, services


from flask_jwt_extended import current_user, jwt_required
from flask_restx import Namespace, Resource, fields

api = Namespace("dishes", description="Dishes related operations")

############################################################
# Dish Models

new_dish_model = api.model(
    "New_Dish",
    {
        "name": fields.String(required=True, description="Dish name"),
        "price": fields.Float(required=True, description="Dish price"),
        "description": fields.String(required=True, description="Dish description"),
        "image": fields.String(required=True, description="Dish image in base64"),
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
@api.response(404, "User does not own a restaurant")
class NewDish(Resource):
    @api.doc("new_dish", body=new_dish_model)
    @jwt_required()
    @api.doc("new_dish_post")
    @api.expect(new_dish_model)
    @jwt_required()
    def post(self) -> tuple[dict, int]:
        """
        Create a new dish for the restaurant of the current user.

        Returns:
            A dictionary containing a message and the ID of the created dish.
            An HTTP status code.
        """
        info = api.payload

        user: models.Users = current_user

        res = services.dishes.new_dish_v1(
            user,
            info["name"],
            info["price"],
            info["description"],
            info["image"],
        )

        if res == 400:
            return {"message": "Invalid photo format, must be base64"}, 400
        elif res == 404:
            return {"message": "User does not own a restaurant"}, 404

        res: models.Dishes = res

        return {"message": "Success", "dish_id": res.dish_id}, 200


############################################################


@api.route("/delete/by_id/<int:dish_id>")
@api.param("dish_id", "Dish ID", type="int", required=True)
@api.param(
    "Authorization",
    "JWT Authorization header",
    type="string",
    required=True,
    _in="header",
)
@api.response(200, "Success")
@api.response(401, "Unauthorized, invalid JWT token")
@api.response(404, "User does not own a restaurant or dish does not exist")
class DeleteDishById(Resource):
    @api.doc("delete_dish_by_id")
    @jwt_required()
    @api.doc("delete_dish_by_id")
    @jwt_required()
    def delete(self, dish_id: int) -> tuple[dict, int]:
        """
        Delete a dish by its ID.

        Args:
            dish_id: An integer representing the ID of the dish to be deleted.

        Returns:
            A dictionary containing a message.
            An HTTP status code.
        """
        user: models.Users = current_user

        res = services.dishes.delete_dish_by_id_v1(user, dish_id)

        if res == 404:
            return {
                "message": "User does not own a restaurant or dish does not exist"
            }, 404

        return {"message": "Success"}, 200
