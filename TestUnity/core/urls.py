from django.urls import path
from . import views

app_name = "core"   

urlpatterns = [
  path("", views.homepage, name="homepage"),
  path("checkout", views.checkout, name="checkout"),
  #path("logout", views.logout_request, name= "logout_request"),
 # path("login", views.login_request, name= "logout_request"),
 # path("register", views.register, name="register"),
  path("create-sub", views.create_sub, name="create sub"),
  path("complete", views.complete, name="complete"),
  path("cancel", views.cancel, name="cancel"), #add this

]