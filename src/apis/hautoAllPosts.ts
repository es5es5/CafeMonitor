// src/apis/hautoAllPosts.ts
import axios from 'axios'
import dayjs from 'dayjs'

export type CafeArticle = {
  articleId: number
  subject: string
  summary: string
  writeDateTimestamp: number
  writerNick: string
}

export type SearchResult = {
  keyword: string
  total: number
  matched: CafeArticle[]
}

export async function fetchHautoArticlesByKeyword(
  keyword: string,
): Promise<SearchResult> {
  const baseUrl =
    'https://apis.naver.com/cafe-web/cafe-boardlist-api/v1/cafes/12877327/menus/0/articles'
  const url = `${baseUrl}?page=1&pageSize=50&sortBy=TIME&viewType=L`

  try {
    const response = await axios.get(url)
    const list = response.data?.result?.articleList ?? []

    const extracted: CafeArticle[] = list
      .filter((entry: any) => entry.type === 'ARTICLE' && entry.item)
      .map((entry: any) => ({
        articleId: entry.item.articleId,
        subject: entry.item.subject,
        summary: entry.item.summary,
        writeDateTimestamp: entry.item.writeDateTimestamp,
        writerNick: entry.item.writerInfo.nickName,
      }))

    const matched = extracted.filter(article => {
      const lowerKeyword = keyword.toLowerCase()
      return (
        article.subject?.toLowerCase().includes(lowerKeyword) ||
        article.summary?.toLowerCase().includes(lowerKeyword)
      )
    })

    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')

    console.log(`\n📦 전체 응답된 게시글 수: ${extracted.length}`)
    console.log(`요청 URL: ${url}`)
    console.log(`검색 키워드: ${keyword}`)
    console.log(`검색 시각: ${now}\n`)

    console.log(
      `[${keyword}] 로 검색한 게시글이 [${matched.length}개] 입니다.\n`,
    )

    for (const item of matched) {
      const date = dayjs(item.writeDateTimestamp).format('YYYY-MM-DD')
      console.log(
        `${item.articleId} ${item.subject.trim()} ${date} ${item.writerNick}`,
      )
    }

    return {
      keyword,
      total: matched.length,
      matched,
    }
  } catch (err) {
    console.error('❌ 게시글 수집 중 오류:', err)
    return {
      keyword,
      total: 0,
      matched: [],
    }
  }
}
