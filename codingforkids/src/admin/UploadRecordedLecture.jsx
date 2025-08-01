import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UploadRecordedLecture = () => {
  const [programmes, setProgrammes] = useState([]);
  const [title, setTitle] = useState('');
  const [video, setVideo] = useState(null);
  const [courseId, setCourseId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://codingforkidsnepal.com/api/programmes')
      .then(res => setProgrammes(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!title || !video || !courseId) return alert("Fill all fields");

  const formData = new FormData();
  formData.append('title', title);
  formData.append('course_id', courseId);
  formData.append('video', video); // This must match the Multer field name

  try {
    const res = await axios.post('https://codingforkidsnepal.com/api/lectures', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    alert('Lecture uploaded!');
    console.log(res.data); // Contains the video URL
    navigate('/admin');
  } catch (err) {
    console.error(err);
    alert('Upload failed!');
  }
};
  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Lecture Title" className="form-control mb-2" />
      <select value={courseId} onChange={e => setCourseId(e.target.value)} className="form-control mb-2">
        <option value="">Select Programme</option>
        {programmes.map(p => (
          <option key={p.id} value={p.id}>{p.title}</option>
        ))}
      </select>
      <input type="file" onChange={e => setVideo(e.target.files[0])} accept="video/*" className="form-control mb-3" />
      <button type="submit" className="btn btn-success">Upload</button>
    </form>
  );
};

export default UploadRecordedLecture;
