import { removePostsByUser } from './posts';
import { deleteAccount } from './accounts';

const LS_ACCOUNTS = 'users';

/**
 * Gets the details for all of the accounts in localStorage.
 * @return {object} An object
 */
const getAllDetails = () => {
    return JSON.parse(localStorage.getItem(LS_ACCOUNTS));
};

/**
 * Gets the details for a specified user.
 * @param {string} email - The user to get the information of
 * @return {object} The details of the user
 */
const getDetails = (email) => {
    let details = getAllDetails();

    return details.find((e) => e.email === email);
};

/**
 * Creates some basic information for a new user.
 * @param {string} email - The user to create the information for.
 */
const setDefaultDetails = (email) => {
    let allDetails = getAllDetails();
    let accountDetails = getDetails(email);
    let index = allDetails.findIndex((e) => e.email === accountDetails.email);
    allDetails[index] = {
        ...accountDetails,
        time: new Date(),
        bio: '',
        avatar: '',
    };
    setDetails(allDetails);
};

/**
 * Sets the details for all users in localStorage.
 * @param {object} details - The details to replace the current localStorage details with
 */
const setDetails = (details) => {
    localStorage.removeItem(LS_ACCOUNTS);
    localStorage.setItem(LS_ACCOUNTS, JSON.stringify(details));
};

/**
 * Changes the information for that user in localStorage.
 * @param {object} details - The details for the user having their details changed.
 */
const changeDetails = (details) => {
    let d = getAllDetails();

    // Removes unnecessary field from the object
    // delete details.email;
    d[details.email] = details;
    setDetails(d);
};

/**
 * Deletes the account and all information associated with the user from localStorage.
 * @param {string} email - The user to remove from localStorage
 */
const deleteAccountDetails = (email) => {
    let accountDetails = getAllDetails();
    delete accountDetails[email];

    // Remove all of the information for the user in accounts
    deleteAccount(email);
    removePostsByUser(email);

    setDetails(accountDetails);
};

export { getDetails, setDefaultDetails, changeDetails, deleteAccountDetails };
