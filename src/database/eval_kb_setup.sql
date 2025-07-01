CREATE TABLE IF NOT EXISTS mysql_datasource.eval_hackathons (
    content TEXT
);

EVALUATE KNOWLEDGE_BASE hack_kb
USING
    test_table = mysql_datasource.hackathon.eval_hackathons,
    version = 'llm_relevancy',
    generate_data = true, 
    evaluate = false,
    llm = {
        'provider': 'openai',
        'model_name' : 'gpt-4.1-mini',
        'api_key': '<openai_api_key>'
    };