import React, { createContext } from 'react';
import { ChakraProvider, extendTheme, theme, ColorModeScript } from '@chakra-ui/react';
import { Routing } from './Components';

import customTheme from './Theme';
import Filter from 'bad-words';
import { initialise } from './Data/accounts';
/*
 * Universal exports
 *
 * These are used in multiple files, so they are exported from the app file to not have to repeat them.
 */

// Toast duration times. In ms.
const shortToastTime = 2000;
const longToastTime = 5000;

// REGULAR EXPRESSIONS - Match certain phrases to validate user inputs.
const imageRegex = new RegExp('(https?://.*.(?:png|jpg|jpeg))', 'i'); // Regex - https://website.com/image.jpg
const emailRegex = new RegExp("[a-zA-Z0-9.! #$%&'*+/=? ^_`{|}~-]+@[a-zA-Z0-9.]+\\.[a-zA-Z]+$"); // Regex - (email)@(website).(TLD)

const passwordRegex = new RegExp('^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$'); // Regex - 8+ chars long, 1 lowercase letter, 1 uppercase letter, one digit, and one special character

// Make sure that everywhere has access to the currently logged in user.
const UserContext = createContext();

const textFilter = new Filter();

// Max posting length
const maxPostLength = 600;

initialise();

/**
 * Main app.
 */
const App = () => {
    return (
        <>
            {/* The project uses Chakra for its design. The colour mode script is for light/dark mode */}
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <ChakraProvider theme={extendTheme(customTheme)}>
                <Routing />
            </ChakraProvider>
        </>
    );
};

export default App;
export { UserContext, shortToastTime, longToastTime, emailRegex, imageRegex, passwordRegex, maxPostLength, textFilter };
