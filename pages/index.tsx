'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Select from 'react-select';
import { saveAs } from 'file-saver';
import '../public/styles.css';

type CutoffEntry = {
  college: string;
  course: string;
  category: string;
  cutoff: number;
  location: string;
};

const predefinedCourses = [
  "5G",
  "Aeronautical Engineering",
  "Agricultural Engineering",
  "Artificial Intelligence",
  "Artificial Intelligence (AI) and Data Science",
  "Artificial Intelligence and Data Science",
  "Artificial Intelligence and Machine Learning",
  "Automation and Robotics",
  "Automobile Engineering",
  "Bio Medical Engineering",
  "Bio Technology",
  "Chemical Engineering",
  "Civil Engineering",
  "Civil Engineering and Planning",
  "Civil and Environmental Engineering",
  "Civil and infrastructure Engineering",
  "Computer Engineering",
  "Computer Engineering (Software Engineering)",
  "Computer Engineering[Direct Second Year Second Shift]",
  "Computer Science",
  "Computer Science and Business Systems",
  "Computer Science and Design",
  "Computer Science and Engineering",
  "Computer Science and Engineering (Artificial Intelligence and Data Science)",
  "Computer Science and Engineering (Artificial Intelligence)",
  "Computer Science and Engineering (Cyber Security)",
  "Computer Science and Engineering (Internet of Things and Cyber Security Including Block Chain Technology)",
  "Computer Science and Engineering (IoT)",
  "Computer Science and Engineering(Artificial Intelligence and Machine Learning)",
  "Computer Science and Engineering(Cyber Security)",
  "Computer Science and Engineering(Data Science)",
  "Computer Science and Information Technology",
  "Computer Science and Technology",
  "Computer Technology",
  "Cyber Security",
  "Data Engineering",
  "Data Science",
  "Electrical Engg [Electrical and Power]",
  "Electrical Engg[Electronics and Power]",
  "Electrical Engineering",
  "Electrical and Computer Engineering",
  "Electrical and Electronics Engineering",
  "Electronics Engineering",
  "Electronics Engineering ( VLSI Design and Technology)",
  "Electronics and BiomedicalÂ Engineering",
  "Electronics and Communication (Advanced Communication Technology)",
  "Electronics and Communication Engineering",
  "Electronics and Communication(Advanced Communication Technology)",
  "Electronics and Computer Engineering",
  "Electronics and Computer Science",
  "Electronics and Telecommunication Engg",
  "Electronics and Telecommunication Engg[Direct Second Year Second Shift]",
  "Fashion Technology",
  "Food Technology",
  "Food Technology And Management",
  "Industrial IoT",
  "Information Technology",
  "Instrumentation Engineering",
  "Instrumentation and Control Engineering",
  "Internet of Things (IoT)",
  "Man Made Textile Technology",
  "Manufacturing Science and Engineering",
  "Mechanical & Automation Engineering",
  "Mechanical Engineering",
  "Mechanical Engineering[Sandwich]",
  "Mechanical and Mechatronics Engineering (Additive Manufacturing)",
  "Mechatronics Engineering",
  "Metallurgy and Material Technology",
  "Mining Engineering",
  "Oil Fats and Waxes Technology",
  "Oil Technology",
  "Paints Technology",
  "Paper and Pulp Technology",
  "Petro Chemical Engineering",
  "Petro Chemical Technology",
  "Plastic Technology",
  "Plastic and Polymer Engineering",
  "Plastic and Polymer Technology",
  "Printing Technology",
  "Production Engineering",
  "Production Engineering[Sandwich]",
  "Robotics and Artificial Intelligence",
  "Robotics and Automation",
  "Safety and Fire Engineering",
  "Structural Engineering",
  "Surface Coating Technology",
  "Textile Chemistry",
  "Textile Engineering / Technology",
  "Textile Plant Engineering",
  "Textile Technology"

/* your 90+ course list */];
const predefinedCategories = ["GOPEN", "GSC", "GST", "GOBC", "GSEBC", "LOPEN", "LST", "LOBC", "LSEBC", "EWS"];

const courseOptions = predefinedCourses.map(c => ({ label: c, value: c }));
const categoryOptions = predefinedCategories.map(c => ({ label: c, value: c }));

export default function Home() {
  const [percentage, setPercentage] = useState('');
  const [category, setCategory] = useState('');
  const [course, setCourse] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState<CutoffEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!percentage || !course || !category) {
      setError('Please fill in all required fields');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/colleges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          percentage: parseFloat(percentage),
          category,
          course,
          location,
        }),
      });

      const data: CutoffEntry[] = await res.json();
      setResults(data);
    } catch {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  function exportToCSV(data: CutoffEntry[]) {
    const headers = ['College', 'Course', 'Category', 'Cutoff %', 'Location'];
    const rows = data.map(row => [
      row.college,
      row.course,
      row.category,
      row.cutoff.toString(),
      row.location
    ]);

    const escape = (text: string) => `"${text.replace(/"/g, '""')}"`;

    const csvContent =
      [headers, ...rows]
        .map(row => row.map(cell => escape(String(cell))).join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'eligible-colleges.csv');
  }

  const selectStyles = {
    menu: (base: any) => ({
      ...base,
      zIndex: 9999,
      backgroundColor: darkMode ? '#1c2733' : 'white',
      color: darkMode ? '#f8fafc' : '#1e293b'
    }),
    control: (base: any) => ({
      ...base,
      backgroundColor: darkMode ? '#1e2b39' : 'white',
      borderColor: darkMode ? '#334155' : '#d1d5db',
      color: darkMode ? '#f8fafc' : '#1e293b'
    }),
    singleValue: (base: any) => ({
      ...base,
      color: darkMode ? '#f8fafc' : '#1e293b'
    })
  };

  return (
    <div className="container">
      <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? '🌙 Dark' : '☀️ Light'}
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
        <h1 className="text-center text-blue">🎓 College Predictor</h1>

        <form onSubmit={handleSubmit}>
          <label>Percentage *</label>
          <input
            type="number"
            value={percentage}
            onChange={e => setPercentage(e.target.value)}
            placeholder="e.g. 91.58"
          />

          <label>Preferred Location</label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Optional (e.g. Pune)"
          />

          <label>Select Course *</label>
          <Select
            classNamePrefix="react-select"
            className="react-select-container"
            options={courseOptions}
            value={courseOptions.find(o => o.value === course)}
            onChange={(o) => setCourse(o?.value || '')}
            styles={selectStyles}
          />

          <label>Select Category *</label>
          <Select
            classNamePrefix="react-select"
            className="react-select-container"
            options={categoryOptions}
            value={categoryOptions.find(o => o.value === category)}
            onChange={(o) => setCategory(o?.value || '')}
            styles={selectStyles}
          />

          {error && <p className="error-text">{error}</p>}

          <div className="button-group">
            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Predict Eligible Colleges'}
            </button>
          </div>
        </form>

        {results.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="result">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginBottom: '1rem',
                gap: '0.5rem'
              }}
            >
              <h2 style={{ margin: 0 }}>Eligible Colleges:</h2>
              <div className="button-group">
                <button onClick={() => exportToCSV(results)} style={{ margin: 0 }}>
                  ⬇️ Download CSV
                </button>
              </div>
            </div>

            {results.map((item, index) => (
              <motion.div
                key={index}
                className="card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <strong>{item.college}</strong>
                <p>Course: {item.course}</p>
                <p>Category: {item.category}</p>
                <p>Cutoff: {item.cutoff}%</p>
                <p>Location: {item.location || 'N/A'}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
