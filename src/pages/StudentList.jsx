import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmationModal from '../components/ConfirmationModal';

// Field label mapping for display
const FIELD_LABELS = {
  id: 'ID',
  email: 'Email',
  name: 'Name',
  collegeRollNumber: 'CRN',
  semester: 'Semester',
  academicYear: 'Academic Year',
  graduationYear: 'Graduation Year',
  sgpa: 'SGPA',
  faculty: 'Faculty',
  program: 'Program',
  registrationNumber: 'Reg. Number',
  createdAt: 'Created At',
  updatedAt: 'Updated At',
};

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFieldControl, setShowFieldControl] = useState(false);

  // Field visibility control — all fields from the student JSON
  const [visibleFields, setVisibleFields] = useState({
    id: true,
    email: true,
    name: true,
    collegeRollNumber: true,
    semester: true,
    academicYear: true,
    graduationYear: true,
    sgpa: true,
    faculty: true,
    program: true,
    registrationNumber: false ,
    createdAt: false,
    updatedAt: false,
  });

  // Delete modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getStudents();
      setStudents(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch students.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const openDeleteModal = (student) => {
    setStudentToDelete(student);
    setModalOpen(true);
  };

  const closeDeleteModal = () => {
    setStudentToDelete(null);
    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (!studentToDelete) return;
    try {
      setDeleteLoading(true);
      const res = await api.deleteStudent(studentToDelete.id);
      setActionSuccessMessage(res.message || 'Student deleted successfully');
      setStudents((prev) => prev.filter((s) => s.id !== studentToDelete.id));
      closeDeleteModal();
      setTimeout(() => setActionSuccessMessage(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to delete student.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const toggleField = (field) => {
    setVisibleFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const activeFields = Object.keys(visibleFields).filter((f) => visibleFields[f]);

  if (loading) {
    return <LoadingState message="Fetching student directory..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchStudents} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Student Directory
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            A list of all current students enrolled in the college system.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          <button
            onClick={() => setShowFieldControl((v) => !v)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 text-sm font-semibold rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M3 8h18M3 12h10" />
            </svg>
            Columns
          </button>
          <button
            onClick={() => navigate('/student/create')}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all cursor-pointer"
          >
            Add Student
          </button>
        </div>
      </div>

      {/* Field Visibility Control Panel */}
      {showFieldControl && (
        <div className="mb-6 p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Toggle Visible Columns</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setVisibleFields(Object.fromEntries(Object.keys(visibleFields).map((k) => [k, true])))}
                className="text-xs px-3 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 font-medium hover:bg-purple-100 dark:hover:bg-purple-950/50 transition-colors"
              >
                Show All
              </button>
              <button
                onClick={() => setVisibleFields(Object.fromEntries(Object.keys(visibleFields).map((k) => [k, false])))}
                className="text-xs px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Hide All
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.keys(visibleFields).map((field) => (
              <button
                key={field}
                onClick={() => toggleField(field)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  visibleFields[field]
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-purple-400'
                }`}
              >
                {visibleFields[field] ? (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                {FIELD_LABELS[field]}
              </button>
            ))}
          </div>
        </div>
      )}

      {actionSuccessMessage && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-400 flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">{actionSuccessMessage}</span>
        </div>
      )}

      {students.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center shadow-sm">
          <div className="inline-flex p-4 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-950 dark:text-white mb-1">No Students Found</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto mb-6">
            There are no student records in the system database yet. Get started by adding a student.
          </p>
          <button
            onClick={() => navigate('/student/create')}
            className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg text-white bg-purple-600 hover:bg-purple-500 transition-colors"
          >
            Create First Student
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
              <thead className="bg-gray-50 dark:bg-gray-850">
                <tr>
                  {activeFields.map((field) => (
                    <th
                      key={field}
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      {FIELD_LABELS[field]}
                    </th>
                  ))}
                  <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-850/50 transition-colors">
                    {activeFields.map((field) => (
                      <td key={field} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {field === 'name' ? (
                          <span className="font-semibold text-gray-950 dark:text-white">{student[field]}</span>
                        ) : field === 'createdAt' || field === 'updatedAt' ? (
                          new Date(student[field]).toLocaleDateString()
                        ) : (
                          student[field] ?? '—'
                        )}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button
                        onClick={() => navigate(`/student/update/${student.id}`)}
                        className="inline-flex items-center text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 font-semibold transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(student)}
                        className="inline-flex items-center text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-semibold transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Delete Student Record"
        message={`Are you sure you want to delete ${studentToDelete?.name}? This action is permanent and cannot be undone.`}
        isLoading={deleteLoading}
      />
    </div>
  );
}
