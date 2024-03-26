import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa'; // Import close icon from react-icons
import backgroundImage from './background.jpg'

const dietsData = [
  { id: 1, name: 'Keto', definition: 'A diet high in fat and low in carbs.' },
  { id: 2, name: 'Paleo', definition: 'A diet based on the types of foods presumed to have been eaten by early humans.' },
  // Add more diets as needed
];

function Diets() {
  const [diets, setDiets] = useState(dietsData);

  const removeDiet = (id) => {
    const updatedDiets = diets.filter((diet) => diet.id !== id);
    setDiets(updatedDiets);
  };

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
  th: {
    backgroundColor: 'rgb(31, 41, 55)',
    color: 'white',
    fontWeight: 'normal',
    padding: '10px 15px',
    textTransform: 'uppercase',
    textAlign:'justify'
  },
  td: {
    padding: '10px 15px',
    borderBottom: '1px solid #ddd',
    backgroundColor: '#FFFFFF',
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
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Diet Name</th>
            <th style={styles.th}>Diet Definition</th>
            <th style={styles.th}></th>
          </tr>
        </thead>
        <tbody>
          {diets.map((diet) => (
            <tr key={diet.id}>
              <td style={styles.td}>{diet.name}</td>
              <td style={styles.td}>{diet.definition}</td>
              <td style={styles.td}>
                <button onClick={() => removeDiet(diet.id)} style={{ border: 'none', background: 'none' }}>
                  <FaTimes /> {/* This is the close icon */}
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