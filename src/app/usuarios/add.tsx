"use client"

import { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Select, SelectItem, Input } from "@nextui-org/react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast, { Toaster } from "react-hot-toast";
import { IconEyeOff, IconEye } from "@tabler/icons-react";

import { getSpecialities } from "../actions/specialities";
import { insertUser } from "../actions/user";
import { insertDoctor } from "../actions/doctors";
import { type Speciality } from "../interfaces/specialities";

interface UserFormData {
    nombres: string;
    apellidos: string;
    area: string;
    email: string;
    password: string;
    especialidad?: string;
}


export default function AddUser() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [formData, setFormData] = useState<UserFormData>({
        nombres: "",
        apellidos: "",
        area: "",
        email: "",
        password: "",
    });
    const [specialities, setSpecialities] = useState<Speciality[]>([]);
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);


    const supabase = createClientComponentClient();

    const saveUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!verifyNoVoid()) return;
        if(formData.area == "Medica" && formData.especialidad == "") return toast.error("Debe seleccionar una especialidad");

        const { data: { user }, error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
        });

        if (error) {
            toast.error("Ocurrió un error al crear el usuario");
            return;
        }

        const registrado = insertUser({
            id: user!.id,
            nombres: formData.nombres,
            apellidos: formData.apellidos,
            tipo: formData.area,
        });

        if (!registrado) {
            toast.error("Ocurrió un error al guardar la información del usuario");
            return;
        }

        if (formData.area == "Medica") {
            const doctor = insertDoctor(user!.id, formData.especialidad || "");

            if (!doctor) {
                toast.error("Ocurrió un error al guardar la información del doctor");
                return;
            }
        }

        toast.success("Se ha registrado el usuario correctamente");
        onClose();
    };

    const verifyNoVoid = () => {
        if (formData.nombres == "" || formData.apellidos == "" || formData.area == "" || formData.email == "" || formData.password == "") {
            toast.error("No puede haber campos vacíos");
            return false;
        }
        return true;
    }

    const loadSpecialities = async () => {
        if (formData.area != "Medica") return setSpecialities([]);
        const data = await getSpecialities();
        if (!data) {
            toast.error("Ocurrió un error al cargar las especialidades");
            return;
        }

        setSpecialities(data);
    }


    useEffect(() => {
        loadSpecialities();
    }, [formData.area]);

    return (
        <>
            <Button onClick={onOpen} className="rounded-sm m-1">Registrar un nuevo usuario</Button>
            <Modal isOpen={isOpen} onClose={onClose} backdrop="blur" scrollBehavior="inside">
                <ModalContent>
                    <ModalHeader className="flex justify-center text-2xl">Registrar un nuevo usuario</ModalHeader>
                    <ModalBody>
                        <form onSubmit={saveUser}>
                            <div className="mb-4">
                                <label htmlFor="nombres" className="block text-sm font-medium text-gray-600">
                                    Nombres
                                </label>
                                <Input
                                    type="text"
                                    id="nombres"
                                    name="nombres"
                                    className="mt-1 p-2 border rounded w-full"
                                    label="Ingrese los nombres"
                                    isRequired
                                    onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                                    value={formData.nombres || ""}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="apellidos" className="block text-sm font-medium text-gray-600">
                                    Apellidos
                                </label>
                                <Input
                                    type="text"
                                    id="apellidos"
                                    name="apellidos"
                                    className="mt-1 p-2 border rounded w-full"
                                    label="Ingrese los apellidos"
                                    isRequired
                                    onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                                    value={formData.apellidos || ""}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="area" className="block text-sm font-medium text-gray-600">
                                    Área
                                </label>
                                <Select
                                    isRequired
                                    className="border border-slate-200"
                                    value={formData.area}
                                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                    label="Seleccione el área"

                                >
                                    <SelectItem value="Administración" key="Administración">Administración</SelectItem>
                                    <SelectItem value="Secretaria" key="Secretaria">Secretaria</SelectItem>
                                    <SelectItem value="Medica" key="Medica">Medica</SelectItem>
                                    <SelectItem value="Farmacia" key="Farmacia">Farmacia</SelectItem>
                                </Select>
                            </div>
                            {
                                specialities.length > 0 && (
                                    <div className="mb-4">
                                        <label htmlFor="especialidad" className="block text-sm font-medium text-gray-600">
                                            Especialidad
                                        </label>
                                        <Select
                                            isRequired
                                            className="border border-slate-200"
                                            value={formData.especialidad}
                                            onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
                                            label="Seleccione la especialidad"
                                        >
                                            {specialities.map((speciality) => (
                                                <SelectItem value={speciality.nombre} key={speciality.nombre}>
                                                    {speciality.nombre}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    </div>
                                )
                            }

                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                                    Correo electrónico
                                </label>
                                <Input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="mt-1 p-2 border rounded w-full"
                                    label="Ingrese su correo electrónico"
                                    isRequired
                                    value={formData.email || ""}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}

                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                                    Contraseña
                                </label>
                                <Input
                                    id="password"
                                    name="password"
                                    className="mt-1 p-2 border rounded w-full"
                                    label="Ingrese su contraseña"
                                    isRequired={true}
                                    endContent={
                                        <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                            {isVisible ? (
                                                <IconEyeOff className="text-2xl text-default-400 pointer-events-none" />
                                            ) : (
                                                <IconEye className="text-2xl text-default-400 pointer-events-none" />
                                            )}
                                        </button>
                                    }
                                    type={isVisible ? "text" : "password"}
                                    value={formData.password || ""}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-around my-4">

                                <Button type="submit" className="bg-black text-white rounded hover:bg-slate-950 px-10">
                                    Registrar
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


}