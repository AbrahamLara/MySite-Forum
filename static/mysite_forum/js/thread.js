$(document).ready(function() {

    displayPosts(posts);

    $('#post-btn').on('click', submitForm);
    $('#reply-btn').on('click', submitForm);
});

const displayPosts = function(posts) {

    for (i = posts.length-1; i >= 0; --i) {
        
        pk = posts[i].pk;

        post_cell = $('<div>', {'class': 'border border-info border-right-0 border-left-0 border-bottom-0 post-cell', 'id': `post-cell-${pk}`});
        post = $('<div>', {'class': 'post', 'text': posts[i].post});
        reply = $('<a>', {'class': 'btn btn-link text-info', 'value': `${pk}`, 'text': 'Reply', 'data-toggle': 'modal', 'data-target': '#ReplyCenterBox'});
        replies = $('<a>', {'class': 'btn btn-link text-info', 'value': `${pk}`, 'display': true, 'id': `repliesFor${pk}`, 'text': `Replies(${posts[i].n_replies})`});
        author = $('<div>', {'class': 'author post-author', 'text': `- ${posts[i].author}`});
        post_actions = $('<div>', {'class': 'container-fluid no-padding'});
        replies_container = $('<div>', {'class': 'container-fluid', 'id': `reply-container-${pk}`, 'css': {'whitespace': 'pre-line'}});

        replies.on('click', fetchReplies);
        reply.on('click', displayReplyBox);

        post_actions.append(reply,' - ',replies)

        post_cell.append(post,author,post_actions,replies_container);

        $('.posts-container').append(post_cell);
    }
}

const fetchReplies = function() {
    post_id = $(this).attr('value');

    return;

    if (true) {
        $.ajax({
            url: `post/${post_id}/fetch_replies`,
            contentType: 'application/json',
            success: function(data) {
                for (i = data.length-1; i >= 0; --i) {
                    reply = $('<div>', {'class': '', 'text': data[i].reply});
                    author = $('<div>', {'class': '', 'text': `- ${data[i].author}`});
    
                    $(`#reply-container-${post_id}`).append(reply,author);
                }
            },
            error: function(error) {
                
            }
        });
    } else {
        $(`#reply-container-${post_id}`).empty();
    }
}

const displayReplyBox = function(e) {
    post_id = $(this).attr('value');
    thread_id = $('#reply-btn').attr('value');
    $('#reply-form').attr('action',`${thread_id}/post/${post_id}/reply/create`);
}

const submitForm = function() {
    if ($('#PostCenterBox').hasClass('show')) 
        $('#post-form').submit();
    
    if ($('#ReplyCenterBox').hasClass('show')) 
        $('#reply-form').submit();
}