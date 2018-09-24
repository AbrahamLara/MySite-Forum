import json

from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseRedirect
from django.views.decorators.http import require_http_methods
from django.core import serializers
from django.contrib.auth.decorators import login_required

from mysite_forum.models import Thread, Post, Reply
from mysite_forum.forum_paginator import ForumPaginator

@require_http_methods(['GET'])
def fetch_threads(request, index):
    context = ForumPaginator(index).fetch_threads_context();
    print(context)
    return HttpResponse(json.dumps(context), content_type='application/json')

@require_http_methods(['GET'])
def fetch_posts(request, idT, index):
    
    thread = Thread.objects.get(pk=idT)

    context = ForumPaginator(index).fetch_posts_context(thread)
    
    return HttpResponse(json.dumps(context), content_type='application/json')

@require_http_methods(['GET'])
def fetch_replies(request, idP, index):
    
    post = Post.objects.get(pk=idP)

    context = ForumPaginator(index).fetch_replies_context(post)

    return HttpResponse(json.dumps(context), content_type='application/json')
