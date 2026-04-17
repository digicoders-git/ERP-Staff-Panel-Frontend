import React, { useState, useEffect } from 'react';
import { MdSearch, MdBook, MdCheckCircle, MdWarning, MdAdd, MdEdit, MdDelete, MdChevronLeft, MdChevronRight, MdFilterList, MdClose } from 'react-icons/md';
import { libraryAPI } from '../utils/apiService';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';

const LibraryBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const userRole = localStorage.getItem('userRole');
  const isAdmin = ['branchAdmin', 'superAdmin', 'clientAdmin'].includes(userRole);
  const isLibrarian = userRole === 'libraryAdmin' || isAdmin;
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    ISBN: '',
    category: '',
    publisher: '',
    publicationYear: new Date().getFullYear(),
    pages: '',
    language: 'English',
    location: '',
    totalCopies: 1,
    price: '',
    barcode: '',
    rfidTag: '',
    condition: 'New'
  });

  const categories = ['All', 'Fiction', 'Non-Fiction', 'Science', 'History', 'Technology', 'Biography', 'Mystery', 'Romance', 'Dystopian', 'Classic', 'Reference'];

  useEffect(() => {
    fetchBooks();
  }, [page, filterCategory]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        search: searchTerm,
        category: filterCategory === 'All' ? undefined : filterCategory
      };
      const res = await libraryAPI.getBooks(params);
      if (res.data && res.data.success) {
        setBooks(res.data.data?.books || []);
        setPagination({
          total: res.data.data?.totalBooks || 0,
          pages: res.data.data?.totalPages || 1
        });
      }
    } catch (err) {
      console.error('Books fetch error:', err);
      toast.error('Failed to sync with scholastic repository');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setPage(1);
      fetchBooks();
    }
  };

  const handleOpenModal = (book = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title || '',
        author: book.author || '',
        ISBN: book.ISBN || '',
        category: book.category || '',
        publisher: book.publisher || '',
        publicationYear: book.publicationYear || new Date().getFullYear(),
        pages: book.pages || '',
        language: book.language || 'English',
        location: book.location || '',
        totalCopies: book.totalCopies || 1,
        price: book.price || '',
        barcode: book.barcode || '',
        rfidTag: book.rfidTag || '',
        condition: book.condition || 'New'
      });
    } else {
      setEditingBook(null);
      setFormData({
        title: '', author: '', ISBN: '', category: '', publisher: '',
        publicationYear: new Date().getFullYear(), pages: '', language: 'English',
        location: '', totalCopies: 1, price: '', barcode: '', rfidTag: '', condition: 'New'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingBook) {
        await libraryAPI.updateBook(editingBook._id, formData);
        toast.success('Book details updated successfully');
      } else {
        await libraryAPI.addBook(formData);
        toast.success('New book added to library');
      }
      setIsModalOpen(false);
      fetchBooks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this book from the library? This action cannot be undone.')) {
      try {
        setLoading(true);
        await libraryAPI.deleteBook(id);
        toast.success('Book removed from library');
        fetchBooks();
      } catch (err) {
        toast.error('Failed to remove book');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-10 bg-slate-50/20 p-2 min-h-screen animate-fadeIn">
      {loading && (
        <div className="fixed inset-0 bg-white/60 flex items-center justify-center z-[75] backdrop-blur-[2px]">
           <FaSpinner className="animate-spin text-indigo-600 text-5xl" />
        </div>
      )}

      {/* Luxury Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 gap-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
        <div className="relative">
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic underline decoration-indigo-600 underline-offset-8 decoration-4">Library Book List</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3">Keep track of school books and inventory</p>
        </div>
        {isLibrarian && (
          <div className="flex gap-4 relative">
              <button 
                  onClick={() => handleOpenModal()}
                  className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:shadow-xl hover:shadow-indigo-100 transition-all active:scale-95"
              >
                  <MdAdd size={20} /> Add New Book
              </button>
          </div>
        )}
      </div>

      {/* Advanced Filter Control */}
      <div className="flex flex-col lg:flex-row gap-6 bg-white/50 p-6 rounded-[2.5rem] border border-slate-100 backdrop-blur-md">
        <div className="relative flex-1">
          <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
          <input
            type="text"
            placeholder="SEARCH BOOKS (PRESS ENTER)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full bg-white border-2 border-transparent focus:border-indigo-600 rounded-[1.5rem] pl-16 pr-8 py-5 outline-none font-black text-[10px] tracking-widest uppercase transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-4">
            <div className="relative min-w-[200px]">
                <MdFilterList className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full bg-white border-2 border-transparent focus:border-indigo-600 rounded-[1.5rem] pl-16 pr-8 py-5 outline-none font-black text-[10px] tracking-widest uppercase transition-all shadow-sm appearance-none cursor-pointer"
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat} COLLECTION</option>
                    ))}
                </select>
            </div>
        </div>
      </div>

      {/* Scholastic Matrix Table */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                <th className="px-10 py-8 text-left">Book Details</th>
                <th className="px-10 py-8 text-center">ISBN / Barcode</th>
                <th className="px-10 py-8 text-center">Stock Details</th>
                <th className="px-10 py-8 text-center">Status</th>
                <th className="px-10 py-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {books.length > 0 ? books.map(book => (
                <tr key={book._id} className="hover:bg-slate-50/30 transition-all group italic">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-20 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:scale-105 shadow-sm">
                        <MdBook size={32} />
                      </div>
                      <div>
                        <div className="text-base font-black text-slate-800 tracking-tighter group-hover:text-indigo-600 transition-colors uppercase italic">{book.title}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 opacity-60">Author: {book.author}</div>
                        <div className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mt-1">{book.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <div className="space-y-2">
                        <div className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">ISBN: {book.ISBN}</div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase italic opacity-50">Code: {book.barcode || 'N/A'}</div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <div className="inline-block bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <div className="text-[11px] font-black text-slate-800 italic">{book.availableCopies} / {book.totalCopies}</div>
                        <div className="w-20 bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div 
                                className="bg-indigo-600 h-full transition-all duration-1000" 
                                style={{ width: `${(book.availableCopies / book.totalCopies) * 100}%` }}
                            />
                        </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <span className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                      book.availableCopies > 0 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {book.availableCopies > 0 ? 'Available' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    {isLibrarian ? (
                      <div className="flex items-center justify-end gap-3">
                          <button 
                              onClick={() => handleOpenModal(book)}
                              className="p-3 bg-white text-slate-400 hover:text-indigo-600 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all shadow-sm"
                          >
                              <MdEdit size={20} />
                          </button>
                          <button 
                              onClick={() => handleDelete(book._id)}
                              className="p-3 bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-100 rounded-xl transition-all shadow-sm"
                          >
                              <MdDelete size={20} />
                          </button>
                      </div>
                    ) : (
                      <span className="text-[9px] font-black text-slate-400 uppercase italic">Read Only</span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan="5" className="py-40 text-center opacity-10">
                        <MdBook size={80} className="mx-auto mb-6" />
                        <p className="text-[10px] font-black uppercase tracking-[0.5em]">No Books Found</p>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination */}
        <div className="px-10 py-8 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                Showing entries {(page - 1) * 10 + 1} to {Math.min(page * 10, pagination.total)} of {pagination.total} total
            </p>
            <div className="flex gap-4">
                <button 
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-black hover:text-white transition-all disabled:opacity-20 shadow-sm"
                >
                    <MdChevronLeft size={24} />
                </button>
                <div className="px-6 flex items-center bg-white border border-slate-200 rounded-xl font-black text-[11px] shadow-sm italic">
                    {page} / {pagination.pages}
                </div>
                <button 
                    disabled={page === pagination.pages}
                    onClick={() => setPage(page + 1)}
                    className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-black hover:text-white transition-all disabled:opacity-20 shadow-sm"
                >
                    <MdChevronRight size={24} />
                </button>
            </div>
        </div>
      </div>

      {/* Scholastic Asset Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-slate-900/40 animate-fadeIn">
            <div className="bg-white rounded-[3.5rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-[0_20px_70px_rgba(0,0,0,0.3)] border border-white/20 relative animate-slideUp">
                <div className="p-12">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Update book information in the library database</p>
                        </div>
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-black hover:text-white transition-all"
                        >
                            <MdClose size={28} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { label: 'Book Title', field: 'title', type: 'text', placeholder: 'Enter book title...' },
                                { label: 'Author Name', field: 'author', type: 'text', placeholder: 'Full author name...' },
                                { label: 'ISBN Number', field: 'ISBN', type: 'text', placeholder: '978-X-XXXX-XXXX-X' },
                                { label: 'Publisher', field: 'publisher', type: 'text', placeholder: 'Publishing company...' }
                            ].map(input => (
                                <div key={input.field} className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-4">{input.label}</label>
                                    <input
                                        required
                                        type={input.type}
                                        value={formData[input.field]}
                                        onChange={(e) => setFormData({...formData, [input.field]: e.target.value})}
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl px-6 py-4 outline-none font-bold text-sm transition-all"
                                        placeholder={input.placeholder}
                                    />
                                </div>
                            ))}

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-4">Book Category</label>
                                <select
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl px-6 py-4 outline-none font-bold text-sm transition-all appearance-none italic"
                                >
                                    <option value="">SELECT CATEGORY</option>
                                    {categories.slice(1).map(cat => (
                                        <option key={cat} value={cat}>{cat} COLLECTION</option>
                                    ))}
                                </select>
                            </div>

                            {[
                                { label: 'Total Copies', field: 'totalCopies', type: 'number', min: 1 },
                                { label: 'Publication Year', field: 'publicationYear', type: 'number' },
                                { label: 'Book Price (₹)', field: 'price', type: 'number' },
                                { label: 'Shelf Location', field: 'location', type: 'text', placeholder: 'Shelf ID/Room...' },
                                { label: 'Barcode ID', field: 'barcode', type: 'text' },
                                { label: 'RFID Tag', field: 'rfidTag', type: 'text' }
                            ].map(input => (
                                <div key={input.field} className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-4">{input.label}</label>
                                    <input
                                        {...(input.required !== false && { required: true })}
                                        type={input.type}
                                        min={input.min}
                                        value={formData[input.field]}
                                        onChange={(e) => setFormData({...formData, [input.field]: e.target.value})}
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl px-6 py-4 outline-none font-bold text-sm transition-all shadow-inner"
                                        placeholder={input.placeholder}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-6 mt-12 pb-12">
                            <button 
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-5 rounded-2xl border-2 border-slate-100 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                            >
                                Discard Changes
                            </button>
                            <button 
                                type="submit"
                                className="flex-[2] py-5 rounded-2xl bg-slate-800 text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-black shadow-xl transition-all shadow-slate-200 active:scale-[0.98]"
                            >
                                {editingBook ? 'Update Book Details' : 'Add Book to Library'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default LibraryBooks;
