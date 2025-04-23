// utils/prettyResult.ts

import dayjs from 'dayjs'
import {ArticleItem} from '../types/cafeType'
import {getArticleLink} from './getArticleLink'

export function prettyResult(
  keyword: string,
  url: string,
  matchedArticles: ArticleItem[],
  timestamp = new Date(),
  totalFetchedCount = 0,
): string {
  const formattedTime = dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
  const lines: string[] = []

  lines.push(`◆ 키워드: ${keyword}`)
  lines.push(`◆ 검색 시각: ${formattedTime}`)
  lines.push(`◆ 전체 게시글: ${totalFetchedCount}개 중`)
  lines.push(`◆ 키워드 매칭 게시글: ${matchedArticles.length}개`)
  lines.push('============================')

  if (matchedArticles.length < 1) return lines.join('\n')

  for (const article of matchedArticles) {
    lines.push(`▶ 번호: ${article.articleId}`)
    lines.push(`▶ 제목: ${article.subject}`)
    lines.push(`▶ 내용: ${article.summary}`)
    lines.push(
      `▶ 작성일: ${dayjs(article.writeDateTimestamp).format('YYYY-MM-DD HH:mm:ss')}`,
    )
    lines.push(`▶ 작성자: ${article.writerInfo.nickName}`)
    lines.push(`▶ 링크: ${getArticleLink(article.articleId)}`)
    lines.push('────────────────────────────')
  }

  lines.push('\n\n')
  return lines.join('\n')
}
