import { useLazySingleDateQuery, useLazyDateRangeQuery } from "../reduxtk/features/weather/weatherApi"
import { UseLazyQuery } from "@reduxjs/toolkit/dist/query/react/buildHooks"

const Content = ({dayData}: {dayData: ReturnType<(typeof useLazySingleDateQuery | typeof useLazyDateRangeQuery)>[1]}) => {
    
    const  { data, isFetching, isError, isLoading, isSuccess, isUninitialized } = dayData

    return (
          isUninitialized         ? <div>Search something</div> 
        : isError                 ? <div>Error</div> 
        : isLoading || isFetching ? <div>Loading</div> 
        : isSuccess               ? <div>{JSON.stringify(data)}</div> 
        : null
    )
}

export default Content