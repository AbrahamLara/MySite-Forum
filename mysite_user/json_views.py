import json

from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseRedirect

from mysite_user.models import MySiteUser
from mysite_forum.models import Thread, Post, Reply
from mysite_forum.forum_paginator import ForumPaginator

@require_http_methods(['GET'])
def fetch_user_threads(request):
	user_id = request.GET.get('id')
	cursor = request.GET.get('cursor')

	user = MySiteUser.objects.get(pk=user_id)

	threads = ForumPaginator(Thread.objects.filter(author=user).order_by('-date_created')).fetch_user_threads_context(cursor)

	return HttpResponse(json.dumps(threads), content_type='application/json')

@require_http_methods(['GET'])
def fetch_user_posts(request):
	user_id = request.GET.get('id')
	cursor = int(request.GET.get('cursor'))

	user = MySiteUser.objects.get(pk=user_id)

	posts = ForumPaginator(Post.objects.filter(author=user).order_by('-date_created')).fetch_user_posts_context(cursor)

	return HttpResponse(json.dumps(posts), content_type='application/json')

@require_http_methods(['GET'])
def fetch_user_replies(request):
	user_id = request.GET.get('id')
	cursor = request.GET.get('cursor')

	user = MySiteUser.objects.get(pk=user_id)

	replies = ForumPaginator(Reply.objects.filter(author=user).order_by('-date_created')).fetch_user_replies_context(cursor)

	return HttpResponse(json.dumps(replies), content_type='application/json')