interface ParkingZone {
  id: string;
  name: string;
  street: string;
  number: string;
  city: string;
  country: string;
  totalSpots: number;
  availableSpots: number;
  coordinates?: { lat: number; lng: number };
  color: string;
  description: string;
}

interface ParkingSpot {
  id: string;
  isOccupied: boolean;
  orientation: 'horizontal' | 'vertical' | 'diagonal';
  position: { x: number; y: number };
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface APIResponse {
  address: string;
  numberOfSpots: number;
  availablePlaces?: number; // Available places from server
  latitude: number;
  longitude: number;
  type: string;
}

// Function to fetch parking zones from API
const fetchParkingZones = async (): Promise<APIResponse[]> => {
  try {
    const response = await fetch('/api/parking');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('AI Service - Raw API response:', data);
    return data;
  } catch (error) {
    console.error('Failed to fetch parking zones:', error);
    throw error;
  }
};

// Function to parse address and map API data to ParkingZone
const mapAPIDataToParkingZone = (apiData: APIResponse, index: number): ParkingZone => {
  // Parse address - try to extract street number and name
  const addressParts = apiData.address.split(' ');
  let street = '';
  let number = '';
  
  // Look for "Nr" pattern or try to find number at the end
  const nrIndex = addressParts.findIndex(part => part.toLowerCase().includes('nr'));
  if (nrIndex !== -1 && nrIndex + 1 < addressParts.length) {
    street = addressParts.slice(0, nrIndex).join(' ');
    number = addressParts[nrIndex + 1];
  } else {
    // Try to find a number at the end
    const lastPart = addressParts[addressParts.length - 1];
    if (/^\d+$/.test(lastPart)) {
      number = lastPart;
      street = addressParts.slice(0, -1).join(' ');
    } else {
      street = apiData.address;
      number = '1'; // Default number
    }
  }

  // Use actual available places from server, or default to numberOfSpots if not provided
  const availableSpots = apiData.availablePlaces !== undefined ? apiData.availablePlaces : apiData.numberOfSpots;
  
  // Set color based on type and availability
  const availabilityPercentage = (availableSpots / apiData.numberOfSpots) * 100;
  let colorHex = '#22c55e'; // Default green
  
  if (apiData.type === 'red' || availableSpots === 0) {
    colorHex = '#ef4444'; // Red
  } else if (apiData.type === 'yellow' || availabilityPercentage < 30) {
    colorHex = '#f59e0b'; // Yellow/Orange
  } else if (apiData.type === 'green' || availabilityPercentage >= 50) {
    colorHex = '#22c55e'; // Green
  }
  
  return {
    id: `api-zone-${index}`,
    name: street,
    street: street,
    number: number,
    city: 'Timișoara',
    country: 'Romania',
    totalSpots: apiData.numberOfSpots,
    availableSpots: availableSpots,
    coordinates: {
      lat: apiData.latitude,
      lng: apiData.longitude
    },
    color: colorHex,
    description: `${street} - ${availableSpots}/${apiData.numberOfSpots} spots available`
  };
};

class AIService {
  private apiKey = 'sk-4bc8de3429e244eb98086553df2e584f';
  private baseUrl = 'https://api.deepseek.com/v1/chat/completions';

  // Parking data - will be loaded from API
  private parkingZones: ParkingZone[] = [];
  private liveSpots: ParkingSpot[] = [];
  private isDataLoaded = false;

  // Load parking zones from API
  private async loadParkingZones() {
    if (this.isDataLoaded) return;
    
    try {
      const apiData = await fetchParkingZones();
      this.parkingZones = apiData.map((zone, index) => mapAPIDataToParkingZone(zone, index));
      this.isDataLoaded = true;
      console.log('AI Service loaded parking zones from API:', this.parkingZones);
    } catch (error) {
      console.error('AI Service: Error loading parking zones from API:', error);
      // Use fallback data
      this.parkingZones = [
        {
          id: "fallback-1",
          name: "Piața Victoriei",
          street: "Piața Victoriei",
          number: "1",
          city: "Timișoara",
          country: "Romania",
          totalSpots: 120,
          availableSpots: 0,
          coordinates: { lat: 45.7607, lng: 21.2268 },
          color: "#ef4444",
          description: "Central square with premium parking spots"
        }
      ];
      this.isDataLoaded = true;
    }
  }

  updateParkingData(zones: ParkingZone[], spots?: ParkingSpot[]) {
    this.parkingZones = zones;
    if (spots) {
      this.liveSpots = spots;
    }
  }

  async getParkingContext(): Promise<string> {
    // Ensure data is loaded from API
    await this.loadParkingZones();
    
    const totalSpots = this.parkingZones.reduce((sum, zone) => sum + zone.totalSpots, 0);
    const totalAvailable = this.parkingZones.reduce((sum, zone) => sum + zone.availableSpots, 0);
    const occupancyRate = Math.round(((totalSpots - totalAvailable) / totalSpots) * 100);
    
    const availableZones = this.parkingZones.filter(zone => zone.availableSpots > 0);
    const fullZones = this.parkingZones.filter(zone => zone.availableSpots === 0);
    
    const liveSpotsSummary = {
      total: this.liveSpots.length,
      available: this.liveSpots.filter(spot => !spot.isOccupied).length
    };

    return `
CURRENT PARKING SITUATION IN TIMIȘOARA (Real-time API data):

OVERVIEW:
- Total parking spots: ${totalSpots}
- Currently available: ${totalAvailable}
- Occupancy rate: ${occupancyRate}%
- Time: ${new Date().toLocaleTimeString()}
- Data source: Live API (/api/parking)

PARKING ZONES STATUS:

AVAILABLE ZONES:
${availableZones.map(zone => 
  `• ${zone.name}: ${zone.availableSpots}/${zone.totalSpots} spots available
    Address: ${zone.street} ${zone.number}, ${zone.city}, ${zone.country}
    Description: ${zone.description}
    Type: ${zone.color}
    Availability: ${zone.availableSpots > zone.totalSpots * 0.5 ? 'Good' : zone.availableSpots > zone.totalSpots * 0.2 ? 'Limited' : 'Almost Full'}
    Coordinates: ${zone.coordinates?.lat || 'N/A'}, ${zone.coordinates?.lng || 'N/A'}`
).join('\n')}

${fullZones.length > 0 ? `FULL ZONES:
${fullZones.map(zone => 
  `• ${zone.name}: 0/${zone.totalSpots} spots (FULL)
    Address: ${zone.street} ${zone.number}, ${zone.city}, ${zone.country}
    Description: ${zone.description}
    Type: ${zone.color}`
).join('\n')}` : ''}

LIVE PARKING ZONE DETAILS:
- Individual monitored spots: ${liveSpotsSummary.available}/${liveSpotsSummary.total} available
- Real-time sensor data from live zone
- Spots H1-H4 (horizontal), V1-V4 (diagonal parking)

BIKE SHARING ALTERNATIVES:
Multiple bike stations available throughout the city with electric and regular bikes.

You are a helpful parking assistant for Timișoara. Use this real-time data to:
1. Recommend best available parking zones
2. Suggest alternatives when zones are full
3. Provide walking/driving times and distances
4. Help with navigation using Google Maps integration
5. Explain parking regulations and payment methods
6. Suggest bike sharing or public transport when parking is limited

Always be helpful, accurate, and provide actionable suggestions based on current availability from the live API data.
`;
  }

  async sendMessage(messages: ChatMessage[]): Promise<string> {
    try {
      const systemMessage = {
        role: 'system' as const,
        content: await this.getParkingContext()
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [systemMessage, ...messages],
          temperature: 0.7,
          max_tokens: 500,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Sorry, I couldn\'t process your request.';
    } catch (error) {
      console.error('AI Service Error:', error);
      return 'I\'m having trouble connecting to the AI service. Please try again later.';
    }
  }

  // Get specific zone information
  getZoneInfo(zoneId: string): ParkingZone | null {
    return this.parkingZones.find(zone => zone.id === zoneId) || null;
  }

  // Get best available zones
  getBestAvailableZones(): ParkingZone[] {
    return this.parkingZones
      .filter(zone => zone.availableSpots > 0)
      .sort((a, b) => (b.availableSpots / b.totalSpots) - (a.availableSpots / a.totalSpots));
  }

  // Get live parking summary
  getLiveParkingSummary() {
    const available = this.liveSpots.filter(spot => !spot.isOccupied);
    const occupied = this.liveSpots.filter(spot => spot.isOccupied);
    
    return {
      total: this.liveSpots.length,
      available: available.length,
      occupied: occupied.length,
      availableSpots: available.map(spot => spot.id),
      occupiedSpots: occupied.map(spot => spot.id)
    };
  }
}

export const aiService = new AIService();
export type { ParkingZone, ParkingSpot, ChatMessage }; 