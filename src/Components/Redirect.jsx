import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Small component to have anything that isn't specified route to the home page
// This is done for two reasons:
//  1. Makes sure people don't try and go to random pages
//  2. People can't access logged-in only pages when logged out

/**
 * Sends all unknown routes to the home page.
 */
const Redirect = ({ to }) => {
    let navigate = useNavigate();

    useEffect(() => {
        navigate(to);
    });
};

Redirect.defaultProps = {
    to: '/',
};

export default Redirect;
