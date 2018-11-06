from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone
from django.core import serializers

from .managers import ThreadManager, PostManager, ReplyManager

# Create your models here.
class Thread(models.Model):
	
	title 			= models.CharField(_('title'), max_length=170)
	author 			= models.ForeignKey('mysite_user.MySiteUser', on_delete=models.CASCADE)
	body 			= models.TextField(_('body'))
	date_created 	= models.DateTimeField(_('date_created'), default=timezone.now)
	n_posts 		= models.IntegerField(_('n_posts'), default=0)

	objects = ThreadManager()

	class Meta:
		ordering = ['date_created']

	def get_dictionary(self):
		return {
			'pk': self.pk,
			'author_id': self.author.id,
			'title': self.title,
			'author': self.author.name,
			'body': self.body,
			'n_posts': self.n_posts,
		}

	def get_user_threads(self, user, offset, index):
		threads = Thread.objects.filter(author=user)[offset:index]
		return [thread.profile_context() for thread in threads]

	def profile_context(self):
		return {
			'pk': self.id,
			'author_id': self.author.id,
			'title': self.title,
			'author': self.author.name
		}

	def get_json(self, offset=None, index=None):
		threads = Thread.objects.all()[offset:index]
		return [thread.forum_context() for thread in threads]

	def _json_thread(self):
		return {
			'pk': self.pk,
			'author_id': self.author.id,
			'title': self.title,
			'author': self.author.name,
			'body': self.body,
			'n_posts': self.n_posts,
		}

	def forum_context(self):
		return {
			'pk': self.pk,
			'author_id': self.author.id,
			'title': self.title,
			'author': self.author.username,
			'body': self.body,
		}

class Post(models.Model):

	post 		= models.TextField(_('post'))
	author 		= models.ForeignKey('mysite_user.MySiteUser', on_delete=models.CASCADE)
	thread 		= models.ForeignKey(Thread, on_delete=models.CASCADE)
	date_posted = models.DateTimeField(_('date_posted'), default=timezone.now)
	n_replies 	= models.IntegerField(_('n_replies'), default=0)

	objects = PostManager()

	class Meta:
		ordering = ['date_posted']

	def get_post_replies(self):
		return {
			'post_replies': Reply().get_json(post=self)
		}

	def get_json(self, thread, offset=None, index=None):
		posts = Post.objects.filter(thread=thread)[offset:index]
		return [post._json_post() for post in posts]

	def _json_post(self):
		return {
			'pk': self.pk,
			'author_id': self.author.id,
			'author': self.author.name,
			'post': self.post,
			'n_replies': self.n_replies,
		}

class Reply(models.Model):

	reply 			= models.TextField(_('reply'))
	author 			= models.ForeignKey('mysite_user.MySiteUser', on_delete=models.CASCADE)
	post 			= models.ForeignKey(Post, on_delete=models.CASCADE)
	thread 			= models.ForeignKey(Thread, on_delete=models.CASCADE)
	date_replied 	= models.DateTimeField(_('date_replied'), default=timezone.now)

	objects = ReplyManager()

	class Meta:
		ordering = ['date_replied']

	def get_json(self, post, offset=None, index=None):	
		replies = Reply.objects.filter(post=post)[offset:index]
		return [reply._json_reply() for reply in replies]

	def _json_reply(self):
		return {
			'pk': self.pk,
			'author_id': self.author.id,
			'author': self.author.name,
			'reply': self.reply
		}