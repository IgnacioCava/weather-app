import { useEffect, useRef } from "react"
import { useLazySingleDateQuery, useLazyDateRangeQuery } from '../reduxtk/features/weather/weatherApi'
import {SingleDayQuery, RangeQuery } from "../reduxtk/features/weather/types"

const useFetch = () => {
	const [triggerSingleDayQuery, singleData] = useLazySingleDateQuery()
	const [triggerRangeDayQuery, rangeData] = useLazyDateRangeQuery()

    const singleFetchOptions = useRef<ReturnType<typeof triggerSingleDayQuery>>()
	const rangeFetchOptions = useRef<ReturnType<typeof triggerRangeDayQuery>>()

	useEffect(() => {
		return () => {
			singleFetchOptions.current?.abort()
			rangeFetchOptions.current?.abort()
		}
	}, [])

	const triggerSingle = ({location, date}: SingleDayQuery) => {
		const triggered = triggerSingleDayQuery({location, date})
		singleFetchOptions.current = triggered
	}

	const triggerRange = ({location, start, end}: RangeQuery) => {
		const triggered = triggerRangeDayQuery({location, start, end})
		rangeFetchOptions.current = triggered
	}

	return {triggerSingle, singleData, triggerRange, rangeData}
}

export default useFetch