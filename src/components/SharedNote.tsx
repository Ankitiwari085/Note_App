import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Note } from '../types';
import { useNotes } from '../hooks/useNotes';
import { Calendar, Share2, ArrowLeft } from 'lucide-react';

export function SharedNote() {
  const { shareToken } = useParams<{ shareToken: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { getSharedNote } = useNotes();

  useEffect(() => {
    if (shareToken) {
      fetchSharedNote();
    }
  }, [shareToken]);

  const fetchSharedNote = async () => {
    try {
      setLoading(true);
      const sharedNote = await getSharedNote(shareToken!);
      setNote(sharedNote);
    } catch (error) {
      setError('Note not found or not publicly shared');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shared note...</p>
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Share2 className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Note Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error || 'This note may have been deleted or is not publicly shared.'}
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go to NotesApp
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Share2 className="w-6 h-6 mr-3" />
                <span className="font-medium">Shared Note</span>
              </div>
              <button
                onClick={() => window.location.href = '/'}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
            <h1 className="text-3xl font-bold">{note.title}</h1>
            <div className="flex items-center mt-2 text-indigo-100">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm">
                Last updated: {formatDate(note.updated_at)}
              </span>
            </div>
          </div>

          <div className="p-8">
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {note.content}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Want to create and share your own notes?
              </p>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Try NotesApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}