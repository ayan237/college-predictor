'use client';

import { useState } from 'react';

type CutoffEntry = {
  college: string;
  course: string;
  category: string;
  cutoff: number;
  location: string;
};

export default function InputForm() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [percentage, setPercentage] = useState('');
  const [category, setCategory] = useState('');
  const [course, setCourse] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState<CutoffEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pdfFile || !percentage || !category || !course) {
      setError('All fields except location are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', pdfFile);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const parsedData: CutoffEntry[] = await res.json();

      // Filter logic on frontend (for now)
      const filtered = parsedData.filter((item) => {
        return (
          item.category === category &&
          item.course === course &&
          parseFloat(percentage) >= item.cutoff &&
          (location === '' || item.college.toLowerCase().includes(location.toLowerCase()))
        );
      });

      setResults(filtered);
    } catch (err: any) {
      setError('Error uploading or parsing the PDF');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">College Predictor</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
          className="block w-full"
        />

        <input
          type="number"
          placeholder="Percentage"
          value={percentage}
          onChange={(e) => setPercentage(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Category (e.g., GOPEN)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Course (must match PDF exactly)"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Preferred Location (optional)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {results.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Eligible Colleges</h2>
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">#</th>
                <th className="p-2 border">College</th>
                <th className="p-2 border">Course</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Cutoff %</th>
                <th className="p-2 border">Location</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border">{item.college}</td>
                  <td className="p-2 border">{item.course}</td>
                  <td className="p-2 border">{item.category}</td>
                  <td className="p-2 border">{item.cutoff}</td>
                  <td className="p-2 border">{item.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
