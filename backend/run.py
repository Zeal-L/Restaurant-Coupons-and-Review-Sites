from app import create_app, config

if __name__ == "__main__":
    app = create_app(con=config.DevelopmentConfig)
    app.run(host=config.host, port=config.port)


## Test

# from app.services.users import read_email_v1

# subject, sender, body = read_email_v1()
# print(subject)
# print(sender)
# print(body)
