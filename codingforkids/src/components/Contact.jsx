import React, { useState, useEffect } from "react";
const Contact = () => {
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animation trigger
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending...");
    setIsSubmitting(true);
    
    const formData = new FormData(event.target);
    formData.append("access_key", "42ce9599-949a-495a-9bf8-4cd6f7892eac");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        setResult("Message sent successfully!");
        event.target.reset();
      } else {
        setResult(data.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      setResult("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`contact-container ${isVisible ? "visible" : ""}`}>
      <div className="contact-wrapper">
        {/* Left Side - Contact Info */}
        <div className="contact-info">
          <h2 className="section-title">Get in Touch</h2>
          <p className="section-subtitle">Have questions? We're here to help!</p>
          
          <div className="info-box">
            <div className="info-item">
              <div className="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div className="info-content">
                <h3>Email</h3>
                <p>nepal.codingforkids@gmail.com</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div className="info-content">
                <h3>Phone</h3>
                <p>+977 9806400774</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="contact-form-wrapper">
          <form onSubmit={onSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name" className="input-label">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required 
                placeholder="Enter your name"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email" className="input-label">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required 
                placeholder="Enter your email"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message" className="input-label">Your Message</label>
              <textarea 
                id="message" 
                name="message" 
                required 
                rows="5" 
                placeholder="How can we help you?"
                className="form-textarea"
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className={`submit-btn ${isSubmitting ? "submitting" : ""}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span> Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>
            
            <div className={`result-message ${result ? "show" : ""} ${result.includes("successfully") ? "success" : "error"}`}>
              {result}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;