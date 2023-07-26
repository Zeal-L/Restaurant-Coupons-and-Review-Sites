from app import models, services


from flask_jwt_extended import current_user, jwt_required
from flask_restx import Namespace, Resource, fields

api = Namespace("dishes", description="Dishes related operations")

############################################################
# Models

new_dish_model = api.model(
    "New_Dish",
    {
        "name": fields.String(required=True, description="Dish name"),
        "price": fields.Float(required=True, description="Dish price"),
        "description": fields.String(required=True, description="Dish description"),
        "image": fields.String(required=True, description="Dish image in base64"),
    },
)

dish_info_model = api.model(
    "Dish_Info",
    {
        "dish_id": fields.Integer(required=True, description="Dish ID"),
        "restaurant_id": fields.Integer(required=True, description="Restaurant ID"),
        "name": fields.String(required=True, description="Dish name"),
        "price": fields.Float(required=True, description="Dish price"),
        "description": fields.String(required=True, description="Dish description"),
        "image": fields.String(required=True, description="Dish image in base64"),
    },
)

dish_list_model = api.model(
    "Dish_List",
    {
        "message": fields.String(required=True, description="Success message"),
        "dish_ids": fields.List(fields.Integer(required=True, description="Dish ID")),
    },
)

image_model = api.model(
    "Image",
    {
        "base64": fields.String(required=True, description="The user photo in base64"),
    },
)

reset_dish_model = api.model(
    "Dish_Info",
    {
        "name": fields.String(required=False, description="Dish name"),
        "price": fields.Float(required=False, description="Dish price"),
        "description": fields.String(required=False, description="Dish description"),
        "image": fields.String(required=False, description="Dish image in base64"),
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
@api.response(400, "Invalid image format, must be base64")
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
            return {"message": "Invalid image format, must be base64"}, 400
        elif res == 404:
            return {"message": "User does not own a restaurant"}, 404

        res: models.Dishes = res

        return {"message": "Success", "dish_id": res.dish_id}, 200


############################################################


@api.route("/get/by_id/<int:dish_id>")
@api.param("dish_id", "Dish ID", type="int", required=True)
@api.response(200, "Success", body=dish_info_model)
@api.response(404, "Dish does not exist")
class GetDishInfo(Resource):
    @api.doc("get_dish_info", model="Dish_Info")
    @api.marshal_with(dish_info_model)
    def get(self, dish_id: int) -> tuple[dict, int]:
        """
        Get information about a specific dish.

        Returns:
            A dictionary containing information about the dish.
            An HTTP status code.
        """
        if dish := models.Dishes.get_dish_by_id(dish_id):
            return dish, 200
        else:
            return {"message": "Dish does not exist"}, 404


############################################################


@api.route("/get/by_restaurant/<int:restaurant_id>")
@api.param(
    "restaurant_id",
    "The ID of the restaurant to get dishes for",
    type="integer",
    required=True,
)
@api.response(200, "Success", body=dish_list_model)
@api.response(404, "Restaurant not found")
class GetDishesByRestaurant(Resource):
    @api.doc("get_dishes_by_restaurant", model="Dish_List")
    def get(self, restaurant_id: int) -> tuple[dict, int]:
        """Get a list of dish IDs for a given restaurant.

        Args:
            restaurant_id: The ID of the restaurant to get dishes for.

        Returns:
            A tuple containing a list of dish IDs, or a dictionary with an error message and an integer status code.
        """
        if not models.Restaurants.query.get(restaurant_id):
            return {"message": "Restaurant not found"}, 404

        dish_ids = [
            dish.dish_id
            for dish in models.Dishes.query.filter_by(restaurant_id=restaurant_id).all()
        ]

        return {"message": "Success", "dish_ids": dish_ids}, 200


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


############################################################


@api.route("/reset/name/<int:dish_id>/<string:name>")
@api.param("dish_id", "Dish ID", type="int", required=True)
@api.param("name", "The new name of the dish", type="string", required=True)
@api.param(
    "Authorization",
    "JWT Authorization header",
    type="string",
    required=True,
    _in="header",
)
@api.response(200, "Success")
@api.response(401, "Unauthorized, invalid JWT token")
@api.response(404, "User does not own the dish")
class ResetDishName(Resource):
    @api.doc("reset_dish_name")
    @jwt_required()
    def put(self, dish_id: int, name: str) -> tuple[dict, int]:
        """Reset the name of the dish.

        Returns:
            A tuple containing a dictionary with the dish's name, price, description, and image if found, and an integer status code.
        """

        user: models.Users = current_user

        if dish := models.Dishes.get_dish_by_id(dish_id):
            if dish.restaurant.owner_id == user.user_id:
                dish.set_name(name)
                return {"message": "Success"}, 200
            else:
                return {"message": "User does not own the dish"}, 404
        else:
            return {"message": "Dish not found"}, 404


############################################################


@api.route("/reset/price/<int:dish_id>/<float:price>")
@api.param("dish_id", "Dish ID", type="int", required=True)
@api.param("price", "The new price of the dish", type="float", required=True)
@api.param(
    "Authorization",
    "JWT Authorization header",
    type="string",
    required=True,
    _in="header",
)
@api.response(200, "Success")
@api.response(401, "Unauthorized, invalid JWT token")
@api.response(404, "User does not own the dish")
class ResetDishPrice(Resource):
    @api.doc("reset_dish_price")
    @jwt_required()
    def put(self, dish_id: int, price: float) -> tuple[dict, int]:
        """Reset the price of the dish.

        Returns:
            A tuple containing a dictionary with the dish's name, price, description, and image if found, and an integer status code.
        """

        user: models.Users = current_user

        if dish := models.Dishes.get_dish_by_id(dish_id):
            if dish.restaurant.owner_id == user.user_id:
                dish.set_price(price)
                return {"message": "Success"}, 200
            else:
                return {"message": "User does not own the dish"}, 404
        else:
            return {"message": "Dish not found"}, 404


############################################################


@api.route("/reset/description/<int:dish_id>/<string:description>")
@api.param("dish_id", "Dish ID", type="int", required=True)
@api.param(
    "description", "The new description of the dish", type="string", required=True
)
@api.param(
    "Authorization",
    "JWT Authorization header",
    type="string",
    required=True,
    _in="header",
)
@api.response(200, "Success")
@api.response(401, "Unauthorized, invalid JWT token")
@api.response(404, "User does not own the dish")
class ResetDishDescription(Resource):
    @api.doc("reset_dish_description")
    @jwt_required()
    def put(self, dish_id: int, description: str) -> tuple[dict, int]:
        """Reset the description of the dish.

        Returns:
            A tuple containing a dictionary with the dish's name, price, description, and image if found, and an integer status code.
        """

        user: models.Users = current_user

        if dish := models.Dishes.get_dish_by_id(dish_id):
            if dish.restaurant.owner_id == user.user_id:
                dish.set_description(description)
                return {"message": "Success"}, 200
            else:
                return {"message": "User does not own the dish"}, 404
        else:
            return {"message": "Dish not found"}, 404


############################################################


@api.route("/reset/image/<int:dish_id>")
@api.param("dish_id", "Dish ID", type="int", required=True)
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
@api.response(404, "User does not own the dish")
class ResetDishImage(Resource):
    @api.doc("reset_dish_image", body=image_model)
    @jwt_required()
    def put(self, dish_id: int) -> tuple[dict, int]:
        """Reset the image of the dish.

        Returns:
            A tuple containing a dictionary with the dish's name, price, description, and image if found, and an integer status code.
        """

        user: models.Users = current_user
        image = api.payload.get("base64")

        if not services.util.check_photo_format_v1(image):
            return {"message": "Invalid image format, must be base64"}, 400

        if dish := models.Dishes.get_dish_by_id(dish_id):
            if dish.restaurant.owner_id == user.user_id:
                dish.set_image(image)
                return {"message": "Success"}, 200
            else:
                return {"message": "User does not own the dish"}, 404
        else:
            return {"message": "Dish not found"}, 404


############################################################


@api.route("/reset/info/<int:dish_id>")
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
@api.response(404, "User does not own the dish")
@api.response(400, "Invalid image format, must be base64")
class ResetDishInfo(Resource):
    @api.doc("reset_dish_info", body=reset_dish_model)
    @jwt_required()
    def put(self, dish_id: int) -> tuple[dict, int]:
        user: models.Users = current_user
        info = api.payload

        if not (dish := models.Dishes.get_dish_by_id(dish_id)):
            return {"message": "Dish not found"}, 404
        if dish.restaurant.owner_id != user.user_id:
            return {"message": "User does not own the dish"}, 404
        if "name" in info:
            dish.set_name(info["name"])
        if "price" in info:
            dish.set_price(info["price"])
        if "description" in info:
            dish.set_description(info["description"])
        if "image" in info:
            if not services.util.check_photo_format_v1(info["image"]):
                return {"message": "Invalid image format, must be base64"}, 400
            dish.set_image(info["image"])
        return {"message": "Success"}, 200
