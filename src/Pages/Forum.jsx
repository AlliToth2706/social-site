import { Divider, Flex, Heading, Spacer } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import Loading from '../Components/Loading';
import NewPostForm from '../Components/NewPostForm';
import Post from '../Components/Post';
import { getAllPosts } from '../Data/posts';

/**
 * Forum component. Handles generic posts state and holds all sub-components.
 */
const Forum = () => {
    // Allows for the displayed posts to be updated easily
    const [posts, setPosts] = useState(null);

    useEffect(() => {
        syncCurrentPosts();
    }, []);

    const syncCurrentPosts = async () => {
        // getAllPosts().then((e) => {
        const currentPosts = getAllPosts();
        console.log(currentPosts);
        if (Array.isArray(currentPosts)) setPosts(currentPosts);
        // });
    };

    return (
        <>
            <Flex w="full" align="center" justify="center" direction="column" p="2rem 0">
                <NewPostForm syncCurrentPosts={syncCurrentPosts} />
                <Divider m="40px 0" />
                <Loading bool={posts}>
                    <Flex align="center" justify="center" direction="column" w="75%">
                        <Heading>Posts</Heading>
                        {posts?.map((post, i) => {
                            return (
                                <React.Fragment key={i}>
                                    <Post post={post} id={i} syncCurrentPosts={syncCurrentPosts} />
                                </React.Fragment>
                            );
                        })}
                    </Flex>
                </Loading>
            </Flex>
            <Spacer />
        </>
    );
};

export default Forum;
