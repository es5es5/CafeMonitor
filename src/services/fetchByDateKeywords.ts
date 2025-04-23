// apis/fetchAfterDateKeywords.ts
import axios from 'axios'
import dayjs from 'dayjs'
import {prettyResult} from '../utils/prettyResult'
import {ArticleItem} from './fetchByPageKeywords'
import {BASE_URL, SIZE, SORT_BY, VIEW_TYPE} from '../constants/cafeConfig'
import {CafeApiResponse} from '../types/cafeType'

/**
 * afterDate 기준 이후 게시글만 검색되도록 이진 탐색을 통해 시작 페이지를 최적화합니다.
 */
export async function fetchAfterDateKeywords(
  keywords: string[],
  options: {
    afterDate: string
    onProgress?: (percent: number) => void
  },
): Promise<string[]> {
  const {afterDate, onProgress} = options
  const afterTimestamp = dayjs(afterDate).valueOf()
  console.log(`\n🕐 afterDate: ${afterDate} → timestamp: ${afterTimestamp}`)

  const keywordMap = new Map<string, ArticleItem[]>()
  keywords.forEach(k => keywordMap.set(k, []))

  let totalFetchedCount = 0
  let lastUrl = ''
  let foundStartPage = -1

  let left = 1
  let right = 1000

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    console.log(`[이진탐색] ${mid} 페이지 검사 중...`)
    const url = `${BASE_URL}?page=${mid}&pageSize=${SIZE}&sortBy=${SORT_BY}&viewType=${VIEW_TYPE}`
    const response = await axios.get<CafeApiResponse>(url)
    const articles = response.data.result?.articleList ?? []

    if (articles.length === 0) {
      right = mid - 1
      continue
    }

    const firstTimestamp = articles
      .filter(a => a.type === 'ARTICLE')
      .map(a => a.item.writeDateTimestamp)[0]

    console.log(
      `📄 페이지 ${mid} 첫 글 시간: ${firstTimestamp} (${dayjs(
        firstTimestamp,
      ).format('YYYY-MM-DD HH:mm')})`,
    )

    if (firstTimestamp < afterTimestamp) {
      right = mid - 1 // 더 최신 글을 보기 위해 앞으로 감
    } else {
      foundStartPage = mid
      left = mid + 1 // 아직 더 최신 글이 있을 수 있으니 오른쪽으로
    }
  }

  if (foundStartPage === -1) {
    return ['❌ afterDate 이후 게시글을 찾을 수 없습니다.']
  }

  console.log(`[이진탐색] 조건에 맞는 시작 페이지: ${foundStartPage} 페이지`)

  let page = foundStartPage
  while (true) {
    const url = `${BASE_URL}?page=${page}&pageSize=${SIZE}&sortBy=${SORT_BY}&viewType=${VIEW_TYPE}`
    lastUrl = url
    const response = await axios.get<CafeApiResponse>(url)
    const articles = response.data.result?.articleList ?? []

    if (articles.length === 0) break

    const filtered = articles
      .filter(article => article.type === 'ARTICLE')
      .map(article => article.item)

    const withinDate = filtered.filter(item => {
      return item.writeDateTimestamp >= afterTimestamp
    })

    if (withinDate.length === 0) break

    totalFetchedCount += withinDate.length

    for (const keyword of keywords) {
      const lowerKeyword = keyword.toLowerCase()
      const matched = withinDate.filter(
        item =>
          item.subject.toLowerCase().includes(lowerKeyword) ||
          item.summary.toLowerCase().includes(lowerKeyword),
      )
      keywordMap.set(keyword, [...(keywordMap.get(keyword) || []), ...matched])
    }

    page++

    if (onProgress) {
      const percent = Math.min(
        90,
        Math.floor(((page - foundStartPage) / 10) * 90),
      )
      onProgress(percent)
    }
  }

  if (onProgress) onProgress(100)

  return keywords.map(keyword =>
    prettyResult(
      keyword,
      lastUrl,
      keywordMap.get(keyword) || [],
      new Date(),
      totalFetchedCount,
    ),
  )
}
