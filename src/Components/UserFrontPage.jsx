import { Box, Flex, Heading, Text } from '@chakra-ui/react';

import { UserContext } from '../App';
import React, { useContext } from 'react';
import { getUserInfo } from '../Data/accounts';
import { useEffect } from 'react';
import { useState } from 'react';
import { isFollowing, getNotFollowing } from '../Data/following';
import FollowButton from './FollowButton';
import AvatarButton from './AvatarButton';
import Loading from './Loading';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

const responsive = {
    0: { items: 2, itemsFit: undefined },
    768: { items: 3, itemsFit: undefined },
    1024: { items: 4, itemsFit: undefined },
};

//This is the front page for a logged in user
const UserFrontPage = () => {
    const User = useContext(UserContext);
    const [user, setUser] = useState(null);
    const [notFollowed, setNotFollowed] = useState(null);
    useEffect(() => {
        setUser(getUserInfo(User));
        setNotFollowed(getNotFollowing(User));
    }, [User]);
    return (
        <Flex align="center" direction="column" mt="6" w="full">
            {user != null && (
                <Heading size="md">
                    Welcome, {user.first_name} {user.last_name}!
                </Heading>
            )}

            <Box mt="6rem" mb="2rem">
                {notFollowed?.length === 0 ? (
                    <Text as="i" size="lg">
                        We were going to suggest some new people to follow, but you're following everyone.
                    </Text>
                ) : (
                    <Heading size="lg">Find new people on the site:</Heading>
                )}
            </Box>
            <Flex direction="row" w="100%">
                <Loading bool={notFollowed}>
                    <Box w="100%">
                        <AliceCarousel
                            items={notFollowed?.map((u, i) => (
                                <React.Fragment key={i}>
                                    <UserElement user={u} />
                                </React.Fragment>
                            ))}
                            responsive={responsive}
                            mouseTracking
                            disableDotsControls
                            // autoWidth
                        />
                    </Box>
                </Loading>
            </Flex>
        </Flex>
    );
};

//Small user profile, to prompt users to follow
const UserElement = ({ user }) => {
    const User = useContext(UserContext);
    const [isFollowed, setIsFollowed] = useState(null);

    useEffect(() => {
        // if (isFollowed == null) isFollowing(User, user.email).then((e) => setIsFollowed(e));
        if (isFollowed == null) setIsFollowed(isFollowing(User, user.email));
    }, [isFollowed, User, user.email]);

    return (
        <Flex borderWidth="1px" borderRadius="lg" maxW={80} direction="row" padding="1rem" margin="0 1rem">
            <AvatarButton user={user} size="lg" margin="0 10px" />
            <Flex direction="column" padding="0 2rem">
                <Text fontSize="lg" align="center">
                    {user.first_name} {user.last_name}
                </Text>
                <FollowButton from_user={User} to_user={user.email} state={isFollowed} setState={setIsFollowed} />
            </Flex>
        </Flex>
    );
};

export default UserFrontPage;
