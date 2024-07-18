import { Flex, Heading } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { getAllPosts } from '../Data/posts';
import Loading from './Loading';
import Post from './Post';
import { PostContext } from '../App';

//Shows all posts by a user
const UserPosts = ({ user }) => {
    const [posts, setPosts] = useState(null);

    useEffect(() => {
        let p = getAllPosts();
        // Get all posts that were created by the user
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
    }, [user]);

    return (
        <Loading bool={posts}>
            {posts?.length !== 0 ? (
                <Heading size="lg">
                    Posts by {user.first_name} {user.last_name}
                </Heading>
            ) : null}
            {posts?.map((e, i) => {
                return (
                    <Flex key={i} w="50%">
                        <PostContext.Provider value={{ posts, setPosts }}>
                            <Post post={e} id={i} />
                        </PostContext.Provider>
                    </Flex>
                );
            })}
        </Loading>
    );
};

export default UserPosts;
