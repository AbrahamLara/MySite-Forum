const forumPopulator = new ForumPopulator(ForumSettings.THREAD_PAGE());

$(document).ready(function() {
    displayPosts(posts);

    $('#post-btn').on('click', submitForm);
    $('#reply-btn').on('click', submitForm);
});

const displayPosts = function(posts) {
    for (i = posts.length-1; i >= 0; --i) {
        forumPopulator.addObjectToContainer(posts[i], $('.posts-container'));
    }
}

const fetchReplies = function() {
    post_id = $(this).attr('value');
    index = $(this).attr('index');

    if (index == 0) 
        return;

    is_more_btn = $(this).hasClass(`more-btn-${post_id}`);
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
                        more = $('<a>', {'class': `more-btn more-btn-${post_id} text-info`, 'value': post_id});
                        more.text('more...');
                    }
                    more.attr('index', index - data.offset);
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