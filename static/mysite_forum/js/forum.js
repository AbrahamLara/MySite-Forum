const forumPopulator = new ForumPopulator();

$(document).ready(function() {
    if (thread_index < 0)
        thread_index *= -1;

    if (forum_has_more) {
        more = forumPopulator.createMoreButton('threads');
        more.attr('index', thread_index);
        more.on('click', fetchThreads);

        $('.container').append(more);
    }
});

const displayThreads = function(context, more_btn) {
    for(i = context.threads.length-1; i >= 0; i--) {
        thread = createThreadObject(context.threads[i]);
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

const createThreadObject = function(thread_data) {
    const card = $('<div>', {'class': 'card'});
    const card_header = $('<div>', {'class': 'card-header', 'id': thread_data.pk});
    const h5 = $('<h5>', {'class': 'mb-0'});
    const button = $('<button>', buttonAttributes(thread_data));
    const link = $('<a>', linkAttributes(thread_data));
    const collapse = $('<div>', collapseAttributes(thread_data));
    const card_body = $('<div>', {'class': 'card-body'});
    var body = thread_data.body;

    button.text(thread_data.title);

    if(body.length > 1270) 
        body = body.substring(0, 1271)+'...';
    
    card_body.text(body);

    collapse.append(card_body);
    h5.append(button, link);
    card_header.append(h5);
    card.append(card_header, collapse);

    return card;
}

const buttonAttributes = function(thread_data) {
    return {
        'class': 'btn btn-link text-info title', 
        'type': 'button',
        'data-toggle': 'collapse', 
        'data-target': `#${thread_data.author}${thread_data.pk}`,
        'aria-expanded': 'true', 
        'aria-controls': `#${thread_data.author}${thread_data.pk}`
    };
}

const linkAttributes = function(thread_data) {
    return {
        'class': 'btn btn-outline-info link',
        'href': `/thread/${thread_data.pk}`,
        'text': 'View'
    };
}

const collapseAttributes = function(thread_data) {
    return {
        'class': 'collapse',
        'id': `${thread_data.author}${thread_data.pk}`,
        'aria-labelledby': thread_data.pk,
        'data-parent': '#threads'
    };
}