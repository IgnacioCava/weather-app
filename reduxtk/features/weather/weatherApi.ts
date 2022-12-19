import { fetchBaseQuery, retry, createApi } from '@reduxjs/toolkit/query/react'
import { WeatherResponse, SingleDayQuery, RangeQuery } from './types'
import { queryParams } from './helpers'

export const baseQuery = retry(fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL }), { maxRetries: 2 })

export const weatherApi = createApi({
    reducerPath: 'weatherApi',
    baseQuery,
    endpoints: (builder) => ({
        singleDate: builder.query<WeatherResponse, SingleDayQuery>({
            query: ({location, date}) => queryParams(location, date)
        }),
        dateRange: builder.query<WeatherResponse, RangeQuery>({
            query: ({location, start, end}) => queryParams(location, `${start}/${end}`),
        })
    })
})

export const { 
    useSingleDateQuery, 
    useLazySingleDateQuery, 
    useDateRangeQuery, 
    useLazyDateRangeQuery 
} = weatherApi