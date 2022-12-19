import { configureStore } from '@reduxjs/toolkit'
import weatherReducer from'../../reduxtk/features/weather/weatherSlice'
import { weatherApi } from '../../reduxtk/features/weather/weatherApi'

export const store = configureStore({
	reducer: {
		weather: weatherReducer,
		[weatherApi.reducerPath]: weatherApi.reducer
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(weatherApi.middleware)
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
