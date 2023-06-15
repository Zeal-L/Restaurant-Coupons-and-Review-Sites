from werkzeug.exceptions import HTTPException

class AccessError(HTTPException):
    code = 400
    description = 'The user does not have permission to perform this action.'

class InputError(HTTPException):
    code = 400
    description = 'The request data is invalid or missing.'

class DatabaseError(HTTPException):
    code = 500
    description = 'The database is not available.'