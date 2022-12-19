interface WeatherResponse {
    queryCost: number;
    latitude: number;
    longitude: number;
    resolvedAddress: string;
    address: string;
    timezone: string;
    tzoffset: number;
    days: Day[];
    stations?: Record<PropertyKey, Station>;
    currentConditions: Conditions & { precipprob: number };
}

interface Day extends Conditions {
    description: string;
    feelslikemax: number;
    feelslikemin: number;
    precipcover: number;
    precipprob: number;
    severerisk: number;
    tempmax: number;
    tempmin: number;
}

interface Station {
    distance: number;
    latitude: number;
    longitude: number;
    useCount: number;
    id: string;
    name: string;
    quality: number;
    contribution: number;
}

interface Conditions {
    cloudcover: number;
    conditions: string;
    datetime: string;
    datetimeEpoch: number;
    dew: number;
    feelslike: number;
    humidity: number;
    icon: string;
    moonphase: number;
    precip: number;
    preciptype?: string[] | null;
    pressure: number;
    snow: number;
    snowdepth?: number | null;
    solarenergy: number;
    solarradiation: number;
    source: string;
    stations: string[];
    sunrise: string;
    sunriseEpoch: number;
    sunset: string;
    sunsetEpoch: number;
    temp: number;
    uvindex: number;
    visibility: number;
    winddir: number;
    windgust?: number;
    windspeed: number;
}

export interface Query {
    location: string
}

interface SingleDayQuery extends Query {
    date: keyof typeof queryFor
}

interface RangeQuery extends Query {
    start: string
    end: string
}

const queryFor = {
    today: 'today',
    yesterday: 'yesterday',
    tomorrow: 'tomorrow',
    lastWeek: 'last7days',
    lastMonth: 'last30days',
    last24: 'last24hours',
    nextWeek: 'next7days',
    nextMonth: 'next30days',
    next24: 'next24hours'
}

export {
    type WeatherResponse,
    type Day,
    type Station,
    type SingleDayQuery,
    type RangeQuery,
    queryFor
}