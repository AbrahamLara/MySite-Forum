import re

from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth import login as auth_login
from django.shortcuts import render

from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseRedirect

# Create your views here.

User = get_user_model()

def fetch_context_and_data(request, elements):
    data = []
    context = {}
    for element in elements:
        data.append(request.POST.get(element))
        context[element] = request.POST.get(element)
    return (context, data)

    return [request.POST.get(element) for element in elements]

def login(request):
	if request.user.is_authenticated:
		return HttpResponseRedirect('/')

	if request.method == 'GET':
		context =  {'signup_status': '-outline'}
		
		return render(request, 'login.html', context)
	elif request.method == 'POST':
		context, data = fetch_context_and_data(request, [
			'username', 'password',
		])

		username, password = data

		auth_user = authenticate(username = username, password = password)

		if not auth_user:
			context['signup_status'] = '-outline'
			context['error'] = 'Incorrect username or password'
			return render(request, 'login.html', context)

		auth_login(request, auth_user)

		return HttpResponseRedirect('/')


def signup(request):
	if request.user.is_authenticated:
		return HttpResponseRedirect('/')
	if request.method == 'GET':
		context =  {'login_status': '-outline'}
		return render(request, 'signup.html', context)
	elif request.method == 'POST':
		context, data = fetch_context_and_data(request, [
			'name', 'username', 'email', 'password',
			'passwordConf', 'activationCode'
		])

		name, username, email, password, password_conf, activation_code = data

		pattern = '[a-zA-Z0-9_]'

		if not re.match(pattern, username):
			context['error'] = 'Username must be alphanumeric'
		elif password != password_conf:
			context['error'] = 'Password confirmation does not match'
		elif activation_code != 'ThisIsMySite:D':
			context['error'] = 'Invalid activation code'
		elif User.objects.filter(email = email).exists():
			context['error'] = 'Email already in use'
		elif User.objects.filter(username = username).exists():
			context['error'] = 'Username already in use'

		if 'error' in context:
			context['login_status'] = '-outline'
			return render(request, 'signup.html', context)

		user = User.objects.create_user(
			name = name,
			username = username,
			email = email,
			password = password
		)

		auth_user = authenticate(username = username, password = password)

		return render(request, 'successful_signup.html')














