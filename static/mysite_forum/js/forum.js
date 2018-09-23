$(document).ready(function() {
    fetchThreads();
});

const fetchThreads = function() {
    $.ajax({
        url: 'threads/fetch_threads',
        contentType: 'application/json',
        success: displayThreads,
        error: handleError
    });
}

const handleError = function(error) {
    console.log(error);
}

const displayThreads = function(threads) {

    threads  = JSON.parse(threads);

    for(i = threads.length-1; i >= 0; i--) {
        
        /**
         * Creates the card for each element to display the title and
         * body for each thread while also creating a button to send the
         * user to the thread page.
         */
        card = $('<div>', {'class': 'card'});
        card_header = $('<div>', {'class': 'card-header', 'id': `${threads[i].pk}`});
        h5 = $('<h5>', {'class': 'mb-0'});
        button = $('<button>', buttonAttrs(threads[i]));
        link = $('<a>', linkAttrs(threads[i]));
        collapse = $('<div>', collapseAttrs(threads[i]));
        card_body = $('<div>', {'class': 'card-body'});

        button.text(`${threads[i].fields.title}`);

        body = threads[i].fields.body;

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
        h5.append(button,link);
        card_header.append(h5);
        card.append(card_header, collapse)

        $('.accordion').append(card);
    }

    if(threads.length == 1) $('.cards').addClass('btm-border');
}

/**
 * @param {*} thread
 * These constants define how the elements within a
 * card should look and behave. Each card has it's
 * own data associated with it that allows for the
 * behaviour of displaying it's own body upon
 * clicking its title and its own button that takes
 * the user to its thread page.
 */
/**
 * [BUG]
 * Since the thread data has author as its model object id
 * instead of the authors actual name. It the same author
 * creates multiple threads, the threasd with the same data-target
 * and aria-control will be trigger resulting in multiple threads
 * having the body displayed.
 */
const buttonAttrs = function(thread) {
    return {
        'class': 'btn btn-link text-info title', 
        'type': 'button',
        'data-toggle': 'collapse', 
        'data-target': `#a${thread.fields.author}`,
        'aria-expanded': 'true', 
        'aria-controls': `#a${thread.fields.author}`
    }
}

const linkAttrs = function(thread) {
    return {
        'class': 'btn btn-outline-info link',
        'href': `/forum/thread/${thread.pk}`,
        'text': 'View'
    }
}

const collapseAttrs = function(thread) {
    return {
        'class': 'collapse',
        'id': `a${thread.fields.author}`,
        'aria-labelledby': `${thread.pk}`,
        'data-parent': '#threads'
    }
}