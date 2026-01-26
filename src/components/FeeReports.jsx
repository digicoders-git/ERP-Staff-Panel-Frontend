import React, { useState, useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { MdSearch, MdFilterList, MdDownload, MdPeople, MdAttachMoney, MdWarning } from 'react-icons/md';

const FeeReports = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');

  // Sample fee data
  const feeData = useMemo(() => ({
    paid: [
      { id: 1, name: 'John Smith', class: '10A', amount: 5000, date: '2024-01-15', status: 'Paid' },
      { id: 2, name: 'Sarah Johnson', class: '9B', amount: 4500, date: '2024-01-10', status: 'Paid' },
      { id: 3, name: 'Mike Wilson', class: '11C', amount: 5500, date: '2024-01-08', status: 'Paid' },
      { id: 4, name: 'Emma Davis', class: '8A', amount: 4000, date: '2024-01-12', status: 'Paid' },
      { id: 5, name: 'Alex Brown', class: '12B', amount: 6000, date: '2024-01-14', status: 'Paid' }
    ],
    due: [
      { id: 6, name: 'Lisa Garcia', class: '10B', amount: 5000, dueDate: '2024-02-01', daysOverdue: 0, status: 'Due' },
      { id: 7, name: 'Tom Anderson', class: '9A', amount: 4500, dueDate: '2024-01-25', daysOverdue: 7, status: 'Due' },
      { id: 8, name: 'Kate Miller', class: '11A', amount: 5500, dueDate: '2024-02-05', daysOverdue: 0, status: 'Due' }
    ],
    defaulters: [
      { id: 9, name: 'Robert Taylor', class: '10C', amount: 5000, dueDate: '2023-12-15', daysOverdue: 45, status: 'Defaulter' },
      { id: 10, name: 'Jennifer White', class: '9C', amount: 4500, dueDate: '2023-12-20', daysOverdue: 40, status: 'Defaulter' },
      { id: 11, name: 'David Lee', class: '8B', amount: 4000, dueDate: '2024-01-01', daysOverdue: 30, status: 'Defaulter' }
    ]
  }), []);

  // Chart configurations
  const pieChartOptions = useMemo(() => ({
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      height: 400
    },
    title: {
      text: 'Fee Collection Overview',
      style: { fontSize: '18px', fontWeight: 'bold', color: '#374151' }
    },
    tooltip: {
      pointFormat: '<b>{point.y}</b> students<br/><b>₹{point.amount:,.0f}</b> total',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderRadius: 8,
      shadow: true,
      style: { color: '#1f2937' }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f}%',
          style: { fontSize: '12px', fontWeight: 'bold', color: '#374151' }
        },
        showInLegend: true,
        colors: ['#10b981', '#f59e0b', '#ef4444']
      }
    },
    legend: {
      align: 'bottom',
      verticalAlign: 'bottom',
      layout: 'horizontal'
    },
    series: [{
      name: 'Fee Status',
      colorByPoint: true,
      data: [
        { name: 'Paid', y: feeData.paid.length, amount: feeData.paid.reduce((sum, item) => sum + item.amount, 0) },
        { name: 'Due', y: feeData.due.length, amount: feeData.due.reduce((sum, item) => sum + item.amount, 0) },
        { name: 'Defaulters', y: feeData.defaulters.length, amount: feeData.defaulters.reduce((sum, item) => sum + item.amount, 0) }
      ]
    }]
  }), [feeData]);

  const barChartOptions = useMemo(() => ({
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      height: 400
    },
    title: {
      text: 'Fee Collection by Amount',
      style: { fontSize: '18px', fontWeight: 'bold', color: '#374151' }
    },
    xAxis: {
      categories: ['Paid', 'Due', 'Defaulters'],
      title: { text: 'Status' }
    },
    yAxis: {
      title: { text: 'Amount (₹)' },
      labels: {
        formatter: function () {
          return '₹' + Highcharts.numberFormat(this.value, 0);
        }
      }
    },
    tooltip: {
      pointFormat: '<b>₹{point.y:,.0f}</b>',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderRadius: 8,
      style: { color: '#1f2937' }
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          formatter: function () {
            return '₹' + Highcharts.numberFormat(this.y, 0);
          },
          style: { fontSize: '11px', fontWeight: 'bold', color: '#4b5563' }
        },
        colors: ['#10b981', '#f59e0b', '#ef4444']
      }
    },
    series: [{
      name: 'Amount',
      colorByPoint: true,
      data: [
        feeData.paid.reduce((sum, item) => sum + item.amount, 0),
        feeData.due.reduce((sum, item) => sum + item.amount, 0),
        feeData.defaulters.reduce((sum, item) => sum + item.amount, 0)
      ]
    }]
  }), [feeData]);

  const getCurrentData = () => {
    switch (activeTab) {
      case 'paid': return feeData.paid;
      case 'due': return feeData.due;
      case 'defaulters': return feeData.defaulters;
      default: return [];
    }
  };

  const filteredData = useMemo(() => {
    const currentData = getCurrentData();
    return currentData.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterClass === '' || item.class === filterClass)
    );
  }, [activeTab, searchTerm, filterClass, feeData]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Due': return 'bg-yellow-100 text-yellow-800';
      case 'Defaulter': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Fee Reports</h1>
        <p className="text-gray-600">Track fee payments, dues, and defaulters</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Paid</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{feeData.paid.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">{feeData.paid.length} students</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <MdAttachMoney className="text-2xl text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Due</p>
              <p className="text-2xl font-bold text-yellow-600">
                ₹{feeData.due.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">{feeData.due.length} students</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <MdPeople className="text-2xl text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Defaulters</p>
              <p className="text-2xl font-bold text-red-600">
                ₹{feeData.defaulters.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">{feeData.defaulters.length} students</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <MdWarning className="text-2xl text-red-600" />
            </div>
          </div>
        </div>
      </div>


      {/* Tabs and Data Table */}
      <div className="bg-white rounded-xl shadow-sm">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'overview', label: 'Overview', count: feeData.paid.length + feeData.due.length + feeData.defaulters.length },
              { key: 'paid', label: 'Paid', count: feeData.paid.length },
              { key: 'due', label: 'Due', count: feeData.due.length },
              { key: 'defaulters', label: 'Defaulters', count: feeData.defaulters.length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        {activeTab !== 'overview' && (
          <>
            {/* Search and Filter */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <MdFilterList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Classes</option>
                    <option value="8A">8A</option>
                    <option value="8B">8B</option>
                    <option value="9A">9A</option>
                    <option value="9B">9B</option>
                    <option value="9C">9C</option>
                    <option value="10A">10A</option>
                    <option value="10B">10B</option>
                    <option value="10C">10C</option>
                    <option value="11A">11A</option>
                    <option value="11C">11C</option>
                    <option value="12B">12B</option>
                  </select>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                  <MdDownload />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {activeTab === 'paid' ? 'Payment Date' : activeTab === 'due' ? 'Due Date' : 'Days Overdue'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.class}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">₹{item.amount.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {activeTab === 'paid' ? item.date :
                            activeTab === 'due' ? item.dueDate :
                              `${item.daysOverdue} days`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'overview' && (
          <div className="p-6">
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <HighchartsReact highcharts={Highcharts} options={pieChartOptions} />
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeeReports;