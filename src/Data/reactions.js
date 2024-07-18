// import axios from 'axios';
// import env from 'react-dotenv';

// import { editComment, editPost, getAllPosts } from './posts';

// const client = axios.create({
//     baseURL: `${env.BACKEND_URL}/reactions`,
// });

// const LS_POSTS = 'posts';

//The reactions available in Social Website
//Has a name, and a material icon
const reactionTypes = {
    like: {
        symbol: Symbol('like'),
        materialIconName: 'thumb_up',
    },
    dislike: {
        symbol: Symbol('dislike'),
        materialIconName: 'thumb_down',
    },
};

/**
 * Gets all reactions on a post
 * @param {postId} int The id of the post
 * @return {object} an object that represents the count of reactions by reactiontype
 */
// const getAllPostReactions = (post) => {
//     return posts.reactions;
// };

/**
 * Gets all reactions on a post by a user
 * @param {postId} int The id of the post
 * @param {userEmail} string The email of the user
 * @return {array} an array of reactions types by the user on the post
 */
const getUserPostReactions = (post, userEmail) => {
    const reactions = post.reactions;
    let userReaction = null;
    Object.keys(reactionTypes).forEach((reaction) => {
        if (reactions[reaction].includes(userEmail)) {
            userReaction = reaction;
        }
    });

    return userReaction;
};

export { reactionTypes, getUserPostReactions };
