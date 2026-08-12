import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StudentList from './pages/StudentList';
import StudentForm from './pages/StudentForm';
import ApiLogs from './pages/ApiLogs';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-250">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<StudentList />} />
            <Route path="/student/create" element={<StudentForm />} />
            <Route path="/student/update/:id" element={<StudentForm />} />
            <Route path="/admin/api-log" element={<ApiLogs />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
