"use client"

import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { IconTrashFilled } from "@tabler/icons-react";
import toast, { Toaster } from "react-hot-toast";

import Pagination from "@/app/components/utils/pagination";
import SearchFilter from "@/app/components/utils/filtering";
import moment from "moment/moment";
import { type Speciality } from "@/app/interfaces/specialities";
import AddSpeciality from "./add";
import Confirm from "../components/utils/confirm";
import { deleteEspeciality } from "../actions/specialities";
import { Button } from "@nextui-org/react";

const ITEMS_PER_PAGE = 5;


export default function SpecialtiesTable({ data }: { data: Speciality[] }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchColumn, setSearchColumn] = useState("nombre");
    const [specialties, setSpecialties] = useState<Speciality[]>(data);

    const supabase = createClientComponentClient();

    supabase.channel('custom-all-channel')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'especialidades' },
            (payload) => {
                const { eventType, new: newItem, old: oldItem } = payload;

                switch (eventType) {
                    case 'INSERT':
                        setSpecialties((prevState) => [...prevState, newItem as Speciality]);
                        break;
                    case 'UPDATE':
                        setSpecialties((prevState) => prevState.map((item) => item.id === newItem.id ? newItem as Speciality : item));
                        break;
                    case 'DELETE':
                        setSpecialties((prevState) => prevState.filter((item) => item.id !== oldItem.id));
                        break;
                    default:
                        break;
                }
            }
        )
        .subscribe()


    const handleSearchTermChange = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };

    const handleSearchColumnChange = (column: string) => {
        setSearchColumn(column);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const filteredSpecialties = specialties.filter((specialty) => {
        if (searchColumn === "nombre") {
            return specialty.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return true;
    }).toSorted((a, b) => {
        return a.nombre.localeCompare(b.nombre);
    });

    const onDeleted = (id: Number) => {
        const deleted = deleteEspeciality(id);
        if (!deleted) {
            toast.error("Ocurrió un error al eliminar la especialidad");
            return;
        }
        toast.success(`Se ha eliminado la especialidad correctamente`);
    }



    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSpecialties.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredSpecialties.length / itemsPerPage);

    return (
        <div className="min-w-full">
            <div className="mb-4">
                <div className="flex items-center">
                    <SearchFilter
                        searchTerm={searchTerm}
                        searchColumn={searchColumn}
                        onSearchTermChange={handleSearchTermChange}
                        onSearchColumnChange={handleSearchColumnChange}
                        searchOptions={["nombre"]}
                    />
                </div>
            </div>
            <div className="mb-8 overflow-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-slate-300 ">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                #
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Creación
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>

                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 border">

                        {currentItems.map((item, index) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{
                                    moment(item.created_at).format("DD/MM/YYYY")
                                }</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.nombre}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex justify-start gap-2">
                                        <AddSpeciality speciality={item} />
                                        <Confirm
                                            title="Eliminar especialidad"
                                            message={`¿Está seguro que desea eliminar la especialidad ${item.nombre}?`}
                                            onConfirm={() => onDeleted(item.id)}
                                            btn={(action: () => void) => <Button className="rounded-sm" size="sm" color="danger" onClick={action}>
                                                <IconTrashFilled size={18} />
                                            </Button>}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div >
            <div className="mt-4 mx-2">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={
                        (value) => {
                            setItemsPerPage(value);
                            setCurrentPage(1);
                        }
                    }
                />
            </div>
            <Toaster />
        </div>
    );
}
