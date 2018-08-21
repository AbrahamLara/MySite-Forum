from django.shortcuts import render
from django.http import HttpResponseRedirect

# Create your views here.

def search(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/')

    return render(request, 'search.html')