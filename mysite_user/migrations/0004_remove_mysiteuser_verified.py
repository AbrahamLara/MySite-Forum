# Generated by Django 2.0.6 on 2018-08-12 00:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mysite_user', '0003_auto_20180715_2346'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='mysiteuser',
            name='verified',
        ),
    ]