import icons from "../../../assets/weatherIcons";

interface WeatherResponse {
    queryCost: number;
    latitude: number;
    longitude: number;
    resolvedAddress: string;
    address: string;
    timezone: string;
    tzoffset: number;
    days: Day[];
    alerts: unknown[];
    stations?: Record<PropertyKey /* StationName */, Station>;
    currentConditions: Conditions & { precipprob: number };
    description?: string;
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

interface Day extends Conditions {
    description: string;
    feelslikemax: number;
    feelslikemin: number;
    hours: Hour[];
    precipcover: number;
    precipprob: number;
    severerisk: number;
    tempmax: number;
    tempmin: number;
}

type HourlyConditions = Omit<Conditions, 'moonphase' | 'sunrise' | 'sunriseEpoch' | 'sunset' | 'sunsetEpoch' | 'snow' | 'solarenergy' | 'stations'>;

interface Hour extends HourlyConditions{
    precipprob: number;
    preciptype?: string[] | null;
    severerisk: number;
    snow?: number | null;
    solarenergy?: number | null;
    solarradiation: number;
    source: string;
    stations?: string[] | null;
    windgust: number;
}

interface Conditions {
    cloudcover: number;
    conditions: string;
    datetime: string;
    datetimeEpoch: number;
    dew: number;
    feelslike: number;
    humidity: number;
    icon: keyof typeof icons; 
    moonphase: number;
    precip: number;
    preciptype?: string[] | null;
    pressure: number;
    snow: number;
    snowdepth?: number | null;
    solarenergy?: number | null;
    solarradiation: number;
    source: string;
    stations: string[] | null;
    sunrise: string;
    sunriseEpoch: number;
    sunset: string;
    sunsetEpoch: number;
    temp: number;
    uvindex: number;
    visibility: number;
    winddir: number;
    windgust?: number | null;
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

const getLast2Weeks = () => {
    const date = new Date()
    const today = date.toISOString().split('T')[0]
    const to = new Date(date.getFullYear(), date.getMonth(), date.getDate()-14).toISOString().split('T')[0]
    return to+'/'+today
}

const queryFor = {
    // today: 'today',
    // yesterday: 'yesterday',
    // tomorrow: 'tomorrow',
    // lastWeek: 'last7days',
    // lastMonth: 'last30days',
    //last24: 'last24hours',
    // nextWeek: 'next7days',
    // nextMonth: 'next30days',
    // next24: 'next24hours',
    next2Weeks: '',
    last2Weeks: getLast2Weeks()
}

export {
    type WeatherResponse,
    type Day,
    type Station,
    type SingleDayQuery,
    type RangeQuery,
    type Hour,
    queryFor
}

