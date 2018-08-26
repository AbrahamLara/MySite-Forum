$(document).ready(function() {
    fetchThreads();
});

const fetchThreads = function() {
    $.ajax({
        url: 'threads/fetch_threads',
        contentType: 'application/json',
        success: function(threads) {
            console.log(JSON.parse(threads));
            displayThreads(JSON.parse(threads));
        },
        error: function(error) {
            console.log(error);
        }
    });
}

const displayThreads = function(threads) {
    for(i = threads.length-1; i >= 0; i--) {
        console.log(threads.pk);
        
        card = $('<div>', {'class': 'card'});
        card_header = $('<div>', {'class': 'card-header', 'id': `${threads[i].pk+1}`});
        h5 = $('<h5>', {'class': 'mb-0'});
        button = $('<button>', 
        {
            'class': 'btn btn-link text-info', 
            'type': 'button',
            'data-toggle': 'collapse', 
            'data-target': `#a${threads[i].fields.name}`,
            'aria-expanded': 'true', 
            'aria-controls': `#a${threads[i].fields.name}`
        });
        collapse = $('<div>',
        {
            'class': 'collapse',
            'id': `a${threads[i].fields.name}`,
            'aria-labelledby': `${threads[i].pk+1}`,
            'data-parent': '#threads'
        });
        card_body = $('<div>', {'class': 'card-body'});

        button.text(`${threads[i].fields.title}`);
        card_body.text(`${threads[i].fields.body}`);

        collapse.append(card_body);
        h5.append(button);
        card_header.append(h5);
        card.append(card_header, collapse)

        $('.accordion').append(card);
    }
}