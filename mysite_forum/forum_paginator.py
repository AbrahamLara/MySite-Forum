import json
import math

from django.db.models import TextField
from django.db.models.functions import Concat

from mysite_forum.models import Thread, Post, Reply

class ForumPaginator(object):

    _DISPLAY_N_THREADS = 15
    _DISPLAY_N_POSTS = 15
    _DISPLAY_N_REPLIES = 1

    def __init__(self, queryset):
        self.queryset = queryset

    def fetch_threads_context(self, cursor=None):
        context = self._fetch_context('threads', self._DISPLAY_N_THREADS, cursor)
        context['threads'] = Thread().to_json(context['threads'])
        return context

    def fetch_posts_context(self, cursor=None):
        context = self._fetch_context('posts', self._DISPLAY_N_POSTS, cursor)
        context['posts'] = Post().to_json(context['posts'])
        return context

    def fetch_replies_context(self, cursor=None):
        context = self._fetch_context('replies', self._DISPLAY_N_REPLIES, cursor)
        context['replies'] = Reply().to_json(context['replies'])
        return context

    def _fetch_context(self, type, per_page, cursor):
        paginator = Paginator(self.queryset, per_page, ('date_created', 'id'))
        self.pages = paginator.pages()
        return paginator.context(type, cursor)

    def pages(self):
        return int(self.pages)


class Paginator(object):
    
    def __init__(self, queryset, per_page, annotations):
        self.queryset = queryset
        self.per_page = per_page
        self.annotations = annotations

    def _get_page(self, cursor=None):
        queryset = self._attach_cursor()
        queryset = self._get_next_page(queryset, cursor) if cursor else queryset
        query_total = queryset.count()
        queryset = queryset[:self.per_page]
        page_total = queryset.count()

        self.pages = math.ceil(query_total/self.per_page)
        
        has_next_page = query_total != page_total

        cursor = queryset[page_total-1].cursor

        return (queryset, cursor, has_next_page)

    def _context(self, objects_type, queryset, has_next_page, cursor):
        return {
            '{}'.format(objects_type): queryset,
            'has_next_page': has_next_page,
            'cursor': cursor,
        }

    def context(self, objects_type, cursor=None):
        try:
            queryset, cursor, has_next_page = self._get_page(cursor)
        except (AssertionError):
            return self._context(objects_type, [], False, '')

        return self._context(objects_type, queryset, has_next_page, cursor)

    def _attach_cursor(self):
        annotation = Concat(*[a for a in self.annotations], output_field=TextField())
        return self.queryset.annotate(cursor=annotation)
    
    def _get_next_page(self, queryset, cursor):
        return queryset.filter(cursor__lt=cursor)

    def pages(self):
        return self.pages
