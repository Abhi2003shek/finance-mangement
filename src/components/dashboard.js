import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';
import { Navbar, Typography } from "@material-tailwind/react";
import { collection, orderBy, query, onSnapshot, deleteDoc, doc, updateDoc, serverTimestamp} from 'firebase/firestore';
import CreateExpense from './createExpense';
import EditExpense from './editExpense';

const Dashboard = () => {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateExpensePopup, setShowCreateExpensePopup] = useState(false);
  const [editExpenseId, setEditExpenseId] = useState(null);
  const [filterText, setFilterText] = useState(''); 

  const [loading, setLoading] = useState(true);

  const itemsPerPage = 5;

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, 'expenses'), orderBy('createdAt', 'desc')), async (snapshot) => {
      const data = snapshot.docs.map(async (doc) => {
        const expenseData = doc.data();
        return { id: doc.id, ...expenseData};
      });
      const expensesData = await Promise.all(data);
      setExpenses(expensesData);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [editExpenseId]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this expense?');
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'expenses', id));
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const handleEdit = (id) => {
    setEditExpenseId(id);
    try {
      updateDoc(doc(db, 'expenses', id), {
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleCloseCreate = () => {
    setShowCreateExpensePopup(false);
  };

  const handleCloseEdit = () => {
    setEditExpenseId(null);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(expenses.length / itemsPerPage)));
  };

  const handleFilterByDOE = () => {
    const sortedExpenses = [...expenses].sort((a, b) => a.date.localeCompare(b.date));
    setExpenses(sortedExpenses);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const calculateTimeElapsed = (createdAt, updatedAt) => {
    const currentTime = new Date();
    const creationTime = new Date(createdAt.seconds * 1000);
    const updatedTime = updatedAt ? new Date(updatedAt.seconds * 1000) : null;

    if (!updatedAt) {
      const elapsed = Math.round((currentTime - creationTime) / (1000 * 60)); 

      if (elapsed < 60) {
        return 'Just Now';
      } else if (elapsed < 60 * 24) {
        return `${Math.floor(elapsed / 60)} hours ago`;
      } else if (elapsed < 60 * 24 * 7) {
        return `${Math.floor(elapsed / (60 * 24))} days ago`;
      } else {
        return 'More than a week ago';
      }
    } else {
      const elapsed = Math.round((currentTime - updatedTime) / (1000 * 60)); 

      if (elapsed < 60) {
        return 'Just Now';
      } else if (elapsed < 60 * 24) {
        return `${Math.floor(elapsed / 60)} hours ago`;
      } else if (elapsed < 60 * 24 * 7) {
        return `${Math.floor(elapsed / (60 * 24))} days ago`;
      } else {
        return 'More than a week ago';
      }
    }
  };

  const filteredExpenses = expenses.filter(expense =>
    expense.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="relative">
      {loading && <div>Loading...</div>}
      <div className="h-screen overflow-y-auto">
      <Navbar className="mx-auto max-w-screen-xl px-6 py-3 mt-2">
  <div className="flex flex-col sm:flex-row items-center justify-between w-full text-blue-gray-900">
    <div className="flex items-center mb-4 sm:mb-0">
      <img className="w-8 h-8 mr-2" src="https://cdn-icons-png.flaticon.com/512/7752/7752650.png" alt="logo" />
      <Typography
        as="a"
        href="#"
        variant="h3"
        className="mr-4 cursor-pointer py-1.5"
      >
        Personal Finance Management
      </Typography>
    </div>
    <div className="flex flex-col sm:flex-row items-center">
      <div className="flex flex-wrap justify-center sm:justify-start">
        <button
          className="static px-4 py-2 focus:outline-none z-10 mb-4 sm:mb-0"
          onClick={() => navigate('/')}
        >
          <img src='https://www.freeiconspng.com/thumbs/sign-out-icon/sign-out-icon-3.png' className='w-8 h-8' alt="sign out" />
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none z-10 mb-4 sm:mb-0"
          onClick={() => setShowCreateExpensePopup(true)}
        >
          Create Expense
        </button>
        <input
          type="text"
          className="px-4 py-2 ml-0 sm:ml-4 mt-4 sm:mt-0 border border-gray-400 rounded-md focus:outline-none"
          placeholder="Filter By Name"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <button
          className="px-4 py-2 ml-0 sm:ml-4 mt-4 sm:mt-0 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none z-10"
          onClick={handleFilterByDOE}
        >
          Filter by DOE
        </button>
      </div>
    </div>
  </div>
</Navbar>


        {showCreateExpensePopup && (
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowCreateExpensePopup(false)}></div>
        )}
        {editExpenseId && (
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowCreateExpensePopup(false)}></div>
        )}
        {showCreateExpensePopup && <CreateExpense onClose={handleCloseCreate} />}
        {editExpenseId && <EditExpense id={editExpenseId} onClose={handleCloseEdit} />}
        <div className="flex items-center justify-center">
          <div className="overflow-x-auto">
            <table className="border-separate border-spacing-y-2 text-lg min-w-1/2 min-h-1/2">
              <thead>
                <tr>
                  <th className="border border-gray-400 px-4 py-2">Name</th>
                  <th className="border border-gray-400 px-4 py-2">Category</th>
                  <th className="border border-gray-400 px-4 py-2">Date of Expense</th>
                  <th className="border border-gray-400 px-4 py-2">Amount</th>
                  <th className="border border-gray-400 px-4 py-2">Created By</th>
                  <th className="border border-gray-400 px-4 py-2">Updated at</th>
                  <th className="border border-gray-400 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.slice(startIndex, endIndex).map((expense) => (
                  <tr key={expense.id}>
                    <td className="td-class">{expense.name}</td>
                    <td className="td-class">{expense.category}</td>
                    <td className="td-class">{expense.date}</td>
                    <td className="td-class">{expense.amount}</td>
                    <td className="td-class">{expense.createdBy || "Loading..."}</td>
                    <td className="td-class">{calculateTimeElapsed(expense.createdAt, expense.updatedAt)}</td>
                    <td className="td-class">
                      <button
                        className="rounded-md px-4 py-px  text-green-900 antialiased"
                        onClick={() => handleEdit(expense.id)}
                      >
                        <img src="https://www.shareicon.net/data/256x256/2015/10/24/136535_edit_256x256.png" className="h-8 w-8"/>
                      </button>
                      <button
                        className="rounded-md px-4 py-px  text-red-900 antialiased"
                        onClick={() => handleDelete(expense.id)}
                      >
                        <img src="https://cdn-icons-png.freepik.com/512/6861/6861362.png" className="h-8 w-8"/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="absolute bottom-0 right-4 flex justify-between px-4 mb-4">
          <button
            className="px-4 py-2 focus:outline-none"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          ><img src="https://cdn-icons-png.flaticon.com/512/271/271220.png" className="h-8 w-8"/> 
          </button>
          <button
            className="px-4 py-2 focus:outline-none"
            onClick={handleNextPage}
            disabled={currentPage === Math.ceil(expenses.length / itemsPerPage)}
          ><img src="https://cdn-icons-png.flaticon.com/512/32/32213.png" className="h-8 w-8"/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
