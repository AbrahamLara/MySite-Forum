class ForumPopulator {

    static _createMoreButtonForReplies(id) {
        return this.createMore(`replies-${id}`, id, 'more replies...').attr('object-type', 'replies');
    }

    static _createMoreButtonForPosts(id) {
        return this.createMore('posts', id, 'more posts...').attr('object-type', 'posts');
    }

    static createMore(type, value, text) {
        const more = $('<a>', {'class': `more-btn more-btn-for-${type} text-info`, 'value': value});

        more.text(text);

        return more;
    }

    createMoreButton(context, data) {
        if (context === 'replies')
            return ForumPopulator._createMoreButtonForReplies(data);
        else if (context === 'posts')
            return ForumPopulator._createMoreButtonForPosts(data);
        else if (context == 'threads')
            return ForumPopulator._createMoreButtonForThreads(data);

    }

}