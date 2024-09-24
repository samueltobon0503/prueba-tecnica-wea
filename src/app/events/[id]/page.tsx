"use client"; // Necesario para usar hooks de React

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
  organizer: string;
  contactEmail: string;
  contactPhone: string;
}

export default function EventDetails({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchEventDetails = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`https://api.worldeventaccess.com/api/Event/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setEvent({
            ...data,
            logo: `https://api.worldeventaccess.com/api/PublicEventLogo/${params.id}`,
          });
        } else {
          console.error('Error fetching event details');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchEventDetails();
  }, [params.id]);

  if (!event) return <div className="text-center">Cargando...</div>;

  return (
    <div className="container mx-auto p-6 max-w-4xl bg-white shadow-md rounded-lg">
      <div className="flex flex-col sm:flex-row items-center">
        <div className="sm:w-1/2 mb-4 sm:mb-0">
          <img
            src={event.logo}
            alt={event.name}
            className="w-full h-64 object-cover rounded-lg shadow-lg"
          />
        </div>
        <div className="sm:w-1/2 sm:pl-6">
          <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
          <p className="text-gray-700 mb-4">{event.description}</p>
          <p className="text-gray-600">
            <strong>Fecha de Inicio:</strong>{' '}
            {new Date(event.eventStartDate).toLocaleString()}
          </p>
          <p className="text-gray-600">
            <strong>Fecha de Fin:</strong>{' '}
            {new Date(event.eventEndDate).toLocaleString()}
          </p>
          <p className="text-gray-600">
            <strong>Dirección:</strong> {event.address}
          </p>
        </div>
      </div>

      <div className="mt-6 border-t pt-4">
        <h2 className="text-2xl font-bold mb-2">Detalles del Organizador</h2>
        <p className="text-gray-600">
          <strong>Organizador:</strong> {event.organizer}
        </p>
        <p className="text-gray-600">
          <strong>Correo de Contacto:</strong>{' '}
          <a href={`mailto:${event.contactEmail}`} className="text-blue-600 underline">
            {event.contactEmail}
          </a>
        </p>
        <p className="text-gray-600">
          <strong>Teléfono de Contacto:</strong>{' '}
          <a href={`tel:${event.contactPhone}`} className="text-blue-600 underline">
            {event.contactPhone}
          </a>
        </p>
      </div>

      <div className="mt-8">
        <button
          onClick={() => router.back()}
          className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-6 rounded-lg"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
