"use server";
import { clerkClient } from "@clerk/nextjs/server";

export async function getUserData(userId: string) {
  try {
    const user = await clerkClient.users.getUser(userId);

    return {
      username: user.username || "N/A",
      fullName:
        `${user.firstName}${user.lastName}`.trim().replace(" null", "") ||
        "N/A",
      password: user.phoneNumbers + "" || "N/A",
      email: user.emailAddresses[0].emailAddress + "" || "N/A",
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}
