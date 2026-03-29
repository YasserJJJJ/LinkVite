from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class UserCreate(BaseModel):
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    age: Optional[int] = Field(default=None, ge=0, le=120)
    gender: Optional[str] = Field(default=None, max_length=50)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

    @field_validator('first_name', 'last_name', 'gender', mode='before')
    @classmethod
    def strip_strings(cls, value: str | None):
        if isinstance(value, str):
            value = value.strip()
            return value or None
        return value


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class Token(BaseModel):
    access_token: str
    token_type: str = 'bearer'


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    first_name: str
    last_name: str
    age: Optional[int]
    gender: Optional[str]
    is_active: bool
    created_at: datetime


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'
    user: UserResponse