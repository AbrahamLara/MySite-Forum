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

def login(request):
	if request.user.is_authenticated:
		return HttpResponseRedirect('/')

	if request.method == 'GET':
		return render(request, 'login.html')
	elif request.method == 'POST':
		context, data = fetch_context_and_data(request, [
			'username', 'password',
		])

		username, password = data

		auth_user = authenticate(username = username[:80], password = password)

		if not auth_user:
			context['error'] = 'Incorrect username or password'
			return render(request, 'login.html', context)

		auth_login(request, auth_user)

		return HttpResponseRedirect('/')


def signup(request):
	if request.user.is_authenticated:
		return HttpResponseRedirect('/')

	if request.method == 'GET':
		return render(request, 'signup.html')
	elif request.method == 'POST':
		context, data = fetch_context_and_data(request, [
			'name', 'username', 'email', 'password',
			'passwordConf'
		])

		name, username, email, password, password_conf = data

		pattern = '[a-zA-Z0-9_]'

		if not re.match(pattern, username):
			context['error'] = 'Username must be alphanumeric'
		elif password != password_conf:
			context['error'] = 'Password confirmation does not match'
		elif User.objects.filter(email = email).exists():
			context['error'] = 'Email already in use'
		elif User.objects.filter(username = username).exists():
			context['error'] = 'Username already in use'

		if 'error' in context:
			return render(request, 'signup.html', context)

		user = User.objects.create_user(
			name = name[:20],
			username = username[:80],
			email = email[:40],
			password = password
		)

		auth_user = authenticate(username = username, password = password)

		return render(request, 'successful_signup.html')














