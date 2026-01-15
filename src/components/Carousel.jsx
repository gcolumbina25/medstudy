import { useRef, useState, useEffect } from 'react';
import styles from './Carousel.module.css';

const Carousel = ({ children, comingSoon = false }) => {
  const carouselRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (!carouselRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        carousel.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [children]);

  const scroll = (direction) => {
    if (!carouselRef.current) return;
    const scrollAmount = carouselRef.current.clientWidth * 0.8;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className={`${styles.carouselContainer} ${comingSoon ? styles.comingSoon : ''}`}>
      {showLeftArrow && (
        <button
          className={`${styles.arrowButton} ${styles.leftArrow}`}
          onClick={() => scroll('left')}
          aria-label="Rolar para esquerda"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
      )}
      
      <div 
        ref={carouselRef}
        className={styles.carousel}
        onScroll={checkScroll}
      >
        <div className={styles.carouselContent}>
          {children}
        </div>
      </div>

      {showRightArrow && (
        <button
          className={`${styles.arrowButton} ${styles.rightArrow}`}
          onClick={() => scroll('right')}
          aria-label="Rolar para direita"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      )}
    </div>
  );
};

export default Carousel;
