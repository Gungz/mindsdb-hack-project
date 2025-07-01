EVALUATE KNOWLEDGE_BASE hack_kb
USING
    test_table = mysql_datasource.hackathon.eval_hackathons,
    version = 'llm_relevancy',
    generate_data = false, 
    evaluate = true,
    llm = {
        'provider': 'openai',
        'model_name' : 'gpt-4.1-mini',
        'api_key': '<openai_api_key>'
    };