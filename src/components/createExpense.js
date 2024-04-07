import React, { useState } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Card, CardBody, CardFooter, Typography, Button, Input } from "@material-tailwind/react";

const CreateExpense = ({ onClose }) => {
  const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');

  const [expenseData, setExpenseData] = useState({
    name: '',
    category: '',
    date: '',
    amount: '',
    createdBy: loggedInUserEmail
  });

  const categories = ['Health', 'Electronics', 'Travel', 'Education', 'Books', 'Others'];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'expenses'), {
        ...expenseData,
        createdBy: loggedInUserEmail,
        createdAt: new Date()
      });
      
      setExpenseData({
        name: '',
        category: '',
        date: '',
        amount: '',
        createdBy: loggedInUserEmail
      });

      onClose();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenseData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="flex justify-center items-center h-screen absolute inset-0">
      <Card className="mt-6 w-96">
        <div className='mt-6 flex items-center justify-center'>
          <img className="w-8 h-8" src="https://cdn-icons-png.flaticon.com/512/7752/7752650.png" alt="logo" />
          <Typography variant="h2" color="blue-gray">&nbsp;Create Expense</Typography>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 mx-auto">
          <CardBody className="px-6 py-4">
            <Typography variant="h6" color="blue-gray" className="mb-2"> Name </Typography>
            <Input size="lg" className="mb-4 !border-t-blue-gray-200 focus:!border-t-gray-900" type="text" id="name" name="name" value={expenseData.name} onChange={handleChange} required />
            <Typography htmlFor="category" variant="h6" color="blue-gray" className="mb-2"> Category </Typography>
            <select
              id="category"
              name="category"
              value={expenseData.category}
              onChange={handleChange}
              size="lg"
              className="mb-4 !border-t-black-gray-200 focus:!border-t-gray-900 w-full py-3 px-4 rounded-md bg-white border border-gray-300 focus:outline-black-700 focus:ring-2 focus:ring-black-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <Typography htmlFor="date" variant="h6" color="blue-gray" className="mb-2"> Date of Expense </Typography>
            <Input size="lg" className="mb-4 !border-t-blue-gray-200 focus:!border-t-gray-900" type="date" id="date" name="date" value={expenseData.date} onChange={handleChange} required />
            <Typography htmlFor="amount" variant="h6" color="blue-gray" className="mb-2"> Amount </Typography>
            <Input size="lg" className="mb-4 !border-t-blue-gray-200 focus:!border-t-gray-900" type="number" id="amount" name="amount" value={expenseData.amount} onChange={handleChange} required />
          </CardBody>
          <CardFooter className="pt-1">
            <Button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Create Expense
            </Button>
            <Button className="ml-2 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500" onClick={onClose}>
              Cancel
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateExpense;
