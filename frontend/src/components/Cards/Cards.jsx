import React, { useState } from 'react';
import plasticImg from '../../assets/plastic.jpg';
import glassImg from '../../assets/glass.png';
import metalImg from '../../assets/metal.png';

const Cards = () => {
  const [flippedCards, setFlippedCards] = useState({});

  const cardData = [
    {
      id: 'plastic',
      title: 'Plastic',
      image: plasticImg,
      bgColor: '#B8D8E8',
      description: 'Common and long-lasting waste that requires proper sorting to reduce environmental impact.',
      backInfo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      id: 'glass',
      title: 'Glass',
      image: glassImg,
      bgColor: '#C8E6C9',
      description: 'Fully recyclable material that can be reused repeatedly with minimal quality loss.',
      backInfo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'
    },
    {
      id: 'metal',
      title: 'Metal',
      image: metalImg,
      bgColor: '#F8BBD0',
      description: 'Valuable recyclable waste that saves energy and preserves natural resources.',
      backInfo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse.'
    }
  ];

  const handleCardClick = (cardId) => {
    setFlippedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const styles = {
    cardsSection: {
      width: '100%',
      padding: '80px 20px',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      justifyContent: 'center',
    },
    cardsContainer: {
      maxWidth: '1200px',
      width: '100%',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '30px',
      padding: '0 20px',
    },
    cardWrapper: {
      perspective: '1000px',
      height: '450px',
      cursor: 'pointer',
    },
    cardInner: (isFlipped) => ({
      position: 'relative',
      width: '100%',
      height: '100%',
      transition: 'transform 0.6s',
      transformStyle: 'preserve-3d',
      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
    }),
    cardFace: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backfaceVisibility: 'hidden',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    cardFront: (bgColor) => ({
      backgroundColor: bgColor,
      display: 'flex',
      flexDirection: 'column',
    }),
    cardBack: {
      backgroundColor: '#ffffff',
      transform: 'rotateY(180deg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
    },
    cardImage: {
      width: '100%',
      height: '280px',
      objectFit: 'cover',
    },
    cardContent: {
      padding: '24px',
      backgroundColor: 'white',
      flexGrow: 1,
    },
    cardTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: '12px',
      marginTop: 0,
    },
    cardDescription: {
      fontSize: '14px',
      lineHeight: '1.6',
      color: '#666666',
      margin: 0,
    },
    backContent: {
      textAlign: 'center',
    },
    backTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: '16px',
    },
    backText: {
      fontSize: '16px',
      lineHeight: '1.6',
      color: '#666666',
    },
  };

  return (
    <div style={styles.cardsSection} id="info">
      <div style={styles.cardsContainer}>
        {cardData.map((card) => (
          <div
            key={card.id}
            style={styles.cardWrapper}
            onClick={() => handleCardClick(card.id)}
          >
            <div style={styles.cardInner(flippedCards[card.id])}>
              {/* Front of card */}
              <div style={{...styles.cardFace, ...styles.cardFront(card.bgColor)}}>
                <img
                  src={card.image}
                  alt={card.title}
                  style={styles.cardImage}
                />
                <div style={styles.cardContent}>
                  <h3 style={styles.cardTitle}>{card.title}</h3>
                  <p style={styles.cardDescription}>{card.description}</p>
                </div>
              </div>
              
              {/* Back of card */}
              <div style={{...styles.cardFace, ...styles.cardBack}}>
                <div style={styles.backContent}>
                  <h3 style={styles.backTitle}>{card.title}</h3>
                  <p style={styles.backText}>{card.backInfo}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;