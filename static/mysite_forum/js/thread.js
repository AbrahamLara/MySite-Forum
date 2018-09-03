$(document).ready(function() {

    displayPosts(posts);

    $('#post-btn').on('click', submitForm);
    $('#reply-btn').on('click', submitForm);
});

const displayPosts = function(posts) {

    for (i = posts.length-1; i >= 0; --i) {
        
        post_cell = $('<div>', {'class': 'border border-info border-right-0 border-left-0 border-bottom-0 post-cell', 'id': `post-cell-${posts[i].pk}`});
        post = $('<div>', {'class': 'post', 'text': posts[i].post});
        reply = $('<button>', {'class': 'btn btn-link text-info', 'value':`${posts[i].pk}`, 'text': 'Reply', 'data-toggle': 'modal', 'data-target': '#ReplyCenterBox'});
        author = $('<div>', {'class': 'author post-author'});

        reply.on('click', displayReplyBox);

        author.append(reply, ` - ${posts[i].author}`);
        post_cell.append(post,author);

        $('.posts-container').append(post_cell);
    }
}

const displayReplyBox = function(e) {
    post_id = e.target.value;
    thread_id = $('#reply-btn').attr('value');
    $('#reply-form').attr('action',`${thread_id}/post/${post_id}/reply/create`);
}

const submitForm = function() {
    if ($('#PostCenterBox').hasClass('show')) 
        $('#post-form').submit();
    
    if ($('#ReplyCenterBox').hasClass('show')) 
        $('#reply-form').submit();
}