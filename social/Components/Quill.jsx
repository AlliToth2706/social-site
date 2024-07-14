import { useToast } from '@chakra-ui/react';
import DOMPurify from 'dompurify';
import ReactQuill from 'react-quill';
import { maxPostLength, shortToastTime } from '../App';


//Quill editor for editing post text
const Quill = ({ value, textCallback, minW, container }) => {
    const opts = ['bold', 'italic', 'underline'];

    const toast = useToast()

    const sanitizeAndChange = (e) => {

        const text = DOMPurify.sanitize(e).split('<p>'); //sanitization

        let isFailing = false;
        
        for (const paragraphIndex in text) { //removing white space
            text[paragraphIndex] = text[paragraphIndex].trim()
        }
        let sanitizedText = text.join('<p>');

        // ERROR CHECKING
        // If the comment is too long, don't submit
        if (sanitizedText.length > maxPostLength) {
            toast({
                title: `Please keep comments to ${maxPostLength} characters or less.`,
                status: 'error',
                duration: shortToastTime,
                isClosable: true,
            });
            isFailing = true;
        }
        
        // If the new comment is empty, don't submit
        if (sanitizedText === '<p><br></p>') {
            toast({
                title: `Please enter some text`,
                status: 'error',
                duration: shortToastTime,
                isClosable: true,
            });
            isFailing = true;
        }

        textCallback(sanitizedText, isFailing);
    };
    return (
        <ReactQuill
            theme='bubble'
            value={value}
            onChange={sanitizeAndChange}
            placeholder='Enter some text'
            className={`text-outline ${container}`}
            bounds={`.${container}`}
            formats={opts}
            modules={{
                toolbar: [opts],
            }}
            style={{ minWidth: minW }}
        />
    );
};

Quill.defaultProps = {
    minW: '0',
    container: '',
};

export default Quill;
