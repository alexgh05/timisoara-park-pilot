import { useEffect } from 'react';
import { aiService } from '@/services/aiService';

interface ParkingZone {
  id: string;
  name: string;
  address: string;
  totalSpots: number;
  availableSpots: number;
  coordinates: { lat: number; lng: number };
  color: string;
  description: string;
}

interface ParkingSpot {
  id: string;
  isOccupied: boolean;
  orientation: 'horizontal' | 'vertical' | 'diagonal';
  position: { x: number; y: number };
}

export const useParkingSync = (
  parkingZones?: ParkingZone[], 
  liveSpots?: ParkingSpot[]
) => {
  useEffect(() => {
    if (parkingZones) {
      aiService.updateParkingData(parkingZones, liveSpots);
    }
  }, [parkingZones, liveSpots]);

  return {
    updateAIData: (zones: ParkingZone[], spots?: ParkingSpot[]) => {
      aiService.updateParkingData(zones, spots);
    }
  };
}; 