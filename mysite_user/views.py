from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect

from mysite_user.models import MySiteUser
# Create your views here.

def index(request):

	context = {'login_status': '-outline', 'signup_status': '-outline'}

	return render(request, 'index.html', context)
