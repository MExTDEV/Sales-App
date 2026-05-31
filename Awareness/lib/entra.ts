import type { EntraUser } from "./types";

const graphBaseUrl = "https://graph.microsoft.com/v1.0";

type GraphUsersResponse = {
  value: EntraUser[];
  "@odata.nextLink"?: string;
};

export async function listEntraUsers(accessToken: string): Promise<EntraUser[]> {
  const fields = [
    "id",
    "displayName",
    "mail",
    "userPrincipalName",
    "department",
    "jobTitle",
    "accountEnabled"
  ].join(",");
  const users: EntraUser[] = [];
  let nextUrl: string | undefined = `${graphBaseUrl}/users?$select=${fields}&$top=999`;

  while (nextUrl) {
    const response = await fetch(nextUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ConsistencyLevel: "eventual"
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Graph users request failed with ${response.status}`);
    }

    const payload = (await response.json()) as GraphUsersResponse;
    users.push(...payload.value.filter((user) => user.accountEnabled !== false));
    nextUrl = payload["@odata.nextLink"];
  }

  return users;
}
