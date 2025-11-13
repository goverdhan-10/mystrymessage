'use client'

import React from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
import { Message } from '@/model/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';

import { ApiResponse } from '@/types/ApiResponse';
import { toast } from 'sonner';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast.success(response.data.message);
      onMessageDelete(message._id as string); // <--- HERE IS THE FIX

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error('Failed to Delete Message', {
        description:
          axiosError.response?.data.message ?? 'An unexpected error occurred. Please try again.',
      });
    }
  };

  return (
    <Card className="bg-white border border-slate-200 shadow-md rounded-lg p-4 transition-all duration-300 hover:shadow-lg h-full flex flex-col">
      <CardHeader className="flex flex-col justify-between items-start pb-2">
        <div className="flex justify-between items-center w-full mb-2">
          <CardTitle className="text-lg font-semibold text-slate-800 flex-grow pr-4 break-words">
            {message.content}
          </CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant='destructive' 
                className="p-2 h-auto w-auto bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors duration-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white text-slate-800">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl font-bold text-slate-900">Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-700">
                  This action cannot be undone. This will permanently delete this message from your ShhBox.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-100 transition-colors duration-200">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteConfirm} 
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="text-xs text-slate-500 self-end pt-2">
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </div>
      </CardHeader>
      <CardContent className="flex-grow"></CardContent>
    </Card>
  );
}