// import axios from 'axios';
import { getUsers } from './accounts';
// import env from 'react-dotenv';

const LS_FOLLOWS = 'follows';

const initialiseFollows = () => {
    if (localStorage.getItem(LS_FOLLOWS) !== null) return;

    setFollows({});
};

/**
 * Get a list of all of the users the given user follows
 * @param {string} email Email to get the follows of
 * @returns {array | number} Array of emails
 */
const getFollows = (email) => {
    const allFollows = getAllFollows();
    return allFollows[email] ?? [];
};

const getAllFollows = () => {
    return JSON.parse(localStorage.getItem(LS_FOLLOWS));
};

const setFollows = (data) => {
    localStorage.setItem(LS_FOLLOWS, JSON.stringify(data));
};

const setFollowsOfUser = (email, data) => {
    const allFollows = getAllFollows();
    allFollows[email] = data;
    setFollows(allFollows);
};

/**
 * Get a list of all of the users the given user is followed by
 * @param {string} email Email to get the followers of
 * @returns {array | number} Array of emails
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
 * Get if user is following another user
 * @param {string} from_email Email of the user that is the follower
 * @param {string} to_email Email of the user that is followed
 * @returns {boolean} If follow relation exists
 */
const getFollow = (from_email, to_email) => getFollows(from_email).some((e) => e === to_email);

/**
 * Get the users the given user is not following
 * @param {string} email The user to get the not-follows of
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
    let notFollowedUsers = users.filter((e) => !follows.includes(e.email));

    return notFollowedUsers;
};

/**
 * Adds a follow relationship between two users via emails
 * @param {string} from_email The email of the person that will be following
 * @param {string} to_email The email of the user that will be followed
 * @returns {boolean} If the request succeeded
 */
const addFollow = (from_email, to_email) => {
    const allFollows = getAllFollows();
    // console.log(allFollows);
    const follows = allFollows[from_email] ?? [];
    follows.push(to_email);
    setFollowsOfUser(from_email, follows);

    // TODO: see if need to actually return anything from here
};

/**
 * Removes a follow relationship between two users via emails
 * @param {string} from_email The email of the person that will no longer be following
 * @param {string} to_email The email of the user that will no longer be followed
 * @returns {boolean} If the request succeeded
 */
const removeFollow = (from_email, to_email) => {
    // https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array-in-javascript
    const follows = getFollows(from_email);
    let index = follows.indexOf(to_email);
    if (index > -1) {
        follows.splice(index, 1);
    }
    // return follows;
    setFollowsOfUser(from_email, follows);
    // TODO: see if need to actually return anything from here
};

export { getFollows, getFollowsTo, getNotFollowing, addFollow, removeFollow, getFollow, initialiseFollows };
