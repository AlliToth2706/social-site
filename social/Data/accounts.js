import { getDetails, setDefaultDetails, changeDetails } from './account-details';
import { initialiseFollows } from './following';
import { createPost } from './posts';

// Constants for localStorage
const LS_USERS = 'users';
const LS_USER = 'user';

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
            email: 'allitoth2706@outlook.com',
            password: 'abc123',
            visits: 0,
            first_name: 'alli',
            last_name: 'toth',
        },
    ];

    // Add default users to localStorage
    setUsers(users);

    // Add default bio information
    setDefaultDetails('allitoth2706@outlook.com');

    // Create a default post
    createPost({
        email: 'allitoth2706@outlook.com',
        text: 'Hello world!',
        comments: [],
        like: [],
        image: '',
    });

    initialiseFollows();
};

/**
 * The function description goes here.
 * @param {string} email - The email to change to
 */
// const changeEmail = (user, email) => {
//     let users = getUsers();
//     // users[users.findIndex((e) => e.username === user)].email = email;
//     users[users.findIndex((e) => e.email === email)].email = email;

//     setUsers(users);
// };

/**
 * Getter for the email of the user given.
 * @param {string} user - The username of the user whose email is being got
 * @return {string} The email of the user given
 */
// const getUserEmail = (user) => {
//     let users = getUsers();
//     return users[users.findIndex((e) => e.username === user)].email;
// };

/**
 * Sets the users in localStorage with the given array.
 * @param {array} users - The array of user objects
 */
const setUsers = (users) => {
    localStorage.setItem(LS_USERS, JSON.stringify(users));
};

/**
 * Getter for the users array.
 * @return {array} An array of the user objects
 */
const getUsers = () => {
    // Extract user data from local storage and convert data to objects.
    return JSON.parse(localStorage.getItem(LS_USERS));
};

/**
 * Verifies if the email and password given match the information in localStorage.
 * @param {string} email - The email provided by the user
 * @param {string} password - The password provided by the user
 * @return {boolean} Whether or not the user passed the verification
 */
const verifyUser = (email, pass) => {
    // Checks if the user is in the array of users
    for (const e of getUsers()) {
        if (email === e.email && pass === e.password) {
            console.log('success');
            setUser(e.email);
            return true;
        }
    }

    return false;
};

/**
 * Creates an account for the user.
 * @param {object} userInfo - The information for the sign up given by the user
 * @return {boolean} Whether or not the user was signed up (i.e. if the email was already used)
 */
const signUpUser = (userInfo) => {
    // Get the users and check that the new user isn't a duplicate
    const users = getUsers();
    users.forEach((e) => {
        if (userInfo.email === e.email) {
            return false;
        }
    });

    // Clears out what was in localStorage before
    localStorage.removeItem(LS_USERS);

    // Adds new user to the array
    users.push({ ...userInfo, visits: 0 });

    // Sets the array of users to the new array
    setUsers(users);

    // Set the current user
    setUser(userInfo.email);

    // Sets the information that displays in the Profile component
    setDefaultDetails(userInfo.username);
    return true;
};

/**
 * Sets the logged in user in localStorage.
 * @param {string} user - The username of the logged in user
 */
const setUser = (user) => {
    localStorage.setItem(LS_USER, user);
};

/**
 * Gets the logged in user from localStorage
 * @return {string} The logged in user
 */
const getUser = () => {
    return localStorage.getItem(LS_USER);
};

/**
 * Removes the logged in user from localStorage.
 */
function removeUser() {
    localStorage.removeItem(LS_USER);
}

/**
 * Deletes all information relating to a user from localStorage.
 * @param {string} username - The username of the user to be removed
 */
function deleteAccount(username) {
    let users = getUsers();
    let newUsers = users.filter((e) => e.email !== username);

    setUsers(newUsers);
    removeUser();
}

// addProfileVisit
/**
 * Adds a visit to a user's profile
 * @param {string} username - The username of the user who has been visited
 */
function addProfileVisit(username) {
    const users = getUsers();
    // console.log(users);
    for (const e of users) {
        if (e.email === username) {
            ++e.visits;
        }
    }
    // console.log(users);
}

export {
    initialise,
    verifyUser,
    getUser,
    removeUser,
    signUpUser,
    deleteAccount,
    // changeEmail,
    // getUserEmail,
    getDetails as getUserInfo,
    changeDetails as editUserInfo,
    getUsers,
    addProfileVisit,
};
