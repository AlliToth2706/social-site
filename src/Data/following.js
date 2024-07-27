import { getUsers } from './accounts';

const LS_FOLLOWS = 'follows';

/**
 * Follows data
 * {
 *   email: [] array of emails the user follows
 * }
 */

/**
 * If there is nothing in localStorage related to follows,
 * set the follows to be an empty object
 */
const initialiseFollows = () => {
    if (localStorage.getItem(LS_FOLLOWS) === null) setFollows({});
};

/**
 * Gets the information of all of the follows within localStorage
 * @returns {object} Object of all the follows currently stored
 */
const getAllFollows = () => JSON.parse(localStorage.getItem(LS_FOLLOWS));

/**
 * Gets a list of all of the users the given user follows
 * @param {string} email Email to get the follows of
 * @returns {array} Array of emails which the user follows
 */
const getFollows = (email) => getAllFollows()[email] ?? [];

/**
 * Sets the follows in localStorage
 * @param {object} follows Object containing all the follows on the site
 */
const setFollows = (follows) => {
    localStorage.setItem(LS_FOLLOWS, JSON.stringify(follows));
};

/**
 * Sets the follows of a particular user
 * @param {string} email Email of the user whose followings are being changed
 * @param {array} follows List of all the emails the user follows
 */
const setFollowsOfUser = (email, follows) => {
    const allFollows = getAllFollows();
    allFollows[email] = follows;
    setFollows(allFollows);
};

/**
 * Gets a list of all of the users the given user is followed by
 * @param {string} email Email to get the followers of
 * @returns {array} Array of emails
 */
const getFollowsTo = (email) => {
    const allFollows = getAllFollows();
    const followers = [];
    for (const [key, value] of Object.entries(allFollows)) {
        if (value.includes(email)) {
            followers.push(key);
        }
    }
    return followers;
};

/**
 * Checks if a user is following another user
 * @param {string} from_email Email of the user to check if is following
 * @param {string} to_email Email of the user to check is being followed
 * @returns {boolean} If from_email is following to_email
 */
const isFollowing = (from_email, to_email) => getFollows(from_email).some((e) => e === to_email);

/**
 * Gets the users the given user is not following
 * @param {string} email The user to get the list for
 * @returns {array} List of people the user is not following
 */
const getNotFollowing = (email) => {
    // Gets all of the users and user emails the user follows
    let users = getUsers();
    let follows = getFollows(email);

    // If the follows isn't an array, just return the users except the given user
    // The follows will be an empty if there are no follows
    if (!Array.isArray(follows) || follows.length === 0) return users?.filter((e) => e.email !== email);

    follows.push(email);

    // Removes all of the users that are already being followed by the user
    return users.filter((e) => !follows.includes(e.email));
};

/**
 * Adds a follow relationship between two users via emails
 * @param {string} from_email The email of the person that will be following
 * @param {string} to_email The email of the user that will be followed
 */
const addFollow = (from_email, to_email) => {
    const follows = getFollows(from_email);
    follows.push(to_email);
    setFollowsOfUser(from_email, follows);
};

/**
 * Removes a follow relationship between two users via emails
 * @param {string} from_email The email of the person that will no longer be following
 * @param {string} to_email The email of the user that will no longer be followed
 */
const removeFollow = (from_email, to_email) => {
    // https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array-in-javascript
    const follows = getFollows(from_email);
    let index = follows.indexOf(to_email);
    if (index > -1) {
        follows.splice(index, 1);
    }
    setFollowsOfUser(from_email, follows);
};

export { getFollows, getFollowsTo, getNotFollowing, addFollow, removeFollow, isFollowing, initialiseFollows };
