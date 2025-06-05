//import { data } from '../data'
import { useAppSelector } from '../reduxtk/app/hooks'
import Icons from '../assets/weatherIcons/index'
import styled from 'styled-components'
import LocationArrow from '../assets/icons/arrow.svg'
import DailyDataComponent from './DailyDataComponent'
import HourComponent from './HourComponent'
import { Day, Hour } from '../reduxtk/features/weather/types'
import { rotateArray, timeTo12hr } from '../helpers'
import { save } from '../reduxtk/features/weather/weatherSlice'
import { useEffect } from 'react'
import { useAppDispatch } from '../reduxtk/app/hooks'
import CircularProgressGraph from './CircularProgressGraph'
import CompassGraph from './CompassGraph'
import CurrentDayData from './CurrentDayData'
import DayDetails from './DayDetails'
import DayGraph from './DayGraph'
import Map from './Map'

const Content = () => {
	const { weatherData: data, hours, startOfDay, twilight, selectedDayData } = useAppSelector((state) => state.weather)
	// const  { data, isFetching, isError, isLoading, isSuccess, isUninitialized } = weatherData

	// return (
	//       isUninitialized         ? <div>Search something</div>
	//     : isError                 ? <div>Error</div>
	//     : isLoading || isFetching ? <div>Loading</div>
	//     : isSuccess               ? <div>{JSON.stringify(data)}</div>
	//     : null
	// )

	//     const prefLanguage = typeof window !== 'undefined' && navigator.languages[0];
	//     const hours = data.days[0].hours

	//     const twilight = {dawn: data.days[0].sunrise, dusk: data.days[0].sunset}

	//     const startOfDay = hours.findIndex(e=> e.datetime > twilight.dawn) - 1
	//     const correctHours = rotateArray(hours, startOfDay) as Hour[]

	if (data && hours) {
		return (
			<Container>
				<Header>
					<CurrentDayData />
					<Map />
				</Header>

				<DailyDataComponent />

				<HourComponent />

				<DayDetails />
			</Container>
		)
	}

	return null
}

export default Content

const Header = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 10px;
	width: 100%;
`

const Graphs = styled.section`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 15px 40px;
`

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
	max-width: 1300px;
	margin: auto;
	padding-inline: 30px;
	padding-top: 10px;

	> section {
		width: 100%;
		> h2 {
			margin-bottom: 0;
		}
		h1 {
			font-size: 1.4rem;
			margin-block: 1rem;
		}
	}
`
