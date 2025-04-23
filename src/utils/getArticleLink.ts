// utils/getArticleLink.ts
import {HAUTO_CAFE_ID} from '../constants/cafeConfig'

/**
 * 주어진 articleId를 기반으로 네이버 카페 '하우투' 게시글 링크를 생성합니다.
 * @param articleId 게시글 고유 ID
 * @returns 게시글 상세보기 URL
 */
export function getArticleLink(articleId: string | number): string {
  return `https://cafe.naver.com/f-e/cafes/${HAUTO_CAFE_ID}/articles/${articleId}`
}
