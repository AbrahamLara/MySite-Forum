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
        forumPopulator.addObjectToContainer(context.threads[i], $('.accordion'));
    }

    if(threads.more) {
        $('.cards').addClass('btm-border');
        more.attr('index', threads.index - threads.offset);
        more.on('click', fetchThreads);
        $('.container').append(more);
    }
}

const fetchThreads = function() {
    index = $(this).attr('index');
    more = $(this);

    $(this).remove();
    
    $.ajax({
        url: `/fetch_threads/${index}`,
        contentType: 'application/json',
        success: function(threads) {
            displayThreads(threads);
        },
        error: handleError
    });
}

const handleError = function(error) {
    console.log(error);
}