import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
import LogOut from "../login/logout";

export default function FarmaciaNavbar() {

    return (
        <Navbar className="bg-black">
            <NavbarBrand className="gap-2">
                <img src="/favicon.ico" alt="Logo" className="w-8 h-8" />
                <p className="font-bold text-inherit text-white">SH</p>
            </NavbarBrand>
            <NavbarContent justify="center">
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
