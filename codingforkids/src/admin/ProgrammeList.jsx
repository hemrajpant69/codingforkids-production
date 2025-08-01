import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProgrammeList = () => {
  const [programmes, setProgrammes] = useState([]);

  useEffect(() => {
    axios.get('https://codingforkidsnepal.com/api/programmes')
      .then(res => setProgrammes(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    await axios.delete(`https://codingforkidsnepal.com/api/programmes/${id}`);
    setProgrammes(programmes.filter(p => p.id !== id));
  };

  return (
    <>
    <Link to="add" className="btn btn-primary mb-3">Add New Programme</Link>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Photo</th>
            <th>Title</th>
            <th>Price</th>
            <th>Start</th>
            <th>QR</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {programmes.map(p => (
            <tr key={p.id}>
              <td><img src={`https://codingforkidsnepal.com/uploads/${p.photo}`} width="80" alt="Program" /></td>
              <td>{p.title}</td>
              <td>{p.price}</td>
              <td>{new Date(p.start_time).toLocaleDateString()}</td>
              <td><img src={`https://codingforkidsnepal.com/uploads/${p.payment_qr}`} width="50" alt="QR" /></td>
              <td>
                <Link to={`/admin/edit/${p.id}`} className="btn btn-sm btn-warning me-2">Edit</Link>

                <button onClick={() => handleDelete(p.id)} className="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ProgrammeList;
