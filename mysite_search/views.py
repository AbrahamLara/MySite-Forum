import json

from django.db.models import Q
from django.shortcuts import render
from django.core import serializers
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseBadRequest

from mysite_user.models import MySiteUser
# Create your views here.

@login_required
@require_http_methods(['GET'])
def search(request, input):

    filter = Q(name__icontains=input)
    fields = ('name','username','email','is_staff')

    queryset = MySiteUser.objects.filter(filter)

    json_queryset = serializers.serialize('json', queryset, fields=fields)

    return HttpResponse(json.dumps(json_queryset), content_type='application/json')