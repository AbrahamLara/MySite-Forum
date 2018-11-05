$(document).ready(function() {
    for (var i = threads_context.threads.length-1; i >= 0; i--) {
        $('#threads-container').append(getThreadBlock(threads_context.threads[i]));
    }
});

const getThreadBlock = function(thread_data) {
    const thread_block = $('<div>', {'class': 'thread-block', 'id': `thread-block-${thread_data.pk}`});
    const thread_link = $('<a>', {'class': 'thread-link text-info', 'href': `/thread/${thread_data.pk}`});

    thread_link.text(thread_data.title);
    thread_block.append(thread_link);

    return thread_block;
}