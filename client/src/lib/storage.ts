import { api } from "./axios";

const baseAPIUrl = import.meta.env.VITE_API_BASE_URL;

/**
 * The function `uploadCv` uploads a file (CV) using FormData to a specified API endpoint.
 * @param {File} file - The `file` parameter in the `uploadCv` function is expected to be a `File`
 * object, which represents a file from the user's system that needs to be uploaded.
 * @returns The `uploadCv` function is returning the data from the response of the API POST request.
 */
export async function uploadCv(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(`/storage/cvs`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}

/**
 * This TypeScript function asynchronously fetches a list of CVs from a specified API endpoint and
 * returns the data containing an array of CV objects.
 * @returns The `getCvs` function is returning the data from the response received after making a GET
 * request to ` /storage/cvs`. The expected response is an object with a property `cvs`
 * which is an array of CV objects.
 */
export async function getCvs() {
  const response = await api.get(`/storage/cvs`);
  return response.data; // Mengharapkan balasan: { cvs: CV[] }
}

/**
 * This TypeScript function deletes a CV by sending a DELETE request to a specific API endpoint.
 * @param {string} cvId - The `cvId` parameter is a string that represents the unique identifier of the
 * CV (Curriculum Vitae) that you want to delete.
 * @returns The function `deleteCv` is returning the data from the response, which is expected to be an
 * object with a `message` property of type string.
 */
export async function deleteCv(cvId: string) {
  const response = await api.delete(`/storage/cvs/${cvId}`);
  return response.data; // Mengharapkan balasan: { message: string }
}

/**
 * The function `uploadCoverLetter` asynchronously uploads a cover letter file using FormData and
 * returns the response data.
 * @param {File} file - The `file` parameter in the `uploadCoverLetter` function is expected to be a
 * File object, which represents a file from the user's system that will be uploaded as the cover
 * letter.
 * @returns The `uploadCoverLetter` function is returning the data from the response of the POST
 * request made to the specified API endpoint for uploading cover letters.
 */
export async function uploadCoverLetter(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(
    `/storage/cover-letters`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data;
}

/**
 * This function asynchronously fetches a cover letter from a specified API endpoint.
 * @returns The `getCoverLetter` function is returning the data fetched from the API endpoint for cover
 * letters.
 */
export async function getCoverLetter() {
  const response = await api.get(`/storage/cover-letters`);
  return response.data;
}

/**
 * This TypeScript function deletes a cover letter by sending a DELETE request to a specific API
 * endpoint.
 * @param {string} coverLetterId - The `coverLetterId` parameter is a string that represents the unique
 * identifier of the cover letter that you want to delete. This identifier is used to locate the
 * specific cover letter in the database and remove it from storage.
 * @returns The function `deleteCoverLetter` is returning the data from the response, which is expected
 * to be an object with a `message` property of type string.
 */
export async function deleteCoverLetter(coverLetterId: string) {
  const response = await api.delete(
    `${baseAPIUrl} /storage/cover-letters/${coverLetterId}`
  );
  return response.data; // Mengharapkan balasan: { message: string }
}

export async function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(`/storage/avatar`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
