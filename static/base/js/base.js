class ForumPopulator {

    static _createPostObject(post_data) {
        const pk = post_data.pk;

        const post_object = $('<div>', {'class': 'border border-info border-right-0 border-left-0 border-bottom-0 post-cell', 'id': `post-cell-${pk}`});
        const post = $('<div>', {'class': 'post'});
        const reply = $('<a>', {'class': 'btn btn-link text-info', 'value': `${pk}`, 'data-toggle': 'modal', 'data-target': '#ReplyCenterBox'});
        const replies = $('<a>', {'class': 'btn btn-link text-info', 'value': `${pk}`, 'id': `repliesFor${pk}`});
        const author = $('<div>', {'class': 'author post-author'});
        const post_actions = $('<div>', {'class': 'container-fluid no-padding'});
        const replies_container = $('<div>', {'class': 'container-fluid', 'id': `reply-container-${pk}`, 'css': {'whitespace': 'pre-line'}});

        
        replies.attr({'index': post_data.n_replies, 'display': true});

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

    static _createThreadObject(thread_data) {
        const card = $('<div>', {'class': 'card'});
        const card_header = $('<div>', {'class': 'card-header', 'id': thread_data.pk});
        const h5 = $('<h5>', {'class': 'mb-0'});
        const button = $('<button>', {
            'class': 'btn btn-link text-info title', 
            'type': 'button',
            'data-toggle': 'collapse', 
            'data-target': `#${thread_data.author}${thread_data.pk}`,
            'aria-expanded': 'true', 
            'aria-controls': `#${thread_data.author}${thread_data.pk}`
        });
        const link = $('<a>', {
            'class': 'btn btn-outline-info link',
            'href': `/forum/thread/${thread_data.pk}`,
            'text': 'View'
        });
        const collapse = $('<div>', {
            'class': 'collapse',
            'id': `${thread_data.author}${thread_data.pk}`,
            'aria-labelledby': thread_data.pk,
            'data-parent': '#threads'
        });
        const card_body = $('<div>', {'class': 'card-body'});
        var body = thread_data.body;

        button.text(thread_data.title);

        if(body.length > 1270) 
            body = body.substring(0, 1271)+'...';
        
        card_body.text(body);

        collapse.append(card_body);
        h5.append(button, link);
        card_header.append(h5);
        card.append(card_header, collapse);

        return card;
    }

    static _addObjectToContainer(data, container) {
        var object;

        if ('body' in data)
            object = ForumPopulator._createThreadObject(data);
        else if ('post' in data)
            object = ForumPopulator._createPostObject(data);
        else if ('reply' in data)
            object = ForumPopulator._createReplyObject(data);
        
        container.append(object);
    }

    addObjectToContainer(data, container) {
        ForumPopulator._addObjectToContainer(data, container);
    }

    static _createMoreButtonForReplies(id) {
        return this.createMore(`replies-${id}`, id, 'more replies...');
    }

    static _createMoreButtonForPosts(id) {
        return this.createMore('posts', id, 'more posts...');
    }

    static _createMoreButtonForThreads(index) {
        return this.createMore('threads', index, 'Load More Threads...');
    }

    static createMore(class_name, data, text) {
        const more = $('<a>', {'class': `more-btn more-btn-for-${class_name} text-info`, 'value': data});

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