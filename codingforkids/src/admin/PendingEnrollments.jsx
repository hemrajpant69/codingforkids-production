import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PendingEnrollments = () => {
  const [pendingEnrollments, setPendingEnrollments] = useState([]);

  const fetchPendingEnrollments = async () => {
    try {
      const { data } = await axios.get('https://codingforkidsnepal.com/api/students/pending');
      setPendingEnrollments(data.data);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.post(`https://codingforkidsnepal.com/api/students/approve/${id}`);
      setPendingEnrollments((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error approving student:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.delete(`https://codingforkidsnepal.com/api/students/${id}`);
      setPendingEnrollments((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error rejecting student:', error);
    }
  };

  useEffect(() => {
    fetchPendingEnrollments();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">📋 Pending Enrollments</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow rounded-lg">
          <thead className="bg-gray-100 text-sm text-gray-600 uppercase">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Contact</th>
              <th className="py-3 px-4 text-left">Course</th>
              <th className="py-3 px-4 text-left">Screenshot</th>
              <th className="py-3 px-4 text-left">Time Ago</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingEnrollments.map((student) => (
              <tr key={student.id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4">{student.name}</td>
                <td className="py-3 px-4">{student.email}</td>
                <td className="py-3 px-4">{student.phone_number}</td>
                <td className="py-3 px-4">{student.course_title}</td>
                <td className="py-3 px-4">
                  <a
                    href={`https://codingforkidsnepal.com${student.payment_screenshot}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    View
                  </a>
                </td>
                <td className="py-3 px-4">{student.time_ago} min ago</td>
                <td className="py-3 px-4 flex space-x-2">
                  <button
                    onClick={() => handleApprove(student.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(student.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
            {pendingEnrollments.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No pending enrollments.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingEnrollments;
