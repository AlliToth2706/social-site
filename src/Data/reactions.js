// import axios from 'axios';
// import env from 'react-dotenv';

// const client = axios.create({
//     baseURL: `${env.BACKEND_URL}/reactions`,
// });

const LS_POSTS = 'posts';

//The reactions available in Loop Agile Now
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
const getAllPostReactions = async (postId) => {
    // try {
    //     let res = await client.get(`/${postId}`);
    //     return res.data;
    // } catch (e) {
    //     return e?.response.status ?? 0;
    // }

    // todo
};

/**
 * Gets all reactions on a post by a user
 * @param {postId} int The id of the post
 * @param {userEmail} string The email of the user
 * @return {array} an array of reactions types by the user on the post
 */
const getUserPostReactions = async (postId, userEmail) => {
    // try {
    //     let res = await client.get(`/${postId}/${userEmail}`);
    //     return res.data;
    // } catch (e) {
    //     return e?.response.status ?? 0;
    // }

    // todo
};

/**
 * Add the reaction from the user to the post
 * @param {postId} int The id of the post
 * @param {userEmail} int The user reacting
 * @param {reactionType} int The reaction to add
 */
const addReaction = async (postId, userEmail, reactionType) => {
    // const res = await client.post('/', { post_id: postId, email: userEmail, reaction_type: reactionType });
    // return res.status === 200;

    // todo
    return false
};

/**
 * Removes all reactions by a user on a post
 * @param {postId} int The id of the post
 * @param {userEmail} int The user reacting
 */
const stripUserReactionsFromPost = async (postId, userEmail) => {
    // const res = await client.delete(`/${postId}/${userEmail}`);
    // return res.status === 200;
    
    // todo
};

export { reactionTypes, getAllPostReactions, getUserPostReactions, addReaction, stripUserReactionsFromPost };
