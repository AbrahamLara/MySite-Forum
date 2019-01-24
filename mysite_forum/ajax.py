import json

from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseRedirect

from mysite_forum.models import Thread, Post, Reply

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
        return HttpResponseBadRequest(json.dumps({'error': 'Must be logged in!'}), content_type='application/json')

    post = request.POST.get('text')
    thread_id = request.POST.get('id')
    
    thread = Thread.objects.get(pk=thread_id)
    Thread.objects.increment_n_posts(thread)
    
    post = Post.objects.create_post(post, request.user, thread).thread_context()
    post['n_posts'] = thread.n_posts+1
    return HttpResponse(json.dumps(post), content_type='application/json')

def create_reply(request):
    if not request.user.is_authenticated:
        return HttpResponseBadRequest(json.dumps({'error': 'Must be logged in!'}), content_type='application/json')
        
    reply = request.POST.get('text')
    post_id = request.POST.get('id')

    post = Post.objects.get(pk=post_id)
    Post.objects.increment_n_replies(post)

    reply = Reply.objects.create_reply(reply, request.user, post, post.thread).thread_context()
    reply['n_replies'] = post.n_replies+1
    return HttpResponse(json.dumps(reply), content_type='application/json')

def delete_thread_selection(request):
    if not request.user.is_authenticated:
        return HttpResponseBadRequest(json.dumps({'error': 'Must be logged in!'}), content_type='application/json')

    thread_ids = [int(id) for id in request.POST.getlist('selection[]')]

    for thread_id in thread_ids:
        thread = Thread.objects.filter(pk=thread_id)
        if thread[0].author == request.user:
            thread.delete()

    return HttpResponse(json.dumps(thread_ids), content_type='application/json')

def delete_post_selection(request):
    if not request.user.is_authenticated:
        return HttpResponseBadRequest(json.dumps({'error': 'Must be logged in!'}), content_type='application/json')

    post_ids = [int(id) for id in request.POST.getlist('selection[]')]

    for post_id in post_ids:
        post = Post.objects.filter(pk=post_id)
        if post[0].author == request.user:
            Thread.objects.decrement_n_posts(post[0].thread)
            post.delete()

    return HttpResponse(json.dumps(post_ids), content_type='application/json')

def delete_reply_selection(request):
    if not request.user.is_authenticated:
        return HttpResponseBadRequest(json.dumps({'error': 'Must be logged in!'}), content_type='application/json')

    reply_ids = [int(id) for id in request.POST.getlist('selection[]')]

    for reply_id in reply_ids:
        reply = Reply.objects.filter(pk=reply_id)
        if reply[0].author == request.user:
            Post.objects.decrement_n_replies(reply[0].post)
            reply.delete()

    return HttpResponse(json.dumps(reply_ids), content_type='application/json')