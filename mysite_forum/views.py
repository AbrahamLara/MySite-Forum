from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseRedirect

from mysite_forum.models import Thread, Post, Reply
from mysite_user.models import MySiteUser

# Create your views here.
def forum(request):
    return render(request, 'forum_page.html')

def thread_context(thread):
    dictionary = {}

    dictionary['title'] = thread.title
    dictionary['author'] = thread.author.name
    dictionary['body'] = thread.body
    dictionary['date_created'] = thread.date_created

    return dictionary

def thread(request,id):

    thread = Thread.objects.try_fetch(pk=id)

    context = thread_context(thread)

    return render(request, 'thread.html', context)

def create(request):
    if request.method == 'GET':
        return render(request, 'create_thread.html')
    elif request.method == 'POST':

        title = request.POST.get('title')
        body = request.POST.get('body')

        Thread.objects.create_thread(title,request.user,body)

        return HttpResponseRedirect('/')
    else: return HttpResponseBadRequest('Something went wrong');