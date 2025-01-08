import { Box, Button, ButtonGroup, Center, Stack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { reactionTypes } from '../Data/reactions';

// Displays all reactions that can appear on a post, and allows interaction with them
const ReactionBar = ({ user, post, editInfo }) => {
    // TODO: fix removing like/dislike removing an extra dislike/like from count
    // Formats post reaction info to an object with the amounts for each reaction

    const [reactions, setReactions] = useState(post.reactions);

    const userInReactions = (reactionList) => {
        return reactionList.includes(user);
    };

    const reactionCallback = (reactionType) => {
        // Check if the user has reacted to the post with the given reaction already
        const hasReacted = userInReactions(reactions[reactionType]);

        // Remove the user from both reaction types
        const reacts = {};
        Object.keys(reactions).forEach((reaction) => {
            reacts[reaction] = reactions[reaction].filter((e) => e !== user);
        });

        // Add the reaction if the user had not reacted
        if (!hasReacted) reacts[reactionType].push(user);

        setReactions(reacts);

        editInfo(reacts);
    };

    return (
        <ButtonGroup spacing="0">
            {Object.keys(reactions).map((reaction, i) => {
                return (
                    <Stack key={i}>
                        <Box>
                            <Button
                                variant={userInReactions(reactions[reaction]) ? 'reaction' : 'navbar'}
                                className="material-icons"
                                size="sm"
                                onClick={() => reactionCallback(reaction)}
                                key={reaction}
                            >
                                {reactionTypes[reaction].materialIconName}
                            </Button>
                        </Box>
                        <Center>{reactions[reaction].length}</Center>
                    </Stack>
                );
            })}
        </ButtonGroup>
    );
};

export default ReactionBar;
