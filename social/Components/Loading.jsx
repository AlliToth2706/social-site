import { Spinner } from '@chakra-ui/react';

//loading symbol
const Loading = ({ bool, children }) => {
    return bool ? children : <Spinner size='xl' />;
};

export default Loading;
