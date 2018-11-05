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
    
    post = Post.objects.create_post(post, request.user, thread)._json_post()
    post['n_posts'] = thread.n_posts+1
    return HttpResponse(json.dumps(post), content_type='application/json')

def create_reply(request):
    if not request.user.is_authenticated:
        return HttpResponseBadRequest(json.dumps({'error': 'Must be logged in!'}), content_type='application/json')
        
    reply = request.POST.get('text')
    post_id = request.POST.get('id')

    post = Post.objects.get(pk=post_id)
    Post.objects.increment_n_replies(post)

    reply = Reply.objects.create_reply(reply, request.user, post, post.thread)._json_reply()
    reply['n_replies'] = post.n_replies+1
    return HttpResponse(json.dumps(reply), content_type='application/json')

def delete_selection(request):
    if not request.user.is_authenticated:
        return HttpResponseBadRequest(json.dumps({'error': 'Must be logged in!'}), content_type='application/json')

    threads = [int(id) for id in request.POST.getlist('threads[]')]

    for thread in threads:
        Thread.objects.filter(pk=thread).delete()

    return HttpResponse(json.dumps(threads), content_type='application/json')