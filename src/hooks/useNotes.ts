import { useState, useEffect } from 'react';
import { Note } from '../types';
import { supabase } from '../lib/supabase';

export function useNotes(userId?: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchNotes();
    }
  }, [userId]);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (title: string, content: string) => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([
          {
            title,
            content,
            user_id: userId,
            is_public: false,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      setNotes([data, ...notes]);
      return data;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  };

  const updateNote = async (id: string, title: string, content: string) => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .update({
          title,
          content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setNotes(notes.map((note) => (note.id === id ? data : note)));
      return data;
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const { error } = await supabase.from('notes').delete().eq('id', id);

      if (error) throw error;
      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  };

  const shareNote = async (id: string) => {
    try {
      const shareToken = Math.random().toString(36).substring(2, 15);
      const { data, error } = await supabase
        .from('notes')
        .update({
          is_public: true,
          share_token: shareToken,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setNotes(notes.map((note) => (note.id === id ? data : note)));
      return `${window.location.origin}/shared/${shareToken}`;
    } catch (error) {
      console.error('Error sharing note:', error);
      throw error;
    }
  };

  const getSharedNote = async (shareToken: string) => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('share_token', shareToken)
        .eq('is_public', true)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching shared note:', error);
      throw error;
    }
  };

  return {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
    shareNote,
    getSharedNote,
    refetch: fetchNotes,
  };
}