import { signUpUser } from '../Data/accounts';
import { useState } from 'react';
import {
    useToast,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Box,
    Tooltip,
    Button,
    Flex,
} from '@chakra-ui/react';
import { shortToastTime, longToastTime, emailRegex, passwordRegex } from '../App';
import Modal from './Modal';

/**
 * A modal which users use to sign up.
 */
const SignupDialog = ({ login, isOpen, onClose }) => {
    const [user, setUser] = useState({ email: '', first_name: '', last_name: '', password: '' });
    const [isValidEmail, setValidEmail] = useState(null);
    const [passStrength, setPassStrength] = useState(null);

    const toast = useToast();

    const handleChange = (e) => {
        // Sets value of changed element in the user state
        const tmp = { ...user };
        tmp[e.target.name] = e.target.value;
        setUser(tmp);

        // Check if the email is valid
        if (e.target.name === 'email') {
            // No error message if nothing has been put in
            if (e.target.value === '') {
                setValidEmail(null);

                // No need to test an empty string
                return;
            }

            // Sets if the email is valid based on if the email address provided matches the regex
            setValidEmail(emailRegex.test(e.target.value));
        }

        // Check if password is valid
        else if (e.target.name === 'password') {
            // No error message if nothing has been put in
            if (e.target.value === '') {
                setPassStrength(null);
                return;
            }

            // S - strong, W - weak
            // Sets the strength to single letter noting if it's strong or weak
            setPassStrength(passwordRegex.test(e.target.value) === true ? 's' : 'w');
        }
    };

    const handleSubmit = async () => {
        if (!user.first_name || !user.last_name || !user.email || !user.password) {
            toast({
                title: 'Please enter your details.',
                status: 'error',
                duration: shortToastTime,
                isClosable: true,
            });
            return;
        }

        if (!isValidEmail) {
            toast({
                title: 'Please enter a valid email.',
                status: 'error',
                duration: shortToastTime,
                isClosable: true,
            });
            return;
        }

        if (passStrength !== 's') {
            toast({
                title: 'Please only use a strong password.',
                description: 'Your safety is important to us.',
                status: 'error',
                duration: shortToastTime,
                isClosable: true,
            });
            return;
        }

        let verification = /*await*/ signUpUser(user);
        // Sign up the user and check if was successful
        if (verification === true) {
            // Sets the user in localStorage
            login(user.email);

            // Show sign up has been successful
            toast({
                title: "You've been signed up.",
                description: 'You are also logged in.',
                status: 'success',
                duration: longToastTime,
                isClosable: true,
            });

            // Moves user back to the main page
            onClose();
        }

        // Sign up unsuccessful, email already exists
        else {
            if (verification === 409) {
                // removes password
                setUser({
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    password: '',
                });

                toast({
                    title: 'Sign up failed.',
                    description:
                        'An account was found with the same email. Please choose a different email or log in instead if you have an account.',
                    status: 'error',
                    duration: longToastTime,
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Sign up failed.',
                    status: 'error',
                    duration: longToastTime,
                    isClosable: true,
                });
            }
        }
    };

    return (
        <>
            <Modal heading="Sign up" isOpen={isOpen} onClose={onClose}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    <FormControl mb={2} isInvalid={isValidEmail == null ? false : !isValidEmail}>
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            placeholder="Email"
                        />
                        {isValidEmail ? (
                            <FormHelperText>Email is valid</FormHelperText>
                        ) : (
                            isValidEmail === false && <FormErrorMessage>Email is not valid</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl mb={2}>
                        <FormLabel>Name</FormLabel>
                        <Flex direction="row">
                            <Input
                                type="text"
                                name="first_name"
                                value={user.first_name}
                                onChange={handleChange}
                                mr={1}
                                placeholder="First name"
                            />
                            <Input
                                type="text"
                                name="last_name"
                                value={user.last_name}
                                onChange={handleChange}
                                ml={1}
                                placeholder="Last name"
                            />
                        </Flex>
                    </FormControl>
                    <FormControl
                        mb={2}
                        isInvalid={(passStrength != null && passStrength !== 's') || user.password.length > 20}
                    >
                        <FormLabel>Password</FormLabel>
                        <Input
                            type="password"
                            name="password"
                            value={user.password}
                            onChange={handleChange}
                            placeholder="Password"
                        />
                        {user.password.length > 20 ? (
                            <FormErrorMessage>
                                Password is too long. Please keep password between 8 and 20 characters.
                            </FormErrorMessage>
                        ) : passStrength === 's' ? (
                            <FormHelperText>Password is strong</FormHelperText>
                        ) : (
                            passStrength === 'w' && (
                                <FormErrorMessage>
                                    Password is not strong. Please use a strong password for security.
                                    <Tooltip label="A strong password consists of at least 8 characters, which should include at least one lowercase letter, uppercase letter, number, and special character (e.g. !*&^)">
                                        <Box className="material-icons" sx={{ cursor: 'pointer' }}>
                                            help_outline
                                        </Box>
                                    </Tooltip>
                                </FormErrorMessage>
                            )
                        )}
                    </FormControl>
                    <Button type="submit">Submit</Button>
                </form>
            </Modal>
        </>
    );
};

export default SignupDialog;
