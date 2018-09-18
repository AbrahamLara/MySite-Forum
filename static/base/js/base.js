class ForumPopulator {

    constructor(setting) {
        this.setting = setting;
    }

    setSetting(setting) {
        this.setting = setting;
    }

    static _createTheadPostObject(post_data) {
        const pk = posts[i].pk;

        const post_object = $('<div>', {'class': 'border border-info border-right-0 border-left-0 border-bottom-0 post-cell', 'id': `post-cell-${pk}`});
        const post = $('<div>', {'class': 'post'});
        const reply = $('<a>', {'class': 'btn btn-link text-info', 'value': `${pk}`, 'data-toggle': 'modal', 'data-target': '#ReplyCenterBox'});
        const replies = $('<a>', {'class': 'btn btn-link text-info', 'value': `${pk}`, 'display': true, 'id': `repliesFor${pk}`});
        const author = $('<div>', {'class': 'author post-author'});
        const post_actions = $('<div>', {'class': 'container-fluid no-padding'});
        const replies_container = $('<div>', {'class': 'container-fluid', 'id': `reply-container-${pk}`, 'css': {'whitespace': 'pre-line'}});

        replies.attr('index', posts[i].n_replies);

        post.text(posts[i].post);
        reply.text('Reply');
        replies.text(`Replies(${posts[i].n_replies})`);
        author.text(`- ${posts[i].author}`);

        replies.on('click', fetchReplies);
        reply.on('click', displayReplyBox);

        post_actions.append(reply,' - ',replies)
        post_object.append(post,author, post_actions, replies_container);

        return post_object;
    }

    static _createThreadReplyObject(reply_data) {
        const reply_object = $('<div>');
        const reply = $('<div>', {'class': 'reply', 'text': reply_data.reply});
        const author = $('<div>', {'class': 'author reply-author', 'text': `- ${reply_data.author}`});

        reply_object.append(reply, author);

        return reply_object;
    }

    static _addObjectToContainerInThread(data, container) {
        var object;

        if ('reply' in data)
            object = ForumPopulator._createThreadReplyObject(data);
        else if ('post' in data)
            object = ForumPopulator._createTheadPostObject(data);
        else
            console.log('This is a thread');
        
        container.append(object);
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

class ForumSettings {
    static THREAD_PAGE() {
        return 'THREAD_PAGE';
    }
    
    static THREAD_PAGE() {
        return 'THREAD_PAGE';
    }

    static THREAD_PAGE() {
        return 'THREAD_PAGE';
    }
}