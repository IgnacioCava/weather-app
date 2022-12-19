import { useAppDispatch, useAppSelector } from '../reduxtk/app/hooks'
//import { actions } from '../reduxtk/features/weather/weatherSlice'

const Counter = () => {
	const data = useAppSelector((state) => state.weather.value)
	//const dispatch = useAppDispatch()

	const handleAction = () => {
		//dispatch(action)
	}

	return (
		<div>
			{data}
			<button onClick={() => handleAction()}>action</button>
		</div>
	)
}

export default Counter
