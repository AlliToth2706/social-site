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
    Tab,
    TabList,
    Tabs,
    TabPanels,
    TabPanel,
    Text,
} from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { imageRegex, UserContext, longToastTime, shortToastTime, maxPostLength } from '../App';
import { createPost, upload } from '../Data/posts';
import Quill from './Quill';

/**
 * Form to create a new post from user input.
 * Comment creation done elsewhere
 */
const NewPostForm = ({ syncCurrentPosts }) => {
    const User = useContext(UserContext);
    const postText = 'Post';
    const blankPost = {
        email: User,
        text: '',
        image_url: '',
    };
    const [file, setFile] = useState();
    const [newPost, setNewPost] = useState(blankPost);
    const toast = useToast();
    const [isValidLink, setValidLink] = useState(null);
    const [isInvalid, setIsInvalid] = useState(true);

    // The text is now sanitised in the Quill component
    const handleQuillChange = (inputText, isFailing) => {
        setNewPost({ ...newPost, text: inputText });
        setIsInvalid(isFailing);
    };

    // Changes the values passed through whenever there is a change
    // to be used in the passed handleSubmit function
    const handleChange = (e) => {
        if (e.target.name === 'image_file') {
            setFile(e.target.files[0]);
        } else {
            const tmp = { ...newPost };
            tmp[e.target.name] = e.target.value;
            if (e.target.name === 'image_url') {
                setValidLink(e.target.value !== '' && imageRegex.test(e.target.value));
            }

            setNewPost(tmp);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isInvalid) {
            toast({
                title: 'Post is not valid.',
                status: 'error',
                duration: shortToastTime,
                isClosable: true,
            });
            return;
        }

        if (file != null) {
            const uploaded = await upload(file);

            if (typeof uploaded !== 'string') {
                toast({
                    title: 'Image upload failed.',
                    description: 'Try using a link, or try again later',
                    status: 'error',
                    duration: shortToastTime,
                    isClosable: true,
                });

                return;
            }

            // Makes a new post with the information given
            createPost({ ...newPost, image_url: uploaded }, syncCurrentPosts);

            // Sets the new post back to blank
            setNewPost(blankPost);

            // Lets the user know their action was successful
            toast({
                title: `New ${postText} created.`,
                status: 'success',
                duration: longToastTime,
                isClosable: true,
            });
        } else {
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
            createPost({ ...newPost }, syncCurrentPosts);

            // Sets the new post back to blank
            setNewPost(blankPost);

            // Lets the user know their action was successful
            toast({
                title: `New ${postText} created.`,
                status: 'success',
                duration: longToastTime,
                isClosable: true,
            });
        }
    };

    return (
        <Accordion allowToggle minW='50%'>
            <AccordionItem>
                <AccordionButton>
                    <Heading textAlign='center' size='md'>
                        New {postText}
                    </Heading>
                    <Spacer />
                    <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                    <Flex as='form' align='center' justify='center' direction='column' w='full' onSubmit={handleSubmit}>
                        <FormControl isRequired={true} mb={2} isInvalid={newPost.text.length > maxPostLength}>
                            <FormLabel>Body</FormLabel>
                            <Quill value={newPost.text} textCallback={handleQuillChange} container='new-post' />
                            <FormErrorMessage>The post must be {maxPostLength} characters at max.</FormErrorMessage>
                        </FormControl>
                        <Text as='i' mt={2} mb={4} w='100%' alignSelf='baseline' fontSize='sm'>
                            Hint: Select text to format it
                        </Text>
                        <Tabs w='100%'>
                            <TabList>
                                <Tab>Upload image</Tab>
                                <Tab>Use image link</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <input
                                        type='file'
                                        multiple={false}
                                        accept='image/*'
                                        name='image_file'
                                        onChange={handleChange}
                                    />
                                </TabPanel>
                                <TabPanel>
                                    <FormControl mb={2} isInvalid={isValidLink == null ? false : !isValidLink}>
                                        <FormLabel>Image</FormLabel>
                                        <Input
                                            type='url'
                                            name='image_url'
                                            placeholder='Add an image'
                                            value={newPost.image_url}
                                            onChange={handleChange}
                                        />
                                        <FormErrorMessage>
                                            URL provided does not point to an image, or is not a URL.
                                        </FormErrorMessage>
                                    </FormControl>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>

                        <Flex direction='row' w='full' mt={4}>
                            <Button type='submit'>{postText}</Button>
                            <Spacer />
                            <Button onClick={() => setNewPost(blankPost)}>Clear</Button>
                        </Flex>
                    </Flex>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
};

export default NewPostForm;
