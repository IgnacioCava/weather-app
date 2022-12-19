import { createSlice } from "@reduxjs/toolkit";

interface WeatherState {
    value: number;
}

const initialState: WeatherState = {
    value: 0,
}

const weatherSlice = createSlice({
    name: 'weather',
    initialState,
    reducers: {
    }
})

//export const {} = weatherSlice.actions
export default weatherSlice.reducer