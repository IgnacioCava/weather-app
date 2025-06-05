import SelectSingleDate from './SelectSingleDate'
import useFetch from '../hooks/useFetch'
import { FormEventHandler, useEffect } from 'react'
import { SingleDayQuery } from '../reduxtk/features/weather/types'
import styled from 'styled-components'
import MagnifyingGlass from '../assets/icons/magGlass.svg'

const Search = () => {
	const { fetchSingle } = useFetch()

	const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault()
		const location = (event.currentTarget[0] as HTMLInputElement).value
		const date = (event.currentTarget[1] as HTMLSelectElement).value as SingleDayQuery['date']
		if (!location) return
		fetchSingle({ location, date })
	}
	useEffect(() => {
		const success: PositionCallback = (pos) => {
			fetchSingle({ location: `${pos.coords.latitude},${pos.coords.longitude}`, date: '' as SingleDayQuery['date'] })
		}
		if (navigator) navigator?.geolocation.getCurrentPosition(success)
	}, [])

	return (
		<nav>
			<Form onSubmit={handleSubmit}>
				<SearchInput type="text" placeholder="Search" />
				<Date>
					for the <SelectSingleDate /> two weeks
				</Date>
				<button type="submit">
					<Mag />
				</button>
			</Form>
		</nav>
	)
}

export default Search

const Date = styled.span`
	display: flex;
	align-items: baseline;
	gap: 3px;
`

const SearchInput = styled.input`
	outline: none;
	border: none;
	appearance: none;
	background-color: inherit;
	width: fit-content;
	font-size: 0.8rem;
	margin: 10px;
	font-weight: 400 !important;
	::placeholder {
		color: darkgrey;
	}
`

const Form = styled.form`
	margin-left: 30px;
	display: flex;
	align-items: baseline;
	gap: 5px;
	background-color: #363d5f;
	width: fit-content;
	border-radius: 4px;
	overflow: hidden;
	height: 40px;
	* {
		font-size: 0.8rem;
		font-weight: 300;
	}
	> button {
		height: 100%;
		border: none;
		padding: 10px 15px;
		cursor: pointer;
		transition: 0.2s;
		display: flex;
		align-self: center;
		background-color: inherit;
		:hover {
			background-color: #4c61c8;
		}
		/* :not(:hover){
            background-color: transparent;
        } */
	}
`

const Mag = styled(MagnifyingGlass)`
	width: 1rem;
	height: 100%;
`
