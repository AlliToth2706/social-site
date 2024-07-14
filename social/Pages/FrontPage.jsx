import { Box, Flex, Heading, Spacer, Text } from '@chakra-ui/react';

import { UserContext } from '../App';
import { useContext } from 'react';
import { GuestFrontPage, UserFrontPage } from '../Components';

/**
 * Starting area for the app.
 */
const FrontPage = ({ login, signup }) => {
    const User = useContext(UserContext);

    return (
        <Flex direction='column' wrap='wrap' justify='space-around' align='center' w='full' h='full' flex={1}>
            <Spacer />
            <Box>
                <Heading size='lg' mb={4}>
                    Loop Agile Now
                </Heading>
                <Text>Welcome to Loop Agile Now! This is the tailor made social media site for the Loop Agile company.</Text>
                <br style={{ marginBottom: '0.2rem' }} />
            </Box>
            {User ? <UserFrontPage /> : <GuestFrontPage login={login} signup={signup} />}
            <Spacer />
        </Flex>
    );
};

export default FrontPage;
