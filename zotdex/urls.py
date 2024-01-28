from django.urls import path, include

from core import urls

urlpatterns = [
    path("", include(urls.urlpatterns)),
]
