import imgur from 'imgur';

const LS_POSTS = 'posts';

const defaultReactions = { like: [], dislike: [] };

/**
 * Gets all of the posts in localStorage and returns them
 * @return {array} An array with all of the posts and their information
 */
const getAllPosts = () => {
    return JSON.parse(localStorage.getItem(LS_POSTS)) ?? [];
};

/**
 * Creates a post in localStorage from the given information
 * @param {object} info - An object with all of the post information
 */
const createPost = (info) => {
    let posts = getAllPosts();
    info.timestamp = new Date();
    info.reactions = { like: [], dislike: [] };
    info.comments = [];
    posts.push(info);

    replacePosts(posts);
};

/**
 * Replaces the post of the given postId with the info given.
 * @param {object} info - The information of the post
 * @param {number} postId - The numerical id of the post
 */
const editPost = (info, postId) => {
    let posts = getAllPosts();
    posts[postId] = info;

    replacePosts(posts);
};

/**
 * Removes the post using the postId given
 * @param {number} postId - The numerical id of the post
 */
const removePost = (postId) => {
    let posts = getAllPosts();

    // Removes the specific index and replace posts
    posts.splice(postId, 1);
    replacePosts(posts);
};

/**
 * Removes all of the posts that have the user as the username given
 * @param {string} username - The username of the poster whose posts will be deleted
 */
const removePostsByUser = (username) => {
    let posts = getAllPosts();
    let newPosts = posts.filter((e) => e.username !== username);

    replacePosts(newPosts);
};

/**
 * Replaces all of the posts that are in localStorage
 * @param {array} posts - An array of all of the posts
 */
const replacePosts = (posts) => {
    localStorage.removeItem(LS_POSTS);
    localStorage.setItem(LS_POSTS, JSON.stringify(posts));
};

/**
 * The function description goes here.
 * @param {number} parent_id - The numerical id the post's parent
 * @param {object} comment - The object of the comment being added
 */
const addComment = (parent_id, comment) => {
    // Grabs the posts in local storage
    let posts = getAllPosts();

    comment.reactions = defaultReactions;

    // Adds the comment to the array
    posts[parent_id].comments.push(comment);

    // Puts the new posts information into local storage
    replacePosts(posts);
};

/**
 * Changes a comment on a post to the be whatever is passed through.
 * @param {number} parent_id - The numerical id of the reply's parent post
 * @param {number} comment_id - The numerical id of the reply's parent comment
 * @param {object} commentInfo - The object of the comment being added
 */
const editComment = (parent_id, comment_id, commentInfo) => {
    // Grabs the posts in local storage
    let posts = getAllPosts();

    // Change the comment in the array
    posts[parent_id].comments[comment_id] = { ...posts[parent_id].comments[comment_id], ...commentInfo };

    // Puts the new posts information into local storage
    replacePosts(posts);
};

/**
 * Removes a comment from the post given.
 * @param {number} postId - The numerical postId of the post
 * @param {number} commentId - The numerical id of the comment
 */
const removeComment = (postId, commentId) => {
    // Grabs the posts in local storage
    let posts = getAllPosts();

    // Removes the comment to the array
    posts[postId].comments.splice(commentId, 1);

    // Puts the new posts information into local storage
    replacePosts(posts);
};

/**
 * Adds a reply to the comment given.
 * @param {number} post_id - The numerical postId of the post
 * @param {number} comment_id - The numerical id of the comment
 * @param {object} reply - The object of the reply being added
 */
const addReply = (post_id, comment_id, reply) => {
    // Grabs the posts in local storage
    let posts = getAllPosts();

    reply.reactions = defaultReactions;

    // Adds the comment to the array
    posts[post_id].comments[comment_id].replies.push(reply);

    // Puts the new posts information into local storage
    replacePosts(posts);
};

/**
 * Changes the reply to a comment to be whatever is passed through.
 * @param {number} postId - The numerical postId of the post
 * @param {number} commentId - The numerical id of the comment
 * @param {number} replyId - The numerical id of the reply
 * @param {object} replyInfo - The object of the reply being changed
 */
const editReply = (postId, commentId, replyId, replyInfo) => {
    // Grabs the posts in local storage
    let posts = getAllPosts();

    // Change the reply in the array
    posts[postId].comments[commentId].replies[replyId] = {
        ...posts[postId].comments[commentId].replies[replyId],
        ...replyInfo,
    };

    // Puts the new posts information into local storage
    replacePosts(posts);
};

/**
 * Removes a reply using the post, comment, and reply ids.
 * @param {number} postId - The numerical postId of the post
 * @param {number} commentId - The numerical id of the comment
 * @param {number} replyId - The numerical id of the reply
 */
const removeReply = (postId, commentId, replyId) => {
    // Grabs the posts in local storage
    let posts = getAllPosts();

    // Removes the comment to the array
    posts[postId].comments[commentId].replies.splice(replyId, 1);

    // Puts the new posts information into local storage
    replacePosts(posts);
};

/**
 * Uploads file to imgur.
 * @param {File} file Uploads a file to imgur to keep it stored non-locally
 * @returns {string} Link to the uploaded file
 */
const upload = async (file) => {
    const imgurClient = new imgur({ clientId: '7af276a6d6f6507' });
    try {
        const res = await imgurClient.upload({
            image: file,
            type: 'stream',
        });
        if (res.status !== 200) return null;
        return res?.data?.link ?? null;
    } catch (e) {
        console.log(e);
    }
};

export {
    getAllPosts,
    createPost,
    editPost,
    removePost,
    removePostsByUser,
    addComment,
    editComment,
    removeComment,
    addReply,
    editReply,
    removeReply,
    upload,
};
