import React, { useState } from 'react';
import { MdTrendingUp, MdDownload, MdBarChart, MdPieChart, MdVisibility, MdClose } from 'react-icons/md';
import { toast } from 'react-toastify';

const Reports = () => {
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState([
    { id: 'RPT001', name: 'Admission Report', type: 'Monthly', generated: '2024-01-15', size: '2.5 MB' },
    { id: 'RPT002', name: 'Fee Collection Report', type: 'Weekly', generated: '2024-01-14', size: '1.8 MB' },
    { id: 'RPT003', name: 'Student Enrollment', type: 'Quarterly', generated: '2024-01-13', size: '3.2 MB' },
    { id: 'RPT004', name: 'Class Allocation Report', type: 'Monthly', generated: '2024-01-12', size: '1.5 MB' }
  ]);

  const handleGenerateReport = (reportType) => {
    setIsGenerating(true);
    toast.info(`Generating ${reportType} report... 📈`);
    
    setTimeout(() => {
      const newReport = {
        id: `RPT${String(reportData.length + 1).padStart(3, '0')}`,
        name: reportType,
        type: 'Generated',
        generated: new Date().toISOString().split('T')[0],
        size: `${(Math.random() * 3 + 1).toFixed(1)} MB`
      };
      
      setReportData([newReport, ...reportData]);
      setIsGenerating(false);
      toast.success(`${reportType} report generated successfully! 📊`);
    }, 2000);
  };

  const handleDownloadReport = (report) => {
    const content = `${report.name} Report\n\nReport ID: ${report.id}\nGenerated: ${report.generated}\nType: ${report.type}\nFile Size: ${report.size}\n\n--- Report Data ---\n\nThis is a sample ${report.name.toLowerCase()} containing:\n- Statistical analysis\n- Charts and graphs\n- Detailed breakdowns\n- Summary insights\n\nGenerated on: ${new Date().toLocaleString()}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.name.replace(/\s+/g, '_')}_${report.id}.txt`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(url);
    
    toast.success(`${report.name} downloaded successfully! 📥`);
  };

  const handlePreviewReport = (report) => {
    setSelectedReport(report);
    setShowPreviewModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-600 rounded-xl p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">Reports & Analytics</h2>
        <p className="text-blue-100">Generate and download admission reports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admission Analytics Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">Admission Analytics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Applications Received</span>
              <span className="font-bold text-blue-900">1,456</span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-3">
              <div className="bg-blue-600 h-3 rounded-full" style={{width: '85%'}}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Approved</span>
              <span className="font-bold text-blue-900">1,234 (85%)</span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-3">
              <div className="bg-blue-500 h-3 rounded-full" style={{width: '13%'}}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Pending Review</span>
              <span className="font-bold text-blue-900">189 (13%)</span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-3">
              <div className="bg-blue-300 h-3 rounded-full" style={{width: '2%'}}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Rejected</span>
              <span className="font-bold text-blue-900">33 (2%)</span>
            </div>
          </div>
        </div>

        {/* Fee Collection Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">Fee Collection</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Total Expected</span>
              <span className="font-bold text-blue-900">₹45,60,000</span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-3">
              <div className="bg-green-500 h-3 rounded-full" style={{width: '85%'}}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Collected</span>
              <span className="font-bold text-green-600">₹38,76,000 (85%)</span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-3">
              <div className="bg-yellow-500 h-3 rounded-full" style={{width: '10%'}}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Pending</span>
              <span className="font-bold text-yellow-600">₹4,56,000 (10%)</span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-3">
              <div className="bg-red-500 h-3 rounded-full" style={{width: '5%'}}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Overdue</span>
              <span className="font-bold text-red-600">₹2,28,000 (5%)</span>
            </div>
          </div>
        </div>

        {/* Enrollment Trends Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">Enrollment Trends</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
              <span className="text-blue-700">Class 9</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-blue-100 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '90%'}}></div>
                </div>
                <span className="font-bold text-blue-900 text-sm">180/200</span>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
              <span className="text-blue-700">Class 10</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-blue-100 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '95%'}}></div>
                </div>
                <span className="font-bold text-blue-900 text-sm">190/200</span>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
              <span className="text-blue-700">Class 11 Science</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-blue-100 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
                <span className="font-bold text-blue-900 text-sm">170/200</span>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
              <span className="text-blue-700">Class 11 Commerce</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-blue-100 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
                <span className="font-bold text-blue-900 text-sm">150/200</span>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
              <span className="text-blue-700">Class 12 Science</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-blue-100 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '88%'}}></div>
                </div>
                <span className="font-bold text-blue-900 text-sm">176/200</span>
              </div>
            </div>
          </div>
        </div>

        {/* Class Statistics Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">Class Statistics</h3>
          <div className="space-y-4">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-blue-100" stroke="currentColor" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-blue-600" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="92, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-900">92%</span>
                </div>
              </div>
              <p className="text-blue-700 font-medium">Overall Occupancy</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center p-3 bg-blue-50 rounded">
                <p className="font-bold text-blue-900">24</p>
                <p className="text-blue-700">Total Classes</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded">
                <p className="font-bold text-blue-900">1,866</p>
                <p className="text-blue-700">Total Students</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded">
                <p className="font-bold text-blue-900">78</p>
                <p className="text-blue-700">Avg per Class</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded">
                <p className="font-bold text-blue-900">134</p>
                <p className="text-blue-700">Available Seats</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-blue-100">
          <h3 className="text-xl font-bold text-blue-900">Generated Reports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Report Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Generated Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">File Size</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100">
              {reportData.map(report => (
                <tr key={report.id} className="hover:bg-blue-50">
                  <td className="px-6 py-4 text-sm font-medium text-blue-900">{report.name}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-blue-700">{report.generated}</td>
                  <td className="px-6 py-4 text-sm text-blue-700">{report.size}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handlePreviewReport(report)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Preview Report"
                      >
                        <MdVisibility size={16} />
                      </button>
                      <button 
                        onClick={() => handleDownloadReport(report)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                      >
                        <MdDownload size={16} />
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Preview Modal */}
      {showPreviewModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-blue-100">
              <h3 className="text-xl font-bold text-blue-900">Report Preview - {selectedReport.name}</h3>
              <button 
                onClick={() => setShowPreviewModal(false)}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <MdClose size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">Report ID</label>
                  <p className="text-blue-900 font-semibold">{selectedReport.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">Report Type</label>
                  <p className="text-blue-900 font-semibold">{selectedReport.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">Generated Date</label>
                  <p className="text-blue-900 font-semibold">{selectedReport.generated}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">File Size</label>
                  <p className="text-blue-900 font-semibold">{selectedReport.size}</p>
                </div>
              </div>
              
              <div className="border-t border-blue-100 pt-4">
                <label className="block text-sm font-medium text-blue-700 mb-2">Report Summary</label>
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Total Records:</span>
                        <span className="font-semibold text-blue-900">1,456</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Success Rate:</span>
                        <span className="font-semibold text-blue-900">92.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Average Score:</span>
                        <span className="font-semibold text-blue-900">87.3</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Period:</span>
                        <span className="font-semibold text-blue-900">Jan 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Status:</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">Complete</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Format:</span>
                        <span className="font-semibold text-blue-900">PDF/Excel</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-blue-100 pt-4">
                <label className="block text-sm font-medium text-blue-700 mb-2">Chart Preview</label>
                <div className="bg-blue-50 rounded-lg p-8 text-center">
                  <MdBarChart size={64} className="mx-auto text-blue-400 mb-4" />
                  <p className="text-blue-700 font-medium">Interactive Charts & Graphs</p>
                  <p className="text-blue-600 text-sm mt-2">Full charts available in downloaded report</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t border-blue-100">
              <button 
                onClick={() => handleDownloadReport(selectedReport)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <MdDownload size={18} />
                Download Report
              </button>
              <button 
                onClick={() => setShowPreviewModal(false)}
                className="px-6 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;