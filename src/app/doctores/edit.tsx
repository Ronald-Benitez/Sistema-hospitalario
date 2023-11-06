"use client"

import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import toast, { Toaster } from "react-hot-toast";
import { IconPencil } from "@tabler/icons-react";

import { DoctorWithUser } from "../interfaces/doctors";
import { updateDoctor } from "../actions/doctors";

interface propsI {
    doctor: DoctorWithUser;
    setReload: (reload: boolean) => void;
    reload: boolean;
}

const EditDoctorForm = ({ doctor, setReload, reload }: propsI) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [formData, setFormData] = useState<DoctorWithUser>(doctor);

    const saveDoctor = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!verifyNoVoid()) return;

        const actualizado = updateDoctor(formData.id, formData);

        if (!actualizado) {
            toast.error("Ocurrió un error al guardar la información del doctor");
            return;
        }

        toast.success(`Se ha actualizado la información del doctor ${formData.usuario.nombres} ${formData.usuario.apellidos}`);
        setReload(!reload);
        onClose();
    };

    const verifyNoVoid = () => {
        if (formData.inicio_horario == "" || formData.fin_horario == "" || formData.duracion_consulta == null) {
            toast.error("No puede haber campos vacíos");
            return false;
        }
        return true;
    }

    return (
        <>
            <Button onClick={onOpen} className="rounded-sm" size="sm" color="warning">
                <IconPencil size={18} />
            </Button>
            <Modal isOpen={isOpen} onClose={onClose} backdrop="blur" scrollBehavior="inside">
                <ModalContent>
                    <ModalHeader className="flex justify-center text-2xl">Editar un doctor</ModalHeader>
                    <ModalBody>
                        <form onSubmit={saveDoctor}>
                            {/* Resto del formulario aquí */}
                            <div className="mb-4">
                                <label htmlFor="inicio_horario" className="block text-sm font-medium text-gray-600">
                                    Inicio Horario
                                </label>
                                <Input
                                    isRequired
                                    type="time"
                                    id="inicio_horario"
                                    name="inicio_horario"
                                    className="mt-1 p-2 border rounded w-full"
                                    label="Ingrese la hora de inicio"
                                    onChange={(e) => setFormData({ ...formData, inicio_horario: e.target.value })}
                                    value={formData.inicio_horario as string}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="fin_horario" className="block text-sm font-medium text-gray-600">
                                    Fin Horario
                                </label>
                                <Input
                                    isRequired
                                    type="time"
                                    id="fin_horario"
                                    name="fin_horario"
                                    className="mt-1 p-2 border rounded w-full"
                                    label="Ingrese la hora de fin"
                                    onChange={(e) => setFormData({ ...formData, fin_horario: e.target.value })}
                                    value={formData.fin_horario as string}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="duracion_consulta" className="block text-sm font-medium text-gray-600">
                                    Duración de consulta
                                </label>
                                <Input
                                    isRequired
                                    type="number"
                                    id="duracion_consulta"
                                    name="duracion_consulta"
                                    className="mt-1 p-2 border rounded w-full"
                                    label="Ingrese la duración de la consulta"
                                    onChange={(e) => setFormData({ ...formData, duracion_consulta: Number(e.target.value) })}
                                    value={String(formData.duracion_consulta)}
                                    endContent={
                                        <span className="text-gray-600 text-sm">minutos</span>
                                    }
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="hora_descanso" className="block text-sm font-medium text-gray-600">
                                    Hora de descanso
                                </label>
                                <Input
                                    type="time"
                                    id="hora_descanso"
                                    name="hora_descanso"
                                    className="mt-1 p-2 border rounded w-full"
                                    label="Ingrese la hora de descanso"
                                    onChange={(e) => setFormData({ ...formData, hora_descanso: e.target.value })}
                                    value={formData.hora_descanso as string}
                                />
                            </div>
                            <div className="flex justify-around my-4">
                                <Button type="submit" className="bg-black text-white rounded hover:bg-slate-950 px-10">
                                    Guardar cambios
                                </Button>
                            </div>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Cerrar</Button>
                    </ModalFooter>
                </ModalContent>
                <Toaster />
            </Modal>
        </>
    );
};

export default EditDoctorForm;
