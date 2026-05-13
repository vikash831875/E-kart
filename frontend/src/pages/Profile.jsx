import React, { useRef, useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { setUser } from '@/redux/userSlice';
import axios from 'axios';
import { Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { userId } = useParams();

  const fileRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  const [updateUser, setUpdateUser] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNo: user?.phoneNo || "",
    address: user?.address || "",
    city: user?.city || "",
    zipCode: user?.zipCode || "",
    profilePic: user?.profilePic || "",
    role: user?.role || ""
  });

  const [file, setFile] = useState(null);

  // ================= FETCH ORDERS =================
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        const accessToken = localStorage.getItem("accessToken");

        const res = await axios.get(
          "http://localhost:8000/api/v1/order/my-orders",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch orders");
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
      setUpdateUser({
        ...updateUser,
        profilePic: URL.createObjectURL(selectedFile)
      });
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const accessToken = localStorage.getItem("accessToken");

      const formData = new FormData();

      formData.append("firstName", updateUser.firstName);
      formData.append("lastName", updateUser.lastName);
      formData.append("email", updateUser.email);
      formData.append("phoneNo", updateUser.phoneNo);
      formData.append("address", updateUser.address);
      formData.append("city", updateUser.city);
      formData.append("zipCode", updateUser.zipCode);

      if (file) {
        formData.append("profilePic", file);
      }

      const res = await axios.put(
        `http://localhost:8000/api/v1/user/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(res.data.user));
      }

    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8 px-4 flex flex-col items-center">

      <Tabs defaultValue="profile" className="w-full mt-10 max-w-4xl flex flex-col items-center">

        <TabsList className="grid grid-cols-2 w-[200px] mb-2 rounded-full bg-white shadow-sm border p-1">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="w-full">

          <div className="flex flex-col items-center mb-4">
            <h1 className="text-3xl font-bold">Update Profile</h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8 w-full max-w-3xl">

            {/* PROFILE PIC */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-36 w-36 border">
                <AvatarImage src={updateUser.profilePic} />
                <AvatarFallback>VK</AvatarFallback>
              </Avatar>

              <input
                type="file"
                ref={fileRef}
                hidden
                onChange={handleFileChange}
              />

              <Button
                className="bg-pink-500"
                type="button"
                onClick={() => fileRef.current.click()}
                disabled={loading}
              >
                Change Picture
              </Button>
            </div>

            {/* FORM */}
            <Card className="flex-1">
              <CardContent className="p-6 flex flex-col gap-4">

                <div className="grid grid-cols-2 gap-4">
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

                <Input name="email" value={updateUser.email} readOnly />

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

                {/* UPDATE BUTTON */}
                <Button
                  className="bg-pink-500"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Updating...
                    </span>
                  ) : (
                    "Update Profile"
                  )}
                </Button>

              </CardContent>
            </Card>

          </form>
        </TabsContent>

        {/* ORDERS TAB */}
        <TabsContent value="orders" className="w-full max-w-4xl">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold">My Orders</h2>
              <p className="text-gray-600 mt-2">Track and manage your orders</p>
            </div>

            {ordersLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin text-2xl">⏳</div>
                <p className="mt-2 text-gray-600">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white p-10 text-center rounded-lg shadow-sm">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h3>
                <p className="text-gray-500">When you place your first order, it will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order._id} className="overflow-hidden">
                    <CardHeader className="bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            {order.status === 'delivered' && <CheckCircle className="w-5 h-5 text-green-500" />}
                            {order.status === 'shipped' && <Truck className="w-5 h-5 text-blue-500" />}
                            {order.status === 'processing' && <Clock className="w-5 h-5 text-yellow-500" />}
                            {order.status === 'cancelled' && <XCircle className="w-5 h-5 text-red-500" />}
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-lg font-bold mt-1">₹{order.totalPrice.toFixed(2)}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Order Items */}
                        <div>
                          <h4 className="font-semibold mb-3">Items Ordered</h4>
                          <div className="space-y-3">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                <img
                                  src={item.productImg || '/placeholder-image.jpg'}
                                  alt={item.productName}
                                  className="w-16 h-16 object-cover rounded-md"
                                  onError={(e) => {
                                    e.target.src = '/placeholder-image.jpg';
                                  }}
                                />
                                <div className="flex-1">
                                  <h5 className="font-medium">{item.productName}</h5>
                                  <p className="text-sm text-gray-600">
                                    Quantity: {item.quantity} × ₹{item.productPrice.toFixed(2)}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold">
                                    ₹{(item.productPrice * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="border-t pt-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Subtotal</p>
                              <p className="font-medium">₹{(order.totalPrice - order.tax - order.shippingPrice).toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Tax</p>
                              <p className="font-medium">₹{order.tax.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Shipping</p>
                              <p className="font-medium">₹{order.shippingPrice.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Total</p>
                              <p className="font-bold">₹{order.totalPrice.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="border-t pt-4">
                          <h4 className="font-semibold mb-2">Shipping Address</h4>
                          <div className="text-sm text-gray-600">
                            <p>{order.shippingAddress.fullName}</p>
                            <p>{order.shippingAddress.address}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                            <p>{order.shippingAddress.country}</p>
                            <p>{order.shippingAddress.phone}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default Profile;