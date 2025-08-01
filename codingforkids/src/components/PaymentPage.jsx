import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [programme, setProgramme] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [contactNumber, setContactNumber] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [paymentPreview, setPaymentPreview] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgramme = async () => {
      try {
        const response = await axios.get(`https://codingforkidsnepal.com/api/programmes/${id}`);
        setProgramme(response.data);
      } catch (error) {
        console.error('Error fetching programme:', error);
        navigate('/not-found', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgramme();

    return () => {
      if (paymentPreview) {
        URL.revokeObjectURL(paymentPreview);
      }
    };
  }, [id, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^[0-9]{10}$/.test(contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid 10-digit phone number';
    }
    
    if (!paymentScreenshot) {
      newErrors.paymentScreenshot = 'Payment screenshot is required';
    } else if (!paymentScreenshot.type.match(/^image\/(jpeg|png|jpg|webp)$/)) {
      newErrors.paymentScreenshot = 'Only JPEG, PNG, or WebP images are allowed';
    } else if (paymentScreenshot.size > 5 * 1024 * 1024) {
      newErrors.paymentScreenshot = 'File size must be less than 5MB';
    }
    
    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBankPhonePayClick = () => {
    setShowQRCode(true);
  };

  const handleAutomaticTransferClick = () => {
    alert("This feature is not available right now");
  };

  const handleContactNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setContactNumber(value);
    if (errors.contactNumber) {
      setErrors(prev => ({ ...prev, contactNumber: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentScreenshot(file);
      setPaymentPreview(URL.createObjectURL(file));
    }
    if (errors.paymentScreenshot) {
      setErrors(prev => ({ ...prev, paymentScreenshot: '' }));
    }
  };

  const handleTermsChange = (e) => {
    setAgreeTerms(e.target.checked);
    if (errors.agreeTerms) {
      setErrors(prev => ({ ...prev, agreeTerms: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!user) {
      alert('Please login to enroll');
      return navigate('/login', { state: { from: `/programmes/${id}/payment` } });
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', user.name);
      formData.append('email', user.email);
      formData.append('phone_number', contactNumber);
      formData.append('course', programme.title);
      formData.append('course_id', id);
      formData.append('payment_screenshot', paymentScreenshot);

      const response = await axios.post(
        'http://localhost:5000/api/students/enroll', 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          timeout: 15000
        }
      );

      if (response.data.success) {
        alert('Enrollment successful!');
        navigate('/yourcourse', { state: { enrolled: true } });
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      let errorMessage = 'An error occurred during enrollment';
      
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please try again.';
      } else if (error.message.includes('Network Error')) {
        errorMessage = 'Network error. Please check your connection.';
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!programme) {
    return (
      <div className="container text-center my-5">
        <h2>Course Not Found</h2>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => navigate('/programmes')}
        >
          Browse Available Courses
        </button>
      </div>
    );
  }

  const formattedDate = new Date(programme.start_time).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12 text-center">
          <h2 className="fw-bold">Enroll Now In {programme.title}</h2>
          <p className="text-muted">
            The classes will start from <strong>{formattedDate}</strong>.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <span className="badge bg-primary">Live Classes</span>
            <span className="badge bg-success">Recorded Lectures</span>
            <span className="badge bg-info text-dark">24/7 Discussions</span>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <img
            src={
              programme.photo?.startsWith('http')
                ? programme.photo
                : `http://localhost:5000/uploads/${programme.photo}`
            }
            alt={programme.title}
            className="img-fluid rounded shadow"
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
          <h3 className="mt-3">{programme.title}</h3>
          <h4>Rs. {programme.price}</h4>
          <p className="text-muted">{programme.description}</p>
        </div>

        <div className="col-md-6">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <h4>Choose Payment Method</h4>
            <div className="d-flex gap-3 mb-3">
              <button 
                type="button"
                className={`btn ${showQRCode ? 'btn-primary' : 'btn-outline-primary'} w-50`}
                onClick={handleBankPhonePayClick}
              >
                Bank/Phone Pay
              </button>
              <button 
                type="button"
                className="btn btn-outline-success w-50"
                onClick={handleAutomaticTransferClick}
              >
                Automatic Transfer
              </button>
            </div>
            
            {showQRCode && programme.payment_qr && (
              <div className="mb-3 text-center">
                <img 
                  src={
                    programme.payment_qr.startsWith('http')
                      ? programme.payment_qr
                      : `http://localhost:5000/uploads/${programme.payment_qr}`
                  }
                  alt="QR Code"
                  className="img-fluid border p-2"
                  style={{ maxWidth: '200px' }}
                />
                <p className="mt-2 text-muted">Please scan this QR code to make payment</p>
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="contactNumber" className="form-label">Contact Number*</label>
              <input 
                type="tel" 
                id="contactNumber"
                className={`form-control ${errors.contactNumber ? 'is-invalid' : ''}`}
                value={contactNumber}
                onChange={handleContactNumberChange}
                placeholder="Enter your 10-digit phone number"
                maxLength="10"
                required
              />
              {errors.contactNumber && (
                <div className="invalid-feedback d-block">{errors.contactNumber}</div>
              )}
            </div>
            
            <div className="mb-3">
              <label htmlFor="paymentScreenshot" className="form-label">Upload Payment Screenshot*</label>
              <input 
                type="file" 
                id="paymentScreenshot"
                className={`form-control ${errors.paymentScreenshot ? 'is-invalid' : ''}`}
                onChange={handleFileChange}
                accept="image/jpeg, image/png, image/webp"
                capture="environment"
                required
              />
              {paymentPreview && (
                <div className="mt-2">
                  <img 
                    src={paymentPreview} 
                    alt="Payment preview" 
                    className="img-thumbnail" 
                    style={{ maxHeight: '150px' }}
                  />
                  <button 
                    type="button"
                    className="btn btn-sm btn-outline-danger ms-2"
                    onClick={() => {
                      setPaymentScreenshot(null);
                      setPaymentPreview('');
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}
              {errors.paymentScreenshot && (
                <div className="invalid-feedback d-block">{errors.paymentScreenshot}</div>
              )}
              <small className="text-muted">Max file size: 5MB (JPEG, PNG, WebP)</small>
            </div>
            
            <div className="form-check mb-3">
              <h5>Course Fee: Rs. {programme.price}</h5>
              <input 
                className={`form-check-input ${errors.agreeTerms ? 'is-invalid' : ''}`}
                type="checkbox" 
                id="agreeTerms"
                checked={agreeTerms}
                onChange={handleTermsChange}
                required
              />
              
              <label className="form-check-label" htmlFor="agreeTerms">
                I agree to the <a 
                  href="/terms" 
                  className="text-decoration-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  terms and conditions
                </a>*
              </label>
              {errors.agreeTerms && (
                <div className="invalid-feedback d-block">{errors.agreeTerms}</div>
              )}
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary w-100 py-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing...
                </>
              ) : (
                'Confirm Enrollment'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;