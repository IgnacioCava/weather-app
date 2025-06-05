import React, { useEffect, useRef, useState } from "react";
import { Hour } from "../reduxtk/features/weather/types";
import { mapHours, mapHoursType } from '../helpers'

interface useTimeoutProps {
    deps: any[],
    ignoreFirstRender: boolean,
    hours: mapHoursType | null,
    date: string | null
    duration: number
}

const useAnimationTimeout = ({deps, ignoreFirstRender, hours, date, duration} : useTimeoutProps) => {

    const [ignore, setIgnore] = useState(ignoreFirstRender)
    const [animation, setAnimation] = useState<'up' | 'down'>('up')
    const [prevHours, setPrevHours] = useState(hours)
    const [prevDate, setPrevDate] = useState(date)

    const timeout = useRef<NodeJS.Timeout>()
    const clear = () => timeout.current && clearTimeout(timeout.current)

    useEffect(() => {
        if(ignore) setIgnore(false)
        else {
            setAnimation('down')
            clear()
            timeout.current = setTimeout(() => {
                setPrevHours(hours)
                setPrevDate(date)
                timeout.current = setTimeout(() => {
                    setAnimation('up')
                }, 50)
            }, duration)
        }
        return () => clear()
    }, deps)

    return {animation, prevHours, prevDate}
}

export default useAnimationTimeout