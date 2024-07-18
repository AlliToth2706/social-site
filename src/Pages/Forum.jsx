import { Divider, Flex, Heading, Spacer } from '@chakra-ui/react';
import React, { useState, createContext, useEffect } from 'react';
import Loading from '../Components/Loading';
import NewPostForm from '../Components/NewPostForm';
import Post from '../Components/Post';
import { getAllPosts } from '../Data/posts';

export const PostContext = createContext();

/**
 * Forum component. Handles generic posts state and holds all sub-components.
 */
const Forum = () => {
    // Allows for the displayed posts to be updated easily
    const [posts, setPosts] = useState(getAllPosts());

    return (
        <>
            <Flex w="full" align="center" justify="center" direction="column" p="2rem 0">
                <PostContext.Provider value={{ posts, setPosts }}>
                    <NewPostForm />
                    <Divider m="40px 0" />
                    <Loading bool={posts}>
                        <Flex align="center" justify="center" direction="column" w="75%">
                            <Heading>Posts</Heading>
                            {posts?.map((post, id) => {
                                return (
                                    <React.Fragment key={id}>
                                        <Post post={post} id={id} />
                                    </React.Fragment>
                                );
                            })}
                        </Flex>
                    </Loading>
                </PostContext.Provider>
            </Flex>
            <Spacer />
        </>
    );
};

export default Forum;
