import { theme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const hover = {
    ...theme.components.Button.variants.ghost,
    _hover: {
        backgroundColor: 'blackAlpha.200',
    },
    _active: {
        backgroundColor: 'blackAlpha.400',
    },
    fontSize: '24px',
};

const customTheme = {
    initialColorMode: 'system',
    useSystemColorMode: false,
    styles: {
        global: (props) => ({
            nav: {
                bg: mode('cyan.600', 'cyan.700')(props),
                h: '5rem',
                w: '100%',
                p: '0 1rem',
            },
        }),
    },
    components: {
        Button: {
            variants: {
                navbar: (props) => ({
                    ...hover,
                    color: mode('black', 'white')(props),
                }),
                inverse: (props) => ({
                    ...hover,
                    color: mode('white', 'black')(props),
                }),
                invisible: {
                    ...theme.components.Button.variants.ghost,
                    _hover: {
                        backgroundColor: 'none',
                    },
                    _active: {
                        backgroundColor: 'none',
                    },
                    fontSize: '24px',
                },
                reaction: (props) => ({
                    ...hover,
                    color: mode('cyan.600', 'cyan.700')(props),
                }),
            },
        },
        Text: {
            variants: {
                branding: {
                    fontFamily: "'Lato', sans-serif",
                    fontWeight: 'bold',
                },
            },
        },
    },
};

export default customTheme;
