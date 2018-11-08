$(document).ready(function() {
    for (var i = threads_context.threads.length-1; i >= 0; i--) {
        $('#threads-container').append(getThreadBlock(threads_context.threads[i]));
    }

    for (var i = posts_context.posts.length-1; i >= 0; i--) {
        $('#posts-container').append(getPostBlock(posts_context.posts[i]));
    }

    for (var i = replies_context.replies.length-1; i >= 0; i--) {
        $('#replies-container').append(getReplyBlock(replies_context.replies[i]));
    }
});

const getThreadBlock = function(thread_data) {
    const thread_block = $('<div>', {'class': 'block', 'id': `thread-block-${thread_data.pk}`});
    const thread_link = $('<a>', {'class': 'thread-link text-info', 'href': `/thread/${thread_data.pk}`});

    thread_link.text(thread_data.title);
    thread_block.append(thread_link);

    return thread_block;
}

const getPostBlock = function(post_data) {
    const post_block = $('<div>', {'class': 'block', 'id': `post-block-${post_data.pk}`});
    const post_link = $('<a>', {'class': 'post-link text-info', 'href': `/thread/${post_data.thread_id}`});

    post_link.text(post_data.post);
    post_block.append(post_link);

    return post_block;
};

const getReplyBlock = function(reply_data) {
    const reply_block = $('<div>', {'class': 'block', 'id': `reply-block-${reply_data.pk}`});
    const reply_link = $('<a>', {'class': 'reply-link text-info', 'href': `/thread/${reply_data.thread_id}`});

    reply_link.text(reply_data.reply);
    reply_block.append(reply_link);

    return reply_block;
};