const API_BASE_URL = 'https://sfe-backend-predict.onrender.com';

interface MatchDetails {
  batting_team: string;
  bowling_team: string;
  venue: string;
  target: number;
  current_score: number;
  wickets_left: number;
  balls_left: number;
}

export const getPrediction = async (matchDetails: MatchDetails) => {
  try {
    console.log('Sending request to:', `${API_BASE_URL}/predict`);
    console.log('Request body:', JSON.stringify(matchDetails));

    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(matchDetails),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Error response:', response.status, errorBody);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }

    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error in getPrediction:', error);
    throw error;
  }
};

export const getTeams = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/teams`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

export const getVenues = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/venues`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching venues:', error);
    throw error;
  }
};
