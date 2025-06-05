import { queryFor } from "../reduxtk/features/weather/types"
import styled from "styled-components"

const availableDates = {
    // Today: queryFor.today,
    // Yesterday: queryFor.yesterday,
    // Tomorrow: queryFor.tomorrow,
    // 'Last 24 hours': queryFor.last24,
    'next': queryFor.next2Weeks,
    'last': queryFor.last2Weeks
    // 'Next Month': queryFor.nextMonth,
    // 'Last week': queryFor.lastWeek,
    // 'Last Month': queryFor.lastMonth,
    // 'Next Week': queryFor.nextWeek,
    // 'Next 24 hours': queryFor.next24,
}

const SelectSingleDate = () => {
    return (
        <Selection>
                {Object.entries(availableDates).map(([key, value]) => 
                    <option key={key} value={value}>
                        {key}
                    </option>
                )}
        </Selection>
    )
}

const Selection = styled.select`
    outline: none;
    border: none;
    border-bottom: 1px solid grey;
    //background-color: inherit;
    &, option {
        background-color: #363d5f;
    }
`
export default SelectSingleDate