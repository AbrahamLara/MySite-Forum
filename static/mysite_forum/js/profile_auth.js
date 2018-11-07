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

    $('#delete-thread').on('click', showModal);
    $('#delete-post').on('click', showModal);
    $('#delete-reply').on('click', showModal);
    
    $('#submit-btn').on('click', deleteSelection);

    $('#confirm-modal').on('hidden.bs.modal', setTypeUndefined);
});

const container = {
    thread: $('#threads-container'),
    post: $('#posts-container'),
    reply: $('#replies-container')
}

var type;

const setTypeUndefined = function() {
    $('.modal-header').text('');
};

const showModal = function() {
    type = $(this).attr('object');
    $('.modal-header').text('Are you sure you want to delete the selected ');
    $('#confirm-modal').modal('show');
};

const deleteSelection = function() {
    $.ajax({
        type: 'post',
        url: `/delete_${type}_selection/`,
        data: {selection: container[type].children('.selected').map(selectedType).get()},
        success: function(data) {
            $('#confirm-modal').modal('hide');
            console.log(data);
            for (i = 0; i < data.length; i++) {
                $(`#${type}-block-${data[i]}`).remove();
            }
            type = undefined;
        },
        error: function(error) {
            console.log(error);
        }
    });
};

const selectedType = function() {
    return $(this).find('input')[0].value;
};

const getThreadBlock = function(thread_data) {
    const thread_block = $('<div>', {'class': 'block', 'id': `thread-block-${thread_data.pk}`});
    const radio_container = $('<label>', {'class': 'radio-container'});
    const custom_checkbox = $('<div>', {'id': `custom-checkbox-${thread_data.pk}`});
    const thread_link = $('<a>', {'class': 'thread-link text-info', 'href': `/thread/${thread_data.pk}`});
    const checkbox = $('<input>', {'type': 'checkbox', 'value': thread_data.pk, 'id': `thread${thread_data.pk}`});
    const checkmark = $('<span>', {'class': 'checkmark'});

    checkbox.attr('object', 'thread');

    thread_link.text(thread_data.title);

    checkbox.on('click', selectBlock);

    custom_checkbox.append(checkbox, checkmark);
    radio_container.append(thread_link, custom_checkbox);
    thread_block.append(radio_container);

    return thread_block;
};

const getPostBlock = function(post_data) {
    const post_block = $('<div>', {'class': 'block', 'id': `post-block-${post_data.pk}`});
    const radio_container = $('<label>', {'class': 'radio-container'});
    const custom_checkbox = $('<div>', {'id': `custom-checkbox-${post_data.pk}`});
    const post_link = $('<a>', {'class': 'post-link text-info', 'href': `/thread/${post_data.thread_id}`});
    const checkbox = $('<input>', {'type': 'checkbox', 'value': post_data.pk, 'id': `thread${post_data.pk}`});
    const checkmark = $('<span>', {'class': 'checkmark'});

    checkbox.attr('object', 'post');

    post_link.text(post_data.post);

    checkbox.on('click', selectBlock);

    custom_checkbox.append(checkbox, checkmark);
    radio_container.append(post_link, custom_checkbox);
    post_block.append(radio_container);

    return post_block;
};

const getReplyBlock = function(reply_data) {
    const reply_block = $('<div>', {'class': 'block', 'id': `reply-block-${reply_data.pk}`});
    const radio_container = $('<label>', {'class': 'radio-container'});
    const custom_checkbox = $('<div>', {'id': `custom-checkbox-${reply_data.pk}`});
    const reply_link = $('<a>', {'class': 'reply-link text-info', 'href': `/thread/${reply_data.thread_id}`});
    const checkbox = $('<input>', {'type': 'checkbox', 'value': reply_data.pk, 'id': `thread${reply_data.pk}`});
    const checkmark = $('<span>', {'class': 'checkmark'});

    checkbox.attr('object', 'reply');

    reply_link.text(reply_data.reply);

    checkbox.on('click', selectBlock);

    custom_checkbox.append(checkbox, checkmark);
    radio_container.append(reply_link, custom_checkbox);
    reply_block.append(radio_container);

    return reply_block;
};

const selectBlock = function(e) {
    type = $(this).attr('object');
    if ($(this).prop('checked'))
        $(`#${type}-block-${e.target.value}`).addClass('selected');
    else
        $(`#${type}-block-${e.target.value}`).removeClass('selected');
};