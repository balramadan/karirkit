import { api } from "@/lib/axios.ts";
import type { Application, Status } from "@/types/application";

type ListResponse = {
  items: Application[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};

/**
 * This TypeScript function lists applications by status, with optional parameters for limit, sort, and
 * group ID.
 * @param {Status} status - The `status` parameter is used to filter the list of items based on their
 * status. It is required for the function to work properly.
 * @param [limit=1000] - The `limit` parameter in the `listByStatus` function specifies the maximum
 * number of items to be returned in the list. If not specified, the default limit is set to 1000.
 * @param [sort=position] - The `sort` parameter in the `listByStatus` function is used to specify the
 * sorting criteria for the list of applications. By default, it is set to "position", which means the
 * applications will be sorted based on their position. You can change this parameter to specify a
 * different sorting criteria if
 * @param {string | null} groupId - The `groupId` parameter in the `listByStatus` function is a string
 * or null value that represents the group ID. If a `groupId` is provided (not null), it will be added
 * to the query parameters for filtering the list of applications by group. If `groupId` is null,
 * @returns The function `listByStatus` returns an array of `Application` items fetched from the API
 * based on the provided `status`, `limit`, `sort`, and `groupId` parameters.
 */
export async function listByStatus(
  status: Status,
  limit = 1000,
  sort = "position",
  groupId: string | null
) {
  const params = new URLSearchParams();
  params.append("status", status);
  params.append("limit", String(limit));
  params.append("sort", sort);

  // Logika untuk menambahkan groupId ke query
  if (groupId) {
    // Jika ada groupId (string), tambahkan ke parameter.
    params.append("groupId", groupId);
  } else if (groupId === null) {
    // Jika groupId adalah null (artinya grup dibersihkan dari header),
    // kirim 'none' untuk mendapatkan data yang tidak terkelompok.
    params.append("groupId", "none");
  }

  const { data } = await api.get<{ items: Application[] }>(
    `/v1/application?${params.toString()}`
  );
  return data.items;
}

/**
 * This TypeScript function asynchronously retrieves application data based on the provided ID using an
 * API call.
 * @param {string} id - The `getApplication` function is an asynchronous function that takes a `string`
 * parameter `id`. This function makes a GET request to an API endpoint `/v1/application` with the
 * provided `id` as a query parameter. It then returns the data received from the API response.
 * @returns The `getApplication` function is returning the data fetched from the API endpoint
 * `/v1/application?id=`.
 */
export async function getApplication(id: string) {
  const { data } = await api.get(`/v1/application?id=${id}`);

  return data;
}

/**
 * The function `createApplication` sends a POST request to a specified API endpoint with the provided
 * payload data and returns the response data.
 * @param payload - The `payload` parameter in the `createApplication` function is of type
 * `Partial<Application>`, which means it is an object that may contain some or all of the properties
 * defined in the `Application` interface.
 * @returns The `createApplication` function is returning the data received from the POST request to
 * the "/v1/application" endpoint after creating a new application with the provided payload.
 */
export async function createApplication(payload: Partial<Application>) {
  const { data } = await api.post<Application>("/v1/application", payload);
  return data;
}

/**
 * This function updates an application with the specified ID using the provided payload data.
 * @param {string} id - The `id` parameter is a string that represents the unique identifier of the
 * application that you want to update.
 * @param payload - The `payload` parameter in the `updateApplication` function is a partial object of
 * type `Application`. This means that it contains a subset of properties that belong to the
 * `Application` type, allowing you to update only specific fields of an application object rather than
 * the entire object.
 * @returns The `updateApplication` function is returning the updated application data after making a
 * PATCH request to the API endpoint with the provided payload.
 */
export async function updateApplication(
  id: string,
  payload: Partial<Application>
) {
  const { data } = await api.patch<Application>(
    `/v1/application/${id}`,
    payload
  );
  return data;
}

/**
 * This TypeScript function deletes an application using the provided ID by making an asynchronous API
 * call.
 * @param {string} id - The `id` parameter is a string that represents the unique identifier of the
 * application that you want to delete.
 */
export async function deleteApplication(id: string) {
  await api.delete(`/v1/application/${id}`);
}

/**
 * This TypeScript function asynchronously reorders applications by sending updates to the server via
 * an API call.
 * @param {{ id: string; status: Status; position: number }[]} updates - An array of objects containing
 * the following properties for each application:
 */
export async function reorderApplications(
  updates: { id: string; status: Status; position: number }[]
) {
  await api.post("/v1/application/reorder", { updates });
}
