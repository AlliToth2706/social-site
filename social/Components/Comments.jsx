import { createPost, editPost, removePost } from '../Data/posts';
import { Box, Button, ButtonGroup, Flex, FormControl, Spacer, Text, useDisclosure } from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { textFilter, UserContext } from '../App';
import Alert from '../Components/Alert';
import ReactionBar from './ReactionBar';
import AvatarButton from './AvatarButton';
import Quill from './Quill';

// TODO: Probably change comments/posts to be based on A1

/**
 * The form for users to add comments to posts.
 */
const CommentForm = ({ parent_id, setIsReplying, syncCurrentPosts }) => {
    const User = useContext(UserContext);
    const [isInvalid, setIsInvalid] = useState(false);

    // Makes an array with the length of posts to hold the comments
    const [newComment, setNewComment] = useState('');

    const handleQuillChange = (inputText, failing) => {
        setNewComment(inputText);
        setIsInvalid(failing);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(newComment, isInvalid, parent_id);

        if (isInvalid) {
            return;
        }
        createPost({ email: User, text: newComment, parent_post_id: parent_id }, syncCurrentPosts);

        // Resets comment
        setNewComment('');

        setIsReplying(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Flex as={FormControl} direction="row" align="center" justify="center" isInvalid={isInvalid}>
                <Quill
                    value={newComment}
                    textCallback={handleQuillChange}
                    minW="15rem"
                    container={`comments-${parent_id}`}
                />
                <Button type="submit" ml={4} mw={0}>
                    Submit
                </Button>
            </Flex>
        </form>
    );
};

CommentForm.defaultProps = {
    parent_id: null,
    type: 'comment',
    setIsReplying: () => {},
};

/**
 * The form for users to edit their comments.
 */
const EditComment = ({ data, setEditing, syncCurrentPosts }) => {
    const [comment, setComment] = useState(data.text);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isInvalid, setIsInvalid] = useState(false);

    const handleQuillChange = (inputText, failing) => {
        setComment(inputText);
        setIsInvalid(failing);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isInvalid) {
            return;
        }

        // Edits the post
        editPost({ text: comment }, data.post_id, syncCurrentPosts);

        // Resets comment
        setComment('');

        // Re-grabs the posts from localStorage

        setEditing(false);
    };

    return (
        <>
            <Alert
                heading="Delete Comment?"
                onClick={() => {
                    removePost(data.post_id, syncCurrentPosts);
                    setEditing(false);
                    onClose();
                }}
                isOpen={isOpen}
                onClose={onClose}
            />
            <Box as="form" onSubmit={handleSubmit} ml={4} mt={2}>
                <FormControl isRequired={true} mb={2}>
                    <Quill value={comment} textCallback={handleQuillChange} container={`edit-comment`} />
                </FormControl>

                <ButtonGroup gap={2}>
                    {comment === data.text ? (
                        <Button onClick={() => setEditing(false)}>Cancel</Button>
                    ) : (
                        <Button type="submit">Submit</Button>
                    )}
                    <Button colorScheme="red" onClick={onOpen}>
                        Delete
                    </Button>
                </ButtonGroup>
            </Box>
        </>
    );
};

/**
 * Generates the comments on a post, and the replies on a post. Also handles editing state.
 */
const Comment = ({ data, isReply, syncCurrentPosts, readOnly }) => {
    const User = useContext(UserContext);
    const commenter = data.user;
    data.text = textFilter.clean(data.text);
    commenter.fullname = `${commenter.first_name} ${commenter.last_name}`;
    const [isEditing, setEditing] = useState(false);
    const [isReplying, setIsReplying] = useState(false);

    return (
        <>
            {data.deleted_by == null ? (
                <Flex
                    direction="row"
                    align="start"
                    p={4}
                    borderLeft={isReply && '1px solid grey'}
                    ml={isReply ? 10 : null}
                    minH="96px"
                >
                    <Flex direction="column">
                        <AvatarButton user={commenter} />
                        {data.email === User && (
                            <Button
                                size="sm"
                                onClick={() => {
                                    setEditing(true);
                                }}
                                mt={2}
                            >
                                Edit
                            </Button>
                        )}
                        {!isReply && (
                            <Button
                                size="sm"
                                className="material-icons"
                                onClick={() => setIsReplying(!isReplying)}
                                mt={2}
                            >
                                reply
                            </Button>
                        )}
                    </Flex>
                    <Flex direction="column" justify="center" w="full">
                        <Flex direction="row" mr={8}>
                            <Flex direction="column">
                                <Text fontSize="l" fontWeight="bold" className="name" ml={4}>
                                    {commenter.fullname}
                                </Text>
                                {isEditing ? (
                                    <EditComment
                                        data={data}
                                        isReply={isReply}
                                        setEditing={setEditing}
                                        syncCurrentPosts={syncCurrentPosts}
                                    />
                                ) : (
                                    <Text ml={4} dangerouslySetInnerHTML={{ __html: data.text }} />
                                )}
                            </Flex>
                            <Spacer />
                            <ReactionBar userEmail={User} postId={data.post_id} />
                        </Flex>

                        {isReplying && (
                            <Flex justify="end" w="full" ml="auto">
                                <CommentForm
                                    parent_id={data.post_id}
                                    setIsReplying={setIsReplying}
                                    type="reply"
                                    syncCurrentPosts={syncCurrentPosts}
                                />
                            </Flex>
                        )}
                    </Flex>
                </Flex>
            ) : (
                <Flex
                    align="center"
                    p={4}
                    borderLeft={isReply && '1px solid grey'}
                    ml={isReply ? 10 : null}
                    minH="96px"
                >
                    <Text as="i">This comment was deleted{data.deleted_by === 'Admin' && ' by an admin'}.</Text>
                </Flex>
            )}
            {data?.comments?.map((reply, i) => {
                return (
                    <React.Fragment key={i}>
                        <Comment data={reply} isReply={true} syncCurrentPosts={syncCurrentPosts} readOnly={readOnly} />
                    </React.Fragment>
                );
            })}
        </>
    );
};

Comment.defaultProps = {
    isReply: false,
    readOnly: false,
};

export default Comment;
export { CommentForm };
