import {
    useToast,
    Accordion,
    AccordionItem,
    AccordionButton,
    Heading,
    Spacer,
    AccordionIcon,
    AccordionPanel,
    Flex,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Button,
    Text,
} from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { imageRegex, UserContext, longToastTime, shortToastTime, maxPostLength } from '../App';
import { createPost, getAllPosts } from '../Data/posts';
import Quill from './Quill';
import { PostContext } from '../App';

/**
 * Check if the post's text is valid
 */
export const checkValidPost = (text, isInvalid, toast) => {
    if (text.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
        toast({
            title: `Please enter some text`,
            status: 'error',
            duration: shortToastTime,
            isClosable: true,
        });
        return false;
    }

    if (isInvalid) {
        toast({
            title: `The post is too large. Please keep to ${maxPostLength} characters.`,
            status: 'error',
            duration: shortToastTime,
            isClosable: true,
        });
        return false;
    }
    return true;
};

/**
 * Form to create a new post from user input.
 * Comment creation done elsewhere
 */
const NewPostForm = () => {
    const User = useContext(UserContext);
    const { setPosts } = useContext(PostContext);

    const FORM_TYPE = 'Post';

    const toast = useToast();

    const [postText, setPostText] = useState('');
    const [isInvalid, setIsInvalid] = useState(true);

    const [url, setURL] = useState('');
    const [isValidLink, setValidLink] = useState(null);

    const clearPost = () => {
        setPostText('');
        setIsInvalid(true);
        setURL('');
        setValidLink(null);
    };

    // The text is now sanitised in the Quill component
    const handleQuillChange = (inputText, isFailing) => {
        setPostText(inputText);
        setIsInvalid(isFailing);
    };

    // Changes the values passed through whenever there is a change
    // to be used in the passed handleSubmit function
    const handleChange = (e) => {
        if (e.target.name === 'text') setPostText(e.target.value);
        if (e.target.name === 'image_url') {
            if (e.target.value === '') {
                setValidLink(null);
                e.target.value = '';
            } else setValidLink(imageRegex.test(e.target.value));
            setURL(e.target.value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!checkValidPost(postText, isInvalid, toast)) return;

        if (isValidLink === false) {
            toast({
                title: 'Image URL not valid.',
                status: 'error',
                duration: shortToastTime,
                isClosable: true,
            });
            return;
        }

        // Makes a new post with the information given
        createPost({ text: postText, image_url: url, email: User });
        setPosts(getAllPosts());

        // Sets the new post back to blank
        clearPost();

        // Lets the user know their action was successful
        toast({
            title: `New ${FORM_TYPE} created.`,
            status: 'success',
            duration: longToastTime,
            isClosable: true,
        });
    };

    return (
        <Accordion allowToggle w="50%">
            <AccordionItem>
                <AccordionButton>
                    <Heading textAlign="center" size="md">
                        New {FORM_TYPE}
                    </Heading>
                    <Spacer />
                    <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                    <Flex as="form" align="center" justify="center" direction="column" w="full" onSubmit={handleSubmit}>
                        <FormControl isRequired={true} mb={2} isInvalid={postText.length > maxPostLength}>
                            <FormLabel>Body</FormLabel>
                            <Quill value={postText} textCallback={handleQuillChange} container="new-post" />
                            <FormErrorMessage>The post must be {maxPostLength} characters at max.</FormErrorMessage>
                        </FormControl>
                        <Text as="i" mt={2} mb={4} w="100%" alignSelf="baseline" fontSize="sm">
                            Hint: Select text to format it
                        </Text>

                        <FormControl mb={2} isInvalid={isValidLink == null ? false : !isValidLink}>
                            <FormLabel>Image</FormLabel>
                            <Input
                                type="url"
                                name="image_url"
                                placeholder="Add an image"
                                value={url}
                                onChange={handleChange}
                            />
                            <FormErrorMessage>
                                URL provided does not point to an image, or is not a URL.
                            </FormErrorMessage>
                        </FormControl>

                        <Flex direction="row" w="full" mt={4}>
                            <Button type="submit">{FORM_TYPE}</Button>
                            <Spacer />
                            <Button onClick={() => clearPost()}>Clear</Button>
                        </Flex>
                    </Flex>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
};

export default NewPostForm;
