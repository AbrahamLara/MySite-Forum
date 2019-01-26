$(document).ready(function() {

    appendObject(threads_context, threads_context.threads, 'thread');
    appendObject(posts_context, posts_context.posts, 'post');
    appendObject(replies_context, replies_context.replies, 'reply');

    $('#thread-counter').on('click', changeViews);
    $('#post-counter').on('click', changeViews);
    $('#reply-counter').on('click', changeViews);

    $('#delete-thread').on('click', showModal);
    $('#delete-post').on('click', showModal);
    $('#delete-reply').on('click', showModal);
    
    $('#submit-btn').on('click', deleteSelection);

    $('#confirm-modal').on('hidden.bs.modal', setTypeUndefined);
});

const container = {
    thread: $('#threads-table-body'),
    post: $('#posts-table-body'),
    reply: $('#replies-table-body')
}

const plural = {
    thread: 'threads',
    post: 'posts',
    reply: 'replies',
}

var type;

const changeViews = function() {
    type = $('.view-selected').removeClass('view-selected').attr('object');
    $(`#${plural[type]}-table`).addClass('hide');
    type = $(this).children().addClass('view-selected').attr('object');
    $(`#${plural[type]}-table`).removeClass('hide');
}

const setTypeUndefined = () => {
    $('.modal-header').text('');
};

const showModal = function() {
    type = $(this).attr('object');
    $('.modal-header').text(`Are you sure you want to delete the selected ${plural[type]}?`);
    $('#confirm-modal').modal('show');
};

const appendObject = ({ has_next_page, cursor }, objects, this_type) => {
    for (i in objects) {
        if (this_type == 'thread')
            object = threadObj(objects[i]);
        else if (this_type == 'post')
            object = postObj(objects[i]);
        else if (this_type == 'reply')
            object = replyObj(objects[i]);

        container[this_type].append(object);
    }

    if (has_next_page) {
        more = moreObj(plural[this_type]);
        more.attr('cursor', cursor)
            .attr('type', this_type)
            .on('click', fetchObjects);

        $(`#${plural[this_type]}-table`).append(more);
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
            if (type == 'thread') 
                objects = data.threads;
            else if (type == 'post') 
                objects = data.posts;
            else if (type == 'reply') 
                objects = data.replies;
                
            appendObject(data, objects, type);

        },
        error: function(err) {
            console.log(err);
        }
    });
}

const deleteSelection = () => {
    $.ajax({
        type: 'post',
        url: `/delete_${type}_selection/`,
        data: {selection: container[type].children('.selected').map(selectedType).get()},
        success: function(data) {
            $('#confirm-modal').modal('hide');
            for (i = 0; i < data.length; i++) {
                $(`#${type}-block-${data[i]}`).remove();
            }

            type = undefined;
        },
        error: function(err) {
            console.log(err);
        }
    });
};

const selectedType = function() {
    return $(this).find('input')[0].value;
};

const threadObj = ({ pk, title, date_created, n_posts, }) => {
    const thread_block = $('<tr>', {'id': `thread-block-${pk}`});
    const checkbox = customCheckbox(pk, 'thread');
    const td = $('<td>');
    const link = $('<a>', {'class': 'thread-link text-dark', 'href': `/thread/${pk}`});
    const thread_txt = $('<div>', {'class': 'thread-text', 'text': title});
    const date = $('<td>', {'text': date_created});
    const posts_n = $('<td>', {'text': n_posts});

    const mobile_thread = mobileThreadObj(pk, title, date_created, n_posts);
    
    link.append(thread_txt);
    td.append(link);
    thread_block.append(checkbox, mobile_thread ,td, date, posts_n);

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
}

const postObj = ({ pk, thread_id, date_created, n_replies, post, }) => {
    const post_block = $('<tr>', {'id': `post-block-${pk}`});
    const checkbox = customCheckbox(pk, 'post');
    const link = $('<td>');
    const post_link = $('<a>', {'class': 'post-link text-dark', 'href': `/thread/${thread_id}`});
    const post_txt = $('<div>', {'class': 'post-text', 'text': post});
    const date = $('<td>', {'text': date_created});
    const replies_txt = $('<td>', {'text': n_replies});

    const mobile_post = mobilePostObj(thread_id, date_created, n_replies, post);

    post_link.append(post_txt);
    link.append(post_link);
    post_block.append(checkbox, mobile_post, link, date, replies_txt);

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
}

const replyObj = ({ pk, thread_id, reply, date_created, post, }) => {
    const obj = $('<tr>', {'id': `reply-block-${pk}`});
    const checkbox = customCheckbox(pk, 'reply');
    const reply_link = $('<a>', {'class': 'reply-link text-dark', 'href': `/thread/${thread_id}`});
    const reply_txt = $('<div>', {'class': 'reply-text', 'text': reply});
    const td_for_link = $('<td>');
    const td_for_post = $('<td>');
    const date = $('<td>', {'text': date_created});
    const post_txt = $('<div>', {'class': 'post-text', 'text': post});

    const td_mobile = mobileReplyObj(thread_id, reply, date_created, post);
    
    reply_link.append(reply_txt);
    td_for_link.append(reply_link);
    td_for_post.append(post_txt);
    obj.append(checkbox, td_mobile, td_for_link, td_for_post, date);

    return obj;
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
}

const customCheckbox = (pk, object_type) => {
    const td = $('<td>');
    const radio_container = $('<label>', {'class': 'radio-container'});
    const custom_checkbox = $('<div>', {'id': `custom-checkbox-${pk}`});
    const checkbox = $('<input>', {'type': 'checkbox', 'value': pk, 'id': `${object_type}-${pk}`});
    const checkmark = $('<span>', {'class': 'checkmark'});

    checkbox.attr('object', object_type);
    checkbox.on('click', selectBlock);
    custom_checkbox.append(checkbox, checkmark);
    radio_container.append(custom_checkbox);
    td.append(radio_container);

    return td;
}

const selectBlock = function(e) {
    type = $(this).attr('object');
    if ($(this).prop('checked'))
        $(`#${type}-block-${e.target.value}`).addClass('selected');
    else
        $(`#${type}-block-${e.target.value}`).removeClass('selected');
};

const moreObj = (this_type) => {
    const button = $('<div>', {
        'class': `more-btn more-btn-for-${this_type}`,
        'text': `Load more ${this_type}...`
    });

    return button;
}