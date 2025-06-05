import { useState } from 'react'
import styled, { css, CSSProperties } from 'styled-components'
import icons from '../assets/weatherIcons'
import { useAppSelector } from '../reduxtk/app/hooks'

const DayGraph = () => {
	const [percentage, setPercentage] = useState(0)

	const { selectedDayData, twilightData, twilight } = useAppSelector((state) => state.weather)

	const DayIcon = icons['clear-day']
	const NightIcon = icons['clear-night']

	return (
		<DayGraphContainer>
			<OuterCircle percentage={30} thickness={6} color={'#69eaff'} dawn={parseInt(twilight.dawn)} dusk={parseInt(twilight.dusk)}>
				<DayIcon />
				<Meridian />
				<NightIcon />
			</OuterCircle>
		</DayGraphContainer>
	)
}

export default DayGraph

const Meridian = styled.div`
	position: absolute;
	width: 120%;
	height: 50%;
	background: linear-gradient(#797979 0%, #494949 50%);
	top: 50%;
    left: -10%;
	border-radius: 0 0 100% 100%;
`

const DayGraphContainer = styled.div`
margin-top: 10px;`

interface OuterCircleProps {
	percentage: number
	thickness: CSSProperties['borderWidth']
	color: CSSProperties['color']
	dawn: number
	dusk: number
}

const OuterCircle = styled.div<OuterCircleProps>`
	width: 120px;
	aspect-ratio: 1;
	display: inline-grid;
	position: relative;
	place-content: center;
    margin: auto;
    display: flex;

	svg {
		width: 40px;
		height: 40px;
		position: absolute;

		${({ dusk, dawn }) => {
			return css`
				inset: calc(50% - 40px / 2);
				&:first-of-type {
					transform: rotate(calc(${(dawn / 24) * 100} * 3.6deg)) translateY(calc(-100% - 15px));
				}
				&:last-of-type {
					transform: rotate(calc(${(dusk / 24) * 100} * 3.6deg)) translateY(calc(-100% - 15px));
				}
			`
		}}
	}

	&:before {
		content: '';
		position: absolute;
		border-radius: 50%;
		inset: 0;
		overflow: hidden;
		${({ percentage, thickness, color }) => css`
			background: #3b4662;
			-webkit-mask: radial-gradient(farthest-side, #0000 calc(99% - ${thickness}px), #000 calc(100% - ${thickness}px));
			mask: radial-gradient(farthest-side, #0000 calc(99% - ${thickness}px), #000 calc(100% - ${thickness}px));
		`}
	}
	// for rounded end
	/* &:after {
		content: '';
		position: absolute;
		border-radius: 50%;
		overflow: hidden;
		${({ percentage, thickness, color, dusk, dawn }) => {
			const date = new Date().getHours()
			return css`
				inset: calc(50% - ${thickness}px / 2);
				background: ${color};

				transform: rotate(calc(${(dawn / 24) * 100} * 3.6deg)) translateY(calc(50% - 95px / 2));
			`
		}}
	} */
`
