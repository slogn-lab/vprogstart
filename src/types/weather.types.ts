export interface WeatherData {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg?: number;
  };
  name?: string;
}

export interface ForecastData {
  list: WeatherData[];
  city?: {
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
  };
}

export interface AirPollutionData {
  list: Array<{
    main: {
      aqi: number;
    };
    components: {
      co: number;
      no: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      nh3: number;
    };
  }>;
}

export interface Coordinates {
  lat: number;
  lon: number;
  name?: string;
}