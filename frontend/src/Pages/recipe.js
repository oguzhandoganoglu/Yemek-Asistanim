import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useSpring, animated } from 'react-spring';
import './Recipe.css';
import backgroundImage from './background.jpg'
import Modal from 'react-modal';

Modal.setAppElement('#root');
// Dummy data for the recipe suggestion
Recipe.defaultProps = {
  recipe : {
  title: 'Spaghetti Carbonara',
  description: "Ingredients:\n - 350g (12 oz) spaghetti"+
  "\n - 200g (7 oz) pancetta or bacon, diced\n  - 3 large eggs\n  - 75g (2.5 oz) grated Parmesan cheese\n"+
  " - 50g (1.75 oz) grated Pecorino Romano cheese\n  - Freshly ground black pepper, to taste"+
  "\n- Salt, to taste\n  - 2 cloves garlic, minced (optional)\n- 1 tablespoon olive oil\n\nInstructions:"+
  "\n1. Start by bringing a large pot of salted water to a boil. Cook the spaghetti according to package instructions until al dente."+
  "\n\n2. While the pasta is cooking, heat the olive oil in a large skillet over medium heat. Add the diced pancetta or bacon and cook until crispy, about 5-7 minutes. If you're using garlic, add it to the skillet during the last minute of cooking the pancetta or bacon, being careful not to burn it."+
  "\n\n  3. In a mixing bowl, whisk together the eggs, grated Parmesan, and grated Pecorino Romano cheese. Season with a generous amount of freshly ground black pepper."+
  "\n\n  4. Once the spaghetti is cooked, drain it, reserving about 1/2 cup of the pasta water."+
  "\n\n5. Add the drained spaghetti to the skillet with the cooked pancetta or bacon, tossing to combine."+
  "\n\n6. Remove the skillet from heat and quickly pour the egg and cheese mixture over the hot spaghetti. Toss the spaghetti continuously with tongs or a fork, ensuring the eggs evenly coat the pasta. If the sauce seems too thick, add a bit of the reserved pasta water until you reach your desired consistency."+
  "\n\n7. Serve the spaghetti carbonara immediately, garnished with extra grated Parmesan cheese and black pepper if desired."+
  "\n\n  Enjoy your delicious homemade spaghetti carbonara!\n",
  
  }
};

function Recipe({ recipe }) {
  const [liked, setLiked] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [dislikeReason, setDislikeReason] = useState('');
  const [showRecipe, setShowRecipe] = useState(false);

  // Define the animation for the button
  const [buttonStyle, setButtonStyle] = useSpring(() => ({
    transform: 'scale(1)',
    config: { mass: 1, tension: 350, friction: 5 }
  }));

  // Function to handle button click and show recipe
  const handleButtonClick = () => {
    setShowRecipe(true);
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

  const handleDislike = () => {
    setLiked(false);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
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
      {!showRecipe && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <animated.button
            style={buttonStyle}
            onMouseEnter={() => setButtonStyle({ transform: 'scale(1.1)' })}
            onMouseLeave={() => setButtonStyle({ transform: 'scale(1)' })}
            onClick={handleButtonClick}
            className="suggest-button"
          >
            Tarif öner!
          </animated.button>
        </div>
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
          <div className="recipe-card">
            <h3>{recipe.title}</h3>
            <p>{recipe.description}</p>
            <div className="buttons">
              <button onClick={() => setLiked(true)} className="yes-button">Yes</button>
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
          <button className='submit-button' onClick={closeModal}>Submit</button>
        </Modal>
        </div>
      }
    </div>
  );
}

export default Recipe;