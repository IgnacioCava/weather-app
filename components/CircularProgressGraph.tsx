import { CSSProperties, useState } from 'react'
import styled, { css } from 'styled-components'
import { useAppSelector } from '../reduxtk/app/hooks'

interface ICircularProgressGraphProps {
	type: 'precip' | 'humidity' | 'uvindex'
}

type InfoType = 'precip' | 'humidity' | 'uvindex'

const uvIntencity = (uvIndex: number) => {
	if (uvIndex < 3) return 'Low'
	if (uvIndex < 6) return 'Medium'
	if (uvIndex < 8) return 'High'
	if (uvIndex < 11) return 'Very high'
	return 'Extreme'
}

const percentage = (value: number, type: InfoType) => {
	if (type !== 'uvindex') return value
	return (value * 100) / 11
}

const title = (type: InfoType) => {
	if (type === 'precip') return 'Precipitations'
	if (type === 'humidity') return 'Humidity'
	if (type === 'uvindex') return 'UV Index'
}

const CircularProgressGraph = ({ type }: ICircularProgressGraphProps) => {
	const { selectedDayData } = useAppSelector((state) => state.weather)
	if (!selectedDayData) return null
	return (
		<CircularProgressGraphContainer>
			<Title>{title(type)}</Title>
			<OuterCircle percentage={percentage(selectedDayData[type] | 0, type)} thickness={6} color={'#69eaff'}>
				<div>
					{selectedDayData[type] | 0} {type !== 'uvindex' ? '%' : <span>{uvIntencity(selectedDayData.uvindex)}</span>}
				</div>
			</OuterCircle>
			{/* <input type="range" value={percentage} onChange={(e) => setPercentage(+e.target.value)} /> */}
		</CircularProgressGraphContainer>
	)
}

interface OuterCircleProps {
	percentage: number
	thickness: CSSProperties['borderWidth']
	color: CSSProperties['color']
}

const CircularProgressGraphContainer = styled.div`
	display: flex;
	flex-direction: column;
`

const Title = styled.span`
	&& {
		font-size: 0.9rem;
		font-weight: 500;
		margin-bottom: 10px;
	}
`

const OuterCircle = styled.div<OuterCircleProps>`
	width: 95px;
	aspect-ratio: 1;
	display: inline-grid;
	position: relative;
	place-content: center;
	overflow: hidden;

	> div {
		text-align: center;
		display: flex;
		flex-direction: column;
		line-height: 1.4rem;
		font-size: 1.4rem;
		> span {
			font-size: 0.7rem;
		}
	}

	&:before {
		content: '';
		position: absolute;
		border-radius: 50%;
		inset: 0;
		overflow: hidden;
		${({ percentage, thickness, color }) => css`
			background: radial-gradient(farthest-side, ${color} 98%, #0000) top / /*${thickness}px for rounded start*/ 0px ${thickness}px no-repeat, conic-gradient(${color} ${percentage}%, #3b4662 0);
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
		${({ percentage, thickness, color }) => css`
		inset: calc(50% - ${thickness}px / 2);
		background: ${color};

		transform: rotate(calc(${percentage} * 3.6deg)) translateY(calc(50% - 95px / 2));
	`}
	} */
`

export default CircularProgressGraph
