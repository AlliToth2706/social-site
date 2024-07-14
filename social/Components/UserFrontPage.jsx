import { Box, Flex, Heading, Text } from '@chakra-ui/react';

import { UserContext } from '../App';
import React, { useContext } from 'react';
import { getUserInfo } from '../Data/accounts';
import { useEffect } from 'react';
import { useState } from 'react';
import { getFollow, getNotFollowing } from '../Data/following';
import FollowButton from './FollowButton';
import AvatarButton from './AvatarButton';
import Loading from './Loading';

//This is the front page for a logged in user
const UserFrontPage = () => {
    const User = useContext(UserContext);
    const [user, setUser] = useState(null);
    const [notFollowed, setNotFollowed] = useState(null);
    useEffect(() => {
        // (async () => setUser(await getUserInfo(User)))();
        setUser(getUserInfo(User));
        // (async () => setNotFollowed(await getNotFollowing(User)))();
        setNotFollowed(getNotFollowing(User));
    }, [User]);
    return (
        <Flex align="center" direction="column" mt="6">
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
                    <Heading size="lg">Find new people on Now:</Heading>
                )}
            </Box>

            <Flex direction="row">
                <Loading bool={notFollowed}>
                    {notFollowed?.map((u, i) => (
                        <React.Fragment key={i}>
                            <UserElement user={u} />
                        </React.Fragment>
                    ))}
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
        // if (isFollowed == null) getFollow(User, user.email).then((e) => setIsFollowed(e));
        if (isFollowed == null) setIsFollowed(getFollow(User, user.email));
    }, [isFollowed, User, user.email]);

    return (
        <Flex borderWidth="1px" borderRadius="lg" maxW={80} direction="row" padding="1rem" margin="0 1rem">
            <AvatarButton user={user} size="lg" margin="0 10px" />
            <Flex direction="column" padding="0 2rem">
                <Text wordBreak="break-all" fontSize="lg" align="center">
                    {user.first_name} {user.last_name}
                </Text>
                <FollowButton from_user={User} to_user={user.email} state={isFollowed} setState={setIsFollowed} />
            </Flex>
        </Flex>
    );
};

export default UserFrontPage;
