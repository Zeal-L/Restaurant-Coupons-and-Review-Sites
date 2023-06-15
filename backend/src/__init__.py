from flask_restx import Api

from .users import api as user_api

api = Api(
    title="API Doc",
    version="1.0",
    description="3900Project API Doc",
)

api.add_namespace(user_api)

