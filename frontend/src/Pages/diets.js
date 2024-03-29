import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa'; // Import close icon from react-icons
import backgroundImage from './background.jpg'
import axios from 'axios';
import Modal from 'react-modal';
import './Recipe.css';

const dietsData = [
  { id: 1, name: 'Keto', definition: 'A diet high in fat and low in carbs.' },
  { id: 2, name: 'Paleo', definition: 'A diet based on the types of foods presumed to have been eaten by early humans.' },
  // Add more diets as needed
];

function Diets() {
  const [diets, setDiets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [dietToRemove, setDietToRemove] = useState(null);

  useEffect(() => {
    // Fetch the diet data when the component mounts
    axios.get('http://127.0.0.1:5000/fireBaseDiyetPull')
      .then(response => {
        // Transform the object into an array and update the state
        const fetchedDiets = Object.entries(response.data).map(([name, definition]) => ({
          id: name, // Use the diet name as a unique key
          name,
          definition
        }));
        setDiets(fetchedDiets);
      })
      .catch(error => {
        console.error('Error fetching diets:', error);
      });
  }, []);

  const handleRemoveClick = (diet) => {
    setDietToRemove(diet);
    setShowModal(true);
  };

  const confirmRemoveDiet = () => {
    axios.get(`http://127.0.0.1:5000/dietRemove/${dietToRemove}`)
    .then(response => {
      axios.get('http://127.0.0.1:5000/fireBaseDiyetPull')
        .then(response => {
          // Transform the object into an array and update the state
          const fetchedDiets = Object.entries(response.data).map(([name, definition]) => ({
            id: name, // Use the diet name as a unique key
            name,
            definition
          }));
          setDiets(fetchedDiets);
        })
        .catch(error => {
          console.error('Error fetching diets:', error);
        });
      
      setShowModal(false);
    })
    .catch(error => {
      console.error('Error removing diet:', error);
    });
  };

const th = {
  backgroundColor: 'rgb(31, 41, 55)',
  color: 'white',
  fontWeight: 'normal',
  padding: '10px 15px',
  textTransform: 'uppercase',
  textAlign:'justify',
  width:'15vw'
}

const td = {
  padding: '10px 15px',
  borderBottom: '1px solid #ddd',
  backgroundColor: 'rgba(255, 255, 255, 0.650)' 
}

// Inline styles
const styles = {
  table: {
    width: '80%',
    margin: 'auto',
    paddingTop: '20px',
    borderCollapse: 'separate',
    borderSpacing: '0',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  thD: {
    ...th,
    width:'150vw'
  },
  tdX: {
    ...td,
    textAlign: "center"
  },
  checkbox: {
    margin: 'auto',
    display: 'block',
  },
  header: {
    textAlign: 'center',
    padding: '10px 0',
    fontSize: '24px',
    fontWeight: '300',
    color: '#333',
  },
};

  return (
    <div style={{
      backgroundImage:`url(${backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      width: '100vw',
    height: '100vh'
    }}>
      {showModal && (
        <Modal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          contentLabel="Confirm Diet Removal"
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <p style={{margin:"revert"}}>Are you sure you want to delete {dietToRemove}?</p>
          <div style={{
              display: "flex",
              justifyContent:"space-around",
              backgroundColor: "rgba(255, 255, 255, 0)",
              paddingBottom:"20px"
          }}>
            <button onClick={confirmRemoveDiet} className="yes-button">Yes</button>
            <button onClick={() => setShowModal(false)} className="no-button">No</button>
          </div>
        </Modal>
      )}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={th}>Diet Name</th>
            <th style={styles.thD}>Diet Definition</th>
            <th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {diets.map((diet) => (
            <tr key={diet.id}>
              <td style={td}>{diet.name}</td>
              <td style={td}>{diet.definition}</td>
              <td style={styles.tdX}>
                <button onClick={() => handleRemoveClick(diet.name)} style={{ border: 'none', background: 'none' }}>
                  <FaTimes color='red' size='25px'/> {/* This is the close icon */}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Diets