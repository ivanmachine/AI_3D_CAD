import type { ModelDefinition } from "./cad";

export const fetchOpenAI = async (api_key: string, prompt: string, existingModel: ModelDefinition): Promise<ModelDefinition | null> => {
    if(!api_key) throw new Error('No API key found');
    if(!prompt) throw new Error('No prompt provided');
    if(!existingModel) throw new Error('No existing model provided');
    
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${api_key}`
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a JSON-only assistant. You must respond with valid JSON only, no explanatory text. Your response should be parseable by JSON.parse().'
                    },
                    {
                        role: 'user',
                        content: `Given this model: ${JSON.stringify(existingModel)}\n\nTask: ${prompt}\n\nRespond with valid JSON only.`
                    }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        
        if (!data.choices?.[0]?.message?.content) {
            throw new Error('Invalid response from OpenAI API');
        }
        
        const jsonString = data.choices[0].message.content.trim();
        const parsedResponse = JSON.parse(jsonString);
        
        if (!parsedResponse) {
            throw new Error('Failed to parse response as JSON');
        }
        
        return parsedResponse as ModelDefinition;
        
    } catch (error) {
        console.error('OpenAI API Error:', error);
        return null;
    }
}