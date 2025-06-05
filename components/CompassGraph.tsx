import { CSSProperties, useEffect, useState, useCallback } from 'react'
import styled, { css } from 'styled-components'

import { mapRange } from '../helpers'
import { useAppSelector } from '../reduxtk/app/hooks'

const CompassGraph = () => {
	const { selectedDayData } = useAppSelector((state) => state.weather)

	const mapPosition = useCallback(() => {
		if (!selectedDayData?.winddir) return 0
		const position = 45 * Math.round(selectedDayData?.winddir / 45)
		return position
	}, [selectedDayData?.winddir])

	if (!selectedDayData) return null

	return (
		<CompassGraphContainer>
			<Title>Wind speed</Title>
			<Circle direction={mapPosition()} thickness={6} color={'#69eaff'}>
				<WindSpeed>{selectedDayData.windspeed}</WindSpeed>
				<SpeedUnit>km/h</SpeedUnit>
				{[...Array(4)].map((e, i) => (
					<Line key={i} position={i + 1} thickness={6} />
				))}
				<Cardinal direction="north" thickness={6}>
					N
				</Cardinal>
				<Cardinal direction="east" thickness={6}>
					E
				</Cardinal>
				<Cardinal direction="south" thickness={6}>
					S
				</Cardinal>
				<Cardinal direction="west" thickness={6}>
					W
				</Cardinal>
			</Circle>
			{/* <input type="range" min={0} max={360} value={direction} onChange={(e) => setDirection(+e.target.value)} /> */}
		</CompassGraphContainer>
	)
}

export default CompassGraph

const Title = styled.span`
	&& {
		font-size: 0.9rem;
		font-weight: 500;
		margin-bottom: 13px;
	}
`

const CompassGraphContainer = styled.div`
	display: flex;
	flex-direction: column;
`

const SpeedUnit = styled.span`
	font-size: 0.7rem;
`

const WindSpeed = styled.span`
	font-size: 1.4rem;
`

interface CircleProps {
	direction: number
	thickness: number
	color: CSSProperties['color']
}

interface CardinalProps {
	direction: 'north' | 'east' | 'south' | 'west'
	thickness: number
}

const Cardinal = styled.span<CardinalProps>`
	position: absolute;
	line-height: 1;
	font-size: 10px;
	text-align: center;
	${({ direction, thickness }) => {
		const dirMap = {
			north: 'top',
			east: 'right',
			south: 'bottom',
			west: 'left'
		}
		return `${dirMap[direction]}: -${thickness*2}px`
	}}
`

const Circle = styled.div<CircleProps>`
	width: 95px;
	box-sizing: content-box;
	aspect-ratio: 1;
	display: flex;
	position: relative;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	margin: 0 12px 12px 0;
	/* &:before{
        content: "";
        position: absolute;
        height: 100%;
        width: 1px;
        background-color: red;
        inset: 0;
    } */

	&:before {
		content: '';
		position: absolute;
		border-radius: 50%;
		inset: 0;
		height: 95px;
		width: 95px;
		margin: auto;
		${({ direction, thickness, color }) => css`
			transform: rotate(${direction - 22.5}deg);
			background: conic-gradient(#000000 0deg, ${color} 0 45deg, #3b4662 0);//
			background-position: 70% 4%;
			-webkit-mask: radial-gradient(farthest-side, #0000 calc(99% - ${thickness}px), #000 calc(100% - ${thickness}px));
			mask: radial-gradient(farthest-side, #0000 calc(99% - ${thickness}px), #000 calc(100% - ${thickness}px));
		`}
	}
	&:after {
		content: '';
		position: absolute;
		overflow: hidden;

		box-sizing: border-box;
		${({ direction, thickness, color }) => css`
			//top: calc(50% - ${thickness + 2}px / 2);
			//height: ${thickness}px;
			border-left: 3px solid transparent;
			border-right: 3px solid transparent;
			border-bottom: ${thickness+2}px solid #3b4662;
			transform: rotate(${direction}deg) translateY(-45px);
		`}
	}
`

interface LineProps {
	position: number
	thickness: number
}

const Line = styled.span<LineProps>`
	position: absolute;
	background: transparent;
	width: 1px;
	height: 95px;
	z-index: 20;
	border: 0px solid #69eaff;
	${({ position, thickness }) => css`
		//bottom: ${Math.abs(position * 22.5 - 7.5 - 100)}%;
		//right: ${Math.abs(50 + position * 22.5 - 100)}%;
		/* &:nth-child(even) {
        background-color: red;
        display: none;
    }
    &:nth-child(odd) {
        background-color: #43ff43;
        bottom: ${Math.abs(position * 22.5 + 7.5 - 100)}%;
        right: ${Math.abs(50 + position * 22.5 - 7.5 - 100)}%;
    } */
		border-block-width: ${thickness}px;
		transform: rotate(${position * 45 - 22.5}deg);
	`}
`
