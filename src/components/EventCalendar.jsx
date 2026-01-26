import React, { useState } from 'react';
import {
    MdEvent,
    MdAdd,
    MdEdit,
    MdDelete,
    MdCalendarToday,
    MdAccessTime,
    MdLocationOn,
    MdPeople,
    MdDescription,
    MdClose,
    MdCheck,
    MdNotifications,
    MdSchool,
    MdStar,
    MdSports,
    MdTheaterComedy,
    MdScience,
    MdFilterList,
    MdSearch
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const EventCalendar = () => {
    const navigate = useNavigate();
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [filterType, setFilterType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const [events, setEvents] = useState([
        {
            id: 1,
            title: 'Annual Day Celebration 2026',
            type: 'Annual Day',
            date: '2026-03-15',
            time: '10:00 AM',
            endTime: '5:00 PM',
            venue: 'School Auditorium',
            description: 'Grand annual day celebration with cultural performances, prize distribution, and chief guest address.',
            attendees: 500,
            status: 'upcoming',
            organizer: 'Cultural Committee',
            icon: MdTheaterComedy,
            color: 'purple'
        },
        {
            id: 2,
            title: 'Parent-Teacher Meeting (Classes 9-12)',
            type: 'PTM',
            date: '2026-02-10',
            time: '9:00 AM',
            endTime: '1:00 PM',
            venue: 'Respective Classrooms',
            description: 'Quarterly PTM to discuss student progress, academic performance, and behavioral development.',
            attendees: 300,
            status: 'upcoming',
            organizer: 'Academic Department',
            icon: MdPeople,
            color: 'blue'
        },
        {
            id: 3,
            title: 'Science Exhibition',
            type: 'Academic',
            date: '2026-02-20',
            time: '11:00 AM',
            endTime: '4:00 PM',
            venue: 'Science Labs & Ground Floor',
            description: 'Annual science exhibition showcasing innovative projects by students from all classes.',
            attendees: 400,
            status: 'upcoming',
            organizer: 'Science Department',
            icon: MdScience,
            color: 'green'
        },
        {
            id: 4,
            title: 'Inter-House Sports Day',
            type: 'Sports',
            date: '2026-02-28',
            time: '8:00 AM',
            endTime: '5:00 PM',
            venue: 'School Sports Ground',
            description: 'Annual sports competition between all four houses with track & field events, team games, and march past.',
            attendees: 600,
            status: 'upcoming',
            organizer: 'Sports Department',
            icon: MdSports,
            color: 'orange'
        }
    ]);

    const eventTypes = [
        { value: 'all', label: 'All Events', color: 'gray' },
        { value: 'PTM', label: 'Parent-Teacher Meeting', color: 'blue' },
        { value: 'Annual Day', label: 'Annual Day', color: 'purple' },
        { value: 'Sports', label: 'Sports Events', color: 'orange' },
        { value: 'Academic', label: 'Academic Events', color: 'green' }
    ];

    const getColorClasses = (color) => {
        const colors = {
            purple: 'bg-purple-100 text-purple-800 border-purple-200',
            blue: 'bg-blue-100 text-blue-800 border-blue-200',
            green: 'bg-green-100 text-green-800 border-green-200',
            orange: 'bg-orange-100 text-orange-800 border-orange-200',
            red: 'bg-red-100 text-red-800 border-red-200',
            indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200'
        };
        return colors[color] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const filteredEvents = events.filter(event => {
        const matchesType = filterType === 'all' || event.type === filterType;
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
    });

    const upcomingEvents = filteredEvents.filter(e => e.status === 'upcoming').sort((a, b) => new Date(a.date) - new Date(b.date));

    const handleDeleteEvent = (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            setEvents(events.filter(e => e.id !== id));
            setSelectedEvent(null);
        }
    };

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
        <div className="p-6 bg-gray-50 min-h-screen space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
                                <MdCalendarToday size={40} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-extrabold tracking-tight">Upcoming Events</h1>
                                <p className="text-blue-100 mt-1 text-lg font-medium opacity-90">Manage scheduled school activities</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/add-event')}
                            className="flex items-center space-x-2 px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg"
                        >
                            <MdAdd size={24} />
                            <span>Schedule New Event</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                            <p className="text-blue-200 text-sm font-semibold uppercase">Total Scheduled</p>
                            <h3 className="text-3xl font-bold mt-1">{events.length}</h3>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                            <p className="text-blue-200 text-sm font-semibold uppercase">Next 7 Days</p>
                            <h3 className="text-3xl font-bold mt-1">2</h3>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                            <p className="text-blue-200 text-sm font-semibold uppercase">This Month</p>
                            <h3 className="text-3xl font-bold mt-1">{events.filter(e => new Date(e.date).getMonth() === new Date().getMonth()).length}</h3>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                            <p className="text-blue-200 text-sm font-semibold uppercase">Pending Actions</p>
                            <h3 className="text-3xl font-bold mt-1">0</h3>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative flex-1 max-w-md w-full">
                        <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                        <input
                            type="text"
                            placeholder="Search scheduled events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto">
                        {eventTypes.map((type) => (
                            <button
                                key={type.value}
                                onClick={() => setFilterType(type.value)}
                                className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${filterType === type.value
                                    ? 'bg-indigo-600 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Upcoming Events Grid */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <MdNotifications className="mr-2 text-indigo-600" />
                    Scheduled Events
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingEvents.map((event) => (
                        <div
                            key={event.id}
                            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                            onClick={() => setSelectedEvent(event)}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-2xl ${getColorClasses(event.color)}`}>
                                    <event.icon size={28} />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getColorClasses(event.color)}`}>
                                    {event.type}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                                {event.title}
                            </h3>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-sm text-gray-600">
                                    <MdCalendarToday className="mr-2 text-indigo-400" />
                                    <span className="font-medium">{formatDate(event.date)}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <MdAccessTime className="mr-2 text-indigo-400" />
                                    <span>{event.time} - {event.endTime}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <MdLocationOn className="mr-2 text-indigo-400" />
                                    <span>{event.venue}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <span className="text-xs text-gray-400 font-medium tracking-tight">Organized by: {event.organizer}</span>
                                <div className="flex space-x-1">
                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><MdEdit size={18} /></button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event.id); }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><MdDelete size={18} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detail Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-3xl font-bold text-gray-900">{selectedEvent.title}</h2>
                            <button onClick={() => setSelectedEvent(null)} className="p-2 hover:bg-gray-100 rounded-full"><MdClose size={24} /></button>
                        </div>
                        <div className="space-y-4">
                            <p className="text-gray-700 leading-relaxed font-medium">{selectedEvent.description}</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <span className="text-xs font-bold text-gray-400 uppercase">Venue</span>
                                    <p className="text-gray-900 font-bold mt-1 text-lg">{selectedEvent.venue}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <span className="text-xs font-bold text-gray-400 uppercase">Attendees</span>
                                    <p className="text-gray-900 font-bold mt-1 text-lg">{selectedEvent.attendees}+</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventCalendar;
