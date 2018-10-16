const forumPopulator = new ForumPopulator();

$(document).ready(function() {
    displayPosts(json_context);

    $('#post-btn').on('click', displayModal);
    $('#submit-btn').on('click', submitText);
});

const displayModal = function() {
    if ($(this).is('#post-btn'))
        prepareModal('Type your post below!', 'Post here...');
    else
        prepareModal('Type your reply below!', 'Reply here...');
    
    $('#submit-btn').attr({'value': $(this).attr('value'), 'type': $(this).attr('type')});
    $('#action-modal').modal('show');
}

const prepareModal = function(title, placeholder) {
    $('.modal-title').text(title);
    $('.modal-body').attr('placeholder', placeholder);
}

const submitText = function() {
    value = $(this).attr('value');
    type = $(this).attr('type');
    text = $('#modal-textarea').val();
    
    $.ajax({
        type: 'POST',
        url: `/create_${type}/`,
        data: {'id': value, 'text': text},
        success: function(data) {
            $('#action-modal').modal('hide');
        },
        error: function() {

        }
    });
}

const displayPosts = function(context, more_btn) {
    for (i = context.posts.length-1; i >= 0; --i) {
        post = createPostObject(context.posts[i]);
        $('.posts-container').append(post);
    }

    if (context.more) {
        if (more_btn == null)
            more_btn = forumPopulator.createMoreButton('posts', context.thread_id);
        
        more_btn.attr('index', context.index - context.amount_displaying);
        more_btn.on('click', fetchObjects);
        $('.posts-container').append(more_btn);
    }
}

const displayReplies = function(context, more_btn) {
    for(i = context.replies.length-1; i >= 0; --i) {
        reply = createReplyObject(context.replies[i]);
        $(`#reply-container-${context.post_id}`).append(reply);

        line_break = $('<hr>', {'class': 'my-4 bg-dark'});
        if(context.more || i != 0)
            $(`#reply-container-${context.post_id}`).append(line_break);   
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

    fetchObjectsAjax(`/fetch_${type}/`, {'index': index, 'id': id}, object);
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
        }
    });
}

const createPostObject = function(post_data) {
    const pk = post_data.pk;
    
    const post_object = $('<div>', {
        'class': 'border border-info border-right-0 border-left-0 border-bottom-0 post-cell',
        'id': `post-cell-${pk}`
    });
    const post = $('<div>', {'class': 'post'});
    const reply = $('<a>', {'class': 'btn btn-link text-info', 'value': pk, 'type': 'reply'});
    const replies = $('<a>', repliesAttributes(pk));
    const author = $('<div>', {'class': 'author post-author'});
    const author_link = $('<a>', {'class': 'text-info author-link', 'href': `/profile/${post_data.author_id}`, 'text': post_data.author});
    const post_actions = $('<div>', {'class': 'container-fluid no-padding'});
    const replies_container = $('<div>', {'class': 'container-fluid', 'id': `reply-container-${pk}`, 'css': {'whitespace': 'pre-line'}});

    replies.attr('index', post_data.n_replies);

    post.text(post_data.post);
    reply.text('Reply');
    replies.text(`Replies(${post_data.n_replies})`);

    replies.on('click', fetchObjects);
    reply.on('click', displayModal);

    author.append('- ', author_link);
    post_actions.append(reply, ' - ', replies);
    post_object.append(post, author, post_actions, replies_container);

    return post_object;
}

const repliesAttributes = function(pk) {
    return {
        'class': 'btn btn-link text-info',
        'value': pk,
        'id': `repliesFor${pk}`,
        'display': true,
        'object-type': 'replies'
    };
}

const createReplyObject = function(reply_data) {
    const reply_object = $('<div>');
    const reply = $('<div>', {'class': 'reply', 'text': reply_data.reply});
    const author_link = $('<a>', {'class': 'text-info author-link', 'href': `/profile/${reply_data.author_id}`, 'text': `${reply_data.author}`});
    const author = $('<div>', {'class': 'author reply-author'});

    author.append('- ', author_link);
    reply_object.append(reply, author);

    return reply_object;
}

const displayReplyBox = function() {
    post_id = $(this).attr('value');
    thread_id = $('#reply-btn').attr('value');
    $('#reply-form').attr('action',`${thread_id}/post/${post_id}/reply/create`);
}

const submitForm = function() {
    if ($('#PostCenterBox').hasClass('show')) 
        $('#post-form').submit();
    else if ($('#ReplyCenterBox').hasClass('show')) 
        $('#reply-form').submit();
}