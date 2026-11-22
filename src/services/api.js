const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = {
  async getFeaturedEvent() {
    try {
      const res = await fetch(`${API_BASE}/events/featured`);
      const json = await res.json();
      return json.data;
    } catch {
      return {
        id: 'evt_001',
        title: 'SYNESCAPE SESSION III',
        sessionCode: 'UPCOMING EVENT / 001',
        dateText: 'SAT. DEC 12 2026',
        location: 'BELGRADE, RS',
        bannerUrl: '/banner.png',
        ticketUrl: 'https://synscape.ticket/session-3',
        isUpcoming: true
      };
    }
  },

  async getArtists() {
    try {
      const res = await fetch(`${API_BASE}/artists`);
      const json = await res.json();
      return json.data;
    } catch {
      return {
        djs: [
          { id: '1', name: 'SAJAAK', city: 'Belgrade', genre: 'Dark Techno' },
          { id: '2', name: 'LU/STT', city: 'Berlin', genre: 'Industrial' },
          { id: '3', name: 'VOUG', city: 'Vienna', genre: 'Hypnotic Groove' },
          { id: '4', name: 'BYEDOV', city: 'Belgrade', genre: 'Modular Live' }
        ],
        visualArtists: [
          { id: '5', name: 'YUKIYA', city: 'Tokyo', genre: 'Live Generative' },
          { id: '6', name: 'MANTRA', city: 'Belgrade', genre: 'Laser Installation' },
          { id: '7', name: 'SYNTHIA', city: 'London', genre: 'Audioreactive' },
          { id: '8', name: 'KINETIC', city: 'Amsterdam', genre: 'Scenography' }
        ]
      };
    }
  },

  async getSelectedArchive() {
    try {
      const res = await fetch(`${API_BASE}/archive/selected`);
      const json = await res.json();
      return json.data;
    } catch {
      return {
        id: 'arc_001',
        title: 'SYNESCAPE SESSION 001',
        sessionCode: 'SESSION 001',
        recordingDate: '01 Sept 2024',
        location: 'Belgrade / Mama Shelter Rooftop',
        videoUrl: '/LANDING.mp4',
        thumbnailUrl: '/banner.png',
        description: 'Recorded Live Performance'
      };
    }
  },

  async subscribeNewsletter(email) {
    const res = await fetch(`${API_BASE}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return res.json();
  }
};
