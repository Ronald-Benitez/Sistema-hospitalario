"use client";

import { useEffect, useState } from "react";
import { GetLoginCookies } from "../actions/cookies";
import { redirect } from "next/navigation";
import { type User } from "../interfaces/user";

export default function (allowedRoles: string[]) {
  // const router = useRouter();
  
  
    GetLoginCookies().then((data: User) => {
      if (!data) {
        redirect("/");
      } else {
        if (!allowedRoles.includes("NA") && !allowedRoles.includes(data.tipo)) {
          redirect("/dashboard");
        }
        if (allowedRoles.includes("NA") && data.tipo !== "NA") {
          redirect("/dashboard");
        }
      }

    });



  // if (!userRole && !allowedRoles.includes("NA")) {
  //   redirect("/");
  // }

  // if (allowedRoles.includes("NA") && userRole !== "NA") {
  //   redirect("/dashboard");
  // }

  // if (userRole !== "Administrador" && !allowedRoles.includes(userRole)) {
  //   redirect("/");
  // }
}
