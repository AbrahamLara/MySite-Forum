import json

from django.shortcuts import render
from django.core import serializers
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseRedirect

from mysite_user.models import MySiteUser

@login_required
@require_http_methods(['GET'])
def users_json(request):

	if not request.user.is_staff:
		return HttpResponseRedirect('/')

	users = MySiteUser.objects.all()

	json_users = serializers.serialize('json', users)

	return HttpResponse(json.dumps(json_users), content_type='application/json')

