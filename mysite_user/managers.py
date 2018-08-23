from django.db.models import F
from django.db import models
from django.contrib.auth.models import BaseUserManager
from django.core.exceptions import ObjectDoesNotExist

from django.utils import timezone

class MySiteUserManager(BaseUserManager):

	def _create_user(self, username, email, password, is_staff, is_superuser, **extra_fields):
		now = timezone.now()
		if not username:
			raise ValueError('Name must be set')
		if not email:
			raise ValueError('Email must be set')

		email = self.normalize_email(email)
		is_active = extra_fields.pop('is_active', True)

		user = self.model(username=username, email=email, is_staff = is_staff, is_active=is_active,
						  last_login=now,date_joined=now,is_superuser=is_superuser, **extra_fields)
		user.set_password(password)
		user.save(using=self._db)
		return user

	def create_user(self, username, email, password=None, **extra_fields):
		is_staff = extra_fields.pop('is_staff', False)
		return self._create_user(username, email, password, is_staff, False, **extra_fields)

	def create_superuser(self,username, email, password=None, **extra_fields):
		return self._create_user(username, email, password, True, True, **extra_fields)

	def try_fetch(self, *args, **kwargs):
		try:
			return self.get(*args, **kwargs)
		except ObjectDoesNotExist:
			return None