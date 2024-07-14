import {
    Modal as ChakraModal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react';
import React from 'react';

/**
 * The generic modal, makes it easier to not have to repeat code.
 */
const Modal = ({ heading, isOpen, onClose, children }) => {
    return (
        <ChakraModal isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{heading}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>{children}</ModalBody>
            </ModalContent>
        </ChakraModal>
    );
};

Modal.defaultProps = {};

export default Modal;
