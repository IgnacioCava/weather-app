import styled, { css } from 'styled-components'
import Icons from '../assets/weatherIcons/index'
import { timeTo12hr, getDay, mapRange } from '../helpers'
import { useAppSelector } from '../reduxtk/app/hooks'
import { useRef, useState } from 'react'
import { Tooltip, Label, YAxis, XAxis, Area, AreaChart, ResponsiveContainer, ReferenceLine } from 'recharts'
import useAnimationTimeout from '../hooks/useAnimationTimeout'
import { Water } from '@assets/icons'
import Image from 'next/image'

const HourGraph = () => {
	const { hours, currentDate: date, selectedDay, twilight } = useAppSelector((state) => state.weather)

	const { animation, prevHours, prevDate } = useAnimationTimeout({ deps: [selectedDay], ignoreFirstRender: true, hours, date, duration: 300 })

	const [hoveredHour, setHour] = useState<null | number>(null)

	const graphContainer = useRef<HTMLDivElement>(null)

	if (prevHours && prevDate && hours) {
		const Sunrise = Icons['clear-day']
		const Sunset = Icons['clear-night']
		const DetailIcon = hoveredHour !== null && Icons[hours[hoveredHour].icon]
		const date = new Date(prevDate)
		return (
			<Graph ref={graphContainer} onMouseLeave={() => setHour(null)}>
				{[...Array(24)].map((e, index) => {
					const currentHour = prevHours[index]
					if (currentHour) {
						const { datetimeEpoch, shouldDisplay, temp, datetime, color } = currentHour
						return (
							<SingleHourContainer key={datetimeEpoch} animate={animation} onMouseEnter={() => setHour(index)} onMouseLeave={() => setHour(null)}>
								<SingleHour bgColor={color} height={hours[index]?.height || 0} animate={animation}>
									<Temp shouldDisplay={shouldDisplay}>{temp | 0}°</Temp>
									{datetime === '00:00:00' && (
										<DayDivision>
											<span>{getDay(date, datetime)}</span>
											<span>{getDay(date, datetime, 1)}</span>
										</DayDivision>
									)}
								</SingleHour>
								<Time shouldDisplay={shouldDisplay}>{timeTo12hr({ date: datetimeEpoch, timeString: datetime, options: { hour: '2-digit' } })}</Time>
							</SingleHourContainer>
						)
					}
					return (
						<SingleHourContainer key={index} animate={animation}>
							<SingleHour height={hours[index]?.height || 0} animate={animation}></SingleHour>
							<Time shouldDisplay={false} />
						</SingleHourContainer>
					)
				})}

				<TwilightLine width={prevHours.length} animate={animation} dawn={parseInt(twilight.dawn) + 1} dusk={parseInt(twilight.dusk) + 1}>
					<Sunrise />
					<Sunset />
					<div />
				</TwilightLine>
				{hoveredHour !== null && (
					<HourTooltip index={hoveredHour}>
						<h2>
							{hours[hoveredHour].conditions} {DetailIcon && <DetailIcon />}{' '}
						</h2>
						<div>
							<span>{timeTo12hr({ date: hours[hoveredHour].datetimeEpoch, timeString: hours[hoveredHour].datetime, options: { hour: '2-digit' } })}</span> |
							<span>{hours[hoveredHour].temp} °C</span> |{' '}
							<span>
								<Water /> {hours[hoveredHour].precipprob} %
							</span>{' '}
						</div>
					</HourTooltip>
				)}
				{/* <HourTooltip index={0}>xddd ddddddddd dddddd</HourTooltip> */}
			</Graph>
		)
	}
	return null
}

export default HourGraph

interface HourTooltipProps {
	index: number | null
}

const HourTooltip = styled.div<HourTooltipProps>`
	position: absolute;
	height: fit-content;
	width: max-content;
	bottom: -6.5em;
	z-index: 10;
	background-color: #29345194;
	visibility: visible;
	left: calc(${(props) => props.index} / 24 * 100%);
	transform: translateX(calc(-50% + (100vw - 60px) / 24 / 2));
	transform-origin: right;
	padding: 5px;
	text-align: center;
	display: flex;
	gap: 10px;
	flex-direction: column;
	align-items: center;
	transition: left 0.1s;
	font-size: 0.9rem;
	h2 {
		margin: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 1.4em;
		gap: 5px;
		svg {
			height: 1.4em;
		}
	}
	> div {
		display: flex;
		flex-direction: row;
		gap: 5px;
		span {
			display: flex;
			gap: 5px;
			align-items: center;
			svg {
				height: 0.8rem;
			}
		}
	}
`

const DayDivision = styled.span`
	position: absolute;
	border-left: 1px solid grey;
	height: 100%;
	left: 0%;
	pointer-events: none;
	span {
		padding: 3px;
		position: absolute;
		bottom: 0;
	}
	span:first-child {
		right: -100%;
		padding-right: 5px;
	}
`

const Time = styled.span<{ shouldDisplay: boolean }>`
	height: 0.8rem;
	opacity: ${(props) => (props.shouldDisplay ? 1 : 0)};
	position: absolute;
	bottom: -0.8rem;
	pointer-events: none;
	transition: opacity 0.1s;
	&::before {
		content: '';
		position: absolute;
		height: 5px;
		width: 1px;
		left: 50%;
		transform: translateX(-50%);
		top: -5px;
		background-color: grey;
	}
`

const Temp = styled.span<{ shouldDisplay: boolean }>`
	height: 0.8rem;
	position: absolute;
	opacity: ${(props) => (props.shouldDisplay ? 1 : 0)};
	transition: opacity 0.1s;
	top: -1.2rem;
	width: 100%;
	text-align: center;
	pointer-events: none;
`

interface LineProps {
	width: number
	animate: string
	dawn: number
	dusk: number
}

const TwilightLine = styled.span<LineProps>`
	position: absolute;
	bottom: calc(100%);
	width: 100%;
	bottom: 18%;
	height: fit-content;
	transition: 0.3s;
	opacity: 1;
	pointer-events: none;
	> div {
		width: ${({ width }) => (width / 24) * 100}%;
		border-top: 1px dashed grey;
		transition: 0.3s;
	}
	svg {
		position: absolute;
		width: 30px;
		top: -15px;
		transition: 0.3s ease-out;
		${({ dawn, dusk }) => css`
			&:first-child {
				left: calc(${mapRange(dawn, 5, 24, 0, (19 / 24) * 100)}% + calc((41px - 30px) / 2));
			}
			&:nth-child(2) {
				left: calc(${mapRange(dusk, 5, 24, 0, (19 / 24) * 100)}% + calc((41px - 30px) / 2));
			}
		`}
	}
`

const HourContainer = styled.div`
	display: flex;
	flex-direction: column;
`

const Options = styled.nav`
	width: fit-content;
	align-self: flex-end;
`

const Graph = styled.div`
	display: flex;
	flex-direction: row;
	align-items: flex-end;
	position: relative;
	height: 150px;
	width: 100%;
	margin-block: 20px;
	transition: margin-bottom 0.2s;
	&:hover {
		${HourTooltip} {
			visibility: visible;
		}
		margin-bottom: 7em;
	}
	> .recharts-surface {
		width: 100%;
	}
`

interface SingleHourProps {
	height: number
	bgColor?: string | null
	animate: string
}

const SingleHour = styled.div<SingleHourProps>`
	display: flex;
	flex-direction: column;
	width: 100%;
	${({ height }) => css`
		height: ${height || 0}%;
		border-block: ${height ? `1px solid grey` : 'none'};
	`}
	background-color: ${({ bgColor, animate }) => (bgColor && animate === 'up' ? bgColor : '#29345194')};
	position: relative;
	transition: 0.3s height ease-in-out;
`

interface SingleHourContainerProps {
	animate: string
	index?: number
}

const SingleHourContainer = styled.div<SingleHourContainerProps>`
	white-space: nowrap;
	height: 100%;
	width: calc(100% / 24);
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	align-items: center;
	font-size: 0.75rem;
	transition: filter 0.1s linear;
	&:hover {
		filter: brightness(1.6) saturate(0.9);
		${Time}, ${Temp} {
			opacity: 1;
		}
	}
	span {
		transition: 0.2s;
	}
	${({ animate }) =>
		animate === 'down'
			? css`
					*:not(${SingleHour}) {
						//visibility: hidden;
						opacity: 0;
					}
			  `
			: css`
					${SingleHour} {
						//visibility: visible;
						opacity: 1;
					}
			  `}
	svg {
		position: absolute;
		height: 2rem;
		top: -1rem;
		z-index: 10;
		background: inherit;
	}
`
