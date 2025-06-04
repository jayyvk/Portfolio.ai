import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLinkedin, FaGithub, FaEnvelope, FaFileAlt } from 'react-icons/fa';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
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
    const resumeText = `
      Jay Kilaparthi
      New York, NY | +1 (212) 729-5295 | jayakeerthk@gmail.com | www.linkedin.com/in/jayvk
      SUMMARY
      AI Engineer and M.S. Information Systems graduate with 2+ years of experience building real-world applications powered
      by large language models. Skilled in designing and developing AI tools across voice, messaging, and workflow automation
      using platforms like GPT-4, Supabase, and Vercel. Experienced in designing prompts, managing data pipelines, and
      developing backend systems. Delivered working prototypes used by real users and contributed to both frontend and
      backend development. Co-inventor on a published patent for AI fault detection in solar energy systems.
      EXPERIENCE
      AI Engineer | Hello Inbox | New York City May 2025 – Present
      ●
      Currently building a voice-first AI assistant that helps users manage their inbox by summarizing, prioritizing, and
      replying to emails using GPT-4o and Whisper.
      ●
      Customized the open-source InboxZero backend to support email parsing, label logic, and real-time message
      summaries across devices.
      ●
      Integrated Twilio to enable hands-free access to Gmail through voice and SMS, designed for users on the go.
      AI Engineer | Keeya | New York City Jan 2025 – May 2025
      ●
      Developed a generative AI voice memory platform using ElevenLabs and GPT-4, enabling users to preserve and
      replay emotional voice messages with high fidelity.
      ●
      Built and integrated backend services using Supabase and serverless functions to support voice upload, playback,
      and user session management.
      ●
      Led fine-tuning experiments and testing cycles to enhance output quality and user satisfaction.
      Technical Teaching Assistant – Python for Data Analytics | Baruch College | New York City Sep 2024 – May 2025
      ●
      Automated assignment grading workflows for 700+ submissions, reducing processing time by 50%.
      ●
      Designed and implemented an ETL pipeline to extract student data, analyze Python coding submissions for
      accuracy, and re-upload to Brightspace, ensuring 95% accuracy and improving grading efficiency.
      ●
      Assisted 150+ students in Python programming, focusing on data analysis and visualization.
      Growth & Data Lead | Patchly | New York City Oct 2024 – Mar 2025
      ●
      Built MVP of a student event discovery app using Supabase, React, and serverless logic, supporting 300+ user
      sign-ups across CUNY campuses.
      ●
      Analyzed data from 100+ user surveys and 50+ interviews increasing user engagement by 30%.
      ●
      Managed multi-channel marketing campaigns (Instagram, email, on-campus) with A/B testing to optimize user
      acquisition, achieving a 40% increase in sign-ups.
      ●
      Secured $1,250 in funding by presenting a compelling data-driven pitch at the CUNY New Venture Accelerator,
      showcasing the platform's potential.
      Fundraising Analytics Manager | Make a Difference | India June 2022 – Dec 2023
      ●
      Led a team of 15 volunteers to implement data-driven fundraising strategies, exceeding goals by 20% and raising
      $12,000 to support educational programs for 100+ underprivileged kids in India.
      ●
      Developed and maintained Power BI dashboards for real-time tracking of donations and volunteer contributions,
      identifying key trends to optimize fundraising strategies and improve donor retention by 15%.
      ●
      Orchestrated 3 donor events, with targeted emails to cultivate long-term relationships with 200+ donors,
      increasing recurring donations by 25%.
      EDUCATION
      M.S. Information Systems | Baruch College–Zicklin School of Business | New York City Jan 2024 – May 2025
      ●
      Developed a predictive analytics model using Python to forecast Airbnb prices by analyzing correlations between
      crime rates, location, and amenities. Implemented Decision Trees and Random Forests to improve price accuracy
      and generated tourist safety scores for data-driven decision-making.
      ●
      Conducted a strategic analysis of Baruch College's transition from Blackboard to Brightspace, evaluating potential
      challenges and impacts through stakeholder interviews and providing recommendations for seamless transition.
      SKILLS
      ●
      Programming & Data: Python (Pandas, NumPy), SQL, JavaScript, HTML/CSS, Data Wrangling, API Integration
      Cloud & Data Engineering: Supabase, Firebase, AWS (Lambda, S3), Vercel, REST APIs, Git
      Data Analysis & Visualization: Power BI, Tableau, Alteryx, Excel, A/B Testing
      AI & Applied Tools: Prompt Engineering, LLM Integration, Workflow Automation, GPT API, Whisper, ElevenLabs
    `;
    setResumeContext(resumeText);
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
      <Analytics />
      <SpeedInsights />
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
            <p ref={onelinerRef} className="one-liner landing-element oneliner-element">baruch ms is → patchly → ??</p>
            
            <div ref={socialRef} className="social-links landing-element social-element">
              <a href="https://linkedin.com/in/jayvk" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                <FaLinkedin size={24} />
              </a>
              <a href="https://github.com/jayyvk" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
                <FaGithub size={24} />
              </a>
              <a href="mailto:jayakeerthk@gmail.com" className="social-link" aria-label="Email">
                <FaEnvelope size={24} />
              </a>
              <a href="./JayKilaparthi-Resume.pdf" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Resume">
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