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

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

class AIService {
  private apiKey = 'sk-4bc8de3429e244eb98086553df2e584f';
  private baseUrl = 'https://api.deepseek.com/v1/chat/completions';

  // Parking data - synchronized with the main app
  private parkingZones: ParkingZone[] = [
    {
      id: "zone-1",
      name: "Piața Victoriei",
      address: "Piața Victoriei, Timișoara, Romania",
      totalSpots: 120,
      availableSpots: 0,
      coordinates: { lat: 45.7494, lng: 21.2272 },
      color: "#ef4444",
      description: "Central square with premium parking spots"
    },
    {
      id: "zone-2", 
      name: "Centrul Vechi",
      address: "Piața Unirii, Timișoara, Romania",
      totalSpots: 85,
      availableSpots: 2,
      coordinates: { lat: 45.7536, lng: 21.2251 },
      color: "#ef4444",
      description: "Historic center with limited access"
    },
    {
      id: "zone-3",
      name: "Bega Shopping Center",
      address: "Piața Consiliul Europei 2, Timișoara, Romania",
      totalSpots: 300,
      availableSpots: 156,
      coordinates: { lat: 45.7415, lng: 21.2398 },
      color: "#22c55e",
      description: "Large shopping center parking facility"
    },
    {
      id: "zone-4",
      name: "Universitate",
      address: "Bulevardul Vasile Pârvan 4, Timișoara, Romania",
      totalSpots: 75,
      availableSpots: 0,
      coordinates: { lat: 45.7472, lng: 21.2081 },
      color: "#ef4444",
      description: "University area with student parking"
    },
    {
      id: "zone-5",
      name: "Iulius Mall",
      address: "Strada Alexandru Odobescu 2, Timișoara, Romania",
      totalSpots: 450,
      availableSpots: 267,
      coordinates: { lat: 45.7308, lng: 21.2267 },
      color: "#22c55e",
      description: "Premium mall with multi-level parking"
    }
  ];

  private liveParkingSpots: ParkingSpot[] = [
    { id: "H1", isOccupied: false, orientation: 'horizontal', position: { x: 15, y: 20 } },
    { id: "H2", isOccupied: true, orientation: 'horizontal', position: { x: 35, y: 20 } },
    { id: "H3", isOccupied: false, orientation: 'horizontal', position: { x: 55, y: 20 } },
    { id: "H4", isOccupied: true, orientation: 'horizontal', position: { x: 75, y: 20 } },
    { id: "V1", isOccupied: false, orientation: 'diagonal', position: { x: 20, y: 80 } },
    { id: "V2", isOccupied: true, orientation: 'diagonal', position: { x: 35, y: 80 } },
    { id: "V3", isOccupied: false, orientation: 'diagonal', position: { x: 50, y: 80 } },
    { id: "V4", isOccupied: false, orientation: 'diagonal', position: { x: 65, y: 80 } },
  ];

  getParkingContext(): string {
    const totalSpots = this.parkingZones.reduce((sum, zone) => sum + zone.totalSpots, 0);
    const totalAvailable = this.parkingZones.reduce((sum, zone) => sum + zone.availableSpots, 0);
    const occupancyRate = ((totalSpots - totalAvailable) / totalSpots * 100).toFixed(1);

    const availableZones = this.parkingZones.filter(zone => zone.availableSpots > 0);
    const fullZones = this.parkingZones.filter(zone => zone.availableSpots === 0);

    const liveSpotsSummary = this.liveParkingSpots.reduce((acc, spot) => {
      acc.total++;
      if (!spot.isOccupied) acc.available++;
      return acc;
    }, { total: 0, available: 0 });

    return `
CURRENT PARKING SITUATION IN TIMIȘOARA:

OVERVIEW:
- Total parking spots: ${totalSpots}
- Currently available: ${totalAvailable}
- Occupancy rate: ${occupancyRate}%
- Time: ${new Date().toLocaleTimeString()}

PARKING ZONES STATUS:

AVAILABLE ZONES:
${availableZones.map(zone => 
  `• ${zone.name}: ${zone.availableSpots}/${zone.totalSpots} spots available
    Address: ${zone.address}
    Description: ${zone.description}
    Availability: ${zone.availableSpots > zone.totalSpots * 0.5 ? 'Good' : zone.availableSpots > zone.totalSpots * 0.2 ? 'Limited' : 'Almost Full'}
    Coordinates: ${zone.coordinates.lat}, ${zone.coordinates.lng}`
).join('\n')}

${fullZones.length > 0 ? `FULL ZONES:
${fullZones.map(zone => 
  `• ${zone.name}: 0/${zone.totalSpots} spots (FULL)
    Address: ${zone.address}
    Description: ${zone.description}`
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

Always be helpful, accurate, and provide actionable suggestions based on current availability.
`;
  }

  async sendMessage(messages: ChatMessage[]): Promise<string> {
    try {
      const systemMessage = {
        role: 'system' as const,
        content: this.getParkingContext()
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

  // Method to update parking data (called from main app when data changes)
  updateParkingData(zones: ParkingZone[], liveSpots?: ParkingSpot[]) {
    this.parkingZones = zones;
    if (liveSpots) {
      this.liveParkingSpots = liveSpots;
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
    const available = this.liveParkingSpots.filter(spot => !spot.isOccupied);
    const occupied = this.liveParkingSpots.filter(spot => spot.isOccupied);
    
    return {
      total: this.liveParkingSpots.length,
      available: available.length,
      occupied: occupied.length,
      availableSpots: available.map(spot => spot.id),
      occupiedSpots: occupied.map(spot => spot.id)
    };
  }
}

export const aiService = new AIService();
export type { ParkingZone, ParkingSpot, ChatMessage }; 