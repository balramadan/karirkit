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
 * The function `listByStatus` retrieves a list of items based on a specified status, with optional
 * parameters for limit and sorting.
 * @param {Status} status - Status of the applications to list. It is a required parameter for
 * filtering the applications based on their status.
 * @param [limit=1000] - The `limit` parameter in the `listByStatus` function specifies the maximum
 * number of items to be returned in the list. By default, it is set to 1000 if no value is provided
 * when calling the function.
 * @param [sort=position] - The `sort` parameter in the `listByStatus` function is used to specify the
 * sorting criteria for the list of items retrieved from the API. In this case, the default sorting
 * criteria is set to "position". This means that the items will be sorted based on their position in
 * the list by
 * @returns The function `listByStatus` is returning a list of items with the specified status, limited
 * by the provided limit, and sorted based on the specified criteria.
 */
export async function listByStatus(
  status: Status,
  limit = 1000,
  sort = "position"
) {
  const { data } = await api.get<ListResponse>("/api/application", {
    params: { status, limit, sort },
  });
  return data.items;
}

/**
 * This TypeScript function asynchronously retrieves application data based on the provided ID using an
 * API call.
 * @param {string} id - The `getApplication` function is an asynchronous function that takes a `string`
 * parameter `id`. This function makes a GET request to an API endpoint `/api/application` with the
 * provided `id` as a query parameter. It then returns the data received from the API response.
 * @returns The `getApplication` function is returning the data fetched from the API endpoint
 * `/api/application?id=`.
 */
export async function getApplication(id: string) {
  const { data } = await api.get(`/api/application?id=${id}`);

  return data;
}

/**
 * The function `createApplication` sends a POST request to a specified API endpoint with the provided
 * payload data and returns the response data.
 * @param payload - The `payload` parameter in the `createApplication` function is of type
 * `Partial<Application>`, which means it is an object that may contain some or all of the properties
 * defined in the `Application` interface.
 * @returns The `createApplication` function is returning the data received from the POST request to
 * the "/api/application" endpoint after creating a new application with the provided payload.
 */
export async function createApplication(payload: Partial<Application>) {
  const { data } = await api.post<Application>("/api/application", payload);
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
    `/api/application/${id}`,
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
  await api.delete(`/api/application/${id}`);
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
  await api.post("/api/application/reorder", { updates });
}
