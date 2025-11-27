import { useEffect, useState } from 'react';
import { createStudent, updateStudent, API_BASE } from '../api';
import { User, Phone, Calendar, BookOpen, GraduationCap, FileText, Upload, X, Save, Users, Image } from 'lucide-react';

const INITIAL_FORM = {
  StudentName: '',
  Gender: '',
  DateOfBirth: '',
  MobileNumber: '',
  Department: '',
  YearOfStudy: '',
  RollNumber: ''
};

export default function StudentForm({ selected, onSaved, onCancel }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [photoFile, setPhotoFile] = useState(null);
  const [docFile, setDocFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [docPreview, setDocPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selected) {
      setForm({
        StudentName: selected.StudentName || '',
        Gender: selected.Gender || '',
        DateOfBirth: selected.DateOfBirth || '',
        MobileNumber: selected.MobileNumber || '',
        Department: selected.Department || '',
        YearOfStudy: selected.YearOfStudy || '',
        RollNumber: selected.RollNumber || ''
      });

      setPhotoPreview(selected.PhotoPath ? `${API_BASE}/${selected.PhotoPath}` : null);
      setDocPreview(selected.DocumentPath ? { name: selected.DocumentPath.split('/').pop(), path: `${API_BASE}/${selected.DocumentPath}` } : null);
      setPhotoFile(null);
      setDocFile(null);
    } else {
      setForm(INITIAL_FORM);
      setPhotoPreview(null);
      setDocPreview(null);
      setPhotoFile(null);
      setDocFile(null);
    }
  }, [selected]);

  useEffect(() => {
    if (!photoFile) return;
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target.result);
    reader.readAsDataURL(photoFile);
  }, [photoFile]);

  useEffect(() => {
    if (!docFile) return;
    setDocPreview({ name: docFile.name, path: null });
  }, [docFile]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== undefined && v !== null) fd.append(k, v);
      });
      if (photoFile) fd.append('photo', photoFile);
      if (docFile) fd.append('document', docFile);

      let res;
      if (selected && selected.StudentId) {
        res = await updateStudent(selected.StudentId, fd);
      } else {
        res = await createStudent(fd);
      }

      onSaved && onSaved(res);
      setForm(INITIAL_FORM);
      setPhotoFile(null);
      setDocFile(null);
      setPhotoPreview(null);
      setDocPreview(null);
    } catch (err) {
      console.error(err);
      alert('Save failed: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 px-8 py-6">
      {/* Name */}
      <div className="form-group">
        <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <User size={16} className="text-blue-500" />
          Full Name <span className="text-red-400 text-xs">*</span>
        </label>
        <input
          name="StudentName"
          placeholder="Enter full name"
          value={form.StudentName}
          onChange={onChange}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-sm transition-all outline-none font-medium"
          required
        />
      </div>

      {/* Mobile & Roll Number */}
      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Phone size={14} className="text-blue-500" />
            Mobile
          </label>
          <input
            name="MobileNumber"
            placeholder="9876543210"
            value={form.MobileNumber}
            onChange={onChange}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg text-sm transition-all outline-none"
          />
        </div>

        <div className="form-group">
          <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <BookOpen size={14} className="text-blue-500" />
            Roll
          </label>
          <input
            name="RollNumber"
            placeholder="A001"
            value={form.RollNumber}
            onChange={onChange}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg text-sm transition-all outline-none"
          />
        </div>
      </div>

      {/* Department & Year */}
      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <GraduationCap size={14} className="text-blue-500" />
            Dept
          </label>
          <input
            name="Department"
            placeholder="CSE"
            value={form.Department}
            onChange={onChange}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg text-sm transition-all outline-none"
          />
        </div>

        <div className="form-group">
          <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Calendar size={14} className="text-blue-500" />
            Year
          </label>
          <input
            name="YearOfStudy"
            placeholder="1st"
            value={form.YearOfStudy}
            onChange={onChange}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg text-sm transition-all outline-none"
          />
        </div>
      </div>

      {/* Date of Birth & Gender */}
      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Calendar size={14} className="text-blue-500" />
            DOB
          </label>
          <input
            name="DateOfBirth"
            type="date"
            value={form.DateOfBirth}
            onChange={onChange}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg text-sm transition-all outline-none"
          />
        </div>

        <div className="form-group">
          <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Users size={14} className="text-blue-500" />
            Gender
          </label>
          <select
            name="Gender"
            value={form.Gender}
            onChange={onChange}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg text-sm transition-all outline-none"
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Photo Upload */}
      <div className="form-group pt-2">
        <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Image size={14} className="text-blue-500" />
          Photo
        </label>
        <div className="relative border-2 border-dashed border-blue-200 rounded-xl p-6 hover:border-blue-400 hover:bg-blue-50/50 transition-all flex flex-col items-center justify-center bg-blue-50/30 cursor-pointer group">
          <div className="text-center">
            <Upload size={28} className="text-blue-400 mb-2 mx-auto group-hover:text-blue-500 transition-colors" />
            <p className="text-sm font-semibold text-gray-600">Click to upload</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoFile(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        {photoPreview && (
          <div className="mt-4 flex justify-center">
            <img
              src={photoPreview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-xl border border-blue-200 shadow-md"
            />
          </div>
        )}
      </div>

      {/* Document Upload */}
      <div className="form-group pt-2">
        <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <FileText size={14} className="text-emerald-500" />
          Document
        </label>
        <div className="relative border-2 border-dashed border-emerald-200 rounded-xl p-6 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all flex flex-col items-center justify-center bg-emerald-50/30 cursor-pointer group">
          <div className="text-center">
            <FileText size={28} className="text-emerald-400 mb-2 mx-auto group-hover:text-emerald-500 transition-colors" />
            <p className="text-sm font-semibold text-gray-600">Click to upload</p>
            <p className="text-xs text-gray-500 mt-1">PDF, Images up to 10MB</p>
          </div>
          <input
            type="file"
            accept="application/pdf,image/*"
            onChange={(e) => setDocFile(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        {docPreview && (
          <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <p className="text-sm font-semibold text-gray-700 truncate">{docPreview.name}</p>
          </div>
        )}
      </div>

      {/* Submit & Cancel Buttons */}
      <div className="flex gap-3 pt-6 border-t border-gray-100 mt-6">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-3 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Save size={18} />
          {loading ? 'Saving...' : (selected ? 'Update' : 'Create')}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <X size={18} />
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
