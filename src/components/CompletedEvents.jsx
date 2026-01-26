import React, { useState } from 'react';
import { MdCheck, MdCalendarToday, MdLocationOn, MdStar, MdFilterList, MdSearch } from 'react-icons/md';

const CompletedEvents = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const completedEvents = [
        {
            id: 5,
            title: 'Republic Day Celebration',
            type: 'National Event',
            date: '2026-01-26',
            venue: 'School Assembly Ground',
            icon: MdStar,
            color: 'red'
        },
        {
            id: 8,
            title: 'Winter Science Fair',
            type: 'Academic',
            date: '2025-12-15',
            venue: 'Main Library',
            icon: MdCheck,
            color: 'green'
        }
    ].filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()));

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="p-6 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-800">Event History</h2>
                    <p className="text-slate-500 font-medium">Review and evaluate completed school activities</p>
                </div>
                <div className="relative w-full md:w-80">
                    <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
                    <input
                        type="text"
                        placeholder="Search past events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedEvents.length > 0 ? (
                    completedEvents.map((event) => (
                        <div
                            key={event.id}
                            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group overflow-hidden relative"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                                    <event.icon size={28} />
                                </div>
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider">
                                    Completed
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-3">
                                {event.title}
                            </h3>

                            <div className="space-y-2">
                                <div className="flex items-center text-sm text-slate-500 font-medium">
                                    <MdCalendarToday className="mr-2 text-slate-400" />
                                    <span>{formatDate(event.date)}</span>
                                </div>
                                <div className="flex items-center text-sm text-slate-500 font-medium">
                                    <MdLocationOn className="mr-2 text-slate-400" />
                                    <span>{event.venue}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
                                <button className="text-emerald-600 font-bold text-xs uppercase tracking-widest hover:text-emerald-700">View Report</button>
                                <span className="text-xs text-slate-400">ID: #EVENT-00{event.id}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-bold">No completed events found Matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompletedEvents;
