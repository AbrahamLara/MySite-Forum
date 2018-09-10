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
			'title': self.title,
			'author': self.author.name,
			'body': self.body,
			'n_posts': self.n_posts,
			'thread_posts': Post().get_posts_json(self)
		}

	def get_threads_json(self):
		threads = self.objects.all()

		return [self._json_thread(thread) for thread in threads]

	def _json_thread(self, thread):
		return {
			'pk': thread.pk,
			'author': thread.author.name,
			'title': thread.title,
			'body': thread.body,
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
			'post_replies': Reply().get_replies_json(post=self)
		}

	def get_posts_json(self, thread):
		posts = Post.objects.filter(thread=thread)

		return [self._json_posts(post) for post in posts]

	def _json_posts(self, post):
		return {
			'pk': post.pk,
			'author': post.author.name,
			'post': post.post,
			'n_replies': post.n_replies,
			'post_replies': Reply().get_replies_json(post=post)
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

	def get_replies_json(self, post):
		replies = Reply.objects.filter(post=post)

		return [self._json_replies(reply) for reply in replies]

	def _json_replies(self, reply):
		return {
			'pk': reply.pk,
			'author': reply.author.name,
			'reply': reply.reply
		}