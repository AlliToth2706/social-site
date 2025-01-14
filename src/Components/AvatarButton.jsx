import { Avatar } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

/**
 * Component to have an avatar with navigation to the user's profile
 */
const AvatarButton = ({ user, size = 'md', margin = '0' }) => {
    let navigate = useNavigate();
    return (
        <Avatar
            name={`${user.first_name} ${user.last_name}`}
            src={user.avatar}
            size={size}
            margin={margin}
            onClick={() => navigate(`/profile/${user.email}`)}
            sx={{ cursor: 'pointer' }}
        />
    );
};

export default AvatarButton;
