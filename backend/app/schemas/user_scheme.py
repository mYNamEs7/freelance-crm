from pydantic import BaseModel, ConfigDict, EmailStr


class UserInputData(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserOutputData(BaseModel):
    username: str
    email: EmailStr

    model_config = ConfigDict(from_attributes=True)