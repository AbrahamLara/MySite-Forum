from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseRedirect

from mysite_forum.models import Thread, Post, Reply
from mysite_user.models import MySiteUser

# Create your views here.
def forum(request):
    return render(request, 'forum_page.html')

def thread(request,id):

    thread = Thread.objects.try_fetch(pk=id)

    context = thread.get_dictionary();

    return render(request, 'thread.html', context)

def create(request):
    if request.method == 'GET':
        return render(request, 'create_thread.html')
    elif request.method == 'POST':

        title = request.POST.get('title')
        body = request.POST.get('body')

        Thread.objects.create_thread(title,request.user,body)

        return HttpResponseRedirect('/')
    else: return HttpResponseBadRequest('Something went wrong')

def post(request, id):

    post = request.POST.get('post')

    thread = Thread.objects.try_fetch(pk=id)

    Post.objects.create_post(post,request.user,thread)

    return HttpResponseRedirect('/forum/thread/{}'.format(id))
