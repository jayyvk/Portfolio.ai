import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLinkedin, FaGithub, FaEnvelope, FaFileAlt, FaMicrophone, FaPaperPlane } from 'react-icons/fa';
import './App.css';

// Resume context from PDF for Gemini API
const resumeContext = `Jay Kilaparthi
New York, NY | +1 (212) 729-5295 | jayakeerthk@gmail.com | www.linkedin.com/in/jayvk
SUMMARY
AI Engineer and M.S. Information Systems graduate with 2+ years of experience building real-world applications powered
by large language models. Skilled in designing and developing AI tools across voice, messaging, and workflow automation
using platforms like GPT-4, Supabase, and Vercel. Experienced in designing prompts, managing data pipelines, and
developing backend systems. Delivered working prototypes used by real users and contributed to both frontend and
backend development. Co-inventor on a published patent for AI fault detection in solar energy systems.
EXPERIENCE
AI Engineer | Hello Inbox | New York City
​
May 2025 – Present
●​ Currently building a voice-first AI assistant that helps users manage their inbox by summarizing, prioritizing, and
replying to emails using GPT-4o and Whisper.
●​ Customized the open-source InboxZero backend to support email parsing, label logic, and real-time message
summaries across devices.
●​ Integrated Twilio to enable hands-free access to Gmail through voice and SMS, designed for users on the go.
AI Engineer | Keeya | New York City
Jan 2025 – May 2025
●​ Developed a generative AI voice memory platform using ElevenLabs and GPT-4, enabling users to preserve and
replay emotional voice messages with high fidelity.
●​ Built and integrated backend services using Supabase and serverless functions to support voice upload, playback,
and user session management.
●​ Led fine-tuning experiments and testing cycles to enhance output quality and user satisfaction.
Technical Teaching Assistant – Python for Data Analytics | Baruch College | New York City
Sep 2024 – May 2025
●​ Automated assignment grading workflows for 700+ submissions, reducing processing time by 50%.
●​ Designed and implemented an ETL pipeline to extract student data, analyze Python coding submissions for
accuracy, and re-upload to Brightspace, ensuring 95% accuracy and improving grading efficiency.
●​ Assisted 150+ students in Python programming, focusing on data analysis and visualization.
Growth & Data Lead | Patchly | New York City
Oct 2024 – Mar 2025
●​ Built MVP of a student event discovery app using Supabase, React, and serverless logic, supporting 300+ user
sign-ups across CUNY campuses.
●​ Analyzed data from 100+ user surveys and 50+ interviews increasing user engagement by 30%.
●​ Managed multi-channel marketing campaigns (Instagram, email, on-campus) with A/B testing to optimize user
acquisition, achieving a 40% increase in sign-ups.
●​ Secured $1,250 in funding by presenting a compelling data-driven pitch at the CUNY New Venture Accelerator,
showcasing the platform's potential.
Fundraising Analytics Manager | Make a Difference | India
June 2022 – Dec 2023
●​ Led a team of 15 volunteers to implement data-driven fundraising strategies, exceeding goals by 20% and raising
$12,000 to support educational programs for 100+ underprivileged kids in India.
●​ Developed and maintained Power BI dashboards for real-time tracking of donations and volunteer contributions,
identifying key trends to optimize fundraising strategies and improve donor retention by 15%.
●​ Orchestrated 3 donor events, with targeted emails to cultivate long-term relationships with 200+ donors,
increasing recurring donations by 25%.
EDUCATION
M.S. Information Systems | Baruch College–Zicklin School of Business | New York City
Jan 2024 – May 2025
●​ Developed a predictive analytics model using Python to forecast Airbnb prices by analyzing correlations between
crime rates, location, and amenities. Implemented Decision Trees and Random Forests to improve price accuracy
and generated tourist safety scores for data-driven decision-making.
●​ Conducted a strategic analysis of Baruch College's transition from Blackboard to Brightspace, evaluating potential
challenges and impacts through stakeholder interviews and providing recommendations for seamless transition.
SKILLS
●​ Programming & Data: Python (Pandas, NumPy), SQL, JavaScript, HTML/CSS, Data Wrangling, API Integration
●​ Cloud & Data Engineering: Supabase, Firebase, AWS (Lambda, S3), Vercel, REST APIs, Git
●​ Data Analysis & Visualization: Power BI, Tableau, Alteryx, Excel, A/B Testing
●​ AI & Applied Tools: Prompt Engineering, LLM Integration, Workflow Automation, GPT API, Whisper, ElevenLabs`;

// LinkedIn context for Gemini API
const linkedInContext = {
  profile: {
    name: "Jay Kilaparthi",
    headline: "AI Engineer | MS Information Systems | Builder",
    location: "New York, NY",
    connections: "500+",
    about: "AI Engineer and M.S. Information Systems graduate with experience building real-world applications powered by large language models. Co-founded multiple AI startups including Keeya (voice memory platform) and EazyForms.ai (AI form assistant for international students).",
    openToWork: true,
    skills: [
      "Python", "GPT-4", "Firebase", "Supabase", "SQL", "React", "AI Automation",
      "Prompt Engineering", "Data Analysis", "Product Development"
    ],
    education: [
      {
        school: "Baruch College - Zicklin School of Business",
        degree: "Master of Science - MS, Information Systems",
        date: "2024 - 2025"
      }
    ],
    experience: [
      {
        title: "AI Engineer",
        company: "Hello Inbox",
        date: "May 2025 - Present",
        description: "Building a voice-first AI assistant for email management"
      },
      {
        title: "AI Engineer",
        company: "Keeya",
        date: "Jan 2025 - May 2025",
        description: "Developed a generative AI voice memory platform"
      },
      {
        title: "Technical Teaching Assistant",
        company: "Baruch College",
        date: "Sep 2024 - May 2025",
        description: "Python for Data Analytics"
      }
    ]
  }
};

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi, I'm Jay's AI. Ask me about his projects, background, or availability.", sender: 'ai' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showVoiceButton, setShowVoiceButton] = useState(false);
  const [isApiKeySet] = useState(true); // Set to true since we're pre-configuring the API key
  
  // Get API key from environment variable
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDlQ8TkKQERzgf3deXT_-0lGiIubd-FWNQ";
  
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const chatSectionRef = useRef<HTMLElement>(null);
  
  // References for each landing element
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const onelinerRef = useRef<HTMLParagraphElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);

  // Improved scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Show chat when scrolled past 30% of the viewport height for better trigger sensitivity
      const triggerPoint = window.innerHeight * 0.3;
      
      if (currentScrollY > triggerPoint) {
        if (!showChat) {
          setShowChat(true);
          
          // Show voice button placeholder after chat appears
          setTimeout(() => {
            setShowVoiceButton(true);
          }, 1000);
        }
        
        // Apply fall animation to landing elements
        if (nameRef.current) nameRef.current.classList.add('fall-animation');
        if (subtitleRef.current) subtitleRef.current.classList.add('fall-animation');
        if (onelinerRef.current) onelinerRef.current.classList.add('fall-animation');
        if (socialRef.current) socialRef.current.classList.add('fall-animation');
      } else {
        if (showChat) {
          setShowChat(false);
          setShowVoiceButton(false);
        }
        
        // Remove fall animation when scrolled back up
        if (nameRef.current) nameRef.current.classList.remove('fall-animation');
        if (subtitleRef.current) subtitleRef.current.classList.remove('fall-animation');
        if (onelinerRef.current) onelinerRef.current.classList.remove('fall-animation');
        if (socialRef.current) socialRef.current.classList.remove('fall-animation');
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Add initial scroll instruction for mobile users
    const initialScrollTimeout = setTimeout(() => {
      if (!showChat && window.scrollY < 10) {
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'scroll-indicator';
        scrollIndicator.innerHTML = '↓ Scroll down to chat ↓';
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

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  // Force scroll to chat section when it first appears
  useEffect(() => {
    if (showChat && chatSectionRef.current) {
      setTimeout(() => {
        chatSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [showChat]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    setMessages([...messages, { text: inputValue, sender: 'user' }]);
    setInputValue('');
    setIsTyping(true);

    try {
      console.log('API Key available:', !!apiKey);
      let response;
      if (isApiKeySet && apiKey) {
        console.log('Using Gemini API...');
        response = await fetchGeminiResponse(inputValue);
      } else {
        console.log('Falling back to local response...');
        response = generateLocalResponse(inputValue);
      }
      
      setTimeout(() => {
        setMessages(prev => [...prev, { text: response, sender: 'ai' }]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error('Error generating response:', error);
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: "I'm having trouble connecting to my AI services. Let me answer based on what I know about Jay.", 
          sender: 'ai' 
        }]);
        setIsTyping(false);
      }, 1000);
    }
  };

  // Gemini API integration with pre-configured key
  const fetchGeminiResponse = async (userInput: string) => {
    try {
      console.log('Attempting to fetch Gemini response...');
      
      // Create context from resume and LinkedIn data
      const context = `
        User query: ${userInput}
        
        Resume information:
        ${resumeContext}
        
        LinkedIn profile:
        Name: ${linkedInContext.profile.name}
        Headline: ${linkedInContext.profile.headline}
        Location: ${linkedInContext.profile.location}
        About: ${linkedInContext.profile.about}
        Open to work: ${linkedInContext.profile.openToWork ? 'Yes' : 'No'}
        Skills: ${linkedInContext.profile.skills.join(', ')}
        
        Education:
        ${linkedInContext.profile.education.map(edu => 
          `${edu.school} - ${edu.degree} (${edu.date})`
        ).join('\n')}
        
        Experience:
        ${linkedInContext.profile.experience.map(exp => 
          `${exp.title} at ${exp.company} (${exp.date}) - ${exp.description}`
        ).join('\n')}
        
        Instructions:
        - Respond as if you are Jay Kilaparthi's personal AI assistant
        - Use first-person perspective ("I", "my", etc.) as if you are Jay
        - Be professional but conversational in tone
        - Keep responses concise but informative
        - Only share information that's present in the resume or LinkedIn profile
        - If asked about availability or contact, mention being open to opportunities and provide email
      `;
      
      // Make actual API call to Gemini
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: context }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error:', errorText);
        throw new Error(`API error: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Gemini API response:', data);
      
      // Check if we have a valid response
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
        return data.candidates[0].content.parts[0].text;
      } else {
        // Fallback to local response if API response format is unexpected
        console.error('Unexpected Gemini API response format:', data);
        return generateLocalResponse(userInput);
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return generateLocalResponse(userInput);
    }
  };

  // Local response generation as fallback
  const generateLocalResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('project') || input.includes('startup') || input.includes('work')) {
      return "I've co-founded multiple AI startups including Keeya (a voice memory platform) and EazyForms.ai (an AI form assistant for international students). Currently, I'm working as an AI Engineer at Hello Inbox, building a voice-first AI assistant for email management. Previously at Keeya, I developed a generative AI voice memory platform using ElevenLabs and GPT-4.";
    } else if (input.includes('background') || input.includes('education') || input.includes('experience')) {
      return "I have an M.S. in Information Systems from Baruch College's Zicklin School of Business (2024-2025). My experience includes roles as an AI Engineer at Hello Inbox and Keeya, a Technical Teaching Assistant for Python at Baruch College, and a Growth & Data Lead at Patchly. I also worked as a Fundraising Analytics Manager at Make a Difference in India.";
    } else if (input.includes('skill') || input.includes('tech') || input.includes('stack')) {
      return "My technical skills include Python (Pandas, NumPy), SQL, JavaScript, HTML/CSS, and data wrangling. I'm experienced with cloud platforms like Supabase, Firebase, AWS, and Vercel. I'm proficient in data analysis tools including Power BI, Tableau, and Excel. My AI expertise includes prompt engineering, LLM integration, workflow automation, and working with GPT API, Whisper, and ElevenLabs.";
    } else if (input.includes('available') || input.includes('hire') || input.includes('job') || input.includes('opportunity')) {
      return "I'm currently based in NYC and open to full-time roles in data analytics, product analytics, or startup operations. Feel free to reach out via email at jayakeerthk@gmail.com or connect with me on LinkedIn at linkedin.com/in/jayvk to discuss opportunities!";
    } else if (input.includes('contact') || input.includes('email') || input.includes('reach')) {
      return "You can reach me at jayakeerthk@gmail.com or connect with me on LinkedIn at linkedin.com/in/jayvk.";
    } else if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return "Hey there! I'm Jay's AI assistant. I can tell you about my projects, skills, or availability. What would you like to know?";
    } else if (input.includes('resume') || input.includes('cv')) {
      return "You can view or download my resume by clicking the document icon in the top section of this page. It has details about my education, work experience, and projects.";
    } else if (input.includes('voice') || input.includes('speak') || input.includes('talk')) {
      return "Voice interaction is coming soon! In a future update, you'll be able to hold the microphone button to speak with me directly using ElevenLabs voice technology.";
    } else if (input.includes('api') || input.includes('gemini') || input.includes('key')) {
      return "I'm already powered by Gemini AI! My responses are generated using Google's Gemini large language model with access to my resume and LinkedIn information for accurate and detailed answers.";
    } else {
      return "Thanks for your message! I'm Jay, a recent Baruch MSIS graduate based in NYC. I've co-founded AI startups and I'm passionate about product building. Is there something specific about my background or projects you'd like to know?";
    }
  };

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
              <a href="/assets/JayKilaparthi-Resume.pdf" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Resume">
                <FaFileAlt size={24} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {showChat && (
          <motion.section 
            ref={chatSectionRef}
            className="chat-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="container">
              <div className="chat-container">
                <div className="chat-header">
                  <h2>Chat with Jay's AI</h2>
                </div>
                <div className="chat-messages" ref={chatMessagesRef}>
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <motion.div 
                        key={index} 
                        className={`message message-${message.sender}`}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                      >
                        {message.text}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {isTyping && (
                    <motion.div 
                      className="message message-ai"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </motion.div>
                  )}
                </div>
                <form onSubmit={handleSendMessage} className="chat-input">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask me anything..."
                    aria-label="Chat message input"
                  />
                  <motion.button 
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Send message"
                  >
                    <FaPaperPlane size={16} />
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showVoiceButton && (
          <motion.div 
            className="voice-button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            title="Voice feature coming soon"
            aria-label="Voice interaction (coming soon)"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaMicrophone size={24} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
