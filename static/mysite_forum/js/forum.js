const forumPopulator = new ForumPopulator('FORUM_PAGE');

$(document).ready(function() {
    // fetchThreads();
    if (forum_has_more) {
        more = forumPopulator.createMoreButton('threads', thread_index);
        more.on('click', fetchThreads);

        $('.container').append(more);
    }
});

const fetchThreads = function() {
    index = $(this).attr('value');
    more = $(this);

    $(this).remove();
    
    $.ajax({
        url: `/fetch_threads/${index}/`,
        contentType: 'application/json',
        success: function(threads) {
            for(i = threads.threads.length-1; i >= 0; i--) {
                /**
                 * Creates the card for each element to display the title and
                 * body for each thread while also creating a button to send the
                 * user to the thread page.
                 */
                card = $('<div>', {'class': 'card'});
                card_header = $('<div>', {'class': 'card-header', 'id': `${threads.threads[i].pk}`});
                h5 = $('<h5>', {'class': 'mb-0'});
                button = $('<button>', buttonAttrs(threads.threads[i]));
                link = $('<a>', linkAttrs(threads.threads[i]));
                collapse = $('<div>', collapseAttrs(threads.threads[i]));
                card_body = $('<div>', {'class': 'card-body'});
        
                button.text(`${threads.threads[i].title}`);
        
                body = threads.threads[i].body;
        
                /**
                 * If the body of the thread is too big to display, then this 'if'
                 * statement will reduce the amount of characters from the body and
                 * append '...' in front of the reduced body to imply that there is
                 * more text than what is displayed.
                 */
                if(body.length > 1270) 
                    body = body.substring(0,1271)+'...';
        
                card_body.text(`${body}`);
        
                collapse.append(card_body);
                h5.append(button, link);
                card_header.append(h5);
                card.append(card_header, collapse)
        
                $('.accordion').append(card);
            }
        
            if(threads.more) {
                $('.cards').addClass('btm-border');
                more.attr('value', threads.index - threads.offset);
                more.on('click', fetchThreads);
                $('.container').append(more);
            }
        },
        error: handleError
    });
}

const handleError = function(error) {
    console.log(error);
}


/**
 * [BUG]
 * Since the thread data has author as its model object id
 * instead of the authors actual name. If a user creates multiple threads
 * their thread cards will have the same data-target and aria-control
 * attributes resulting in multiple threads having their cards expanded.
 */
/**
 * @param {*} thread
 * These constants define how the elements within a
 * card should look and behave. Each card has it's
 * own data associated with it that allows for the
 * behaviour of displaying it's own body upon
 * clicking its title and its own button that takes
 * the user to its thread page.
 */
const buttonAttrs = function(thread_data) {
    return {
        'class': 'btn btn-link text-info title', 
        'type': 'button',
        'data-toggle': 'collapse', 
        'data-target': `#${thread_data.author}${thread_data.pk}`,
        'aria-expanded': 'true', 
        'aria-controls': `#${thread_data.author}${thread_data.pk}`
    }
}

const linkAttrs = function(thread_data) {
    return {
        'class': 'btn btn-outline-info link',
        'href': `/forum/thread/${thread_data.pk}`,
        'text': 'View'
    }
}

const collapseAttrs = function(thread_data) {
    return {
        'class': 'collapse',
        'id': `${thread_data.author}${thread_data.pk}`,
        'aria-labelledby': `${thread_data.pk}`,
        'data-parent': '#threads'
    }
}