from django.contrib import admin
from django.urls import path, include #add include

urlpatterns = [
  path('', include('core.urls')),  #add path
  path('admin/', admin.site.urls),
  path("stripe/", include("djstripe.urls", namespace="djstripe")), #add this
]