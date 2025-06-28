
-- Insert default hackathon sources
INSERT INTO mysql_datasource.hackathon.hackathon_sources (name, url, provider, is_active, created_by) VALUES
('Devpost Hackathons', 'https://devpost.com/api/hackathons?challenge_type[]=online&open_to[]=public&order_by=recently-added&status[]=upcoming&status[]=open', 'devpost', TRUE, 'admin'),
('TopCoder Challenges', 'https://api.topcoder.com/v5/challenges/?status=Active&currentPhaseName=Registration&perPage=10&page=1&sortBy=startDate&sortOrder=desc&tracks[]=DS&tracks[]=Des&tracks[]=Dev&tracks[]=QA&types[]=CH&types[]=F2F&types[]=MM&types[]=TSK', 'topcoder', TRUE, 'admin'),
('Quira Quests', 'https://cosmos.quine.sh/api/cosmos/creators/quest-index/?user_id=0', 'quira', TRUE, 'admin');