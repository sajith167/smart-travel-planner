import { useState } from 'react';
import { FaRobot, FaBrain, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('insights');
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your SmartTravel AI Assistant. How can I help you optimize your trip today?' }
  ]);
  const [inputVal, setInputVal] = useState('');

  const quickQuestions = [
    "How to save 40% on Goa trip?",
    "Best season for hill stations?",
    "Sleeper train vs AC coach savings?"
  ];

  const handleQuickQuestion = (q) => {
    setMessages(prev => [...prev, { sender: 'user', text: q }]);
    setTimeout(() => {
      let reply = "Based on current data, booking a sleeper train and choosing a certified budget hostel will save you about 45% on travel and hotel accommodation!";
      if (q.includes("season")) {
        reply = "For hill stations, visiting during late September or early March (shoulder seasons) offers 30% discount on resorts and pleasant, non-crowded views.";
      } else if (q.includes("Goa")) {
        reply = "To save 40% in Goa, combine off-season travel (Mon-Thu), rent local scooters instead of private cabs, and visit free beaches like Galgibaga or Arambol.";
      }
      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 800);
  };

  const handleSend = () => {
    if (!inputVal.trim()) return;
    const userMsg = inputVal;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInputVal('');
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'ai', text: "That's a great question! I'm analyzing real-time local travel rates, typical meal costs, and booking dates to optimize that for you. I suggest checking our 'Optimization' page for exact figures." }]);
    }, 800);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        className="ai-assistant-fab" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open AI Assistant"
      >
        <FaRobot />
        <span className="ai-assistant-tooltip">🤖 AI Smart Assistant</span>
      </button>

      {/* Glassmorphism Drawer / Dialog */}
      {isOpen && (
        <div className="glass-card ai-drawer">
          <div className="ai-drawer__header">
            <div className="ai-drawer__title">
              <FaBrain style={{ color: 'var(--primary-light)' }} />
              <div>
                <strong>SmartTravel AI</strong>
                <span className="ai-drawer__status">Online • Agentic Mode</span>
              </div>
            </div>
            <button className="ai-drawer__close" onClick={() => setIsOpen(false)} aria-label="Close panel">
              <FaTimes />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="ai-drawer__tabs">
            <button 
              className={`ai-drawer__tab ${activeTab === 'insights' ? 'ai-drawer__tab--active' : ''}`}
              onClick={() => setActiveTab('insights')}
            >
              💡 Insights
            </button>
            <button 
              className={`ai-drawer__tab ${activeTab === 'chat' ? 'ai-drawer__tab--active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              💬 Chat Assistant
            </button>
          </div>

          <div className="ai-drawer__body">
            {activeTab === 'insights' && (
              <div className="ai-drawer__insights-tab">
                {/* Alert block */}
                <div className="ai-drawer__alert">
                  <FaExclamationTriangle className="ai-drawer__alert-icon" />
                  <div>
                    <strong>Smart Budget Watch</strong>
                    <p>Hostels are currently 60% cheaper in Goa due to seasonal student discounts.</p>
                  </div>
                </div>

                {/* Insight cards */}
                <div className="ai-drawer__insight-item">
                  <div className="insight-icon">✈️</div>
                  <div>
                    <strong>Travel Insight</strong>
                    <p>Booking sleeper train tickets on Tuesdays yields average savings of ₹1,200 per group.</p>
                  </div>
                </div>
                <div className="ai-drawer__insight-item">
                  <div className="insight-icon">🏨</div>
                  <div>
                    <strong>Hotel Insight</strong>
                    <p>Choosing hostels over hotels saves ₹2,200 per night for student packages.</p>
                  </div>
                </div>
                <div className="ai-drawer__insight-item">
                  <div className="insight-icon">✅</div>
                  <div>
                    <strong>Confidence Score</strong>
                    <p>AI Travel models are operating at 98% accuracy based on real-time API feedback.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="ai-drawer__chat-tab">
                <div className="ai-drawer__messages">
                  {messages.map((m, i) => (
                    <div key={i} className={`ai-drawer__msg ${m.sender === 'user' ? 'ai-drawer__msg--user' : 'ai-drawer__msg--ai'}`}>
                      <div className="ai-drawer__msg-bubble">{m.text}</div>
                    </div>
                  ))}
                </div>

                {/* Quick query chips */}
                <div className="ai-drawer__chips">
                  {quickQuestions.map((q, idx) => (
                    <button key={idx} className="ai-drawer__chip" onClick={() => handleQuickQuestion(q)}>
                      {q}
                    </button>
                  ))}
                </div>

                {/* Chat input box */}
                <div className="ai-drawer__input-wrap">
                  <input
                    type="text"
                    placeholder="Ask AI anything..."
                    className="ai-drawer__input"
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    aria-label="Ask AI assistant"
                  />
                  <button className="ai-drawer__send-btn" onClick={handleSend}>
                    ✈️
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
