from django.urls import path

from . import pages

urlpatterns = [
    path("", pages.root),
    path("login", pages.login),
    path("profile", pages.profile),
    path("logout", pages.logout),
    path("leaderboard", pages.leaderboard),
    path("api/login", pages.api_login),
    path("api/register", pages.api_register),
    path("api/capture", pages.api_capture),
    path("api/dex", pages.api_dex),
    path("api/user", pages.api_user),
    path("api/leaderboard/count", pages.api_leaderboard_by_count),
    path("api/raids", pages.api_raids)
]
