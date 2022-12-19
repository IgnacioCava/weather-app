import { queryFor } from "../reduxtk/features/weather/types"

const availableDates = {
    Today: queryFor.today,
    Yesterday: queryFor.yesterday,
    Tomorrow: queryFor.tomorrow,
    'Last 24 hours': queryFor.last24,
    'Last week': queryFor.lastWeek,
    'Last Month': queryFor.lastMonth,
    'Next Week': queryFor.nextWeek,
    'Next Month': queryFor.nextMonth,
    'Next 24 hours': queryFor.next24
}

const SelectSingleDate = () => {
    return (
        <select defaultValue='today'>
                {Object.entries(availableDates).map(([key, value]) => 
                    <option key={key} value={value}>
                        {key}
                    </option>
                )}
        </select>
    )
}

export default SelectSingleDate