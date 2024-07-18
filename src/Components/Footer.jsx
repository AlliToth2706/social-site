import { Button, Flex, Spacer, Text, useColorMode } from '@chakra-ui/react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';

/**
 * The bottom area of the pages.
 */
const Footer = ({ login, signup }) => {
    const User = useContext(UserContext);
    const { colorMode } = useColorMode();
    return (
        <Flex as="footer" bg={colorMode === 'light' ? 'gray.400' : 'gray.500'} p={2} w="100%">
            <Spacer />
            <Flex direction="column" align="start">
                <Button as={Link} variant="unstyled" to="/">
                    Social Website
                </Button>
                <Button as={Link} variant="unstyled" to="/">
                    Home
                </Button>
            </Flex>
            <Spacer />
            <Flex direction="column" align="start">
                {User ? (
                    <>
                        <Button as={Link} variant="unstyled" to="/profile">
                            Profile
                        </Button>
                        <Button as={Link} variant="unstyled" to="/forums">
                            Forums
                        </Button>
                    </>
                ) : (
                    <>
                        <Button variant="unstyled" onClick={login}>
                            Log in
                        </Button>
                        <Button variant="unstyled" onClick={signup}>
                            Sign up
                        </Button>
                    </>
                )}
            </Flex>
            <Spacer />
            <Flex direction="column" align="start">
                {/* <Text>Alli Toth s3902333 and Alex Aloi s3842524</Text>
                <Text>2022 - FWP Assignment 2</Text> */}
            </Flex>
            <Spacer />
        </Flex>
    );
};

export default Footer;
