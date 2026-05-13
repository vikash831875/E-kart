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
import { useDispatch } from 'react-redux'
import { setUser } from '@/redux/userSlice'

const Login = () => {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const submitHandler = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)

            const res = await axios.post(
                "http://localhost:8000/api/v1/user/login",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )

            if (res.data.success) {
                toast.success(res.data.message)

                localStorage.setItem("accessToken", res.data.accessToken)
                dispatch(setUser(res.data.user))

                navigate('/', { replace: true })
            }

        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || "Login failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex justify-center items-center min-h-screen bg-pink-100'>

            <Card className="w-full max-w-sm shadow-lg">

                {/* Header */}
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email and password to login
                    </CardDescription>
                </CardHeader>

                {/* Form */}
                <CardContent>
                    <form onSubmit={submitHandler}>

                        <div className="flex flex-col gap-4">

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
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        to="/forgot-password"
                                        className="ml-auto text-sm hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
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
                            <Button
                                type="submit"
                                className="w-full bg-pink-600 hover:bg-pink-500"
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </Button>

                            <p className='text-gray-700 text-sm text-center'>
                                Don’t have an account?{" "}
                                <Link to="/signup" className='text-pink-800 hover:underline'>
                                    Sign Up
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

export default Login