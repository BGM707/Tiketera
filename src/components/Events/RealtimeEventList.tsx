import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, Zap } from 'lucide-react';
import { useEvents, useRealtimeEvents } from '../../hooks/useEvents';
import { EventCard } from './EventCard';
import { Event } from '../../types';

interface RealtimeEventListProps {
  filters?: {
    category?: string;
    status?: string;
    limit?: number;
  };
  showRealTimeIndicator?: boolean;
}

export function RealtimeEventList({ filters, showRealTimeIndicator = true }: RealtimeEventListProps) {
  const { data: events, isLoading, error } = useEvents(filters);
  const realtimeEvents = useRealtimeEvents();
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    if (realtimeEvents.length > 0) {
      setLastUpdate(new Date());
    }
  }, [realtimeEvents]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
            <div className="w-full h-48 bg-gray-300"></div>
            <div className="p-6">
              <div className="h-6 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-4"></div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Error al cargar eventos</h3>
        <p className="text-gray-600 mb-4">
          No pudimos cargar los eventos. Por favor, intenta nuevamente.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No hay eventos disponibles</h3>
        <p className="text-gray-600">
          No encontramos eventos que coincidan con tus criterios de búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Real-time indicator */}
      {showRealTimeIndicator && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Zap className="w-4 h-4 mr-1 text-green-600" />
                  Actualizaciones en Tiempo Real
                </h4>
                <p className="text-sm text-gray-600">
                  Los eventos se actualizan automáticamente
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">
                Última actualización
              </p>
              <p className="text-sm font-medium text-gray-900">
                {lastUpdate.toLocaleTimeString('es-CL')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Events grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event: Event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {events.length}
            </div>
            <div className="text-sm text-gray-600">Eventos Disponibles</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600 mb-1">
              {events.filter((e: Event) => e.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Activos</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {new Set(events.map((e: Event) => e.category)).size}
            </div>
            <div className="text-sm text-gray-600">Categorías</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {new Set(events.map((e: Event) => e.venue_city)).size}
            </div>
            <div className="text-sm text-gray-600">Ciudades</div>
          </div>
        </div>
      </div>
    </div>
  );
}