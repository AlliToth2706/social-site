import { Flex, Spacer, ButtonGroup, Button, Text, Box, Image } from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { textFilter, UserContext } from '../App';
import AvatarButton from './AvatarButton';
import Comment, { CommentForm } from './Comments';
import EditPostDialog from './EditPostDialog';
import ReactionBar from './ReactionBar';
import { getUserInfo } from '../Data/accounts';
import { editPost, getAllPosts } from '../Data/posts';
import { PostContext } from '../App';

/**
 * Generates the posts on the forum, and handles the state for if it's being edited.
 */
const Post = ({ post, id }) => {
    const User = useContext(UserContext);
    const { setPosts } = useContext(PostContext);

    post.text = textFilter.clean(post.text);

    const commenter = getUserInfo(post.email);
    commenter.fullname = `${commenter.first_name} ${commenter.last_name}`;

    const [isEditing, setEditing] = useState(false);

    const editReactionInfo = (reaction) => {
        editPost({ ...post, reactions: reaction }, id);
        setPosts(getAllPosts());
    };

    return (
        <Flex direction="column" w="full" p="2rem 0">
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
                    <EditPostDialog original_post={post} id={id} setEditing={setEditing} />
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
                        alt={`Image from ${commenter.fullname}`}
                        maxH="275px"
                        objectFit="contain"
                        mb={6}
                        alignSelf="baseline"
                    ></Image>
                )}

                {/* reactions and comment form */}
                <Flex direction="row" align="center" justify="center" w="full">
                    <ReactionBar post={post} user={User} editInfo={editReactionInfo} />
                    <Spacer />
                    <CommentForm parent_id={id} />
                </Flex>
            </>

            {/* Comments */}
            {post?.comments?.map((comment, c_id) => {
                return (
                    <Flex key={c_id} direction="column">
                        <Comment comment={comment} post_id={id} comment_id={c_id} />
                        <Box pl={4}>
                            {comment?.replies?.map((reply, r_id) => {
                                return (
                                    <React.Fragment key={r_id}>
                                        <Comment
                                            comment={reply}
                                            is_reply={true}
                                            post_id={id}
                                            comment_id={c_id}
                                            reply_id={r_id}
                                        />
                                    </React.Fragment>
                                );
                            })}
                        </Box>
                    </Flex>
                );
            })}
        </Flex>
    );
};

export default Post;
