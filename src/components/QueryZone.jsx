import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import '../styles/QueryZone.css';
import envoyerIcon from '../assets/envoyer.png';

function QueryZone({ onSend }) {
  const [query, setQuery] = useState('');

  const sendMessage = () => {
    if (query.trim() === '') return;

    const sanitizedQuery = DOMPurify.sanitize(query);
    if (sanitizedQuery.trim() === '') return;

    onSend(sanitizedQuery);
    setQuery('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="query-zone">
      <input
        name="query"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Tape ton message..."
      />
      <button onClick={sendMessage} className="query-submit-button">
        <img src={envoyerIcon} alt="Envoyer" />
      </button>
    </div>
  );
}

export default QueryZone;