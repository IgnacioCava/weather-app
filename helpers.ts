import { Hour } from "./reduxtk/features/weather/types"

const rotateArray = (array: unknown[], steps: number) => {
    const start = array.slice(0,steps)
    const end = array.slice(steps).concat(start) 
    return end
}

interface ItimeTo12hr {
    date: string | number | Date,
    timeString?: string,
    options?: Intl.DateTimeFormatOptions
}

const timeTo12hr = ({date, timeString, options}: ItimeTo12hr) => {
    const newDate = new Date(date)
    if(timeString) {
        const hours = timeString.split(':').map(e => parseInt(e))
        newDate.setHours(...hours as [number, number, number])
    }
    const xd = new Date(newDate)
    .toLocaleTimeString('en-US', {hour12: true, ...options,}).toLowerCase()
    return xd
    // return new Date(date.toISOString().split('T')[0]+'T' + timeString + 'Z')
    // .toLocaleTimeString('en-US', {timeZone:'UTC', hour12:true, hour:'2-digit'}).toLowerCase()
}
        

const getDay = (date: Date, timeString: string, moveBy?: number) => 
    new Date(date.getFullYear(), date.getMonth(), date.getDate()+(moveBy || 0), ...timeString.split(':').map(e=>+e))
    .toLocaleDateString('en-US', {weekday: 'short'})+'.'

const mapRange = (value: number, x1: number, y1: number, x2: number, y2: number) => (value - x1) * (y2 - x2) / (y1 - x1) + x2 | 0;

const mapHours = (hours: Hour[], dawn: string, dusk: string) => {
    const temps = hours.map(hour => hour.temp)
    const maxTemp = Math.max(...temps)
    const minTemp = Math.min(...temps)
    const isImportant = (temp: number) => temp === maxTemp || temp === minTemp
    return hours.map((hour, i) => {
        const temp = hour.temp
        const height = mapRange(temp, minTemp, maxTemp, 35, 100)
        const step = !(i % 4)
        const different = (hours[i-1]?.temp) !== temp
        const important = isImportant(temp) && different
        const shouldDisplay = step && (different || !isImportant(temp)) || important
        const color = temp === maxTemp ? '#ff000094' : temp === minTemp ? '#0000ff94' : null
        const datetime = Number(hour.datetime)
        const cicleIcon: 'clear-day' | 'clear-night' | null = Number(dawn)+1 === datetime && "clear-day"
            || Number(dusk) === datetime && "clear-night"
            || null
        return {...hour, color, cicleIcon, shouldDisplay, height }
    })
}

export {
    rotateArray,
    timeTo12hr,
    getDay,
    mapRange,
    mapHours,
}

export type mapHoursType = ReturnType<typeof mapHours>
