import json

from django.shortcuts import render
from django.db.models import F
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseRedirect

from mysite_forum.models import Thread, Post, Reply
from mysite_user.models import MySiteUser
from mysite_forum.forum_paginator import ForumPaginator

# Create your views here.
def forum(request):
    
    context = dict()

    context['n_threads'] = Thread.objects.all().count();

    context['forum_context'] = ForumPaginator(context['n_threads']).fetch_threads_context();
    print(context['forum_context'])

    return render(request, 'forum_page.html', context)

def thread(request, idT):

    thread = Thread.objects.get(pk=idT)

    context = thread.get_dictionary()

    json_posts = ForumPaginator(context['n_posts']).fetch_posts_context(thread)

    context['thread_posts'] = json.dumps(json_posts)

    return render(request, 'thread.html', context)

def create_thread(request):
    if request.method == 'GET':
        return render(request, 'create_thread.html')
    elif request.method == 'POST':

        title = request.POST.get('title')
        body = request.POST.get('body')

        Thread.objects.create_thread(title,request.user,body)

        return HttpResponseRedirect('/')
    else: return HttpResponseBadRequest('Something went wrong')

def create_post(request, idT):

    post = request.POST.get('post')

    thread = Thread.objects.try_fetch(pk=idT)

    Post.objects.create_post(post,request.user,thread)

    Thread.objects.increment_n_posts(thread)

    return HttpResponseRedirect('/forum/thread/{}'.format(idT))

def create_reply(request, idT, idP):

    reply = request.POST.get('reply')

    thread = Thread.objects.try_fetch(pk=idT)

    post = Post.objects.try_fetch(pk=idP)

    Post.objects.increment_n_replies(post)

    Reply.objects.create_reply(reply,request.user,post,thread)

    return HttpResponseRedirect('/forum/thread/{}'.format(idT))
