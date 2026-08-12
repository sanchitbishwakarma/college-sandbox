import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { api } from '../services/api';
import LoadingState from '../components/LoadingState';

const studentSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .endsWith("@ncit.edu.np", "Email must end with @ncit.edu.np"),
  name: z.string().min(1, "Name is required"),
  collegeRollNumber: z.string().min(1, "College Roll Number / CRN is required"),
  semester: z.string().min(1, "Semester is required"),
  academicYear: z.preprocess((val) => val === "" ? undefined : Number(val), z.number({
    required_error: "Academic Year is required",
    invalid_type_error: "Academic Year must be a number"
  }).int().min(1900, "Academic year must be after 1900").max(2200, "Academic year must be before 2200")),
  graduationYear: z.preprocess((val) => val === "" ? undefined : Number(val), z.number({
    required_error: "Graduation Year is required",
    invalid_type_error: "Graduation Year must be a number"
  }).int().min(1900, "Graduation year must be after 1900").max(2200, "Graduation year must be before 2200")),
  sgpa: z.preprocess((val) => val === "" ? undefined : Number(val), z.number({
    required_error: "SGPA is required",
    invalid_type_error: "SGPA must be a number"
  }).min(0.0, "SGPA must be between 0.0 and 4.0").max(4.0, "SGPA must be between 0.0 and 4.0")),
  faculty: z.string().min(1, "Faculty is required"),
  program: z.string().min(1, "Program is required"),
  registrationNumber: z.string().min(1, "Registration Number is required"),
}).refine((data) => {
  const emailParts = data.email.split("@");
  if (emailParts.length !== 2) return false;
  const localParts = emailParts[0].split(".");
  if (localParts.length < 2) return false;
  const extractedCRN = localParts[localParts.length - 1];
  return extractedCRN === String(data.collegeRollNumber).trim();
}, {
  message: "Email CRN must match collegeRollNumber. Expected format: <name>.<crn>@ncit.edu.np",
  path: ["email"]
});

export default function StudentForm() {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEditMode);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      email: '',
      name: '',
      collegeRollNumber: '',
      semester: '',
      academicYear: '',
      graduationYear: '',
      sgpa: '',
      faculty: '',
      program: '',
      registrationNumber: '',
    }
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchStudent = async () => {
        try {
          setLoading(true);
          const response = await api.getStudentById(id);
          const student = response.data;
          if (student) {
            // Set values in the form
            setValue('email', student.email);
            setValue('name', student.name);
            setValue('collegeRollNumber', student.collegeRollNumber);
            setValue('semester', student.semester);
            setValue('academicYear', student.academicYear);
            setValue('graduationYear', student.graduationYear);
            setValue('sgpa', student.sgpa);
            setValue('faculty', student.faculty);
            setValue('program', student.program);
            setValue('registrationNumber', student.registrationNumber);
          }
        } catch (err) {
          setSubmitError(err.message || 'Failed to load student details.');
        } finally {
          setLoading(false);
        }
      };
      fetchStudent();
    }
  }, [id, isEditMode, setValue]);

  const onSubmit = async (data) => {
    try {
      setSubmitError(null);
      setSubmitSuccess(false);

      if (isEditMode) {
        await api.updateStudent(id, data);
      } else {
        await api.createStudent(data);
      }

      setSubmitSuccess(true);
      
      // Wait 1.5 seconds and redirect to /
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setSubmitError(err.message || 'Failed to save student record.');
    }
  };

  if (loading) {
    return <LoadingState message="Loading student details..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-8">
        <div className="border-b border-gray-100 dark:border-gray-800 pb-6 mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {isEditMode ? 'Edit Student Details' : 'Register New Student'}
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {isEditMode 
              ? 'Update the student profile information in the system database.' 
              : 'Add a new student profile to the integration portal.'}
          </p>
        </div>

        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-400 flex items-start space-x-2">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">{submitError}</span>
          </div>
        )}

        {submitSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-400 flex items-center space-x-2 animate-pulse">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">
              {isEditMode ? 'Student updated successfully!' : 'Student created successfully!'} Redirecting...
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="e.g. sanchit.181234@ncit.edu.np"
                {...register('email')}
                className={`w-full rounded-xl border px-4 py-2.5 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-250 dark:border-gray-750'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Sanchit Bishwakarma"
                {...register('name')}
                className={`w-full rounded-xl border px-4 py-2.5 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-250 dark:border-gray-750'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.name.message}</p>
              )}
            </div>

            {/* College Roll Number / CRN */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                College Roll Number / CRN
              </label>
              <input
                type="text"
                placeholder="e.g. 181234"
                {...register('collegeRollNumber')}
                className={`w-full rounded-xl border px-4 py-2.5 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  errors.collegeRollNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-250 dark:border-gray-750'
                }`}
              />
              {errors.collegeRollNumber && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.collegeRollNumber.message}</p>
              )}
            </div>

            {/* Registration Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Registration Number
              </label>
              <input
                type="text"
                placeholder="e.g. 2018-1-03-0145"
                {...register('registrationNumber')}
                className={`w-full rounded-xl border px-4 py-2.5 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  errors.registrationNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-250 dark:border-gray-750'
                }`}
              />
              {errors.registrationNumber && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.registrationNumber.message}</p>
              )}
            </div>

            {/* Semester */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Semester
              </label>
              <input
                type="text"
                placeholder="e.g. 8th"
                {...register('semester')}
                className={`w-full rounded-xl border px-4 py-2.5 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  errors.semester ? 'border-red-500 focus:ring-red-500' : 'border-gray-250 dark:border-gray-750'
                }`}
              />
              {errors.semester && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.semester.message}</p>
              )}
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Academic Year
              </label>
              <input
                type="number"
                placeholder="e.g. 2018"
                {...register('academicYear')}
                className={`w-full rounded-xl border px-4 py-2.5 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  errors.academicYear ? 'border-red-500 focus:ring-red-500' : 'border-gray-250 dark:border-gray-750'
                }`}
              />
              {errors.academicYear && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.academicYear.message}</p>
              )}
            </div>

            {/* Graduation Year */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Graduation Year
              </label>
              <input
                type="number"
                placeholder="e.g. 2022"
                {...register('graduationYear')}
                className={`w-full rounded-xl border px-4 py-2.5 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  errors.graduationYear ? 'border-red-500 focus:ring-red-500' : 'border-gray-250 dark:border-gray-750'
                }`}
              />
              {errors.graduationYear && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.graduationYear.message}</p>
              )}
            </div>

            {/* SGPA */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                SGPA
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 3.75"
                {...register('sgpa')}
                className={`w-full rounded-xl border px-4 py-2.5 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  errors.sgpa ? 'border-red-500 focus:ring-red-500' : 'border-gray-250 dark:border-gray-750'
                }`}
              />
              {errors.sgpa && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.sgpa.message}</p>
              )}
            </div>

            {/* Faculty */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Faculty
              </label>
              <input
                type="text"
                placeholder="e.g. Science and Technology"
                {...register('faculty')}
                className={`w-full rounded-xl border px-4 py-2.5 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  errors.faculty ? 'border-red-500 focus:ring-red-500' : 'border-gray-250 dark:border-gray-750'
                }`}
              />
              {errors.faculty && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.faculty.message}</p>
              )}
            </div>

            {/* Program */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Program
              </label>
              <input
                type="text"
                placeholder="e.g. BE Software Engineering"
                {...register('program')}
                className={`w-full rounded-xl border px-4 py-2.5 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  errors.program ? 'border-red-500 focus:ring-red-500' : 'border-gray-250 dark:border-gray-750'
                }`}
              />
              {errors.program && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.program.message}</p>
              )}
            </div>

          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => navigate('/')}
              className="px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all inline-flex items-center cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                isEditMode ? 'Update Profile' : 'Register Student'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
