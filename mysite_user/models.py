from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone
from django.core import serializers

from mysite_user.managers import MySiteUserManager

# Create your models here.
class MySiteUser(AbstractBaseUser, PermissionsMixin):
	name = models.CharField(_('name'), max_length=20, default='MySite User')
	username = models.CharField(_('username'), max_length=80, unique=True, db_index=True)
	email = models.CharField(_('email'), max_length=40, unique=True)
	date_joined = models.DateTimeField(_('date joined'), default=timezone.now)

	is_staff = models.BooleanField(_('staff status'), default=False, help_text=_('Designates whether the user can log into the admin site'))

	is_active = models.BooleanField(_('active'), default=True, help_text=_(
				'Designates whether the user should be considered active.'
				'Unselect rather than deleting accounts'))

	objects = MySiteUserManager()

	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = ['email']

	def essentials_json(self, fields):
		return {
			'name': self.name,
			'email': self.email,
			'username': self.username
		}