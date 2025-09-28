// background.js - handles API calls
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'analyzeEducationalValue') {
      analyzeEducationalContent(request.data)
        .then(result => sendResponse(result))
        .catch(error => sendResponse({ error: error.message }));
      return true; // Keep message channel open for async response
    }
  });

  async function analyzeEducationalContent(contentData) {
    const API_KEY = 'AIzaSyDaYOrSWaRosY3wiwlOfQQTKKd9hGmkcp0'; // TODO: Move to environment variable

    console.log('Starting API call with data:', contentData);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analyze this social media content for EDUCATIONAL VALUE (0-100 scale):

              Platform: ${contentData.platform}
              Content: "${contentData.text}"

              Rate this content's educational value where:
              - 0-30 = Low educational value (entertainment/mindless content)
              - 31-60 = Some educational elements (moderate learning potential)
              - 61-80 = Good educational content (teaches valuable skills/knowledge)
              - 81-100 = Highly educational (excellent learning, skill development, knowledge sharing)

              Consider: Does this content teach something valuable? Share knowledge? Develop skills? Provide intellectual stimulation? Encourage learning?

              Respond with exactly: SCORE: [number] | REASON: [max 6 words explanation]`
            }]
          }]
        })
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error('Invalid response structure:', data);
        throw new Error('Invalid API response structure');
      }

      const aiResponse = data.candidates[0].content.parts[0].text;
      
      // Parse AI response
      const scoreMatch = aiResponse.match(/SCORE:\s*(\d+)/);
      const reasonMatch = aiResponse.match(/REASON:\s*(.+)/);
      
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 50;
      const reason = reasonMatch ? reasonMatch[1] : "Content analysis completed";
      
      return {
        score: score,
        reason: reason,
        category: score >= 80 ? 'HIGH' : score >= 60 ? 'MODERATE' : 'LOW'
      };
      
    } catch (error) {
      console.error('Analysis error:', error);
      return { error: 'Analysis failed', score: 50, reason: 'Could not analyze educational value' };
    }
  }