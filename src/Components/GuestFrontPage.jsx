import { Button, Flex, Heading, Image, Spacer, Text, useColorMode } from '@chakra-ui/react';
import NewPostForm from './NewPostForm';

//The front page for users that are not logged in
const GuestFrontPage = ({ login, signup }) => {
    const { colorMode } = useColorMode();

    return (
        <>
            <Flex direction="row">
                <Button variant="link" onClick={login} margin="0 0.3rem">
                    Log in
                </Button>
                or
                <Button variant="link" onClick={signup} margin="0 0.3rem">
                    Sign up
                </Button>
                to get started!
            </Flex>

            <Spacer />
            <Flex justify="center" direction="row" w="100%" flex={1}>
                <Flex w="50%" direction="column" h="100%">
                    <Heading size="md" m="2rem 0">
                        What is this website?
                    </Heading>
                    <Text w="90%">
                        This is a way for you to communicate with your other people within our community. Many people
                        are already communicating using the forums, and even showing their flair and style by editing
                        their profiles.
                    </Text>
                </Flex>

                <Image src={`/social/${colorMode === 'light' ? 'light' : 'dark'}.png`} w="45%" />
            </Flex>
        </>
    );
};

export default GuestFrontPage;
