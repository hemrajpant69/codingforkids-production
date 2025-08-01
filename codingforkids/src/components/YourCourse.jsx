import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { FaPaperPlane, FaSpinner, FaTimes, FaVideo, FaUser,FaExpand,FaPaperclip  } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { io } from 'socket.io-client';
import ZoomMeeting from './ZoomMeeting';
import ZoomErrorBoundary from './ZoomErrorBoundary';
import ZoomSDK from './ZoomSDK';
import SimpleZoom from './SimpleZoom';
const YourCourse = () => {
  const { user } = useContext(UserContext);
  const [course, setCourse] = useState(null);
  const [programme, setProgramme] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [socket] = useState(() => io('https://codingforkidsnepal.com'));
  const [groupMsgs, setGroupMsgs] = useState([]);
  const [privateMsgs, setPrivateMsgs] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [activeTab, setActiveTab] = useState('group');
  const [showZoom, setShowZoom] = useState(false);

  const chatEndRef = useRef(null);

   // Function to extract meeting ID and password from Zoom link
 // In the getMeetingParams function of YourCourse.jsx
const getMeetingParams = (zoomLink) => {
  if (!zoomLink) return { meetingId: null, password: null };
  
  try {
    const url = new URL(zoomLink);
    const meetingId = url.pathname.split('/').pop();
    const password = url.searchParams.get('pwd') || '';
    return { 
      meetingId, 
      password: encodeURIComponent(password) // Encode special characters
    };
  } catch (e) {
    console.error('Error parsing Zoom URL:', e);
    return { meetingId: null, password: null };
  }
};
  // Get meeting parameters from programme's zoom_link
  const { meetingId, password } = programme?.zoom_link 
    ? getMeetingParams(programme.zoom_link) 
    : { meetingId: null, password: null };

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        if (!user?.email) {
          setError('Please login to view your courses.');
          setLoading(false);
          return;
        }

        const courseRes = await axios.get(`https://codingforkidsnepal.com/api/students/user-course?email=${user.email}`);
        if (!courseRes.data?.success || !courseRes.data?.data) {
          setError('You are not enrolled in any course.');
          setLoading(false);
          return;
        }

        const courseData = courseRes.data.data;
        setCourse(courseData);

        const progRes = await axios.get(`https://codingforkidsnepal.com/api/programmes/${courseData.id}`);
        setProgramme(progRes.data);

        const lecturesRes = await axios.get(`https://codingforkidsnepal.com/api/lectures/by-student?email=${user.email}`);
        setVideos(
          lecturesRes.data.data?.map((lecture) => {
            let rawPath = lecture.video.replace(/\\/g, '/');
            if (rawPath.startsWith('uploads/lectures/')) {
              rawPath = rawPath.replace('uploads/lectures/', '');
            }
            return {
              url: `https://codingforkidsnepal.com/uploads/lectures/${rawPath}`,
              title: lecture.title,
              date: new Date(lecture.uploaded_time),
            };
          }) || []
        );
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load course information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [user]);

  useEffect(() => {
    if (!course?.id || !user?.email) return;

    socket.emit('join-programme', course.id);

    const fetchMessages = async () => {
      try {
        const [groupRes, privateRes] = await Promise.all([
          axios.get(`https://codingforkidsnepal.com/api/chat/group/${course.id}`),
          axios.get(`https://codingforkidsnepal.com/api/chat/private/${encodeURIComponent(user.email)}`)
        ]);
        setGroupMsgs(groupRes.data?.data || []);
        setPrivateMsgs(privateRes.data?.data || []);
      } catch (err) {
        console.error('Error loading messages:', err);
      }
    };

    fetchMessages();

    const handleGroupMessage = (msg) => setGroupMsgs(prev => [...prev, msg]);
    const handlePrivateMessage = (msg) => setPrivateMsgs(prev => [...prev, msg]);

    socket.on('group-message', handleGroupMessage);
    socket.on(`private-${user.email}`, handlePrivateMessage);

    return () => {
      socket.off('group-message', handleGroupMessage);
      socket.off(`private-${user.email}`, handlePrivateMessage);
    };
  }, [course, user?.email]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [groupMsgs, privateMsgs]);

  const sendMessage = () => {
    if (!newMsg.trim()) return;

    const msg = {
      senderName: user.name || user.email.split('@')[0],
      message: newMsg,
      createdAt: new Date().toISOString()
    };

    if (activeTab === 'group') {
      msg.programmeId = course.id;
      msg.senderEmail = user.email;
      socket.emit('group-message', msg);
    } else {
      msg.studentEmail = user.email;
      socket.emit('private-message', msg);
    }

    setNewMsg('');
  };

  const getStudentName = (email) => {
  if (!email) return 'Unknown';
  const namePart = email.split('@')[0];
  return namePart.replace(/\./g, ' ').replace(/\d+/g, '').trim();
};

const YourCourse = () => {
  // ...
};


  const formatMessageDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return isNaN(date) ? 'Just now' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Just now';
    }
  };

  const getSender = (msg) => {
    return (msg.senderEmail || msg.sender_email) === user.email ? 'You' : (msg.senderName || 'User');
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <FaSpinner className="fa-spin text-primary" size={28} />
        <p className="mt-2 text-muted">Loading your course...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center my-5">{error}</div>
    );
  }

  return (
     <div className="container my-5">
      {/* Course Header Section */}
      <div className="card shadow-lg border-0 overflow-hidden mb-5">
        <div className="row g-0">
          <div className="col-lg-6">
            <img
              src={programme?.photo 
                ? programme.photo.startsWith('http')
                  ? programme.photo
                  : `https://codingforkidsnepal.com/uploads/${programme.photo}`
                : 'https://via.placeholder.com/600x400?text=Course+Image'}
              alt={course.title}
              className="img-fluid w-100 h-100"
              style={{ maxHeight: '500px', objectFit: 'cover' }}
            />
          </div>
          <div className="col-lg-6 p-4">
            <h2 className="fw-bold text-primary mb-3">{course.title}</h2>
            <p className="text-muted">{course.description}</p>
            <div className="mb-3">
              <span className="badge bg-primary me-2">₹{course.price}</span>
              <span className="text-muted">
                Starts: {new Date(course.start_time).toLocaleDateString()}
              </span>
            </div>
            
            <div className="card border-primary mb-3">
              <div className="card-body">
              <h5 className="card-title text-primary">
                  <FaVideo className="me-2" />
                  Live Zoom Class
                </h5>
                
            
{programme?.zoom_link ? (
  <div>
    <button 
      className="btn btn-success"
      onClick={() => setShowZoom(true)}
    >
      Join Zoom Class
    </button>

    {showZoom && meetingId && (
      <div className="mt-3 position-relative" style={{ height: '70vh' }}>
        <ZoomSDK
          meetingNumber={meetingId}
          password={password}
          userName={user?.name || "Student"}
          userEmail={user?.email}
          zoomLink={programme.zoom_link}
        />
        <button 
          className="btn btn-danger position-absolute top-0 end-0 m-2"
          onClick={() => setShowZoom(false)}
        >
          <FaTimes /> Close
        </button>
      </div>
    )}
  </div>
) : (
  <div className="alert alert-warning">
    Zoom class is unavailable right now.
  </div>
)}

     </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recorded Lectures Section */}
      <div className="card shadow-sm border-success">
        <div className="card-body">
          <h4 className="text-success mb-4">
            <FaVideo className="me-2" />
            Recorded Lectures
          </h4>
          
          {videos.length === 0 ? (
            <p className="text-muted">No recorded lectures available yet.</p>
          ) : (
            <div className="row">
              {videos.map((video, index) => (
                <div className="col-md-6 col-lg-4 mb-4" key={index}>
                  <div className="card h-100">
                    <div className="ratio ratio-16x9">
                      <video 
                        controls 
                        className="rounded-top"
                        controlsList="nodownload"
                        disablePictureInPicture
                      >
                        <source src={video.url} type="video/mp4" />
                      </video>
                    </div>
                    <div className="card-body">
                      <h6 className="card-title">{video.title}</h6>
                      <small className="text-muted">
                        {formatDistanceToNow(video.date)} ago
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

{/* Chat Section */}
<div className="chat-container">
  <div className="chat-card">
    {/* Header with animated tabs */}
    <div className="chat-header">
      <div className="chat-tabs">
        <button
          className={`chat-tab ${activeTab === 'group' ? 'active' : ''}`}
          onClick={() => setActiveTab('group')}
        >
          <span className="tab-label">Group Chat</span>
          <span className="tab-underline"></span>
        </button>
        <button
          className={`chat-tab ${activeTab === 'private' ? 'active' : ''}`}
          onClick={() => setActiveTab('private')}
        >
          <span className="tab-label">Private Chat</span>
          <span className="tab-underline"></span>
        </button>
      </div>
    </div>

    {/* Messages container with scroll */}
    <div className="messages-container">
      {(activeTab === 'group' ? groupMsgs : privateMsgs).map((msg, i) => {
        const isSelf = (msg.senderEmail || msg.sender_email) === user.email;
        const senderName = isSelf ? 'You' : getStudentName(msg.senderEmail || msg.sender_email);
        
        return (
          <div 
            key={i} 
            className={`message-wrapper ${isSelf ? 'self' : 'other'}`}
            data-aos={isSelf ? "fade-left" : "fade-right"}
          >
            {!isSelf && (
              <div className="message-avatar">
                <FaUser className="avatar-icon" />
              </div>
            )}
            <div className={`message-bubble ${isSelf ? 'self' : 'other'}`}>
              {!isSelf && (
                <div className="message-sender">
                  <span>{senderName}</span>
                </div>
              )}
              <div className="message-text">
                {msg.message || msg.content}
              </div>
              <div className={`message-time ${isSelf ? 'self' : 'other'}`}>
                {formatMessageDate(msg.createdAt || msg.created_at)}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={chatEndRef} />
      
      {(activeTab === 'group' ? groupMsgs : privateMsgs).length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <p className="empty-text">No messages yet</p>
          <p className="empty-subtext">Be the first to start the conversation!</p>
        </div>
      )}
    </div>

    {/* Input area with enhanced UI */}
    <div className="message-input-area">
      <div className="input-group">
        <button className="attachment-button">
          <FaPaperclip />
        </button>
        <input
          type="text"
          className="message-input"
          placeholder={`Type your ${activeTab} message...`}
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          className={`send-button ${!newMsg.trim() ? 'disabled' : ''}`}
          onClick={sendMessage}
          disabled={!newMsg.trim()}
        >
          <FaPaperPlane className="send-icon" />
        </button>
      </div>
    </div>
  </div>
</div>

    </div>
  );
};

export default YourCourse;
