$(document).ready(function() {
    appendObject(threads_context, threads_context.threads, 'thread');
    appendObject(posts_context, posts_context.posts, 'post');
    appendObject(replies_context, replies_context.replies, 'reply');
});

var type;

const plural = {
    thread: 'threads',
    post: 'posts',
    reply: 'replies',
}

const container = {
    thread: $('#threads-container'),
    post: $('#posts-container'),
    reply: $('#replies-container')
}

const appendObject = function(context, objects, this_type) {
    for (var i = objects.length-1; i >= 0; i--) {
        if (this_type == 'thread')
            object = getThreadBlock(objects[i]);
        else if (this_type == 'post')
            object = getPostBlock(objects[i]);
        else if (this_type == 'reply')
            object = getReplyBlock(objects[i]);

        container[this_type].append(object);
    }

    if (context.more) {
        more = createMoreObject();
        more.attr('index', context.index-context.amount_displaying);
        more.attr('type', this_type);
        more.on('click', fetchObjects);

        container[this_type].append(more);
    }
}

const fetchObjects = function() {
    $(this).remove();
    index = $(this).attr('index');
    type = $(this).attr('type');

    $.ajax({
        url: `/fetch_user_${plural[type]}/`,
        data: {'id': id, 'index': index},
        contentType: 'application/json',
        success: function(data) {

            if (type == 'thread') 
                objects = data.threads;
            else if (type == 'post') 
                objects = data.posts;
            else if (type == 'reply') 
                objects = data.replies;
            appendObject(data, objects, type);

        },
        error: function(data) {
            console.log(data);
        }
    });
}

const getThreadBlock = function(thread_data) {
    const thread_block = $('<div>', {'class': 'block', 'id': `thread-block-${thread_data.pk}`});
    const thread_link = $('<a>', {'class': 'thread-link text-info', 'href': `/thread/${thread_data.pk}`});

    if (thread_data.title.length > 51)
        thread_data.title = thread_data.title.substring(0, 50)+'...';

    thread_link.text(thread_data.title);
    thread_block.append(thread_link);

    return thread_block;
}

const getPostBlock = function(post_data) {
    const post_block = $('<div>', {'class': 'block', 'id': `post-block-${post_data.pk}`});
    const post_link = $('<a>', {'class': 'post-link text-info', 'href': `/thread/${post_data.thread_id}`});

    if (post_data.post.length > 51)
        post_data.post = post_data.post.substring(0, 50)+'...';

    post_link.text(post_data.post);
    post_block.append(post_link);

    return post_block;
};

const getReplyBlock = function(reply_data) {
    const reply_block = $('<div>', {'class': 'block', 'id': `reply-block-${reply_data.pk}`});
    const reply_link = $('<a>', {'class': 'reply-link text-info', 'href': `/thread/${reply_data.thread_id}`});

    if (reply_data.reply.length > 51)
        reply_data.reply = reply_data.reply.substring(0, 50)+'...';

    reply_link.text(reply_data.reply);
    reply_block.append(reply_link);

    return reply_block;
};

const createMoreObject = function() {
    const button = $('<div>', {
        'class': 'more-btn more-btn-for-threads text-info',
        'text': 'Load More Threads...'
    });

    return button;
}