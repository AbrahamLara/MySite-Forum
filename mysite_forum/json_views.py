import json

from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseRedirect
from django.views.decorators.http import require_http_methods
from django.core import serializers
from django.contrib.auth.decorators import login_required

from mysite_forum.models import Thread, Post, Reply

@require_http_methods(['GET'])
def fetch_threads(request):

    threads = Thread.objects.all()

    json_threads = serializers.serialize('json', threads)

    return HttpResponse(json.dumps(json_threads), content_type='application/json')

@require_http_methods(['GET'])
def fetch_replies(request, idP):

    post = Post.objects.get(pk=idP)
    
    replies = Reply().get_replies_json(post=post)

    print(replies.__len__())

    return HttpResponse(json.dumps(replies), content_type='application/json')

@require_http_methods(['GET'])
def fetch_more_replies(request, idP, position):
    post = Post.objects.get(pk=idP)

    position = int(position)

    offset = position-5

    if offset < 0:
        offset = 0

    context = dict()

    replies = Reply().get_replies_json(post=post)[offset:position]
    
    context['replies'] = replies
    context['more'] = False

    if offset != 0:
        context['more'] = True

    return HttpResponse(json.dumps(context), content_type='application/json')
