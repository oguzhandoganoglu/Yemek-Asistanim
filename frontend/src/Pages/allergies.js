import React, { useEffect, useState } from 'react';
import backgroundImage from './background.jpg'; // Background image import edildi
import axios from 'axios';

const allergiesData = [
  { id: 'celery', name: 'Celery', value: false },
  { id: 'crustaceans', name: 'Crustaceans', value: false },
  { id: 'egg', name: 'Egg', value: false },
  { id: 'fish', name: 'Fish', value: false },
  { id: 'gluten', name: 'Gluten', value: false },
  { id: 'lupin', name: 'Lupin', value: false },
  { id: 'milk', name: 'Milk', value: false },
  { id: 'moluscs', name: 'Moluscs', value: false },
  { id: 'mustard', name: 'Mustard', value: false },
  { id: 'peanuts', name: 'Peanuts', value: false },
  { id: 'sesame', name: 'Sesame', value: false },
  { id: 'soy', name: 'Soy', value: false },
];

function AlerjiListesi() {
  const [selectedAllergies, setSelectedAllergies] = useState(allergiesData);
  // http://localhost:5000/check_loginsession
  const checkLoginSession = () => {
    fetch('http://127.0.0.1:5000/check_loginsession', {
      method: 'GET',
      credentials: 'include'  // Ensure cookies are sent with the request
    })
    .then(response => response.json())
    .then(data => {
      if (data.logged_in) {
        console.log("User is logged in with ID:", data.user_id);
      } else {
        console.log("User is not logged in.");
      }
    })
    .catch(error => {
      console.error("Error checking login session:", error);
    });
  };

  useEffect(() => {
    // Fetch the allergies data when the component mounts
    axios.get('http://127.0.0.1:5000/allergiesPull')
      .then(response => {
        const fetchedAllergies = Object.entries(response.data).map(([name, value]) => ({
          id: name,
          name: name,
          value: value
        }))
        setSelectedAllergies(fetchedAllergies);
      })
      .catch(error => {
        console.error('Error fetching allergies:', error);
      });
  }, []);

  const updateAllergiesInBackend = (allergies) => {
    fetch('http://127.0.0.1:5000/update_allergies', { // Sunucu URL'niz
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(allergies),
      credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log("Allergies updated successfully");
      } else {
        console.error("Failed to update allergies:", data.message);
      }
    })
    .catch(error => {
      console.error("Error updating allergies:", error);
    });
  };

  const toggleCheckbox = (id) => {
    const updatedAllergies = selectedAllergies.map(allergy =>
      allergy.id === id ? { ...allergy, value: !allergy.value } : allergy
    );
    setSelectedAllergies(updatedAllergies);
    const allergiesForBackend = updatedAllergies.reduce((acc, allergy) => {
      acc[allergy.id] = allergy.value;
      return acc;
    }, {});
    updateAllergiesInBackend(allergiesForBackend);
  };

  const handleAllergySubmission = (updatedAllergies) => {
    const allergiesForBackend = updatedAllergies.reduce((acc, allergy) => {
      acc[allergy.id] = allergy.value;
      return acc;
    }, {});
    updateAllergiesInBackend(allergiesForBackend);
  };

  // Inline styles updated
  const styles = {
    container: {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      width: '100vw',
      height: 'auto', // Changed from 100vh to auto
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start', // Changed from center to flex-start
      paddingTop: '70px', // Adjusted padding to ensure no overlap with the top menu
      paddingBottom: '50px',
      boxSizing: 'border-box',
    },
    header: {
      fontSize: '24px',
      fontWeight: '300',
      backgroundColor: 'rgb(31, 41, 55)',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '5px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px',
      textAlign: 'center',
      width: '80%',
    },
    panel: {
      backgroundColor: 'rgba(255, 255, 255, 0.650)',
      padding: '20px',
      width: '80%',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      borderRadius: '5px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    checkboxContainer: {
      width: '100%',
      margin: '10px 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    label: {
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
    },
    checkbox: {
      margin: '0 10px 0 0',
      display: 'block',
      transform: 'scale(0.8)',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>Allergy Checklist</div>
      <div style={styles.panel}>
        {selectedAllergies.map(allergy => (
          <div key={allergy.id} style={styles.checkboxContainer}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={allergy.value}
                onChange={() => toggleCheckbox(allergy.id)}
                style={styles.checkbox}
              />
              {allergy.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AlerjiListesi;
