from django.db.models import F
from django.db import models
from django.contrib.auth.models import BaseUserManager
from django.core.exceptions import ObjectDoesNotExist

from django.utils import timezone

class ThreadManager(models.Manager):

	def create_thread(self, title, author, body):
		if not title:
			raise ValueError('Title must be set')
		if not author:
			raise ValueError('Author must be set')
		if not body:
			raise ValueError('body must be set')

		thread = self.model(title=title, author=author, body=body)

		thread.save()

		return thread

	def try_fetch(self, *args, **kwargs):
		try:
			return self.get(*args, **kwargs)
		except ObjectDoesNotExist:
			return None

class PostManager(models.Manager):

	def create_post(self, post, author, thread):
		if not post:
			raise ValueError('Post must be set')
		if not author:
			raise ValueError('Author must be set')
		if not thread:
			raise ValueError('Thread must be set')

		thread_post = self.model(post=post, author=author, thread=thread)

		thread_post.save()

		return thread_post

	def try_fetch(self, *args, **kwargs):
		try:
			return self.get(*args, **kwargs)
		except ObjectDoesNotExist:
			return None

	

class ReplyManager(models.Manager):

	def create_reply(self, reply, author, post, thread):
		if not reply:
			raise ValueError('Reply must be set')
		if not author:
			raise ValueError('Author must be set')
		if not post:
			raise ValueError('Post must be set')
		if not thread:
			raise ValueError('Thread must be set')

		post_reply = self.model(reply=reply, author=author, post=post, thread=thread)

		post_reply.save()

		return post_reply

	def try_fetch(self, *args, **kwargs):
		try:
			return self.get(*args, **kwargs)
		except ObjectDoesNotExist:
			return None