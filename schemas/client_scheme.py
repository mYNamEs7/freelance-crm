from pydantic import BaseModel, EmailStr, ConfigDict


class ClientInputData(BaseModel):
    name: str
    contact: str
    notes: str


class ClientOutputData(BaseModel):
    id: int
    user_id: int
    name: str
    contact: str
    notes: str

    model_config = ConfigDict(from_attributes=True)
