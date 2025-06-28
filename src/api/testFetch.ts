import { HackathonAPI } from "./hackathons";

async function fetchHackathonData() {
  await HackathonAPI.fetchAndStoreHackathons("https://api.topcoder.com/v5/challenges/?status=Active&currentPhaseName=Registration&perPage=10&page=1&sortBy=startDate&sortOrder=desc&tracks[]=DS&tracks[]=Des&tracks[]=Dev&tracks[]=QA&types[]=CH&types[]=F2F&types[]=MM&types[]=TSK", "topcoder");
  //await HackathonAPI.fetchAndStoreHackathons("https://devpost.com/api/hackathons?challenge_type[]=online&open_to[]=public&order_by=recently-added&status[]=upcoming&status[]=open", "devpost");
  //await HackathonAPI.fetchAndStoreHackathons("https://cosmos.quine.sh/api/cosmos/creators/quest-index/?user_id=0", "quira");
}

// Run the setup
fetchHackathonData().then(() => {
  console.log('hackathon data fetched successfully');
}).catch(error => {
  console.error('💥 Setup failed:', error);
  process.exit(1);
});