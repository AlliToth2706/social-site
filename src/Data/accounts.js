import { getDetails, setDefaultDetails, changeDetails } from './account-details';
import { initialiseFollows } from './following';
import { createPost } from './posts';

// Constants for localStorage
const LS_USERS = 'users';
const LS_USER = 'user';

/**
 * Users data
 * [ {
 *   email
 *   password
 *   visits
 *   first_name
 *   last_name
 *   time (creation date)
 *   bio
 *   avatar
 * } ]
 *
 * User - email of currently logged in user
 */

/**
 * Initialises the localStorage so that there is some information already available.
 */
const initialise = () => {
    // Don't create new localStorage if has already been created
    if (localStorage.getItem(LS_USERS) !== null) return;
    console.log('initialising...');

    // Create a default user for testing
    const users = [
        {
            email: 'alli@github.com',
            password: 'abc123',
            visits: 0,
            first_name: 'alli',
            last_name: '_',
        },
        {
            email: 'temp@temp.com',
            password: 'abc123',
            visits: 0,
            first_name: 'temp',
            last_name: 'account',
        },
        {
            email: 'person1@temp.com',
            password: 'abc123',
            visits: 0,
            first_name: 'Person',
            last_name: 'One',
        },
        {
            email: 'person2@temp.com',
            password: 'abc123',
            visits: 0,
            first_name: 'Person',
            last_name: 'Two',
        },
        {
            email: 'person3@temp.com',
            password: 'abc123',
            visits: 0,
            first_name: 'Person',
            last_name: 'Three',
        },
    ];

    // Add default users to localStorage
    setUsers(users);

    // Add default bio information
    users.forEach((e) => {
        setDefaultDetails(e.email);
    });

    // Create a default post
    createPost({
        email: 'alli@github.com',
        text: '<p>Hello world!</p>',
        reactions: { like: ['person3@temp.com'], dislike: [] },
        comments: [
            {
                email: 'person2@temp.com',
                comment: '<p>Hello!</p>',
                reactions: { like: ['person3@temp.com'], dislike: [] },
                replies: [],
            },
            {
                email: 'person1@temp.com',
                comment: '<p>Hey! Good to see you on here!</p>',
                reactions: { like: ['person3@temp.com'], dislike: [] },
                replies: [
                    {
                        email: 'alli@github.com',
                        comment: '<p>Likewise! :D</p>',
                        reactions: { like: ['person3@temp.com'], dislike: [] },
                    },
                ],
            },
        ],
    });

    initialiseFollows();
};

/**
 * Sets the users in localStorage with the given array.
 * @param {array} users - The array of user objects
 */
const setUsers = (users) => {
    localStorage.setItem(LS_USERS, JSON.stringify(users));
};

/**
 * Gets the information of the registered users.
 * @return {array} An array of the user objects
 */
const getUsers = () => JSON.parse(localStorage.getItem(LS_USERS));

/**
 * Verifies if the email and password given match the information in localStorage.
 * @param {string} email - The email provided by the user
 * @param {string} password - The password provided by the user
 * @return {boolean} Whether or not the user passed the verification
 */
const verifyUser = (email, pass) => {
    // Checks if the user is in the array of users
    for (const e of getUsers()) {
        if (email === e.email) {
            if (pass === e.password) {
                setUser(e.email);
                return { verified: true };
            } else {
                return { verified: false, reason: 'Incorrect password.' };
            }
        }
    }

    return { verified: false, reason: 'Unable to find account.' };
};

/**
 * Creates an account for the user.
 * @param {object} userInfo - The information for the sign up given by the user
 * @return {boolean} Whether or not the user was signed up (i.e. if the email was already used)
 */
const signUpUser = (userInfo) => {
    // Get all users registered to the website
    const users = getUsers();

    // Checks that the email isn't already in use
    if (users.some((e) => userInfo.email === e.email) === true) return false;

    // Adds new user to the array
    users.push({ ...userInfo, visits: 0 });

    // Sets the array of users to the new array
    setUsers(users);

    // Set the current user
    setUser(userInfo.email);

    // Sets the information that displays in the Profile component
    setDefaultDetails(userInfo.email);
    return true;
};

/**
 * Sets the logged in user in localStorage.
 * @param {string} email - The email of the logged in user
 */
const setUser = (email) => {
    localStorage.setItem(LS_USER, email);
};

/**
 * Gets the logged in user from localStorage
 * @return {string} The logged in user
 */
const getUser = () => localStorage.getItem(LS_USER);

/**
 * Removes the logged in user from localStorage.
 */
const removeUser = () => {
    localStorage.removeItem(LS_USER);
};

/**
 * Deletes all information relating to a user from localStorage.
 * @param {string} email - The email of the user to be removed
 */
const deleteAccount = (email) => {
    // Filters the email from the array of users
    setUsers(getUsers().filter((e) => e.email !== email));
    removeUser();
};

/**
 * Adds a visit to a user's profile
 * @param {string} email - The email of the user who has been visited
 */
const addProfileVisit = (email) => {
    const users = getUsers();
    for (const e of users) {
        if (e.email === email) {
            ++e.visits;
            break;
        }
    }
    setUsers(users);
};

export {
    initialise,
    verifyUser,
    getUser,
    removeUser,
    signUpUser,
    deleteAccount,
    getDetails as getUserInfo,
    changeDetails as editUserInfo,
    getUsers,
    addProfileVisit,
};
