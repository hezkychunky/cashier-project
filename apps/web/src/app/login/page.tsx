'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/authContext';

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

export default function Login() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
    }),
    onSubmit: async (values) => {
      setError(null);
      try {
        const response = await fetch(`${BASEURL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }

        // Store token and user using useAuth()
        login(data.token, data.user);
      } catch (err: any) {
        setError(err.message);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              {...formik.getFieldProps('email')}
              className={`mt-1 w-full px-4 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                formik.touched.email && formik.errors.email
                  ? 'border-red-500'
                  : ''
              }`}
              placeholder="Enter your email"
              required
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm">{formik.errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              {...formik.getFieldProps('password')}
              className={`mt-1 w-full px-4 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                formik.touched.password && formik.errors.password
                  ? 'border-red-500'
                  : ''
              }`}
              placeholder="Enter your password"
              required
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm">{formik.errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-600 focus:outline-none focus:ring focus:ring-orange-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
