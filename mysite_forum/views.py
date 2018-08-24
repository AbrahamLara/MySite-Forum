from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseRedirect

from mysite_forum.models import Thread
from mysite_user.models import MySiteUser

# Create your views here.
def forum(request):
    return render(request, 'forum_page.html')

def create(request):
    if request.method == 'GET':
        return render(request, 'create_thread.html')
    elif request.method == 'POST':

        title = request.POST.get('title')
        body = request.POST.get('body')

        Thread.object.create_thread(title,request.user,body)

        return HttpResponseRedirect('/')
    else: return HttpResponseBadRequest('Something went wrong');