import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLinkedin, FaGithub, FaEnvelope, FaFileAlt } from 'react-icons/fa';
import Chat from './components/Chat';
import './App.css';

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [resumeContext, setResumeContext] = useState('');
  
  // References for each landing element
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const onelinerRef = useRef<HTMLParagraphElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchResumeContext = async () => {
      try {
        const response = await fetch('/JayKilaparthi-Resume.pdf');
        const text = await response.text();
        setResumeContext(text);
      } catch (error) {
        console.error('Error fetching resume context:', error);
      }
    };

    fetchResumeContext();
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      const triggerPoint = Math.max(window.innerHeight * 0.3, 200);
      
      if (currentScrollY > triggerPoint) {
        if (!showChat) {
          setShowChat(true);
        }
        
        if (nameRef.current) nameRef.current.classList.add('fall-animation');
        if (subtitleRef.current) subtitleRef.current.classList.add('fall-animation');
        if (onelinerRef.current) onelinerRef.current.classList.add('fall-animation');
        if (socialRef.current) socialRef.current.classList.add('fall-animation');
      } else {
        if (showChat) {
          setShowChat(false);
        }
        
        if (nameRef.current) nameRef.current.classList.remove('fall-animation');
        if (subtitleRef.current) subtitleRef.current.classList.remove('fall-animation');
        if (onelinerRef.current) onelinerRef.current.classList.remove('fall-animation');
        if (socialRef.current) socialRef.current.classList.remove('fall-animation');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Add initial scroll instruction
    const initialScrollTimeout = setTimeout(() => {
      if (!showChat && window.scrollY < 10) {
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'scroll-indicator';
        scrollIndicator.innerHTML = '↓ Click or scroll to chat with AI ↓';
        scrollIndicator.style.cursor = 'pointer';
        scrollIndicator.onclick = () => {
          setShowChat(true);
          if (nameRef.current) nameRef.current.classList.add('fall-animation');
          if (subtitleRef.current) subtitleRef.current.classList.add('fall-animation');
          if (onelinerRef.current) onelinerRef.current.classList.add('fall-animation');
          if (socialRef.current) socialRef.current.classList.add('fall-animation');
        };
        document.body.appendChild(scrollIndicator);
        
        setTimeout(() => {
          if (scrollIndicator.parentNode) {
            scrollIndicator.classList.add('fade-out');
            setTimeout(() => {
              if (scrollIndicator.parentNode) {
                document.body.removeChild(scrollIndicator);
              }
            }, 1000);
          }
        }, 3000);
      }
    }, 2000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(initialScrollTimeout);
    };
  }, [showChat]);

  // Calculate opacity and transform based on scroll position
  const landingOpacity = Math.max(0, 1 - scrollY / (window.innerHeight * 0.3));
  const landingTranslateY = Math.min(100, scrollY * 0.5);

  return (
    <div className="App">
      <section className="landing-section">
        <div className="container">
          <motion.div
            className="landing-content"
            style={{ 
              opacity: landingOpacity, 
              transform: `translateY(${landingTranslateY}px)`,
              position: 'relative',
              zIndex: 1
            }}
          >
            <h1 ref={nameRef} className="name landing-element name-element">jay kilaparthi.</h1>
            <p ref={subtitleRef} className="subtitle landing-element subtitle-element">builder · ai · nyc</p>
            <p ref={onelinerRef} className="one-liner landing-element oneliner-element">baruch msis → keeya → eazyforms.ai</p>
            
            <div ref={socialRef} className="social-links landing-element social-element">
              <a href="https://linkedin.com/in/jayvk" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                <FaLinkedin size={24} />
              </a>
              <a href="https://github.com/jayakeerthk" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
                <FaGithub size={24} />
              </a>
              <a href="mailto:jayakeerthk@gmail.com" className="social-link" aria-label="Email">
                <FaEnvelope size={24} />
              </a>
              <a href="/JayKilaparthi-Resume.pdf" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Resume">
                <FaFileAlt size={24} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {showChat && (
          <motion.section 
            className="chat-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="container">
              <Chat resumeContext={resumeContext} />
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;