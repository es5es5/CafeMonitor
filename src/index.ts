import {fetchHautoArticlesByKeyword} from './apis/hautoAllPosts'

async function main() {
  const keyword = '수학'
  const result = await fetchHautoArticlesByKeyword(keyword)

  const now = new Date()
  const formattedTime = now.toISOString().replace('T', ' ').slice(0, 19)

  const url = `https://apis.naver.com/cafe-web/cafe-boardlist-api/v1/cafes/12877327/menus/0/articles?page=1&pageSize=50&sortBy=TIME&viewType=L`

  console.log(`요청 URL: ${url}`)
  console.log(`검색 키워드: ${result.keyword}`)
  console.log(`검색 시각: ${formattedTime}`)
  console.log(
    `\n[${result.keyword}] 로 검색한 게시글이 [${result.total}개] 입니다.\n`,
  )

  result.list.forEach(item => {
    console.log(
      `[${item.id}] ${item.subject} ${item.writeDate} ${item.nickname}`,
    )
  })
}

main()
