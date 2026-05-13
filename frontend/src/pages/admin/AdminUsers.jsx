import axios from 'axios';
import { Edit, Eye, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import UserLogo from "../../assets/userlogo.jpg";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
  const [user, setUser] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getAllUsers = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      setLoading(true);

      const res = await axios.get(
        'http://localhost:8000/api/v1/user/all-user',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setUser(res.data.users || []);
    } catch (error) {
      console.log("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ SEARCH FILTER
  const filteredUser = user.filter((u) =>
    `${u.firstName} ${u.lastName} ${u.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className='pl-[350px] py-20 mx-auto px-4'>

      {/* HEADER */}
      <h1 className='font-bold text-2xl'>User Management</h1>
      <p>View and manage registered users</p>

      {/* SEARCH */}
      <div className='relative w-[300px] mt-6'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5' />

        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full bg-white border rounded-lg pl-10 pr-3 py-2 outline-none'
          placeholder='Search Users'
        />
      </div>

      {/* LOADING */}
      {loading && <p className="mt-6">Loading users...</p>}

      {/* EMPTY STATE */}
      {!loading && filteredUser.length === 0 && (
        <p className="mt-6 text-gray-500">No users found</p>
      )}

      {/* USERS GRID */}
      <div className='grid grid-cols-3 gap-7 mt-7'>
        {
          filteredUser.map((u) => (
            <div key={u._id} className='bg-pink-100 p-4 rounded-lg shadow'>

              <div className='flex items-center gap-3'>

                {/* PROFILE IMAGE */}
                <img
                  src={u?.profilePic || UserLogo}
                  alt="user"
                  className='w-12 h-12 rounded-full object-cover border'
                />

                {/* USER INFO */}
                <div>
                  <h2 className='font-semibold'>
                    {u.firstName} {u.lastName}
                  </h2>
                  <p className='text-sm text-gray-600'>{u.email}</p>
                </div>

              </div>

              {/* ACTION BUTTONS */}
              <div className='flex gap-3 mt-3'>
                <Button
                  onClick={() => navigate(`/dashboard/users/${u._id}`)}
                  variant='outline'
                >
                  <Edit size={16} className="mr-1" />
                  Edit
                </Button>

                <Button
                  onClick={() => navigate(`/dashboard/orders/${u._id}`)}
                >
                  <Eye size={16} className="mr-1" />
                  Show Order
                </Button>
              </div>

            </div>
          ))
        }
      </div>

    </div>
  );
};

export default AdminUsers;