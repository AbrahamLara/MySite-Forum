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

	objects = ThreadManager()

	def get_threads_json(self):
		threads = self.objects.all()

		return [self._json_thread(thread) for thread in threads]

	def _json_thread(self):
		return {
			'pk': self.pk,
			'author': self.author.name,
			'title': self.title,
			'body': self.body,
		}

class Post(models.Model):

	post = models.TextField(_('post'))
	author = models.ForeignKey('mysite_user.MySiteUser', on_delete=models.CASCADE)
	thread = models.ForeignKey(Thread, on_delete=models.CASCADE)
	date_posted = models.DateTimeField(_('date posted'), default=timezone.now)

	objects = PostManager()

	def get_posts(self):

		posts = Post.objects.filter(thread=self)

		return [Post._json_post(post) for post in posts]

	def _json_post(self):
		return {
			'pk': self.pk,
			'author': self.author.name,
			'post': self.post
		}

class Reply(models.Model):

	reply = models.TextField(_('reply'))
	author = models.ForeignKey('mysite_user.MySiteUser', on_delete=models.CASCADE)
	post = models.ForeignKey(Post, on_delete=models.CASCADE)
	thread = models.ForeignKey(Thread, on_delete=models.CASCADE)
	date_replied = models.DateTimeField(_('date replied'), default=timezone.now)

	objects = ReplyManager()