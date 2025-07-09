import { axiosInstance } from "../utils/axios";
import { getCandidateDetailsByEmail } from "./getCandidateDetails";

export async function parseResume(formData) {
  try {
    const response = await axiosInstance.post(
      "analyze_resumes_batch",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(response);
    return response.data.summary.results;

    //

    // const candiadate_data = await axiosInstance("/candidate_search", email);
    // return candiadate_data.data;
  } catch (error) {}
}
