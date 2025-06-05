import { Hour } from '../reduxtk/features/weather/types'
import styled from 'styled-components'
import Icons from '../assets/weatherIcons/index'
import { timeTo12hr } from '../helpers'
import { useAppSelector } from '../reduxtk/app/hooks'
import LocationArrow from '../assets/icons/arrow.svg'
import WaterDrop from '../assets/icons/water.svg'

const HourDetails = () => {
	const { hours, currentDate } = useAppSelector((state) => state.weather)

	if (hours && currentDate)
		return (
			<DetailsContainer>
				{hours.map((hour) => {
					const Icon = Icons[hour.icon]
					const date = new Date(hour.datetimeEpoch*1000)
					return (
						<Detail key={hour.datetime}>
							<Data>
								<Icon />
								<Temp>{hour.temp}°</Temp>
								<WeatherState>{hour.conditions}</WeatherState>
								<DewContainer>
									<WaterDrop />
									<span>{hour.dew} %</span>
								</DewContainer>
								<WindContainer>
									<StyledArrow deg={hour.winddir} /> <span>{hour.windspeed} km/h</span>
								</WindContainer>
							</Data>
							<Time>{timeTo12hr({date, options: {hour: '2-digit'}})}</Time>
						</Detail>
					)
				})}
			</DetailsContainer>
		)
	return null
}

export default HourDetails

const Data = styled.div`
	display: flex;
	flex-direction: column;
	padding: 12px;
	border-block: 1px solid grey;

	> svg {
		height: 42px;
		width: 42px;
	}
`

const Time = styled.span`
	padding: 6px 12px;
	font-size: .9rem;
	font-weight: 400;
`

const DewContainer = styled.div`
	height: 0.8rem;
	display: flex;
	font-size: 0.8rem;
	gap: 5px;
	margin-bottom: 8px;
	align-items: center;
	color: #bdbdbd;
	svg {
		height: 100%;
		fill: #bdbdbd;
	}
`

const WindContainer = styled.div`
	height: 0.8rem;
	font-size: 0.8rem;
	display: flex;
	gap: 5px;
	align-items: center;
	color: #bdbdbd;
	svg {
		padding-inline: 2px;
		fill: #bdbdbd;
	}
`

interface Props {
	deg: number
}

const Arrow = styled(LocationArrow)<Props>`
 	height: 0.6rem;
`

const StyledArrow = styled(Arrow).attrs(({deg}: Props) => ({
	style: {
		transform: `rotate(${deg}deg)`
	}
}))``

const WeatherState = styled.span`
	font-weight: 300;
	font-size: 0.8rem;
	margin-bottom: 20px;
`

const Temp = styled.span`
	font-size: 1.4rem;
`

const Detail = styled.div`
	display: flex;
	flex-direction: column;
	width: 120px;
	min-width: 120px;
	> svg {
		height: 42px;
		width: 42px;
	}
`

const DetailsContainer = styled.div`
	display: flex;
	flex-direction: row;
	overflow: auto;
	&::-webkit-scrollbar {
		visibility: hidden;
		height: 14px;
	}
	&:hover {
		&::-webkit-scrollbar {
			visibility: visible;
			height: 14px;
			background-color: #10103488;
			border-radius: 10px;
		}
		&::-webkit-scrollbar-thumb {
			border: 4px solid rgba(0, 0, 0, 0);
			background-color: #4848a0;
			background-clip: padding-box;
			border-radius: 10px;
		}
	}
`
