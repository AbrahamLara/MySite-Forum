$(document).ready(() => {
    if (has_next_page) {
        displayFetchButton();
    }
});

const displayFetchButton = () => {
    const btn = $('<div>', {
        'class': 'more-btn',
        'text': 'Load More Threads...'
    });
    btn.attr('cursor', cursor);
    btn.on('click', fetchThreads);

    $('.container').append(btn);
}

const displayThreads = ({ threads, has_next_page}) => {
    for(i in threads) {
        thread = threadObj(threads[i]);
        $('#threads').append(thread);
    }

    if(has_next_page) {
        displayFetchButton();
    }
}

const fetchThreads = function() {
    $(this).remove();
    $.ajax({
        url: `/fetch_threads/`,
        data: {cursor},
        contentType: 'application/json',
        success: function(threads) {
            cursor = threads['cursor'];
            console.log(threads);
            displayThreads(threads);
        },
        error: function(err) {
            console.log(err);
        }
    });
}

const threadObj = ({ pk, title, author_id, author, date_created, }) => {
    const thread = $('<tr>');
    const mobile_thread = mobileThreadObj(pk, title, author_id, author, date_created);
    const title_link = $('<a>', {'class': 'thread-title', 'href': `/thread/${pk}`, 'text': title});
    const author_link = $('<a>', {'class': 'thread-author', 'href': `/profile/${author_id}`, 'text': author});
    const thread_title = $('<td>', {'class': 'rv-fw', 'scope': 'row'});
    const thread_author = $('<td>', {'class': 'rv-fw', 'scope': 'row'});
    const date = $('<td>', {'scope': 'row', 'text': date_created});

    thread_title.append(title_link);
    thread_author.append(author_link);
    thread.append(mobile_thread, thread_title, date, thread_author);

    return thread;
}

const mobileThreadObj = (pk, title, author_id, author, date_created) => {
    const thread = $('<td>', {'class': 'mobile-portrait'});
    const title_strong = $('<strong>', {class: 'mb-2'});
    const title_link = $('<a>', {'class': 'thread-title', 'href': `/thread/${pk}`, 'text': title});
    const author_strong = $('<strong>', {class: 'mb-2'});
    const author_link = $('<a>', {'class': 'thread-author', 'href': `/profile/${author_id}`, 'text': author});
    const mobile_details = $('<div>', {'class': 'details', 'scope': 'row'});

    title_strong.append(title_link);
    author_strong.append(author_link);
    mobile_details.append('created by ', author_strong, ` on ${date_created}`);

    thread.append(title_strong, mobile_details);

    return thread;
}