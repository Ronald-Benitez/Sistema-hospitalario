"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function (allowedRoles: string[]) {
  const user = cookies().get("user")?.value;
  const userRole = user ? JSON.parse(user).tipo : "NA";

  if (!userRole && !allowedRoles.includes("NA")) {
    redirect("/");
  }

  if (allowedRoles.includes("NA") && userRole !== "NA") {
    redirect("/dashboard");
  }

  if (userRole !== "Administrador" && !allowedRoles.includes(userRole)) {
    redirect("/");
  }
}
