import json

from mysite_forum.models import Thread, Post, Reply

class ForumPaginator(object):

    _DISPLAY_N_THREADS = 5
    _DISPLAY_N_POSTS = 5
    _DISPLAY_N_REPLIES = 5

    def __init__(self, index):
        self._index = int(index)

    def fetch_threads_context(self):
        context = dict()

        offset = self._index - self._DISPLAY_N_THREADS

        threads = Thread().get_json()[offset:self._index]

        if offset < 0:
            offset = 0
        
        context['threads'] = threads
        context['more'] = offset != 0
        context['offset'] = self._DISPLAY_N_THREADS

        return context

    def fetch_posts_context(self, thread):
        context = dict()

        offset = self._index - self._DISPLAY_N_POSTS

        if offset < 0:
            offset = 0

        posts = Post().get_json(thread=thread)[offset:self._index]

        context['posts'] = posts
        context['thread_id'] = thread.id
        context['more'] = offset != 0
        context['index'] = thread.n_posts
        context['offset'] = self._DISPLAY_N_POSTS

        return context

    def fetch_replies_context(self, post):
        context = dict()

        offset = self._index - self._DISPLAY_N_REPLIES

        if offset < 0:
            offset = 0

        replies = Reply().get_json(post=post)[offset:self._index]
        
        context['replies'] = replies
        context['more'] = offset != 0
        context['offset'] = self._DISPLAY_N_REPLIES

        return context