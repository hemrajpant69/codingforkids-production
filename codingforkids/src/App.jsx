import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import About from './components/About';
import Programme from './components/Programme';
import PaymentPage from './components/PaymentPage';
import './App.css';
import Dashboard from './admin/Dashboard';
import YourCourse from './components/YourCourse';
import Home from './components/Home';
import Contact from './components/Contact';
import AdminRouteWrapper from './admin/AdminRouteWrapper';
import AddProgramme from './admin/AddProgramme';
import EditProgramme from './admin/EditProgramme';
import PendingEnrollments from './admin/PendingEnrollments';
import RecordedLectureList from './admin/RecordedLectureList';
import UploadRecordedLecture from './admin/UploadRecordedLecture';
import ProgrammeList from './admin/ProgrammeList';
import AdminChat from './admin/AdminChat';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="container my-5 flex-grow-1 pt-5">
    <Routes>
  {/* Public Routes */}
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/programmes" element={<Programme />} />
  <Route path="/enroll/:id" element={<PaymentPage />} />
  <Route path="/yourcourse" element={<YourCourse />} />

  {/* Admin Protected Routes */}
  <Route path="/admin" element={<AdminRouteWrapper />}>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="add" element={<AddProgramme />} />
    <Route path="programmelist" element={<ProgrammeList />} />
    <Route path="edit/:id" element={<EditProgramme />} />
    <Route path="pending-enrollments" element={<PendingEnrollments />} />
    <Route path="lectures" element={<RecordedLectureList />} />
    <Route path="lectures/add" element={<UploadRecordedLecture />} />
    <Route path="chat" element={<AdminChat />} />
  </Route>

  {/* Fallback Route */}
  <Route path="*" element={<Home />} />
</Routes>

      </main>
      <Footer />
    </div>
  );
}

export default App;
