from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone
from django.core import serializers

from .managers import ThreadManager, PostManager, ReplyManager

# Create your models here.
class Thread(models.Model):
	
	title = models.CharField(_('title'), max_length=170)
	author = models.ForeignKey('mysite_user.MySiteUser', on_delete=models.CASCADE)
	body = models.TextField(_('body'))
	date_created = models.DateTimeField(_('date created'), default=timezone.now)

	object = ThreadManager()

class Post(models.Model):

	post = models.TextField(_('post'))
	author = models.ForeignKey('mysite_user.MySiteUser', on_delete=models.CASCADE)
	thread = models.ForeignKey(Thread, on_delete=models.CASCADE)
	date_posted = models.DateTimeField(_('date posted'), default=timezone.now)

	object = PostManager()

class Reply(models.Model):

	reply = models.TextField(_('reply'))
	author = models.ForeignKey('mysite_user.MySiteUser', on_delete=models.CASCADE)
	post = models.ForeignKey(Post, on_delete=models.CASCADE)
	thread = models.ForeignKey(Thread, on_delete=models.CASCADE)
	date_replied = models.DateTimeField(_('date replied'), default=timezone.now)

	object = ReplyManager()