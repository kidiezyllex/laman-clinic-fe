"use server";

import { cookies } from "next/headers";

export async function getCookie(name: string): Promise<string | undefined> {
  const cookieStore = cookies();
  const cookie = cookieStore.get(name);

  return cookie?.value;
}
