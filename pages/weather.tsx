import { FormEventHandler, useEffect, useState } from 'react'
import { SingleDayQuery } from '../reduxtk/features/weather/types'
import Content from '../components/Content'
import useFetch from '../hooks/useFetch'
import { useAppDispatch, useAppSelector } from '../reduxtk/app/hooks'
import SelectSingleDate from '../components/SelectSingleDate'
import Search from '../components/Search'
import { save } from '../reduxtk/features/weather/weatherSlice'
import DayGraph from '../components/DayGraph'
import styled from 'styled-components'
import a from '@assets/backgrounds/clear-day.jpg'
import Image from 'next/image'
import { Background } from 'components/Background'
import day from '@assets/backgrounds/clear-day.jpg'
import night from '@assets/backgrounds/clear-night.jpg'

const Weather = () => {
	// const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
	// 	event.preventDefault()
	// 	const location = (event.currentTarget[0] as HTMLInputElement).value
	// 	const date = (event.currentTarget[1] as HTMLSelectElement).value as SingleDayQuery['date']
	// 	triggerSingle({ location, date })
	// }
	return (
		<WeatherContainer>
			{/* <form onSubmit={handleSubmit}>
				<input type="text" placeholder="type a location" />
				<SelectSingleDate />
				<button type="submit">search</button>
			</form> */}
			<Background />
			<Search />
			<Content />
			{/* <DayGraph /> */}
		</WeatherContainer>
	)
}

const WeatherContainer = styled.div`
	position: relative;
	padding-top: 10px;
	overflow: hidden;
`

// const Background = styled.div`
// 	background-image: url('${a.src}');
// `

export default Weather
