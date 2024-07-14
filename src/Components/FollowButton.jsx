import { Button } from '@chakra-ui/react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { addFollow, removeFollow } from '../Data/following';

/**
 * Button to be able to follow and unfollow users
 * Used mainly to keep state of if the user has been followed or not
 */
const FollowButton = ({ from_user, to_user, size, state, setState }) => {
    const hasRendered = useRef(false);
    useEffect(() => {
        // Makes sure that if state is set to a number, to not send any API requests
        hasRendered.current
            ? state === true
                ? // Add follow relation in database
                  addFollow(from_user, to_user)
                : // Remove follow relation in the database
                  state === false && removeFollow(from_user, to_user)
            : (hasRendered.current = true);
    }, [state, from_user, to_user]);
    return (
        <Button size={size} onClick={() => setState(!state)} w={size === 'sm' ? 20 : 24} isLoading={state == null}>
            {state ? 'Unfollow' : 'Follow'}
        </Button>
    );
};

FollowButton.defaultProps = {
    size: 'sm',
};

export default FollowButton;
