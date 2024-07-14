import React, { useContext, useEffect, useState } from 'react';
import { getUserInfo, editUserInfo, deleteAccount, getUsers, addProfileVisit } from '../Data/accounts';
import {
    Button,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    useToast,
    Box,
    ButtonGroup,
    Flex,
    Text,
    Spacer,
    Avatar,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Heading,
    Spinner,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { imageRegex, longToastTime, shortToastTime, UserContext } from '../App';
import Alert from '../Components/Alert';
import Modal from '../Components/Modal';
import { getFollow, getFollows, getFollowsTo } from '../Data/following';
import { AvatarButton, FollowButton } from '../Components';
import UserPosts from '../Components/UserPosts';

const EditProfile = ({ setUser }) => {
    const User = useContext(UserContext);
    let navigate = useNavigate();
    const toast = useToast();
    const [initialInformation, setInitialInformation] = useState({});
    const [editingInformation, setEditingInformation] = useState({
        first_name: '',
        last_name: '',
        avatar: '',
    });
    const [isValidLink, setValidLink] = useState(null);

    const { isOpen: isOpenAlert, onOpen: onOpenAlert, onClose: onCloseAlert } = useDisclosure();
    const { isOpen: isOpenModal, onOpen: onOpenModal, onClose: onCloseModal } = useDisclosure();

    // Gets the initial information
    useEffect(() => {
        (async () => {
            let userDetails = /*await*/ getUserInfo(User);
            setInitialInformation(userDetails);
        })();
    }, [User]);

    // Makes sure that the information on the editing page is accurate to what is in the database
    useEffect(() => {
        (async () => {
            setEditingInformation({
                first_name: initialInformation.first_name,
                last_name: initialInformation.last_name,
                avatar: initialInformation.avatar,
            });
        })();
    }, [User, initialInformation]);

    // On unmount, close anything that is open
    useEffect(() => {
        return () => {
            onCloseAlert();
            onCloseModal();
        };
        // eslint-disable-next-line
    }, []);

    // Changes the values passed through whenever there is a change
    // to be used in the passed handleSubmit function
    const handleChange = (e) => {
        // Sets value of changed element in the user information state
        const tmp = { ...editingInformation };
        tmp[e.target.name] = e.target.value;
        setEditingInformation(tmp);

        if (e.target.name === 'avatar') {
            setValidLink(e.target.value !== '' ? imageRegex.test(e.target.value) : null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!editingInformation.first_name || !editingInformation.last_name) {
            toast({
                title: "Please don't remove your name.",
                status: 'error',
                duration: shortToastTime,
                isClosable: true,
            });
            return;
        }

        if (isValidLink === false) {
            toast({
                title: 'Avatar URL not valid.',
                status: 'error',
                duration: shortToastTime,
                isClosable: true,
            });
            return;
        }

        // Set the changed information
        let worked = /*await*/ editUserInfo({ ...initialInformation, ...editingInformation });
        if (!worked) {
            toast({
                title: 'An error occurred.',
                status: 'error',
                duration: shortToastTime,
                isClosable: true,
            });
            return;
        }
        // Give the user notification that their changes have gone through
        toast({
            title: 'Account details changed.',
            description: 'The information has been saved.',
            status: 'success',
            duration: longToastTime,
            isClosable: true,
        });

        // Close out of modal
        onCloseModal();

        setInitialInformation(/*await*/ getUserInfo(initialInformation.email));
    };

    return (
        <>
            {/* Alert dialogue for account deletion */}
            <Alert
                heading="Delete Account"
                onClick={() => {
                    deleteAccount(User);
                    onCloseAlert();
                    setUser(null);
                    navigate('/');
                }}
                isOpen={isOpenAlert}
                onClose={onCloseAlert}
            />

            {/* Modal for editing info */}
            <Modal isOpen={isOpenModal} onClose={onCloseModal} heading="Edit Profile">
                <form onSubmit={handleSubmit}>
                    <FormControl mb={2}>
                        <FormLabel>Name</FormLabel>
                        <Flex direction="row">
                            <Input
                                type="text"
                                name="first_name"
                                value={editingInformation.first_name}
                                onChange={handleChange}
                                mr={1}
                                placeholder="First name"
                            />
                            <Input
                                type="text"
                                name="last_name"
                                value={editingInformation.last_name}
                                onChange={handleChange}
                                ml={1}
                                placeholder="Last name"
                            />
                        </Flex>
                    </FormControl>
                    <FormControl mb={2} isInvalid={isValidLink == null ? false : !isValidLink}>
                        <FormLabel>Avatar</FormLabel>
                        <Input
                            type="url"
                            name="avatar"
                            value={editingInformation.avatar ?? ''}
                            onChange={handleChange}
                            placeholder="Avatar URL"
                        />
                    </FormControl>

                    {JSON.stringify(editingInformation) === JSON.stringify(initialInformation) ? (
                        <Button onClick={onCloseModal}>Cancel</Button>
                    ) : (
                        <Button type="submit">Submit</Button>
                    )}
                </form>
            </Modal>
            <ButtonGroup gap={2}>
                <Button onClick={onOpenModal}>Edit</Button>
                <Button colorScheme="red" onClick={onOpenAlert}>
                    Delete
                </Button>
            </ButtonGroup>
        </>
    );
};

/**
 * The profile area where users can see and edit their profiles.
 * NOTE: The basics of this are working, but could be made simpler using the useEffect hook
 * E.g. could show a loading screen until setInitialInformation/setUserInformation isnt empty
 */
const Profile = ({ setUser }) => {
    const loggedInUser = useContext(UserContext);
    const { User } = useParams();

    const [followings, setFollowings] = useState(null);
    const [followers, setFollowers] = useState(null);
    const [users, setUsers] = useState(null);
    const [open, setOpen] = useState(0);

    const [isFollowed, setIsFollowed] = useState(null);

    let u = users?.find((e) => e.email === User) ?? '';

    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        addProfileVisit(User);
    }, [User]);

    // Gets information from the database
    useEffect(() => {
        // (async () => {
        // Gets the users that the current user is following, and the users that are following the user

        setFollowings(/*await*/ getFollows(User));
        setFollowers(/*await*/ getFollowsTo(User));

        // Get all of the users
        setUsers(/*await*/ getUsers());
        console.log(getUsers());
        // })();

        // Sets the follow state
        // if (User !== loggedInUser && isFollowed == null) getFollow(loggedInUser, User).then((e) => setIsFollowed(e));
        if (User !== loggedInUser && isFollowed == null) setIsFollowed(getFollow(loggedInUser, User));

        // On unmount, close the modal if it is open
        return onClose;
    }, [isFollowed, User, loggedInUser, onClose]);

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                heading={
                    open === 0 ? `Following (${followings?.length ?? 0})` : `Followers (${followers?.length ?? 0})`
                }
            >
                <Tabs variant="enclosed" isFitted onChange={(index) => setOpen(index)} defaultIndex={open}>
                    <TabList>
                        <Tab>Following</Tab>
                        <Tab>Followers</Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            <Flex direction="column">
                                {followings?.length > 0 ? (
                                    followings?.map((user, i) => {
                                        return (
                                            <React.Fragment key={i}>
                                                <UserPanel
                                                    shouldShowFollow={User === loggedInUser}
                                                    user={users?.find((e) => e.email === user)}
                                                />
                                            </React.Fragment>
                                        );
                                    })
                                ) : (
                                    <Text>
                                        {User === loggedInUser ? "You're" : `${u.first_name} is`} not following anyone.
                                    </Text>
                                )}
                            </Flex>
                        </TabPanel>
                        <TabPanel>
                            {followers?.length > 0 ? (
                                followers?.map((user, i) => {
                                    return (
                                        <React.Fragment key={i}>
                                            <UserPanel
                                                shouldShowFollow={false}
                                                user={users?.find((e) => e.email === user)}
                                            />
                                        </React.Fragment>
                                    );
                                })
                            ) : (
                                <Text>No followers found.</Text>
                            )}
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Modal>

            {/* Profile area */}

            {users ? (
                <Flex h="full" w="full" direction="column">
                    <Flex direction="row" wrap="wrap" justify="space-around" align="center" w="full" h="full" mt="10%">
                        <Flex textAlign="left" justify="center">
                            <Avatar name={`${u.first_name} ${u.last_name}`} src={u.avatar} w={60} h={60} size="2xl" />
                        </Flex>

                        <Box textAlign="left">
                            <Flex direction="row" mb={4}>
                                <ButtonGroup gap={2}>
                                    <Button
                                        variant="link"
                                        onClick={() => {
                                            setOpen(0);
                                            onOpen();
                                        }}
                                    >
                                        {followings?.length ?? 0} Following
                                    </Button>
                                    <Button
                                        variant="link"
                                        onClick={() => {
                                            setOpen(1);
                                            onOpen();
                                        }}
                                    >
                                        {followers?.length ?? 0} Followers
                                    </Button>
                                </ButtonGroup>
                            </Flex>
                            <Text>
                                {u.first_name} {u.last_name}
                                <br />
                                Email: {u.email}
                                <br />
                                Account created: {new Date(u.time).toLocaleString()}
                            </Text>
                            <br />

                            {User === loggedInUser ? (
                                <EditProfile setUser={setUser} />
                            ) : isFollowed == null ? (
                                <Spinner size="xl" />
                            ) : (
                                <FollowButton
                                    size="md"
                                    from_user={loggedInUser}
                                    to_user={User}
                                    state={isFollowed}
                                    setState={setIsFollowed}
                                />
                            )}
                        </Box>
                    </Flex>

                    <Flex direction="column" justify="center" align="center" mt={20} mb="5%">
                        {User === loggedInUser || isFollowed ? (
                            <>
                                <Heading size="lg">
                                    Posts by {u.first_name} {u.last_name}
                                </Heading>
                                <UserPosts user={User} />
                            </>
                        ) : null}
                    </Flex>
                </Flex>
            ) : (
                <Flex h="full" w="full" direction="column" align="center">
                    <Spinner size="xl" />
                </Flex>
            )}
        </>
    );
};

const UserPanel = ({ user, shouldShowFollow }) => {
    const User = useContext(UserContext);
    const [isFollowed, setIsFollowed] = useState(null);

    useEffect(() => {
        // if (isFollowed == null) getFollow(User, user.email).then((e) => setIsFollowed(e));
        if (isFollowed == null) setIsFollowed(getFollow(User, user.email));
    }, [isFollowed, User, user]);

    return (
        <Flex direction="row" align="center" mb={2}>
            <AvatarButton user={user} size="md" margin="0 10px" />
            <Text as="b" fontSize="lg">
                {user.first_name} {user.last_name}
            </Text>
            {shouldShowFollow && (
                <>
                    <Spacer />
                    {isFollowed == null ? (
                        <Spinner size="xl" />
                    ) : (
                        <FollowButton
                            from_user={User}
                            to_user={user.email}
                            state={isFollowed}
                            setState={setIsFollowed}
                        />
                    )}
                </>
            )}
        </Flex>
    );
};

export default Profile;
