import { Spinner } from '@chakra-ui/react';

/**
 * Loading spinner when bool set to "false"
 */
const Loading = ({ bool, children }) => {
    return bool ? children : <Spinner size="xl" />;
};

export default Loading;
