import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";

import LogOut from "../login/logout";

export default function AdminNavbar() {


    return (
        <Navbar className="bg-black ">
            <NavbarBrand className="gap-2">
                <img src="/favicon.ico" alt="Logo" className="w-8 h-8" />
                <p className="font-bold text-inherit text-white">SH</p>
            </NavbarBrand>

            <NavbarContent justify="center">
                <NavbarItem>
                    <Link href="/usuarios" className="text-white text-lg">Usuarios</Link>
                </NavbarItem>
                <NavbarItem>
                    <Dropdown>
                        <DropdownTrigger>
                            <Link href="#" className="text-white text-lg">Doctores</Link>
                        </DropdownTrigger>
                        <DropdownMenu>
                            <DropdownItem>
                                <Link href="/doctores" className="text-black text-lg min-w-full" >Listado</Link>
                            </DropdownItem>
                            <DropdownItem>
                                <Link href="/especialidades" className="text-black text-lg min-w-full">Especialidades</Link>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarItem>
                <NavbarItem>
                    <Link href="/farmacia" className="text-white text-lg">Farmacia</Link>
                </NavbarItem>
            </NavbarContent>

            <NavbarContent justify="end">
                <NavbarItem>
                    <LogOut />
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
};
