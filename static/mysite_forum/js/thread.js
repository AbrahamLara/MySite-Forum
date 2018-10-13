const forumPopulator = new ForumPopulator();

$(document).ready(function() {
    displayPosts(json_context);

    $('#post-btn').on('click', submitForm);
    $('#reply-btn').on('click', submitForm);
});

const displayPosts = function(context, more_btn) {
    for (i = context.posts.length-1; i >= 0; --i) {
        post = forumPopulator.createObject(context.posts[i]);
        $('.posts-container').append(post);
    }

    if (context.more) {
        if (more_btn == null)
            more_btn = forumPopulator.createMoreButton('posts', context.thread_id);
        
        more_btn.attr('index', context.index - context.offset);
        more_btn.on('click', fetchObjects);
        $('.posts-container').append(more_btn);
    }
}

const displayReplies = function(context, more_btn) {
    for(i = context.replies.length-1; i >= 0; --i) {
        reply = forumPopulator.createObject(context.replies[i]);
        $(`#reply-container-${context.post_id}`).append(reply);

        line_break = $('<hr>', {'class': 'my-4 bg-dark'});
        if(context.more || i != 0)
            $(`#reply-container-${context.post_id}`).append(line_break);   
    }

    if (context.more) {
        if (more_btn == null)
            more_btn = forumPopulator.createMoreButton('replies', context.post_id);
        
        more_btn.attr('index', context.index - context.offset).on('click', fetchObjects);
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
        }
    });
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