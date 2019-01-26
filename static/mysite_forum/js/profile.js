$(document).ready(() => {
    appendThreads(threads_context);
    appendPosts(posts_context);
    appendReplies(replies_context);

    $('#thread-counter').on('click', changeViews);
    $('#post-counter').on('click', changeViews);
    $('#reply-counter').on('click', changeViews);
});

const plural = {
    thread: 'threads',
    post: 'posts',
    reply: 'replies',
};

var type;

const changeViews = function() {
    type = $('.view-selected').removeClass('view-selected').attr('object');
    $(`#${plural[type]}-table`).addClass('hide');
    type = $(this).children().addClass('view-selected').attr('object');
    $(`#${plural[type]}-table`).removeClass('hide');
};

const appendThreads = (context) => {
    context.threads.forEach((thread) => {
        $('#threads-table-body').append(threadObj(thread));
    });

    const { has_next_page, cursor } = context;

    if (has_next_page) {
        more = moreObj('threads');
        more.attr({'cursor': cursor, 'type': 'thread'})
            .on('click', fetchObjects);

        $(`#threads-table`).append(more);
    }
}

const appendPosts = (context) => {
    context.posts.forEach((post) => {
        $('#posts-table-body').append(postObj(post));
    });

    const { has_next_page, cursor } = context;

    if (has_next_page) {
        more = moreObj('posts');
        more.attr({'cursor': cursor, 'type': 'post'})
            .on('click', fetchObjects);
            
        $(`#posts-table`).append(more);
    }
}

const appendReplies = (context) => {
    context.replies.forEach((reply) => {
        $('#replies-table-body').append(replyObj(reply));
    });

    const { has_next_page, cursor } = context;

    if (has_next_page) {
        more = moreObj('replies');
        more.attr({'cursor': cursor, 'type': 'reply'})
            .on('click', fetchObjects);
            
        $(`#replies-table`).append(more);
    }
}

const fetchObjects = function() {
    $(this).remove();
    cursor = $(this).attr('cursor');
    type = $(this).attr('type');

    $.ajax({
        url: `/fetch_user_${plural[type]}/`,
        data: { id, cursor, },
        contentType: 'application/json',
        success: function(data) {
            if (type === 'thread') 
                appendThreads(data);
            else if (type === 'post') 
                appendPosts(data);
            else if (type === 'reply') 
                appendReplies(data);

        },
        error: function(err) {
            console.log(err);
        }
    });
};

const threadObj = ({ pk, title, date_created, n_posts, }) => {
    const thread_block = $('<tr>', {'id': `thread-block-${pk}`});
    const td = $('<td>');
    const link = $('<a>', {'class': 'thread-link text-dark', 'href': `/thread/${pk}`});
    const thread_txt = $('<div>', {'class': 'thread-text', 'text': title});
    const date = $('<td>', {'text': date_created});
    const posts_n = $('<td>', {'text': n_posts});

    const mobile_thread = mobileThreadObj(pk, title, date_created, n_posts);
    
    link.append(thread_txt);
    td.append(link);
    thread_block.append(mobile_thread ,td, date, posts_n);

    if (typeof customCheckbox !== 'undefined')
        thread_block.prepend(customCheckbox(pk, 'thread'))

    return thread_block;
};

const mobileThreadObj = (pk, title, date_created, n_posts) => {
    const obj = $('<td>', {'class': 'mobile-td'});
    const title_span = $('<span>', {'class': 'label', 'text': 'Title'});
    const link = $('<a>', {'class': 'thread-link text-dark', 'href': `/thread/${pk}`});
    const thread_txt = $('<div>', {'class': 'thread-text', 'text': title, });
    const counter = $('<div>', {'class': 'counter'});
    const posts_n = $('<span>', {'class': 'label', 'text': 'Posts: '});
    const date = $('<span>', {'text': date_created});

    counter.append(posts_n, n_posts);
    link.append(thread_txt);
    obj.append(title_span, link, counter, 'Created on ', date);

    return obj
};

const postObj = ({ pk, thread_id, date_created, n_replies, post, }) => {
    const post_block = $('<tr>', {'id': `post-block-${pk}`});
    const link = $('<td>');
    const post_link = $('<a>', {'class': 'post-link text-dark', 'href': `/thread/${thread_id}`});
    const post_txt = $('<div>', {'class': 'post-text', 'text': post});
    const date = $('<td>', {'text': date_created});
    const replies_txt = $('<td>', {'text': n_replies});

    // const checkbox = customCheckbox(pk, 'post');
    const mobile_post = mobilePostObj(thread_id, date_created, n_replies, post);

    post_link.append(post_txt);
    link.append(post_link);
    post_block.append(mobile_post, link, date, replies_txt);

    if (typeof customCheckbox !== 'undefined')
        post_block.prepend(customCheckbox(pk, 'post'))

    return post_block;
};

const mobilePostObj = (thread_id, date_created, n_replies, post) => {
    const obj = $('<td>', {'class': 'mobile-td'});
    const post_span = $('<span>', {'class': 'label', 'text': 'Post'});
    const counter = $('<div>', {'class': 'counter'});
    const label = $('<div>', {'class': 'label', 'text': 'Replies: '});
    const date = $('<span>', {'text': date_created});
    const link = $('<a>', {'class': 'post-link text-dark', 'href': `/thread/${thread_id}`});
    const post_txt = $('<div>', {'class': 'post-text', 'text': post});

    label.append(n_replies);
    link.append(post_txt);
    counter.append(label, n_replies);
    obj.append(post_span, link, label, 'Posted on ', date);

    return obj;
};

const replyObj = ({ pk, thread_id, reply, date_created, post, }) => {
    const reply_block = $('<tr>', {'id': `reply-block-${pk}`});
    const link = $('<a>', {'class': 'reply-link text-dark', 'href': `/thread/${thread_id}`});
    const reply_txt = $('<div>', {'class': 'reply-text', 'text': reply});
    const link_td = $('<td>');
    const post_td = $('<td>');
    const date = $('<td>', {'text': date_created});
    const post_txt = $('<div>', {'class': 'post-text', 'text': post});

    // const checkbox = customCheckbox(pk, 'reply');
    const mobile_reply = mobileReplyObj(thread_id, reply, date_created, post);
    
    link.append(reply_txt);
    link_td.append(link);
    post_td.append(post_txt);
    reply_block.append(mobile_reply, link_td, post_td, date);

    if (typeof customCheckbox !== 'undefined')
        reply_block.prepend(customCheckbox(pk, 'reply'))

    return reply_block;
};

const mobileReplyObj = (thread_id, reply, date_created, post) => {
    const obj = $('<td>', {'class': 'mobile-td'});
    const reply_label = $('<span>', {'class': 'label', 'text': 'Reply'});
    const post_label = $('<span>', {'class': 'label', 'text': 'To Post'});
    const date = $('<span>',  {'text': date_created});
    const reply_link = $('<a>', {'class':'reply-link text-dark', 'href':`/thread/${thread_id}`});
    const reply_txt = $('<div>', {'class': 'reply-text', 'text':  reply});
    const post_text = $('<div>', {'class': 'post-text', 'text': post});

    reply_link.append(reply_txt);

    obj.append(reply_label, reply_link, post_label, post_text, 'Replied on ', date);

    return obj;
};

const moreObj = (this_type) => {
    const button = $('<div>', {
        'class': `more-btn more-btn-for-${this_type}`,
        'text': `Load more ${this_type}...`
    });

    return button;
};