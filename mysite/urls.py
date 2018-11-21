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

import mysite_forum.views
import mysite_forum.ajax
import mysite_forum.json_views

urlpatterns = [
	path('admin/', admin.site.urls),
	path('', mysite_forum.views.index, name='index'),
    path('profile/<uid>', mysite_user.views.profile, name='profile_page'),
]

urlpatterns.extend([
	path('login/', mysite_auth.views.login, name='login'),
	path('signup/', mysite_auth.views.signup, name='signup'),
	path('logout/', logout, {'next_page': settings.LOGOUT_REDIRECT_URL}, name='logout'),
])

urlpatterns.extend([
    path('thread/<int:thread_id>', mysite_forum.views.thread, name='thread'),
    path('create', mysite_forum.ajax.create_thread, name='create_thread'),
    path('create_post/', mysite_forum.ajax.create_post, name='create_post'),
    path('create_reply/', mysite_forum.ajax.create_reply, name='create_reply'),
    path('delete_thread_selection/', mysite_forum.ajax.delete_thread_selection, name='delete_thread_selection'),
    path('delete_post_selection/', mysite_forum.ajax.delete_post_selection, name='delete_post_selection'),
    path('delete_reply_selection/', mysite_forum.ajax.delete_reply_selection, name='delete_reply_selection'),
])

urlpatterns.extend([
    path('fetch_threads/', mysite_forum.json_views.fetch_threads, name='fetch_threads'),
    path('fetch_posts/', mysite_forum.json_views.fetch_posts, name='fetch_posts'),
    path('fetch_replies/', mysite_forum.json_views.fetch_replies, name='fetch_replies'),
    path('fetch_user_threads/', mysite_user.json_views.fetch_user_threads, name='fetch_user_threads'),
    path('fetch_user_posts/', mysite_user.json_views.fetch_user_posts, name='fetch_user_posts'),
    path('fetch_user_replies/', mysite_user.json_views.fetch_user_replies, name='fetch_user_replies'),
])