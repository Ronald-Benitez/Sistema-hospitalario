"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { use, useEffect, useState } from "react";
import moment from "moment/moment";


import { DoctorWithUser } from "../interfaces/doctors";
import { type DoctorUser } from "../interfaces/user";
import Pagination from "../components/utils/pagination";
import SearchFilter from "../components/utils/filtering";
import EditDoctorForm from "./edit";
import { getDoctors } from "../actions/doctors";

const ITEMS_PER_PAGE = 5;

const DoctorsTable = ({ data }: { data: DoctorWithUser[] }) => {
    const [doctors, setDoctors] = useState<DoctorWithUser[]>(data);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchColumn, setSearchColumn] = useState("nombre");
    const [reload, setReload] = useState(false);

    const supabase = createClientComponentClient();

    useEffect(() => {
        setDoctors(data);
    }, [data]);

    const getData = async () => {
        const data = await getDoctors();
        if (!data) return;
        setDoctors(data);
    }

    useEffect(() => {
        getData();
    }, [reload]);

    supabase.channel('custom-all-channel')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'usuarios' },
            (payload) => {
                const { eventType, new: newItem, old: oldItem } = payload;

                switch (eventType) {
                    case 'UPDATE':
                        setDoctors((prevState) => prevState.map((item) => item.id === newItem.id ? { ...item, usuario: newItem as DoctorUser } : item));
                        break;
                    default:
                        break;
                }
            }
        ).subscribe()


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

    const filteredDoctors = doctors.filter((item) => {
        switch (searchColumn) {
            case "nombre":
                return `${item.usuario.nombres} ${item.usuario.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase());
            case "especialidad":
                return item.especialidad.toLowerCase().includes(searchTerm.toLowerCase());
            default:
                return true;
        }
    }).sort((a, b) => {
        return a.usuario.nombres.localeCompare(b.usuario.nombres);
    });


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredDoctors.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);

    return (
        <div className="min-w-full">
            <div className="mb-4">
                <div className="flex items-center">
                    <SearchFilter
                        searchTerm={searchTerm}
                        searchColumn={searchColumn}
                        onSearchTermChange={handleSearchTermChange}
                        onSearchColumnChange={handleSearchColumnChange}
                        searchOptions={["nombre", "especialidad"]}
                    />
                </div>
            </div>
            <div className="mb-8 overflow-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-slate-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                #
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Especialidad
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Duración de consulta
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Horario
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 border">
                        {currentItems.map((doctor, index) => (
                            <tr key={doctor.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{doctor.usuario.nombres} {doctor.usuario.apellidos}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{doctor.especialidad}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{doctor.duracion_consulta} minutos</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {
                                        doctor.inicio_horario === null || doctor.fin_horario === null ?
                                            "Sin horario" :
                                            moment(doctor.inicio_horario as string, "HH:mm:ss").format("hh:mm A") + " - " + moment(doctor.fin_horario as string, "HH:mm:ss").format("hh:mm A")
                                    }
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <EditDoctorForm doctor={doctor} setReload={setReload} reload={reload} />
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
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
        </div>
    );
};

export default DoctorsTable;
