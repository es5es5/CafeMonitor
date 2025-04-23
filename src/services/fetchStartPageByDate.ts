// services/fetchStartPageByDate.ts
import axios from 'axios'
import {BASE_URL, SIZE} from '../constants/cafeConfig'
import {CafeApiResponse} from '../types/cafeType'

const MAX_PAGE = 100

export async function fetchStartPageByDate(afterDate: Date): Promise<number> {
  const afterTimestamp = afterDate.getTime()

  let left = 1,
    right = MAX_PAGE,
    result = MAX_PAGE + 1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const url = `${BASE_URL}?page=${mid}&size=${SIZE}`

    try {
      const response = await axios.get<CafeApiResponse>(url)
      const articleList = response.data?.result?.articleList ?? []

      const hasNewer = articleList.some(
        article => article.item.writeDateTimestamp > afterTimestamp,
      )

      if (hasNewer) {
        result = mid
        right = mid - 1
      } else {
        left = mid + 1
      }
    } catch (err) {
      console.warn(`Failed to fetch page ${mid}`, err)
      left = mid + 1
    }
  }

  return result <= MAX_PAGE ? result : -1
}
