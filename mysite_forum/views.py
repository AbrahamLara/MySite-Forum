import json

from django.shortcuts import render
from django.db.models import F
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseRedirect

from mysite_forum.models import Thread, Post, Reply
from mysite_user.models import MySiteUser
from mysite_forum.forum_paginator import ForumPaginator

# Create your views here.
def index(request):
    context = dict()

    n_threads = Thread.objects.all().count()
    context['forum_context'] = ForumPaginator(n_threads).fetch_threads_context()

    return render(request, 'index.html', context)

def thread(request, thread_id):
    thread = Thread.objects.get(pk=thread_id)

    context = thread.get_dictionary()

    json_posts = ForumPaginator(context['n_posts']).fetch_posts_context(thread)

    context['thread_posts'] = json.dumps(json_posts)

    return render(request, 'thread.html', context)