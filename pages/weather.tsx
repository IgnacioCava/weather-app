import { FormEventHandler } from 'react'
import { SingleDayQuery } from '../reduxtk/features/weather/types'
import Content from '../components/Content'
import useFetch from '../hooks/useFetch'
import SelectSingleDate from '../components/SelectSingleDate'

const Weather = () => {
	const { triggerSingle, singleData } = useFetch()

	const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault()
		const location = (event.currentTarget[0] as HTMLInputElement).value
		const date = (event.currentTarget[1] as HTMLSelectElement).value as SingleDayQuery['date']
		triggerSingle({ location, date })
	}

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<input type="text" placeholder="type a location" />
				<SelectSingleDate />
				<button type="submit">search</button>
			</form>
			<Content dayData={singleData} />
		</div>
	)
}

export default Weather
