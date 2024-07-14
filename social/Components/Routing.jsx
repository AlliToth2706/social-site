import { Route, Routes, createMemoryRouter, RouterProvider } from 'react-router-dom';
import { Navbar, Footer, Login, Signup, FrontPage, Profile, Forum, Redirect } from '.';
import { getUser } from '../Data/accounts';
import { useState } from 'react';
import { useDisclosure, Flex } from '@chakra-ui/react';
import { UserContext } from '../App';

/**
 * Contains all of the routes and the general layout of all of the pages.
 */
const RoutingInternals = () => {
    // Watches the state of "username"
    const [username, setUsername] = useState(getUser());

    const { isOpen: isOpenLogin, onOpen: onOpenLogin, onClose: onCloseLogin } = useDisclosure();
    const { isOpen: isOpenSignup, onOpen: onOpenSignup, onClose: onCloseSignup } = useDisclosure();
    return (
        <Flex direction="column" className="app" minH="100vh" align="center">
            <UserContext.Provider value={username}>
                <Navbar setUser={setUsername} login={onOpenLogin} signup={onOpenSignup} />
                <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    as="main"
                    position="relative"
                    w="75vw"
                    sx={{ wordWrap: 'break-word' }}
                    h="full"
                    grow="1"
                >
                    <Login login={setUsername} isOpen={isOpenLogin} onClose={onCloseLogin} />
                    <Signup login={setUsername} isOpen={isOpenSignup} onClose={onCloseSignup} />
                    <Routes>
                        {/* Only allow routing to profile and forums if logged in,
                                and only allow opening the sign up and login modals if logged out */}
                        {username && (
                            <>
                                <Route path="/profile">
                                    <Route index exact element={<Redirect to={`/profile/${username}`} />} />
                                    <Route path=":User" element={<Profile setUser={setUsername} />} />
                                </Route>
                                <Route path="/forums" element={<Forum />} />
                            </>
                        )}

                        {/* Default page */}
                        <Route path="/" element={<FrontPage login={onOpenLogin} signup={onOpenSignup} />} />

                        {/* If the page isn't a route then redirect back to the main page */}
                        <Route path="*" element={<Redirect to="/social/demo" />} />
                    </Routes>
                </Flex>
                <Footer login={onOpenLogin} signup={onOpenSignup} />
            </UserContext.Provider>
        </Flex>
    );
};

// Create a router in-memory to avoid using paths
const router = createMemoryRouter([{ path: '*', Component: RoutingInternals }], {
    initialEntries: ['/'],
});

export default function Routing() {
    return <RouterProvider router={router} />;
}
