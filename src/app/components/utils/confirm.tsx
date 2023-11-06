import { Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure, ModalFooter } from "@nextui-org/react";

interface ConfirmProps {
    title: string;
    message: string;
    onConfirm: () => void;
    btn: (action: () => void) => JSX.Element;
}

export default function Confirm({ title, message, onConfirm, btn }: ConfirmProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();


    return (
        <>
            {
                btn(onOpen)
            }
            <Modal isOpen={isOpen} onClose={onClose} className="rounded" backdrop="blur">
                <ModalContent>
                    <ModalHeader className="text-3xl font-semibold mb-6  text-black flex justify-center">{title}</ModalHeader>
                    <ModalBody>
                        <p className="text-center text-black">{message}</p>
                    </ModalBody>
                    <ModalFooter className="flex justify-evenly">
                        <Button onClick={onClose} className="rounded-sm">Cancelar</Button>
                        <Button onClick={onConfirm} className="rounded-sm bg-black text-white">Confirmar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );

}