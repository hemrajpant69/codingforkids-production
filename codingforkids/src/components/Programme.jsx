import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Programme = () => {
  const [programmes, setProgrammes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const response = await axios.get('https://codingforkidsnepal.com/api/programmes');
        setProgrammes(response.data);
      } catch (error) {
        console.error('Error fetching programmes:', error);
      }
    };

    fetchProgrammes();
  }, []);

  const handleEnroll = (id) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.email) {
      navigate(`/enroll/${id}`);
    } else {
      alert('Please log in to enroll in a programme.');
    }
  };

  return (
    <div className="container my-5">
      <h1 className="mb-4 text-center">Our Programmes</h1>
      <div className="row g-4">
        {programmes.map((prog) => (
          <div className="col-md-4" key={prog.id}>
            <div className="card h-100 shadow custom-program-card">
              <img
  src={
    prog.photo?.startsWith('http')
      ? prog.photo
      : `https://codingforkidsnepal.com/uploads/${prog.photo}`  // ✅ Use full backend URL
  }
  className="card-img-top"
  alt={prog.title}
/>

              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{prog.title}</h5>
                <p className="card-text">{prog.description}</p>
                <div className="mt-auto">
                  <p className="fw-bold mb-2">Rs. {prog.price}</p>
                  <button
                    className="btn custom-btn w-100"
                    onClick={() => handleEnroll(prog.id)}
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Programme;
