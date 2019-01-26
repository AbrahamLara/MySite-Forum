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
    const td_for_radio = customCheckbox(pk, 'thread');
    const td_for_link = $('<td>');
    const thread_link = `<a class="thread-link text-dark" href="/thread/${pk}"><div class="thread-text">${title}</div></a>`;
    const td_for_date = $('<td>', {'text': date_created});
    const td_for_posts = $('<td>', {'text': n_posts});

    const td_mobile = $('<td>', {'class': 'mobile-td'});
    const td_thread_label = $('<span>', {'class': 'label', 'text': 'Title'});
    const td_mobile_posts = `<div class="counter"><span class="label">Posts:</span> ${n_posts}</div>`;
    const td_mobile_date = `Created on <span>${date_created}</span>`;

    td_mobile.append(td_thread_label, thread_link, td_mobile_posts, td_mobile_date);
    
    td_for_link.append(thread_link);
    thread_block.append(td_for_radio, td_mobile ,td_for_link, td_for_date, td_for_posts);

    return thread_block;
};

const postObj = ({ pk, thread_id, date_created, n_replies, post, }) => {
    const post_block = $('<tr>', {'id': `post-block-${pk}`});
    const td_for_radio = customCheckbox(pk, 'post');
    const td_for_link = $('<td>');
    const post_link = `<a class="post-link text-dark" href="/thread/${thread_id}"><div class="post-text">${post}</div></a>`;
    const td_for_date = $('<td>', {'text': date_created});
    const td_for_replies = $('<td>', {'text': n_replies});

    const td_mobile = $('<td>', {'class': 'mobile-td'});
    const td_post_label = $('<span>', {'class': 'label', 'text': 'Post'});
    const td_mobile_replies = `<div class="counter"><span class="label">Replies:</span> ${n_replies}</div>`;
    const td_mobile_date = `Posted on <span>${date_created}</span>`;

    td_mobile.append(td_post_label, post_link, td_mobile_replies, td_mobile_date);

    td_for_link.append(post_link);
    post_block.append(td_for_radio, td_mobile, td_for_link, td_for_date, td_for_replies);

    return post_block;
};

const replyObj = ({ pk, thread_id, reply, date_created, post, }) => {
    const reply_block = $('<tr>', {'id': `reply-block-${pk}`});
    const td_for_radio = customCheckbox(pk, 'reply');
    const reply_link = `<a class="reply-link text-dark" href="/thread/${thread_id}"><div class="reply-text">${reply}</div></a>`;
    const td_for_link = $('<td>');
    const td_for_date = $('<td>', {'text': date_created});
    const td_for_post = $('<td>');
    const post_text = `<div class="post-text">${post}</div>`

    const td_mobile = $('<td>', {'class': 'mobile-td'});
    const td_reply_label = $('<span>', {'class': 'label', 'text': 'Reply'});
    const td_post_label = $('<span>', {'class': 'label', 'text': 'To Post'});
    const td_mobile_date = `Replied on <span>${date_created}</span>`;

    td_mobile.append(td_reply_label, reply_link, td_post_label, post_text, td_mobile_date);
    
    td_for_link.append(reply_link);
    td_for_post.append(post_text);
    reply_block.append(td_for_radio, td_mobile, td_for_link, td_for_post, td_for_date);

    return reply_block;
};

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