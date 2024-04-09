import React, { useState, useEffect } from 'react';
import backgroundImage from './background.jpg'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import NotificationModal from './NotificationModal';

function Profile() {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [showCountries, setShowCountries] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("History cleared successfully!");

  useEffect(() => {
    // Fetch the username
    axios.get('http://127.0.0.1:5000/getUsername')
      .then(response => {
        setUsername(response.data);
      })
      .catch(error => {
        console.error('Error fetching username:', error);
      });

    // Fetch the email
    axios.get('http://127.0.0.1:5000/getEmail')
      .then(response => {
        setEmail(response.data);
      })
      .catch(error => {
        console.error('Error fetching email:', error);
      });

    axios.get('http://127.0.0.1:5000/getCountry')
      .then(response => {
        setSelectedCountry(response.data);
      })
      .catch(error => {
        console.error('Error fetching country:', error);
      });
  }, []);

  const handleSelectCountry = (country) => {
    axios.post('http://127.0.0.1:5000/saveCountry', { country })
      .then(response => {
        setSelectedCountry(country);
      })
      .catch(error => {
        console.error('Error saving country:', error);
      });
    setShowCountries(false); // Close the accordion after selection
  };

  const clearRecipeHistory = () => {
    axios.get('http://127.0.0.1:5000/clearRecipeHistory')
      .then(response => {
        setShowModal(true);
          setTimeout(() => {
            setShowModal(false);
          }, 4000);
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
          setShowModal(true);
          setModalText("There is no recipe history to delete")
          setTimeout(() => {
            setShowModal(false);
          }, 4000); 
        }
        else
          console.error('Error cleairng recipe history:', error);
      });
  };

  return (
    <div style={{backgroundImage:`url(${backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      width: '100vw',
      height: '100vh',
      paddingTop: '20px'}}>
      <div className="profile-container" style={{ 
        backgroundColor: '#1f2937', 
        color: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        maxWidth: '400px', 
        margin: 'auto', 
        fontFamily: 'Arial, sans-serif' 
      }}>
        <h1 style={{ borderBottom: '1px solid #4b5563', paddingBottom: '10px', fontSize:'30px', marginBottom:'10px' }}><FontAwesomeIcon icon={faUser} style={{ paddingRight: '10px' }} />User Profile</h1>
        <div className="user-details" style={{ marginBottom: '20px' }}>
          <p><strong>Username:</strong> {username}</p>
          <p><strong>Email:</strong> {email}</p>
        </div>
        <div className="country-selector" style={{ marginBottom: '20px' }}>
          <button
            onClick={() => setShowCountries(!showCountries)}
            style={{ 
              padding: '10px', 
              cursor: 'pointer', 
              backgroundColor: 'transparent', 
              color: 'white', 
              border: '1px solid #4b5563', 
              width: '100%', 
              textAlign: 'left' 
            }}
          >
            Country: {selectedCountry || "Select a Country"}
          </button>
          {showCountries && (
            <div style={{ marginTop: '10px', border: '1px solid #4b5563', padding: '10px' }}>
              
              <button onClick={() => handleSelectCountry('Bangladesh')} style={{ display: 'block', margin: '5px 0', backgroundColor: 'transparent', color: 'white', textAlign: 'left' }}>
                Bangladesh
              </button>
              <button onClick={() => handleSelectCountry('Brazil')} style={{ display: 'block', margin: '5px 0', backgroundColor: 'transparent', color: 'white', textAlign: 'left' }}>
                Brazil
              </button>
              <button onClick={() => handleSelectCountry('China')} style={{ display: 'block', margin: '5px 0', backgroundColor: 'transparent', color: 'white', textAlign: 'left' }}>
                China
              </button>
              <button onClick={() => handleSelectCountry('France')} style={{ display: 'block', margin: '5px 0', backgroundColor: 'transparent', color: 'white', textAlign: 'left' }}>
                France
              </button>
              <button onClick={() => handleSelectCountry('Germany')} style={{ display: 'block', margin: '5px 0', backgroundColor: 'transparent', color: 'white', textAlign: 'left' }}>
                Germany
              </button>
              <button onClick={() => handleSelectCountry('India')} style={{ display: 'block', margin: '5px 0', backgroundColor: 'transparent', color: 'white', textAlign: 'left' }}>
                India
              </button>
              <button onClick={() => handleSelectCountry('Indonesia')} style={{ display: 'block', margin: '5px 0', backgroundColor: 'transparent', color: 'white', textAlign: 'left' }}>
                Indonesia
              </button>
              <button onClick={() => handleSelectCountry('Japan')} style={{ display: 'block', margin: '5px 0', backgroundColor: 'transparent', color: 'white', textAlign: 'left' }}>
                Japan
              </button>
              <button onClick={() => handleSelectCountry('Nigeria')} style={{ display: 'block', margin: '5px 0', backgroundColor: 'transparent', color: 'white', textAlign: 'left' }}>
                Nigeria
              </button>
              <button onClick={() => handleSelectCountry('Pakistan')} style={{ display: 'block', margin: '5px 0', backgroundColor: 'transparent', color: 'white', textAlign: 'left' }}>
                Pakistan
              </button>
              <button onClick={() => handleSelectCountry('Russia')} style={{ display: 'block', margin: '5px 0', backgroundColor: 'transparent', color: 'white', textAlign: 'left' }}>
                Russia
              </button>
              <button onClick={() => handleSelectCountry('Türkiye')} style={{ display: 'block', margin: '5px 0', backgroundColor: 'transparent', color: 'white', textAlign: 'left' }}>
                Türkiye
              </button>
              <button onClick={() => handleSelectCountry('United States')} style={{ display: 'block', margin: '5px 0', backgroundColor: 'transparent', color: 'white', textAlign: 'left' }}>
                United States
              </button>
              {/* Add more countries as needed */}
            </div>
          )}
        </div>
        <button
          onClick={clearRecipeHistory}
          style={{ 
            padding: '10px', 
            backgroundColor: 'red', 
            color: 'white', 
            cursor: 'pointer', 
            border: 'none', 
            width: '100%', 
            borderRadius: '4px' 
          }}
        >
          Clear Recipe History
        </button>
        <NotificationModal
          message={modalText}
          showModal={showModal}
          handleClose={() => setShowModal(false)}
        />
      </div>
    </div>
  );
}

export default Profile;