from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect

from mysite_user.models import MySiteUser
from mysite_forum.models import Thread, Post, Reply
# Create your views here.

def context(parameter):
	
	context = {}

	return context

def index(request):
	return render(request, 'index.html')

def profile(request, uid):
	
	user = MySiteUser.objects.get(pk=uid)

	threads = Thread.objects.filter(author=user)
	posts = Post.objects.filter(author=user)
	replies = Reply.objects.filter(author=user)

	context = {
		'profile_user': user.name,
		'threads': threads,
		'posts': posts,
		'replies': replies,
		'n_threads': threads.count(),
		'n_posts': posts.count(),
		'n_replies': replies.count()
	}
		
	return render(request, 'profile.html', context)
