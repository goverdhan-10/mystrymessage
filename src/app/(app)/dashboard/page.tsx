'use client'
import { MessageCard } from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Message } from '@/model/User'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw, Copy, CheckCircle2 } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const DashboardPage = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const [isCopied, setIsCopied] = useState(false);
  
  const [baseUrl, setBaseUrl] = useState('');

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId))
  }

  const { data: session } = useSession()
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessages: false,
    },
  })

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessage || false)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error('Failed to fetch message settings', {
        description: axiosError.response?.data.message || "Please try again.",
      })
    }
    finally {
      setIsSwitchLoading(false);
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response.data.messages || [])
      if (refresh) {
        toast('Messages Refreshed', {
          description: "Showing latest messages.",
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error('Failed to fetch messages', {
        description: axiosError.response?.data.message || "Please try again later.",
      })
    }
    finally {
      setIsLoading(false)
    }
  }, [setMessages, setIsLoading])

  useEffect(() => {
    if (!session || !session.user) return

    if (typeof window !== 'undefined') {
      setBaseUrl(`${window.location.protocol}//${window.location.host}`);
    }

    fetchMessages()
    fetchAcceptMessage()

  }, [session, setValue, fetchAcceptMessage, fetchMessages])

  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', { acceptMessages: !acceptMessages })
      setValue('acceptMessages', !acceptMessages)
      toast.success(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error('Failed to update message settings', {
        description: axiosError.response?.data.message || "Please try again.",
      })
    } finally {
      setIsSwitchLoading(false);
    }
  }

  if (!session || !session.user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50 text-slate-800">
        <p className="text-xl">Please <a href="/sign-in" className="text-indigo-500 hover:underline">Login</a> to view your dashboard.</p>
      </div>
    );
  }

  const { username } = session.user as User;

  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    setIsCopied(true);
    toast.success('URL Copied!', {
      description: 'Your anonymous profile link has been copied to clipboard.',
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 p-6 bg-white rounded-xl shadow-lg w-full max-w-6xl text-slate-800">
        <h1 className="text-4xl font-extrabold mb-6 text-slate-800 tracking-tight">Your ShhBox Dashboard</h1>

        <div className="mb-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <h2 className="text-xl font-semibold mb-3 text-indigo-700">Share Your Anonymous Link</h2>
          <p className="text-slate-600 mb-4">This is your unique link. Share it to receive anonymous messages!</p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="flex-grow p-3 rounded-md border border-slate-200 bg-slate-50 text-slate-700 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200"
            />
            <Button
              onClick={copyToClipboard}
              className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-md shadow-sm transition-all duration-200 flex items-center gap-2 w-full sm:w-auto"
            >
              {isCopied ? (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Copy Link
                </>
              )}
            </Button>
          </div>
        </div>

        <Separator className="my-8 bg-slate-200" />

        <div className="mb-8 flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <Switch
              {...register('acceptMessages')}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
              className="data-[state=checked]:bg-indigo-500 data-[state=unchecked]:bg-slate-300"
            />
            <span className="text-lg font-medium text-slate-800">
              Accepting Messages: {isSwitchLoading ? 'Updating...' : (acceptMessages ? 'On' : 'Off')}
            </span>
          </div>
          <Button
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-all duration-200"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
            ) : (
              <RefreshCcw className="h-5 w-5 text-slate-500" />
            )}
          </Button>
        </div>

        <h2 className="text-3xl font-bold mb-6 text-slate-800">Your Messages</h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            <p className="ml-3 text-lg text-slate-600">Loading messages...</p>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {messages.length > 0 ? (
              messages.map((message) => (
                <MessageCard
                  key={message._id as string}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-xl text-slate-600 p-8 bg-slate-50 rounded-lg border border-slate-200">
                You haven't received any messages yet. Share your link!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage