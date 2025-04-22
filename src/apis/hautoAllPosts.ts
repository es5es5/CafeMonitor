import axios from 'axios'

type CafeArticle = {
  articleId: number
  subject: string
  summary?: string
  writeDate: string
  member: {
    nickname: string
  }
}

type CafeArticleListResponse = {
  data?: {
    articles: CafeArticle[]
  }
}

const CAFE_ID = 12877327
const MENU_ID = 0
const PAGE = 1
const PAGE_SIZE = 50

/**
 * subject 또는 summary 에 keyword 포함 여부 검사
 * 전체 raw 데이터를 콘솔에 출력하여 디버깅 가능
 */
export async function fetchHautoArticlesByKeyword(keyword: string) {
  const url = `https://apis.naver.com/cafe-web/cafe-boardlist-api/v1/cafes/${CAFE_ID}/menus/${MENU_ID}/articles?page=${PAGE}&pageSize=${PAGE_SIZE}&sortBy=TIME&viewType=L`

  try {
    const response = await axios.get<CafeArticleListResponse>(url, {
      headers: {
        referer: 'https://cafe.naver.com/',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
      },
    })

    const articles = response.data?.data?.articles ?? []

    console.log(`📦 전체 응답된 게시글 수: ${articles.length}\n`)
    articles.forEach((a, i) => {
      console.log(`[${i + 1}]`)
      console.log(`ID: ${a.articleId}`)
      console.log(`제목: ${a.subject}`)
      console.log(`요약: ${a.summary}`)
      console.log(`작성자: ${a.member.nickname}`)
      console.log(`작성일: ${a.writeDate}`)
      console.log('---------------------------')
    })

    const keywordLower = keyword.toLowerCase()
    const matched = articles.filter(article => {
      const subject = article.subject?.toLowerCase() ?? ''
      const summary = article.summary?.toLowerCase() ?? ''
      return subject.includes(keywordLower) || summary.includes(keywordLower)
    })

    return {
      keyword,
      total: matched.length,
      list: matched.map(a => ({
        id: a.articleId,
        subject: a.subject,
        writeDate: a.writeDate.slice(0, 10),
        nickname: a.member.nickname,
      })),
      requestUrl: url,
    }
  } catch (error) {
    console.error('❌ 게시글 수집 중 오류:', error)
    return {keyword, total: 0, list: [], requestUrl: url}
  }
}
