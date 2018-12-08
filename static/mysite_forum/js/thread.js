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

const displayPosts = function(context, more_btn) {
    for (i = context.posts.length-1; i >= 0; --i) {
        post = createPostObject(context.posts[i]);
        $('#post-container').append(post);
    }

    if (context.more) {
        if (more_btn == null)
            more_btn = createMoreButton('posts', context.thread_id);
        
        more_btn.attr('index', context.index - context.amount_displaying).on('click', fetchObjects);
        $('#post-container').append(more_btn);
    }
}

const displayReplies = function(context, more_btn) {
    for(i = context.replies.length-1; i >= 0; --i) {
        reply = createReplyObject(context.replies[i]);
        $(`#reply-container-${context.post_id}`).append(reply);
    }

    if (context.more) {
        if (more_btn == null)
            more_btn = forumPopulator.createMoreButton('replies', context.post_id);
        
        more_btn.attr('index', context.index - context.amount_displaying).on('click', fetchObjects);
        $(`#reply-container-${context.post_id}`).append(more_btn);
    }
}

const shouldNotDisplay = function() {
    flag = object.attr('display') == 'true';
    object.attr('display', !flag);

    return !flag;
}

const fetchObjects = function() {
    object = $(this);
    index = object.attr('index');
    id = object.attr('value');
    type = object.attr('object-type');
    
    if (index == 0) 
        return;
    else if (object.is('.more-btn'))
        object.remove();
    else if (shouldNotDisplay()) {
        $(`#reply-container-${id}`).empty();
        return;
    } else
        object = null;

    fetchObjectsAjax(`/fetch_${type}/`, {index: index, id: id}, object);
}

const fetchObjectsAjax = function(url, data, more) {
    $.ajax({
        url: url,
        data: data,
        contentType: 'application/json',
        success: function(data) {
            if ('replies' in data)
                displayReplies(data, more);
            else if ('posts' in data) 
                displayPosts(data, more);
            else
                console.log(data);
        },
        error: function(response) {
            console.log(response.responseJSON.error);
        }
    });
}

const createPostObject = function(post_data) {
    const pk = post_data.pk;
    
    const post_object = $('<div>', {'class': 'post-object', 'id': `post-cell-${pk}`});
    const post = $('<div>', {'class': 'post'});
    const reply = $('<span>', {'class': 'text-secondary link', 'value': pk, 'type': 'reply'});
    const replies = $('<span>', repliesAttributes(pk));
    const author = $('<div>', {'class': 'post-actions d-flex align-items-center'});
    const author_link = $('<span>', {'class': 'text-secondary author-link', 'href': `/profile/${post_data.author_id}`, 'text': post_data.author});
    const replies_container = $('<div>', {'class': 'container-fluid', 'id': `reply-container-${pk}`, 'css': {'whitespace': 'pre-line'}});

    replies.attr('index', post_data.n_replies);

    post.text(post_data.post);
    reply.text('Reply');
    replies.text(`Replies(${post_data.n_replies})`);

    replies.on('click', fetchObjects);
    reply.on('click', displayModal);

    author.append(replies, ' - ', reply, ' - ', author_link);
    post_object.append(post, author, replies_container);

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

const createReplyObject = function(reply_data) {
    const reply_object = $('<div>', {'class': 'reply-object'});
    const reply = $('<div>', {'class': 'reply', 'text': reply_data.reply});
    const author_link = $('<span>', {'class': 'text-secondary link author-link', 'href': `/profile/${reply_data.author_id}`, 'text': `${reply_data.author}`});
    const author = $('<div>', {'class': 'author reply-author'});

    author.append('- ', author_link);
    reply_object.append(reply, author);

    return reply_object;
}

const _createMoreButtonForReplies = function(id) {
    return this.createMore(`replies-${id}`, id, 'more replies...').attr('object-type', 'replies');
}

const _createMoreButtonForPosts = function(id) {
    return this.createMore('posts', id, 'more posts...').attr('object-type', 'posts');
}

const createMoreButton = function(context, data) {
    if (context === 'replies')
        return ForumPopulator._createMoreButtonForReplies(data);
    else if (context === 'posts')
        return ForumPopulator._createMoreButtonForPosts(data);
}

const createMore = function(type, value, text) {
    const more = $('<a>', {'class': `more-btn more-btn-for-${type} text-info`, 'value': value});

    more.text(text);

    return more;
}