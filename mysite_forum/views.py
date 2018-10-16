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

def create_thread(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/login')

    if request.method == 'GET':
        return render(request, 'create_thread.html')
    elif request.method == 'POST':
        title = request.POST.get('title')
        body = request.POST.get('body')

        Thread.objects.create_thread(title, request.user, body)

        return HttpResponseRedirect('/')
    else: return HttpResponseBadRequest('Something went wrong')

def create_post(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/login')

    post = request.POST.get('text')
    thread_id = request.POST.get('id')
    
    thread = Thread.objects.get(pk=thread_id)
    Thread.objects.increment_n_posts(thread)
    
    post = Post.objects.create_post(post, request.user, thread)._json_post()
    post['n_posts'] = thread.n_posts+1
    return HttpResponse(json.dumps(post), content_type='application/json')

def create_reply(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/login')
        
    reply = request.POST.get('text')
    post_id = request.POST.get('id')

    post = Post.objects.get(pk=post_id)
    Post.objects.increment_n_replies(post)

    reply = Reply.objects.create_reply(reply, request.user, post, post.thread)._json_reply()
    reply['n_replies'] = post.n_replies+1
    return HttpResponse(json.dumps(reply), content_type='application/json')
