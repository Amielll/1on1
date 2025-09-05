from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
  path('api/login', TokenObtainPairView.as_view(), name='login'),
  path('api/login/refresh', TokenRefreshView.as_view(), name='login_refresh'),
  path('api/signup', views.CreateUserView.as_view(), name="signup")
]