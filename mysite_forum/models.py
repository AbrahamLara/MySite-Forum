from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone
from django.core import serializers

from .managers import ThreadManager, PostManager, ReplyManager

# Create your models here.
class Thread(models.Model):
	
	title 			= models.CharField(_('title'), max_length=120)
	author 			= models.ForeignKey('mysite_user.MySiteUser', on_delete=models.CASCADE)
	body 			= models.TextField(_('body'))
	date_created 	= models.DateTimeField(_('date_created'), default=timezone.now)
	n_posts 		= models.IntegerField(_('n_posts'), default=0)

	objects = ThreadManager()

	class Meta:
		ordering = ['date_created']

	def to_json(self, threads):
		return [thread.forum_context() for thread in threads]

	def thread_context(self):
		context =  self.profile_context()
		context['body'] = self.body
		return context

	def profile_context(self):
		context = self._essential_context()
		context['n_posts'] = self.n_posts
		return context

	def forum_context(self):
		return self._essential_context()

	def _essential_context(self):
		return {
			'pk': self.pk,
			'author_id': self.author.id,
			'title': self.title,
			'author': self.author.name,
			'date_created': self.date_created.strftime('%m-%d-%Y'),
		}

class Post(models.Model):

	post 		= models.TextField(_('post'))
	author 		= models.ForeignKey('mysite_user.MySiteUser', on_delete=models.CASCADE)
	thread 		= models.ForeignKey(Thread, on_delete=models.CASCADE)
	date_created = models.DateTimeField(_('date_created'), default=timezone.now)
	n_replies 	= models.IntegerField(_('n_replies'), default=0)

	objects = PostManager()

	class Meta:
		ordering = ['date_created']

	def to_json(self, posts):
		return [post._essential_context() for post in posts]

	def profile_context(self):
		context = self._essential_context()
		context['thread_id'] = self.thread.id
		return context

	def _essential_context(self):
		return {
			'pk': self.pk,
			'author': self.author.name,
			'post': self.post,
			'n_replies': self.n_replies,
			'date_created': self.date_created.strftime('%m-%d-%Y'),
		}

class Reply(models.Model):

	reply 			= models.TextField(_('reply'))
	author 			= models.ForeignKey('mysite_user.MySiteUser', on_delete=models.CASCADE)
	post 			= models.ForeignKey(Post, on_delete=models.CASCADE)
	thread 			= models.ForeignKey(Thread, on_delete=models.CASCADE)
	date_created 	= models.DateTimeField(_('date_created'), default=timezone.now)

	objects = ReplyManager()

	class Meta:
		ordering = ['date_created']

	def get_json(self, replies):
		return [reply._essential_context() for reply in replies]

	def profile_context(self):
		context = self._essential_context()
		context['thread_id'] =  self.thread.id
		context['post'] = self.post.post
		return context

	def _essential_context(self):
		return {
			'pk': self.pk,
			'author_id': self.author.id,
			'author': self.author.name,
			'reply': self.reply,
			'date_created': self.date_created.strftime('%m-%d-%Y'),
		}