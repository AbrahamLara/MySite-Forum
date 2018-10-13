const forumPopulator = new ForumPopulator();

$(document).ready(function() {
    if (forum_has_more) {
        more = forumPopulator.createMoreButton('threads');
        more.attr('index', thread_index);
        more.on('click', fetchThreads);

        $('.container').append(more);
    }
});

const displayThreads = function(context, more_btn) {
    for(i = context.threads.length-1; i >= 0; i--) {
        thread = forumPopulator.createObject(context.threads[i]);
        $('.accordion').append(thread);
    }

    if(context.more) {
        $('.cards').addClass('btm-border');
        if (more_btn == null)
            more_btn = forumPopulator.createMoreButton('threads', context.post_id);

        more_btn.attr('index', context.index - context.amount_displaying);
        more_btn.on('click', fetchThreads);
        $('.container').append(more_btn);
    }
}

const fetchThreads = function() {
    index = $(this).attr('index');
    more = $(this);

    $(this).remove();
    
    $.ajax({
        url: `/fetch_threads/`,
        data: data = {'index': index},
        contentType: 'application/json',
        success: function(threads) {
            displayThreads(threads, more);
        },
        error: handleError
    });
}

const handleError = function(error) {
    console.log(error);
}