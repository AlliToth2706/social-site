const LS_POSTS = 'posts';

const defaultReactions = { like: [], dislike: [] };

/**
 * Posts data
 * {
 *   email: string,
 *   text: string,
 *   timestamp: Date,
 *   reactions: {like: [], dislike: []} lists of users who have liked the post
 *   comments: {
 *     email: string,
 *     comment: string,
 *     reactions: {},
 *     replies: {
 *       email: string,
 *       comment: string,
 *       reactions: {},
 *     }
 *   }
 * }
 */

/**
 * Gets all of the posts in localStorage and returns them
 * @return {array} An array with all of the posts and their information
 */
const getAllPosts = () => {
    return JSON.parse(localStorage.getItem(LS_POSTS)) ?? [];
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
 * Creates a post in localStorage from the given information
 * @param {object} info - An object with all of the post information
 */
const createPost = (info) => {
    let posts = getAllPosts();
    info.timestamp = new Date();
    info.reactions = info.reactions ?? defaultReactions;
    info.comments = info.comments ?? [];
    posts.push(info);

    replacePosts(posts);
};

/**
 * Replaces the post of the given id with the info given.
 * @param {object} info - The information of the post
 * @param {number} id - The numerical id of the post
 */
const editPost = (info, id) => {
    let posts = getAllPosts();
    posts[id] = info;

    replacePosts(posts);
};

/**
 * Removes the post using the id given
 * @param {number} id - The numerical id of the post
 */
const removePost = (id) => {
    let posts = getAllPosts();

    // Removes the specific index and replace posts
    posts.splice(id, 1);
    replacePosts(posts);
};

/**
 * Removes all of the posts that have the user as the email given
 * @param {string} email - The email of the poster whose posts will be deleted
 */
const removePostsByUser = (email) => {
    let posts = getAllPosts();
    let newPosts = posts.filter((e) => e.email !== email);

    replacePosts(newPosts);
};

/**
 * The function description goes here.
 * @param {number} post_id - The numerical id the post's parent
 * @param {object} comment - The object of the comment being added
 */
const createComment = (post_id, comment) => {
    // Grabs the posts in local storage
    let posts = getAllPosts();

    // Set variables if they have not been set already
    comment.reactions = comment.reactions ?? defaultReactions;
    comment.replies = comment.replies ?? [];

    // Adds the comment to the array
    posts[post_id].comments.push(comment);

    // Puts the new posts information into local storage
    replacePosts(posts);
};

/**
 * Changes a comment on a post to the be whatever is passed through.
 * @param {number} post_id - The numerical id of the reply's parent post
 * @param {number} comment_id - The numerical id of the reply's parent comment
 * @param {object} info - The object of the comment being added
 */
const editComment = (post_id, comment_id, info) => {
    // Grabs the posts in local storage
    let posts = getAllPosts();

    // Change the comment in the array
    posts[post_id].comments[comment_id] = { ...posts[post_id].comments[comment_id], ...info };

    // Puts the new posts information into local storage
    replacePosts(posts);
};

/**
 * Removes a comment from the post given.
 * @param {number} post_id - The numerical id of the post
 * @param {number} comment_id - The numerical id of the comment
 */
const removeComment = (post_id, comment_id) => {
    // Grabs the posts in local storage
    let posts = getAllPosts();

    // Removes the comment to the array
    posts[post_id].comments.splice(comment_id, 1);

    // Puts the new posts information into local storage
    replacePosts(posts);
};

/**
 * Adds a reply to the comment given.
 * @param {number} post_id - The numerical id of the post
 * @param {number} comment_id - The numerical id of the comment
 * @param {object} info - The object of the reply being added
 */
const createReply = (post_id, comment_id, info) => {
    // Grabs the posts in local storage
    let posts = getAllPosts();

    info.reactions = defaultReactions;

    // Adds the comment to the array
    posts[post_id].comments[comment_id].replies.push(info);

    // Puts the new posts information into local storage
    replacePosts(posts);
};

/**
 * Changes the reply to a comment to be whatever is passed through.
 * @param {number} post_id - The numerical id of the post
 * @param {number} comment_id - The numerical id of the comment
 * @param {number} reply_id - The numerical id of the reply
 * @param {object} info - The object of the reply being changed
 */
const editReply = (post_id, comment_id, reply_id, info) => {
    // Grabs the posts in local storage
    let posts = getAllPosts();

    // Change the reply in the array
    posts[post_id].comments[comment_id].replies[reply_id] = {
        ...posts[post_id].comments[comment_id].replies[reply_id],
        ...info,
    };

    console.log(posts[post_id].comments[comment_id].replies);

    // Puts the new posts information into local storage
    replacePosts(posts);
};

/**
 * Removes a reply using the post, comment, and reply ids.
 * @param {number} post_id - The numerical id of the post
 * @param {number} comment_id - The numerical id of the comment
 * @param {number} reply_id - The numerical id of the reply
 */
const removeReply = (post_id, comment_id, reply_id) => {
    // Grabs the posts in local storage
    let posts = getAllPosts();

    // Removes the comment to the array
    posts[post_id].comments[comment_id].replies.splice(reply_id, 1);

    // Puts the new posts information into local storage
    replacePosts(posts);
};

export {
    getAllPosts,
    createPost,
    editPost,
    removePost,
    removePostsByUser,
    createComment,
    editComment,
    removeComment,
    createReply,
    editReply,
    removeReply,
};
