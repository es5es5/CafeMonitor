// services/fetchStartPageByDate.ts
import axios from 'axios'
import {BASE_URL, SIZE} from '../constants/cafeConfig'
import {CafeApiResponse} from '../types/cafeType'

const MAX_PAGE = 1000

export async function fetchStartPageByDate(afterDate: Date): Promise<number> {
  const afterTimestamp = afterDate.getTime()

  let left = 1,
    right = MAX_PAGE,
    result = MAX_PAGE + 1

  console.log(
    `\n📌 입력된 afterDate: ${afterDate.toISOString()} (${afterTimestamp})\n`,
  )

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const url = `${BASE_URL}?page=${mid}&size=${SIZE}`

    try {
      const response = await axios.get<CafeApiResponse>(url)
      const articleList = response.data?.result?.articleList ?? []

      const firstTimestamp = articleList[0]?.item?.writeDateTimestamp ?? null
      const firstDateStr = firstTimestamp
        ? new Date(firstTimestamp).toISOString()
        : 'N/A'

      const hasNewer = articleList.some(
        article => article.item.writeDateTimestamp > afterTimestamp,
      )

      console.log(`🔍 [페이지 ${mid}]`)
      console.log(`   ↳ 첫 게시글 날짜: ${firstDateStr}`)

      if (hasNewer) {
        // 더 오래된 글에서 시작하려면 페이지 번호를 증가시켜야 함
        result = mid
        left = mid + 1
      } else {
        right = mid - 1
      }
    } catch (err) {
      console.warn(`⚠️ 페이지 ${mid} 로드 실패`, err)
      left = mid + 1
    }
  }

  console.log(
    `\n🎯 탐색 결과: 게시글 페이지는 ${result <= MAX_PAGE ? result : '없음 (-1)'}\n`,
  )
  return result <= MAX_PAGE ? result : -1
}
