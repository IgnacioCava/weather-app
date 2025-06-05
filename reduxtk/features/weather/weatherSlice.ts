import { createSlice } from '@reduxjs/toolkit'
import { Day, Hour, WeatherResponse } from './types'
import { data } from '../../../data'
import { mapHours, mapHoursType, timeTo12hr } from '../../../helpers'

interface WeatherState {
	weatherData: WeatherResponse | null
	startOfDay: number | null
	currentDate: string | null
	hours: mapHoursType | null
	selectedDay: number | null
	selectedDayData: Day | null
	queryState: {
		isUninitialized: boolean
		isFetching: boolean
		isLoading: boolean
		isSuccess: boolean
		isError: boolean
		status: string
	}
	twilight: {
		dawn: string
		dusk: string
	}
	twilightData: {
		dawn: Hour | null
		dusk: Hour | null
	}
}

const initialState: WeatherState = {
	queryState: {
		isUninitialized: false,
		isFetching: false,
		isLoading: false,
		isSuccess: true,
		isError: false,
		status: 'success'
	},
	selectedDay: null,
	selectedDayData: null,
	weatherData: null,
	hours: null,
	startOfDay: null,
	currentDate: null,
	twilight: {
		dawn: '',
		dusk: ''
	},
	twilightData: {
		dawn: null,
		dusk: null
	}
}

const weatherSlice = createSlice({
	name: 'weather',
	initialState,
	reducers: {
		save(state, action) {
			const data = action.payload.data
			const day = data?.days[0]
			const nextDay = data?.days[1]
			const startOfDay = +day.sunrise.slice(0, 2)
			const startOfNextDay = +nextDay?.sunrise.slice(0, 2)
			const twilight = { dawn: day.sunrise, dusk: day.sunset }
			const hours = day.hours.slice(startOfDay).concat(nextDay?.hours.slice(0, startOfNextDay) || [])
			const queryState = { ...action.payload }
			delete queryState.data
			delete queryState.currentData

			state.queryState = queryState
			state.weatherData = data
			state.selectedDay = 0
			state.selectedDayData = day
			state.currentDate = day.datetime
			state.hours = mapHours(hours, day.sunrise, day.sunset)
			state.twilight = twilight
			const dawnHour = day.hours[parseInt(twilight.dawn)]
			const duskHour = day.hours[parseInt(twilight.dusk)]

			state.twilightData = {
				dawn: { ...dawnHour, datetime: timeTo12hr({ date: dawnHour.datetimeEpoch, timeString: twilight?.dawn, options: { hour: '2-digit', minute: '2-digit' } }) },
				dusk: { ...duskHour, datetime: timeTo12hr({ date: duskHour.datetimeEpoch, timeString: twilight?.dusk, options: { hour: '2-digit', minute: '2-digit' } }) }
			}
			state.startOfDay = startOfDay
		},
		selectDay(state, action) {
			if(!state.weatherData) return
			const data = state.weatherData
			const day = data.days[action.payload]
			const nextDay = data?.days[action.payload + 1]
			const startOfDay = +day.sunrise.slice(0, 2)
			const startOfNextDay = +nextDay?.sunrise.slice(0, 2)
			const twilight = { dawn: day.sunrise, dusk: day.sunset }
			const hours = day.hours.slice(startOfDay).concat(nextDay?.hours.slice(0, startOfNextDay) || [])

			state.hours = mapHours(hours, day.sunrise, day.sunset)
			state.twilight = twilight
			state.startOfDay = startOfDay
			state.selectedDay = action.payload

			const dawnHour = day.hours[parseInt(twilight.dawn)]
			const duskHour = day.hours[parseInt(twilight.dusk)]

			state.twilightData = {
				dawn: { ...dawnHour, datetime: timeTo12hr({ date: dawnHour.datetimeEpoch, timeString: twilight?.dawn, options: { hour: '2-digit', minute: '2-digit' } }) },
				dusk: { ...duskHour, datetime: timeTo12hr({ date: duskHour.datetimeEpoch, timeString: twilight?.dusk, options: { hour: '2-digit', minute: '2-digit' } }) }
			}
			state.selectedDayData = day
			state.currentDate = day.datetime
		}
		// setup (state) {
		//     const day: Day = state.data?.data.days[0]
		//     if(day) {
		//         const twilight = {dawn: day.sunrise, dusk: day.sunset}
		//         const startOfDay = day.hours.findIndex(hour => hour.datetime > state.twilight.dawn) -1
		//         state = {
		//             ...state,
		//             currentDate: new Date(day.hours[0].datetime),
		//             hours:day.hours,
		//             twilight,
		//             startOfDay,
		//         }
		//     }
		// }
	}
})

export const { save, selectDay } = weatherSlice.actions
export default weatherSlice.reducer
