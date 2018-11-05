import json

from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render

from mysite_user.models import MySiteUser
from mysite_forum.models import Thread, Post, Reply
from mysite_forum.forum_paginator import ForumPaginator
# Create your views here.
def index(request):
	return render(request, 'index.html')

def profile(request, uid):
	
	context = dict()

	user = MySiteUser.objects.get(pk=uid)
	n_threads = Thread.objects.filter(author=user).count()
	n_posts = Post.objects.filter(author=user).count()
	n_replies = Reply.objects.filter(author=user).count()

	context['profile_user'] = user.name
	context['threads'] = json.dumps(ForumPaginator(n_threads).fetch_user_threads(user))
	context['n_threads'] = n_threads
	context['n_posts'] = n_posts
	context['n_replies']= n_replies
	
	return render(request, 'profile.html', context)
