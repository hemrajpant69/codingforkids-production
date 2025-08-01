import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProgramme = () => {
  const navigate = useNavigate(); // For redirection

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [startTime, setStartTime] = useState('');
  const [photo, setPhoto] = useState(null);
  const [qrImage, setQrImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('start_time', startTime);
      formData.append('photo', photo);
      formData.append('payment_qr', qrImage);

      await axios.post('https://codingforkidsnepal.com/api/programmes', formData);


      alert('✅ Programme added successfully!');
      navigate('/admin'); // Redirect to programme list
    } catch (err) {
      console.error(err);
      alert('❌ Failed to add programme.');
    }
  };

  return (
    <div>
      <h4 className="mb-3">Add Programme</h4>
     <form onSubmit={handleSubmit} encType="multipart/form-data">

        <input type="text" className="form-control mb-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea className="form-control mb-2" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input type="number" className="form-control mb-2" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <input type="datetime-local" className="form-control mb-2" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        
        <div className="mb-2">
          <label>Photo:</label>
          <input type="file" className="form-control" onChange={(e) => setPhoto(e.target.files[0])} required />
        </div>

        <div className="mb-3">
          <label>QR Image:</label>
          <input type="file" className="form-control" onChange={(e) => setQrImage(e.target.files[0])} required />
        </div>

        <button type="submit" className="btn btn-success">Add Programme</button>
      </form>
    </div>
  );
};

export default AddProgramme;
