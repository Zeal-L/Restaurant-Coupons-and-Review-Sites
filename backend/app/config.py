from datetime import timedelta


# Set up host and port
host = "localhost"
port = 5001
url = f"http://{host}:{port}"

# set up database
host = "localhost"
database = "backend3900"
user = "zhangwenqian"
password = "123456"

# set up email
email_address = "a.very.casual.email@gmail.com"
specific_password = "txweqsodfbjxanme"


class Config(object):
    JWT_SECRET_KEY = "super-secret"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)
    SQLALCHEMY_DATABASE_URI = f"postgresql://{user}:{password}@{host}/{database}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class DevelopmentConfig(Config):
    DEBUG = True
    DEVELOPMENT = True


class ProductionConfig(Config):
    DEBUG = False
    DEVELOPMENT = False


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = f"postgresql://{user}:{password}@{host}/{database}_test"
