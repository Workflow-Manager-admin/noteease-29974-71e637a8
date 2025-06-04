// Import note store for managing notes
import noteStore from './noteStore.js';

// DOM Elements
let elements;

// Current state
let currentFilter = 'All';
let searchQuery = '';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize elements object with all DOM references
  elements = {
    // Note list elements
    noteList: document.getElementById('note-list'),
    emptyState: document.getElementById('empty-state'),
    
    // Search elements
    searchInput: document.getElementById('search-input'),
    clearSearch: document.getElementById('clear-search'),
    
    // Category filter elements
    categoryFilter: document.getElementById('category-filter'),
    addCategoryBtn: document.getElementById('add-category-btn'),
    
    // Form elements
    noteForm: document.getElementById('note-form'),
    noteFormOverlay: document.getElementById('note-form-overlay'),
    formTitle: document.getElementById('form-title'),
    closeFormBtn: document.getElementById('close-form-btn'),
    cancelNoteBtn: document.getElementById('cancel-note'),
    
    // Form fields
    noteIdInput: document.getElementById('note-id'),
    noteTitleInput: document.getElementById('note-title'),
    noteContentInput: document.getElementById('note-content'),
    noteCategorySelect: document.getElementById('note-category'),
    
    // Category management in form
    newCategoryInFormBtn: document.getElementById('new-category-in-form'),
    newCategoryForm: document.getElementById('new-category-form'),
    newCategoryNameInput: document.getElementById('new-category-name'),
    saveNewCategoryBtn: document.getElementById('save-new-category'),
    cancelNewCategoryBtn: document.getElementById('cancel-new-category'),
    
    // New note button
    newNoteBtn: document.getElementById('new-note-btn'),
    
    // Theme toggle
    themeToggleBtn: document.getElementById('theme-toggle-btn')
  };
  
  // Initialize the app
  init();
});

/**
 * Initialize the app
 */
function init() {
  // Render initial notes
  renderNotes();
  
  // Render categories
  renderCategories();
  
  // Set up event listeners
  setupEventListeners();
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
  // Search functionality
  elements.searchInput.addEventListener('input', handleSearch);
  elements.clearSearch.addEventListener('click', clearSearch);
  
  // New note button
  elements.newNoteBtn.addEventListener('click', openCreateNoteForm);
  
  // Form close button
  elements.closeFormBtn.addEventListener('click', closeNoteForm);
  elements.cancelNoteBtn.addEventListener('click', closeNoteForm);
  
  // Form submission
  elements.noteForm.addEventListener('submit', handleNoteFormSubmit);
  
  // Note actions (using event delegation)
  elements.noteList.addEventListener('click', handleNoteActions);
  
  // Category filter
  elements.categoryFilter.addEventListener('click', handleCategoryFilter);
  
  // Add category button
  elements.addCategoryBtn.addEventListener('click', handleAddCategory);
  
  // New category in form
  elements.newCategoryInFormBtn.addEventListener('click', showNewCategoryForm);
  elements.saveNewCategoryBtn.addEventListener('click', saveNewCategory);
  elements.cancelNewCategoryBtn.addEventListener('click', hideNewCategoryForm);
  
  // Theme toggle
  elements.themeToggleBtn.addEventListener('click', toggleTheme);
}

/**
 * Render all notes based on current filter and search
 */
function renderNotes() {
  // Get filtered notes
  let filteredNotes = noteStore.getAllNotes();
  
  // Apply category filter if not "All"
  if (currentFilter !== 'All') {
    filteredNotes = filteredNotes.filter(note => note.category === currentFilter);
  }
  
  // Apply search filter if there's a search query
  if (searchQuery) {
    filteredNotes = filteredNotes.filter(note => 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Clear current note list (except empty state)
  const notesToRemove = elements.noteList.querySelectorAll('.note-card');
  notesToRemove.forEach(note => note.remove());
  
  // Show empty state if no notes
  if (filteredNotes.length === 0) {
    elements.emptyState.style.display = 'block';
  } else {
    elements.emptyState.style.display = 'none';
    
    // Create and append note elements
    filteredNotes.forEach((note, index) => {
      const noteElement = createNoteElement(note, index);
      elements.noteList.appendChild(noteElement);
    });
  }
}

/**
 * Create HTML element for a note
 */
function createNoteElement(note, index) {
  // Create note card element
  const noteCard = document.createElement('div');
  noteCard.className = 'note-card';
  noteCard.dataset.noteId = note.id;
  noteCard.dataset.index = index;
  
  // Format date for display
  const date = new Date(note.updatedAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  // Truncate content for preview
  const previewContent = note.content.length > 100
    ? note.content.substring(0, 100) + '...'
    : note.content;
  
  // Construct inner HTML
  noteCard.innerHTML = `
    <div class="note-card-header">
      <h3 class="note-title">${escapeHTML(note.title)}</h3>
      <div class="note-actions">
        <button class="note-action edit-note" aria-label="Edit note" data-action="edit">
          <i class="fas fa-edit"></i>
        </button>
        <button class="note-action delete-note" aria-label="Delete note" data-action="delete">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    </div>
    
    <div class="note-content-preview">${escapeHTML(previewContent)}</div>
    
    <div class="note-footer">
      ${note.category ? `<span class="note-category">${escapeHTML(note.category)}</span>` : ''}
      <span class="note-date">${formattedDate}</span>
    </div>
  `;
  
  return noteCard;
}

/**
 * Render categories in the filter and form select
 */
function renderCategories() {
  const categories = ['All', ...noteStore.getAllCategories()];
  
  // Render in category filter
  elements.categoryFilter.innerHTML = categories.map(category =>
    `<button class="category-chip ${category === currentFilter ? 'active' : ''}" 
     data-category="${escapeHTML(category)}">${escapeHTML(category)}</button>`
  ).join('');
  
  // Render in form select
  elements.noteCategorySelect.innerHTML = `
    <option value="">Select a category (optional)</option>
    ${noteStore.getAllCategories().map(category =>
      `<option value="${escapeHTML(category)}">${escapeHTML(category)}</option>`
    ).join('')}
  `;
}

/**
 * Handle note actions (edit, delete) using event delegation
 */
function handleNoteActions(e) {
  const actionBtn = e.target.closest('[data-action]');
  
  if (!actionBtn) return;
  
  const noteCard = actionBtn.closest('.note-card');
  const noteId = noteCard.dataset.noteId;
  const action = actionBtn.dataset.action;
  
  if (action === 'edit') {
    openEditNoteForm(noteId);
  } else if (action === 'delete') {
    confirmDeleteNote(noteId);
  }
}

/**
 * Open form to create a new note
 */
function openCreateNoteForm() {
  // Reset form
  elements.noteForm.reset();
  elements.noteIdInput.value = '';
  
  // Set form title
  elements.formTitle.textContent = 'Create New Note';
  
  // Show form
  elements.noteFormOverlay.classList.remove('hidden');
}

/**
 * Open form to edit an existing note
 */
function openEditNoteForm(noteId) {
  const note = noteStore.getNoteById(noteId);
  
  if (!note) return;
  
  // Fill form with note data
  elements.noteIdInput.value = note.id;
  elements.noteTitleInput.value = note.title;
  elements.noteContentInput.value = note.content;
  elements.noteCategorySelect.value = note.category;
  
  // Set form title
  elements.formTitle.textContent = 'Edit Note';
  
  // Show form
  elements.noteFormOverlay.classList.remove('hidden');
}

/**
 * Close the note form
 */
function closeNoteForm() {
  elements.noteFormOverlay.classList.add('hidden');
  elements.newCategoryForm.classList.add('hidden');
}

/**
 * Handle note form submission (create or edit)
 */
function handleNoteFormSubmit(e) {
  e.preventDefault();
  
  const noteId = elements.noteIdInput.value;
  const noteData = {
    title: elements.noteTitleInput.value.trim(),
    content: elements.noteContentInput.value.trim(),
    category: elements.noteCategorySelect.value
  };
  
  if (!noteData.title || !noteData.content) {
    alert('Title and content are required');
    return;
  }
  
  if (noteId) {
    // Update existing note
    noteStore.updateNote(noteId, noteData);
  } else {
    // Create new note
    noteStore.createNote(noteData);
  }
  
  // Close form and refresh notes
  closeNoteForm();
  renderNotes();
  renderCategories();
}

/**
 * Show confirmation dialog for deleting a note
 */
function confirmDeleteNote(noteId) {
  const note = noteStore.getNoteById(noteId);
  
  if (!note) return;
  
  if (confirm(`Are you sure you want to delete "${note.title}"?`)) {
    noteStore.deleteNote(noteId);
    renderNotes();
  }
}

/**
 * Handle search input
 */
function handleSearch() {
  searchQuery = elements.searchInput.value.trim();
  
  // Toggle clear button visibility
  if (searchQuery) {
    elements.clearSearch.classList.add('visible');
  } else {
    elements.clearSearch.classList.remove('visible');
  }
  
  renderNotes();
}

/**
 * Clear search input
 */
function clearSearch() {
  elements.searchInput.value = '';
  searchQuery = '';
  elements.clearSearch.classList.remove('visible');
  renderNotes();
}

/**
 * Handle category filter clicks
 */
function handleCategoryFilter(e) {
  const categoryBtn = e.target.closest('[data-category]');
  
  if (!categoryBtn) return;
  
  const category = categoryBtn.dataset.category;
  
  // Update current filter
  currentFilter = category;
  
  // Update active class
  const categoryBtns = elements.categoryFilter.querySelectorAll('.category-chip');
  categoryBtns.forEach(btn => btn.classList.remove('active'));
  categoryBtn.classList.add('active');
  
  renderNotes();
}

/**
 * Show dialog to add a new category
 */
function handleAddCategory() {
  const categoryName = prompt('Enter new category name:');
  
  if (categoryName && categoryName.trim()) {
    const trimmedName = categoryName.trim();
    const added = noteStore.addCategory(trimmedName);
    
    if (added) {
      renderCategories();
    } else {
      alert('Category already exists');
    }
  }
}

/**
 * Show the new category form in note form
 */
function showNewCategoryForm() {
  elements.newCategoryForm.classList.remove('hidden');
  elements.newCategoryNameInput.focus();
}

/**
 * Hide the new category form in note form
 */
function hideNewCategoryForm() {
  elements.newCategoryForm.classList.add('hidden');
  elements.newCategoryNameInput.value = '';
}

/**
 * Save new category from the form
 */
function saveNewCategory() {
  const categoryName = elements.newCategoryNameInput.value.trim();
  
  if (!categoryName) {
    alert('Please enter a category name');
    return;
  }
  
  const added = noteStore.addCategory(categoryName);
  
  if (added) {
    // Update categories and select the new one
    renderCategories();
    elements.noteCategorySelect.value = categoryName;
    hideNewCategoryForm();
  } else {
    alert('Category already exists');
  }
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  
  // Update icon
  const icon = elements.themeToggleBtn.querySelector('i');
  if (document.body.classList.contains('dark-theme')) {
    icon.className = 'fas fa-moon';
  } else {
    icon.className = 'fas fa-sun';
  }
}

/**
 * Helper function to escape HTML to prevent XSS
 */
function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
