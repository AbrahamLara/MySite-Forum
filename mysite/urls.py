"""mysite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib.auth.views import logout
from django.conf import settings
from django.contrib import admin
from django.urls import path, re_path

import mysite_auth.views
import mysite_user.views
import mysite_user.json_views
import mysite_search.views
import mysite_search.json_views

urlpatterns = [
	path('admin/', admin.site.urls),
	path('', mysite_user.views.index, name='index'),
]

urlpatterns.extend([
	path('login/', mysite_auth.views.login, name='login'),
	path('signup/', mysite_auth.views.signup, name='signup'),
	path('logout/', logout, {'next_page': settings.LOGOUT_REDIRECT_URL}, name='logout'),
])

urlpatterns.extend([
    path('users_json/', mysite_user.json_views.users_json, name='users_json'),
])

urlpatterns.extend([
    path('search/', mysite_search.views.search, name='search'),
    path('search/users/<input>', mysite_search.json_views.search_users, name='search_users'),
])