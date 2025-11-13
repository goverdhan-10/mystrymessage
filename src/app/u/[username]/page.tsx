'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';
import { toast } from 'sonner';

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast.success(response.data.message); // Use success toast
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error('Failed to Send Message', {
        description:
          axiosError.response?.data.message ?? 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-800 p-4">
      <div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-xl shadow-lg border border-slate-200">
        <h1 className="text-4xl font-extrabold mb-4 text-center text-slate-900">
          Send Anonymous Message
        </h1>
        <p className="text-center text-lg text-slate-600 mb-6">
          To <span className="font-semibold text-indigo-600">@{username}</span>
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 sr-only">Your Anonymous Message</FormLabel> {/* Added sr-only for accessibility */}
                  <FormControl>
                    <Textarea
                      placeholder="Write your anonymous message here..."
                      className="resize-y min-h-[120px] border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 text-slate-700"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              {isLoading ? (
                <Button disabled className="w-full px-6 py-3 bg-indigo-600 text-white rounded-md shadow-sm">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!messageContent || isLoading} // Disable if no content
                  className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-sm transition-all duration-200"
                >
                  Send Anonymous Message
                </Button>
              )}
            </div>
          </form>
        </Form>

        <Separator className="my-8 bg-slate-200" /> {/* Enhanced separator */}

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">Want Your Own ShhBox?</h2>
          <p className="mb-6 text-slate-600">Create your own anonymous message board and start receiving feedback!</p>
          <Link href={'/sign-up'}>
            <Button className="px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-full shadow-lg transition-all duration-200 text-lg">
              Create Your Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}