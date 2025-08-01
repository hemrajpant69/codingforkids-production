import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { 
  FaPaperPlane, 
  FaUser, 
  FaSearch, 
  FaSpinner, 
  FaEllipsisV, 
  FaTimes,
  FaPaperclip,
  FaRegSmile
} from 'react-icons/fa';

const AdminChat = () => {
  const adminEmail = 'hemraj.221506@ncit.edu.np';
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState({
    students: true,
    messages: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [unreadCounts, setUnreadCounts] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const messagesEndRef = useRef(null);
  const socket = io('https://codingforkidsnepal.com');

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return `${seconds} second${seconds === 1 ? '' : 's'} ago`;
    let interval = Math.floor(seconds / 60);
    if (interval < 60) return `${interval} minute${interval === 1 ? '' : 's'} ago`;
    interval = Math.floor(seconds / 3600);
    if (interval < 24) return `${interval} hour${interval === 1 ? '' : 's'} ago`;
    interval = Math.floor(seconds / 86400);
    if (interval < 30) return `${interval} day${interval === 1 ? '' : 's'} ago`;
    interval = Math.floor(seconds / 2592000);
    if (interval < 12) return `${interval} month${interval === 1 ? '' : 's'} ago`;
    interval = Math.floor(seconds / 31536000);
    return `${interval} year${interval === 1 ? '' : 's'} ago`;
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get('https://codingforkidsnepal.com/api/students');
        setStudents(res.data.data || []);
        
        // Initialize unread counts
        const counts = {};
        res.data.data.forEach(student => {
          counts[student.email] = 0;
        });
        setUnreadCounts(counts);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(prev => ({...prev, students: false}));
      }
    };
    fetchStudents();
  }, []);

  const selectStudent = async (email) => {
    setLoading(prev => ({...prev, messages: true}));
    try {
      setSelectedStudent(email);
      // Reset unread count when selecting student
      setUnreadCounts(prev => ({...prev, [email]: 0}));
      
      const res = await axios.get(`https://codingforkidsnepal.com/api/chat/private/${email}`);
      setMessages(res.data.data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(prev => ({...prev, messages: false}));
    }
  };

  const sendPrivateMessage = () => {
    if (!newMsg.trim() || !selectedStudent) return;
    const msg = {
      studentEmail: selectedStudent,
      senderRole: 'admin',
      senderName: 'Admin',
      message: newMsg,
      type: 'text',
      sentAt: new Date().toISOString()
    };
    
    socket.emit('private-message', msg);
    setMessages(prev => [...prev, {
      sender_email: adminEmail,
      content: newMsg,
      sentAt: msg.sentAt
    }]);
    setNewMsg('');
  };

  // Handle typing indicator
  const handleInputChange = (e) => {
    setNewMsg(e.target.value);
    
    // Emit typing event to socket
    if (selectedStudent) {
      socket.emit('typing', {
        sender: adminEmail,
        receiver: selectedStudent
      });
    }
    
    // Clear previous timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // Set timeout to stop typing indicator
    const timeout = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
    setTypingTimeout(timeout);
  };

  useEffect(() => {
    if (!selectedStudent) return;

    const handleNewMessage = (msg) => {
      if (msg.senderEmail === selectedStudent || msg.senderEmail === adminEmail) {
        setMessages(prev => [...prev, {
          sender_email: msg.senderEmail,
          content: msg.message,
          sentAt: msg.sentAt
        }]);
      } else {
        // Increment unread count for other students
        setUnreadCounts(prev => ({
          ...prev, 
          [msg.senderEmail]: (prev[msg.senderEmail] || 0) + 1
        }));
      }
    };

    const handleTyping = (data) => {
      if (data.receiver === adminEmail && data.sender === selectedStudent) {
        setIsTyping(true);
        
        // Clear previous timeout
        if (typingTimeout) {
          clearTimeout(typingTimeout);
        }
        
        // Set timeout to stop typing indicator
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
        setTypingTimeout(timeout);
      }
    };

    socket.on(`private-${adminEmail}`, handleNewMessage);
    socket.on('typing', handleTyping);

    return () => {
      socket.off(`private-${adminEmail}`, handleNewMessage);
      socket.off('typing', handleTyping);
    };
  }, [selectedStudent]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStudentName = (email) => {
    const student = students.find(s => s.email === email);
    return student ? student.name : email.split('@')[0];
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="container-fluid vh-100 p-0 bg-light">
      <div className="row g-0 h-100">
        {/* Sidebar */}
        <div className="col-md-4 col-lg-3 border-end bg-white h-100 d-flex flex-column">
          <div className="p-3 border-bottom">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 mb-0">Student Messages</h2>
              <button className="btn btn-sm btn-outline-secondary">
                <FaEllipsisV />
              </button>
            </div>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <FaSearch className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="btn btn-outline-secondary border-start-0" 
                  onClick={clearSearch}
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>

          <div className="flex-grow-1 overflow-auto">
            {loading.students ? (
              <div className="d-flex justify-content-center align-items-center h-100">
                <FaSpinner className="fa-spin fs-4 text-primary" />
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center p-4 text-muted">
                No students found
              </div>
            ) : (
              <ul className="list-group list-group-flush">
                {filteredStudents.map(student => (
                  <li
                    key={student.email}
                    className={`list-group-item list-group-item-action ${selectedStudent === student.email ? 'active' : ''}`}
                    onClick={() => selectStudent(student.email)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className="position-relative">
                          <div className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center me-3" style={{ width: '45px', height: '45px' }}>
                            <FaUser />
                          </div>
                          {unreadCounts[student.email] > 0 && (
                            <span className="position-absolute top-0 start-75 translate-middle badge rounded-pill bg-danger">
                              {unreadCounts[student.email]}
                            </span>
                          )}
                        </div>
                        <div>
                          <h6 className="mb-0">{student.name}</h6>
                          <small className={`${selectedStudent === student.email ? 'text-white' : 'text-muted'}`}>
                            {student.email}
                          </small>
                        </div>
                      </div>
                      <div className="text-end">
                        <small className={`${selectedStudent === student.email ? 'text-white-50' : 'text-muted'}`}>
                          Last active
                        </small>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="col-md-8 col-lg-9 d-flex flex-column h-100">
          {selectedStudent ? (
            <>
              <div className="p-3 border-bottom bg-white shadow-sm">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-success text-white d-flex justify-content-center align-items-center me-3" style={{ width: '50px', height: '50px' }}>
                      <FaUser />
                    </div>
                    <div>
                      <h5 className="mb-0">{getStudentName(selectedStudent)}</h5>
                      <small className="text-muted">
                        {isTyping 
                          ? <span className="text-primary">typing...</span> 
                          : `Active now`}
                      </small>
                    </div>
                  </div>
                  <button className="btn btn-outline-secondary">
                    <FaEllipsisV />
                  </button>
                </div>
              </div>

              <div className="flex-grow-1 overflow-auto p-3 bg-light-subtle position-relative">
                {loading.messages ? (
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <FaSpinner className="fa-spin fs-4 text-primary" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="d-flex flex-column justify-content-center align-items-center h-100 text-muted">
                    <div className="bg-white p-4 rounded-circle shadow-sm mb-3">
                      <FaUser className="fs-1 text-primary" />
                    </div>
                    <h5>No messages yet</h5>
                    <p className="text-center">Start a conversation with {getStudentName(selectedStudent)}</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`mb-3 d-flex ${message.sender_email === adminEmail ? 'justify-content-end' : 'justify-content-start'}`}
                      >
                        <div 
                          className={`p-3 rounded ${message.sender_email === adminEmail ? 'bg-primary text-white' : 'bg-white border'}`} 
                          style={{ maxWidth: '75%', borderRadius: '15px' }}
                        >
                          <div className="d-flex align-items-center mb-1">
                            <FaUser className={`me-2 ${message.sender_email === adminEmail ? 'text-white-50' : 'text-muted'}`} />
                            <strong>{message.sender_email === adminEmail ? 'You' : getStudentName(selectedStudent)}</strong>
                          </div>
                          <div className="mb-1">{message.content}</div>
                          <div className={`small text-end ${message.sender_email === adminEmail ? 'text-white-50' : 'text-muted'}`}>
                            {getTimeAgo(message.sentAt || Date.now())}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="d-flex justify-content-start mb-3">
                        <div className="bg-white p-3 rounded" style={{ borderRadius: '15px' }}>
                          <div className="d-flex align-items-center">
                            <FaUser className="me-2 text-muted" />
                            <strong>{getStudentName(selectedStudent)}</strong>
                          </div>
                          <div className="mt-1">
                            <div className="typing-indicator">
                              <span></span>
                              <span></span>
                              <span></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              <div className="p-3 border-top bg-white">
                <div className="input-group">
                  <button className="btn btn-outline-secondary">
                    <FaPaperclip />
                  </button>
                  <button className="btn btn-outline-secondary">
                    <FaRegSmile />
                  </button>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type your message..."
                    value={newMsg}
                    onChange={handleInputChange}
                    onKeyDown={(e) => e.key === 'Enter' && sendPrivateMessage()}
                  />
                  <button
                    onClick={sendPrivateMessage}
                    disabled={!newMsg.trim()}
                    className="btn btn-primary d-flex align-items-center"
                  >
                    <FaPaperPlane className="me-1" /> Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="d-flex flex-column justify-content-center align-items-center h-100 text-muted bg-white">
              <div className="bg-light p-4 rounded-circle mb-3">
                <FaUser className="fs-1 text-primary" />
              </div>
              <h4 className="mb-2">Select a student to start chatting</h4>
              <p className="text-center">Choose from the list on the left to begin conversation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChat;