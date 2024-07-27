import { verifyUser, getUser } from '../Data/accounts';
import { useRef, useState } from 'react';
import { useToast, FormControl, FormLabel, FormErrorMessage, FormHelperText, Input, Button } from '@chakra-ui/react';
import { shortToastTime, longToastTime, emailRegex } from '../App';
import Modal from './Modal';

/**
 * A modal which users use to log in.
 */
const LoginDialog = ({ login, isOpen, onClose }) => {
    const [user, setUser] = useState({ email: '', password: '' });
    const [isValidEmail, setValidEmail] = useState(null);

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
    };

    const handleSubmit = () => {
        // Verify the user and check if was successful
        if (!user.email || !user.password) {
            toast({
                title: 'Please enter your details.',
                status: 'error',
                duration: shortToastTime,
                isClosable: true,
            });
            return;
        }

        let verified,
            reason = verifyUser(user.email, user.password);

        // login unsuccessful
        if (verified !== true) {
            toast({
                title: reason,
                status: 'error',
                duration: longToastTime,
                isClosable: true,
            });
            return;
        }

        login(getUser());

        setUser({ email: '', password: '' });

        toast({
            title: "You're logged in.",
            status: 'success',
            duration: longToastTime,
            isClosable: true,
        });

        // Moves user back to the main page
        onClose();
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} heading="Login">
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
                        <FormLabel>Password</FormLabel>
                        <Input
                            type="password"
                            name="password"
                            value={user.password}
                            onChange={handleChange}
                            placeholder="Password"
                        />
                    </FormControl>
                    <Button type="submit">Submit</Button>
                </form>
            </Modal>
        </>
    );
};

export default LoginDialog;
