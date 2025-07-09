import { axiosInstance } from "../utils/axios";
import axios from "axios";

export const getCandidateDetails = async () => {
  try {
    const response = await axiosInstance.get("candidates_summary");
    // console.log("Candidate details fetched successfully:", response.data);

    return response.data.candidates;
  } catch (error) {
    console.error("Error fetching candidate details:", error);
    throw error;
  }
};

export const getCandidateDetailsByEmail = async (email) => {
  try {
    const response = await axiosInstance.post("candidate_search", { email });
    // console.log("Candidate details fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching candidate details by email:", error);
  }
};

export const deleteCandidate = async (id) => {
  // console.log(id.$oid);
  try {
    const response = await axiosInstance.delete("candidate_delete", {
      data: {
        candidate_id: id.$oid,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log("Candidate deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting candidate:", error);
    throw error;
  }
};
export const deleteCandidateForResumesList = async (id) => {
  // console.log(id);
  try {
    const response = await axiosInstance.delete("candidate_delete", {
      data: {
        candidate_id: id,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log("Candidate deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting candidate:", error);
    throw error;
  }
};
