'use client';

import { Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json'; // Assuming this provides objects with title, content, received

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious, // Added for navigation
  CarouselNext,     // Added for navigation
} from '@/components/ui/carousel';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
        <section className="text-center mb-10 md:mb-16 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
            Uncover Truths, Stay Anonymous
          </h1>
          <p className="mt-4 md:mt-6 text-lg md:text-xl text-slate-700">
            ShhBox: Your secure space for genuine, unfiltered feedback. Identity remains a secret.
          </p>
        </section>

        <Carousel
          plugins={[Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })]} // Slower, interactive autoplay
          className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl"
        >
          <CarouselContent className="-ml-4">
            {messages.map((message, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3"> {/* Responsive items */}
                <div className="p-1">
                  <Card className="flex flex-col h-full bg-white border border-slate-200 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-indigo-700 text-xl font-semibold">
                        <Mail className="h-5 w-5 text-indigo-500" /> {message.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-between pt-2">
                      <p className="text-slate-700 text-base mb-4 line-clamp-3"> {/* Limit lines for consistency */}
                        {message.content}
                      </p>
                      <p className="text-xs text-slate-500 self-end">
                        {message.received}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-indigo-500 hover:bg-indigo-600 text-white" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-indigo-500 hover:bg-indigo-600 text-white" />
        </Carousel>
      </main>

      <footer className="text-center p-6 bg-white shadow-inner text-slate-700 border-t border-slate-200">
        © {new Date().getFullYear()} ShhBox. All rights reserved.
      </footer>
    </div>
  );
}