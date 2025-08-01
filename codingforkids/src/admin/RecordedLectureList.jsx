import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaPlay, FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import { UserContext } from '../context/UserContext';

const RecordedLectureList = () => {
  const { user } = useContext(UserContext);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);

  useEffect(() => {
    const fetchLectures = async () => {
      if (!user?.email) {
        setError("Please login to view lectures.");
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get('https://codingforkidsnepal.com/api/lectures');

        setLectures(data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lecture permanently?')) return;

    try {
      await axios.delete(`https://codingforkidsnepal.com/api/lectures/${id}`);
      setLectures(lectures.filter((lecture) => lecture.id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const getVideoName = (videoPath) => {
    if (!videoPath) return 'No video';
    try {
      return videoPath.split('/').pop() || 'Video file';
    } catch {
      return 'Video file';
    }
  };

  if (loading) {
    return <div className="text-center my-5"><p>Loading lectures...</p></div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center mt-4">Error: {error}</div>;
  }

  if (lectures.length === 0) {
    return (
      <div className="text-center my-5">
        <p>No lectures found</p>
        <Link to="/admin/lectures/add" className="btn btn-primary mt-3">
          <FaPlus /> Add First Lecture
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Video Preview Modal */}
      {previewVideo && (
        <div className="video-preview-overlay">
          <div className="video-preview-container">
            <div className="video-preview-header">
              <h5>{previewVideo.title}</h5>
              <button
                className="close-btn"
                onClick={() => setPreviewVideo(null)}
              >
                <FaTimes />
              </button>
            </div>
            <video controls autoPlay className="video-preview-player">
              <source src={`https://codingforkidsnepal.com/${previewVideo.video}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Recorded Lectures</h2>
        <Link to="/admin/lectures/add" className="btn btn-primary">
          <FaPlus /> Add Lecture
        </Link>
      </div>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Course</th>
                <th>Title</th>
                <th>Video</th>
                <th>Uploaded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lectures.map((lecture) => (
                <tr key={lecture.id}>
                  <td>{lecture.course_title || `Course ID: ${lecture.course_id}`}</td>
                  <td className="fw-semibold">{lecture.title}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-sm btn-link p-0 me-2"
                        onClick={() => setPreviewVideo(lecture)}
                        title="Preview video"
                      >
                        <FaPlay className="text-primary" />
                      </button>
                      <span className="text-truncate" style={{ maxWidth: '150px' }}>
                        {getVideoName(lecture.video)}
                      </span>
                    </div>
                  </td>
                  <td>
                    {lecture.uploaded_time ? (
                      <>
                        {new Date(lecture.uploaded_time).toLocaleDateString()}
                        <br />
                        <small className="text-muted">
                          {new Date(lecture.uploaded_time).toLocaleTimeString()}
                        </small>
                      </>
                    ) : (
                      'No date'
                    )}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link
                        to={`/admin/lectures/edit/${lecture.id}`}
                        className="btn btn-sm btn-outline-primary"
                        title="Edit"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(lecture.id)}
                        className="btn btn-sm btn-outline-danger"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecordedLectureList;
