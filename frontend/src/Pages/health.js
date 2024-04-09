import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeartPulse } from '@fortawesome/free-solid-svg-icons'
import backgroundImage from './background.jpg'
import axios from 'axios';
import {Rings} from 'react-loader-spinner';

function Health() {
    const [healthTip, setHealthTip] = useState({
        overall_assessment: '',
        suggestions: {},
        dietary_recommendations: {}
      });
    const [isFirst , setIsFirst] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Fetch the diet data when the component mounts
        axios.get('http://127.0.0.1:5000/pullTip')
          .then(response => {
            // Transform the object into an array and update the state
            if(response.data === "")
                setIsFirst(true);
            else{
                setHealthTip(response.data);
                setIsFirst(false);
            }
          
        })
        .catch(error => {
            console.error('Error fetching diets:', error);
        });
      }, []);
    // Styles for the components
  const styles = {
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.650)',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      maxWidth: '1000px',
      margin: 'auto',
      textAlign: 'center',
    },
    tip: {
      fontSize: '16px',
      color: 'black',
      marginBottom: '20px',
    },
    button: {
      backgroundColor: '#1f2937',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      padding: '10px 20px',
      cursor: 'pointer',
      fontSize: '16px',
    },
    }

    // Function to update health data (placeholder for actual API call)
    const updateHealthData = () => {
        setIsLoading(true);
    // Simulate fetching new health data
    // Replace with actual API call to fetch new data
        axios.get('http://127.0.0.1:5000/healthAiReq')
        .then(response => {
        // Transform the object into an array and update the state
            setHealthTip(response.data);
            setIsLoading(false);
        })
        .catch(error => {
        console.error('Error fetching diets:', error);
        });
    };

    const renderSuggestions = (suggestions) => {
        // Check if suggestions is an object and has keys
        if (Array.isArray(suggestions)) {
            return (
              <ul style={{ listStyleType: 'disc' }}>
                {suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            );
        }
        else if (typeof suggestions === 'object' && suggestions !== null && Object.keys(suggestions).length > 0) {
          return (
            <ul style={{ listStyleType: 'disc' }}>
              {Object.entries(suggestions).map(([key, value]) => (
                <li key={key}><strong>{key.replace(/_/g, ' ')}:</strong> {value}</li>
              ))}
            </ul>
          );
        } else if (typeof suggestions === 'string') {
          // If suggestions is a string, just return it in a paragraph
          return <p>{suggestions}</p>;
        } else {
          // If suggestions is neither an object nor a string, or is null/undefined
          return <p>No suggestions available.</p>;
        }
      };
  
    return (
        <div style={{backgroundImage:`url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            width: '100vw',
            height: '100vh',
            paddingTop: '20px'}}>
            {isLoading ? 
            (<Rings
                visible={true}
                height="140"
                width="140"
                color="#1f2937"
                ariaLabel="rings-loading"
                wrapperStyle={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                backgroundColor: "#f7f7f700",
                }}
                wrapperClass=""
            />
            ) : 
            (
                <div style={styles.card}>
                    {isFirst? 
                        (<>
                            <h2>Looks like you have not made any recipe yet. Make your first recipe to get your health tip!</h2>
                        </>) : 
                        (<>
                            <div style={{textAlign:"left", paddingBottom:"10px"}}>
                                <h2 style={{fontSize:"18px"}}><strong>Overall Assessment:</strong></h2>
                                <p style={{paddingLeft:"20px"}}>{healthTip.overall_assessment}</p>
                                <h3 style={{fontSize:"18px"}}><strong>Suggestions:</strong></h3>
                                    <div style={{paddingLeft:"20px"}}>
                                    <ul style={{ listStyleType: 'disc' }}> 
                                        {renderSuggestions(healthTip.suggestions)}
                                    </ul>
                                    </div>
                                <h3 style={{fontSize:"18px"}}><strong>Dietary Recommendations:</strong></h3>
                                    <div style={{paddingLeft:"20px"}}>
                                    <ul style={{ listStyleType: 'disc' }}>
                                        {renderSuggestions(healthTip.dietary_recommendations)}
                                    </ul>
                                    </div>
                            </div>
                            <button style={styles.button} onClick={updateHealthData}>
                                    <FontAwesomeIcon icon={faHeartPulse} style={{paddingRight:"5px"}}/>
                                    Update the Tip!
                            </button>
                        </>
                        
                    )}
                </div>
            ) }
        </div>
    );
  };
  
  

export default Health