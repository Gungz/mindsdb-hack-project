// /home/gungz87/project/src/api/fetcher.ts (New File)
async function fetchHackathonData(url: string): Promise<any[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching hackathon data:", error);
    return []; // Return an empty array in case of an error
  }
}

export { fetchHackathonData };
