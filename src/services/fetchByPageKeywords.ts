// apis/fetchByPageKeywords.ts

import axios from 'axios'
import {prettyResult} from '../utils/prettyResult'
import {
  ArticleItem,
  CafeApiResponse,
  PageKeywordResult,
} from '../types/cafeType'
import {BASE_URL, SIZE, SORT_BY, VIEW_TYPE} from '../constants/cafeConfig'
import {getArticleLink} from '../utils/getArticleLink'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 빠른 병렬 처리 방식으로 키워드 포함 게시글을 필터링합니다.
 * 각 요청마다 작은 랜덤 지연을 줘서 차단 위험을 줄이고,
 * 콘솔 출력용 결과 + 원본 게시글 데이터(articleId 포함)를 함께 반환합니다.
 */
export async function fetchByPageKeywords(
  keywords: string[],
  options: {
    maxPage?: number
    delayMs?: number
    onProgress?: (percent: number) => void
  } = {},
): Promise<PageKeywordResult[]> {
  const {maxPage = 3, delayMs = 200, onProgress} = options
  const keywordMap = new Map<string, ArticleItem[]>()
  keywords.forEach(k => keywordMap.set(k, []))

  const keywordRegex = new RegExp(
    keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
    'i',
  )

  let totalFetchedCount = 0
  let lastUrl = ''
  let completed = 0

  const fetchPage = async (page: number) => {
    await sleep(Math.random() * delayMs)
    const url = `${BASE_URL}?page=${page}&pageSize=${SIZE}&sortBy=${SORT_BY}&viewType=${VIEW_TYPE}`
    lastUrl = url

    try {
      const response = await axios.get<CafeApiResponse>(url)
      const articles = response.data.result?.articleList ?? []

      if (articles.length === 0) return

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

      if (onProgress) {
        completed++
        const percent = Math.min(100, Math.floor((completed / maxPage) * 100))
        onProgress(percent)
      }
    } catch (e) {
      console.error(`❌ 페이지 ${page} 요청 실패:`, e)
    }
  }

  const tasks = Array.from({length: maxPage}, (_, i) => fetchPage(i + 1))
  await Promise.all(tasks)

  return keywords.map(keyword => ({
    keyword,
    resultText: prettyResult(
      keyword,
      lastUrl,
      keywordMap.get(keyword) || [],
      new Date(),
      totalFetchedCount,
    ),
    articles: keywordMap.get(keyword) || [],
  }))
}
