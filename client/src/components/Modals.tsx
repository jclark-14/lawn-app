import { useEffect, useRef, ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        event.target instanceof Node
      ) {
        onClose();
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 py-6 sm:p-0">
      <div
        ref={modalRef}
        className="bg-teal-900 p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-md mx-auto">
        {children}
      </div>
    </div>
  );
}

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType: string;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType,
}: ConfirmDeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg sm:text-xl font-bold text-gray-50 mb-3 sm:mb-4">
        Confirm Deletion
      </h2>
      <p className="text-gray-50 mb-4 text-sm sm:text-base">
        Are you sure you want to delete the {itemType}: "{itemName}"?
      </p>
      <div className="flex justify-end space-x-2">
        <button
          onClick={onConfirm}
          className="bg-red-700 text-gray-50 px-3 sm:px-4 py-2 rounded-full text-sm font-semibold transition duration-300 hover:bg-red-500">
          Delete
        </button>
        <button
          onClick={onClose}
          className="bg-gray-100 text-teal-800 px-3 sm:px-4 py-2 rounded-full text-sm font-semibold transition duration-300 hover:bg-gradient-to-r from-slate-600 to-teal-600 hover:text-gray-50">
          Cancel
        </button>
      </div>
    </Modal>
  );
}

interface SavedToProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SavedToProfileModal({
  isOpen,
  onClose,
}: SavedToProfileModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg sm:text-xl font-bold text-gray-50 mb-3 sm:mb-4">
        Plan Saved
      </h2>
      <p className="text-gray-50 mb-4 text-sm sm:text-base">
        Your plan has been successfully saved to your profile.
      </p>
      <button
        onClick={onClose}
        className="mt-2 sm:mt-4 bg-gray-100 text-teal-800 px-3 sm:px-4 py-2 rounded-full text-sm font-semibold transition duration-300 hover:bg-gradient-to-r from-slate-600 to-teal-600 hover:text-gray-50 w-full sm:w-auto">
        Close
      </button>
    </Modal>
  );
}
