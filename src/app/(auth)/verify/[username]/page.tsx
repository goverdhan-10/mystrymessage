'use client';
import { verifySchema } from '@/schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { toast } from 'sonner';
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'; // Import Loader2 icon

const VerifyAccount = () => {
  const router = useRouter()
  const params = useParams<{ username: string }>()
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const { isSubmitting } = form.formState; // Get form submission state

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params.username,
        code: data.code
      })
      toast.success("Success", {
        description: response.data.message
      })
      router.replace('/dashboard')
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error('Verification Failed', {
        description: axiosError.response?.data.message ?? 'An unexpected error occurred. Please try again.',
      });
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-slate-50 text-slate-800 p-4'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg border border-slate-200'>
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">Verify Your ShhBox Account</h1>
          <p className="text-slate-600">Enter the verification code sent to your email for @{params.username}</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700">Verification Code</FormLabel>
                  <Input 
                    {...field} 
                    className="border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 text-center text-lg tracking-widest" // Centered text, wider tracking
                    maxLength={6} // Assuming 6-digit OTP
                  />
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              disabled={isSubmitting} // Disable button during submission
              className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-sm transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Account'
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default VerifyAccount