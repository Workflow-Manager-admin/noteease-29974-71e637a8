/**
 * NoteStore - Handles the storage and management of notes
 * Uses localStorage for client-side persistence
 */
class NoteStore {
  constructor() {
    this.storageKey = 'noteease-notes';
    this.categoryStorageKey = 'noteease-categories';
    this.notes = this.loadNotes();
    this.categories = this.loadCategories();
  }

  /**
   * Generate a unique ID for notes
   * @returns {string} - A unique identifier
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  /**
   * Load notes from localStorage
   * @returns {Array} - Array of note objects
   */
  loadNotes() {
    const storedNotes = localStorage.getItem(this.storageKey);
    return storedNotes ? JSON.parse(storedNotes) : [];
  }

  /**
   * Load categories from localStorage
   * @returns {Array} - Array of category strings
   */
  loadCategories() {
    const storedCategories = localStorage.getItem(this.categoryStorageKey);
    return storedCategories ? JSON.parse(storedCategories) : ['Personal', 'Work', 'Ideas', 'Tasks'];
  }

  /**
   * Save notes to localStorage
   */
  saveNotes() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.notes));
  }

  /**
   * Save categories to localStorage
   */
  saveCategories() {
    localStorage.setItem(this.categoryStorageKey, JSON.stringify(this.categories));
  }

  /**
   * Get all notes
   * @returns {Array} - Array of all note objects
   */
  getAllNotes() {
    return this.notes;
  }

  /**
   * Get all categories
   * @returns {Array} - Array of all categories
   */
  getAllCategories() {
    return this.categories;
  }

  /**
   * Get a note by ID
   * @param {string} id - The note ID
   * @returns {Object|null} - The note object or null if not found
   */
  getNoteById(id) {
    return this.notes.find(note => note.id === id) || null;
  }

  /**
   * Create a new note
   * @param {Object} noteData - The note data (title, content, category)
   * @returns {Object} - The new note object
   */
  createNote(noteData) {
    const timestamp = new Date().toISOString();
    
    const newNote = {
      id: this.generateId(),
      title: noteData.title || 'Untitled Note',
      content: noteData.content || '',
      category: noteData.category || '',
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    this.notes.unshift(newNote); // Add to the beginning
    this.saveNotes();
    
    // Add category if it's new
    if (noteData.category && !this.categories.includes(noteData.category)) {
      this.categories.push(noteData.category);
      this.saveCategories();
    }
    
    return newNote;
  }

  /**
   * Update an existing note
   * @param {string} id - The ID of the note to update
   * @param {Object} noteData - The updated note data
   * @returns {Object|null} - The updated note or null if not found
   */
  updateNote(id, noteData) {
    const noteIndex = this.notes.findIndex(note => note.id === id);
    
    if (noteIndex === -1) {
      return null;
    }
    
    // Update the note
    const updatedNote = {
      ...this.notes[noteIndex],
      ...noteData,
      updatedAt: new Date().toISOString()
    };
    
    this.notes[noteIndex] = updatedNote;
    this.saveNotes();
    
    // Add category if it's new
    if (noteData.category && !this.categories.includes(noteData.category)) {
      this.categories.push(noteData.category);
      this.saveCategories();
    }
    
    return updatedNote;
  }

  /**
   * Delete a note by ID
   * @param {string} id - The ID of the note to delete
   * @returns {boolean} - True if deleted, false if not found
   */
  deleteNote(id) {
    const initialLength = this.notes.length;
    this.notes = this.notes.filter(note => note.id !== id);
    
    if (this.notes.length !== initialLength) {
      this.saveNotes();
      return true;
    }
    
    return false;
  }

  /**
   * Search notes by query string in title or content
   * @param {string} query - The search query
   * @returns {Array} - Array of matching note objects
   */
  searchNotes(query) {
    if (!query || query.trim() === '') {
      return this.notes;
    }
    
    const searchTerm = query.toLowerCase().trim();
    
    return this.notes.filter(note => {
      return (
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm)
      );
    });
  }

  /**
   * Filter notes by category
   * @param {string} category - The category to filter by
   * @returns {Array} - Array of matching note objects
   */
  getNotesByCategory(category) {
    if (!category || category === 'All') {
      return this.notes;
    }
    
    return this.notes.filter(note => note.category === category);
  }

  /**
   * Add a new category
   * @param {string} category - The category name to add
   * @returns {boolean} - True if added, false if already exists
   */
  addCategory(category) {
    if (!category || this.categories.includes(category)) {
      return false;
    }
    
    this.categories.push(category);
    this.saveCategories();
    return true;
  }

  /**
   * Delete a category
   * @param {string} category - The category to delete
   * @returns {boolean} - True if deleted, false if not found
   */
  deleteCategory(category) {
    const initialLength = this.categories.length;
    this.categories = this.categories.filter(cat => cat !== category);
    
    if (this.categories.length !== initialLength) {
      // Update notes that had this category
      this.notes = this.notes.map(note => {
        if (note.category === category) {
          return {...note, category: ''};
        }
        return note;
      });
      
      this.saveCategories();
      this.saveNotes();
      return true;
    }
    
    return false;
  }
}

// Create and export a singleton instance
const noteStore = new NoteStore();
export default noteStore;
