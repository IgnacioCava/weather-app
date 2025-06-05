import Image from 'next/image'
import * as React from 'react'
import day from '@assets/backgrounds/clear-day.jpg'
import night from '@assets/backgrounds/clear-night.jpg'
import styled from 'styled-components'
import { useAppSelector } from 'reduxtk/app/hooks'

export interface IBackgroundProps {
	time?: number
}

export function Background(props: IBackgroundProps) {
	const { weatherData } = useAppSelector((state) => state.weather)

	const [forceTime, setTime] = React.useState(night)

	React.useEffect(() => {
		const time = () => {
			if (!weatherData) return night
			const { datetime, sunrise, sunset } = weatherData.currentConditions
			if (datetime > sunrise && datetime < sunset) return day
			return night
		}
		setTime(time())
	}, [weatherData])
	if (!weatherData?.currentConditions) return null

	return (
		<BackgroundContainer>
			{/* <button onClick={() => setTime(forceTime === night ? day : night)}> Cycle </button> */}
			<BackgroundImage src={forceTime} alt="weather" fill priority />
		</BackgroundContainer>
	)
}
const BackgroundContainer = styled.div`
	background-color: #1e3459;
	height: 100% !important;
	width: 100% !important;
	position: fixed;
	top: 0;
	z-index: -1;
`
const BackgroundImage = styled(Image)`
	z-index: -1;
	object-position: top left;
	height: 150vh !important;
	width: 150vw !important;
	position: fixed !important;
`
