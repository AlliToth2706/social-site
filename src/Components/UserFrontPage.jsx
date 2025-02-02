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
    0: { items: 100, itemsFit: 'fill' },
    // 992: { items: 2.5, itemsFit: 'fill' },
    // 1280: { items: 3.5, itemsFit: 'fill' },
    // 1536: { items: 4.5, itemsFit: 'fill' },
};

// This is the front page for a logged in user
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
            <Flex direction="row" w="full" overflow="hidden">
                <Loading bool={notFollowed}>
                    {notFollowed?.map((u, i) => (
                        <Flex key={i} align="center" justify="center" w="min-content" mx={4}>
                            <UserElement user={u} />
                        </Flex>
                    ))}
                </Loading>
            </Flex>
        </Flex>
    );
};

// Small user profile, to prompt users to follow
const UserElement = ({ user }) => {
    const User = useContext(UserContext);
    const [isFollowed, setIsFollowed] = useState(null);

    useEffect(() => {
        if (isFollowed == null) setIsFollowed(isFollowing(User, user.email));
    }, [isFollowed, User, user.email]);

    return (
        <Flex borderWidth="1px" borderRadius="lg" w={64} direction="row" padding="1rem">
            <AvatarButton user={user} size="lg" />
            <Flex direction="column" overflow="hidden" w="full">
                {/* TODO: fix this for overflow, and to make extras show */}
                <Text
                    fontSize="lg"
                    align="center"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    pb={2}
                    w="full"
                    px={2}
                >
                    {user.first_name} {user.last_name}
                </Text>
                <Flex w="full" justify="center">
                    <FollowButton
                        from_user={User}
                        to_user={user.email}
                        state={isFollowed}
                        setState={setIsFollowed}
                        w="full"
                    />
                </Flex>
            </Flex>
        </Flex>
    );
};

export default UserFrontPage;
