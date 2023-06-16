from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from werkzeug.middleware.proxy_fix import ProxyFix

from src import api, config


app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app)
CORS(app)

app.config['JWT_SECRET_KEY'] = 'super-secret'

jwt = JWTManager(app)

if __name__ == "__main__":
    api.init_app(app)
    app.run(port=config.port, debug=True)

