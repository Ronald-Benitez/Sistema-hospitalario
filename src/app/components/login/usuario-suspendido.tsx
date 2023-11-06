'use client';

import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";

interface Props {
    message: string;
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
}

export default function UsuarioSuspendido({ message, isOpen, onClose }: Props) {

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} className="rounded" backdrop="blur">
                <ModalContent>
                    <ModalHeader className="text-3xl font-semibold mb-2 flex justify-center text-black">Su usuario ha sido suspendido</ModalHeader>
                    <ModalBody className="p-5">
                        <p className="text-center text-black">{message}</p>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );

}