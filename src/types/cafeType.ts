// types/cafeTypes.ts
export interface ArticleItem {
  articleId: number
  subject: string
  summary: string
  writeDateTimestamp: number
  writerInfo: {
    nickName: string
  }
}

export interface CafeApiResponse {
  result?: {
    articleList?: {
      type: string
      item: ArticleItem
    }[]
  }
}

export type PageKeywordResult = {
  keyword: string
  resultText: string
  articles: ArticleItem[]
}
