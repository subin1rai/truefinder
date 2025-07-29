"use client";

import { useState, useEffect } from "react";
import {
  Users,
  UserCheck,
  Clock,
  Shield,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Calendar,
  MapPin,
  Briefcase,
  Phone,
  Mail,
} from "lucide-react";
import { axiosInstance } from "../api/baseUrl";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, [filters]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found. Please login again.");
        return;
      }

      const response = await fetch("http://localhost:5000/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server returned non-JSON response");
      }

      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError(`Failed to fetch stats: ${error.message}`);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found. Please login again.");
        return;
      }

      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(
        `http://localhost:5000/api/admin/users?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server returned non-JSON response");
      }

      const data = await response.json();
      setUsers(data.users || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(`Failed to fetch users: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUser = async (userId, verified, reason = "") => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found. Please login again.");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/admin/users/${userId}/verify`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ verified, reason }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server returned non-JSON response");
      }

      await response.json();
      fetchUsers();
      fetchStats();
      setShowModal(false);
      setSelectedUser(null);
      setError(null);
    } catch (error) {
      console.error("Error verifying user:", error);
      setError(`Failed to verify user: ${error.message}`);
    }
  };

  const openUserModal = async (userId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found. Please login again.");
        return;
      }

      const response = await axiosInstance.get(`/user/${userId}`);
      
      
      if (!response.status === 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const user = response.data;
      setSelectedUser(user);
      setShowModal(true);
      setError(null);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setError(`Failed to fetch user details: ${error.message}`);
    }
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const getStatusBadge = (user) => {
    if (user.isVerified) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified
        </span>
      );
    } else if (user.profileCompleted) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Incomplete
        </span>
      );
    }
  };

  // Error display component
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Error</h2>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-2">
            <button
              onClick={() => {
                setError(null);
                fetchStats();
                fetchUsers();
              }}
              className="w-full px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              Retry
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Make sure your server is running and the admin routes are properly
              configured at /api/admin/*
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-pink-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Users
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalUsers || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserCheck className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Verified Users
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.verifiedUsers || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pending Verification
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.pendingVerification || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      New Today
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.newUsersToday || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                    value={filters.search}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        search: e.target.value,
                        page: 1,
                      })
                    }
                  />
                </div>
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value, page: 1 })
                  }
                >
                  <option value="all">All Users</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                  <option value="pending">Pending Review</option>
                </select>
              </div>
              <div className="mt-4 sm:mt-0">
                <button
                  onClick={fetchUsers}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              User Management
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Review and verify user profiles
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No users found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  No users match your current filters.
                </p>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {users.map((user) => (
                <li key={user._id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img
                          className="h-12 w-12 rounded-full object-cover"
                          src={
                            user.avatar ||
                            user.photos?.[0] ||
                            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          }
                          alt={`${user.firstName} ${user.lastName}`}
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="ml-2">{getStatusBadge(user)}</div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email} • {calculateAge(user.dateOfBirth)} years
                        </div>
                        <div className="text-xs text-gray-400 flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {user.city}, {user.state}
                          {user.profession && (
                            <>
                              <Briefcase className="h-3 w-3 ml-3 mr-1" />
                              {user.profession}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openUserModal(user._id)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Review
                      </button>
                      {!user.isVerified && user.profileCompleted && (
                        <>
                          <button
                            onClick={() => handleVerifyUser(user._id, true)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verify
                          </button>
                          <button
                            onClick={() =>
                              handleVerifyUser(
                                user._id,
                                false,
                                "Profile rejected by admin"
                              )
                            }
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* User Detail Modal */}
        {showModal && selectedUser && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    User Profile Review
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {/* Profile Header */}
                  <div className="flex items-center mb-6">
                    <img
                      className="h-20 w-20 rounded-full object-cover"
                      src={
                        selectedUser.avatar ||
                        selectedUser.photos?.[0] ||
                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      }
                      alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";
                      }}
                    />
                    <div className="ml-4">
                      <h4 className="text-xl font-semibold text-gray-900">
                        {selectedUser.firstName} {selectedUser.lastName}
                      </h4>
                      <p className="text-gray-600">
                        {calculateAge(selectedUser.dateOfBirth)} years old
                      </p>
                      <div className="mt-1">{getStatusBadge(selectedUser)}</div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        {selectedUser.email}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        {selectedUser.phone}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        {selectedUser.city}, {selectedUser.state}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        Joined{" "}
                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">
                        Professional Information
                      </h5>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Education:</span>
                          <span className="ml-2 text-gray-900">
                            {selectedUser.education || "Not specified"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Profession:</span>
                          <span className="ml-2 text-gray-900">
                            {selectedUser.profession || "Not specified"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Company:</span>
                          <span className="ml-2 text-gray-900">
                            {selectedUser.company || "Not specified"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Income:</span>
                          <span className="ml-2 text-gray-900">
                            {selectedUser.income || "Not specified"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">
                        Personal Information
                      </h5>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Height:</span>
                          <span className="ml-2 text-gray-900">
                            {selectedUser.height || "Not specified"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Religion:</span>
                          <span className="ml-2 text-gray-900">
                            {selectedUser.religion || "Not specified"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Mother Tongue:</span>
                          <span className="ml-2 text-gray-900">
                            {selectedUser.motherTongue || "Not specified"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Diet:</span>
                          <span className="ml-2 text-gray-900">
                            {selectedUser.diet || "Not specified"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {selectedUser.bio && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-2">
                          Bio
                        </h5>
                        <p className="text-sm text-gray-600">
                          {selectedUser.bio}
                        </p>
                      </div>
                    )}

                    {selectedUser.interests &&
                      selectedUser.interests.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-900 mb-2">
                            Interests
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {selectedUser.interests.map((interest, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    {selectedUser.photos && selectedUser.photos.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-2">
                          Photos
                        </h5>
                        <div className="grid grid-cols-3 gap-2">
                          {selectedUser.photos.map((photo, index) => (
                            <img
                              key={index}
                              src={
                                `${
                                  import.meta.env.VITE_API_BASE_URL ||
                                  "http://localhost:5000"
                                }${photo}` ||
                                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                              }
                              alt={`Photo ${index + 1}`}
                              className="h-20 w-20 object-cover rounded-md"
                              onError={(e) => {
                                e.target.src =
                                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {!selectedUser.isVerified && selectedUser.profileCompleted && (
                  <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                    <button
                      onClick={() =>
                        handleVerifyUser(
                          selectedUser._id,
                          false,
                          "Profile rejected after review"
                        )
                      }
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Profile
                    </button>
                    <button
                      onClick={() => handleVerifyUser(selectedUser._id, true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Verify Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
