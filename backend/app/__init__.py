from flask import Flask
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix

from . import config, models, routes


def create_app(con: object = config.DevelopmentConfig) -> Flask:
    app = Flask(__name__)
    app.config.from_object(con)

    # Fixing Reverse Proxy Problems with ProxyFix Middleware
    app.wsgi_app = ProxyFix(app.wsgi_app)
    # Allow cross-domain requests
    CORS(app)

    models.init_app(app)
    routes.init_app(app)

    return app
