const API_KEY = process.env.NEXT_PUBLIC_API_KEY

const queryParams = (location: string, timeFrame?: string, unitGroup?: 'us' | 'uk' | 'metric') => 
    `${location}${timeFrame? '/'+timeFrame : ''}?unitGroup=${unitGroup || 'metric'}&key=${API_KEY}&contentType=json`

export {
    queryParams
}