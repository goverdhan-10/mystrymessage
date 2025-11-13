'use client';
import React, { useEffect, useState } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useDebounceCallback } from 'usehooks-ts';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedUsername = useDebounceCallback(setUsername, 300);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`);
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? 'Error checking username');
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      toast.success('Success', {
        description: response.data.message,
      });
      router.replace(`/verify/${username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error('Sign Up Failed', {
        description: axiosError.response?.data.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 text-slate-800 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg border border-slate-200">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">Join ShhBox</h1>
          <p className="text-slate-600">Sign Up to start your anonymous feedback journey</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700">Username</FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        placeholder="username"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          debouncedUsername(e.target.value);
                        }}
                        className="border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                      {isCheckingUsername && <Loader2 className="animate-spin h-4 w-4 text-indigo-500 mt-2" />}
                      {!isCheckingUsername && usernameMessage && (
                        <p
                          className={`text-sm mt-2 ${
                            usernameMessage === 'Username available' ? 'text-green-500' : 'text-red-500'
                          }`}
                        >
                          {usernameMessage}
                        </p>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700">Email</FormLabel>
                  <FormControl>
                    <div>
                      <Input placeholder="email" {...field} className="border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" />
                      <p className="text-sm text-slate-500 mt-1">We will send you a verification code</p>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700">Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} className="border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-sm transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please Wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-6">
          <p className="text-slate-600">
            Already a member?{' '}
            <Link href="/sign-in" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;