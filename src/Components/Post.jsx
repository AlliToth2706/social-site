import { Flex, Spacer, ButtonGroup, Button, Text, Box, Image } from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { textFilter, UserContext } from '../App';
import AvatarButton from './AvatarButton';
import Comment, { CommentForm } from './Comments';
import EditPostDialog from './EditPostDialog';
import ReactionBar from './ReactionBar';
import { getUserInfo } from '../Data/accounts';

/**
 * Generates the posts on the forum, and handles the state for if it's being edited.
 */
const Post = ({ post, id, syncCurrentPosts, readOnly }) => {
    const User = useContext(UserContext);

    post.text = textFilter.clean(post.text);

    const commenter = getUserInfo(post.email);
    commenter.fullname = `${commenter.first_name} ${commenter.last_name}`;

    const [isEditing, setEditing] = useState(false);

    return (
        <Flex direction="column" w="full" p="2rem 0">
            {post.deleted_by == null ? (
                <>
                    <Flex direction="row" align="center" justify="center" w="full">
                        <AvatarButton user={commenter} size="lg" />
                        <Text fontSize="xl" fontWeight="bold" className="name" ml={4}>
                            {commenter.fullname}
                        </Text>
                        <Spacer />
                        <Flex align="end" direction="column">
                            <Text>{new Date(post.timestamp).toLocaleString()}</Text>
                            {/* Allow for editing if you own the post */}
                            {commenter.email === User && (
                                <>
                                    <Spacer />
                                    <ButtonGroup gap="2">
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                setEditing(!isEditing);
                                            }}
                                        >
                                            Edit
                                        </Button>
                                    </ButtonGroup>
                                </>
                            )}
                        </Flex>
                    </Flex>

                    {/* Post contents */}
                    {isEditing ? (
                        <EditPostDialog data={post} setEditing={setEditing} syncCurrentPosts={syncCurrentPosts} />
                    ) : (
                        <Box
                            className="text"
                            mt={8}
                            mb={4}
                            textAlign="left"
                            w="full"
                            dangerouslySetInnerHTML={{ __html: post.text }}
                        />
                    )}
                    {post.image_url && (
                        <Image
                            src={post.image_url}
                            alt={post.image_url}
                            maxH="275px"
                            objectFit="contain"
                            mb={6}
                            alignSelf="baseline"
                        ></Image>
                    )}

                    {/* reactions and comment form */}
                    <Flex direction="row" align="center" justify="center" w="full">
                        <ReactionBar userEmail={User} postId={id} />
                        <Spacer />
                        <CommentForm parent_id={id} syncCurrentPosts={syncCurrentPosts} />
                    </Flex>
                </>
            ) : (
                <Text as="i">This post was deleted{post.deleted_by === 'Admin' && ' by an admin'}.</Text>
            )}

            {/* Comments */}
            {post?.comments?.map((comment, i) => {
                return (
                    <React.Fragment key={i}>
                        <Comment data={comment} syncCurrentPosts={syncCurrentPosts} readOnly={readOnly} />
                    </React.Fragment>
                );
            })}
        </Flex>
    );
};

Post.defaultProps = {
    readOnly: false,
    syncCurrentPosts: () => {},
};

export default Post;
