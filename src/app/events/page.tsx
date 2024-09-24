"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Event {
  id: string;
  name: string;
  description: string;
  eventStartDate: string;
  eventEndDate: string;
  address: string;
  logo: string;
}

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('https://api.worldeventaccess.com/api/Event', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();

          const eventsWithLogos = data.map((event: Event) => ({
            ...event,
            logo: `https://api.worldeventaccess.com/api/PublicEventLogo/${event.id}`,
          }));

          setEvents(eventsWithLogos); 
        } else {
          console.error('Error fetching events');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-black text-white p-4 rounded-md shadow-md mb-6">
        <h1 className="text-2xl font-bold">Lista de Eventos</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto max-w-7xl">
        {events.map(event => (
          <div key={event.id} className="border rounded-lg p-4 shadow-lg bg-white">
            <img
              src={event.logo}
              alt={event.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <h2 className="text-xl font-bold mt-2">{event.name}</h2>
            <p className="mt-1">{event.description}</p>
            <p className="text-gray-500 mt-1">Fecha: {new Date(event.eventStartDate).toLocaleDateString()}</p>
            <p className="text-gray-500 mt-1">Dirección: {event.address}</p>
            <button
              onClick={() => router.push(`/events/${event.id}`)}
              className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Ver Detalles
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
