class ForumPopulator {

    static _createPostObject(post_data) {
        const pk = post_data.pk;

        const post_object = $('<div>', {
            'class': 'border border-info border-right-0 border-left-0 border-bottom-0 post-cell',
            'id': `post-cell-${pk}`
        });
        const post = $('<div>', {'class': 'post'});
        const reply = $('<a>', {
            'class': 'btn btn-link text-info',
            'value': pk,
            'data-toggle': 'modal',
            'data-target': '#ReplyCenterBox'
        });
        const replies = $('<a>', {
            'class': 'btn btn-link text-info',
            'value': pk,
            'id': `repliesFor${pk}`,
            'display': true,
            'object-type': 'replies'
        });
        const author = $('<div>', {'class': 'author post-author'});
        const post_actions = $('<div>', {'class': 'container-fluid no-padding'});
        const replies_container = $('<div>', {'class': 'container-fluid', 'id': `reply-container-${pk}`, 'css': {'whitespace': 'pre-line'}});

        replies.attr('index', post_data.n_replies);

        post.text(post_data.post);
        reply.text('Reply');
        replies.text(`Replies(${post_data.n_replies})`);
        author.text(`- ${post_data.author}`);

        replies.on('click', fetchObjects);
        reply.on('click', displayReplyBox);

        post_actions.append(reply, ' - ', replies);
        post_object.append(post, author, post_actions, replies_container);

        return post_object;
    }

    static _createReplyObject(reply_data) {
        const reply_object = $('<div>');
        const reply = $('<div>', {'class': 'reply', 'text': reply_data.reply});
        const author = $('<div>', {'class': 'author reply-author', 'text': `- ${reply_data.author}`});

        reply_object.append(reply, author);

        return reply_object;
    }

    createObject(data) {
        if ('body' in data)
            return ForumPopulator._createThreadObject(data);
        else if ('post' in data)
            return ForumPopulator._createPostObject(data);
        else if ('reply' in data)
            return ForumPopulator._createReplyObject(data);
    }

    static _createMoreButtonForReplies(id) {
        return this.createMore(`replies-${id}`, id, 'more replies...').attr('object-type', 'replies');
    }

    static _createMoreButtonForPosts(id) {
        return this.createMore('posts', id, 'more posts...').attr('object-type', 'posts');
    }

    static _createMoreButtonForThreads(index) {
        return this.createMore('threads', index, 'Load More Threads...').attr('object-type', 'threads');
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