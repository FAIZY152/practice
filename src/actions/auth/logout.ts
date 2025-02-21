"use server";

import { cookies } from "next/headers";

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.set("token", "", { expires: new Date(0) });
  return { success: "Logged out successfully" };
}
