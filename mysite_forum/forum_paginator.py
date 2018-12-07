import json

from mysite_forum.models import Thread, Post, Reply

class ForumPaginator(object):

    _DISPLAY_N_THREADS = 3
    _DISPLAY_N_POSTS = 5
    _DISPLAY_N_REPLIES = 5

    def __init__(self, index):
        self._index = index

    def fetch_user_threads(self, user):
        context = dict()

        offset = self._index - self._DISPLAY_N_THREADS

        if offset < 0:
            offset = 0
        
        context['threads'] = Thread().get_user_threads(user, offset, self._index)
        context.update(self.get_context(offset, self._DISPLAY_N_THREADS))

        return context

    def fetch_user_posts(self, user):
        context = dict()

        offset = self._index - self._DISPLAY_N_POSTS

        if offset < 0:
            offset = 0
        
        context['posts'] = Post().get_user_posts(user, offset, self._index)
        context.update(self.get_context(offset, self._DISPLAY_N_POSTS))

        return context

    def fetch_user_replies(self, user):
        context = dict()

        offset = self._index - self._DISPLAY_N_REPLIES

        if offset < 0:
            offset = 0
        
        context['replies'] = Reply().get_user_replies(user, offset, self._index)
        context.update(self.get_context(offset, self._DISPLAY_N_REPLIES))

        return context

    def fetch_threads_context(self):
        context = dict()

        offset = self._index - self._DISPLAY_N_THREADS

        if offset < 0:
            offset = 0
        
        context['threads'] = Thread().get_json(offset, self._index)
        context.update(self.get_context(offset, self._DISPLAY_N_THREADS))

        return context

    def fetch_posts_context(self, thread):
        context = dict()

        offset = self._index - self._DISPLAY_N_POSTS

        if offset < 0:
            offset = 0

        context['posts'] = Post().get_json(thread, offset, self._index)
        context['thread_id'] = thread.id
        context.update(self.get_context(offset, self._DISPLAY_N_POSTS))

        return context

    def fetch_replies_context(self, post):
        context = dict()

        offset = self._index - self._DISPLAY_N_REPLIES

        if offset < 0:
            offset = 0
        
        context['replies'] = Reply().get_json(post, offset, self._index)
        context['post_id'] = post.id
        context.update(self.get_context(offset, self._DISPLAY_N_REPLIES))

        return context

    def get_context(self, offset, amount_displaying):
        context = dict()

        context['more'] = offset != 0
        context['index'] = self._index
        context['amount_displaying'] = amount_displaying

        return context
