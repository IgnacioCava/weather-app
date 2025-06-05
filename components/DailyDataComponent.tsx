import Icons from '../assets/weatherIcons/index'
import styled, { css } from 'styled-components'
import { Day } from '../reduxtk/features/weather/types'
import { selectDay } from '../reduxtk/features/weather/weatherSlice'
import { useAppDispatch, useAppSelector } from '../reduxtk/app/hooks'
import { Water } from '@assets/icons'
import { useRef, useState } from 'react'

interface DayProps {
	day: Day
	index: number
}

const DailyDataComponent = () => {
	const dispatch = useAppDispatch()

	const { weatherData, selectedDay } = useAppSelector((state) => state.weather)

	const [scrollIndex, setIndex] = useState(0)
	const [isScrolling, setIsScrolling] = useState(false)

	const dayList = useRef<HTMLDivElement>(null)

	const handleSelection = (index: number) => dispatch(selectDay(index))

	const scroll = (dir: 'left' | 'right') => {
		if (!dayList.current) return
		const e = dayList.current
		// For every scroll, we need to account for the `gap: 8px` between the cards at adjacent extremes of each page, 
		// so we scroll for an extra ±8px and add or subtract that amount from every calculation
		e.scrollBy({ left: (e.clientWidth + 8) * (dir === 'left' ? -1 : 1) })
		setIsScrolling(true)
		setTimeout(() => {
			setIsScrolling(false)
		}, 1000)
		if(dir === 'right' && e.scrollLeft + e.clientWidth*2 + 8 === e.scrollWidth) {
			return setIndex(2)
		}
		if(dir === 'left' && e.scrollLeft - e.clientWidth - 8 === 0) {
			return setIndex(0) 
		}
		setIndex(1)
	}

	if (!weatherData) return null
	return (
		<DailyDataContainer>
			<h1>Forecast for the next 2 weeks</h1>
			<DailyData ref={dayList}>
				{weatherData.days.map((day, index) => {
					const date = new Date(day.datetime)
					const WeatherIcon = Icons[day.icon]
					const selected = selectedDay !== null ? selectedDay === index : date.getDate() === new Date().getDate()
					return (
						<DayContainer selected={selected} onClick={() => handleSelection(index)} key={index}>
							<ThisDate>
								{date.toLocaleDateString('en-US', { weekday: 'short' })}. {date.getDate()}
							</ThisDate>
							<DateData>
								<WeatherIcon />
								<Temps>
									<p>{day.tempmax}° </p>
									<p>{day.tempmin}°</p>
								</Temps>
								<Conditions>
									<Condition>{day.conditions}</Condition>
									<Rain>
										<Water />
										{day.precipprob}%
									</Rain>
								</Conditions>
							</DateData>
						</DayContainer>
					)
				})}
			</DailyData>

			{scrollIndex !== 0 && <PageButton disabled={isScrolling} left onClick={() => scroll('left')} />}

			{scrollIndex !== 2 && <PageButton disabled={isScrolling} right onClick={() => scroll('right')} />}
		</DailyDataContainer>
	)
}

export default DailyDataComponent

interface ContainerProps {
	selected: boolean
}

interface PageButtonProps {
	left?: boolean
	right?: boolean
}

const PageButton = styled.button<PageButtonProps>`
	background-color: white;
	border-radius: 6px;
	border: 0;
	position: absolute;
	top: calc(50% + 8px);
	width: 20px;
	height: 40px;
	cursor: pointer;
	${(props) =>
		props.left
			? css`
					left: -20px;
					::after {
						right: 5px;
						rotate: 90deg;
					}
			  `
			: css`
					right: -20px;
					::after {
						left: 5px;
						rotate: -90deg;
					}
			  `}
	::after {
		content: '';
		position: absolute;
		//left: 5px;
		top: 16px;
		border-bottom: 0px solid black;
		border-top: 8px solid black;
		border-right: 6px solid transparent;
		border-left: 6px solid transparent;
		overflow: hidden;
		box-sizing: border-box;
	}
`

const Temps = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
	margin-left: 14px;
	p {
		font-size: 1.2rem;
		line-height: 1.2rem;
		margin: 0;
		margin-right: 5px;
	}
	p:first-of-type {
		font-weight: 500;
	}
	p:last-of-type {
		color: #bdbdbd;
	}
`

const Conditions = styled.div`
	flex-direction: column;
	gap: 10px;
	margin-left: auto;
	display: none;
	text-align: end;
	overflow: hidden;
	width: fit-content;
`

const Condition = styled.div`
	font-size: 0.8rem;
	font-weight: 400;
`

const Rain = styled.div`
	font-size: 0.8rem;
	svg {
		height: 0.6rem;
		margin-right: 4px;
	}
`

const DateData = styled.div`
	display: flex;
	flex-direction: row;
	> svg {
		min-width: 42px;
		height: 42px;
		min-height: 42px;
		aspect-ratio: 1;
	}
`

const DailyDataContainer = styled.section`
	display: flex;
	flex-direction: column;
	position: relative;
`

const DailyData = styled.div`
	overflow: hidden;
	width: calc(100% - 1px);
	display: flex;
	flex-direction: row;
	padding: 4px 0px 10px 0px;
	gap: 8px;
	scroll-behavior: smooth;

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

const ThisDate = styled.span`
	font-size: 0.8rem;
	font-weight: 400;
`

const DayContainer = styled.div<ContainerProps>`
	position: relative;
	background-color: rgba(255, 255, 255, 0.03);
	user-select: none;
	cursor: pointer;
	min-width: calc((100% - (7 * 8px)) / 8);
	width: calc((100% - (7 * 8px)) / 8);
	white-space: nowrap;
	border-radius: 6px;
	height: 100%;
	padding: 10px;
	gap: 5px;
	display: flex;
	flex-direction: column;
	font-size: 0.8rem;
	padding-bottom: 15px;
	transition-duration: 0.2s;
	transition-property: border background-color;
	&:hover {
		background-color: rgba(255, 255, 255, 0.05);
	}
	${({ selected }) =>
		selected &&
		css`
			background-color: rgba(255, 255, 255, 0.08) !important;
			min-width: calc((200% - (6 * 8px)) / 8);
			width: calc((200% - (6 * 8px)) / 8);
			${Conditions} {
				display: flex;
			}
			::after {
				content: '';
				position: absolute;
				/* height: 10px;
				width: 10px; */
				bottom: -10px;
				//background-color: red;
				left: 50%;
				transform: translateX(-50%);
				border-top: 10px solid rgba(255, 255, 255, 0.08);
				border-right: 7px solid transparent;
				border-left: 7px solid transparent;
				overflow: hidden;
				box-sizing: border-box;
			}
		`}
`
