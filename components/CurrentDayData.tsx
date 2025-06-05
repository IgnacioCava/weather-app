import * as React from 'react'
import { useAppSelector } from '../reduxtk/app/hooks'
import styled from 'styled-components'
import LocationArrow from '../assets/icons/arrow.svg'
import { timeTo12hr } from '../helpers'
import icons from '../assets/weatherIcons'
import day from '@assets/backgrounds/clear-day.jpg'
import night from '@assets/backgrounds/clear-night.jpg'

const DetailItem = ({ title, value, unit, SVG }: { title: string; value: number; unit: string; SVG?: React.ReactElement }) => {
	return (
		<DetailItemContainer>
			<DetailTitle>{title}</DetailTitle>
			<div>
				<span>
					{value | 0} {unit}
				</span>
				{SVG}
			</div>
		</DetailItemContainer>
	)
}

const DetailTitle = styled.span`
	opacity: 0.8;
	line-height: 16px;
`

const DetailItemContainer = styled.div`
	display: flex;
	flex-direction: column;
	font-size: 0.8rem;
	font-weight: 300;
	> div {
		display: flex;
		font-size: 1rem;
		gap: 5px;
		line-height: 1.4rem;
		align-items: baseline;
		> svg {
			height: 0.8rem;
		}
	}
`

export default function CurrentDayData() {
	const { weatherData } = useAppSelector((state) => state.weather)

	if (!weatherData) return null
	const { feelslike, winddir, windspeed, visibility, pressure, humidity, dew, temp, conditions, datetime, icon, datetimeEpoch } = weatherData.currentConditions

	const WeatherIcon = icons[icon]

	return (
		<CurrentDayDataContainer>
			<Direction>
				<Address>{weatherData.resolvedAddress}</Address>
				<LastUpdate>Last updated at {timeTo12hr({ date: datetimeEpoch, timeString: datetime, options: { hour: '2-digit', minute: '2-digit' } })}</LastUpdate>
			</Direction>
			<TopData>
				<WIcon>
					<WeatherIcon /> {temp | 0}
					<span>° C</span>
				</WIcon>
				<Temp>
					<Condition>{conditions}</Condition>
					<Feels>
						Feels like <span>{feelslike}°</span>
					</Feels>
				</Temp>
			</TopData>
			<Description>
				{weatherData?.days[0]?.description} The maximum temperature will be {weatherData?.days[0].tempmax | 0}° C.
			</Description>
			<DetailContainer>
				<DetailItem title="Wind" value={windspeed} unit="km/h" SVG={<Arrow deg={winddir} />} />
				<DetailItem title="Hummidity" value={humidity} unit="%" />
				<DetailItem title="Visibility" value={visibility} unit="km" />
				<DetailItem title="Pressure" value={pressure} unit="mbar" />
				<DetailItem title="Dew point" value={dew} unit="°" />
			</DetailContainer>
		</CurrentDayDataContainer>
	)
}

const Description = styled.div`
	font-size: 0.9rem;
	font-weight: 300;
	margin-block: 25px;
`

const Direction = styled.div`
	display: flex;
	flex-direction: column;
`

const Address = styled.span`
	font-size: 0.9rem;
	font-weight: 400;
`

const LastUpdate = styled.span`
	font-size: 0.7rem;
	color: #d5d6d8;
`

const WIcon = styled.div`
	display: flex;
	flex-direction: row;
	font-size: 4rem;
	font-weight: 300;
	line-height: 1;
	> svg {
		height: 4rem;
		margin: auto;
		margin-right: 20px;
	}
	> span {
		font-size: 2rem;
		font-weight: 400;
		line-height: 1.5;
	}
`

const Feels = styled.span`
	font-size: 14px;
	line-height: 16px;
	color: #d5d6d8;
	margin-right: 12px;
	> span {
		color: initial;
		font-size: 14px;
		line-height: 22px;
	}
`

const CurrentDayDataContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
	align-items: flex-start;
	padding: 16px;
	border-radius: 6px;
	background-color: #1414146e;
`

const Temp = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	justify-content: space-evenly;
`

interface Props {
	deg: number
}

const Condition = styled.span`
	&& {
		font-size: 1.1rem;
		font-weight: 500;
		line-height: 1rem;
	}
`

const Arrow = styled(LocationArrow)<Props>`
	transform: rotate(${({ deg }) => deg}deg);
`

const DetailContainer = styled.div`
	display: flex;
	justify-content: space-between;
	width: fit-content;
	width: 100%;
	gap: 5px 20px;
	font-size: 0.7rem;
	line-height: 1rem;
	span {
		display: flex;
		gap: 5px;
		svg {
			width: 0.7rem;
		}
	}
`

const TopData = styled.span`
	display: flex;
	align-items: center;
	gap: 32px;
`
