from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone
from django.core import serializers

from .managers import MySiteUserManager
from mysite_forum.models import Thread, Post, Reply

# Create your models here.
class MySiteUser(AbstractBaseUser, PermissionsMixin):
	
	name = models.CharField(_('name'), max_length=80, default='MySite User')
	username = models.CharField(_('username'), max_length=80, unique=True, db_index=True)
	email = models.CharField(_('email'), max_length=40, unique=True)
	date_joined = models.DateTimeField(_('date joined'), default=timezone.now)

	is_staff = models.BooleanField(_('staff status'), default=False, help_text=_('Is user admin'))

	is_active = models.BooleanField(_('is active'), default=True, help_text=_('Is user active'))

	objects = MySiteUserManager()

	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = ['email']
	
	def __str__(self):
		return '{0} - {1}'.format(self.name, self.email)