import { BASE_URL } from "@/Envirnoment/Envirnoment";

// It's a good practice to define a type for your API response objects
interface ApiWordResponse {
  word: string;
  score: number;
  // add other properties here
}

export const HandleSearchAPI = async (query: string): Promise<ApiWordResponse[]> => {
    // Return early if the query is empty to avoid unnecessary API calls
    if (!query.trim()) {
        return [];
    }
    
    const apiUrl = `${BASE_URL}words?sp=*${query}*`; 
    
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            // If the server responds with an error, throw it to be caught by the catch block
            throw new Error(`API call failed with status: ${response.status}`);
        }

        const data: ApiWordResponse[] = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch search results:", error);
        // Return an empty array on error to prevent the app from crashing
        return [];
    }
}
