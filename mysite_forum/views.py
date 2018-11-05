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
    context['forum_context'] = ForumPaginator(Thread.objects.all().count()).fetch_threads_context()

    return render(request, 'index.html', context)

def thread(request, thread_id):
    thread = Thread.objects.get(pk=thread_id)

    context = thread.get_dictionary()
    context['thread_posts'] = json.dumps(ForumPaginator(context['n_posts']).fetch_posts_context(thread))

    return render(request, 'thread.html', context)