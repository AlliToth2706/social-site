import {
    Box,
    Button,
    ButtonGroup,
    FormControl,
    FormErrorMessage,
    Input,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import { useState, useContext } from 'react';
import { imageRegex, longToastTime } from '../App';
import { editPost, getAllPosts, removePost } from '../Data/posts';
import Alert from './Alert';
import { maxPostLength } from '../App';
import Quill from './Quill';
import { PostContext } from '../Pages/Forum';
import { checkValidPost } from './NewPostForm';

/**
 * Form for the user to edit their posts.
 */
const EditPostDialog = ({ original_post, id, setEditing }) => {
    const { setPosts } = useContext(PostContext);

    const toast = useToast();
    const [isInvalid, setIsInvalid] = useState(false);
    const [post, setPost] = useState({ text: original_post.text, image_url: original_post.image_url });
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [isValidLink, setValidLink] = useState(null);

    // const [file, setFile] = useState();

    const closeAndSync = () => {
        setEditing(false);
        setPosts(getAllPosts());
    };

    const handleChange = (e) => {
        e.preventDefault();
        // if (e.target.name === 'image_file') {
        //     setFile(e.target.files[0]);
        // } else {
        let tmp = { ...post };
        tmp[e.target.name] = e.target.value;

        if (e.target.name === 'image_url') {
            setValidLink(e.target.value !== '' ? imageRegex.test(e.target.value) : null);
        }

        setPost(tmp);
        // }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!checkValidPost(post.text, isInvalid, toast)) return;

        // if (file != null) {
        //     const uploaded = await upload(file);
        //     setPost({ ...post, image_url: uploaded });
        // } else if (isValidLink === false) {
        //     toast({
        //         title: 'Avatar URL not valid.',
        //         status: 'error',
        //         duration: shortToastTime,
        //         isClosable: true,
        //     });
        //     return;
        // }

        // Makes a new post with the information given
        // console.log(post);
        editPost({ ...original_post, ...post }, id);
        closeAndSync();

        // Lets the user know their action was successful
        toast({
            title: 'The post has been successfully edited.',
            status: 'success',
            duration: longToastTime,
            isClosable: true,
        });

        // Closes the modal
        setEditing(false);
    };

    const handleQuillChange = (inputText, failing) => {
        setPost({ ...post, text: inputText });
        setIsInvalid(failing);
    };

    return (
        <>
            <Alert
                heading="Delete Post?"
                onClick={() => {
                    removePost(original_post.post_id);
                    closeAndSync();
                    onClose();
                }}
                isOpen={isOpen}
                onClose={onClose}
            />
            <Box as="form" onSubmit={handleSubmit} m="2rem 0">
                <FormControl isRequired={true} mb={2} isInvalid={post.text.length > maxPostLength}>
                    <Quill value={post.text} textCallback={handleQuillChange} container="edit-post" />
                    <FormErrorMessage>The post must be {maxPostLength} characters at max.</FormErrorMessage>
                </FormControl>

                {/* <Tabs>
                    <TabList>
                        <Tab>Upload image</Tab>
                        <Tab>Use image link</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <input
                                type="file"
                                multiple={false}
                                accept="image/*"
                                name="image_file"
                                onChange={handleChange}
                            />
                        </TabPanel>
                        <TabPanel>
                            <FormControl mb={2} isInvalid={isValidLink == null ? false : !isValidLink}>
                                <Input
                                    type="url"
                                    name="image_url"
                                    value={post.image_url ?? ''}
                                    placeholder="Add an Image link"
                                    onChange={handleChange}
                                />
                            </FormControl>
                        </TabPanel>
                    </TabPanels>
                </Tabs> */}

                <FormControl mb={2} isInvalid={isValidLink == null ? false : !isValidLink}>
                    <Input
                        type="url"
                        name="image_url"
                        value={post.image_url ?? ''}
                        placeholder="Add an Image link"
                        onChange={handleChange}
                    />
                </FormControl>

                <ButtonGroup gap={2}>
                    {original_post.text === post.text && original_post.image_url === post.image_url ? (
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

export default EditPostDialog;
