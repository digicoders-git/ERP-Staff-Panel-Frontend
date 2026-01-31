import React from 'react';
import { MdPayment, MdPending, MdCheckCircle } from 'react-icons/md';

const Fees = () => {
  const feeData = [
    { id: 'FEE001', name: 'Rahul Sharma', class: 'Class 11-A', amount: 25000, paid: 25000, status: 'paid', dueDate: '2024-01-15' },
    { id: 'FEE002', name: 'Priya Singh', class: 'Class 10-B', amount: 20000, paid: 15000, status: 'partial', dueDate: '2024-01-20' },
    { id: 'FEE003', name: 'Sneha Patel', class: 'Class 11-C', amount: 25000, paid: 0, status: 'pending', dueDate: '2024-01-25' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-600 rounded-xl p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">Fee Collection</h2>
        <p className="text-blue-100">Manage student fee payments and collections</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Collection</h3>
          <p className="text-3xl font-bold text-blue-600">₹8.5L</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Pending</h3>
          <p className="text-3xl font-bold text-blue-600">₹2.1L</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">This Month</h3>
          <p className="text-3xl font-bold text-blue-600">₹1.8L</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Overdue</h3>
          <p className="text-3xl font-bold text-blue-600">₹0.5L</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-blue-100">
          <h3 className="text-xl font-bold text-blue-900">Fee Status</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Student</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Class</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Total Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Paid</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Balance</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {feeData.map(fee => (
                <tr key={fee.id} className="hover:bg-blue-50">
                  <td className="px-6 py-4 text-sm font-medium text-blue-900">{fee.name}</td>
                  <td className="px-6 py-4 text-sm text-blue-700">{fee.class}</td>
                  <td className="px-6 py-4 text-sm text-blue-700">₹{fee.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-blue-700">₹{fee.paid.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-blue-700">₹{(fee.amount - fee.paid).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${fee.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                      fee.status === 'partial' ? 'bg-white text-blue-600 border border-blue-200' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                      {fee.status === 'paid' ? <MdCheckCircle size={14} /> : <MdPending size={14} />}
                      {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-blue-700">{fee.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Fees;