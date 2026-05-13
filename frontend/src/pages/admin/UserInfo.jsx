import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import UserLogo from "../../assets/userlogo.jpg";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const UserInfo = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const fileRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const [updateUser, setUpdateUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    address: "",
    city: "",
    zipCode: "",
    profilePic: "",
    role: ""
  });

  // ================= FETCH USER =================
  const getUser = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const res = await axios.get(
        `http://localhost:8000/api/v1/user/get-user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (res.data.success) {
        const u = res.data.user;

        setUpdateUser({
          firstName: u.firstName || "",
          lastName: u.lastName || "",
          email: u.email || "",
          phoneNo: u.phoneNo || "",
          address: u.address || "",
          city: u.city || "",
          zipCode: u.zipCode || "",
          profilePic: u.profilePic || "",
          role: u.role || ""
        });
      }

    } catch (error) {
      console.log(error);
      toast.error("Failed to load user");
    }
  };

  useEffect(() => {
    if (id) getUser();
  }, [id]);

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    setUpdateUser({
      ...updateUser,
      [e.target.name]: e.target.value
    });
  };

  // ================= FILE CHANGE =================
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      setUpdateUser((prev) => ({
        ...prev,
        profilePic: URL.createObjectURL(selectedFile)
      }));
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const accessToken = localStorage.getItem("accessToken");

      const formData = new FormData();

      // normal fields
      formData.append("firstName", updateUser.firstName);
      formData.append("lastName", updateUser.lastName);
      formData.append("email", updateUser.email);
      formData.append("phoneNo", updateUser.phoneNo);
      formData.append("address", updateUser.address);
      formData.append("city", updateUser.city);
      formData.append("zipCode", updateUser.zipCode);
      formData.append("role", updateUser.role);

      // ✅ IMPORTANT FIX
      if (file) {
        formData.append("file", file); // 👈 MUST MATCH multer.single("file")
      }

      const res = await axios.put(
        `http://localhost:8000/api/v1/user/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (res.data.success) {
        toast.success("User updated successfully");
        navigate(-1);
      }

    } catch (error) {
      console.log(error);
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20 px-4 md:px-8 lg:pl-[260px]">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft />
          </Button>
          <h1 className="font-semibold text-xl md:text-2xl text-gray-800">
            Update User
          </h1>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">

          {/* PROFILE */}
          <div className="flex flex-col items-center gap-4 w-full lg:w-[30%]">
            <Avatar className="h-28 w-28 md:h-36 md:w-36 border">
              <AvatarImage src={updateUser.profilePic || UserLogo} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>

            <input
              type="file"
              ref={fileRef}
              hidden
              onChange={handleFileChange}
            />

            <Button
              type="button"
              onClick={() => fileRef.current.click()}
              disabled={loading}
              className="w-full"
            >
              Change Picture
            </Button>
          </div>

          {/* FORM CARD */}
          <Card className="flex-1">
            <CardContent className="p-6 flex flex-col gap-4">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="firstName"
                  value={updateUser.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                />
                <Input
                  name="lastName"
                  value={updateUser.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                />
              </div>

              <Input
                name="email"
                value={updateUser.email}
                readOnly
                className="bg-gray-100"
              />

              <Input
                name="phoneNo"
                value={updateUser.phoneNo}
                onChange={handleChange}
                placeholder="Phone Number"
              />

              <Input
                name="address"
                value={updateUser.address}
                onChange={handleChange}
                placeholder="Address"
              />

              <Input
                name="city"
                value={updateUser.city}
                onChange={handleChange}
                placeholder="City"
              />

              <Input
                name="zipCode"
                value={updateUser.zipCode}
                onChange={handleChange}
                placeholder="Zip Code"
              />

              {/* ROLE */}
              <select
                name="role"
                value={updateUser.role}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
              >
                <option value="">Select Role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <Button type="submit" disabled={loading} className="w-full mt-2">
                {loading ? "Updating..." : "Update User"}
              </Button>

            </CardContent>
          </Card>

        </form>

      </div>
    </div>
  );
};

export default UserInfo;