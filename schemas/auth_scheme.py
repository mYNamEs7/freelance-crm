from pydantic import BaseModel, EmailStr, ConfigDict


class LoginInputData(BaseModel):
    email: EmailStr
    password: str

class LoginOutputData(BaseModel):
    access_token: str
    token_type: str

    model_config = ConfigDict(from_attributes=True)