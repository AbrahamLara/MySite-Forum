$(document).ready(function() {
    fetchThreads();
});

const fetchThreads = function() {
    $.ajax({
        url: 'threads/fetch_threads',
        contentType: 'application/json',
        success: function(threads) {
            displayThreads(JSON.parse(threads));
        },
        error: function(error) {
            console.log(error);
        }
    });
}

const displayThreads = function(threads) {
    for(i = threads.length-1; i >= 0; i--) {
        
        card = $('<div>', {'class': 'card'});
        card_header = $('<div>', {'class': 'card-header', 'id': `${threads[i].pk}`});
        h5 = $('<h5>', {'class': 'mb-0'});
        button = $('<button>', buttonAttrs(threads[i]));
        link = $('<a>', linkAttrs(threads[i]));
        collapse = $('<div>', collapseAttrs(threads[i]));
        card_body = $('<div>', {'class': 'card-body'});

        button.text(`${threads[i].fields.title}`);
        card_body.text(`${threads[i].fields.body}`);

        collapse.append(card_body);
        h5.append(button,link);
        card_header.append(h5);
        card.append(card_header, collapse)

        $('.accordion').append(card);
    }
}

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