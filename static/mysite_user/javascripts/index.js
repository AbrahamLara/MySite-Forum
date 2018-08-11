$(document).ready(function() {
    populateAccordion(50);
});

const populateAccordion = function(length=0) {
    for(i = 0; i < length; i++) {

        card = $('<div>', {'class': 'card'});
        card_header = $('<div>', {'class': 'card-header', 'id': `a${i}`});
        h5 = $('<h5>', {'class': 'mb-0'});
        button = $('<button>', 
        {
            'class': 'btn btn-link text-info', 
            'type': 'button',
            'data-toggle': 'collapse', 
            'data-target': `#b${i}`,
            'aria-expanded': 'true', 
            'aria-controls': `#b${i}`
        });

        collapse = $('<div>', 
        {
            'class': 'collapse',
            'id': `b${i}`,
            'aria-labelledby': `a${i}`,
            'data-parent': '#data'
        });
        card_body = $('<div>', {'class': 'card-body'});

        button.text(`#${i+1}`);
        card_body.text('Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven\'t heard of them accusamus labore sustainable VHS.');

        collapse.append(card_body);
        h5.append(button);
        card_header.append(h5);

        card.append(card_header, collapse)

        $('.accordion').append(card);
    }
}