const forumPopulator = new ForumPopulator(ForumSettings.THREAD_PAGE());

$(document).ready(function() {
    displayPosts(json_context);

    $('#post-btn').on('click', submitForm);
    $('#reply-btn').on('click', submitForm);
});

const displayPosts = function(context) {
    for (i = context.posts.length-1; i >= 0; --i) {
        forumPopulator.addObjectToContainer(context.posts[i], $('.posts-container'));
    }

    if (context.more) {
        more = forumPopulator.createMoreButton('posts', context.thread_id);
        
        more.attr('index', context.index - context.offset);
        more.on('click', fetchPosts);
        
        $('.posts-container').append(more);
    }
}

const fetchPosts = function() {
    thread_id = $(this).attr('value');
    index = $(this).attr('index');

    if (index == 0) 
        return;

    is_more_btn = $(this).hasClass(`more-btn-for-posts`);
    flag = is_more_btn ? true : $(this).attr('display') == 'true';

    var more;

    if(is_more_btn) {
        more = $(this);
        $(this).remove();
    } else $(this).attr('display', false);

    $.ajax({
        url: `${thread_id}/fetch_posts/${index}`,
        contentType: 'application/json',
        success: function(data) {
            displayPosts(data);
        }
    });
}

const fetchReplies = function() {
    post_id = $(this).attr('value');
    index = $(this).attr('index');

    if (index == 0) 
        return;

    is_more_btn = $(this).hasClass(`more-btn-for-replies-${post_id}`);
    flag = is_more_btn ? true : $(this).attr('display') == 'true';

    if (flag) {
        var more;

        if(is_more_btn) {
            more = $(this);
            $(this).remove();
        } else $(this).attr('display', false);

        $.ajax({
            url: `post/${post_id}/fetch_replies/${index}`,
            contentType: 'application/json',
            success: function(data) {
                for(i = data.replies.length-1; i >= 0; --i) {
                    forumPopulator.addObjectToContainer(data.replies[i], $(`#reply-container-${post_id}`));
                    line_break = $('<hr>', {'class': 'my-4 bg-dark'});

                    if(data.more || i != 0)
                        $(`#reply-container-${post_id}`).append(line_break);
                    
                }

                if (data.more) {
                    if (more == null) {
                        more = forumPopulator.createMoreButton('replies', post_id);
                    }
                    more.attr('index', data.index - data.offset);
                    more.on('click', fetchReplies);
                    $(`#reply-container-${post_id}`).append(more);
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