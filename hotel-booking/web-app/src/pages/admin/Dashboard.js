import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/api';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    totalHotels: 0,
    activeBookings: 0,
    totalRevenue: 0,
    occupancyRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    console.log('Fetching dashboard stats...');
    try {
      setLoading(true);
      const data = await adminService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.response?.data?.message || 'Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <h1 className="welcome-title">Welcome to Admin Dashboard</h1>
        <p className="welcome-subtitle">Manage your hotels, bookings, and view important statistics</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3 className="stat-title">Total Hotels</h3>
          <div className="stat-value">{stats.totalHotels}</div>
          <p className="stat-description">Active hotels in your portfolio</p>
        </div>

        <div className="stat-card">
          <h3 className="stat-title">Active Bookings</h3>
          <div className="stat-value">{stats.activeBookings}</div>
          <p className="stat-description">Current active reservations</p>
        </div>

        <div className="stat-card">
          <h3 className="stat-title">Revenue</h3>
          <div className="stat-value">${stats.totalRevenue.toLocaleString()}</div>
          <p className="stat-description">Total revenue this month</p>
        </div>

        <div className="stat-card">
          <h3 className="stat-title">Occupancy Rate</h3>
          <div className="stat-value">{stats.occupancyRate}%</div>
          <p className="stat-description">Average occupancy this month</p>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/admin/hotels/add" className="action-card">
          <div className="action-icon">➕</div>
          <h3>Add New Hotel</h3>
          <p>Add a new hotel with details and images</p>
        </Link>
        <Link to="/admin/hotels" className="action-card">
          <div className="action-icon">🏨</div>
          <h3>Manage Hotels</h3>
          <p>View and edit existing hotels</p>
        </Link>
        <Link to="/admin/bookings" className="action-card">
          <div className="action-icon">📅</div>
          <h3>Manage Bookings</h3>
          <p>View and manage hotel bookings</p>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
