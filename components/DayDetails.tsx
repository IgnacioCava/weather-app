import { useState } from 'react'
import CircularProgressGraph from './CircularProgressGraph'
import CompassGraph from './CompassGraph'
import { useAppSelector } from '../reduxtk/app/hooks'
import styled, { CSSProperties } from 'styled-components'
import { timeTo12hr } from '../helpers'
import Icons from '../assets/weatherIcons'
import css from 'styled-jsx/css'
import DayGraph from './DayGraph'

export default function DayDetails() {
	const { selectedDayData, twilightData, twilight } = useAppSelector((state) => state.weather)

	const NightIcon = Icons['clear-night']

	return (
		<DayDetailsContainer>
			<Title>Details</Title>
			<DayDetailsData>
				<DayDetailsSection>
					<div>
						<h2>Day</h2>
						<DayDescription>
							{selectedDayData?.description} The maximum temperature will be {selectedDayData?.tempmax}° C.
						</DayDescription>
					</div>
					<div>
						<h2>Night</h2>
						<DayDescription>
							It will be {twilightData.dusk?.conditions.toLowerCase()}. The minimum temperature will be {selectedDayData?.tempmin}° C.
						</DayDescription>
					</div>
				</DayDetailsSection>
				<DayDetailsSection>
					<div>
						<h2>Dawn</h2>
						<TwilightDescription>{twilightData.dawn?.datetime}</TwilightDescription>
					</div>
					<div>
						<h2>Dusk</h2>
						<TwilightDescription>{twilightData.dusk?.datetime}</TwilightDescription>
					</div>
				</DayDetailsSection>
				<DayDetailsSection>
					<div>
						<h2>Moon Phase</h2>
						<TwilightDescription>{twilightData.dawn?.datetime}</TwilightDescription>
						<NightIcon style={{height: 30}}/>
						phase: {selectedDayData?.moonphase}
					</div>
				</DayDetailsSection>
				{/* <DayDetailsSection>
					<DayGraph />
				</DayDetailsSection> */}
				<Graphs>
					<CircularProgressGraph type="precip" />
					<CircularProgressGraph type="humidity" />
					<CircularProgressGraph type="uvindex" />
					<CompassGraph />
				</Graphs>
			</DayDetailsData>
		</DayDetailsContainer>
	)
}

const Section = styled.div``

const Title = styled.h1`
	font-size: 1.4rem;
	margin-block: 1rem;
`

// const DayDetailsContainer = styled.section`
// 	display: grid;
// 	grid-template-columns: repeat(2, 1fr);
// 	gap: 15px 40px;
// `

const DayDetailsData = styled.div`
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 25px;
	> * {
		border-top: 1px solid grey;
	}
`

const DayDetailsContainer = styled.section`
	display: flex;
	flex-direction: column;
	padding-bottom: 20px;
`

const DayDetailsSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: 13px;
	padding-top: 10px;
	> div {
		> h2 {
			font-size: 0.9rem;
			font-weight: 500;
			margin-block: 0 4px;
		}
	}
`

const DayDescription = styled.p`
	font-size: 0.85rem;
	margin: 0;
`

const TwilightDescription = styled.span`
	font-size: 1.4rem;
`

const Graphs = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 15px 40px;
	padding-top: 10px;
`
