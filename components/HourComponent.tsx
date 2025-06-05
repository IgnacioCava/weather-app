import Icons from '../assets/weatherIcons/index'
import styled from 'styled-components'
import { Day, Hour } from '../reduxtk/features/weather/types'
import { useState } from 'react'
import HourGraph from './HourGraph'
import HourDetails from './HourDetails'

const HourComponent = () => {
	const [viewType, setType] = useState<'graph' | 'details'>('graph')

	return (
		<HourContainer>
				<Options id="hourlytype">
					{(['graph', 'details'] as (typeof viewType)[]).map((type) => (
						<button key={type} onClick={() => setType(type)} aria-labelledby="hourlytype">
							{type}
						</button>
					))}
				</Options>
			{viewType === 'graph' ? <HourGraph /> : <HourDetails />}

			{/* <Options id='selectedhours'>
                <button aria-labelledby='selectedhours' onClick={() => setSelectedHours('day')}>
                    Day
                </button>
                <button aria-labelledby='selectedhours' onClick={() => setSelectedHours('night')}>
                    Night
                </button>
            </Options> */}
		</HourContainer>
	)
}

export default HourComponent

const Title = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`

const DayDivision = styled.span`
	position: absolute;
	border-left: 1px solid grey;
	height: 100%;
	left: 0%;
	span {
		padding: 3px;
		position: absolute;
		bottom: 0;
	}
	span:last-child {
		right: -100%;
	}
`

const Time = styled.span`
	height: 1rem;
`

const Line = styled.span`
	position: absolute;
	border-top: 1px dashed grey;
	width: 100%;
	top: 50%;
`

const HourContainer = styled.section`
	display: flex;
	flex-direction: column;
	background-color: rgba(255, 255, 255, 0.08) !important;
	border-radius: 6px;
`

const Options = styled.nav`
	width: 100%;
	border-bottom: 1px solid rgba(255, 255, 255, 0.12);
	button {
		text-transform: capitalize;
		background-color: transparent;
		border: 0;
		height: 38px;
		margin-inline: 15px;
		cursor: pointer;
	}
`

const Graph = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-evenly;
	align-items: flex-end;
	position: relative;
	height: 200px;
	width: 100%;
`

interface SingleHourProps {
	height: number
}

const SingleHour = styled.div<SingleHourProps>`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: ${({ height }) => (height ? `calc(${height}%)` : '0%')};
	background-color: ${({ color }) => (color ? color : '#293451')};
	border-top: 1px solid grey;
	position: relative;
`

const SingleHourContainer = styled.div`
	white-space: nowrap;
	height: 100%;
	width: calc(100% / 24);
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	align-items: center;
	font-size: 0.75rem;
	svg {
		position: absolute;
		height: 2rem;
		top: calc(50% - 1rem);
		z-index: 10;
		background: inherit;
	}
`
