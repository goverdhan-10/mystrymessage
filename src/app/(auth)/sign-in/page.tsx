'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInSchema } from '@/schemas/signInSchema';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react'; // Added Loader2 for loading state

export default function SignInForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const { isSubmitting } = form.formState; // Get submitting state

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast.error('Login Failed', {
          description: 'Incorrect username or password. Please check your credentials.',
        });
      } else {
        toast.error('Login Failed', { // Changed to error toast for consistency
          description: result.error,
        });
      }
    }

    if (result?.url) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 text-slate-800 p-4"> {/* Consistent background and text color */}
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg border border-slate-200"> {/* Enhanced container styling */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4"> {/* Updated text color and spacing */}
            Welcome Back to ShhBox
          </h1>
          <p className="text-slate-600">Sign in to manage your anonymous messages</p> {/* Updated text color and message */}
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700">Email/Username</FormLabel> {/* Label color */}
                  <Input {...field} className="border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" /> {/* Input styling */}
                  <FormMessage className="text-red-500" /> {/* Message color */}
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700">Password</FormLabel> {/* Label color */}
                  <Input type="password" {...field} className="border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" /> {/* Input styling */}
                  <FormMessage className="text-red-500" /> {/* Message color */}
                </FormItem>
              )}
            />
            <Button 
              className='w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-sm transition-all duration-200' 
              type="submit"
              disabled={isSubmitting} // Disable button during submission
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-6"> {/* Increased top margin */}
          <p className="text-slate-600">
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"> {/* Link styling */}
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}