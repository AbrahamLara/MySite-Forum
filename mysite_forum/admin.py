from django.contrib import admin
from .models import Thread, Post, Reply

# Register your models here.
admin.site.register([Thread, Post, Reply])