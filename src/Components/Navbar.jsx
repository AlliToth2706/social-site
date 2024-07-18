import { Box, Button, ButtonGroup, Flex, Spacer, Text, Tooltip, useColorMode } from '@chakra-ui/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getUser, removeUser, verifyUser } from '../Data/accounts';
import React, { useContext } from 'react';
// import { ReactComponent as Logo } from '../logo.svg';
import { UserContext } from '../App';

const NavbarLink = ({ children, onClick, to, variant, label }) => {
    // Gets the current location of the user
    const { pathname } = useLocation();

    return (
        <Tooltip label={label} closeOnMouseDown={false}>
            {variant === 'link' ? (
                <Button
                    as={Link}
                    to={to === pathname ? '/' : to}
                    variant={to === pathname ? 'inverse' : 'navbar'}
                    className="material-icons"
                >
                    {children}
                </Button>
            ) : (
                <Button variant="navbar" className="material-icons" onClick={onClick}>
                    {children}
                </Button>
            )}
        </Tooltip>
    );
};

// NAVBAR: Top area, for navigation. Changes depending on login state
const Navbar = ({ setUser, signup, login }) => {
    const User = useContext(UserContext);
    const { colorMode, toggleColorMode } = useColorMode();

    let navigate = useNavigate();

    const logout = () => {
        removeUser();
        setUser(null);
        navigate('/');
    };

    const tempLogin = () => {
        verifyUser('temp@temp.com', 'abc123');
        setUser(getUser());
    };

    return (
        <Flex as="nav" align="center" variant="branding">
            {/* Branding */}
            <Button as={Link} to="/" variant="invisible">
                {/* <Logo
                    style={{
                        fill: colorMode === 'light' ? 'black' : 'white',
                        width: '50px',
                        height: '50px',
                    }}
                /> */}
                <Text variant="branding" ml={4}>
                    Social Website
                </Text>
            </Button>

            <Spacer />

            <Box className="nav-menu">
                {/* Decides if the logged in or logged out navbar versions should be shown */}
                <ButtonGroup gap={2} pr="1rem">
                    {User ? (
                        // Logged in navbar
                        <>
                            <NavbarLink to="/profile" variant="link" label="View Profile">
                                manage_accounts
                            </NavbarLink>
                            <NavbarLink to="/forums" variant="link" label="Forums">
                                forum
                            </NavbarLink>
                            <NavbarLink to="/" onClick={logout} label="Log out">
                                person_remove
                            </NavbarLink>
                        </>
                    ) : (
                        // Logged out navbar
                        <>
                            <Tooltip label="Quick Login" closeOnMouseDown={false}>
                                <Button variant="navbar" to="/" onClick={tempLogin}>
                                    Quick Login (temp account)
                                </Button>
                            </Tooltip>
                            <NavbarLink onClick={signup} label="Sign Up">
                                person_add
                            </NavbarLink>
                            <NavbarLink onClick={login} label="Login">
                                person
                            </NavbarLink>
                        </>
                    )}
                    <NavbarLink
                        onClick={toggleColorMode}
                        label={colorMode === 'light' ? 'Toggle to Dark mode' : 'Toggle to Light mode'}
                    >
                        {colorMode === 'light' ? 'dark_mode' : 'light_mode'}
                    </NavbarLink>
                </ButtonGroup>
            </Box>
        </Flex>
    );
};

export default Navbar;
