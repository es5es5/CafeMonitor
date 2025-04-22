import dayjs from 'dayjs'

interface WriterInfo {
  nickName: string
}

interface ArticleItem {
  articleId: number
  subject: string
  writeDateTimestamp: number
  writerInfo: WriterInfo
}

export function prettyResult(
  keyword: string,
  url: string,
  articles: ArticleItem[],
  timestamp = new Date(),
): string {
  const formattedTime = dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
  const lines: string[] = []

  lines.push(`키워드: ${keyword}`)
  lines.push(`검색 시각: ${formattedTime}`)
  // lines.push(`요청 URL:\n${url}\n`)
  lines.push(`총 ${articles.length}개의 게시글이 검색되었습니다.\n`)

  for (const article of articles) {
    lines.push('────────────────────────────')
    lines.push(`${article.articleId}`)
    lines.push(`제목: ${article.subject}`)
    lines.push(
      `작성일: ${dayjs(article.writeDateTimestamp).format('YYYY-MM-DD HH:mm:ss')}`,
    )
    lines.push(`작성자: ${article.writerInfo.nickName}`)
  }

  return lines.join('\n')
}
