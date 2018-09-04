$(document).ready(function() {

    displayPosts(posts);

    $('#post-btn').on('click', submitForm);
    $('#reply-btn').on('click', submitForm);
});

const displayPosts = function(posts) {

    for (i = posts.length-1; i >= 0; --i) {
        
        post_cell = $('<div>', {'class': 'border border-info border-right-0 border-left-0 border-bottom-0 post-cell', 'id': `post-cell-${posts[i].pk}`});
        post = $('<div>', {'class': 'post', 'text': posts[i].post});
        reply = $('<a>', {'class': 'btn btn-link text-info', 'value': `${posts[i].pk}`, 'text': 'Reply', 'data-toggle': 'modal', 'data-target': '#ReplyCenterBox'});
        replies = $('<a>', {'class': 'btn btn-link text-info', 'value': `${posts[i].pk}`, 'id': `repliesFor${posts[i].pk}`, 'text': 'Replies'});
        author = $('<div>', {'class': 'author post-author'});

        replies.on('click', fetchReplies);
        reply.on('click', displayReplyBox);

        author.append(`- ${posts[i].author}`);
        post_cell.append(post,author, reply, ' - ', replies, `(${posts[i].n_replies})`);

        $('.posts-container').append(post_cell);
    }
}

const fetchReplies = function() {
    post_id = $(this).attr('value');

    $.ajax({
        url: `post/${post_id}/fetch_replies`,
        contentType: 'application/json',
        success: function(data) {
            console.log(data);
        },
        error: function(error) {

        }
    });
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