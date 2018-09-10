$(document).ready(function() {
    $('.search-bar').on('keyup', checkIfEnter);
    $('#search-btn').on('click', displayResults);
});

const checkIfEnter = function(event) {
    if (event.keyCode == 13) $('#search-btn').click(); 
}

const displayResults = function() {
    $('.accordion').empty();

    var input = $('.search-bar').val();
    
    if (input !== '') {
        $.ajax({
            url: `users/${input}`,
            dataType: 'json',
            contentType: 'application/json',
            success: function(data) {
                populateAccordion(JSON.parse(data));
            }
        });
    }
}

const populateAccordion = function(data) {
    console.log(data)
    for(i = 0; i < data.length; i++) {
        
        card = $('<div>', {'class': 'card'});
        card_header = $('<div>', {'class': 'card-header', 'id': `${data[i].pk}`});
        h5 = $('<h5>', {'class': 'mb-0'});
        button = $('<button>', 
        {
            'class': 'btn btn-link text-info', 
            'type': 'button',
            'data-toggle': 'collapse', 
            'data-target': `#a${data[i].fields.author}`,
            'aria-expanded': 'true', 
            'aria-controls': `#a${data[i].fields.author}`
        });
        collapse = $('<div>',
        {
            'class': 'collapse',
            'id': `a${data[i].fields.author}`,
            'aria-labelledby': `${data[i].pk}`,
            'data-parent': '#data'
        });
        card_body = $('<div>', {'class': 'card-body'});

        button.text(`${data[i].fields.title}`);
        
        card_body.text(`Email: ${data[i].fields.body}`);

        collapse.append(card_body);
        h5.append(button);
        card_header.append(h5);
        card.append(card_header, collapse)

        $('.accordion').append(card);
    }
}