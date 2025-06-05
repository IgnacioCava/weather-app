import '@maptiler/sdk/dist/maptiler-sdk.css'

import * as maptilersdk from '@maptiler/sdk'
import { useCallback, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { TemperatureLayer, PrecipitationLayer, WindLayer, ColorRamp, TileLayer, ParticleLayer, RadarLayer } from '@maptiler/weather'
import { ColorRampCollection } from '@maptiler/sdk'
import { ColorRampLegendControl } from './LayerControl'
import LocationArrow from '../assets/icons/arrow.svg'
import { RgbaColor } from '@maptiler/weather'
import { useAppSelector } from 'reduxtk/app/hooks'

maptilersdk.config.apiKey = 'zHAeZM074IhDEdlkcwik'

const customColorRamp = new ColorRamp({
	stops: [
		{ value: -65, color: [49, 54, 149, 255] },
		{ value: -40, color: [69, 117, 180, 255] },
		{ value: -30, color: [116, 173, 209, 255] },
		{ value: -20, color: [171, 217, 233, 255] },
		{ value: -10, color: [224, 243, 248, 255] },
		{ value: 0, color: [255, 255, 255, 255] },
		{ value: 12, color: [255, 255, 191, 255] },
		{ value: 20, color: [254, 224, 144, 255] },
		{ value: 25, color: [253, 174, 97, 255] },
		{ value: 30, color: [244, 109, 67, 255] },
		{ value: 40, color: [215, 48, 39, 255] },
		{ value: 55, color: [165, 0, 38, 255] }
	]
})

interface WeatherLayer {
	layer: TemperatureLayer | PrecipitationLayer | WindLayer | null
	value: string
	units: string
}

const weatherLayers: Record<LayersType, WeatherLayer> = {
	temperature: {
		layer: null,
		value: 'value',
		units: '°C'
	},
	precipitation: {
		layer: null,
		value: 'value',
		units: 'mm'
	},
	wind: {
		layer: null,
		value: 'speedMetersPerSecond',
		units: 'km/h'
	}
}

const pauseAnim = <T extends TileLayer | ParticleLayer>(layer: T) => {
	layer.animate(0)
}

const playAnim = <T extends TileLayer | ParticleLayer>(layer: T) => {
	layer.animate(1000)
}

const updatePointerValue = (lngLat: maptilersdk.LngLat | null, layer: WeatherLayer['layer'], setValue: (value: number | null) => void, setWindDirection: (value: number | null) => void) => {
	if (!lngLat || !layer) return

	const value = layer.pickAt(lngLat.lng, lngLat.lat)
	if (!value) return setValue(null)
	if ('value' in value) setValue(value.value)
	if ('speedKilometersPerHour' in value) setValue(value.speedKilometersPerHour)
	if ('directionAngle' in value) setWindDirection(value.directionAngle)
	else setWindDirection(null)
}

type LayersType = 'precipitation' | 'temperature' | 'wind'

const Map = () => {
	const mapContainer = useRef<HTMLDivElement | null>(null)
	const map = useRef<maptilersdk.Map | null>(null)
	const [zoom] = useState(9)
	const [value, setValue] = useState<number | null>(null)
	const [windDirection, setWindDirection] = useState<number | null>(null)
	const [activeLayer, setActiveLayer] = useState<LayersType | null>(null)
	const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
	const [loaded, setLoaded] = useState(false)
	const { weatherData } = useAppSelector((state) => state.weather)

	const updatePointerValue = useCallback(
		(lngLat: maptilersdk.LngLat | null) => {
			if (!lngLat || !activeLayer) return
			const weatherLayer = weatherLayers[activeLayer]?.layer
			if (weatherLayer) {
				const value = weatherLayer.pickAt(lngLat.lng, lngLat.lat)
				if (!value) {
					return setValue(null)
				}
				if ('value' in value) setValue(value.value)
				if ('speedKilometersPerHour' in value) setValue(value.speedKilometersPerHour)
				if ('directionAngle' in value) setWindDirection(value.directionAngle)
				else setWindDirection(null)
			}
		},
		[activeLayer]
	)

	const changeWeatherLayer = useCallback(
		(type: LayersType | null) => {
			if (!map.current) return
			if (type === activeLayer) return

			if (activeLayer && map.current.getLayer(activeLayer)) {
				const activeWeatherLayer = weatherLayers[activeLayer]?.layer
				if (activeWeatherLayer) {
					map.current.setLayoutProperty(activeLayer, 'visibility', 'none')
					if (activeLayer === 'wind') map.current.setLayoutProperty('windbg', 'visibility', 'visible')
					pauseAnim(activeWeatherLayer)
				}
			}
			if (!type) return setActiveLayer(null)
			const weatherLayer = weatherLayers[type].layer // || createWeatherLayer(type)
			if (!weatherLayer) return
			if (map.current.getLayer(type)) {
				map.current.setLayoutProperty(type, 'visibility', 'visible')
				if (type === 'wind') {
					map.current.setLayoutProperty('windbg', 'visibility', 'none')
				}
				playAnim(weatherLayer)
			}
			setActiveLayer(type)
			return weatherLayer
		},
		[activeLayer]
	)

	useEffect(() => {
		if (map.current || !mapContainer.current) return

		const thismap = new maptilersdk.Map({
			container: mapContainer.current,
			style: maptilersdk.MapStyle.BACKDROP.DARK,
			zoom: zoom,
			geolocate: maptilersdk.GeolocationType.POINT,
			fullscreenControl: true,
			maxZoom: 12,
			language: 'auto',
			failIfMajorPerformanceCaveat: true,
			terrainExaggeration: 3,
			terrain: true
		})
		thismap.onLoadAsync().then((map) => {
			map.setPaintProperty('Water', 'fill-color', 'rgb(12, 73, 99)')

			const precipitationLayer = new PrecipitationLayer({ id: 'precipitation', smooth: false })

			const temperatureLayer = new TemperatureLayer({ id: 'temperature' })
			//rgb(255, 136, 0)
			const windLayer = new WindLayer({ id: 'wind', opacity: 0.5 })
			const windBackgroundLayer = new WindLayer({ id: 'windbg', opacity: 0 })
			Array.from([precipitationLayer, temperatureLayer, windLayer]).map((layer) => {
				map.addLayer(layer, 'Aeroway')
				if (layer.id !== 'windbg') {
					map.setLayoutProperty(layer.id, 'visibility', 'none')
					weatherLayers[layer.id as LayersType].layer = layer
				}
				// Only necessary on quick animations
				// layer.on('tick', () => {
				// 	updatePointerValue(pointerLngLat.current)
				// })
			})

			map.moveLayer('Hillshade', 'Aeroway')
			//changeWeatherLayer('temperature')
			setLoaded(true)
		})

		thismap.onReadyAsync().then(() => setLoaded(true))

		map.current = thismap
	}, [zoom, updatePointerValue, changeWeatherLayer])

	useEffect(() => {
		if (!map.current || !activeLayer) return

		// TODO: listeners are being added multiple times due to callback functions being reinstanciated, replace for a single instance

		map.current?.on('mousemove', (e) => {
			updatePointerValue(e.lngLat)
			setPosition(e.point)
		})

		map.current?.on('mouseover', (e) => {
			updatePointerValue(e.lngLat)
			setPosition(e.point)
		})

		map.current?.on('mouseout', () => {
			setValue(null)
		})

		map.current?.on('drag', (e) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const x = (e.originalEvent as any)?.layerX
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const y = (e.originalEvent as any)?.layerY
			setPosition({ x, y })
		})
	}, [activeLayer, updatePointerValue])

	useEffect(() => {
		if (!map.current || !weatherData) return
		const { latitude, longitude } = weatherData
		//map.current.panTo([longitude, latitude])
		map.current.jumpTo({center: [longitude, latitude], zoom: 8})
	}, [weatherData])
	//map.current?.panTo([22.9122, 43.175])

	return (
		<MapWrapper>
			<MapElement ref={mapContainer}>
				<Toggle>
					{(Object.keys(weatherLayers) as [LayersType]).map((key) => (
						<LayerButton selected={activeLayer === key} key={key} value={key} onClick={() => changeWeatherLayer(key)}>
							{key}
						</LayerButton>
					))}
					<LayerButton selected={activeLayer === null} key={null} value={''} onClick={() => changeWeatherLayer(null)}>
						None
					</LayerButton>
				</Toggle>
				{value !== null && activeLayer !== null && (
					<Pointer position={position}>
						{value?.toFixed(1)} {weatherLayers[activeLayer].units} {windDirection && <StyledArrow deg={windDirection} />}
					</Pointer>
				)}
			</MapElement>
		</MapWrapper>
	)
}

const MapElement = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	border-radius: 6px;
	overflow: hidden;
`

const MapWrapper = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
`

interface PointerProps {
	position: {
		x: number
		y: number
	} | null
}

const Pointer = styled.span.attrs(
	({ position }: PointerProps) =>
		position && {
			style: {
				top: position.y - 15,
				left: position.x + 20
			}
		}
)`
	transition: left top 0.1s;
	position: absolute;
	pointer-events: none;
	height: fit-content;
	width: max-content;
	background-color: #242424;
	font-size: 0.8rem;
	padding: 4px 6px;
	border-radius: 6px;
	display: flex;
	align-items: center;
	gap: 5px;
`

const Toggle = styled.div`
	position: absolute;
	height: fit-content;
	width: fit-content;
	display: flex;
	flex-direction: column;
	left: 0%;
`

interface LayerButton {
	selected: boolean
}

const LayerButton = styled.button<LayerButton>`
	pointer-events: all;
	z-index: 9999;
	margin: 2px;
	text-transform: capitalize;
	background-color: black;
	${(props) =>
		props.selected &&
		css`
			background-color: grey;
		`}
	border: 0;
	border-radius: 4px;
	padding: 3px 8px;
	cursor: pointer;
`

interface Props {
	deg: number
}

const Arrow = styled(LocationArrow)<Props>`
	height: 0.8rem;
`

const StyledArrow = styled(Arrow).attrs(({ deg }: Props) => ({
	style: {
		transform: `rotate(${deg}deg)`
	}
}))``

export default Map
