"use client"

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Chip } from "@nextui-org/react";

import { GetLoginCookies } from "../actions/cookies";
import { User } from "../interfaces/user";
import SuspendUser from "./suspend";
import EditUser from "./edit";
import Pagination from "../components/utils/pagination";
import SearchFilter from "../components/utils/filtering";

const ITEMS_PER_PAGE = 5; // Número de elementos por página

export default function UsuariosTable({ usuarios: props }: { usuarios: User[] }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
    const [user, setUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchColumn, setSearchColumn] = useState("nombres");
    const [usuarios, setUsuarios] = useState<User[]>(props);

    const supabase = createClientComponentClient();

    useEffect(() => {
        GetLoginCookies().then((data: User) => {
            if (data) {
                setUser(data);
            }
        });
    }, []);

    useEffect(() => {
        setUsuarios(props);
    }, [props]);


    supabase.channel('custom-all-channel')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'usuarios' },
            (payload) => {
                const { eventType, new: newUser, old: oldUser } = payload;

                switch (eventType) {
                    case 'INSERT':
                        setUsuarios((prevState) => [...prevState, newUser as User]);
                        break;
                    case 'UPDATE':
                        setUsuarios((prevState) => prevState.map((user) => user.id === newUser.id ? newUser as User : user));
                        break;
                    case 'DELETE':
                        setUsuarios((prevState) => prevState.filter((user) => user.id !== oldUser.id));
                        break;
                    default:
                        break;
                }
            }
        )
        .subscribe()

    const handleSearchTermChange = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1); // Resetear la página al cambiar el término de búsqueda
    };

    const handleSearchColumnChange = (column: string) => {
        setSearchColumn(column);
        setCurrentPage(1); // Resetear la página al cambiar la columna de búsqueda
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const filteredUsers = usuarios.filter((usuario) => {
        if (searchColumn === "nombres") {
            return usuario.nombres.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (searchColumn === "apellidos") {
            return usuario.apellidos.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (searchColumn === "tipo") {
            return usuario.tipo.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return true;
    }).sort((a, b) => {
        return a.nombres.localeCompare(b.nombres);
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    return (
        <div className="min-w-full">
            <div className="mb-4">
                <div className="flex items-center">
                    <SearchFilter
                        searchTerm={searchTerm}
                        searchColumn={searchColumn}
                        onSearchTermChange={handleSearchTermChange}
                        onSearchColumnChange={handleSearchColumnChange}
                        searchOptions={["nombres", "apellidos", "tipo"]} // Opciones de búsqueda
                    />
                </div>
            </div>
            <div className="mb-8 overflow-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-slate-300 ">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Apellido
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Area
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Razón de suspensión
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>

                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 border">

                        {currentItems.map((usuario) => (
                            <tr key={usuario.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{usuario.nombres}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{usuario.apellidos}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{usuario.tipo}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{usuario.suspendido ? (
                                    <Chip color="danger">Suspendido</Chip>
                                ) : (
                                    <Chip color="success">Activo</Chip>
                                )}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{usuario.suspendido ? usuario.razon_de_suspension : "No suspendio"}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex justify-start gap-2">
                                        {
                                            user?.id !== usuario.id && <SuspendUser user={usuario} />
                                        }
                                        <EditUser user={usuario} />
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
            </div >
        </div>
    );
}
