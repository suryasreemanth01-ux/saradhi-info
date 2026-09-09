import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Admin password - CHANGE THIS to your own password
  const ADMIN_PASSWORD = 'saradhi2024';

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchRecords();
    } else {
      alert('Incorrect password!');
    }
  };

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'owners'));
      const recordsData = [];
      querySnapshot.forEach((doc) => {
        recordsData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      // Sort by timestamp (newest first)
      recordsData.sort((a, b) => {
        if (a.timestamp && b.timestamp) {
          return new Date(b.timestamp) - new Date(a.timestamp);
        }
        return 0;
      });
      setRecords(recordsData);
    } catch (error) {
      console.error('Error fetching records:', error);
      alert('Error loading records: ' + error.message);
    }
    setLoading(false);
  };

  const deleteRecord = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await deleteDoc(doc(db, 'owners', id));
        setRecords(records.filter(record => record.id !== id));
        alert('Record deleted successfully!');
      } catch (error) {
        console.error('Error deleting record:', error);
        alert('Error deleting record: ' + error.message);
      }
    }
  };

  const deleteSelected = async () => {
    if (selectedRecords.length === 0) {
      alert('Please select records to delete.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete ${selectedRecords.length} record(s)?`)) {
      try {
        for (const id of selectedRecords) {
          await deleteDoc(doc(db, 'owners', id));
        }
        setRecords(records.filter(record => !selectedRecords.includes(record.id)));
        setSelectedRecords([]);
        alert('Selected records deleted successfully!');
      } catch (error) {
        console.error('Error deleting records:', error);
        alert('Error deleting records: ' + error.message);
      }
    }
  };

  const toggleSelect = (id) => {
    if (selectedRecords.includes(id)) {
      setSelectedRecords(selectedRecords.filter(recordId => recordId !== id));
    } else {
      setSelectedRecords([...selectedRecords, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedRecords.length === filteredRecords.length) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords(filteredRecords.map(record => record.id));
    }
  };

  const exportCSV = () => {
    if (records.length === 0) {
      alert('No records to export!');
      return;
    }

    const headers = ['ID', 'Property Type', 'House Number', 'Building Name', 'Flat Number', 'Owner Name', 'Owner Phone', 'Submitted At'];
    const csvData = [headers.join(',')];
    
    records.forEach(record => {
      const row = [
        record.id || '',
        record.propertyType || '',
        record.houseNumber || '',
        record.buildingName || '',
        record.flatNumber || '',
        record.ownerName || '',
        record.ownerPhone || '',
        record.timestamp || ''
      ];
      csvData.push(row.join(','));
    });

    const blob = new Blob([csvData.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saradhi-info-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredRecords = records.filter(record => {
    const search = searchTerm.toLowerCase();
    return (
      (record.ownerName && record.ownerName.toLowerCase().includes(search)) ||
      (record.ownerPhone && record.ownerPhone.includes(search)) ||
      (record.houseNumber && record.houseNumber.includes(search)) ||
      (record.buildingName && record.buildingName.toLowerCase().includes(search)) ||
      (record.flatNumber && record.flatNumber.includes(search))
    );
  });

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-card">
          <h2>🔐 Admin Login</h2>
          <p>Enter the admin password to access the dashboard</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>🏡 Saradhi Info - Admin Dashboard</h1>
        <div className="admin-actions">
          <button onClick={exportCSV} className="btn-export">
            📥 Export CSV
          </button>
          <button onClick={deleteSelected} className="btn-delete-selected">
            🗑️ Delete Selected ({selectedRecords.length})
          </button>
          <button onClick={fetchRecords} className="btn-refresh">
            🔄 Refresh
          </button>
          <button onClick={() => setIsAuthenticated(false)} className="btn-logout">
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Records</h3>
          <p>{records.length}</p>
        </div>
        <div className="stat-card">
          <h3>Independent Houses</h3>
          <p>{records.filter(r => r.propertyType === 'Independent House').length}</p>
        </div>
        <div className="stat-card">
          <h3>Apartments</h3>
          <p>{records.filter(r => r.propertyType === 'Apartment').length}</p>
        </div>
        <div className="stat-card">
          <h3>Unique Owners</h3>
          <p>{new Set(records.map(r => r.ownerPhone)).size}</p>
        </div>
      </div>

      <div className="admin-controls">
        <input
          type="text"
          placeholder="🔍 Search by name, phone, house number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <span className="record-count">{filteredRecords.length} records found</span>
      </div>

      {loading ? (
        <div className="loading">Loading records...</div>
      ) : (
        <div className="table-container">
          <table className="records-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedRecords.length === filteredRecords.length && filteredRecords.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>#</th>
                <th>Property Type</th>
                <th>House Number</th>
                <th>Building Name</th>
                <th>Flat Number</th>
                <th>Owner Name</th>
                <th>Owner Phone</th>
                <th>Submitted At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="10" className="no-records">No records found</td>
                </tr>
              ) : (
                filteredRecords.map((record, index) => (
                  <tr key={record.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRecords.includes(record.id)}
                        onChange={() => toggleSelect(record.id)}
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td>{record.propertyType || '-'}</td>
                    <td>{record.houseNumber || '-'}</td>
                    <td>{record.buildingName || '-'}</td>
                    <td>{record.flatNumber || '-'}</td>
                    <td><strong>{record.ownerName || '-'}</strong></td>
                    <td>{record.ownerPhone || '-'}</td>
                    <td>{record.timestamp ? new Date(record.timestamp).toLocaleString() : '-'}</td>
                    <td>
                      <button 
                        onClick={() => deleteRecord(record.id)} 
                        className="btn-delete"
                        title="Delete this record"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
