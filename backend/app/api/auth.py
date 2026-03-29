from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.security import create_access_token
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import AuthResponse, UserCreate, UserLogin, UserResponse
from app.services.user_service import authenticate_user, create_user, get_user_by_email

router = APIRouter(prefix='/auth', tags=['Authentication'])


@router.post('/register', response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing_user = get_user_by_email(db, user_in.email)
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='An account with this email already exists')

    user = create_user(db, user_in)
    access_token = create_access_token(user.email)
    return AuthResponse(access_token=access_token, user=user)


@router.post('/login', response_model=AuthResponse)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, user_in.email, user_in.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid email or password',
        )

    access_token = create_access_token(user.email)
    return AuthResponse(access_token=access_token, user=user)


@router.get('/me', response_model=UserResponse)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user