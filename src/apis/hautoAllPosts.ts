import axios from 'axios'
import {prettyResult} from '../utils/prettyResult'

const BASE_URL =
  'https://apis.naver.com/cafe-web/cafe-boardlist-api/v1/cafes/12877327/menus/0/articles'
const PAGE = 1
const SIZE = 50
const SORT_BY = 'TIME'
const VIEW_TYPE = 'L'

interface ArticleItem {
  articleId: number
  subject: string
  summary: string
  writeDateTimestamp: number
  writerInfo: {
    nickName: string
  }
}

interface CafeApiResponse {
  result?: {
    articleList?: {
      type: string
      item: ArticleItem
    }[]
  }
}

export async function fetchHautoArticlesByKeyword(
  keyword: string,
): Promise<string> {
  const url = `${BASE_URL}?page=${PAGE}&pageSize=${SIZE}&sortBy=${SORT_BY}&viewType=${VIEW_TYPE}`

  try {
    const response = await axios.get<CafeApiResponse>(url)
    const articles = response.data.result?.articleList ?? []

    const filtered = articles
      .filter(article => article.type === 'ARTICLE')
      .map(article => article.item)
      .filter(
        item =>
          item.subject.includes(keyword) || item.summary.includes(keyword),
      )

    return prettyResult(keyword, url, filtered)
  } catch (error) {
    return `❌ 오류 발생: ${error}`
  }
}
