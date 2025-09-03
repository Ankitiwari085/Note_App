import React, { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotes } from '../hooks/useNotes';
import { Header } from './Header';
import { NoteCard } from './NoteCard';
import { NoteEditor } from './NoteEditor';
import { ShareModal } from './ShareModal';
import { FileText, Search } from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();
  const { notes, loading, createNote, updateNote, deleteNote, shareNote } = useNotes(user?.id);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotes = useMemo(() => {
    if (!searchTerm) return notes;
    return notes.filter(note =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [notes, searchTerm]);

  const handleCreateNote = () => {
    setSelectedNote(null);
    setIsEditorOpen(true);
  };

  const handleEditNote = (note) => {
    setSelectedNote(note);
    setIsEditorOpen(true);
  };

  const handleSaveNote = async (title, content) => {
    if (selectedNote) {
      await updateNote(selectedNote.id, title, content);
    } else {
      await createNote(title, content);
    }
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(id);
    }
  };

  const handleShareNote = async (id) => {
    try {
      const url = await shareNote(id);
      setShareUrl(url);
      setShareModalOpen(true);
    } catch (error) {
      console.error('Error sharing note:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <Header
        onCreateNote={handleCreateNote}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              {searchTerm ? (
                <Search className="w-10 h-10 text-gray-400" />
              ) : (
                <FileText className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {searchTerm ? 'No notes found' : 'No notes yet'}
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm 
                ? `No notes match "${searchTerm}". Try a different search term.`
                : 'Get started by creating your first note. Capture your thoughts, ideas, and important information.'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={handleCreateNote}
                className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-cyan-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Create Your First Note
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {searchTerm ? `Search Results (${filteredNotes.length})` : 'Your Notes'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {searchTerm 
                    ? `Showing notes matching "${searchTerm}"`
                    : `${notes.length} ${notes.length === 1 ? 'note' : 'notes'} total`
                  }
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                  onShare={handleShareNote}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <NoteEditor
        note={selectedNote}
        onSave={handleSaveNote}
        onCancel={() => setIsEditorOpen(false)}
        isOpen={isEditorOpen}
      />

      <ShareModal
        isOpen={shareModalOpen}
        shareUrl={shareUrl}
        onClose={() => setShareModalOpen(false)}
      />
    </div>
  );
}