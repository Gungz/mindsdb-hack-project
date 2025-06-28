-- MindsDB Schema for Hackathon Aggregator
-- This file contains the SQL commands to set up the database structure

CREATE DATABASE mysql_datasource
WITH ENGINE = 'mysql', 
PARAMETERS = {
    "host": "127.0.0.1",
    "port": 3306,
    "database": "hackathon",
    "user": "root",
    "password": "root"
};

-- Create admin_users table
CREATE TABLE IF NOT EXISTS mysql_datasource.admin_users (
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    is_active BOOLEAN DEFAULT `true`,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create hackathon_sources table (for admin configuration)
CREATE TABLE IF NOT EXISTS mysql_datasource.hackathon_sources (
    name VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT `TRUE`,
    api_key VARCHAR(255) NULL,
    headers JSON NULL,
    last_fetched TIMESTAMP NULL,
    hackathons_count INT DEFAULT `0`,
    fetch_interval_hours INT DEFAULT `24`,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create hackathons table
CREATE TABLE IF NOT EXISTS mysql_datasource.hackathons (
    external_id VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    total_prize VARCHAR(100),
    start_date DATE,
    end_date DATE,
    registration_url VARCHAR(500),
    image_url VARCHAR(500),
    organizer VARCHAR(100),
    location VARCHAR(200),
    type VARCHAR(100),
    status VARCHAR(100),
    source_name VARCHAR(255),
    tags JSON,
    raw_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create knowledge base
CREATE KNOWLEDGE_BASE hack_kb
USING
    embedding_model = {
        "provider": "openai",
        "model_name" : "text-embedding-3-small",
        "api_key": "<openai_api_key>"
    },
    reranking_model = {
        "provider": "openai",
        "model_name" : "gpt-4.1-mini",
        "api_key": "<openai_api_key>"
    },
    preprocessing = {
        "text_chunking_config" : {
            "chunk_size": 2000,
            "chunk_overlap": 200
        }
    },
    metadata_columns = ['provider', 'total_prize', 'start_date', 'end_date',  'registration_url'],
    content_columns = ['description'],
    id_column = 'external_id';

-- Create web crawler
CREATE DATABASE hack_web 
WITH ENGINE = 'web';

-- Create agent
CREATE AGENT hack_description_agent
USING
    model = 'gemini-2.5-flash',
    google_api_key= '<google_api_key>',
    include_tables=['hack_web.crawler'],
    prompt_template = '
        You are a mindsb agent that help user crawl data about hackathon, structure the data from text format and generate description for hackathon in markdown format. You will be given a URL, fetch the information, and structure it in markdown format.
        hack_web.crawler crawls website to fetch hackathon data, use the query like "select * from hack_web.crawler WHERE url = <given_url> and crawl_depth=0" to fetch the hackathon data in text_content column. Return only description, no preamble.
    ';

-- Create job
CREATE JOB insert_to_kb_job (

    INSERT INTO hack_kb
    SELECT external_id, source_name as provider, total_prize, start_date, end_date, registration_url, description
    FROM mysql_datasource.hackathon.hackathons
    WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 MINUTE)
)
EVERY 1 min;

-- Create gemini engine
CREATE ML_ENGINE google_gemini_engine
FROM google_gemini
USING
      api_key = '<google_api_key>';

CREATE MODEL tag_generation_model
PREDICT tag
USING
    engine = 'google_gemini_engine',
    model_name = 'gemini-2.5-flash',
    prompt_template = 'generate 3 tags of this hackathon challenge description {{description}} containing whether it is beginner friendly (use one of "beginner", "intermediate", "advanced") and add at least 2 technologies as tag, remember it must be 3 tags only, generate it in array like this example ["beginner friendly", "blockchain", "python"]';

CREATE MODEL metadata_generation_model
PREDICT metadata
USING
    engine = 'google_gemini_engine',
    model_name = 'gemini-2.5-flash',
    prompt_template = 'Without preamble, return possible metadata value from this question {{question}} that includes total_prize (number), start_date (YYYY-MM-DD), end_date (YYYY-MM-DD), provider (could be one of Topcoder, Quira, Devpost), registration_url (a URL) in JSON like this example {"total_prize": 10000, "start_date": "2025-07-30", "end_date": "2025-08-30", "provider": "topcoder", "registration_url": "https://devpost.com"}. End date should always be greater than start date. Do not include the element in JSON if not found from question and do not make the value up. For your context, today is {{today}}';

CREATE MODEL chat_generation_model
    PREDICT response
    USING
        engine = 'google_gemini_engine',
        model_name = 'gemini-2.5-flash',
        prompt_template = 'Generate chat response to user from this information {{information}} and question {{question}} by summarizing the information that contains hackathon information. Ensure response include registration url, total prize, start date, end date for each hackathon and no duplicate. For your context, today is {{today}}';