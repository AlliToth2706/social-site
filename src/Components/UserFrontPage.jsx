import { Box, Flex, Heading, Button, Text } from '@chakra-ui/react';
import { UserContext } from '../App';
import React, { useContext } from 'react';
import { getUserInfo } from '../Data/accounts';
import { useEffect } from 'react';
import { useState } from 'react';
import { isFollowing, getNotFollowing } from '../Data/following';
import FollowButton from './FollowButton';
import AvatarButton from './AvatarButton';
import Loading from './Loading';

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
        <Flex align="center" direction="column" mt="6" w="full" overflow="hidden">
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
            <Loading bool={notFollowed}>
                <Carousel elem={notFollowed} />
            </Loading>
        </Flex>
    );
};

const Carousel = ({ elem }) => {
    // max width: 64rem
    // element width: 16 + 2 rem
    const [current, setCurrent] = useState(0);
    const cssBase = 'chakra-sizes-';
    const getCSS = (property) => {
        const style = getComputedStyle(document.documentElement);
        const fontSize = parseInt(style.fontSize.slice(0, -2));
        const propertyValue = style.getPropertyValue(`--${property}`);
        if (propertyValue.endsWith('rem')) return parseInt(propertyValue.slice(0, -3)) * fontSize;
        if (propertyValue.endsWith('vw'))
            return (parseInt(propertyValue.slice(0, -2)) * document.documentElement.clientWidth) / 100;
        return propertyValue;
    };

    const maxSize = getCSS(cssBase + '8xl');
    const marginSize = getCSS(cssBase + '4');
    const elementSize = marginSize * 2 + getCSS(cssBase + '64');

    const displayedElements = Math.floor(maxSize / elementSize);
    const currentMax = Math.max(elem.length - displayedElements, 0);

    const handleClick = (arrow) => {
        if (arrow === 'l') {
            setCurrent(Math.max(current - 1, 0));
        } else if (arrow === 'r') {
            setCurrent(Math.min(current + 1, currentMax));
        }
    };

    return (
        <>
            <Flex
                direction="row"
                w="full"
                sx={{
                    transform: `translate(-${Math.min(elementSize * current, maxSize)}px)`,
                }}
            >
                {elem?.map((u, i) => (
                    <Flex key={i} align="center" justify="center" w="min-content" mx={4}>
                        <UserElement user={u} />
                    </Flex>
                ))}
            </Flex>
            <Flex
                direction="row"
                w="full"
                justify="center"
                align="center"
                mt={6}
                display={currentMax === 0 ? 'none' : 'flex'}
            >
                <Button
                    className="material-icons"
                    variant="unstyled"
                    h="initial"
                    minW="initial"
                    fontSize="4xl"
                    mr={2}
                    isDisabled={current === 0}
                    onClick={() => handleClick('l')}
                >
                    chevron_left
                </Button>
                <Button
                    className="material-icons"
                    variant="unstyled"
                    h="initial"
                    minW="initial"
                    fontSize="4xl"
                    isDisabled={current === currentMax}
                    onClick={() => handleClick('r')}
                >
                    chevron_right
                </Button>
            </Flex>
        </>
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
