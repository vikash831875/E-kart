import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from 'sonner'
import axios from 'axios'

const Signup = () => {

    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const navigate = useNavigate()

    const submitHandler = async (e) => {
        e.preventDefault()
        console.log(formData)

        try {
            setLoading(true)
            const res = await axios.post("http://localhost:8000/api/v1/user/register", formData, {
                headers:{
                    "Content-Type":"application/json"
                }
                })

                if(res.data.success){
                    toast.success(res.data.message)
                    navigate('/verify')
                    return;
                }

            } catch (error) {
                console.log(error);
                toast.error(error?.response?.data?.message || "Signup failed")
            }finally{
            setLoading(false)
        }
    }

    return (
        <div className='flex justify-center items-center min-h-screen bg-pink-100'>

            <Card className="w-full max-w-sm shadow-lg">

                {/* Header */}
                <CardHeader>
                    <CardTitle>Create your account</CardTitle>
                    <CardDescription>
                        Enter your details below to create your account
                    </CardDescription>
                </CardHeader>

                {/* Form Content */}
                <CardContent>
                    <form onSubmit={submitHandler}>

                        <div className="flex flex-col gap-4">

                            {/* First & Last Name */}
                            <div className="grid grid-cols-2 gap-4">

                                <div className="grid gap-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        placeholder="John"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        placeholder="Doe"
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                    />
                                </div>

                            </div>

                            {/* Email */}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Password */}
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>

                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col gap-2 mt-6">
                            <Button type="submit" className="w-full cursor-pointer bg-pink-600 hover:bg-pink-500" disabled={loading}>
                                {loading ? "Loading..." : "Sign Up"}
                            </Button>

                            <p className='text-gray-700 text-sm text-center'>
                                Already have an account?{" "}
                                <Link to={'/login'} className='text-pink-800 hover:underline'>
                                    Login
                                </Link>
                            </p>
                        </div>

                    </form>
                </CardContent>

                <CardFooter />

            </Card>

        </div>
    )
}

export default Signup