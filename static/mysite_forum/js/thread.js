$(document).ready(function() {
    displayPosts(json_context);

    $('#action-modal').on('hidden.bs.modal', removeTextFromBody);
    $('#post-btn').on('click', displayModal);
    $('#submit-btn').on('click', submitText);
});

const removeTextFromBody = function() {
    $('.modal-body').val('');
}

const displayModal = function() {
    if ($(this).is('#post-btn'))
        prepareModal('post', 'Post');
    else
        prepareModal('reply', 'Reply');
    
    $('#submit-btn').attr({'value': $(this).attr('value'), 'type': $(this).attr('type')});
    $('#action-modal').modal('show');
}

const prepareModal = function(body_type, object_type) {
    $('.modal-title').text(`Type your ${body_type} below!`);
    $('.modal-body').attr('placeholder', `${object_type} here...`);
}

const submitText = function() {
    value = $(this).attr('value');
    type = $(this).attr('type');
    text = $('#modal-textarea').val();
    
    $.ajax({
        type: 'POST',
        url: `/create_${type}/`,
        data: {id: value, text: text},
        success: function(data) {
            if ('post' in data) {
                object = createPostObject(data);
                $(`#${type}-container`).prepend(object);
                updatePostCounter(data.n_posts);
            } else if('reply' in data) {
                object = createReplyObject(data);
                $(`#${type}-container-${value}`).prepend(object);
                updateRepliesCounter(data.n_replies, value);
            }
            $('#action-modal').modal('hide');
        },
        error: function(response) {
            console.log(response.responseJSON.error);
        }
    });
}

const updatePostCounter = function(n_posts) {
    $('.post-count').text(`${n_posts} Post(s)`);
}

const updateRepliesCounter = function(n_replies, id) {
    $(`#replies-for-${id}`).attr({'index': n_replies+1, 'display': 'false'}).text(`Replies(${n_replies})`);
}

const displayPosts = function({ posts, has_next_page, cursor}, more_btn) {
    for (i in posts) {
        post = createPostObject(posts[i]);
        $('#post-container').append(post);
    }

    if (has_next_page) {
        if (more_btn == null)
            more_btn = createMoreButton('posts', thread_id);
        
        more_btn.attr('cursor', cursor).on('click', fetchObjects);
        $('#post-container').append(more_btn);
    }
}

const displayReplies = function({ replies, cursor, has_next_page, post_id }, more_btn) {
    for(i in replies) {
        reply = createReplyObject(replies[i]);
        $(`#reply-container-${post_id}`).append(reply);
    }

    if (has_next_page) {
        if (more_btn == null)
            more_btn = createMoreButton('replies', post_id);
        
        more_btn.attr('cursor', cursor).on('click', fetchObjects);
        $(`#reply-container-${post_id}`).append(more_btn);
    }
}

const shouldNotDisplay = function() {
    flag = object.attr('display') == 'true';
    object.attr('display', !flag);

    return !flag;
}

const fetchObjects = function() {
    object = $(this);
    cursor = object.attr('cursor');
    id = object.attr('value');
    type = object.attr('object-type');

    if (cursor === '')
        return;
    else if (object.is('.more-btn'))
        object.remove();
    else if (shouldNotDisplay()) {
        $(`#reply-container-${id}`).empty();
        return;
    } else
        object = null;

    fetchObjectsAjax(`/fetch_${type}/`, {id,  cursor}, object);
}

const fetchObjectsAjax = function(url, data, more) {
    $.ajax({
        url: url,
        data: data,
        contentType: 'application/json',
        success: function(res) {
            if ('replies' in res) {
                res['post_id'] = data.id
                displayReplies(res, more);
            } else if ('posts' in res)
                displayPosts(res, more);
            else
                console.log(res);
        },
        error: function(response) {
            console.log(response.responseJSON.error);
        }
    });
}

const createPostObject = function({ pk, author_id, author, n_replies, post, }) {
    const post_object = $('<div>', {'class': 'post-object', 'id': `post-cell-${pk}`});
    const text = $('<div>', {'class': 'post'});
    const reply = $('<span>', {'class': 'text-secondary link', 'value': pk, 'type': 'reply'});
    const replies = $('<span>', repliesAttributes(pk));
    const author_name = $('<div>', {'class': 'post-actions d-flex align-items-center'});
    const author_link = $('<a>', {
        'class': 'text-secondary author-link',
        'href': `/profile/${author_id}`,
        'text': author
    });
    const replies_container = $('<div>', {
        'class': 'container-fluid',
        'id': `reply-container-${pk}`,
        'css': {'whitespace': 'pre-line'}
    });

    replies.attr('index', n_replies);

    text.text(post);
    reply.text('Reply');
    replies.text(`Replies(${n_replies})`);

    replies.on('click', fetchObjects);
    reply.on('click', displayModal);

    author_name.append(replies, ' - ', reply, ' - ', author_link);
    post_object.append(text, author_name, replies_container);

    return post_object;
}

const repliesAttributes = function(pk) {
    return {
        'class': 'text-secondary link',
        'value': pk,
        'id': `replies-for-${pk}`,
        'display': true,
        'object-type': 'replies'
    };
}

const createReplyObject = function({ reply, author_id, author }) {
    const reply_object = $('<div>', {'class': 'reply-object'});
    const text = $('<div>', {'class': 'reply', 'text': reply});
    const author_link = $('<a>', {
        'class': 'text-secondary link author-link',
        'href': `/profile/${author_id}`,
        'text': `${author}`
    });
    const author_name = $('<div>', {'class': 'author reply-author'});

    author_name.append('- ', author_link);
    reply_object.append(text, author_name);

    return reply_object;
}

const createMoreButton = function(context, data) {
    if (context === 'replies')
        return createMoreButtonForReplies(data);
    else if (context === 'posts')
        return createMoreButtonForPosts(data);
}

const createMoreButtonForReplies = function(id) {
    return createMore(`replies-${id}`, id, 'more replies...').attr('object-type', 'replies');
}

const createMoreButtonForPosts = function(id) {
    return createMore('posts', id, 'more posts...').attr('object-type', 'posts');
}

const createMore = function(type, value, text) {
    const more = $('<div>', {'class': `more-btn more-btn-for-${type}`, 'value': value});
    more.text(text);
    return more;
}