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
import mysite_email.views


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

verification_regex = r'^verify/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$'
reset_regex = r'^reset/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$'
urlpatterns.extend([
    re_path(verification_regex, mysite_email.views.verify_account, name='verify'),
    re_path(reset_regex, mysite_email.views.reset_password, name='reset'),
    path('forgot_password/', mysite_email.views.forgot_password, name='forgot_password'),
    path('send_verification/', mysite_email.views.send_verification, name='send_verification'),
    path('send_reset_password/', mysite_email.views.send_reset_password, name='reset_password'),
    path('confirm_password_change/', mysite_email.views.confirm_password_change, name='confirm_password_change')
])





