Runtime TypeError



Failed to fetch
Call Stack
1

Hide 1 ignore-listed frame(s)
fetchServerAction
node_modules/next/src/client/components/router-reducer/reducers/server-action-reducer.ts (143:21)

----------------------------------------------------------------------------------------------------


Console TypeError
Server



Cannot read properties of undefined (reading 'count')
src\actions\articles.ts (255:31) @ getAdminStats


  253 |
  254 |     return {
> 255 |       totalArticles: total[0].count,
      |                               ^
  256 |       publishedArticles: published[0].count,
  257 |       draftArticles: drafts[0].count,
  258 |       totalViews: Number(views[0].total),
Call Stack
20

Show 17 ignore-listed frame(s)
getAdminStats
src\actions\articles.ts (255:31)
AdminDashboard
src\app\(admin)\admin\page.tsx (5:17)
AdminDashboard
<anonymous>