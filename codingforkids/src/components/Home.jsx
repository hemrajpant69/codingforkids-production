import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Hero from '../assets/coding-hero.jpg';
import Game from '../assets/game-based.jpeg';
import Progress from '../assets/progress.jpeg';
import Safe from '../assets/safe.jpeg';
import Parent from '../assets/parent.jpeg';

const Home = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.3 }}
            className="hero-title"
          >
            Welcome to <span className="brand-accent rainbow-text">CodeKids!</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="hero-subtitle"
          >
            Where coding is <span className="fun-text">super fun!</span> 🚀
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="cta-buttons"
          >
            <motion.button 
              className="primary-btn"
              onClick={() => navigate('/programmes')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Courses
            </motion.button>
            <motion.button 
              className="secondary-btn"
              onClick={() => navigate('/demo')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Free Demo
            </motion.button>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, -15, 0]
          }}
          transition={{
            opacity: { duration: 0.8, delay: 0.4 },
            scale: { duration: 0.8, delay: 0.4 },
            y: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          className="hero-image"
        >
          <img 
            src={Hero} 
            alt="Kids learning to code" 
            className="responsive-hero-img floating"
          />
          <div className="hero-decoration">
            <motion.div 
              className="code-bubble bubble-1"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {"<div>"}
            </motion.div>
            <motion.div 
              className="code-bubble bubble-2"
              animate={{
                y: [0, -15, 0],
                rotate: [0, -3, 3, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            >
              {"function()"}
            </motion.div>
            <motion.div 
              className="code-bubble bubble-3"
              animate={{
                y: [0, -25, 0],
                rotate: [0, 7, -7, 0]
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            >
              {"console.log"}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features-section" ref={ref}>
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={item}
        >
          Why Kids <span className="highlight">❤️</span> Learning With Us
        </motion.h2>
        
        <motion.div 
          className="features-grid"
          initial="hidden"
          animate={controls}
          variants={container}
        >
          <motion.div 
            className="feature-card"
            variants={item}
            whileHover={{ y: -10 }}
          >
            <div className="feature-icon">
              <img src={Game} alt="Game based learning" className="feature-img" />
              <div className="icon-ornament"></div>
            </div>
            <h3>Game-Based Learning</h3>
            <p>Learn coding through fun games and interactive challenges!</p>
            <div className="feature-cta">
              <span className="emoji">🎮</span>
              <span>Play & Learn</span>
            </div>
          </motion.div>
          
          <motion.div 
            className="feature-card"
            variants={item}
            whileHover={{ y: -10 }}
          >
            <div className="feature-icon">
              <img src={Progress} alt="Progress tracking" className="feature-img" />
              <div className="icon-ornament"></div>
            </div>
            <h3>Earn Cool Badges</h3>
            <p>Collect achievements and show off your coding skills!</p>
            <div className="feature-cta">
              <span className="emoji">🏆</span>
              <span>See Progress</span>
            </div>
          </motion.div>
          
          <motion.div 
            className="feature-card"
            variants={item}
            whileHover={{ y: -10 }}
          >
            <div className="feature-icon">
              <img src={Safe} alt="Safe environment" className="feature-img" />
              <div className="icon-ornament"></div>
            </div>
            <h3>Safe Environment</h3>
            <p>Kid-friendly platform with no ads and strict privacy.</p>
            <div className="feature-cta">
              <span className="emoji">🔒</span>
              <span>100% Safe</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Age Groups Section */}
      <section className="age-groups-section">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Start Your <span className="highlight">Coding Adventure</span>
        </motion.h2>
        
        <div className="age-groups-container">
          <motion.div 
            className="age-group-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="age-badge">5-7</div>
            <h3>Little Explorers</h3>
            <p>Drag-and-drop coding with fun characters!</p>
            <div className="age-group-progress">
              <svg className="progress-circle-svg" viewBox="0 0 100 100">
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * 30) / 100}
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 - (251.2 * 30) / 100 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
              </svg>
              <span>Beginner</span>
            </div>
          </motion.div>
          
          <motion.div 
            className="age-group-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="age-badge">8-10</div>
            <h3>Junior Coders</h3>
            <p>Create games and animations with code!</p>
            <div className="age-group-progress">
              <svg className="progress-circle-svg" viewBox="0 0 100 100">
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * 50) / 100}
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 - (251.2 * 50) / 100 }}
                  transition={{ duration: 1.5, delay: 0.7 }}
                />
              </svg>
              <span>Intermediate</span>
            </div>
          </motion.div>
          
          <motion.div 
            className="age-group-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="age-badge">11-13</div>
            <h3>Young Creators</h3>
            <p>Build websites, apps, and games!</p>
            <div className="age-group-progress">
              <svg className="progress-circle-svg" viewBox="0 0 100 100">
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * 70) / 100}
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 - (251.2 * 70) / 100 }}
                  transition={{ duration: 1.5, delay: 0.9 }}
                />
              </svg>
              <span>Advanced</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          What <span className="highlight">Parents & Kids</span> Say
        </motion.h2>
        
        <div className="testimonials-carousel">
          <motion.div 
            className="testimonial-card"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="testimonial-content">
              <div className="quote-icon">“</div>
              <p>"My daughter went from zero coding knowledge to creating her own games in just 3 months!"</p>
              <div className="testimonial-author">
                <img src={Parent} alt="Parent" className="parent-img" />
                <div>
                  <span className="author-name">Sarah K.</span>
                  <span className="author-role">Parent of 9-year-old</span>
                </div>
              </div>
              <div className="stars">★★★★★</div>
            </div>
          </motion.div>
          
          <motion.div 
            className="testimonial-card"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="testimonial-content">
              <div className="quote-icon">“</div>
              <p>"I love making my own games! It's like playing but I'm learning too!"</p>
              <div className="testimonial-author">
                <img src={Parent} alt="Parent" className="parent-img" />
                <div>
                  <span className="author-name">Alex, 10</span>
                  <span className="author-role">Student</span>
                </div>
              </div>
              <div className="stars">★★★★★</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Ready to <span className="highlight">Start Coding?</span>
        </motion.h2>
        
        <motion.button 
          className="primary-btn large-btn"
          onClick={() => navigate('/programmes')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(74, 144, 226, 0.7)',
              '0 0 0 20px rgba(74, 144, 226, 0)',
              '0 0 0 0 rgba(74, 144, 226, 0)'
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1
          }}
        >
          🎮 Start Your Free Trial Today!
        </motion.button>
        
        <motion.div 
          className="cta-decoration"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        >
          <div className="decoration-item">✨</div>
          <div className="decoration-item">👾</div>
          <div className="decoration-item">💻</div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;