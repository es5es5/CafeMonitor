// apis/fetchByPageKeywords.ts
import axios from 'axios'
import {prettyResult} from '../utils/prettyResult'
import {ArticleItem, CafeApiResponse} from '../types/cafeType'
import {BASE_URL, SIZE, SORT_BY, VIEW_TYPE} from '../constants/cafeConfig'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 지정된 페이지 수만큼 순회하여 키워드 포함 게시글을 필터링합니다.
 * 요청 간에 딜레이를 주어 429 Too Many Requests 방지.
 */
export async function fetchByPageKeywords(
  keywords: string[],
  options: {
    maxPage?: number
    delayMs?: number
    onProgress?: (percent: number) => void
  } = {},
): Promise<string[]> {
  const {maxPage = 3, delayMs = 200, onProgress} = options
  const keywordMap = new Map<string, ArticleItem[]>()
  keywords.forEach(k => keywordMap.set(k, []))

  const keywordRegex = new RegExp(
    keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
    'i',
  )

  let totalFetchedCount = 0
  let lastUrl = ''

  try {
    for (let page = 1; page <= maxPage; page++) {
      const url = `${BASE_URL}?page=${page}&pageSize=${SIZE}&sortBy=${SORT_BY}&viewType=${VIEW_TYPE}`
      lastUrl = url

      const response = await axios.get<CafeApiResponse>(url)
      const articles = response.data.result?.articleList ?? []

      if (articles.length === 0) break

      const filtered = articles
        .filter(article => article.type === 'ARTICLE')
        .map(article => article.item)

      totalFetchedCount += filtered.length

      const matchedItems = filtered.filter(
        item =>
          keywordRegex.test(item.subject) || keywordRegex.test(item.summary),
      )

      for (const item of matchedItems) {
        for (const keyword of keywords) {
          const lowerKeyword = keyword.toLowerCase()
          if (
            item.subject.toLowerCase().includes(lowerKeyword) ||
            item.summary.toLowerCase().includes(lowerKeyword)
          ) {
            keywordMap.set(keyword, [...(keywordMap.get(keyword) || []), item])
          }
        }
      }

      // 진행률 업데이트
      if (onProgress) {
        const percent = Math.min(90, Math.floor((page / maxPage) * 90))
        onProgress(percent)
      }

      // ⏱️ 429 방지를 위한 요청 간 딜레이
      await sleep(delayMs)
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
  } catch (error) {
    return [`❌ 오류 발생: ${error}`]
  }
}
