import React, { useRef, useState } from 'react';
import './App.css';
import { useNetwork } from './context/useNetwork';
import { fetchUser } from './services/api';

const App = () => {
  const [user, setUser] = useState(null);
  const { sendRequest } = useNetwork();
  const inputRef = useRef();

  const webhookInput = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = inputRef.current.value;
    const data = await fetchUser(username);
    setUser(data);
  };

  const handleSendUserProfile = async (e) => {
    e.preventDefault();

    const webhookURL = webhookInput.current.value;

    if (!webhookURL) {
      alert('Please enter a webhook');
      return;
    }

    await sendRequest({
      url: webhookURL,
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    // await sendProfile(webhookURL, user);
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          gap: '2rem',
        }}
      >
        <form onSubmit={handleSubmit}>
          <h1>Get Your GitHub Profile</h1>
          <input
            placeholder="username"
            value="robertheory"
            type="text"
            ref={inputRef}
          />
          <button type="submit">Submit</button>
        </form>

        {user ? (
          <div class="user">
            <h2>{user.name}</h2>
            <img
              src={user.avatar_url}
              alt="avatar"
              style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%',
              }}
            />
            <p>{user.bio}</p>

            <div className="webhook">
              <h3>Send user profile to webhook</h3>

              <a href="'https://webhook.site/'">Get a webhook URL here</a>
              <form onSubmit={handleSendUserProfile}>
                <input
                  placeholder="webhook"
                  type="text"
                  defaultValue="https://webhook.site/"
                  ref={webhookInput}
                />
                <button type="submit">Send</button>
              </form>
            </div>
          </div>
        ) : (
          <p>Search for a user</p>
        )}
      </div>
    </>
  );
};

export default App;
