const API_URL = 'https://api.github.com/users/';

export const fetchUser = async (username) => {
  const response = await fetch(`${API_URL}${username}`);
  const data = await response.json();
  return data;
};

export const sendProfile = async (webhookURL, profile) => {
  return await fetch(webhookURL, {
    method: 'POST',
    body: JSON.stringify(profile),
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'no-cors',
  });
};
