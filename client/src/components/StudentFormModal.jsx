import { X } from 'lucide-react';
import StudentForm from './StudentForm';

export default function StudentFormModal({ isOpen, onClose, selected, onSaved }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-0 bg-black/30">
      <div className="relative bg-white h-full w-full max-w-md shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 bg-linear-to-r from-blue-600 to-blue-700 border-b-4 border-blue-800 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {selected ? 'Edit Student' : 'New Student'}
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              {selected ? 'Update student information' : 'Add a new student'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-500 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto">
          <StudentForm
            selected={selected}
            onSaved={(res) => {
              onSaved && onSaved(res);
              onClose();
            }}
            onCancel={onClose}
            isModal={true}
          />
        </div>
      </div>
    </div>
  );
}
