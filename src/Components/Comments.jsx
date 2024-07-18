import { addComment, addReply, editComment, editReply, getAllPosts, removeComment, removeReply } from '../Data/posts';
import { Box, Button, ButtonGroup, Flex, FormControl, Spacer, Text, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { textFilter, UserContext } from '../App';
import Alert from '../Components/Alert';
import ReactionBar from './ReactionBar';
import AvatarButton from './AvatarButton';
import Quill from './Quill';
import { PostContext } from '../Pages/Forum';
import { getDetails } from '../Data/account-details';
import { checkValidPost } from './NewPostForm';

/**
 * The form for users to add comments to posts.
 */
const CommentForm = ({ parent_id, comment_id = null, type = 'comment', setIsReplying = () => {} }) => {
    // const CommentForm = ({ parent_id, setIsReplying, syncCurrentPosts }) => {
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
            addReply(parent_id, comment_id, { email: User, comment: newComment });

            // Hides the reply box on submit
            setIsReplying(false);
        } else
            addComment(parent_id, {
                email: User,
                comment: newComment,
                replies: [],
            });

        // createPost({ email: User, text: newComment, parent_post_id: parent_id }, syncCurrentPosts);

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
// const EditComment = ({ data, setEditing, syncCurrentPosts }) => {
const EditComment = ({ originalComment, isReply, post_id, comment_id, reply_id, setEditing }) => {
    const { setPosts } = useContext(PostContext);

    const [comment, setComment] = useState(originalComment.comment);

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
        // editPost({ text: comment }, data.post_id);
        isReply
            ? editReply(post_id, comment_id, reply_id, { comment: comment })
            : editComment(post_id, comment_id, {
                  comment: comment,
              });

        // Resets comment
        setComment('');

        // Re-grabs the posts from localStorage
        setPosts(getAllPosts());

        setEditing(false);
    };

    return (
        <>
            <Alert
                heading="Delete Comment?"
                onClick={() => {
                    isReply ? removeReply(post_id, comment_id, reply_id) : removeComment(post_id, comment_id);
                    setEditing(false);
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
                    {comment === originalComment.comment ? (
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
const Comment = ({ comment, isReply = false, post_id, comment_id, reply_id = null }) => {
    const User = useContext(UserContext);
    const { setPosts } = useContext(PostContext);
    let commenter = getDetails(comment.email);
    comment.comment = textFilter.clean(comment.comment);
    commenter.fullname = `${commenter.first_name} ${commenter.last_name}`;
    const [isEditing, setEditing] = useState(false);
    const [isReplying, setIsReplying] = useState(false);

    const editReactionInfo = (reaction) => {
        isReply
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
                pl={isReply ? 8 : 4}
                borderLeft={isReply && '1px solid grey'}
                ml={isReply ? 6 : null}
                minH="96px"
            >
                <Flex direction="column">
                    <AvatarButton user={commenter} />
                    {comment.email === User && (
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
                                    originalComment={comment}
                                    isReply={isReply}
                                    post_id={post_id}
                                    comment_id={comment_id}
                                    reply_id={reply_id}
                                    setEditing={setEditing}
                                />
                            ) : (
                                <Text ml={4} dangerouslySetInnerHTML={{ __html: comment.comment || comment.reply }} />
                            )}
                        </Flex>
                        <Spacer />
                        <ReactionBar user={User} post={comment} editInfo={(reaction) => editReactionInfo(reaction)} />
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
