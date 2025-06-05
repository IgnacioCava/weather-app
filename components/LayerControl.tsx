import * as maptilersdk from '@maptiler/sdk'
import { cloneElement, useState } from 'react'
import styled from 'styled-components'

const Toggle = styled.div`
	position: absolute;
	height: fit-content;
	width: fit-content;
	left: 40%;
	> button {
		margin: 2px;
		text-transform: capitalize;
	}
`

const Controls = () => {
	return (
		<Toggle>
			<button>X</button>
			<button>Style</button>
		</Toggle>
	)
}

export class ColorRampLegendControl {
	private _options: any
	private _container: HTMLDivElement | null = null
	private _map: maptilersdk.Map | undefined

	constructor(options: any) {
		this._options = { ...options }
		this._container = document.createElement('div')
		this._container.classList.add('maplibregl-ctrl')
		this._container.classList.add('maplibregl-ctrl-color-ramp')
	}

	onAdd(map: maptilersdk.Map) {
		this._map = map
		const colorramp = this._options.colorRamp
		const canvas = colorramp.getCanvasStrip()
		canvas.style.height = '30px'
		canvas.style.width = '200px'
		canvas.style.border = '1px dashed #00000059'

		const bounds = colorramp.getBounds()

		const desc = document.createElement('div')
		desc.classList.add('color-ramp-label')
		desc.innerHTML = `(min: ${bounds.min}, max: ${bounds.max})`

		this._container!.appendChild(desc)
		this._container!.appendChild(canvas)
		return this._container!
	}

	onRemove() {
		if (!this._map || !this._container) {
			return
		}
		this._container.parentNode?.removeChild(this._container)
		this._map = undefined
		delete this._map
	}
}