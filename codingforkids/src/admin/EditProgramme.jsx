import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditProgramme = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', price: '', start_time: '', zoom_link: '' });

  useEffect(() => {
    axios.get(`https://codingforkidsnepal.com/api/programmes/${id}`)
      .then(res => setForm(res.data));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`https://codingforkidsnepal.com/api/programmes/${id}`, form);
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Edit Programme</h3>
      <input className="form-control mb-2" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
      <textarea className="form-control mb-2" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
      <input className="form-control mb-2" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
      <input className="form-control mb-2" type="datetime-local" value={form.start_time?.slice(0, 16)} onChange={e => setForm({ ...form, start_time: e.target.value })} />
      zoom_link :
      <input className="form-control mb-2" value={form.zoom_link} onChange={e => setForm({ ...form, zoom_link: e.target.value })} />
      <button className="btn btn-primary" type="submit">Save Changes</button>
    </form>
  );
};

export default EditProgramme;
