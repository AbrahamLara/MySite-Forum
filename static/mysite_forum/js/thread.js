$(document).ready(function() {

    displayPosts(posts);

    $('#post-btn').on('click', submitForm);
    console.log(posts);
});

const displayPosts = function(posts) {

    for (i = posts.length-1; i >= 0; --i) {
        
        post_cell = $('<div>', {'class': 'post-cell', 'id': posts[i].pk});
        post = $('<div>', {'class': 'post', 'text': posts[i].post});
        author = $('<div>', {'class': 'author post-author', 'text': `- ${posts[i].author}`});

        post_cell.append(post,author);

        $('.posts-container').append(post_cell);
    }
}

const submitForm = function() {
    $('#post-form').submit();
}