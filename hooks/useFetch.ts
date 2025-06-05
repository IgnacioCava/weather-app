import { useEffect, useRef } from 'react'
import { useLazySingleDateQuery, useLazyDateRangeQuery } from '../reduxtk/features/weather/weatherApi'
import { SingleDayQuery, RangeQuery } from '../reduxtk/features/weather/types'
import { useAppDispatch, useAppSelector } from '../reduxtk/app/hooks'
import { save } from '../reduxtk/features/weather/weatherSlice'

const useFetch = () => {
	const dispatch = useAppDispatch()

	const [triggerSingleDayQuery, singleData] = useLazySingleDateQuery()
	const [triggerRangeDayQuery, rangeData] = useLazyDateRangeQuery()

	const singleFetchOptions = useRef<ReturnType<typeof triggerSingleDayQuery>>()
	const rangeFetchOptions = useRef<ReturnType<typeof triggerRangeDayQuery>>()

	useEffect(() => {
		if (singleData.isSuccess) dispatch(save(singleData))
	}, [singleData, dispatch])

	useEffect(() => {
		return () => {
			singleFetchOptions.current?.abort()
			rangeFetchOptions.current?.abort()
		}
	}, [])

	const fetchSingle = ({ location, date }: SingleDayQuery) => {
		const triggered = triggerSingleDayQuery({ location, date })
		singleFetchOptions.current = triggered
	}

	const fetchRange = ({ location, start, end }: RangeQuery) => {
		const triggered = triggerRangeDayQuery({ location, start, end })
		rangeFetchOptions.current = triggered
	}

	return { fetchSingle, singleData, fetchRange, rangeData }
}

export default useFetch
