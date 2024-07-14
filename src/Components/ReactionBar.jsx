import { Box, Button, ButtonGroup, Center, Stack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import {
    addReaction,
    getAllPostReactions,
    getUserPostReactions,
    reactionTypes,
    stripUserReactionsFromPost,
} from '../Data/reactions';

//Displays all reactions that can appear on a post, and allows interaction with them
const ReactionBar = ({ postId, userEmail }) => {
    const [userReactions, setUserReactions] = useState([]);
    const [reactionAmount, setReactionAmount] = useState({});

    const refreshRatings = () => {
        getAllPostReactions(postId, userEmail).then(e => {
            if (typeof(e) === "object") setReactionAmount(e);
        });
        getUserPostReactions(postId, userEmail).then(e => {
            if (Array.isArray(e)) setUserReactions(e);
        });
    };

    useEffect(() => {
        refreshRatings();
        // eslint-disable-next-line
    }, []);

    const reactionCallback = async (reactionType) => {
        if (userReactions.includes(reactionType)) {
            await stripUserReactionsFromPost(postId, userEmail);
        } else {
            if (userReactions.length !== 0) {
                await stripUserReactionsFromPost(postId, userEmail);
            }
            await addReaction(postId, userEmail, reactionType);
        }
        refreshRatings();
    };

    return (
        <ButtonGroup spacing='0'>
            {Object.keys(reactionTypes).map((reaction, i) => {
                return (
                    <Stack key={i}>
                        <Box>
                            <Button
                                variant={userReactions.includes(reaction) ? 'reaction' : 'navbar'}
                                className='material-icons'
                                size='sm'
                                onClick={() => reactionCallback(reaction)}
                                key={reaction}
                            >
                                {reactionTypes[reaction].materialIconName}
                            </Button>
                        </Box>
                        <Center>{reactionAmount[reaction] === undefined ? 0 : reactionAmount[reaction]}</Center>
                    </Stack>
                );
            })}
        </ButtonGroup>
    );
};

export default ReactionBar;
