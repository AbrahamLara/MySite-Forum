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

	threads_queryset = Thread.objects.filter(author=user).order_by('-date_created')
	posts_queryset = Post.objects.filter(author=user).order_by('-date_created')
	replies_queryset = Reply.objects.filter(author=user).order_by('-date_created')

	context['n_threads'] = threads_queryset.count()
	context['n_posts'] = posts_queryset.count()
	context['n_replies'] = replies_queryset.count()
	context['profile_user'] = user.name
	context['threads'] = json.dumps(ForumPaginator(threads_queryset).fetch_user_threads_context())
	context['posts'] = json.dumps(ForumPaginator(posts_queryset).fetch_user_posts_context())
	context['replies'] = json.dumps(ForumPaginator(replies_queryset).fetch_user_replies_context())
	context['user_id'] = uid

	return render(request, 'profile.html', context)
