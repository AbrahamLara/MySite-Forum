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
        const more = $('<a>', {'class': `more-btn more-btn-for-replies-${id} text-info`, 'value': id});

        more.text('more replies...');

        return more;
    }

    static _createMoreButtonForPosts(id) {
        const more = $('<a>', {'class': `more-btn more-btn-for-posts text-info`, 'value': id});

        more.text('more posts...');

        return more;
    }

    static _createMoreButtonForForum() {
        const more = $('<a>', {'class': 'more-btn more-btn-for-threads text-info'});

        more.text('Load More Threads...');

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

    createMoreButton(context, id) {
        if (context === 'replies')
            return ForumPopulator._createMoreButtonForReplies(id);
        else if (context === 'posts')
            return ForumPopulator._createMoreButtonForPosts(id);
        else if (context == 'threads')
            return ForumPopulator._createMoreButtonForForum();

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