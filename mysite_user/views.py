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

	context['n_threads'] = Thread.objects.filter(author=user).count()
	context['n_posts'] = Post.objects.filter(author=user).count()
	context['n_replies'] = Reply.objects.filter(author=user).count()
	context['profile_user'] = user.name
	context['threads'] = json.dumps(ForumPaginator(context['n_threads']).fetch_user_threads(user))
	context['posts'] = json.dumps(ForumPaginator(context['n_posts']).fetch_user_posts(user))
	context['replies'] = json.dumps(ForumPaginator(context['n_replies']).fetch_user_replies(user))
	
	return render(request, 'profile.html', context)
