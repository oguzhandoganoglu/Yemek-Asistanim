import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useSpring, animated } from 'react-spring';
import './Recipe.css';
import backgroundImage from './background.jpg'
import Modal from 'react-modal';
import axios from 'axios';
import {Rings} from 'react-loader-spinner';

Modal.setAppElement('#root');

function Recipe() {
  const [liked, setLiked] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [dislikeReason, setDislikeReason] = useState('');
  const [showRecipe, setShowRecipe] = useState(false);
  const [recipeData, setRecipeData] = useState({ title: '', instructions:[], ingredients:[] }); // State to store recipe data
  const [isLoading, setIsLoading] = useState(false);
  const [recipeToSend, setRecipeToSend] = useState({});


  // Define the animation for the button
  const [buttonStyle, setButtonStyle] = useSpring(() => ({
    transform: 'scale(1)',
    config: { mass: 1, tension: 350, friction: 5 }
  }));

  // animation for button appearance
  const [buttonAppearStyle, setButtonAppearStyle] = useSpring(() => ({
    from: { transform: 'scale(0)' },
    to: { transform: 'scale(1)' },
    reset: !showRecipe,
    reverse: showRecipe,
  }));

  // Function to handle button click and show recipe
  const handleButtonClick = () => {
    setIsLoading(true);
    axios.get('http://127.0.0.1:5000/openAiReq').then(response => {
      const { meal, ingredients, instructions } = response.data;

      const ingredientsToSend = ingredients.join(', ');
      const recipeToSend = {
        [meal]: ingredientsToSend
      };

      setRecipeToSend(recipeToSend);

      const formattedInstructions = instructions.map((instruction, index) => {
        return `Step ${index + 1}: ${instruction}`;
      });

      setRecipeData({
        title: meal,
        instructions: formattedInstructions,
        ingredients: ingredients
      });
      
      setIsLoading(false);
      setShowRecipe(true);
    }).catch(error => {
      console.error('Error fetching recipe:', error);
      setIsLoading(false);
    });
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleDislike(),
    onSwipedRight: () => setLiked(true),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  const animProps = useSpring({
    opacity: liked != null ? 0 : 1,
    transform: `translateX(${liked === true ? 100 : liked === false ? -100 : 0}px)`
  });

  const handleLike = () => {
    setLiked(true); // Start the "liked" animation
    axios.post('http://127.0.0.1:5000/postRecipeHistory/recipeToSend', recipeToSend)
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error('There was an error!', error);
    });
    // Wait for the animation to complete before resetting states
    setTimeout(() => {
      setLiked(null); // Reset the liked state
      setShowRecipe(false); // Hide the recipe and show the suggestion button again
      setTimeout(() => {
        setButtonAppearStyle({ reset: true });
      }, 10);
    }, 200); 
  };

  const handleDislike = () => {
    setLiked(false);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setShowRecipe(false); // Hide the recipe
    setLiked(null); // Reset liked state
    setDislikeReason('');
  };

  const handleSubmit = () => {
    axios.get(`http://127.0.0.1:5000/qdrantSearch?dislikeReason=${encodeURIComponent(dislikeReason)}`)
      .then(response => {
        console.log(response.data); // Handle the response data
        closeModal();
      })
      .catch(error => {
        console.error('Error:', error);
      });
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
      {isLoading && 
        <Rings
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
      }
      {!showRecipe && !isLoading && (
        <animated.div style={{ ...buttonAppearStyle, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>

          <animated.button
            style={buttonStyle}
            onMouseEnter={() => setButtonStyle({ transform: 'scale(1.1)' })}
            onMouseLeave={() => setButtonStyle({ transform: 'scale(1)' })}
            onClick={handleButtonClick}
            className="suggest-button"
          >
            Tarif öner!
          </animated.button>
        </animated.div>
      )}
      {showRecipe && <div style={{
          backgroundImage:`url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: '100vw',
          height: '100vh'}}>
        <animated.div className="Recipe" {...swipeHandlers} style={animProps}
        >
          <div className="recipe-card" style={{ textAlign: 'left', maxWidth: '600px', margin: 'auto' }}>
            <h3>{recipeData.title}</h3>
            <div style={{backgroundColor:"rgb(31, 41, 55)"}}>
            <h4 style={{paddingLeft:"20px", color:"#fff"}}><strong>Ingredients:</strong></h4>
            <ul style={{paddingLeft:"40px", paddingRight:"10px", color:"#fff", listStyleType: 'disc'}}>
              {recipeData && recipeData.ingredients && recipeData.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>

            <h4 style={{paddingLeft:"20px", color:"#fff"}}><strong>Instructions:</strong></h4>
            <ol style={{paddingLeft:"30px" , paddingRight:"10px", color:"#fff"}}>
              {recipeData.instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
            </div>
            <div className="buttons">
              <button onClick={handleLike} className="yes-button">Yes</button>

              <button onClick={handleDislike} className="no-button">No</button>
            </div>
          </div>
        </animated.div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Dislike Reason Modal"
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <button onClick={closeModal} className="close-modal-button">&times;</button>
          <h2>Tell us why you didn't like the recipe:</h2>
          <textarea 
            style={
              {resize: "both", height:"200px", width:"400px", maxWidth:"440px", marker:"initial", paddingBlockStart:"5px", border:"groove"}
            }
            value={dislikeReason}
            onChange={(e) => setDislikeReason(e.target.value)}
          />
          <button className='submit-button' onClick={handleSubmit}>Submit</button>

        </Modal>
        </div>
      }
    </div>
  );
}

export default Recipe;