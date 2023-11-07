"use client"

import NavbarBase from "@/app/components/navbars/navbar"
import checkUserRole from "@/app/middlewares/check-user-role"


function page() {

  checkUserRole(["NA"]);

  return (
    <div>
      <NavbarBase />
      <div className="flex justify-center align-middle">Ruta base en proceso</div>
    </div>
  )
}

export default page