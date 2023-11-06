"use server";

import { cookies } from "next/headers";

export const SetLoginCookies = (user: string) => {
  cookies().set("user", user);
};

export const RemoveLoginCookies = () => {
  cookies().delete("user");
};

export const GetLoginCookies = () => {
  const user = cookies().get("user")?.value;
  return user ? JSON.parse(user) : null;
};
