$(document).ready(function() {
    displayPosts(json_context);

    $('#action-modal').on('hidden.bs.modal', removeTextFromBody);
    $('#post-btn').on('click', displayModal);
    $('#submit-btn').on('click', submitText);
});

const removeTextFromBody = () => {
    $('.modal-body').val('');
}

const displayModal = function() {
    const object = $(this);
    if (object.is('#post-btn'))
        prepareModal('post', 'Post');
    else prepareModal('reply', 'Reply');
    
    $('#submit-btn').attr({
        'value': object.attr('value'),
        'type': object.attr('type')
    });

    $('#action-modal').modal('show');
}

const prepareModal = (body_type, object_type) => {
    $('.modal-title').text(`Type your ${body_type} below!`);
    $('.modal-body').attr('placeholder', `${object_type} here...`);
}

const submitText = function() {
    const id = $(this).attr('value');
    const type = $(this).attr('type');
    const text = $('#modal-textarea').val();
    
    $.ajax({
        type: 'POST',
        url: `/create_${type}/`,
        data: {id, text},
        success: function(data) {
            updateContainerFor(type, data, id)
            $('#action-modal').modal('hide');
        },
        error: function(res) {
            console.log(res);
        }
    });
}

const updateContainerFor = (type, data, id) => {
    if ('post' in data) {
        $(`#${type}-container`).prepend(postObj(data));
        updatePostCounter(data.n_posts);
    } else if('reply' in data) {
        $(`#${type}-container-${id}`).prepend(replyObj(data));
        updateRepliesCounter(data.n_replies, id);
    }
};

const updatePostCounter = (n_posts) => {
    $('.post-count').text(`Posts(${n_posts})`);
}

const updateRepliesCounter = (n_replies, id) => {
    $(`#replies-for-${id}`)
        .attr('display', 'false')
        .text(`Replies(${n_replies})`);
}

const displayPosts = ({ posts, has_next_page, cursor}) => {
    for (i in posts) {
        let post = postObj(posts[i]);
        $('#post-container').append(post);
    }

    if (has_next_page) {
        let more_btn = moreBtn('posts', thread_id)
            .attr('cursor', cursor).on('click', fetchObjects);
        $('#post-container').append(more_btn);
    }
}

const displayReplies = ({ replies, cursor, has_next_page, post_id }) => {
    for(i in replies) {
        let reply = replyObj(replies[i]);
        $(`#reply-container-${post_id}`).append(reply);
    }

    if (has_next_page) {
        let more_btn = moreBtn('replies', post_id);
        more_btn.attr('cursor', cursor).on('click', fetchObjects);
        $(`#reply-container-${post_id}`).append(more_btn);
    }
}

const postObj = ({ pk, post, author, author_id, n_replies, date_created }) => {
    const obj = $('<div>', {'class': `post-obj`, 'id': `post-${pk}`});
    const strong = $('<strong>');
    const link = $('<a>', {
        'class': 'text-dark',
        'href': `/profile/${author_id}`,
        'text': author,
    });
    const date = $('<span>', {
        'class': 'text-secondary font-italic',
        'text': ` posted on ${date_created}`,
    });
    const post_txt = $('<div>', {'class': 'post mb-1', 'text': post,});
    const reply_btn = $('<button>', {
        'class': 'btn btn-dark',
        'text': 'Reply',
        'value': pk,
        'type': 'reply',
    });
    const replies_count = $('<button>', {
        'class': 'btn btn-link text-dark',
        'id': `replies-for-${pk}`,
        'text': `Replies(${n_replies})`,
        'value': pk,
        'type': 'replies',
        'display': true,
    });
    const replies_container = $('<div>', {'class': 'pl-5 mt-3', 'id': `reply-container-${pk}`});

    reply_btn.on('click', displayModal);
    replies_count.on('click', toggleContainer);
    strong.append(link);
    obj.append(strong, date, post_txt, reply_btn, replies_count, replies_container);

    return obj;
}

const replyObj = ({ pk, reply, author_id, author, date_created }) => {
    const obj = $('<div>', {'class': 'reply-obj', 'id': `reply-${pk}`});
    const strong = $('<strong>');
    const link = $('<a>', {
        'class': 'text-dark',
        'href': `/profile/${author_id}`,
        'text': author,
    });
    const date = $('<span>', {
        'class': 'text-secondary font-italic',
        'text': ` replied on ${date_created}`,
    });
    const reply_txt = $('<div>', {'class': 'mb-1', 'text': reply,});

    strong.append(link);

    obj.append(strong, date, reply_txt);

    return obj;
}

const moreBtn = (context, data) => {
    if (context === 'replies')
        return repliesBtn(data);
    else if (context === 'posts')
        return postsBtn(data);
}

const repliesBtn = (id) => {
    return createMore(`replies-${id}`, id, 'more replies...').attr('type', 'replies');
}

const postsBtn = (id) => {
    return createMore('posts', id, 'more posts...').attr('type', 'posts');
}

const createMore = (type, value, text) => {
    const more = $('<div>', {'class': `more-btn more-btn-for-${type}`, 'value': value});
    more.text(text);
    return more;
}

const toggleContainer = function () {
    const object = $(this);
    const type = object.attr('type');
    const id = object.attr('value');

    const  toggled = object.attr('display') === 'false';
    object.attr('display', toggled);
    
    if (toggled) {
        $(`#reply-container-${id}`).empty();
        return;
    }

    fetchObjectsAjax({ type, id, });
}

const fetchObjects = function() {
    const object = $(this);
    object.remove();
    fetchObjectsAjax({
        id: object.attr('value'),
        type: object.attr('type'),
        cursor: object.attr('cursor'),
    });
}

const fetchObjectsAjax = ({ type, id, cursor }) => {
    $.ajax({
        url: `/fetch_${type}/`,
        data: {id, cursor},
        contentType: 'application/json',
        success: function(res) {
            if ('replies' in res) {
                res['post_id'] = id;
                displayReplies(res);
            } else if ('posts' in res)
                displayPosts(res);
        },
        error: function(res) {
            console.log(res);
        }
    });
}