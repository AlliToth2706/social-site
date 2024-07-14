import { Flex } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { getAllPosts } from '../Data/posts';
import Loading from './Loading';
import Post from './Post';

//Shows all posts by a user
const UserPosts = ({ user }) => {
    const [posts, setPosts] = useState(null);

    useEffect(() => {
        (async () => {
            let p = /*await*/ getAllPosts();
            p = p
                .map((e) => {
                    e.comments = e.comments
                        ?.map((f) => {
                            f.comments = f.comments?.filter((g) => g.email === user);
                            return f;
                        })
                        .filter((f) => f.email === user || f.comments.length > 0);

                    return e;
                })
                .filter((e) => e.email === user || e.comments.length > 0);
            setPosts(p);
        })();
    }, [user]);

    return (
        <Loading bool={posts}>
            {posts?.map((e, i) => {
                return (
                    <Flex key={i} w="50%">
                        <Post post={e} readOnly={true} />
                    </Flex>
                );
            })}
        </Loading>
    );
};

export default UserPosts;
