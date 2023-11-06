import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
import Login from "@/app/components/login/login";

export default function PublicNavbar() {

    return (
        <Navbar className="bg-black">
            <NavbarBrand className="gap-2">
                <img src="/favicon.ico" alt="Logo" className="w-8 h-8" />
                <p className="font-bold text-inherit text-white">SH</p>
            </NavbarBrand>

            <NavbarContent justify="end">
                <NavbarItem >
                    <Login />
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
};


