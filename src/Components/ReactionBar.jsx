import { Box, Button, ButtonGroup, Center, Stack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { getUserPostReactions, reactionTypes } from '../Data/reactions';

// Displays all reactions that can appear on a post, and allows interaction with them
const ReactionBar = ({ user, post, editInfo }) => {
    // Get initial reaction information
    const [userReaction, setUserReaction] = useState(getUserPostReactions(post, user));
    const [reactionAmount, setReactionAmount] = useState({
        like: post.reactions['like'].length,
        dislike: post.reactions['dislike'].length,
    });

    const refreshRatings = () => {
        setReactionAmount({ like: post.reactions['like'].length, dislike: post.reactions['dislike'].length });
    };

    const removeUserReactFromPost = () => {
        // Get all the reactions for the post
        const reacts = post.reactions;
        // Remove the user from the reaction

        Object.keys(reactionTypes).forEach((reactionType) => {
            reacts[reactionType].splice(
                reacts[reactionType].findIndex((e) => e === user),
                1
            );
        });

        // Edit accordingly
        editInfo(reacts);
        setUserReaction(null);
    };

    const addUserReactToPost = (reactionType) => {
        // Get all the reactions for the post
        const reacts = post.reactions;
        // Remove the user from the reaction
        reacts[reactionType].push(user);

        // Edit accordingly
        editInfo(reacts);
        setUserReaction(reactionType);
    };

    const reactionCallback = (reactionType) => {
        if (userReaction === reactionType) {
            removeUserReactFromPost();
        } else {
            if (userReaction != null) {
                removeUserReactFromPost();
            }
            addUserReactToPost(reactionType);
        }
        refreshRatings();
    };

    return (
        <ButtonGroup spacing="0">
            {Object.keys(reactionTypes).map((reaction, i) => {
                return (
                    <Stack key={i}>
                        <Box>
                            <Button
                                variant={userReaction === reaction ? 'reaction' : 'navbar'}
                                className="material-icons"
                                size="sm"
                                onClick={() => reactionCallback(reaction)}
                                key={reaction}
                            >
                                {reactionTypes[reaction].materialIconName}
                            </Button>
                        </Box>
                        <Center>{reactionAmount[reaction]}</Center>
                    </Stack>
                );
            })}
        </ButtonGroup>
    );
};

export default ReactionBar;
