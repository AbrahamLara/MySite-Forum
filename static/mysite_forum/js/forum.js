$(document).ready(function() {
    $('.justify-content-end').prepend('<li class="nav-item create-item d-none"><a class="nav-link text-info" href="/create">Create</a></li>');

    if (has_next_page) {
        displayMoreButton();
    }
});

const displayMoreButton = function(index) {
    const more = $('<div>', {
        'class': 'more-btn',
        'text': 'Load More Threads...'
    });
    more.attr('cursor', cursor);
    more.on('click', fetchThreads);

    $('.container').append(more);
}

const displayThreads = function({ threads, has_next_page}) {
    for(i in threads) {
        thread = createThreadObject(threads[i]);
        $('#threads').append(thread);
    }

    if(has_next_page) {
        displayMoreButton();
    }
}

const fetchThreads = function() {
    $(this).remove();
    $.ajax({
        url: `/fetch_threads/`,
        data: {cursor},
        contentType: 'application/json',
        success: function(threads) {
            cursor = threads['cursor']
            console.log(threads);
            displayThreads(threads);
        },
        error: function(err) {
            console.log(err);
        }
    });
}

const createThreadObject = function(thread_data) {
    const thread = $('<tr>');
    const mobile_portrait = $('<td>', {'class': 'mobile-portrait'});
    const mobile_thread_title = $('<div>', {'class': 'bold', 'scope': 'row'});
    const mobile_details = $('<div>', {'class': 'details', 'scope': 'row'});
    const thread_title_link = `<a class="thread-title" href="/thread/${thread_data.pk}"><div class="thread-title">${thread_data.title}</div></a>`;
    const thread_author_link = `<a class="thread-author" href="/profile/${thread_data.author_id}">${thread_data.author}</a>`;;
    const thread_title = $('<td>', {'class': 'rv-fw', 'scope': 'row'});
    const thread_author = $('<td>', {'class': 'rv-fw', 'scope': 'row'});
    const date_created = $('<td>', {'scope': 'row', 'text': thread_data.date_created});

    mobile_thread_title.append(thread_title_link);
    mobile_details.append('created by ', thread_author_link, ` on ${thread_data.date_created}`);
    mobile_portrait.append(mobile_thread_title, mobile_details);
    thread_title.append(thread_title_link);
    thread_author.append(thread_author_link);
    thread.append(mobile_portrait, thread_title, date_created, thread_author);

    return thread;
}