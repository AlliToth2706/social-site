import {
    createComment,
    createReply,
    editComment,
    editReply,
    getAllPosts,
    removeComment,
    removeReply,
} from '../Data/posts';
import { Box, Button, ButtonGroup, Flex, FormControl, Spacer, Text, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { textFilter, UserContext } from '../App';
import Alert from '../Components/Alert';
import ReactionBar from './ReactionBar';
import AvatarButton from './AvatarButton';
import Quill from './Quill';
import { PostContext } from '../App';
import { getDetails } from '../Data/account-details';
import { checkValidPost } from './NewPostForm';

/**
 * The form for users to add comments to posts.
 */
const CommentForm = ({ parent_id, comment_id = null, type = 'comment', setIsReplying = () => {} }) => {
    const User = useContext(UserContext);
    const { setPosts } = useContext(PostContext);

    const [isInvalid, setIsInvalid] = useState(true);
    const toast = useToast();

    // Makes an array with the length of posts to hold the comments
    const [newComment, setNewComment] = useState('');

    const handleQuillChange = (inputText, failing) => {
        setNewComment(inputText);
        setIsInvalid(failing);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!checkValidPost(newComment, isInvalid, toast)) return;

        if (type === 'reply') {
            // Adds comment to the array
            createReply(parent_id, comment_id, { email: User, comment: newComment });

            // Hides the reply box on submit
            setIsReplying(false);
        } else
            createComment(parent_id, {
                email: User,
                comment: newComment,
                replies: [],
            });

        // Resets comment
        setNewComment('');

        setIsReplying(false);

        setPosts(getAllPosts());
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

/**
 * The form for users to edit their comments.
 */
const EditComment = ({ og_comment, is_reply, post_id, comment_id, reply_id, set_editing }) => {
    const { setPosts } = useContext(PostContext);

    const [comment, setComment] = useState(og_comment.comment);

    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isInvalid, setIsInvalid] = useState(false);

    const handleQuillChange = (inputText, failing) => {
        setComment(inputText);
        setIsInvalid(failing);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!checkValidPost(comment, isInvalid, toast)) return;

        // Edits the post
        is_reply
            ? editReply(post_id, comment_id, reply_id, { comment: comment })
            : editComment(post_id, comment_id, {
                  comment: comment,
              });

        // Resets comment
        setComment('');

        // Re-grabs the posts from localStorage
        setPosts(getAllPosts());

        set_editing(false);
    };

    return (
        <>
            <Alert
                heading="Delete Comment?"
                onClick={() => {
                    is_reply ? removeReply(post_id, comment_id, reply_id) : removeComment(post_id, comment_id);
                    set_editing(false);
                    setPosts(getAllPosts());
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
                    {comment === og_comment.comment ? (
                        <Button onClick={() => set_editing(false)}>Cancel</Button>
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
const Comment = ({ comment, is_reply = false, post_id, comment_id, reply_id = null }) => {
    const User = useContext(UserContext);
    const { setPosts } = useContext(PostContext);
    let commenter = getDetails(comment.email);
    comment.comment = textFilter.clean(comment.comment);
    commenter.fullname = `${commenter.first_name} ${commenter.last_name}`;
    const [isEditing, set_editing] = useState(false);
    const [isReplying, setIsReplying] = useState(false);

    const editReactionInfo = (reaction) => {
        is_reply
            ? editReply(post_id, comment_id, reply_id, { reactions: reaction })
            : editComment(post_id, comment_id, {
                  reactions: reaction,
              });
        setPosts(getAllPosts());
    };

    return (
        <>
            <Flex
                direction="row"
                align="start"
                p={4}
                pl={is_reply ? 8 : 4}
                borderLeft={is_reply && '1px solid grey'}
                ml={is_reply ? 6 : null}
                minH="96px"
            >
                <Flex direction="column">
                    <AvatarButton user={commenter} />
                    {comment.email === User && (
                        <Button
                            size="sm"
                            onClick={() => {
                                set_editing(true);
                            }}
                            mt={2}
                        >
                            Edit
                        </Button>
                    )}
                    {!is_reply && (
                        <Button size="sm" className="material-icons" mt={2} onClick={() => setIsReplying(true)}>
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
                                    og_comment={comment}
                                    is_reply={is_reply}
                                    post_id={post_id}
                                    comment_id={comment_id}
                                    reply_id={reply_id}
                                    set_editing={set_editing}
                                />
                            ) : (
                                <Text ml={4} dangerouslySetInnerHTML={{ __html: comment.comment || comment.reply }} />
                            )}
                        </Flex>
                        <Spacer />
                        <ReactionBar user={User} post={comment} editInfo={editReactionInfo} />
                    </Flex>

                    {isReplying && (
                        <Flex justify="end" w="full" ml="auto">
                            <CommentForm
                                parent_id={post_id}
                                comment_id={comment_id}
                                setIsReplying={setIsReplying}
                                type="reply"
                            />
                        </Flex>
                    )}
                </Flex>
            </Flex>
        </>
    );
};

export default Comment;
export { CommentForm };
