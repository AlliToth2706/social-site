import { getAllPosts, editPost } from './posts';

// The reactions available in Social Website
// Has a name, and a material icon
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
 * Removes all reactions a user has given to all posts
 * @param {string} email Email of the user to remove information of
 */
const removeAllReactionsFromUser = (email) => {
    const posts = getAllPosts();
    posts.forEach((p, i) => {
        p.comments.map((c) => {
            c.replies.map((r) => {
                // Remove the user from all replies for each reaction type
                Object.keys(reactionTypes).forEach((reaction) => {
                    r.reactions[reaction] = r.reactions[reaction].filter((e) => e !== email);
                });
                return r;
            });
            // Remove the user from all comments for each reaction type
            Object.keys(reactionTypes).forEach((reaction) => {
                c.reactions[reaction] = c.reactions[reaction].filter((e) => e !== email);
            });
            return c;
        });
        // Remove the user from all posts for each reaction type
        Object.keys(reactionTypes).forEach((reaction) => {
            p.reactions[reaction] = p.reactions[reaction].filter((e) => e !== email);
        });

        // Replaces the post information for each post
        editPost(p, i);
    });
};

export { reactionTypes, removeAllReactionsFromUser };
