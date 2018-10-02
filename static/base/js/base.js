class ForumPopulator {

    constructor(setting) {
        this.setting = setting;
    }

    setting(setting) {
        this.setting = setting;
    }

    static _createPostObjectInThread(post_data) {
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

        replies.on('click', fetchObects);
        reply.on('click', displayReplyBox);

        post_actions.append(reply, ' - ', replies)
        post_object.append(post, author, post_actions, replies_container);

        return post_object;
    }

    static _createReplyObjectInThread(reply_data) {
        const reply_object = $('<div>');
        const reply = $('<div>', {'class': 'reply', 'text': reply_data.reply});
        const author = $('<div>', {'class': 'author reply-author', 'text': `- ${reply_data.author}`});

        reply_object.append(reply, author);

        return reply_object;
    }

    static _createMoreButtonForReplies(id) {
        return this.createMore(`replies-${id}`, id, 'more replies...');
    }

    static _createMoreButtonForPosts(id) {
        return this.createMore('posts', id, 'more posts...');
    }

    static _createMoreButtonForForum(index) {
        return this.createMore('threads', index, 'Load More Threads...');
    }

    static createMore(class_name, data, text) {
        const more = $('<a>', {'class': `more-btn more-btn-for-${class_name} text-info`, 'value': data});

        more.text(text);

        return more;
    }

    static _addObjectToContainerInThread(data, container) {
        var object;

        if ('reply' in data)
            object = ForumPopulator._createReplyObjectInThread(data);
        else if ('post' in data)
            object = ForumPopulator._createPostObjectInThread(data);
        
        container.append(object);
    }

    createMoreButton(context, data) {
        if (context === 'replies')
            return ForumPopulator._createMoreButtonForReplies(data);
        else if (context === 'posts')
            return ForumPopulator._createMoreButtonForPosts(data);
        else if (context == 'threads')
            return ForumPopulator._createMoreButtonForForum(data);

    }

    addObjectToContainer(data, container) {
        if (this.setting === 'THREAD_PAGE')
            ForumPopulator._addObjectToContainerInThread(data, container);
        else if (this.setting === 'FORUM_PAGE')
            console.log('In Forum page');
        else if (this.setting === 'PROFILE_PAGE')
            console.log('In Profile page');
    }

}