import { useMemo, useState } from 'react';
import { API_BASE } from '../api';
import { X, Eye, Edit2, Trash2, User, FileText, Zap, BookOpen, Users, Image, FileCheck, Grid3x3, List } from 'lucide-react';
// Preview Modal Component - Portal/Dialog Style
function PreviewModal({ isOpen, onClose, student }) {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-0 bg-black/30">
      <div className="relative bg-white h-full w-full max-w-md shadow-2xl flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-8 py-6 bg-linear-to-r from-blue-600 to-blue-700 border-b-4 border-blue-800 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">Student Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-500 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {/* Student Info Card */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-5 bg-blue-50 rounded-xl border-2 border-blue-300">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 shrink-0 flex items-center justify-center border-2 border-blue-400">
                {student.PhotoPath ? (
                  <img src={`${API_BASE}/${student.PhotoPath}`} alt={student.StudentName} className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-blue-400" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{student.StudentName}</h3>
                <p className="text-sm text-blue-600 font-semibold">{student.RollNumber || 'N/A'}</p>
                <p className="text-xs text-gray-600 mt-1">{student.Department || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-blue-700 border-b-2 border-blue-300 pb-2">Details</h3>

            {/* Detail Items */}
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-600">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Roll Number</p>
                <p className="text-gray-900 font-bold mt-1">{student.RollNumber || '—'}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-600">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Department</p>
                <p className="text-gray-900 font-bold mt-1">{student.Department || '—'}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-600">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Year of Study</p>
                <p className="text-gray-900 font-bold mt-1">{student.YearOfStudy || '—'}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-600">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Gender</p>
                <p className="text-gray-900 font-bold mt-1">{student.Gender || '—'}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-600">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Mobile Number</p>
                <p className="text-gray-900 font-bold mt-1">{student.MobileNumber || '—'}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-600">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Email</p>
                <p className="text-gray-900 font-bold mt-1">{student.Email || '—'}</p>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          {student.DocumentPath && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-blue-700 border-b-2 border-blue-300 pb-2">Documents</h3>
              <a
                href={`${API_BASE}/${student.DocumentPath}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-4 bg-blue-100 border-2 border-blue-300 rounded-lg hover:bg-blue-200 transition-colors font-semibold text-blue-700"
              >
                <FileText size={20} />
                View Document
              </a>
            </div>
          )}

          {/* Photo Section */}
          {student.PhotoPath && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-blue-700 border-b-2 border-blue-300 pb-2">Photo</h3>
              <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-blue-300">
                <img src={`${API_BASE}/${student.PhotoPath}`} alt={student.StudentName} className="w-full h-full object-cover" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50 border-t-2 border-gray-200 sticky bottom-0">
          <button
            onClick={onClose}
            className="w-full px-6 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
          >
            Close Portal
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StudentList({ students = [], onEdit, onDelete, onCreate, userType = 'student' }) {
  const [query, setQuery] = useState('');
  const [previewStudent, setPreviewStudent] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const isFaculty = userType === 'faculty';

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter(s => {
      return (
        (s.StudentName || '').toLowerCase().includes(q) ||
        (s.RollNumber || '').toLowerCase().includes(q) ||
        (s.MobileNumber || '').toLowerCase().includes(q) ||
        (s.Department || '').toLowerCase().includes(q)
      );
    });
  }, [students, query]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filtered.slice(startIdx, startIdx + itemsPerPage);

  const openPreview = (student) => {
    setPreviewStudent(student);
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewStudent(null);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <PreviewModal
        isOpen={showPreview}
        onClose={closePreview}
        student={previewStudent}
      />

      <div className="bg-white overflow-hidden rounded-2xl border-2 border-blue-500 shadow-lg">
        {/* Header Section - Blue theme */}
        <div className="px-8 py-6 bg-linear-to-r from-blue-600 to-blue-700">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                <Users size={32} />
                Students
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {isFaculty && (
                <button
                  onClick={(e) => { e.stopPropagation(); onCreate && onCreate(); }}
                  className="px-5 py-2.5 bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-lg shadow-md transition-all text-sm"
                >
                  + New Student
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-8 py-5 border-b-2 border-blue-200 bg-white">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              placeholder="Search"
              value={query}
              onChange={e => { setQuery(e.target.value); setCurrentPage(1); }}
              className="w-full px-5 py-3 bg-white border-2 border-blue-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl pl-12 text-sm transition-all outline-none font-medium placeholder-gray-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-linear-to-r from-blue-600 to-blue-700 text-white">
                <th className="px-4 py-3 text-left text-sm font-bold">Photo</th>
                <th className="px-4 py-3 text-left text-sm font-bold">Name</th>
                <th className="px-4 py-3 text-left text-sm font-bold">Roll Number</th>
                <th className="px-4 py-3 text-left text-sm font-bold">Department</th>
                <th className="px-4 py-3 text-left text-sm font-bold">Gender</th>
                <th className="px-4 py-3 text-left text-sm font-bold">Mobile</th>
                <th className="px-4 py-3 text-center text-sm font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center">
                    <p className="text-gray-500 font-semibold">No students found</p>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map(s => (
                  <tr key={s.StudentId} className="hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center">
                        {s.PhotoPath ? (
                          <img
                            src={`${API_BASE}/${s.PhotoPath}`}
                            alt={s.StudentName}
                            className="w-10 h-10 rounded-full object-cover border-2 border-blue-300 shadow-sm"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                            <User size={16} className="text-gray-500" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{s.StudentName}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{s.RollNumber || '—'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{s.Department || '—'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{s.Gender || '—'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{s.MobileNumber || '—'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      {isFaculty ? (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); onEdit && onEdit(s); }}
                            className="px-2 py-1.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold border border-blue-300 hover:bg-blue-200 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); onDelete && onDelete(s.StudentId); }}
                            className="px-2 py-1.5 bg-red-100 text-red-700 rounded text-xs font-semibold border border-red-300 hover:bg-red-200 transition-colors"
                          >
                            Delete
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); openPreview(s); }}
                            className="px-2 py-1.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold border border-blue-300 hover:bg-blue-200 transition-colors"
                          >
                            View
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); openPreview(s); }}
                          className="px-2 py-1.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold border border-blue-300 hover:bg-blue-200 transition-colors"
                        >
                          View Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-8 py-6 bg-white border-t-2 border-blue-200 flex items-center justify-center gap-3">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2.5 border-2 border-blue-500 text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2.5 border-2 rounded-lg font-bold transition-colors ${page === currentPage
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-blue-300 text-blue-600 hover:bg-blue-50'
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2.5 border-2 border-blue-500 text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </>
  );
}
