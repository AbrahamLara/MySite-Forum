$(document).ready(function() {

    displayPosts(posts);

    $('#post-btn').on('click', submitForm);
    $('#reply-btn').on('click', submitForm);
});

const displayPosts = function(posts) {

    for (i = posts.length-1; i >= 0; --i) {
        
        pk = posts[i].pk;

        post_cell = $('<div>', {'class': 'border border-info border-right-0 border-left-0 border-bottom-0 post-cell', 'id': `post-cell-${pk}`});
        post = $('<div>', {'class': 'post'});
        reply = $('<a>', {'class': 'btn btn-link text-info', 'value': `${pk}`, 'data-toggle': 'modal', 'data-target': '#ReplyCenterBox'});
        replies = $('<a>', {'class': 'btn btn-link text-info', 'value': `${pk}`, 'display': true, 'id': `repliesFor${pk}`});
        author = $('<div>', {'class': 'author post-author'});
        post_actions = $('<div>', {'class': 'container-fluid no-padding'});
        replies_container = $('<div>', {'class': 'container-fluid', 'id': `reply-container-${pk}`, 'css': {'whitespace': 'pre-line'}});

        replies.attr('position', posts[i].n_replies);

        post.text(posts[i].post);
        reply.text('Reply');
        replies.text(`Replies(${posts[i].n_replies})`);
        author.text(`- ${posts[i].author}`);

        replies.on('click', fetchReplies);
        reply.on('click', displayReplyBox);

        post_actions.append(reply,' - ',replies)
        post_cell.append(post,author,post_actions,replies_container);

        $('.posts-container').append(post_cell);
    }
}

const fetchReplies = function() {
    post_id = $(this).attr('value');
    position = $(this).attr('position');

    if (position == 0) 
        return;

    is_more_btn = $(this).hasClass(`more-btn-${post_id}`);

    flag = is_more_btn ? true : $(this).attr('display') == 'true';

    if (flag) {

        var more;

        if(is_more_btn) {
            more = $(this);
            $(this).remove();
        } else 
            $(this).attr('display', false);;

        $.ajax({
            url: `post/${post_id}/fetch_replies/${position}`,
            contentType: 'application/json',
            success: function(data) {
                for(i = data.replies.length-1; i >= 0; --i) {
                    reply = $('<div>', {'class': 'reply', 'text': data.replies[i].reply});
                    author = $('<div>', {'class': 'author reply-author', 'text': `- ${data.replies[i].author}`});
                    line_break = $('<hr>', {'class': 'my-4 bg-dark'});
    
                    $(`#reply-container-${post_id}`).append(reply,author);
    
                    if(i != 0)
                        $(`#reply-container-${post_id}`).append(line_break);
                    
                }

                if (data.more == true) {
                    if (is_more_btn) {
                        more.attr('position', position-5);
                        more.on('click', fetchReplies);
                        $(`#reply-container-${postId}`).append(more);
                    } else {
                        more = $('<a>', {'class': `more-btn more-btn-${post_id} text-info`, 'value': post_id});
                        more.attr('position', position-5);
                        more.text('more...');
                        more.on('click', fetchReplies);
                        $(`#reply-container-${post_id}`).append(more);
                    }
                }
            }
        });
    } else {
        $(this).attr('display', true);
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