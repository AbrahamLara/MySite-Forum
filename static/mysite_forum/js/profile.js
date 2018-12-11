$(document).ready(function() {
    appendObject(threads_context, threads_context.threads, 'thread');
    appendObject(posts_context, posts_context.posts, 'post');
    appendObject(replies_context, replies_context.replies, 'reply');

    $('#thread-counter').on('click', changeViews);
    $('#post-counter').on('click', changeViews);
    $('#reply-counter').on('click', changeViews);
});

var type;

const plural = {
    thread: 'threads',
    post: 'posts',
    reply: 'replies',
}

const container = {
    thread: $('#threads-table-body'),
    post: $('#posts-table-body'),
    reply: $('#replies-table-body')
}

const changeViews = function() {
    type = $('.view-selected').removeClass('view-selected').attr('object');
    $(`#${plural[type]}-table`).addClass('hide');
    type = $(this).children().addClass('view-selected').attr('object');
    $(`#${plural[type]}-table`).removeClass('hide');
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

        $(`#${plural[this_type]}-table`).append(more);
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
    const thread_block = $('<tr>', {'id': `thread-block-${thread_data.pk}`});
    const td_for_link = $('<td>');
    const thread_link = $('<a>', {'class': 'thread-link text-dark', 'href': `/thread/${thread_data.pk}`});
    const thread_text = $('<div>', {'class': 'thread-text', 'text': thread_data.title});
    const td_for_date = $('<td>', {'text': thread_data.date_created});
    const td_for_posts = $('<td>', {'text': thread_data.n_posts});
    
    thread_link.append(thread_text);
    td_for_link.append(thread_link);
    thread_block.append(td_for_link, td_for_date, td_for_posts);

    return thread_block;
};

const getPostBlock = function(post_data) {
    const post_block = $('<tr>', {'id': `post-block-${post_data.pk}`});
    const td_for_link = $('<td>');
    const post_link = $('<a>', {'class': 'post-link text-dark', 'href': `/thread/${post_data.thread_id}`});
    const td_for_date = $('<td>', {'text': post_data.date_posted});
    const td_for_replies = $('<td>', {'text': post_data.n_replies});

    if (post_data.post.length > 51)
        post_data.post = post_data.post.substring(0, 51)+'...';


    post_link.text(post_data.post);
    td_for_link.append(post_link);
    post_block.append(td_for_link, td_for_date, td_for_replies);

    return post_block;
};

const getReplyBlock = function(reply_data) {
    const reply_block = $('<tr>', {'id': `reply-block-${reply_data.pk}`});
    const reply_link = $('<a>', {'class': 'reply-link text-dark', 'href': `/thread/${reply_data.thread_id}`});
    const td_for_link = $('<td>');
    const td_for_date = $('<td>', {'text': reply_data.date_replied});
    const td_for_post = $('<td>');

    if (reply_data.reply.length > 51)
        reply_data.reply = reply_data.reply.substring(0, 51)+'...';
    if (reply_data.post.length > 51)
        reply_data.post = reply_data.post.substring(0, 51)+'...';

    reply_link.text(reply_data.reply);
    td_for_link.append(reply_link);
    td_for_post.text(reply_data.post);
    reply_block.append(td_for_link, td_for_post, td_for_date);

    return reply_block;
};

const createMoreObject = function() {
    const button = $('<div>', {
        'class': 'more-btn more-btn-for-threads text-info',
        'text': 'Load More Threads...'
    });

    return button;
}