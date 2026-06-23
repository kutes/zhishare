# TASK_LOG

## 2026-06-09

Task: Finish the sitewide cleanup pass for tool detail page edge cases.
Files changed:
- src/components/tools/tool-detail-page.tsx
- docs/TASK_LOG.md

Checks and fixes:
- Verified there are no user-visible continuous question-mark乱码 strings left in `src` or `docs`.
- Kept the mobile detail flow and button order intact.
- Confirmed the admin tool form still includes `download_url` and the label/description remain in place.
- Verified `npm run build` passes.

## 2026-06-09

Task: Finalize the mobile tool detail page information flow.
Files changed:
- src/components/tools/tool-detail-page.tsx
- docs/TASK_LOG.md

Checks and fixes:
- Kept the mobile flow in the order: return link, summary card, decision panel, quick facts, detail sections, related tools, bottom ad, footer.
- Kept the desktop detail layout unchanged.
- Verified `npm run build` passes.

## 2026-06-09

Task: Reorder the mobile tool detail page into the final information flow.
Files changed:
- src/components/tools/tool-detail-page.tsx
- docs/TASK_LOG.md

Checks and fixes:
- Reordered the mobile detail page flow to show the summary card, decision panel, quick facts, detail sections, related tools, and a single bottom ad in that order.
- Hid the desktop hero and desktop related layout on mobile so the phone view does not duplicate content.
- Kept the desktop detail page structure intact.
- `npm run build` passed.

## 2026-06-09

Task: Add a mobile-only summary card at the top of the tool detail page.
Files changed:
- src/components/tools/tool-mobile-summary-card.tsx
- src/components/tools/tool-detail-page.tsx
- docs/TASK_LOG.md

Checks and fixes:
- Added a mobile-only top summary card for `/tools/[slug]` so the key info appears earlier on small screens.
- Kept category, free/open-source status, title, tagline, tags, and the collapsible description inside the new mobile card.
- Hid the original desktop hero block on mobile to avoid duplicate content.
- Kept the desktop hero and the rest of the detail page structure unchanged.
- `npm run build` passed.

## 2026-06-09

Task: Add a mobile summary card for the top of the tool detail page.
Files changed:
- src/components/tools/tool-mobile-summary-card.tsx
- src/components/tools/tool-detail-page.tsx
- docs/TASK_LOG.md

Checks and fixes:
- Added `ToolMobileSummaryCard` for mobile top summary display.
- Hid the original desktop hero card on mobile to avoid duplicate top information.
- Kept category, free/open-source status, title, tagline, tags, and collapsible description in the new mobile card.
- Desktop still uses the original detail hero layout.
- `npm run build` passed.

## 2026-06-09

Task: Compress the mobile tool detail top introduction section.
Files changed:
- src/components/tools/collapsible-description.tsx
- docs/TASK_LOG.md

Checks and fixes:
- Compressed the mobile "这个工具是什么" section to about 3 lines by default.
- Preserved the expand/collapse interaction for full text on mobile.
- Desktop still shows the full description without the toggle button.
- No changes were made to the quick decision panel, download button, or key information module.
- `npm run build` passed.

## 2026-06-09

Task: Compress the mobile tool detail quick decision panel so it defaults to summary only and expands on demand.
Files changed:
- src/components/tools/tool-decision-panel.tsx
- docs/TASK_LOG.md

Checks and fixes:
- Rebuilt the mobile quick decision panel so the default state only shows the summary and the expand/collapse button.
- The four decision cards now appear only after clicking "展开判断", and collapse back on the same button.
- Desktop still shows the full four decision cards.
- Kept the button order: 访问官网 / 网盘下载 / 返回工具库.
- Kept disabled fallbacks for missing `website_url` and `download_url`.
- `npm run build` passed.

## 2026-06-09

Task: Keep compressing the mobile tool detail key information module, leaving only the expand categories button visible by default.
Files changed:
- src/components/tools/mobile-tool-detail-sections.tsx
- docs/TASK_LOG.md

Checks and fixes:
- Rebuilt the mobile key information panel so the summary and the three small status blocks are shown by default.
- The category table stays hidden until "展开分类" is clicked.
- Only one category can be open at a time after the table is expanded.
- Desktop detail content remains unchanged.
- `npm run build` passed.

## 2026-06-09

Task: Rebuild the mobile tool detail key information module into a single compact accordion-style table.
Files changed:
- src/components/tools/mobile-tool-detail-sections.tsx
- docs/TASK_LOG.md

Checks and fixes:
- Rewrote the mobile key information area into one unified panel with a compact table layout.
- Kept the desktop detail content, related recommendations, and ad layout unchanged.
- Default state is collapsed; tapping a row expands that category below the row, and only one category is open at a time.
- Mobile now shows the compact table only, while desktop does not show this module.
- `npm run build` passed.

## 2026-06-09

Task: Rebuild the mobile tool detail "key information" module into a single compact accordion-style table.
Files changed:
- src/components/tools/mobile-tool-detail-sections.tsx
- docs/TASK_LOG.md

Checks and fixes:
- Rewrote the mobile key information area into one unified panel with a compact table layout.
- Kept the desktop detail content, related recommendations, and ad layout unchanged.
- Default state is collapsed; tapping a row expands that category below the row, and only one category is open at a time.
- Mobile now shows the compact table only, while desktop does not show this module.
- `npm run build` passed.

## 2026-06-09

Task: Compress the mobile tool detail page related recommendations and ad slots.
Files changed:
- src/components/tools/mobile-related-tools-compact.tsx
- src/components/tools/tool-detail-page.tsx
- docs/TASK_LOG.md

Checks and fixes:
- Added `MobileRelatedToolsCompact` for mobile, showing at most two compact related tools in a list layout.
- Kept the desktop related tools section and desktop ad layout unchanged.
- Hid the inline and sidebar ad slots on mobile, while keeping a single compact bottom ad on mobile.
- Preserved the official site, download link, return to tools button, and the expand/collapse content sections.
- `npm run build` passed.

## 2026-06-08

Task: Clean up user-visible garbled Chinese text across the project, with focus on the admin tool form and tool detail panel.
Files changed:
- src/components/admin/AdminToolForm.tsx
- src/components/tools/tool-decision-panel.tsx
- docs/TASK_LOG.md

Checks and fixes:
- Restored the admin tool form labels, placeholders, section titles, helper text, and validation messages to normal Chinese.
- Restored the tool detail quick decision panel labels, fallback copy, and button text while keeping the `download_url` button logic intact.
- Verified that `rg "\\?{3,}" src docs` no longer returns user-visible question-mark garbage.
- `npm run build` passed after clearing the project cache and rebuilding.

## 2026-06-08

Task: Fix garbled Chinese text in the tool detail quick decision panel while keeping the download button logic intact.
Files changed:
- src/components/tools/tool-decision-panel.tsx
- docs/TASK_LOG.md

Checks and fixes:
- Rewrote the quick decision panel with clean Chinese labels and fallback copy.
- Kept the existing button order: 璁块棶瀹樼綉 / 缃戠洏涓嬭浇 / 杩斿洖宸ュ叿搴?
- Kept `download_url` support and the disabled fallback state when no download link exists.
- Corrected the website URL lookup keys so `websiteUrl` and `officialUrl` are read properly.
- No changes were made to the homepage, tools list, database schema, RLS, backend form structure, `src/lib/db/tools.ts`, `src/lib/db/normalizers.ts`, or `/tools/[slug]` routing.

Check result:
- `npm run build` passed.

## 2026-06-08

Task: Add a "缃戠洏涓嬭浇" button to the tool decision panel and let the admin tool editor fill `download_url`.
Files changed:
- src/types/database.ts
- src/types/tool.ts
- src/lib/db/normalizers.ts
- src/lib/db/tools.ts
- src/components/tools/tool-decision-panel.tsx
- src/components/admin/AdminToolForm.tsx
- src/app/admin/tools/[id]/edit/page.tsx
- docs/DATABASE_SCHEMA.md
- docs/TASK_LOG.md

Checks and fixes:
- Added optional `download_url` support end-to-end from database types to the frontend tool model and admin save payload.
- Added a download URL field to the admin create/edit form so editors can save the link directly.
- Added a "缃戠洏涓嬭浇" button in the quick decision panel, placed after the official site button and before "杩斿洖宸ュ叿搴?.
- When the download link exists, it opens in a new tab with `rel="nofollow noopener noreferrer"`; when it is empty, the UI shows a disabled fallback with a short hint.
- Build verification passed after fixing the admin form and decision panel syntax issues.

## 2026-06-08

Task: Add a "download link" button to the tool detail page quick decision panel and let the admin tool editor fill a download URL.
Files changed:
- src/types/database.ts
- src/types/tool.ts
- src/lib/db/normalizers.ts
- src/lib/db/tools.ts
- src/components/tools/tool-decision-panel.tsx
- src/components/admin/AdminToolForm.tsx
- src/app/admin/tools/[id]/edit/page.tsx
- docs/DATABASE_SCHEMA.md
- docs/TASK_LOG.md

Checks and fixes:
- Added optional `download_url` to the `tools` table schema and synced it through database types, the frontend `ToolItem` type, the normalizer, and the admin save payload.
- Added a "download link" input to the admin create/edit form. It now round-trips and saves, and empty values are stored as `null`.
- Reordered the quick decision panel buttons to: Visit official site / Download link / Back to tools.
- When `download_url` exists, the button opens in a new tab and uses `rel="nofollow noopener noreferrer"`; when it is empty, the button is disabled and shows a small "no download link yet" hint.
- No changes to the tools list page, homepage, submissions, reports, Turnstile, RLS, or the article system.

Check result:
- `npm run build` passed.

## 2026-06-08

浠诲姟锛氫紭鍖?`/tools/[slug]` 宸ュ叿璇︽儏椤垫墜鏈虹増姝ｆ枃灞曠ず鏂瑰紡锛屽鍔犫€滃睍寮€鍏ㄦ枃 / 鏀惰捣鍏ㄦ枃鈥濄€?
鏀瑰姩鏂囦欢锛?
- `src/components/tools/tool-detail-page.tsx`
- `src/components/tools/mobile-tool-detail-sections.tsx`
- `docs/TASK_LOG.md`

妫€鏌ヤ笌淇锛?
- 宸插皢绉诲姩绔鏂囬暱鍐呭鍗曠嫭鎶樺彔锛岄《閮?Hero 鐨勨€滆繖涓伐鍏锋槸浠€涔堚€濈户缁繚鎸佸彲灞曞紑銆?
- 鏂板 `MobileToolDetailSections` 瀹㈡埛绔粍浠讹紝鍦ㄦ墜鏈虹鎶娾€滀富瑕佸姛鑳?/ 閫傚悎浜虹兢 / 浣跨敤鍦烘櫙 / 浼樼偣 / 缂虹偣 / 椋庨櫓鎻愰啋鈥濇敼鎴愭墜椋庣惔鍒楄〃銆?
- 妗岄潰绔户缁繚鐣欏師鏈夊畬鏁存鏂囧睍绀猴紝涓嶅奖鍝嶉灞忓垽鏂潰鏉裤€佸畼缃戞寜閽€佽繑鍥為摼鎺ャ€佺浉鍏虫帹鑽愬拰骞垮憡浣嶃€?
- 鏈敼鏁版嵁璇诲彇銆佺紦瀛樸€?04銆乣/tools` 鍒楄〃椤垫垨棣栭〉閫昏緫銆?

妫€鏌ョ粨鏋滐細
- 宸茶繍琛?`npm run build`锛岄€氳繃銆?

## 2026-06-08

浠诲姟锛氫紭鍖?`/tools/[slug]` 宸ュ叿璇︽儏椤垫墜鏈虹増姝ｆ枃灞曠ず鏂瑰紡锛屽鍔犫€滃睍寮€鍏ㄦ枃 / 鏀惰捣鍏ㄦ枃鈥濄€?
鏀瑰姩鏂囦欢锛?
- `src/components/tools/tool-detail-page.tsx`
- `src/components/tools/collapsible-description.tsx`
- `src/components/tools/tool-decision-panel.tsx`
- `docs/TASK_LOG.md`

妫€鏌ヤ笌淇锛?
- 灏嗗伐鍏疯鎯呴〉椤堕儴浠嬬粛姝ｆ枃鏀逛负绉诲姩绔粯璁ゆ姌鍙狅紝閬垮厤姝ｆ枃杩囬暱鎶娾€滃揩閫熷垽鏂€濆尯鍩熼《寰楀お闈犱笅銆?
- 鎸夎繖娆¤创鍑虹殑鏇挎崲鐗堣姹傦紝鎶婃姌鍙犵粍浠剁湡姝ｆ帴鍒伴灞?Hero 鐨勯暱浠嬬粛涓婏紝涓嬮潰姝ｆ枃鍖轰繚鎸佷笉鍔ㄣ€?
- 鏂板 `CollapsibleDescription` 瀹㈡埛绔粍浠讹紝浣跨敤 `useState` 鎺у埗灞曞紑涓庢敹璧凤紝鐐瑰嚮鍚庝笉鏀瑰彉 URL锛屼篃涓嶅奖鍝嶅畼缃戞寜閽拰杩斿洖閾炬帴銆?
- 绉诲姩绔粯璁ゆ樉绀虹害 5 琛屾鏂囷紝骞堕厤鏈夋贰鍑烘笎鍙橀伄缃╀笌鈥滃睍寮€鍏ㄦ枃鈥濇寜閽€?
- 灞曞紑鍚庢樉绀哄畬鏁存鏂囷紝鎸夐挳鍒囨崲涓衡€滄敹璧峰叏鏂団€濓紱妗岄潰绔户缁畬鏁村睍绀猴紝涓嶅己鍒舵姌鍙犮€?
- 鏈敼鍔ㄦ暟鎹鍙栥€佺紦瀛樼瓥鐣ャ€?04 琛屼负銆佺浉鍏虫帹鑽愰€昏緫鎴栧垪琛ㄩ〉銆?

妫€鏌ョ粨鏋滐細
- 宸茶繍琛?`npm run build`锛岄€氳繃銆?

## 2026-06-07

浠诲姟锛氬伐鍏疯鎯呴〉绗竴杞紭鍖栵紝鍙噸鏋?`/tools/[slug]` 璇︽儏椤甸灞忓拰鍐崇瓥闈㈡澘銆?
鏀瑰姩鏂囦欢锛?
- `src/components/tools/tool-detail-page.tsx`
- `docs/TASK_LOG.md`

妫€鏌ヤ笌淇锛?
- 灏嗚鎯呴〉棣栧睆閲嶆瀯涓衡€滆繑鍥炲伐鍏峰簱 + 宸︿晶宸ュ叿鏍稿績淇℃伅 + 鍙充晶蹇€熷垽鏂潰鏉?+ 蹇€熷垽鏂潯鈥濈殑缁撴瀯銆?
- 宸︿晶淇濈暀鍒嗙被銆佸悕绉般€佺畝浠嬨€佹爣绛惧拰鐘舵€佽兌鍥婏紝骞朵负缂哄け瀛楁琛ュ厖瀹夊叏 fallback锛岄伩鍏嶆覆鏌?`undefined` / `null`銆?
- 鍙充晶鏂板蹇€熷垽鏂潰鏉匡紝鎸夆€滈€傚悎浜虹兢 / 浣跨敤鍦烘櫙 / 椋庨櫓鎻愰啋 / 璁块棶璺緞鈥濈粍缁囦俊鎭紝骞朵粎鍦ㄥ瓨鍦?`website_url` 鏃舵樉绀哄畼缃戞寜閽€?
- 鍒犻櫎棣栧睆涓嬫柟閲嶅鐨勫畼缃?CTA锛岃棣栧睆鍒ゆ柇淇℃伅鏇撮泦涓€?
- 蹇€熷垽鏂潯鍦ㄦ墜鏈虹淇濇寔 2 鍒椼€佹闈㈢ 4 鍒楋紝渚夸簬蹇€熸壂璇汇€?
- 淇濈暀姝ｆ枃涓殑骞垮憡浣嶃€佺浉鍏虫帹鑽愬拰鐗堟潈鍖猴紝涓嶈皟鏁存暟鎹鍙栥€佺紦瀛樸€?04 琛屼负鎴栫浉鍏虫帹鑽愰€昏緫銆?
- 鏈鏈慨鏀?`/tools` 鍒楄〃椤点€乣src/lib/db/tools.ts`銆乣src/lib/db/normalizers.ts` 鎴栨暟鎹簱缁撴瀯銆?

妫€鏌ョ粨鏋滐細
- 宸茶繍琛?`npm run build`锛岄€氳繃銆?

## 2026-06-06

浠诲姟锛氶椤电Щ鍔ㄧ鍏ㄥ眬闂磋窛鍘嬬缉涓庢敹灏炬鏌ャ€?

鏀瑰姩鏂囦欢锛?
- `src/components/home/home-hero.tsx`
- `src/components/home/home-category-section.tsx`
- `src/components/home/home-featured-tools.tsx`
- `src/components/home/home-latest-articles.tsx`
- `src/components/home/home-page.tsx`
- `src/components/home/home-sponsor-banner.tsx`
- `docs/TASK_LOG.md`

妫€鏌ヤ笌淇锛?
- 鏀剁揣浜嗙Щ鍔ㄧ Hero 鐨勬暣浣撻珮搴︺€佹爣棰橀棿璺濄€乧hips 闂磋窛鍜屾寜閽墠鍚庣暀鐧斤紝鍙充晶鎺у埗鍙扮户缁殣钘忋€?
- 鏀剁揣浜嗘悳绱㈠尯涓?Hero 鐨勮鎺ヨ妭濂忥紝骞朵繚鎸佽緭鍏ユ涓庢寜閽笉鎸ゅ帇銆?
- 鏀剁揣浜嗗垎绫诲尯鐨勭Щ鍔ㄧ `py`銆佸崱鐗?`min-height` 鍜屽崱鐗囧唴鍥炬爣 / 鏂囨闂磋窛銆?
- 鏀剁揣浜嗙簿閫夊伐鍏峰尯鐨勭Щ鍔ㄧ / 鍖哄潡闂磋窛锛屽苟淇濈暀妗岄潰 3 鍒楀ぇ鍗′笉鍙樸€?
- 鏀剁揣浜嗘渶鏂版枃绔犲尯鐨勭Щ鍔ㄧ `py`銆佹爣棰樺埌鍒楄〃鐨勯棿璺濆拰绌虹姸鎬佸崰浣嶃€?
- 鏀剁揣浜嗘敹褰曞師鍒欎笌鍚堜綔鎺ㄥ箍妯箙鐨勭Щ鍔ㄧ `py`銆佹爣棰?/ 鏂囨闂磋窛鍜屾寜閽墠鐣欑櫧銆?
- 淇濈暀妗岄潰绔師鏈夎妭濂忎笌瑙嗚锛屼笉褰卞搷 `/tools`銆乣/articles`銆佸悗鍙般€佹暟鎹簱銆丷LS 鎴?Turnstile銆?

妫€鏌ョ粨鏋滐細
- 宸茶繍琛?`npm run build`锛岄€氳繃銆?

浠诲姟锛氶椤碘€滄渶鏂版枃绔犫€濆尯鍩熸墜鏈虹鍐嶆浼樺寲锛屾敼鎴愮揣鍑戜究绛惧垪琛ㄣ€?

鏀瑰姩鏂囦欢锛?
- `src/components/home/home-latest-articles.tsx`
- `src/components/home/home-article-card.tsx`
- `docs/TASK_LOG.md`

妫€鏌ヤ笌淇锛?
- 妗岄潰绔繚鐣欏綋鍓嶆枃绔犲崱鐗囬鏍硷紝涓嶅ぇ鏀广€?
- 鎵嬫満绔敼鎴愮揣鍑戜究绛惧垪琛細宸︿晶渚跨 / 鏂囨。鍥炬爣锛屼腑闂存爣棰樸€佹憳瑕佷竴琛屽拰鏃ユ湡 / 鍒嗙被锛屽彸渚?`闃呰` 灏忔寜閽€?
- 鎵嬫満绔崟绡囬珮搴﹀帇缂╁埌鏇磋交閲忕殑娴忚鑺傚锛屽噺灏戠暀鐧藉拰瑁呴グ銆?
- 淇濈暀鏂囩珷瀹夊叏 fallback锛氭爣棰樸€佹憳瑕併€佹棩鏈熴€乻lug 閮戒娇鐢ㄧ幇鏈夊畨鍏ㄥ嚱鏁板鐞嗭紝涓嶈緭鍑?`undefined` / `null`銆?
- 鏈慨鏀?`/articles` 椤甸潰涓氬姟閫昏緫銆丠ero銆佹悳绱㈠尯銆佸垎绫诲尯銆佺簿閫夊伐鍏峰尯銆佸悎浣滄帹骞垮尯銆佸悗鍙般€佹暟鎹簱銆丷LS 鎴?Turnstile銆?

妫€鏌ョ粨鏋滐細
- 宸茶繍琛?`npm run build`锛岄€氳繃銆?

浠诲姟锛氶椤碘€滄渶鏂版枃绔犫€濆尯鍩熸墜鏈虹鍗曠嫭浼樺寲锛屾敼鎴愮揣鍑戜究绛惧垪琛ㄣ€?

鏀瑰姩鏂囦欢锛?
- `src/components/home/home-latest-articles.tsx`
- `src/components/home/home-article-card.tsx`
- `docs/TASK_LOG.md`

妫€鏌ヤ笌淇锛?
- 妗岄潰绔繚鐣欏綋鍓嶆枃绔犲崱鐗囬鏍硷紝涓嶅ぇ鏀广€?
- 鎵嬫満绔敼鎴愮揣鍑戜究绛惧垪琛細宸︿晶渚跨 / 鏂囨。鍥炬爣锛屼腑闂存爣棰樸€佹憳瑕佷竴琛屽拰鏃ユ湡 / 鍒嗙被锛屽彸渚?`闃呰` 灏忔寜閽€?
- 鎵嬫満绔崟绡囬珮搴﹀帇缂╁埌鏇磋交閲忕殑娴忚鑺傚锛屽噺灏戠暀鐧藉拰瑁呴グ銆?
- 淇濈暀鏂囩珷瀹夊叏 fallback锛氭爣棰樸€佹憳瑕併€佹棩鏈熴€乻lug 閮戒娇鐢ㄧ幇鏈夊畨鍏ㄥ嚱鏁板鐞嗭紝涓嶈緭鍑?`undefined` / `null`銆?
- 鏈慨鏀?`/articles` 椤甸潰涓氬姟閫昏緫銆丠ero銆佹悳绱㈠尯銆佸垎绫诲尯銆佺簿閫夊伐鍏峰尯銆佸悎浣滄帹骞垮尯銆佸悗鍙般€佹暟鎹簱銆丷LS 鎴?Turnstile銆?

妫€鏌ョ粨鏋滐細
- 宸茶繍琛?`npm run build`锛岄€氳繃銆?

浠诲姟锛氶椤碘€滅簿閫夊伐鍏封€濆尯鍩熸墜鏈虹鍐嶆浼樺寲锛屾敼鎴愮揣鍑戝皬鍥炬爣鍒楄〃锛屾闈㈢淇濇寔澶у崱銆?

鏀瑰姩鏂囦欢锛?
- `src/components/home/home-featured-tools.tsx`
- `src/components/home/home-tool-card.tsx`
- `docs/TASK_LOG.md`

妫€鏌ヤ笌淇锛?
- 妗岄潰绔户缁繚鐣欑幇鏈夋墜缁樺ぇ鍗￠鏍硷紝`md` 鍙婁互涓婁粛鏄剧ず澶у崱銆?
- 鎵嬫満绔敼鎴愮揣鍑戝皬鍒楄〃鍗★細宸︿晶棣栧瓧姣嶅浘鏍囧潡锛屼腑闂村伐鍏峰悕銆佺畝浠嬨€佹爣绛撅紝鍙充晶灏忓彿 `璇︽儏` 鎸夐挳銆?
- 鎵嬫満绔殣钘忓ぇ鎻掔敾鍖恒€侀€傚悎璋佹ā鍧楀拰澶ч潰绉暀鐧斤紝鍗曢」楂樺害鍘嬬缉鍒版洿杞荤殑娴忚鑺傚銆?
- 绮鹃€夊伐鍏峰尯甯冨眬涓烘墜鏈哄崟鍒椼€乣md` 涓ゅ垪銆乣lg` 涓夊垪锛屽綋鍓?3 涓伐鍏峰湪妗岄潰绔粛淇濇寔鍚屼竴琛屻€?
- 涓嶆樉绀鸿闂畼缃戞寜閽紝涓嶆樉绀烘敹钘忔寜閽€?
- 鏈鏈慨鏀?Hero銆佹悳绱㈠尯銆佸垎绫诲尯銆佹渶鏂版枃绔犲尯銆佸悎浣滄帹骞垮尯銆佸悗鍙般€佹暟鎹簱銆丷LS 鎴?Turnstile銆?

妫€鏌ョ粨鏋滐細
- 宸茶繍琛?`npm run build`锛岄€氳繃銆?
- 宸茬敤鏈湴娴忚鍣ㄦ鏌ユ闈?1280x720锛氬彲瑙?3 寮犲ぇ鍗★紝棣栧紶鍗＄墖楂樺害绾?441px锛屾闈㈠ぇ鍗＄粨鏋勪繚鐣欍€?
- 宸茬敤鏈湴娴忚鍣ㄦ鏌ョЩ鍔?390x844锛氬彲瑙?3 鏉＄揣鍑戝垪琛ㄩ」锛岄寮犲崱鐗囬珮搴︾害 105px锛屾棤妯悜婧㈠嚭锛屾棤 `undefined` / `null`銆?

浠诲姟锛氶椤碘€滅簿閫夊伐鍏封€濆尯鍩熸墜鏈虹鍗曠嫭浼樺寲锛屾敼涓虹揣鍑戝皬鍥炬爣鍒楄〃銆?

鏀瑰姩鏂囦欢锛?
- `src/components/home/home-featured-tools.tsx`
- `src/components/home/home-tool-card.tsx`
- `docs/TASK_LOG.md`

妫€鏌ヤ笌淇锛?
- 妗岄潰绔户缁繚鐣欑幇鏈夋墜缁樺ぇ鍗￠鏍硷紝涓嶅ぇ鏀广€?
- 鎵嬫満绔敼涓虹揣鍑戝皬鍒楄〃鍗★細宸︿晶棣栧瓧姣嶅浘鏍囧潡锛屼腑闂村伐鍏峰悕銆佺畝浠嬨€佹爣绛撅紝鍙充晶灏忓彿 `璇︽儏` 鎸夐挳銆?
- 鎵嬫満绔殣钘忓ぇ鎻掔敾鍖恒€侀€傚悎璋佹ā鍧椼€佸ぇ鐣欑櫧鍜岃繃楂樻寜閽尯锛屽崟椤归珮搴︽帶鍒跺湪鏇寸揣鍑戣寖鍥村唴銆?
- 鍗＄墖鍝嶅簲寮忓弻褰㈡€佸凡瀹屾垚锛歚md` 鍙婁互涓婃樉绀烘闈㈠ぇ鍗★紝`md` 浠ヤ笅鏄剧ず鎵嬫満鍒楄〃鍗°€?
- 绮鹃€夊伐鍏峰尯甯冨眬璋冩暣涓烘墜鏈哄崟鍒椼€乣md` 涓ゅ垪銆乣lg` 涓夊垪锛屽綋鍓嶄粎 3 涓伐鍏锋椂妗岄潰绔粛涓€琛?3 涓€?
- 鏈慨鏀瑰畼缃戞寜閽€佹敹钘忔寜閽€佸伐鍏锋暟鎹潵婧愩€丠ero銆佹悳绱㈠尯銆佸垎绫诲尯銆佹渶鏂版枃绔犲尯銆佸悎浣滄帹骞垮尯銆佸悗鍙般€佹暟鎹簱銆丷LS 鎴?Turnstile銆?

妫€鏌ョ粨鏋滐細
- 宸茶繍琛?`npm run build`锛岄€氳繃銆?

浠诲姟锛氶椤碘€滅簿閫夊伐鍏封€濆尯鍩熷崟鐙噸鍐欙紝璁?3 涓伐鍏峰湪妗岄潰绔悓涓€琛岋紝缁熶竴鎴愭墜缁樹俊鎭崱銆?

鏀瑰姩鏂囦欢锛?
- `src/components/home/home-featured-tools.tsx`
- `src/components/home/home-tool-card.tsx`
- `docs/TASK_LOG.md`

妫€鏌ヤ笌淇锛?
- 宸插皢绮鹃€夊伐鍏峰尯鏀逛负妗岄潰 3 鍒椼€佸钩鏉?2 鍒椼€佹墜鏈哄崟鍒楃殑缁熶竴甯冨眬锛屽綋鍓嶄粎 3 涓伐鍏锋椂浼氱ǔ瀹氬悓涓€琛屾樉绀恒€?
- 宸ュ叿鍗＄粺涓€涓烘墜缁樹俊鎭崱椋庢牸锛屽幓鎺変簡鍓嶄袱涓ぇ鍗°€佺涓変釜鎺夎鐨勯棶棰樸€?
- 鍗＄墖鍐呴儴淇濈暀鎵嬬粯鎻掔敾鍖恒€佸伐鍏烽瀛楁瘝銆佸垎绫汇€佹爣绛俱€佸伐鍏峰悕銆佺畝浠嬨€侀€傚悎璋佸拰 `鏌ョ湅璇︽儏` 鎸夐挳銆?
- 涓嶆樉绀?`璁块棶瀹樼綉` 鎸夐挳锛屼笉鏄剧ず鏀惰棌鎸夐挳銆?
- 鍗＄墖楂樺害灏介噺缁熶竴锛屽苟淇濇寔 `tools.length` 涓虹┖鏃剁殑绌虹姸鎬佹枃妗堛€?
- 鏈鏈慨鏀?Hero銆佹悳绱㈠尯銆佸垎绫诲尯銆佹渶鏂版枃绔犲尯銆佸悎浣滄帹骞垮尯銆佸悗鍙般€佹暟鎹簱銆丷LS 鎴?Turnstile銆?

妫€鏌ョ粨鏋滐細
- 宸茶繍琛?`npm run build`锛岄€氳繃銆?

浠诲姟锛氶椤碘€滄寜鍦烘櫙娴忚鈥濆垎绫诲尯鍗曠嫭閲嶅啓锛岃鍒嗙被鍏ュ彛鏇村儚鎵嬬粯渚垮埄璐淬€?

鏀瑰姩鏂囦欢锛?
- `src/components/home/home-category-section.tsx`
- `docs/TASK_LOG.md`

妫€鏌ヤ笌淇锛?
- 宸插皢鈥滄寜鍦烘櫙娴忚鈥濇敼鎴愭洿鍍忔墜缁樼焊鐗?/ 渚垮埄璐寸殑鍒嗙被鍏ュ彛锛屼繚鐣欐爣棰樹笉鍙樸€?
- 鍒犻櫎浜嗘姠鐪肩殑鈥滃満鏅叆鍙ｂ€濆皬鏍囩锛岄《閮ㄦ枃妗堟洿杞汇€?
- 鍒嗙被鍗＄墖鏀逛负 4 寮犳祬鑹叉墜缁樺崱锛歚AI 宸ュ叿`銆乣鍦ㄧ嚎宸ュ叿`銆乣鏁堢巼杞欢`銆乣寮€婧愰」鐩甡銆?
- 妗岄潰绔?4 鍒楋紝骞虫澘 2 鍒楋紝鎵嬫満 2 鍒楋紱鍗＄墖楂樺害淇濇寔绱у噾銆?
- 姣忓紶鍗＄墖閮藉甫绠€绗?SVG 鍥炬爣锛岀偣鍑讳粛鐒惰烦杞?`/tools`銆?
- 鏈鏈慨鏀?Hero銆佹悳绱㈠尯銆佺簿閫夊伐鍏峰尯銆佹渶鏂版枃绔犲尯銆佸悎浣滄帹骞垮尯銆佸悗鍙般€佹暟鎹簱銆丷LS 鎴?Turnstile銆?

妫€鏌ョ粨鏋滐細
- 宸茶繍琛?`npm run build`锛岄€氳繃銆?

浠诲姟锛氶椤垫悳绱㈡潯鍗曠嫭閲嶅啓锛岃鎼滅储鍖哄煙鏇寸畝娲併€佺揣鍑戝苟璐磋繎鎵嬬粯鏁堟灉鍥俱€?

鏀瑰姩鏂囦欢锛?
- `src/components/home/home-search-section.tsx`
- `docs/TASK_LOG.md`

妫€鏌ヤ笌淇锛?
- 宸插皢棣栭〉鎼滅储鍖烘浛鎹负鎵嬬粯鍦嗚鐧借壊鍗＄墖锛屽苟閫氳繃 `-mt-7` 涓?Hero 鍋氳交寰彔鍘嬭鎺ャ€?
- 鍒犻櫎鎼滅储鏉″墠闈㈢殑 `鎼滅储鍏ュ彛`銆乣蹇€熸壘鍒板伐鍏锋垨鏂囩珷` 绛夊浣欐枃妗堛€?
- 鎼滅储鍖轰粎淇濈暀鎼滅储杈撳叆妗嗐€佹悳绱㈡寜閽拰鐑棬鍏抽敭璇?chips锛歚AI`銆乣璁捐`銆乣鏁堢巼`銆乣寮€婧恅銆?
- 淇濈暀 `action="/search"`銆乣name="q"` 鍜屽鎴风 `router.push()` 璺宠浆閫昏緫锛屽叧閿瘝浼氳繘鍏?`/search?q=鍏抽敭璇峘锛岀┖鍏抽敭璇嶈繘鍏?`/search`銆?
- 鐑棬鍏抽敭璇嶆敼涓?`Link` 鐩磋揪 `/search?q=鍏抽敭璇峘銆?
- 鏈娇鐢?clipboard API锛屾湭璋冪敤 `navigator.clipboard.writeText`銆?
- 鏈鏈慨鏀?`home-hero.tsx`銆乣/tools`銆乣/tools/[slug]`銆佸垎绫诲尯銆佺簿閫夊伐鍏峰尯銆佹渶鏂版枃绔犲尯銆佸悎浣滄帹骞垮尯銆佸悗鍙般€佹暟鎹簱銆丷LS銆乀urnstile 鎴栨悳绱㈤〉涓氬姟閫昏緫銆?

妫€鏌ョ粨鏋滐細
- 宸茶繍琛?`npm run build`锛岄€氳繃銆?

浠诲姟锛氶椤?Hero 鏍囬鍖虹簿淇紝鍙紭鍖栧乏渚ф爣棰樻捣鎶ユ劅銆?

鏀瑰姩鏂囦欢锛?
- `src/components/home/home-hero.tsx`
- `docs/TASK_LOG.md`

妫€鏌ヤ笌淇锛?
- 鏈浠呬慨鏀?Hero 宸︿晶鏍囬鍖哄煙锛屽彸渚ф墜缁樻帶鍒跺彴淇濇寔涓嶅彉銆?
- 淇濈暀 `浜哄伐绛涢€?路 閫傚悎灏忕櫧` 灏忔爣绛俱€乣KT涓ラ€塦 涓绘爣棰樸€? 涓?chips 鍜?`杩涘叆宸ュ叿搴揱 / `闃呰鏂囩珷` 涓や釜鎸夐挳銆?
- 鍒犻櫎鏍囬涓嬫柟绠€浠嬫枃妗堬紝鍑忓皯 Hero 宸︿晶绾靛悜鍗犵敤銆?
- 灏嗘墜缁樹笅鍒掔嚎浠庢爣棰?absolute 瑁呴グ鏀逛负鏍囬涓嬫柟鐙珛涓€琛岋紝閬垮厤鍘嬩綇 `KT涓ラ€塦銆?
- 鏍囬鏀逛负 `KT` 涓?`涓ラ€塦 鍒嗙粍鐨勬墜缁樻捣鎶ュ紡鎺掔増锛屽鍔犳祬钃?/ 榛勮壊鎵嬬粯鑹插潡銆侀粍鑹插渾鐐瑰拰鏄熷舰鐐圭紑锛涙湭寮曞叆瀛椾綋鏂囦欢鎴栨柊渚濊禆銆?
- 绉诲姩绔爣棰樹娇鐢ㄦ洿淇濆畧鐨?`clamp(4rem,16vw,7.2rem)`锛岄伩鍏嶆í鍚戞孩鍑恒€?
- 鏈鏈慨鏀?`/tools`銆乣/tools/[slug]`銆佹悳绱㈠尯銆佸垎绫诲尯銆佺簿閫夊伐鍏峰尯銆佹渶鏂版枃绔犲尯銆佸悎浣滄帹骞垮尯銆佸悗鍙般€佹暟鎹簱銆丷LS 鎴?Turnstile銆?

妫€鏌ョ粨鏋滐細
- 宸茶繍琛?`npm run build`锛岄€氳繃銆?

浠诲姟锛氶椤?Hero 鍖哄崟鐙噸鍐欙紝璁╅灞忔洿鎺ヨ繎鈥滅畝绗旀墜缁?+ 娓呮柊骞磋交 + 鏉傚織鎰熷伐鍏峰彂鐜扮珯鈥濄€?

鏀瑰姩鏂囦欢锛?
- `src/components/home/home-hero.tsx`
- `docs/TASK_LOG.md`

妫€鏌ヤ笌淇锛?
- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DESIGN_SYSTEM.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- 宸叉寜鏈鑼冨洿浠呮浛鎹?`HomeHero` 缁勪欢锛屾湭鏀瑰姩鎼滅储鍖恒€佸垎绫诲尯銆佺簿閫夊伐鍏峰尯銆佹渶鏂版枃绔犲尯銆佸悎浣滄帹骞垮尯鎴栧叾浠栭〉闈€?
- Hero 涓绘爣棰樹繚鎸佷负 `KT涓ラ€塦锛屽壇鏍囬鏀逛负鈥滀汉宸ョ瓫閫夊疄鐢ㄥ伐鍏枫€佷紭璐ㄦ枃绔犲拰娓呮櫚鍙潬鐨勪娇鐢ㄧ粡楠岋紝甯綘鏇村揩鎵惧埌鍊煎緱灏濊瘯鐨勬暟瀛楀伐鍏枫€傗€?
- 淇濈暀 `杩涘叆宸ュ叿搴揱銆乣闃呰鏂囩珷` 涓や釜鎸夐挳锛屼互鍙?`浜哄伐绛涢€塦銆乣鎸佺画鏇存柊`銆乣鏉ユ簮娓呮櫚`銆乣閫傚悎灏忕櫧` 鍥涗釜 chips銆?
- 鍙充晶鏀逛负鏇村ぇ鐨勬墜缁樻帶鍒跺彴锛屽彧灞曠ず鐪熷疄 `toolCount`銆乣articleCount` 鍜屼紶鍏ュ伐鍏峰垪琛ㄥ墠 3 涓伐鍏峰悕锛涙棤宸ュ叿鏃朵娇鐢ㄢ€滅瓑寰呮敹褰曗€濆厹搴曪紝涓嶆樉绀?`undefined` / `null`銆?
- 鎵嬫満绔户缁殣钘忓彸渚уぇ鎺у埗鍙帮紝浠呮樉绀轰竴鏉＄湡瀹炴暟閲忚兌鍥婏紝閬垮厤 Hero 棣栧睆杩囬珮銆?
- `src/components/home/home-page.tsx` 褰撳墠浼犲弬宸插寘鍚?`articleCount={articles.length}`锛屼笌鏂扮粍浠?props 鍖归厤锛屾湰娆℃湭淇敼銆?
- 鏈鏈慨鏀?`/tools`銆乣/tools/[slug]`銆乣/articles`銆乣/submit`銆乣/copyright`銆乣/admin/*`銆乀urnstile銆丼upabase RLS銆佹暟鎹簱 schema銆佸悗鍙?CRUD銆佹悳绱㈠尯銆佸垎绫诲尯銆佺簿閫夊伐鍏峰尯銆佹渶鏂版枃绔犲尯鎴栧悎浣滄帹骞垮尯銆?

妫€鏌ョ粨鏋滐細
- 宸茶繍琛?`npm run build`锛岄€氳繃銆?

浠诲姟锛氶椤?`/` 鎵嬬粯椋庝簩娆＄簿淇紝鎸夊弬鑰冨浘鍋氳瑙夐檷鍣€佹枃妗堢畝鍖栧拰鐗堝紡鍘嬬缉銆?

鏀瑰姩鏂囦欢锛?
- `src/app/page.tsx`
- `src/components/home/home-page.tsx`
- `src/components/home/home-hero.tsx`
- `src/components/home/home-search-section.tsx`
- `src/components/home/home-category-section.tsx`
- `src/components/home/home-featured-tools.tsx`
- `src/components/home/home-tool-card.tsx`
- `src/components/home/home-latest-articles.tsx`
- `src/components/home/home-sponsor-banner.tsx`
- `docs/TASK_LOG.md`

妫€鏌ヤ笌淇锛?
- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DESIGN_SYSTEM.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- Hero 涓绘爣棰樺凡鏀逛负 `KT涓ラ€塦锛岄《閮ㄥ鑸搧鐗屽悕浠嶄繚鐣?`鐭ヤ韩`銆?
- Hero 鍓爣棰樺凡鏀逛负鎸囧畾鐨勪汉宸ョ瓫閫夊伐鍏枫€佹枃绔犲拰缁忛獙璇存槑銆?
- Hero 瑁呴グ宸查檷鍣細鍘绘帀澶ч潰绉綉鏍笺€佹暎钀界澶村拰杩囧瑁呴グ锛屽彧淇濈暀浜戞湹銆佺焊椋炴満銆佸皯閲忔槦鏄熷拰钖勮嵎缁挎墜缁樹笅鍒掔嚎銆?
- 鍙充晶鎺у埗鍙版爣棰樻敼涓?`鐭ヤ韩鎺у埗鍙癭锛屽彧淇濈暀鐪熷疄 `tools.length` 鍜?`articles.length` 涓や釜缁熻锛屾渶杩戞洿鏂版敼鎴愪竴琛屽皬鑳跺泭锛屾墜鏈虹缁х画闅愯棌鎺у埗鍙般€?
- 鎼滅储鍖哄垹闄?`鎼滅储鍏ュ彛` 鍜?`蹇€熸壘鍒板伐鍏锋垨鏂囩珷`锛屾敼涓虹揣鍑戜竴浣撳寲鎼滅储鏉★紝淇濈暀 `/search?q=鍏抽敭璇峘 璺宠浆銆?
- 鐑棬鍏抽敭璇嶅帇缂╀负 `AI`銆乣璁捐`銆乣鏁堢巼`銆乣寮€婧恅銆?
- 鍒嗙被鍖虹户缁繚鐣?4 涓叆鍙ｏ紝妗岄潰 4 鍒椼€佹墜鏈?2 鍒楋紝鍗＄墖楂樺害鍜岄棿璺濆凡鏀剁揣銆?
- 绮鹃€夊伐鍏峰尯鏀逛负鏈€澶?3 涓伐鍏凤紝妗岄潰绔?3 寮犵瓑瀹戒腑鍨嬫墜缁樺崱锛岄伩鍏嶇涓夊紶鍗＄墖鍗曠嫭鎺夊埌涓嬩竴琛屻€?
- 棣栭〉宸ュ叿鍗＄户缁彧鏄剧ず `鏌ョ湅璇︽儏`锛屼笉鏄剧ず `璁块棶瀹樼綉`銆佹敹钘忔寜閽垨瀹樼綉鍏ュ彛銆?
- 鏈€鏂版枃绔犲尯鍜屽悎浣滄帹骞挎í骞呭凡鍚屾鍘嬬缉闂磋窛鍜岄珮搴︺€?
- 鏈鏈慨鏀?`/tools` 椤甸潰銆佸伐鍏疯鎯呴〉銆佹枃绔犱笟鍔￠€昏緫銆佹姇绋块〉銆佹姇璇夐〉銆佸悗鍙般€乀urnstile銆丷LS銆佹暟鎹簱 schema銆乻itemap 鎴?robots銆?

妫€鏌ョ粨鏋滐細
- 宸茶繍琛?`npm run build`锛岄€氳繃銆?

浠诲姟锛氱户缁噸鍋氶椤?`/` 鐨勮瑙夋瘮渚嬩笌鎵嬬粯缁勪欢缁撴瀯锛屼娇鍏舵洿鎺ヨ繎鈥滅畝绗旀墜缁?SaaS 棣栭〉鏁堟灉鍥锯€濄€?

鏀瑰姩鏂囦欢锛?
- `src/components/home/home-header.tsx`
- `src/components/home/home-page.tsx`
- `src/components/home/home-hero.tsx`
- `src/components/home/home-search-section.tsx`
- `src/components/home/home-category-section.tsx`
- `src/components/home/home-featured-tools.tsx`
- `src/components/home/home-tool-card.tsx`
- `src/components/home/home-latest-articles.tsx`
- `src/components/home/home-trust-section.tsx`
- `src/components/home/home-visual-utils.ts`
- `docs/TASK_LOG.md`

妫€鏌ヤ笌淇锛?
- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DESIGN_SYSTEM.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- 鏂板 `homeShellClassName`锛岄椤靛鑸€丠ero銆佹悳绱€佸垎绫汇€佺簿閫夊伐鍏枫€佹渶鏂版枃绔犮€佸彲淇¤鏄庡拰鍚堜綔妯箙缁熶竴浣跨敤 `max-width: 1280px` 鐨勯椤靛鍣紝淇涓讳綋杩囩獎闂銆?
- Hero 閲嶆柊閲嶆瀯涓烘闈㈢宸︿晶澶ф爣棰樸€佸彸渚уぇ鍙锋墜缁樻帶鍒跺彴缁撴瀯锛涙闈?1280x720 涓?Hero 瀹炴祴楂樺害绾?437px銆?
- Hero 鏍囬澧炲姞 `DoodleUnderline` 鎵嬬粯涓嬪垝绾匡紝鑳屾櫙鍔犲叆浣庨€忔槑缃戞牸鍜屾垚缁勪簯鏈点€佺焊椋炴満銆佺澶淬€佹槦鏄熻楗帮紝閬垮厤闆舵暎灏忕偣缂€銆?
- Hero 鍙充晶鎺у埗鍙版敼涓?`SketchPanel` 鎵嬬粯鐧芥澘 / 鐢佃剳绐楀彛缁撴瀯锛屽寘鍚兌甯︺€佺獥鍙ｅ渾鐐广€佽櫄绾裤€佺粺璁′究绛俱€佹渶杩戞洿鏂板拰鍙充笅瑙掍究绛俱€?
- Hero 鎺у埗鍙扮户缁彧浣跨敤鐪熷疄鏁版嵁锛歚tools.length`銆乣articles.length`銆佹渶杩?3 涓伐鍏峰悕绉板拰棣栧瓧姣?fallback锛涙棤鍋囨暟瀛椼€佹棤鍟嗕笟 logo銆?
- 鎵嬫満绔崟鐙帇缂?Hero锛氶殣钘忓彸渚ф帶鍒跺彴锛屾寜閽敼涓哄弻鍒楋紝淇濈暀灏忓瀷鈥滃凡鏀跺綍 X 涓伐鍏封€濊兌鍥婏紱390px 瑙嗗彛涓?Hero 瀹炴祴绾?449px銆?
- 鎼滅储鍖洪噸鍋氫负涓?Hero 琛旀帴鐨勭櫧鑹蹭竴浣撳寲鎵嬬粯鎼滅储鏉★紝缁熶竴棣栭〉瀹藉害锛屼繚鐣?`/search?q=鍏抽敭璇峘 鍜岀┖鎼滅储 `/search` 閫昏緫銆?
- 鍒嗙被鍖洪噸鍋氫负鏇存槑鏄剧殑 4 涓祬鑹叉墜缁樺叆鍙ｅ崱锛屾闈?4 鍒椼€佹墜鏈?2 鍒楋紝鐐瑰嚮浠嶈繘鍏?`/tools`銆?
- 绮鹃€夊伐鍏峰尯閲嶅仛甯冨眬锛屾闈㈢鍓?2 涓伐鍏蜂粠 `lg` 璧峰苟鎺掓í鍚戝ぇ鍗★紝鍚庣画宸ュ叿涓虹揣鍑戝皬鍗°€?
- `HomeToolCard` 閲嶅啓涓哄ぇ鍗♀€滃乏渚ф墜缁樻彃鐢诲尯 + 鍙充晶淇℃伅鍖衡€濓紝灏忓崱闄嶄綆楂樺害锛屽彧鏄剧ず宸ュ叿鍚嶃€佺畝浠嬨€佸垎绫?/ 鏍囩鍜屸€滄煡鐪嬭鎯呪€濓紝涓嶅睍绀哄畼缃戞垨鏀惰棌銆?
- 鏈€鏂版枃绔犲尯淇濈暀 published articles 鍓?3 绡囷紝缁熶竴棣栭〉瀹藉害锛屾枃绔犲崱缁х画淇濇寔渚跨绾歌瑙夊拰 fallback銆?
- 鏈鏈慨鏀?`/tools`銆乣/tools/[slug]`銆乣/articles` 涓氬姟閫昏緫銆乣/submit`銆乣/copyright`銆乣/admin/*`銆乀urnstile銆丷LS銆佹暟鎹簱 schema銆乻itemap銆乺obots 鎴栧悗鍙?CRUD銆?

妫€鏌ョ粨鏋滐細
- 宸茶繍琛?`npm run build`锛岄€氳繃銆?
- 宸查噸鍚?`npm run dev -- -p 3001`锛岄椤?`/` 杩斿洖 200銆?
- 宸茬敤 in-app browser 妫€鏌ユ闈?1280x720锛氶椤典富瀹瑰櫒瀹藉害绾?1265px锛孒ero銆佹悳绱㈡潯鍜屾寜鍦烘櫙娴忚璧峰鍖哄煙鍙锛屾棤妯悜婧㈠嚭銆?
- 宸茬敤 Chrome DevTools 寮哄埗 390x844 绉诲姩瑙嗗彛妫€鏌ワ細鍙充晶鎺у埗鍙伴殣钘忥紝`scrollWidth = 390`锛屾棤妯悜婊氬姩锛屾棤 `undefined` / `null` / `NaN` 鏂囨銆?
- 宸茬敤 HTTP 妫€鏌?`/search?q=AI`銆乣/tools`銆乣/tools/open-design`銆乣/submit`銆乣/copyright`銆乣/admin/login` 鍧囪繑鍥?200銆?

## 2026-06-06

浠诲姟锛氭寜绗笁寮犫€滅畝绗旀墜缁?SaaS 棣栭〉鏁堟灉鍥锯€濆啀娆￠噸鍋氶椤?`/`銆?

鏀瑰姩鏂囦欢锛?
- `src/app/page.tsx`
- `src/components/home/home-page.tsx`
- `src/components/home/home-hero.tsx`
- `src/components/home/home-search-section.tsx`
- `src/components/home/home-category-section.tsx`
- `src/components/home/home-featured-tools.tsx`
- `src/components/home/home-tool-card.tsx`
- `src/components/home/home-latest-articles.tsx`
- `src/components/home/home-article-card.tsx`
- `src/components/home/home-sponsor-banner.tsx`
- `src/components/home/home-visual-utils.ts`
- `docs/TASK_LOG.md`

妫€鏌ヤ笌淇锛?
- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DESIGN_SYSTEM.md`銆乣docs/DATABASE_SCHEMA.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- 棣栭〉鏁版嵁鍏ュ彛鏀逛负 `Promise.all([getPublishedTools(), getPublishedArticles()])`锛屽悓鏃惰鍙?published tools 鍜?published articles銆?
- `HomePage` props 澧炲姞 `articles`锛岄〉闈㈢粨鏋勮皟鏁翠负锛氶椤典笓灞炲鑸€丠ero銆佹悳绱㈠尯銆佹寜鍦烘櫙娴忚銆佺簿閫夊伐鍏枫€佹渶鏂版枃绔犮€佸彲淇¤鏄?/ 鏀跺綍鍘熷垯銆佸悎浣滄帹骞挎í骞呫€佺幇鏈?footer銆?
- Hero 閲嶅仛涓烘洿绱у噾鐨勬墜缁?SaaS 棣栭〉涓昏瑙夛細宸︿晶淇濈暀鎸囧畾鏍囩銆佹爣棰樸€佸壇鏍囬銆? 涓?chips 鍜屼袱涓寜閽紱鍙充晶鏀逛负妗岄潰绔墜缁樻帶鍒跺彴銆?
- Hero 鎺у埗鍙板彧鏄剧ず鐪熷疄鏁版嵁锛氬凡鏀跺綍宸ュ叿鏁般€佸凡鍙戝竷鏂囩珷鏁般€佹渶杩?3 涓伐鍏峰悕绉?/ 棣栧瓧姣嶏紱鏃犲伐鍏锋椂鏄剧ず鈥滅瓑寰呮敹褰曗€濓紝娌℃湁浣跨敤鍋囨暟瀛楁垨鍟嗕笟 logo銆?
- 鎵嬫満绔殣钘?Hero 鍙充晶鎺у埗鍙帮紝浠呬繚鐣欐牳蹇冩枃妗堛€乧hips 鍜屾寜閽紝鍑忓皯棣栧睆楂樺害銆?
- 鎼滅储鍖烘敼涓虹揣鍑戞墜缁樺渾瑙掓悳绱㈡澘锛屼繚鐣?`/search?q=鍏抽敭璇峘 璺宠浆銆佺┖鎼滅储 `/search` 鍜屽師鐢?GET 鍏滃簳锛涚儹闂ㄥ叧閿瘝缁х画璺宠浆鎼滅储椤点€?
- 鍒嗙被鍖烘爣棰樻敼涓衡€滄寜鍦烘櫙娴忚鈥濓紝灞曠ず AI 宸ュ叿銆佸湪绾垮伐鍏枫€佹晥鐜囪蒋浠躲€佸紑婧愰」鐩?4 涓叆鍙ｏ紝鎵嬫満绔繚鎸?2 鍒椼€?
- 绮鹃€夊伐鍏峰尯鏀逛负鍓?2 涓伐鍏锋í鍚戝ぇ鍗★紝鍚庣画宸ュ叿涓虹揣鍑戝皬鍗★紱鍗＄墖鍙睍绀哄悕绉般€佺畝浠嬨€佸垎绫汇€佹爣绛俱€侀€傚悎璋佸拰鈥滄煡鐪嬭鎯呪€濓紝涓嶅睍绀哄畼缃戞垨鏀惰棌銆?
- 鏈€鏂版枃绔犲尯閲嶆柊鎺ュ叆棣栭〉锛屽睍绀?published articles 鍓?3 绡囷紱鏂囩珷鍗℃敼涓烘墜缁樹究绛鹃锛屾敮鎸佹棩鏈熷拰鎽樿 fallback銆?
- 鏂板绱у噾鍙俊璇存槑 section锛屽睍绀烘潵婧愭竻鏅般€佸姛鑳芥槑纭€侀闄╂彁閱掋€佷汉宸ユ暣鐞?4 涓師鍒欍€?
- 鍚堜綔鎺ㄥ箍妯箙鏀逛负娴呯豢 / 娴呰摑鎵嬬粯 banner锛屾寜閽户缁摼鎺ョ幇鏈?`/submit`锛屾湭鏂板鍚堜綔椤甸潰銆?
- 鏈鏈慨鏀?`/tools`銆乣/tools/[slug]`銆乣/articles` 涓氬姟閫昏緫銆乣/submit`銆乣/copyright`銆乣/admin/*`銆乀urnstile銆丷LS銆佹暟鎹簱 schema銆乻itemap銆乺obots 鎴栧悗鍙?CRUD銆?

妫€鏌ョ粨鏋滐細
- 宸茶繍琛?`npm run build`锛岄€氳繃锛涙瀯寤烘棩蹇楁樉绀洪椤?`/` 涓哄姩鎬侀〉闈紝褰撳墠 published tools 涓?`open-design,raycast,chatgpt`銆?
- 宸插惎鍔?`npm run dev -- -p 3001` 鍋氬共鍑€绔彛楠岃瘉锛宍/`銆乣/search?q=AI`銆乣/tools/open-design` 鍧囪繑鍥?200銆?
- 宸茬敤 in-app browser 妫€鏌ユ闈?1280x720锛欻ero銆佹墜缁樻帶鍒跺彴銆佹悳绱㈡潯銆佸満鏅尯璧峰浣嶇疆鍙锛屾棤妯悜婧㈠嚭銆?
- 宸茬敤 Chrome DevTools 寮哄埗 390x844 绉诲姩瑙嗗彛妫€鏌ワ細Hero 鍙充晶鎺у埗鍙伴殣钘忥紝椤堕儴鑿滃崟鍙锛屽垎绫诲尯涓?2 鍒楋紝`scrollWidth` 绛変簬瑙嗗彛瀹藉害锛屾棤妯悜婧㈠嚭銆?
- 宸插湪绉诲姩瑙嗗彛瑙﹀彂琛ㄥ崟鎼滅储锛岃緭鍏?`AI` 鍚庤烦杞埌 `/search?q=AI`銆?
- 宸茬敤 HTTP 妫€鏌?`/submit`銆乣/copyright`銆乣/admin/login` 鍧囪繑鍥?200銆?

## 2026-06-06

浠诲姟锛氫簩娆￠噸鍋氶椤?`/`锛岃繘涓€姝ヨ创杩戔€滅畝绗旀墜缁橀鏍兼晥鏋滃浘鈥濄€?

鏀瑰姩鏂囦欢锛?
- `src/app/page.tsx`
- `src/components/home/home-page.tsx`
- 鏂板 `src/components/home/home-header.tsx`
- `src/components/home/home-hero.tsx`
- `src/components/home/home-search-section.tsx`
- `src/components/home/home-category-section.tsx`
- `src/components/home/home-featured-tools.tsx`
- `src/components/home/home-tool-card.tsx`
- `src/components/home/home-sponsor-banner.tsx`
- `src/components/home/home-visual-utils.ts`
- `docs/TASK_LOG.md`

妫€鏌ヤ笌淇锛?
- 寮€鍙戝墠宸查噸鏂伴槄璇?`docs/PROJECT_RULES.md`銆乣docs/DESIGN_SYSTEM.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- 棣栭〉缁撴瀯鏀舵暃涓猴細棣栭〉涓撳睘瀵艰埅銆丠ero 鎵嬬粯涓昏瑙夈€佺揣鍑戞悳绱㈡潯銆佹寜浣跨敤鍦烘櫙寮€濮嬫祻瑙堛€佺簿閫夊伐鍏枫€佸悎浣滄帹骞挎í骞呫€佺幇鏈?footer銆?
- 鏂板棣栭〉涓撳睘 `HomeHeader`锛屼繚鐣欓椤点€佸伐鍏峰簱銆佹枃绔犮€佹姇绋裤€佺増鏉冩姇璇夈€佹悳绱€佹帹鑽愬伐鍏风瓑涓昏鍏ュ彛锛屼笉淇敼鍏ㄧ珯鍏变韩 Header锛岄伩鍏嶅奖鍝?`/tools` 绛夐〉闈€?
- Hero 閲嶅啓涓烘洿鏄庢樉鐨勬墜缁橀椤典富瑙嗚锛氭祬钃濈綉鏍艰儗鏅€佷簯鏈点€佺焊椋炴満銆佹尝娴嚎銆佹墜鍐欎笅鍒掔嚎銆佸乏渚у搧鐗屾枃妗堝拰鍙充晶鎻掔敾鎺у埗鍙般€?
- Hero 鍙充晶鎺у埗鍙版敼涓虹櫧鑹叉墜缁樼焊鏉匡細鍖呭惈鐪熷疄 published 宸ュ叿鎬绘暟銆佸垎绫诲鑸叆鍙ｃ€佹渶杩?3 涓湡瀹炲伐鍏峰悕銆丩IVE 鑳跺泭銆佷究绛惧拰棣栧瓧姣?fallback锛涙湭浣跨敤鍋囨暟瀛楁垨鐪熷疄鍟嗕笟 logo銆?
- 绉诲姩绔殣钘忓彸渚уぇ鎺у埗鍙帮紝鍙繚鐣欐爣棰樸€佸壇鏍囬銆? 涓兌鍥娿€佷袱涓寜閽拰灏忓瀷鈥滀粖鏃ュ彂鐜?/ 宸叉敹褰曞伐鍏封€濈湡瀹炴暟鎹潯銆?
- 鎼滅储鍖烘敼涓哄渾娑︾殑涓€浣撳寲鐧借壊鎵嬬粯鍗＄墖锛屼繚鐣?`/search?q=鍏抽敭璇峘 璺宠浆鍜屽師鐢?GET 鍏滃簳銆?
- 鍒嗙被鍖烘爣棰樻敼涓衡€滄寜浣跨敤鍦烘櫙寮€濮嬫祻瑙堚€濓紝妗岄潰 4 鍒楋紝鎵嬫満 2 鍒楋紝鍗＄墖鍔犲叆渚跨鑳跺甫銆佹煍鍜岃壊鍧楀拰鎵嬬粯 SVG 鍥炬爣銆?
- 绮鹃€夊伐鍏峰尯鏍囬鏀逛负鈥滃厛鐪嬭繖浜涘疄鐢ㄥ伐鍏封€濓紝鍓爣棰樹负鈥滃府浣犲噺灏戣瘯閿欐垚鏈€濓紱宸ュ叿浼樺厛璇诲彇 `featured` / `is_featured` 瀛楁锛屾病鏈夊垯鍙栧墠 3 涓?published 宸ュ叿銆?
- 宸ュ叿鍗℃敼鎴愯交鎵嬬粯淇℃伅鍗★紝灞曠ず宸ュ叿鍚嶃€佷竴鍙ヨ瘽绠€浠嬨€佸垎绫汇€佹渶澶?2 涓爣绛俱€佲€滈€傚悎璋佲€濆拰鈥滄煡鐪嬭鎯呪€濇寜閽紱涓嶆樉绀衡€滆闂畼缃戔€濇垨鏀惰棌鎸夐挳銆?
- 鍚堜綔鎺ㄥ箍鍖烘敼鎴愭墜缁樻í鍚?banner锛屽姞鍏ョ焊椋炴満銆佺數鑴戠嚎绋垮拰瑁呴グ鑹插潡锛屾寜閽摼鎺ョ户缁娇鐢ㄧ幇鏈?`/submit`銆?
- 棣栭〉涓嶅啀娓叉煋鏂囩珷鍒楄〃鍜屾敹褰曞師鍒欐ā鍧楋紝鍑忓皯鍨傜洿闀垮害锛岃创鍚堟湰娆℃寚瀹氱粨鏋勶紱鏈垹闄ょ浉鍏虫棫缁勪欢鏂囦欢銆?
- 鏈鏈慨鏀?`/tools` 椤甸潰銆佸伐鍏疯鎯呴〉銆佹枃绔犻〉銆佹姇绋块〉銆佺増鏉冮〉銆佸悗鍙般€佹暟鎹簱 schema銆丷LS銆乀urnstile銆佹悳绱㈤〉鏍稿績閫昏緫鎴栧悗鍙?CRUD銆?
- `npm run build` 宸查€氳繃锛涙瀯寤烘棩蹇楃‘璁ら椤?`/` 涓哄姩鎬佹覆鏌撻〉闈紝骞惰鍙栧綋鍓?published 宸ュ叿 `open-design,raycast,chatgpt`銆?
- 宸查噸鍚?`npm run dev -- -p 3000`锛屾湰鍦伴椤佃繑鍥?200銆?
- 宸茬敤娴忚鍣ㄦ鏌ユ闈?1280x720锛氶灞忓彲瑙?Hero銆佹墜缁樻帶鍒跺彴銆佹悳绱㈡潯鍜屽満鏅爣棰橈紝鏃犳í鍚戞孩鍑恒€?
- 宸茬敤娴忚鍣ㄦ鏌ョЩ鍔?390x844锛氬ぇ鎺у埗鍙伴殣钘忥紝灏忔暟鎹潯鏄剧ず锛屽垎绫诲崱 2 鍒楋紝鏃犳í鍚戞孩鍑恒€?
- 宸茬敤娴忚鍣ㄥ疄娴嬮椤垫悳绱細杈撳叆 `AI` 鍚庤烦杞埌 `/search?q=AI`銆?
- 宸茬敤 HTTP 妫€鏌?`/tools/open-design` 杩斿洖 200锛屽伐鍏疯鎯呰烦杞洰鏍囨甯搞€?

## 2026-06-06

浠诲姟锛氭寜鈥滅畝绗旀墜缁?+ 娓呮柊骞磋交 + 鏉傚織鎰?SaaS 宸ュ叿鍙戠幇绔欌€濋噸鏂拌璁￠椤点€?

鏀瑰姩鏂囦欢锛?
- `src/app/page.tsx`
- `src/components/home/home-page.tsx`
- `src/components/home/home-hero.tsx`
- `src/components/home/home-search-section.tsx`
- `src/components/home/home-category-section.tsx`
- `src/components/home/home-featured-tools.tsx`
- `src/components/home/home-tool-card.tsx`
- `src/components/home/home-latest-articles.tsx`
- `src/components/home/home-article-card.tsx`
- `src/components/home/home-trust-section.tsx`
- `src/components/home/home-sponsor-banner.tsx`
- 鏂板 `src/components/home/home-visual-utils.ts`
- `docs/TASK_LOG.md`

妫€鏌ヤ笌淇锛?
- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DESIGN_SYSTEM.md`銆乣docs/DATABASE_SCHEMA.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- 棣栭〉缁撴瀯璋冩暣涓猴細鐜版湁 `SiteHeader`銆丠ero 鎵嬬粯涓昏瑙夈€佹悳绱㈠叆鍙ｃ€佹寜鍦烘櫙娴忚銆佺簿閫夊伐鍏枫€佹渶鏂版枃绔犮€佹敹褰曞師鍒欍€佸悎浣滄帹骞挎í骞呫€佺幇鏈?`SiteFooter`銆?
- Hero 涓绘枃妗堟敼涓衡€滆濂藉伐鍏?/ 鏇村鏄撹鍙戠幇鈥濓紝灏忔爣绛句负鈥滀汉宸ョ瓫閫?路 閫傚悎灏忕櫧鈥濓紝骞跺姞鍏ヤ汉宸ョ瓫閫夈€佹寔缁洿鏂般€佹潵婧愭竻鏅般€侀€傚悎灏忕櫧 chips銆?
- Hero 鍙充晶鏀逛负鎵嬬粯鈥滅煡浜帶鍒跺彴鈥濓紝鍙樉绀虹湡瀹?published 宸ュ叿鎬绘暟銆乸ublished 鏂囩珷鎬绘暟鍜屾渶杩?3 涓伐鍏峰悕绉帮紱鏃犲伐鍏锋椂鏄剧ず鈥滅瓑寰呮敹褰曗€濄€?
- 鎺у埗鍙颁笅鏂圭殑宸ュ叿鏍囪瘑浣跨敤宸ュ叿鍚嶉瀛楁瘝 / 缂╁啓 fallback锛屼笉璇诲彇鎴栧睍绀虹湡瀹炲晢涓?logo銆?
- 鎵嬫満绔殣钘?Hero 鍙充晶鎺у埗鍙帮紝閬垮厤棣栧睆杩囬暱銆?
- 棣栭〉鎼滅储鍏ュ彛淇濇寔鐜版湁 `/search?q=鍏抽敭璇峘 璺宠浆锛岀┖鍏抽敭璇嶈烦杞?`/search`锛屽苟琛ュ厖鍘熺敓 GET 琛ㄥ崟鍏滃簳锛屾湭鏂板鎼滅储绯荤粺銆?
- 鈥滄寜鍦烘櫙娴忚鈥濇敼涓?4 寮犳墜缁樺崱鐗囷細AI 宸ュ叿銆佸湪绾垮伐鍏枫€佹晥鐜囪蒋浠躲€佸紑婧愰」鐩紝鍏ㄩ儴閾炬帴鍒扮幇鏈?`/tools`銆?
- 绮鹃€夊伐鍏风户缁睍绀?published tools 鍓?3 涓紝鍙樉绀衡€滄煡鐪嬭鎯呪€濓紝涓嶆樉绀衡€滆闂畼缃戔€濇垨鏀惰棌鎸夐挳銆?
- 鏈€鏂版枃绔犵户缁睍绀?published articles 鍓?3 绡囷紝鐐瑰嚮杩涘叆 `/articles/[slug]`銆?
- 鏂板 `home-visual-utils.ts` 缁熶竴澶勭悊鏍囬銆佹憳瑕併€佸垎绫汇€佹爣绛俱€佽鎯呴摼鎺ュ拰棣栧瓧姣?fallback锛岄伩鍏嶆覆鏌?`undefined` / `null`銆?
- 棣栭〉鍘绘帀涓嶅繀瑕佺殑 `getCategories()` 璇诲彇锛屼粎淇濈暀 published tools 鍜?published articles 鏁版嵁璇诲彇锛涗笉淇敼 `src/lib/db/*` 鏁版嵁鍑芥暟銆?
- 淇濈暀 `dynamic = "force-dynamic"`銆乣revalidate = 0`銆乣fetchCache = "force-no-store"` 鍜?`noStore()`锛岄伩鍏嶉椤甸暱鏈熼潤鎬佺紦瀛樸€?
- 鏈慨鏀规暟鎹簱 schema銆丼upabase RLS銆佸悗鍙?CRUD銆乣/admin/*`銆乣/tools`銆乣/tools/[slug]`銆乣/submit`銆乣/copyright`銆乀urnstile銆乻itemap銆乺obots銆佹姇绋块€昏緫銆佹姇璇夐€昏緫鎴栫櫥褰曢€昏緫銆?
- 宸茬敤鏈湴娴忚鍣ㄦ鏌ユ闈?1280x720锛氶灞忓彲瑙佸鑸€丠ero銆佹悳绱㈠叆鍙ｅ拰鈥滄寜鍦烘櫙娴忚鈥濇爣棰橈紝鏃犳í鍚戞孩鍑恒€?
- 宸茬敤鏈湴娴忚鍣ㄦ鏌ョЩ鍔?390x844锛欻ero 鎺у埗鍙伴殣钘忥紝鎼滅储鎸夐挳姝ｅ父锛屽満鏅尯鍗曞垪锛屾棤妯悜婧㈠嚭銆?
- 宸茬敤鏈湴娴忚鍣ㄥ疄娴嬮椤垫悳绱細杈撳叆 `AI` 鍚庣偣鍑烩€滄悳绱⑩€濓紝鍦板潃璺宠浆涓?`/search?q=AI`銆?

鏋勫缓缁撴灉锛?
- 宸茶繍琛?`npm run build`锛岄€氳繃锛涙瀯寤烘棩蹇楃‘璁ら椤?`/` 浠嶄负鍔ㄦ€佹覆鏌撻〉闈紝骞惰鍙栧埌褰撳墠 published 宸ュ叿 `open-design,raycast,chatgpt`銆?

## 2026-06-06

浠诲姟锛氶噸鏂拌璁￠椤?`/`锛屾墦閫犱腑鏂囧伐鍏蜂笌鐭ヨ瘑鍙戠幇绔欐寮忛棬闈€?

鏀瑰姩鏂囦欢锛?
- `src/app/page.tsx`
- `src/components/home/home-page.tsx`
- `src/components/home/home-hero.tsx`
- `src/components/home/home-search-section.tsx`
- `src/components/home/home-category-section.tsx`
- `src/components/home/home-featured-tools.tsx`
- `src/components/home/home-tool-card.tsx`
- `src/components/home/home-latest-articles.tsx`
- `src/components/home/home-article-card.tsx`
- 鏂板 `src/components/home/home-trust-section.tsx`
- 鏂板 `src/components/home/home-sponsor-banner.tsx`
- `docs/TASK_LOG.md`

妫€鏌ヤ笌淇锛?
- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DESIGN_SYSTEM.md`銆乣docs/DATABASE_SCHEMA.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- 棣栭〉缁撴瀯璋冩暣涓猴細Hero 棣栭〉涓昏瑙夈€佹悳绱㈠叆鍙ｃ€佹牳蹇冨叆鍙ｅ崱鐗囥€佺簿閫夊伐鍏烽瑙堛€佹渶鏂版枃绔犻瑙堛€佹敹褰曞師鍒?/ 鍙俊璇存槑銆佸悎浣滄帹骞挎í骞呫€?
- 棣栭〉 Hero 鏇存柊涓衡€滀腑鏂囧伐鍏蜂笌鐭ヨ瘑鍙戠幇绔欌€濓紝涓绘爣棰樹负鈥滃彂鐜板€煎緱淇′换鐨勫伐鍏枫€佹柟娉曞拰瀹炵敤鐭ヨ瘑鈥濓紝鍓爣棰樿鏄庣煡浜寔缁暣鐞嗗伐鍏枫€佸紑婧愰」鐩拰鏁欑▼銆?
- Hero 鍙充晶鈥滀粖鏃ュ彂鐜扮湅鏉库€濆彧鏄剧ず鐪熷疄鏁版嵁锛歱ublished 宸ュ叿鎬绘暟銆乸ublished 鏂囩珷鎬绘暟銆佸綋鍓嶅垎绫绘暟閲忥紱绉诲姩绔殣钘忓彸渚х湅鏉匡紝閬垮厤棣栧睆杩囬暱銆?
- 鍒犻櫎棣栭〉鏃х殑 `79 / 34 / 12` 鍋囨暟鎹拰鈥滃唴瀹归浄杈锯€濊〃杈俱€?
- 鎼滅储鍏ュ彛鏀逛负鍏ㄧ珯鎼滅储鍗＄墖锛岃緭鍏ュ叧閿瘝鍚庤烦杞?`/search?q=鍏抽敭璇峘锛岀┖鍏抽敭璇嶈烦杞?`/search`銆?
- 鏍稿績鍏ュ彛鍗＄墖鏀逛负 4 涓叆鍙ｏ細宸ュ叿搴撱€佸疄鐢ㄦ枃绔犮€佹帹鑽愬伐鍏枫€佺増鏉冧笌鍙嶉銆?
- 绮鹃€夊伐鍏峰尯浠庣湡瀹?published tools 涓彇鍓?3 涓紝鍙樉绀衡€滄煡鐪嬭鎯呪€濓紝涓嶆樉绀衡€滆闂畼缃戔€濄€?
- 鏈€鏂版枃绔犲尯浠庣湡瀹?published articles 涓彇鍓?3 绡囷紝鍗＄墖灞曠ず鏍囬銆佹憳瑕併€佸垎绫诲拰鍙戝竷鏃堕棿 fallback銆?
- 鏂板鏀跺綍鍘熷垯鍖猴紝灞曠ず鏉ユ簮娓呮櫚銆佸姛鑳芥槑纭€侀闄╂彁閱掋€佷汉宸ユ暣鐞?4 涓師鍒欍€?
- 鏂板棣栭〉鍚堜綔鎺ㄥ箍妯箙锛屾寜閽摼鎺ュ埌鐜版湁 `/submit`锛屼笉鏂板鍟嗗鍚堜綔椤甸潰銆?
- 棣栭〉娣诲姞 `dynamic = "force-dynamic"`銆乣revalidate = 0`銆乣fetchCache = "force-no-store"` 鍜?`noStore()`锛岄伩鍏嶅悗鍙板彂甯冨唴瀹瑰悗棣栭〉闀挎湡缂撳瓨銆?
- 鏈慨鏀规暟鎹簱 schema銆丼upabase RLS銆佸悗鍙?CRUD銆乣/admin/*`銆乣/tools/[slug]`銆乣/tools` 椤甸潰銆佹姇绋块〉銆佹姇璇夐〉銆佺櫥褰曢〉銆乀urnstile銆乻itemap銆乺obots 鎴栨枃绔犺鎯呬笟鍔￠€昏緫銆?
- 宸茶繍琛?`npm run build`锛岄€氳繃銆?
- 鏋勫缓鏃ュ織纭褰撳墠 published 宸ュ叿鍖呭惈 `open-design,raycast,chatgpt`锛岄椤?`/` 宸蹭负鍔ㄦ€佹覆鏌撻〉闈€?

涓嬩竴姝ワ細
- 鎵撳紑棣栭〉 `/` 妫€鏌?Hero銆佹悳绱㈠叆鍙ｃ€? 涓叆鍙ｅ崱鐗囥€佺簿閫夊伐鍏枫€佹渶鏂版枃绔犮€佹敹褰曞師鍒欏拰鍚堜綔鎺ㄥ箍妯箙锛涘啀鐢ㄦ墜鏈哄昂瀵告鏌ュ崟鍒楀竷灞€鍜屾棤妯悜婊氬姩銆?

## 2026-06-06

浠诲姟锛氫弗鏍煎榻?`/tools` 宸ュ叿搴撶粨鏋勬€ч噸璁捐瑕佹眰銆?

鏀瑰姩鏂囦欢锛?
- `src/components/tools/tools-page.tsx`
- `src/components/tools/ToolsHero.tsx`
- `src/components/tools/ToolsFilterPanel.tsx`
- `src/components/tools/FeaturedToolCard.tsx`
- `src/components/tools/CompactToolCard.tsx`
- `src/components/tools/SponsorBanner.tsx`
- `src/components/tools/tool-card-utils.ts`
- `src/lib/db/tools.ts`
- `src/types/tool.ts`
- `docs/TASK_LOG.md`

妫€鏌ヤ笌淇锛?
- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DESIGN_SYSTEM.md`銆乣docs/DATABASE_SCHEMA.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- 鎵ц鍓嶅凡妫€鏌?`git status`锛屽伐浣滃尯骞插噣锛屽洜姝ゆ棤闇€鍋氫繚鎶ゆ彁浜ゃ€?
- 纭 `/tools` 宸叉槸 Hero銆佹悳绱㈢瓫閫夋爮銆佺簿閫夋帹鑽愩€佸叏閮ㄥ伐鍏枫€佸悎浣滄帹骞挎í骞呯殑缁撴瀯锛屾湰娆″仛涓ユ牸瀵归綈淇銆?
- 绮鹃€夋帹鑽愭暟閲忔敼涓轰粠 `filteredTools` 鍙栧墠 2 涓紝绗﹀悎鈥滅簿閫夋帹鑽愭í鍚戝ぇ鍗″尯鈥濈殑鏁版嵁瑙勫垯銆?
- 鍏ㄩ儴宸ュ叿鍖烘敼涓虹户缁睍绀哄畬鏁?`filteredTools`锛屼笉鍐嶆妸绮鹃€夊伐鍏蜂粠鍏ㄩ儴宸ュ叿涓Щ闄わ紝閬垮厤鐢ㄦ埛璇互涓哄唴瀹逛涪澶便€?
- 绮鹃€夋帹鑽愭闈㈢鍥哄畾涓?2 鍒楀竷灞€锛岀Щ鍔ㄧ 1 鍒椼€?
- 鎼滅储妗?placeholder 鏀逛负 `鎼滅储宸ュ叿鍚嶇О銆佸姛鑳姐€佸钩鍙版垨鍏抽敭璇?..`銆?
- Hero 鍙充晶宸ュ叿搴撴瑙堣ˉ鍏呮槑纭?`LIVE` 瑙掓爣锛屽苟缁х画鍙樉绀虹湡瀹炴暟鎹細宸ュ叿鎬绘暟銆佸垎绫绘暟閲忋€佹爣绛炬暟閲忋€?
- `cover_url` 閫氳繃 `src/lib/db/tools.ts` 鏈€灏忛€忎紶鍒?`ToolItem`锛屾湭鏀规暟鎹簱缁撴瀯銆?
- `ToolItem` 绫诲瀷琛ュ厖 `cover_url?: string | null`锛屼究浜庡崱鐗囧畨鍏ㄨ鍙栧皝闈㈠浘銆?
- 宸ュ叿瑙嗚 fallback 琛ュ己锛氱己灏戞爣棰樻樉绀衡€滄湭鍛藉悕宸ュ叿鈥濓紝缂哄皯绠€浠嬫樉绀衡€滄殏鏃犵畝浠嬧€濓紝缂哄皯 cover_url 浣跨敤娓愬彉鑳屾櫙锛岀┖鏍囩浼氳繃婊ゃ€?
- Featured / Compact 鍗＄墖鏀逛负 CSS background 灞曠ず cover_url锛岄伩鍏?`<img>` 鏋勫缓璀﹀憡锛屽悓鏃朵繚鐣欐笎鍙?fallback銆?
- 鍚堜綔鎺ㄥ箍妯箙鎸夐挳鏀逛负鏅€?`button`锛屼笉鏂板鍟嗗鍚堜綔椤甸潰锛涘彸渚у崠鐐规敼涓虹紪鍙锋ā鍧楋紝鏇寸鍚堜骇鍝佸寲瑙嗚銆?
- 鏈慨鏀规暟鎹簱 schema銆丼upabase RLS銆佸悗鍙?CRUD銆乣/admin/*`銆乣/tools/[slug]` 涓氬姟閫昏緫銆佹姇绋块〉銆佹姇璇夐〉銆佺櫥褰曢〉銆乀urnstile銆乻itemap銆乺obots 鎴栨枃绔犻〉銆?
- 鍒楄〃椤典粛鍙樉绀衡€滄煡鐪嬭鎯呪€濓紝娌℃湁鏂板鈥滆闂畼缃戔€濇寜閽€?
- 宸茶繍琛?`npm run build`锛岄€氳繃涓旀棤鍥剧墖 lint 璀﹀憡銆?
- 鏋勫缓鏃ュ織纭褰撳墠 published 宸ュ叿鍖呭惈 `open-design,raycast,chatgpt`锛宍/tools` 浠嶄负鍔ㄦ€佹覆鏌撻〉闈€?

涓嬩竴姝ワ細
- 鎵撳紑 `/tools` 妫€鏌ラ灞忓瘑搴︺€佺簿閫夋帹鑽?2 鍒椼€佸叏閮ㄥ伐鍏峰畬鏁村垪琛ㄣ€佸悎浣滄帹骞挎í骞呭拰鎵嬫満绔崟鍒楀竷灞€銆?

## 2026-06-06

浠诲姟锛氶噸鏂拌璁?`/tools` 宸ュ叿搴撻〉闈?鈥斺€?缁撴瀯鎬ц瑙夋敼鐗堛€?

鏀瑰姩鏂囦欢锛?
- `src/components/tools/tools-page.tsx`
- `src/components/tools/ToolsHero.tsx`
- `src/components/tools/ToolsFilterPanel.tsx`
- `src/components/tools/tools-grid.tsx`
- `src/components/tools/tools-no-results.tsx`
- 鏂板 `src/components/tools/tool-card-utils.ts`
- 鏂板 `src/components/tools/FeaturedToolCard.tsx`
- 鏂板 `src/components/tools/CompactToolCard.tsx`
- 鏂板 `src/components/tools/SponsorBanner.tsx`
- `docs/TASK_LOG.md`

妫€鏌ヤ笌淇锛?
- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DESIGN_SYSTEM.md`銆乣docs/DATABASE_SCHEMA.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- `/tools` 椤甸潰鏁翠綋甯冨眬鏀逛负锛欻ero 鈫?鎼滅储绛涢€夋爮 鈫?绮鹃€夋帹鑽愬尯 鈫?鍏ㄩ儴宸ュ叿鍖?鈫?搴曢儴鍚堜綔鎺ㄥ箍妯箙銆?
- `ToolsHero` 宸︿晶鏇存柊鏍囬涓?鍙戠幇鏇村ソ鐢ㄧ殑宸ュ叿锛岃鏁堢巼涓庡垱鎰忚Е鎵嬪彲鍙?锛屽壇鏍囬涓?鏀跺綍 AI銆佽璁°€佸紑鍙戙€佽繍钀ャ€佸姙鍏瓑浼樿川宸ュ叿锛屽厛鐪嬩粙缁嶏紝鍐嶈繘鍏ヨ鎯呭垽鏂槸鍚﹀€煎緱浣跨敤銆?锛屼笅鏂瑰洓涓紭鍔挎潯锛氫弗鏍肩瓫閫夈€佹寔缁洿鏂般€佸垎绫绘竻鏅般€佸畨鍏ㄥ彲闈犮€?
- `ToolsHero` 鍙充晶宸ュ叿搴撴瑙堝崱鐗囧彧鏄剧ず鐪熷疄鏁版嵁锛堝綋鍓嶆敹褰?tools.length銆佸垎绫绘暟閲?categoryCount銆佹爣绛炬暟閲?tagCount锛屾爣绛句负 0 鏃堕殣钘忥級锛屼笉鏄剧ず鍋囨暟鎹€?
- `ToolsHero` 绉诲姩绔殣钘忓彸渚ф瑙堝崱鐗囥€?
- `ToolsFilterPanel` 鏀逛负妯悜楂樼骇鎼滅储鏍忥細鎼滅储妗?+ 鍒嗙被 chips + 鏍囩 chips + 娓呯┖绛涢€?+ 褰撳墠鏄剧ず璁℃暟銆備繚鐣欑幇鏈夋悳绱€佸垎绫汇€佹爣绛俱€佹竻绌虹瓫閫夐€昏緫锛屼笉鏀规暟鎹潵婧愩€?
- 鏂板 `tool-card-utils.ts`锛歚getToolInitials(title)` 鎻愬彇棣栧瓧姣?棣栧瓧绗︼紝`getCategoryGradient(categoryName)` 鎸夊垎绫昏繑鍥炴笎鍙橈紝`getCategoryAccentClass(categoryName)` 杩斿洖鍒嗙被寮鸿皟鑹诧紝`getToolSummary(tool)` 杩斿洖涓€鍙ヨ瘽绠€浠嬶紝`getToolCoverUrl(tool)` 瀹夊叏璇诲彇 cover_url锛宍getToolCardTitle(tool)` 杩斿洖宸ュ叿鍚嶏紝`getVisibleTags(tool, maxCount)` 杩斿洖鍓?N 涓爣绛俱€?
- 鏂板 `FeaturedToolCard`锛氭í鍚戝ぇ鍗★紝宸︿晶灏侀潰/娓愬彉 fallback锛屽彸渚у悕绉般€佺畝浠嬨€佸垎绫绘爣绛俱€佸厤璐?寮€婧愮姸鎬併€?鏌ョ湅璇︽儏"鎸夐挳銆俢over_url 瀛樺湪鏃剁敤鍥剧墖锛屼笉瀛樺湪鏃剁敤娓愬彉鑳屾櫙 + 棣栧瓧姣?fallback銆備笉鏄剧ず"璁块棶瀹樼綉"銆?
- 鏂板 `CompactToolCard`锛氬皬鍗＄綉鏍硷紝宸︿晶 logo/棣栧瓧姣?fallback锛屽伐鍏峰悕銆佷竴鍙ヨ瘽绠€浠嬨€佸垎绫诲拰鏍囩銆?鏌ョ湅璇︽儏"鎸夐挳銆備笉鏄剧ず"璁块棶瀹樼綉"銆佷笉鏄剧ず鏀惰棌鎸夐挳銆?
- 鍏ㄩ儴宸ュ叿鍖烘闈㈢ 3 鍒椼€佸钩鏉?2 鍒椼€佹墜鏈?1 鍒椼€?
- `tools-grid` 鏀圭敤 `CompactToolCard` 娓叉煋宸ュ叿鍗＄墖锛屼繚鐣?AdPlaceholder 骞垮憡浣嶏紙绗?6 涓伐鍏峰悗鎴栧垪琛ㄥ簳閮級銆?
- 鏂板 `SponsorBanner`锛氬簳閮ㄩ珮绾х幓鐠冩í骞咃紝灏忔爣绛?鍚堜綔鎺ㄥ箍"銆佹爣棰?鍦ㄨ繖閲屽睍绀轰綘鐨勪骇鍝佹垨鏈嶅姟"銆佸壇鏍囬"绮惧噯瑙﹁揪姝ｅ湪瀵绘壘宸ュ叿銆佽蒋浠跺拰鏁堢巼鏂规鐨勭敤鎴枫€?銆佹寜閽?浜嗚В鍚堜綔"銆佸彸渚?3 涓崠鐐癸紙楂樿川閲忔祦閲忋€佸搧鐗屾洕鍏夈€佺伒娲诲悎浣滐級銆?
- 绮鹃€夋帹鑽愬尯鏍囬涓?绮鹃€夋帹鑽?锛屽叏閮ㄥ伐鍏峰尯鏍囬涓?鍏ㄩ儴宸ュ叿"鎴?宸ュ叿鍒楄〃"銆?
- 鏁版嵁鏉ユ簮涓嶅彉锛歚getPublishedTools()` 鈫?`normalizeTool()` 鈫?`ToolItem`銆傜瓫閫夐€昏緫涓嶅彉锛坬uery + category + tag锛夈€?
- 鏈慨鏀规暟鎹簱 schema銆丼upabase RLS銆佸悗鍙?CRUD銆乣/tools/[slug]` 璇︽儏椤点€佹姇绋块〉銆佹姇璇夐〉銆佺櫥褰曢〉銆乀urnstile銆乻itemap銆乺obots銆?
- 鏈慨鏀?`ToolCard.tsx`锛堜粛琚?search-results.tsx 浣跨敤锛夈€?
- `tools-grid.tsx`銆乣ToolsFilterPanel`銆乣ToolsHero`銆乣ToolsPage` 鐨?Props 鎺ュ彛淇濇寔鍏煎銆?
- 鎵€鏈夊伐鍏峰彧閫氳繃"鏌ョ湅璇︽儏"杩涘叆 `/tools/[slug]`锛屽垪琛ㄩ〉涓嶆樉绀?璁块棶瀹樼綉"鎸夐挳銆?
- 娌℃湁 undefined/null 娓叉煋鍒伴〉闈€?
- 宸茶繍琛?`npm run build`锛岄€氳繃銆?
- 鏋勫缓鏃ュ織纭褰撳墠 published 宸ュ叿鍖呭惈 `open-design,raycast,chatgpt`锛宍/tools` 浠嶄负鍔ㄦ€佹覆鏌撻〉闈€?

涓嬩竴姝ワ細
- 鎵撳紑 `/tools` 妫€鏌ユ闈㈢ Hero銆佹悳绱㈢瓫閫夋爮銆佺簿閫夋帹鑽愬尯銆佸叏閮ㄥ伐鍏风綉鏍煎拰鍚堜綔鎺ㄥ箍妯箙瑙嗚鏁堟灉銆?
- 妫€鏌ユ悳绱€佸垎绫荤瓫閫夈€佹爣绛剧瓫閫夈€佹竻绌虹瓫閫夊姛鑳芥甯搞€?
- 妫€鏌?鏌ョ湅璇︽儏"鍙烦杞埌 `/tools/[slug]`銆?
- 妫€鏌ユ墜鏈虹鍗曞垪甯冨眬鍜屾棤妯悜婊氬姩銆?

## 2026-06-06

浠诲姟锛氫慨澶?`/tools` 椤甸潰涓婂崐閮ㄥ垎鐣欑櫧杩囧ぇ銆佹帶鍒跺彴杩囧ぇ鍜屾暟鎹湡瀹炴€ч棶棰樸€?

鏀瑰姩鏂囦欢锛?
- `src/components/tools/ToolsHero.tsx`
- `src/components/tools/ToolsFilterPanel.tsx`
- `src/components/tools/tools-page.tsx`
- `docs/TASK_LOG.md`

妫€鏌ヤ笌淇锛?
- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DESIGN_SYSTEM.md`銆乣docs/DATABASE_SCHEMA.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- 鏀剁揣 Hero 涓婁笅 padding銆佹爣棰橀棿璺濄€佹爣绛鹃棿璺濆拰鑳屾櫙杩囨浮楂樺害锛岃棣栧睆鑳界湅鍒版洿澶氬唴瀹广€?
- 鍙充晶 Hero 鎺у埗鍙颁粠澶у崱鐗囨敼涓虹揣鍑戝瀷鈥滃伐鍏峰簱姒傝 / 绛涢€夋帶鍒跺彴鈥濓紝涓嶅啀浣跨敤浠讳綍鏃犳潵婧愮殑闈欐€佹暟瀛椼€?
- 鎺у埗鍙版暟鎹敼涓烘潵鑷綋鍓?`/tools` 宸插姞杞?published 宸ュ叿鏁版嵁锛氬綋鍓嶆敹褰曞伐鍏锋暟銆佸垎绫绘暟閲忓拰鏍囩鏁伴噺銆?
- 鎵嬫満绔殣钘忓彸渚?Hero 鎺у埗鍙帮紝鍙繚鐣欏皬鏍囩銆佷富鏍囬銆佸壇鏍囬鍜?chips锛岄伩鍏嶉灞忚繃闀裤€?
- 鏀剁揣绛涢€夐潰鏉?padding銆佹悳绱㈡楂樺害銆乧hips 闂磋窛銆佺瓫閫夌粍闂磋窛鍜屽簳閮ㄧ姸鎬佹潯楂樺害銆?
- 鏀剁揣 Hero 涓庣瓫閫夐潰鏉裤€佺瓫閫夐潰鏉夸笌宸ュ叿鍒楄〃鍖轰箣闂寸殑 section 闂磋窛銆?
- 鏈娌℃湁淇敼 ToolCard銆乼ools-grid銆佸伐鍏疯鎯呴〉銆佸悗鍙?CRUD銆佹暟鎹簱缁撴瀯銆丷LS銆佹姇绋块〉銆佹姇璇夐〉銆佺櫥褰曢〉鎴?Turnstile銆?
- 鏈娌℃湁淇敼 `/tools` 鐨勬悳绱€佸垎绫荤瓫閫夈€佹爣绛剧瓫閫夈€佹竻绌虹瓫閫夈€佹煡鐪嬭鎯呰烦杞垨鏁版嵁璇诲彇閫昏緫銆?
- 宸茶繍琛?`npm run build`锛岄€氳繃銆?
- 鏋勫缓鏃ュ織纭褰撳墠 published 宸ュ叿鍖呭惈 `open-design`锛宍/tools` 浠嶄负鍔ㄦ€佹覆鏌撻〉闈€?

涓嬩竴姝ワ細
- 鎵撳紑 `/tools` 妫€鏌ユ闈㈢棣栧睆瀵嗗害銆佺Щ鍔ㄧ鎺у埗鍙伴殣钘忔晥鏋滐紝浠ュ強鎼滅储/绛涢€夊拰 `Open Design` 璇︽儏璺宠浆鏄惁姝ｅ父銆?

## 2026-06-05

浠诲姟锛氬崌绾?`/tools` 椤甸潰涓婂崐閮ㄥ垎瑙嗚锛屽畬鎴愬伐鍏峰簱瑙嗚鏀圭増绗?2 姝ャ€?

鏀瑰姩鏂囦欢锛?
- `src/components/tools/ToolsHero.tsx`
- `src/components/tools/ToolsFilterPanel.tsx`
- `docs/TASK_LOG.md`

妫€鏌ヤ笌淇锛?
- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DESIGN_SYSTEM.md`銆乣docs/DATABASE_SCHEMA.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- `ToolsHero` 鏀逛负娴呰摑鐧芥笎鍙?Hero锛屽鍔犳煍鍜岃摑鑹插厜鏅曞拰妗岄潰绔乏鍙冲竷灞€銆?
- Hero 宸︿晶鏇存柊涓衡€滅簿閫夊伐鍏峰簱鈥濆皬鏍囩銆佹寚瀹氫富鏍囬銆佸壇鏍囬鍜?5 涓伐鍏风被鍨?chips銆?
- Hero 鍙充晶鏀逛负鐜荤拑鎷熸€佲€滅瓫閫夋帶鍒跺彴鈥濓紝鏄剧ず `LIVE`銆佸綋鍓嶅凡鍙戝竷宸ュ叿鏁伴噺銆佺瓫閫夌淮搴﹀拰鈥滃厛鐪嬭鎯咃紝鍐嶅幓瀹樼綉鈥濈殑璁块棶閫昏緫銆?
- `ToolsFilterPanel` 鏀逛负鏇存槑鏄剧殑鐜荤拑鎷熸€佺瓫閫夐潰鏉匡紝鍖呭惈鏍囬銆佸壇鏍囬銆佸ぇ鎼滅储妗嗐€佹竻绌虹瓫閫夋寜閽€佸垎绫?chips銆佹爣绛?chips 鍜屽簳閮ㄧ姸鎬佹潯銆?
- 搴曢儴鐘舵€佹潯鏄剧ず鈥滃綋鍓嶆樉绀猴細X 涓伐鍏封€濆拰鈥滄帓搴忔柟寮忥細鏈€鏂颁紭鍏堚€濄€?
- 鏈娌℃湁淇敼宸ュ叿鍗＄墖銆佸伐鍏风綉鏍笺€佸伐鍏疯鎯呴〉銆佸悗鍙?CRUD銆佹暟鎹簱缁撴瀯銆丷LS銆佹姇绋块〉銆佹姇璇夐〉銆佺櫥褰曢〉鎴?Turnstile銆?
- 鏈娌℃湁淇敼 `/tools` 鐨勬暟鎹潵婧愩€佹悳绱㈤€昏緫銆佸垎绫荤瓫閫夐€昏緫銆佹爣绛剧瓫閫夐€昏緫鎴栨竻绌虹瓫閫夐€昏緫銆?
- 宸茶繍琛?`npm run build`锛岄€氳繃銆?
- 鏋勫缓鏃ュ織纭褰撳墠 published 宸ュ叿鍖呭惈 `open-design`锛宍/tools` 浠嶄负鍔ㄦ€佹覆鏌撻〉闈€?

涓嬩竴姝ワ細
- 鎵撳紑 `/tools` 妫€鏌ユ闈㈢ Hero銆佺瓫閫夋帶鍒跺彴鍜岀瓫閫夐潰鏉胯瑙夛紱鍐嶇敤鎵嬫満灏哄妫€鏌?Hero 鍗曞垪銆乧hips 鎹㈣鍜屾棤妯悜婊氬姩銆?

## 2026-06-05

浠诲姟锛氬姞鍥?`/tools` 宸ュ叿搴撳垪琛ㄩ〉璇诲彇锛岀‘淇濇樉绀烘渶鏂?published 宸ュ叿銆?

鏀瑰姩鏂囦欢锛?
- `src/app/tools/page.tsx`
- `src/lib/db/tools.ts`
- `docs/TASK_LOG.md`

妫€鏌ヤ笌淇锛?
- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DATABASE_SCHEMA.md`銆乣docs/DEPLOYMENT.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- 宸茬‘璁?`/tools` 椤甸潰缁х画浣跨敤 `getPublishedTools()`锛屼笉鏄函 mock 鏁版嵁婧愩€?
- 宸茬‘璁?`ToolsPage`銆乣ToolsGrid`銆乣ToolCard` 娌℃湁 `featured`銆乣cover_url`銆乣tags.length`銆乣category_id` 鎴?`slice(0, 6)` 绛夐粯璁よ繃婊わ紝榛樿浼氭覆鏌撳叏閮ㄤ紶鍏ュ伐鍏枫€?
- `/tools` 椤甸潰琛ュ厖 `fetchCache = "force-no-store"`锛屽苟鍦ㄦ湇鍔＄鍏ュ彛璋冪敤 `noStore()`锛岃繘涓€姝ラ伩鍏嶅伐鍏峰簱鍒楄〃琚紦瀛樸€?
- `getPublishedTools()` 鏌ヨ缁х画闄愬埗 `status = "published"`锛屾寜 `updated_at`銆乣created_at` 鍊掑簭锛屾渶澶氳鍙?100 鏉★紝淇濊瘉鏈€鏂板彂甯冨伐鍏蜂紭鍏堝嚭鐜板湪宸ュ叿搴撱€?
- `getPublishedTools()` 澧炲姞鏈嶅姟绔棩蹇?`getPublishedTools count` 鍜?`getPublishedTools slugs`锛屼究浜庡湪 Vercel 鏃ュ織纭鏄惁璇诲彇鍒颁簡 `open-design`銆?
- 鏈湴 `npm run build` 宸查€氳繃锛屾瀯寤烘棩蹇楃‘璁よ鍙栧埌 `open-design,raycast,chatgpt`锛屼笖 `/tools` 浠嶄负鍔ㄦ€佹覆鏌撻〉闈€?
- 鏈鏈慨鏀瑰悗鍙?CRUD銆佹暟鎹簱缁撴瀯銆丷LS 绛栫暐銆佹姇绋块〉銆佺櫥褰曢〉銆乀urnstile 鎴栨暣浣撹瑙夐鏍笺€?

## 2026-06-05

浠诲姟锛氫慨澶嶅墠鍙板伐鍏峰簱 `/tools` 涓嶈兘鍙婃椂鏄剧ず鍚庡彴鏂板 published 宸ュ叿鐨勯棶棰樸€?

鏀瑰姩鏂囦欢锛?
- `src/app/tools/page.tsx`
- `src/app/tools/[slug]/page.tsx`
- `src/lib/db/tools.ts`
- `docs/TASK_LOG.md`

妫€鏌ヤ笌淇锛?
- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DATABASE_SCHEMA.md`銆乣docs/DEPLOYMENT.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- `/tools` 椤甸潰鏂板 `dynamic = "force-dynamic"` 鍜?`revalidate = 0`锛岄伩鍏?Vercel 浣跨敤鏋勫缓鏃剁殑鏃у伐鍏峰垪琛ㄣ€?
- `/tools/[slug]` 椤甸潰鏂板 `dynamic = "force-dynamic"` 鍜?`revalidate = 0`锛屽苟绉婚櫎 `generateStaticParams()`锛岃鍚庡彴鏂板鐨勫伐鍏?slug 鍙互鐩存帴璁块棶璇︽儏椤点€?
- `getPublishedTools()` 缁х画鍙鍙?`status = "published"` 鐨勫伐鍏凤紝骞舵敼涓轰紭鍏堟寜 `updated_at` 鍊掑簭锛屽啀鎸?`created_at` 鍊掑簭锛屼繚璇佹渶鏂板彂甯冩垨鏇存柊鐨勫伐鍏锋帓鍦ㄥ墠闈€?
- `getPublishedTools()` 鍜?`getToolBySlug()` 鏌ヨ澶辫触鏃朵細杈撳嚭鐪熷疄 Supabase 閿欒鍒版帶鍒跺彴锛屽苟杩斿洖绌烘暟缁勬垨 `null`锛屼笉璁╁墠鍙伴〉闈㈠穿婧冦€?
- 宸ュ叿璇︽儏椤电浉鍏虫帹鑽愬彧鍦ㄥ瓨鍦ㄧ湡瀹?`category_id` 鏃舵煡璇紝閬垮厤鎶婂睍绀虹敤鍒嗙被鍚嶅綋浣?uuid 鏌ヨ銆?
- 鏈鏈慨鏀瑰悗鍙?CRUD銆佹暟鎹簱缁撴瀯銆丷LS 绛栫暐銆佹枃绔犻〉闈㈡垨鏁翠綋瑙嗚椋庢牸銆?

## 2026-06-04

浠诲姟锛氫慨澶嶉椤垫悳绱㈡涓?`/search` URL 鍙傛暟鑱斿姩銆?

鏀瑰姩鏂囦欢锛?
- `src/components/home/home-search-section.tsx`
- `src/app/search/page.tsx`
- `src/components/search/search-page.tsx`
- `docs/TASK_LOG.md`

妫€鏌ヤ笌淇锛?
- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DESIGN_SYSTEM.md`銆乣docs/DATABASE_SCHEMA.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- 淇棣栭〉鎼滅储鍖猴細杈撳叆鍏抽敭璇嶅悗鎻愪氦浼氳烦杞埌 `/search?q=鍏抽敭璇峘銆?
- 棣栭〉鎼滅储鍏抽敭璇嶄娇鐢?`encodeURIComponent` 鐢熸垚鏌ヨ鍙傛暟銆?
- 棣栭〉鎼滅储鍖虹┖鍏抽敭璇嶆彁浜や細璺宠浆鍒?`/search`銆?
- 棣栭〉鎼滅储琛ㄥ崟澧炲姞 `action` 鍜?`method="get"` 浣滀负鍘熺敓琛ㄥ崟鍏滃簳锛岄伩鍏嶆彁浜ゅ埌 `/?q=...`銆?
- 棣栭〉鐑棬鏍囩浠庨〉闈㈠唴閿氱偣鏀逛负 `/search?q=...` 閾炬帴銆?
- `/search` 椤甸潰璇诲彇 URL 鍙傛暟 `q`锛屼緥濡?`/search?q=published` 浼氳嚜鍔ㄥ～鍏呮悳绱㈡骞跺睍绀哄尮閰嶇粨鏋溿€?
- `/search` 椤甸潰淇濈暀鐜版湁鎵嬪姩杈撳叆鎼滅储銆佺儹闂ㄥ叧閿瘝銆佺瓫閫夊拰鎼滅储缁撴灉鍗＄墖閫昏緫銆?
- 鏈慨鏀规悳绱㈡暟鎹潵婧愩€佸悗鍙般€佹暟鎹簱缁撴瀯銆丼upabase RLS銆佸伐鍏疯鎯呴〉鍜屾枃绔犺鎯呴〉銆?
- 宸茶繍琛?`npm run lint`锛岄€氳繃銆?
- 宸茶繍琛?`npm run build`锛岄€氳繃銆?
- 宸叉竻鐞?`.next` 骞堕噸鏂板惎鍔?`npm run dev -- -p 3000`銆?
- 宸茬敤娴忚鍣ㄦ鏌ラ椤垫悳绱㈣〃鍗曪細绌哄叧閿瘝鐐瑰嚮鎼滅储鍚庤烦杞?`/search`锛屾棤閿欒椤点€?
- 宸茬敤娴忚鍣ㄦ鏌ラ椤电儹闂ㄦ爣绛鹃摼鎺ュ潎涓虹紪鐮佸悗鐨?`/search?q=...`锛屾棫鐨?`#featured-tools` 閾炬帴宸茬Щ闄ゃ€?
- 宸茬敤娴忚鍣ㄦ鏌?`/search?q=published`锛氭悳绱㈡鑷姩鏄剧ず `published`锛屽苟鏄剧ず `Published Test Tool`锛屽伐鍏风粨鏋滄寜閽负鈥滄煡鐪嬭鎯呪€濄€?
- 宸茬‘璁?`/search?q=published` 鏈嚭鐜扳€滄煡鐪嬪畼缃戔€濇垨鈥滆闂畼鏂圭綉绔欌€濓紝椤甸潰鏃犳í鍚戞粴鍔ㄣ€?

涓嬩竴姝ワ細
- 鎵嬪姩鍦ㄩ椤垫悳绱㈡杈撳叆 `published`锛岀偣鍑烩€滄悳绱⑩€濇垨鎸?Enter锛岀‘璁ゅ湴鍧€鍙樹负 `/search?q=published` 涓旂粨鏋滄甯告樉绀恒€?

## 2026-06-04

浠诲姟锛氭鏌ュ苟淇鏂囩珷鍓嶅彴鏁版嵁鑱斿姩涓庢悳绱㈤〉鏁版嵁鑱斿姩銆?

鏀瑰姩鏂囦欢锛?
- `src/app/articles/page.tsx`
- `src/app/articles/[slug]/page.tsx`
- `src/app/search/page.tsx`
- `src/lib/db/articles.ts`
- `src/types/article.ts`
- `docs/TASK_LOG.md`

妫€鏌ヤ笌淇锛?
- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DESIGN_SYSTEM.md`銆乣docs/DATABASE_SCHEMA.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- 纭 `/articles` 浣跨敤 `getPublishedArticles()` 璇诲彇 Supabase `articles` 琛ㄦ暟鎹€?
- 纭 `/articles/[slug]` 浣跨敤 `getArticleBySlug(slug)` 璇诲彇 Supabase `articles` 琛ㄦ暟鎹€?
- 纭 `/search` 鍚屾椂浣跨敤 `getPublishedTools()` 鍜?`getPublishedArticles()`锛屼笉鏄函 mock 鏁版嵁銆?
- 灏?`/articles`銆乣/articles/[slug]`銆乣/search` 鏍囪涓?`dynamic = "force-dynamic"`锛岄伩鍏嶆瀯寤烘椂鎶?Supabase 鏁版嵁闈欐€佸浐鍖栵紝纭繚鍚庡彴鏂板鎴栫紪杈?published 鍐呭鍚庡墠鍙拌兘鎸夎姹傛洿鏂般€?
- 绉婚櫎 `/articles/[slug]` 鐨?`generateStaticParams()`锛岃鍚庡彴鏂板鐨?published 鏂囩珷 slug 鑳界洿鎺ユ墦寮€璇︽儏椤点€?
- `getPublishedArticles()` 缁х画鍙煡璇?`status = "published"`锛屾帓搴忔敼涓轰紭鍏?`updated_at` 鍊掑簭锛屽啀鎸?`created_at` 鍊掑簭銆?
- `getPublishedArticles()` 鏌ヨ澶辫触鏃惰緭鍑?`console.error("getPublishedArticles error:", error)`锛屽苟杩斿洖绌烘暟缁勩€?
- `getArticleBySlug(slug)` 鏌ヨ鏃跺悓鏃惰姹?`slug` 鍜?`status = "published"`锛屾煡璇㈠け璐ユ椂杈撳嚭 `console.error("getArticleBySlug error:", error)`锛屾煡涓嶅埌鏃惰繑鍥?`null`銆?
- `getRelatedArticles(categoryId, currentArticleId)` 鍦?`categoryId` 涓虹┖鏃惰繑鍥炵┖鏁扮粍锛屾煡璇㈠け璐ユ椂杈撳嚭閿欒骞惰繑鍥炵┖鏁扮粍銆?
- 鏂囩珷璇︽儏椤电浉鍏虫帹鑽愬彧浼?`article.category_id`锛岄伩鍏嶆妸鈥滄湭鍒嗙被鈥濈瓑灞曠ず鏂囨褰撲綔 uuid 鏌ヨ銆?
- 琛ュ厖 `PublishedArticle` 绫诲瀷鍏煎瀛楁锛歚content`銆乣cover_url`銆乣status`锛岀户缁吋瀹?`category_id`銆乣created_at`銆乣updated_at` 鍙€夈€?
- 宸蹭娇鐢ㄥ尶鍚?Supabase 瀹㈡埛绔彧璇绘鏌ュ綋鍓嶇幆澧冿細`articles` 鍏?2 绡囷紝published 2 绡囷紝draft 0 绡囷紱`tools` 鍏?3 涓紝published 3 涓紝draft 0 涓€?
- 宸茶繍琛?`npm run lint`锛岄€氳繃銆?
- 宸茶繍琛?`npm run build`锛岄€氳繃锛涙瀯寤虹粨鏋滅‘璁?`/articles`銆乣/articles/[slug]`銆乣/search` 鍧囦负鍔ㄦ€佹覆鏌撱€?
- 宸叉竻鐞?`.next` 骞堕噸鏂板惎鍔?`npm run dev -- -p 3000`銆?
- 宸茬敤娴忚鍣ㄦ鏌?`/articles` 鏄剧ず Supabase published 鏂囩珷锛氣€滃浣曞垽鏂竴涓?AI 宸ュ叿鏄惁鍊煎緱浣跨敤锛熲€濆拰鈥滃湪绾垮伐鍏风珯閫傚悎鏀跺綍鍝簺鍐呭锛熲€濄€?
- 宸茬敤娴忚鍣ㄦ鏌?`/articles/how-to-choose-ai-tools` 鍙墦寮€锛屾鏂囥€佸箍鍛婁綅鍜岀増鏉冨０鏄庢甯告樉绀恒€?
- 宸茬敤娴忚鍣ㄦ鏌?`/articles/not-public-or-missing` 鏄剧ず鈥滄病鏈夋壘鍒拌繖绡囨枃绔犫€濆拰鈥滆繑鍥炴枃绔犲垪琛ㄢ€濓紝娌℃湁閿欒椤点€?
- 宸茬敤娴忚鍣ㄦ鏌?`/search` 鍒濆鐘舵€佹樉绀?Supabase published 宸ュ叿鍜屾枃绔犮€?
- 宸茬敤娴忚鍣ㄦ鏌?`/search` 鎼滅储 `AI` 鍙尮閰?published 宸ュ叿 `ChatGPT` 鍜?published 鏂囩珷鈥滃浣曞垽鏂竴涓?AI 宸ュ叿鏄惁鍊煎緱浣跨敤锛熲€濄€?
- 宸茬‘璁?`/search` 宸ュ叿缁撴灉鎸夐挳涓衡€滄煡鐪嬭鎯呪€濓紝鏂囩珷缁撴灉鎸夐挳涓衡€滈槄璇诲叏鏂団€濓紝鏈嚭鐜扳€滄煡鐪嬪畼缃戔€濇垨鈥滆闂畼鏂圭綉绔欌€濄€?
- 宸茬‘璁?`/articles`銆乣/articles/[slug]`銆乣/search` 鏈彂鐜版í鍚戞粴鍔ㄣ€?

涓嬩竴姝ワ細
- 濡傞渶缁х画楠屾敹 draft 鎺掗櫎鏁堟灉锛屽彲鍦ㄥ悗鍙版柊澧炰竴绡?`status = draft` 鐨勬枃绔狅紝纭 `/articles`銆乣/articles/[slug]`銆乣/search` 鍧囦笉灞曠ず璇ユ枃绔犮€?

## 2026-06-04

浠诲姟锛氬墠鍚庡彴鏁版嵁鑱斿姩楠屾敹涓庝慨澶嶃€?

鏀瑰姩鏂囦欢锛?
- `src/lib/db/tools.ts`
- `src/lib/db/articles.ts`
- `src/components/home/home-article-card.tsx`
- `docs/TASK_LOG.md`

妫€鏌ヤ笌淇锛?
- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DESIGN_SYSTEM.md`銆乣docs/DATABASE_SCHEMA.md`銆乣docs/ADMIN_RULES.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- 妫€鏌ュ墠鍙伴〉闈笌缁勪欢閾捐矾锛歚/`銆乣/tools`銆乣/tools/[slug]`銆乣/articles`銆乣/articles/[slug]`銆乣/search`銆?
- 淇鍓嶅彴 Supabase 鏁版嵁璇诲彇绛栫暐锛氱己灏?Supabase 閰嶇疆鏃朵粛淇濈暀 mock 鍏滃簳锛涗竴鏃?Supabase 宸查厤缃絾鏌ヨ澶辫触锛屼笉鍐嶅洖閫€鍒?mock锛屾敼涓鸿繑鍥炵┖鏁扮粍鎴?`null`锛岄伩鍏嶅悗鍙板垹闄ゃ€佽崏绋跨姸鎬佹垨鏌ヨ閿欒琚亣鏁版嵁鎺╃洊銆?
- 纭 `getPublishedTools()`銆乣getToolBySlug(slug)`銆乣getRelatedTools(categoryId, currentToolId)` 鐨勫墠鍙拌鍙栦粛闄愬畾 `status = "published"`銆?
- 纭 `getPublishedArticles()`銆乣getArticleBySlug(slug)`銆乣getRelatedArticles(categoryId, currentArticleId)` 鐨勫墠鍙拌鍙栦粛闄愬畾 `status = "published"`銆?
- 淇棣栭〉鏈€鏂版枃绔犲崱鐗囬摼鎺ワ細浠?`/articles/${article.id}` 鏀逛负 `/articles/${article.slug}`锛岄伩鍏嶅悗鍙版枃绔犵殑 uuid `id` 琚褰撲綔璇︽儏椤?slug銆?
- 鏂囨湰妫€鏌ョ‘璁ゅ墠鍙板伐鍏峰垪琛ㄣ€侀椤靛伐鍏峰崱鐗囧拰鎼滅储宸ュ叿缁撴灉浣跨敤鈥滄煡鐪嬭鎯呪€濓紝鏈嚭鐜扳€滄煡鐪嬪畼缃戔€濄€?
- 鏂囨湰妫€鏌ョ‘璁も€滆闂畼鏂圭綉绔欌€濆彧鍑虹幇鍦ㄥ伐鍏疯鎯呯粍浠讹紝涓斿畼缃戦摼鎺ュ甫 `target="_blank"` 涓?`rel="nofollow noopener noreferrer"`銆?
- 妫€鏌ュ伐鍏疯鎯呴〉鍜屾枃绔犺鎯呴〉浠嶅寘鍚?`AdPlaceholder` 涓?`CopyrightNotice`锛岀浉鍏虫帹鑽愪负绌烘椂涓嶄細宕╂簝銆?
- 宸蹭娇鐢ㄥ尶鍚?Supabase 瀹㈡埛绔彧璇?count 妫€鏌ュ綋鍓嶇幆澧冿細`tools` 鎬绘暟 0銆乣articles` 鎬绘暟 0锛屽洜姝ゅ綋鍓嶅墠鍙版樉绀哄弸濂界┖鐘舵€佹槸姝ｅ父缁撴灉銆?
- 宸茶繍琛?`npm run lint`锛岄€氳繃銆?
- 宸茶繍琛?`npm run build`锛岄€氳繃銆?
- build 鍚庡彂鐜板綋鍓?dev 鏈嶅姟缂撳瓨琚鐩栧鑷撮椤佃姹傜己澶?chunk锛屽凡鍋滄鏈」鐩?dev 杩涚▼銆佸垹闄?`.next`銆侀噸鏂板惎鍔?`npm run dev -- -p 3000`銆?
- 宸叉鏌?`/`銆乣/tools`銆乣/articles`銆乣/search` 鍧囧彲鎵撳紑锛屾棤閿欒椤点€佹棤妯悜婊氬姩锛屽苟鏄剧ず绌虹姸鎬佹垨骞垮憡浣嶃€?

涓嬩竴姝ワ細
- 鍦ㄥ悗鍙版柊澧炰竴鏉?`status = published` 鐨勫伐鍏峰拰鏂囩珷鍚庯紝鍓嶅彴 `/tools`銆乣/articles`銆侀椤靛拰 `/search` 搴旀樉绀猴紱鏂板 `status = draft` 鐨勫伐鍏峰拰鏂囩珷鍚庯紝鍓嶅彴涓嶅簲鏄剧ず銆?
- 濡傛灉 published 鍐呭浠嶄笉鏄剧ず锛屼紭鍏堟鏌?Supabase RLS 鏄惁鍏佽鍖垮悕鐢ㄦ埛璇诲彇 `tools`銆乣articles`銆乣categories`銆乣tags` 鍙婂叧绯昏〃銆?

## 2026-06-04

浠诲姟锛氬悗鍙板姛鑳界粺涓€楠屾敹涓庝慨澶嶃€?

鏀瑰姩鏂囦欢锛?
- `src/app/admin/login/page.tsx`
- `src/app/admin/page.tsx`
- `src/app/admin/tools/page.tsx`
- `src/app/admin/tools/new/page.tsx`
- `src/app/admin/tools/[id]/edit/page.tsx`
- `src/app/admin/articles/page.tsx`
- `src/app/admin/articles/new/page.tsx`
- `src/app/admin/articles/[id]/edit/page.tsx`
- `src/app/admin/categories/page.tsx`
- `src/app/admin/tags/page.tsx`
- `src/components/admin/AdminShell.tsx`
- `src/lib/db/admin-errors.ts`
- `src/lib/db/tools.ts`
- `src/lib/db/articles.ts`
- `src/lib/db/categories.ts`
- `src/lib/db/tags.ts`
- `src/lib/db/submissions.ts`
- `src/lib/db/reports.ts`
- `src/lib/supabase/client.ts`
- `docs/ADMIN_RULES.md`
- `docs/TASK_LOG.md`

妫€鏌ヤ笌淇锛?
- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DESIGN_SYSTEM.md`銆乣docs/DATABASE_SCHEMA.md`銆乣docs/ADMIN_RULES.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- 妫€鏌ュ悗鍙伴〉闈細`/admin/login`銆乣/admin`銆乣/admin/tools`銆乣/admin/articles`銆乣/admin/categories`銆乣/admin/tags`銆乣/admin/submissions`銆乣/admin/reports`銆?
- 纭鍚庡彴璺宠浆浣跨敤鐩稿璺緞锛屾病鏈夌‖缂栫爜 `localhost:3000` 鎴?`localhost:3001`銆?
- 缁欏悗鍙扮櫥褰曟鏌ュ鍔犺秴鏃跺厹搴曪紝閬垮厤椤甸潰姘镐箙鍋滅暀鍦ㄢ€滄鍦ㄦ鏌ョ櫥褰曠姸鎬佲€濇垨鈥滄鍦ㄩ獙璇佺櫥褰曠姸鎬佲€濄€?
- 姝ｅ父鏈櫥褰曟椂涓嶅啀鎶?`Auth session missing` 褰撲綔椤甸潰閿欒灞曠ず锛涙湭鐧诲綍璁块棶鍚庡彴绠＄悊椤典細璺宠浆鍒?`/admin/login?next=admin`銆?
- 鏂板 `src/lib/db/admin-errors.ts`锛岀粺涓€澶勭悊鍚庡彴鍙嬪ソ閿欒鎻愮ず銆?
- Supabase RLS 鎴栨潈闄愮被閿欒缁熶竴鏄剧ず锛歚鏉冮檺涓嶈冻锛岃妫€鏌?Supabase RLS 閰嶇疆銆俙
- 宸ュ叿銆佹枃绔犮€佸垎绫汇€佹爣绛俱€佹姇绋裤€佹姇璇夌殑鍚庡彴鏁版嵁鍑芥暟淇濈暀鐪熷疄閿欒 `console.error`锛岄〉闈㈡樉绀哄弸濂戒腑鏂囨彁绀恒€?
- 宸ュ叿銆佹枃绔犮€佸垎绫汇€佹爣绛惧悗鍙版暟鎹眰鏀逛负澶嶇敤缁熶竴 Supabase browser client锛岄伩鍏嶉噸澶嶅垱寤?GoTrueClient銆?
- 鍚庡彴棣栭〉鑿滃崟绉婚櫎宸插畬鎴愬叆鍙ｄ笂鐨勮瀵兼€р€滃緟寮€鏀锯€濇爣璁般€?
- 宸茶繍琛?`npm run lint`锛岄€氳繃銆?
- 宸茶繍琛?`npm run build`锛岄€氳繃銆?
- 宸叉竻鐞?`.next` 骞堕噸鍚?`npm run dev -- -p 3000`銆?
- 宸叉鏌ュ悗鍙?8 涓〉闈㈠湪 `http://localhost:3000` 鍧囪繑鍥?200銆?
- 宸茬敤娴忚鍣ㄧ‘璁?`/admin/login` 鏄剧ず鐧诲綍琛ㄥ崟锛屾湭鐧诲綍璁块棶 `/admin/reports` 浼氳烦杞埌 `/admin/login?next=admin`锛屼笖涓嶄細鍗″湪楠岃瘉鐘舵€併€?

涓嬩竴姝ワ細
- 浣跨敤鐪熷疄绠＄悊鍛樿处鍙风櫥褰曞悗锛岄€愰〉娴嬭瘯鏂板銆佺紪杈戙€佸垹闄ゃ€佺姸鎬佸垏鎹㈡槸鍚﹀彈 Supabase RLS policy 姝ｇ‘鍏佽锛涘鏋滃悗鍙板啓鍏ユ垨绠＄悊澶辫触锛屼紭鍏堟鏌ュ搴旇〃鐨?authenticated `select`銆乣insert`銆乣update`銆乣delete` policy銆?

## 2026-06-04

浠诲姟锛氬埗浣滃悗鍙版姇璇夌鐞?`/admin/reports`銆?

鏀瑰姩鏂囦欢锛?
- `src/app/admin/reports/page.tsx`
- `src/components/admin/AdminShell.tsx`
- `src/lib/db/reports.ts`
- `src/types/report.ts`
- `docs/ADMIN_RULES.md`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DESIGN_SYSTEM.md`銆乣docs/DATABASE_SCHEMA.md`銆乣docs/ADMIN_RULES.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- 鏈鍙仛 `reports` 琛ㄥ悗鍙扮鐞嗭紝涓嶄慨鏀瑰墠鍙伴〉闈€乣/copyright` 椤甸潰銆乣/submit` 椤甸潰銆佸伐鍏峰悗鍙般€佹枃绔犲悗鍙般€佸垎绫诲悗鍙般€佹爣绛惧悗鍙般€佹姇绋垮悗鍙般€佹暟鎹簱缁撴瀯銆侀偖浠堕€氱煡銆佸鏉傚伐鍗曠郴缁熴€佽嚜鍔ㄤ笅鏋跺唴瀹瑰拰澶嶆潅鏉冮檺銆?
- 鏂板 `/admin/reports` 鎶曡瘔绠＄悊椤点€?
- 椤甸潰鍖呭惈鎶曡瘔绠＄悊鏍囬銆佽鏄庛€佸叏閮ㄦ姇璇夋暟閲忋€乣pending` 鏁伴噺銆乣reviewed` 鏁伴噺銆乣resolved` 鏁伴噺銆乣rejected` 鏁伴噺銆?
- 鎶曡瘔鍒楄〃璇诲彇 Supabase `reports` 琛ㄧ湡瀹炴暟鎹紝骞舵寜 `created_at` 鍊掑簭鏄剧ず銆?
- 鎶曡瘔鍒楄〃鏄剧ず鏉冨埄浜烘垨鏈烘瀯銆佽仈绯婚偖绠便€佹秹鍙婇〉闈€侀棶棰樼被鍨嬨€佽瘉鏄庢潗鏂欐憳瑕併€佸鐞嗚姹傛憳瑕併€佺姸鎬併€佹彁浜ゆ椂闂村拰鎿嶄綔鎸夐挳銆?
- 鏀寔椤甸潰鍐呭睍寮€鏌ョ湅璇︽儏锛屼笉鍒涘缓鍗曠嫭璇︽儏椤点€?
- 娑夊強椤甸潰閾炬帴濡備负 `http` 鎴?`https` 閾炬帴锛屼細鏂扮獥鍙ｆ墦寮€锛屽苟甯?`rel="nofollow noopener noreferrer"`銆?
- 鑱旂郴閭鏄剧ず涓?`mailto:` 閾炬帴銆?
- 鐘舵€佸吋瀹规樉绀烘暟鎹簱閲岀殑鍏朵粬鍊硷紝浣嗗悗鍙版寜閽彧鍏佽鏇存柊涓?`pending`銆乣reviewed`銆乣resolved`銆乣rejected`銆?
- `pending` 鏄剧ず涓衡€滃緟澶勭悊鈥濓紝`reviewed` 鏄剧ず涓衡€滃凡鏌ョ湅鈥濓紝`resolved` 鏄剧ず涓衡€滃凡澶勭悊鈥濓紝`rejected` 鏄剧ず涓衡€滃凡鎷掔粷鈥濄€?
- 鍒楄〃涓暱鏂囨湰 `proof` 鍜?`request` 鍙樉绀烘憳瑕侊紝璇︽儏灞曞紑鍚庡畬鏁村睍绀恒€?
- `src/lib/db/reports.ts` 鏂板 `getAdminReports()`銆乣updateReportStatus(id, status)`銆乣deleteReport(id)`銆?
- `updateReportStatus` 鍙洿鏂?`status` 瀛楁锛屼笉鏇存柊鎶曡瘔鍐呭瀛楁銆?
- `deleteReport` 鍙牴鎹?`id` 鍒犻櫎銆?
- 鏇存柊鐘舵€佸拰鍒犻櫎鎶曡瘔鍑洪敊鏃讹紝浼氬湪鎺у埗鍙拌緭鍑虹湡瀹?Supabase 閿欒锛岄〉闈㈠彧鏄剧ず鍙嬪ソ鎻愮ず銆?
- 鍒犻櫎鎶曡瘔鍓嶄細浜屾纭銆?
- `AdminShell` 涓€滄姇璇夌鐞嗏€濆叆鍙ｆ敼涓哄凡寮€鏀俱€?
- 鏈娇鐢ㄣ€佹湭鏆撮湶銆佹湭鎵撳嵃 `service_role_key`銆?
- 宸茶繍琛?`npm run lint`锛岄€氳繃銆?
- 宸茶繍琛?`npm run build`锛岄€氳繃銆?

涓嬩竴姝ワ細

- 鍦?Supabase 涓‘璁?`reports` 琛ㄥ厑璁稿凡鐧诲綍鐢ㄦ埛鎵ц `select`銆乣update`銆乣delete`锛涘鏋滃悗鍙拌鍙栨垨鎿嶄綔澶辫触锛岄渶瑕佹鏌ュ搴?RLS policy銆?

## 2026-06-04

浠诲姟锛氬埗浣滃悗鍙版姇绋跨鐞?`/admin/submissions`銆?

鏀瑰姩鏂囦欢锛?
- `src/app/admin/submissions/page.tsx`
- `src/components/admin/AdminShell.tsx`
- `src/lib/db/submissions.ts`
- `src/types/submission.ts`
- `docs/ADMIN_RULES.md`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DESIGN_SYSTEM.md`銆乣docs/DATABASE_SCHEMA.md`銆乣docs/ADMIN_RULES.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- 鏈鍙仛 `submissions` 琛ㄥ悗鍙扮鐞嗭紝涓嶄慨鏀瑰墠鍙伴〉闈€乣/submit` 椤甸潰銆佸伐鍏峰悗鍙般€佹枃绔犲悗鍙般€佸垎绫诲悗鍙般€佹爣绛惧悗鍙般€佹暟鎹簱缁撴瀯銆佷竴閿浆宸ュ叿銆侀偖浠堕€氱煡銆佹壒閲忔搷浣滃拰澶嶆潅鏉冮檺銆?
- 鏂板 `/admin/submissions` 鎶曠绠＄悊椤点€?
- 椤甸潰鍖呭惈鎶曠绠＄悊鏍囬銆佽鏄庛€佸叏閮ㄦ姇绋挎暟閲忋€乣pending` 鏁伴噺銆乣reviewed` 鏁伴噺銆乣rejected` 鏁伴噺銆?
- 鎶曠鍒楄〃璇诲彇 Supabase `submissions` 琛ㄧ湡瀹炴暟鎹紝骞舵寜 `created_at` 鍊掑簭鏄剧ず銆?
- 鎶曠鍒楄〃鏄剧ず宸ュ叿鍚嶇О銆佸畼缃戝湴鍧€銆佸伐鍏风畝浠嬨€佹帹鑽愮悊鐢便€佹帹鑽愪汉閭銆佺姸鎬併€佹彁浜ゆ椂闂村拰鎿嶄綔鎸夐挳銆?
- 鏀寔椤甸潰鍐呭睍寮€鏌ョ湅璇︽儏锛屼笉鍒涘缓鍗曠嫭璇︽儏椤点€?
- 瀹樼綉鍦板潃濡備负 `http` 鎴?`https` 閾炬帴锛屼細鏂扮獥鍙ｆ墦寮€锛屽苟甯?`rel="nofollow noopener noreferrer"`銆?
- 鐘舵€佸吋瀹规樉绀烘暟鎹簱閲岀殑鍏朵粬鍊硷紝浣嗗悗鍙版寜閽彧鍏佽鏇存柊涓?`pending`銆乣reviewed`銆乣rejected`銆?
- `pending` 鏄剧ず涓衡€滃緟澶勭悊鈥濓紝`reviewed` 鏄剧ず涓衡€滃凡鏌ョ湅鈥濓紝`rejected` 鏄剧ず涓衡€滃凡鎷掔粷鈥濄€?
- `src/lib/db/submissions.ts` 鏂板 `getAdminSubmissions()`銆乣updateSubmissionStatus(id, status)`銆乣deleteSubmission(id)`銆?
- `updateSubmissionStatus` 鍙洿鏂?`status` 瀛楁锛屼笉鏇存柊鎶曠鍐呭瀛楁銆?
- `deleteSubmission` 鍙牴鎹?`id` 鍒犻櫎銆?
- 鏇存柊鐘舵€佸拰鍒犻櫎鎶曠鍑洪敊鏃讹紝浼氬湪鎺у埗鍙拌緭鍑虹湡瀹?Supabase 閿欒锛岄〉闈㈠彧鏄剧ず鍙嬪ソ鎻愮ず銆?
- 鍒犻櫎鎶曠鍓嶄細浜屾纭銆?
- `AdminShell` 涓€滄姇绋跨鐞嗏€濆叆鍙ｆ敼涓哄凡寮€鏀俱€?
- 鏈娇鐢ㄣ€佹湭鏆撮湶銆佹湭鎵撳嵃 `service_role_key`銆?
- 宸茶繍琛?`npm run lint`锛岄€氳繃銆?
- 宸茶繍琛?`npm run build`锛岄€氳繃銆?

涓嬩竴姝ワ細

- 鍦?Supabase 涓‘璁?`submissions` 琛ㄥ厑璁稿凡鐧诲綍鐢ㄦ埛鎵ц `select`銆乣update`銆乣delete`锛涘鏋滃悗鍙拌鍙栨垨鎿嶄綔澶辫触锛岄渶瑕佹鏌ュ搴?RLS policy銆?

## 2026-06-04

浠诲姟锛氬埗浣滃悗鍙版爣绛剧鐞?`/admin/tags`銆?

鏀瑰姩鏂囦欢锛?
- `src/app/admin/tags/page.tsx`
- `src/components/admin/AdminShell.tsx`
- `src/lib/db/tags.ts`
- `src/types/tag.ts`
- `docs/ADMIN_RULES.md`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DESIGN_SYSTEM.md`銆乣docs/DATABASE_SCHEMA.md`銆乣docs/ADMIN_RULES.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- 鏈鍙仛 `tags` 琛ㄥ悗鍙扮鐞嗭紝涓嶄慨鏀瑰墠鍙伴〉闈€佸伐鍏峰悗鍙般€佹枃绔犲悗鍙般€佸垎绫诲悗鍙般€佹姇绋垮鏍搞€佹暟鎹簱缁撴瀯銆佸瑙掕壊鏉冮檺鍜岃矾鐢辩粨鏋勩€?
- 鏂板 `/admin/tags` 鏍囩绠＄悊椤点€?
- 椤甸潰鍖呭惈鏍囩绠＄悊鏍囬銆佽鏄庛€佹柊澧炴爣绛惧尯鍩熴€佹爣绛惧垪琛ㄣ€佺紪杈戞爣绛惧拰鍒犻櫎鏍囩鍔熻兘銆?
- 鏍囩鍒楄〃璇诲彇 Supabase `tags` 琛ㄧ湡瀹炴暟鎹紝骞舵寜鍒涘缓鏃堕棿鍊掑簭灞曠ず銆?
- 鏍囩琛ㄥ崟瀛楁鍖呭惈 `name` 鍜?`slug`銆?
- 鏂板鍜岀紪杈戞爣绛炬椂锛宍name` 涓?`slug` 蹇呭～銆?
- slug 鑷姩鐢熸垚瑙勫垯锛氳嫳鏂囪浆灏忓啓銆佺┖鏍艰浆鐭í绾裤€佸幓鎺夌壒娈婄鍙凤紱涓枃鍚嶇О鏃犳硶鐢熸垚绋冲畾 slug 鏃?fallback 涓?`tag-${Date.now()}`銆?
- slug 閲嶅鏃惰繑鍥炲弸濂介敊璇細鈥渟lug 宸插瓨鍦紝璇锋崲涓€涓?slug銆傗€?
- 鏂板鎴栫紪杈戞垚鍔熷悗浼氭竻绌鸿〃鍗曟垨閫€鍑虹紪杈戠姸鎬侊紝骞跺埛鏂版爣绛惧垪琛ㄣ€?
- 鍒犻櫎鏍囩鍓嶄細浜屾纭銆?
- 濡傛灉鏍囩姝ｅ湪琚伐鍏锋垨鏂囩珷浣跨敤锛屽垹闄ゅけ璐ユ椂鏄剧ず锛氣€滆鏍囩鍙兘姝ｅ湪琚伐鍏锋垨鏂囩珷浣跨敤锛岃鍏堣皟鏁寸浉鍏冲唴瀹瑰悗鍐嶅垹闄ゃ€傗€?
- `src/lib/db/tags.ts` 鏂板 `getAdminTags()`銆乣createTag(data)`銆乣updateTag(id, data)`銆乣deleteTag(id)`銆?
- 淇濆瓨 payload 鍙寘鍚?`name` 鍜?`slug`锛屼笉浼?`id`銆乣created_at` 鎴栨暟鎹簱涓嶅瓨鍦ㄥ瓧娈点€?
- `createTag` / `updateTag` / `deleteTag` 鍑洪敊鏃朵細鍦ㄦ帶鍒跺彴杈撳嚭鐪熷疄 Supabase 閿欒銆?
- `AdminShell` 涓€滄爣绛剧鐞嗏€濆叆鍙ｆ敼涓哄凡寮€鏀撅紝鍏跺畠鏈疄鐜板悗鍙板叆鍙ｇ户缁樉绀衡€滃緟寮€鏀锯€濄€?
- 鏈娇鐢ㄣ€佹湭鏆撮湶銆佹湭鎵撳嵃 `service_role_key`銆?
- 宸茶繍琛?`npm run lint`锛岄€氳繃銆?
- 宸茶繍琛?`npm run build`锛岄€氳繃銆?

涓嬩竴姝ワ細

- 鍦?Supabase 涓‘璁?`tags` 琛ㄥ厑璁稿凡鐧诲綍鐢ㄦ埛鎵ц `select`銆乣insert`銆乣update`銆乣delete`锛涘鏋滃悗鍙板啓鍏ュけ璐ワ紝闇€瑕佹鏌ュ搴?RLS policy銆?

## 2026-06-04

浠诲姟锛氬埗浣滃悗鍙板垎绫荤鐞?`/admin/categories`銆?

鏀瑰姩鏂囦欢锛?
- `src/app/admin/categories/page.tsx`
- `src/components/admin/AdminShell.tsx`
- `src/lib/db/categories.ts`
- `src/types/category.ts`
- `docs/ADMIN_RULES.md`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DESIGN_SYSTEM.md`銆乣docs/DATABASE_SCHEMA.md`銆乣docs/ADMIN_RULES.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- 鏈鍙仛 `categories` 琛ㄥ悗鍙扮鐞嗭紝涓嶄慨鏀瑰墠鍙伴〉闈€佸伐鍏峰悗鍙般€佹枃绔犲悗鍙般€佹爣绛惧悗鍙般€佹姇绋垮鏍搞€佹暟鎹簱缁撴瀯銆佸瑙掕壊鏉冮檺鍜岃矾鐢辩粨鏋勩€?
- 鏂板 `/admin/categories` 鍒嗙被绠＄悊椤点€?
- 椤甸潰鍖呭惈鍒嗙被绠＄悊鏍囬銆佽鏄庛€佹柊澧炲垎绫诲尯鍩熴€佸垎绫诲垪琛ㄣ€佺紪杈戝垎绫诲拰鍒犻櫎鍒嗙被鍔熻兘銆?
- 鍒嗙被鍒楄〃璇诲彇 Supabase `categories` 琛ㄧ湡瀹炴暟鎹紝骞舵寜 `created_at` 鍊掑簭鏄剧ず銆?
- 鍒嗙被琛ㄥ崟瀛楁鍖呭惈 `name`銆乣slug`銆乣description`銆?
- 鏂板鍜岀紪杈戝垎绫绘椂锛宍name` 涓?`slug` 蹇呭～锛宍description` 鍙€夈€?
- slug 鑷姩鐢熸垚瑙勫垯锛氳嫳鏂囪浆灏忓啓銆佺┖鏍艰浆鐭í绾裤€佸幓鎺夌壒娈婄鍙凤紱涓枃鍚嶇О鏃犳硶鐢熸垚绋冲畾 slug 鏃?fallback 涓?`category-${Date.now()}`銆?
- slug 閲嶅鏃惰繑鍥炲弸濂介敊璇細鈥渟lug 宸插瓨鍦紝璇锋崲涓€涓?slug銆傗€濄€?
- 鏂板鎴栫紪杈戞垚鍔熷悗浼氭竻绌鸿〃鍗曟垨閫€鍑虹紪杈戠姸鎬侊紝骞跺埛鏂板垎绫诲垪琛ㄣ€?
- 鍒犻櫎鍒嗙被鍓嶄細浜屾纭銆?
- 濡傛灉鍒嗙被姝ｅ湪琚伐鍏锋垨鏂囩珷浣跨敤锛屽垹闄ゅけ璐ユ椂鏄剧ず锛氣€滆鍒嗙被鍙兘姝ｅ湪琚伐鍏锋垨鏂囩珷浣跨敤锛岃鍏堣皟鏁寸浉鍏冲唴瀹瑰悗鍐嶅垹闄ゃ€傗€濄€?
- `src/lib/db/categories.ts` 鏂板 `createCategory(data)`銆乣updateCategory(id, data)`銆乣deleteCategory(id)`锛屽苟瀹屽杽 `getAdminCategories()`銆?
- 淇濆瓨 payload 鍙寘鍚?`name`銆乣slug`銆乣description`锛沗description` 涓虹┖鏃跺啓鍏?`null`銆?
- `createCategory` / `updateCategory` / `deleteCategory` 鍑洪敊鏃朵細鍦ㄦ帶鍒跺彴杈撳嚭鐪熷疄 Supabase 閿欒銆?
- `AdminShell` 涓€滃垎绫荤鐞嗏€濆叆鍙ｆ敼涓哄凡寮€鏀撅紝鍏跺畠鏈疄鐜板悗鍙板叆鍙ｇ户缁樉绀衡€滃緟寮€鏀锯€濄€?
- 鏈娇鐢ㄣ€佹湭鏆撮湶銆佹湭鎵撳嵃 `service_role_key`銆?
- 宸茶繍琛?`npm run lint`锛岄€氳繃銆?
- 宸茶繍琛?`npm run build`锛岄€氳繃銆?

涓嬩竴姝ワ細

- 鍦?Supabase 涓‘璁?`categories` 琛ㄥ厑璁稿凡鐧诲綍鐢ㄦ埛鎵ц `select`銆乣insert`銆乣update`銆乣delete`锛涘鏋滃悗鍙板啓鍏ュけ璐ワ紝闇€瑕佹鏌ュ搴?RLS policy銆?

## 2026-06-04

浠诲姟锛氬埗浣滃悗鍙版枃绔犵鐞?`/admin/articles`銆?

鏀瑰姩鏂囦欢锛?
- `src/app/admin/articles/page.tsx`
- `src/app/admin/articles/new/page.tsx`
- `src/app/admin/articles/[id]/edit/page.tsx`
- `src/components/admin/AdminArticleForm.tsx`
- `src/components/admin/AdminShell.tsx`
- `src/lib/db/articles.ts`
- `src/types/article.ts`
- `docs/ADMIN_RULES.md`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DESIGN_SYSTEM.md`銆乣docs/DATABASE_SCHEMA.md`銆乣docs/ADMIN_RULES.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- 鏈鍙仛 `articles` 琛ㄥ悗鍙扮鐞嗭紝涓嶄慨鏀瑰墠鍙伴〉闈€佸伐鍏峰悗鍙般€佸垎绫诲悗鍙般€佹爣绛惧悗鍙般€佹姇绋垮鏍搞€佹暟鎹簱缁撴瀯銆佸瑙掕壊鏉冮檺鍜岃矾鐢辩粨鏋勩€?
- 鏂板 `/admin/articles` 鏂囩珷鍒楄〃椤碉紝浠?Supabase `articles` 琛ㄨ鍙栫湡瀹炴暟鎹紝鎸?`updated_at` 鍊掑簭鏄剧ず銆?
- 鏂囩珷鍒楄〃鏄剧ず鏂囩珷鏍囬銆乻lug銆佸垎绫汇€佺姸鎬併€佹洿鏂版椂闂村拰缂栬緫/鍒犻櫎鎿嶄綔銆?
- 鍒犻櫎鏂囩珷鍓嶄細浜屾纭锛屽垹闄ゅけ璐ユ樉绀哄弸濂芥彁绀恒€?
- 鏂板 `/admin/articles/new`锛屾敮鎸佹柊澧炴枃绔犲苟鍐欏叆 `articles` 琛ㄣ€?
- 鏂板 `/admin/articles/[id]/edit`锛屾敮鎸佹寜 id 璇诲彇鏂囩珷骞舵洿鏂?`articles` 琛ㄣ€?
- 鏂板 `AdminArticleForm`锛屽鐢ㄦ柊澧?缂栬緫琛ㄥ崟锛屽苟鎻愪緵蹇呭～鏍￠獙銆佸皝闈㈠浘 URL 鏍￠獙銆佺姸鎬佹牎楠屻€乴oading 鐘舵€佸拰鍙嬪ソ閿欒鎻愮ず銆?
- 琛ㄥ崟瀛楁鍖呭惈 title銆乻lug銆乻ummary銆乧ontent銆乧over_url銆乧ategory_id銆乻tatus銆?
- 姝ｆ枃鍐呭褰撳墠浣跨敤 textarea锛屼笉鍋氬瘜鏂囨湰缂栬緫鍣ㄣ€丮arkdown 棰勮銆佸浘鐗囦笂浼犳垨鏍囩缁戝畾銆?
- `src/lib/db/articles.ts` 鏂板 `getAdminArticles()`銆乣getAdminArticleById(id)`銆乣createArticle(data)`銆乣updateArticle(id, data)`銆乣deleteArticle(id)`銆?
- insert/update 鍓嶄細娓呯悊 payload锛歚category_id` 绌哄€煎啓鍏?`null`锛宍cover_url` 绌哄€煎啓鍏?`null`锛宍status` 寮傚父鏃堕粯璁?`draft`銆?
- `createArticle` / `updateArticle` / `deleteArticle` 鍑洪敊鏃朵細鍦ㄦ帶鍒跺彴杈撳嚭鐪熷疄 Supabase 閿欒銆?
- slug 鑷姩鐢熸垚瑙勫垯锛氳嫳鏂囪浆灏忓啓銆佺┖鏍艰浆鐭í绾裤€佸幓鎺夌壒娈婄鍙凤紱涓枃鏍囬鏃犳硶鐢熸垚绋冲畾 slug 鏃?fallback 涓?`article-${Date.now()}`銆?
- slug 閲嶅鏃惰繑鍥炲弸濂介敊璇細鈥渟lug 宸插瓨鍦紝璇锋崲涓€涓?slug銆傗€濄€?
- `AdminShell` 涓€滄枃绔犵鐞嗏€濆叆鍙ｆ敼涓哄凡寮€鏀撅紝鍏跺畠鏈疄鐜板悗鍙板叆鍙ｇ户缁樉绀衡€滃緟寮€鏀锯€濄€?
- 鏈娇鐢ㄣ€佹湭鏆撮湶銆佹湭鎵撳嵃 `service_role_key`銆?
- 宸茶繍琛?`npm run lint`锛岄€氳繃銆?
- 宸茶繍琛?`npm run build`锛岄€氳繃銆?

涓嬩竴姝ワ細

- 鍦?Supabase 涓‘璁?`articles` 琛ㄥ厑璁稿凡鐧诲綍鐢ㄦ埛鎵ц `select`銆乣insert`銆乣update`銆乣delete`锛涘鏋滃悗鍙板啓鍏ュけ璐ワ紝闇€瑕佹鏌ュ搴?RLS policy銆?

## 2026-06-04

浠诲姟锛氫慨澶嶅悗鍙?`/admin/tools/new` 鏂板宸ュ叿澶辫触鏃舵棤娉曞畾浣嶇湡瀹炲師鍥犵殑闂銆?

鏀瑰姩鏂囦欢锛?
- `src/lib/db/tools.ts`
- `src/types/tool.ts`
- `src/types/database.ts`
- `src/app/admin/tools/[id]/edit/page.tsx`
- `src/components/admin/AdminToolForm.tsx`
- `docs/TASK_LOG.md`

妫€鏌ヤ笌淇锛?

- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DATABASE_SCHEMA.md`銆乣docs/ADMIN_RULES.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- `createTool(data)` 鐜板湪浼氬湪鍐欏叆鍓嶆墦鍗?`console.log("createTool payload:", payload)`銆?
- `createTool(data)` 澶辫触鏃朵細鎵撳嵃 `console.error("createTool error:", error)`锛屽苟杩斿洖 Supabase 鐨?`error.message`銆?
- `updateTool(data)` 鍚屾澧炲姞 `updateTool payload:` 鍜?`updateTool error:`锛屾柟渚垮悗缁紪杈戦〉鎺掓煡銆?
- 鍐欏叆鍓嶅鍔?Supabase Auth session 妫€鏌ワ紱濡傛灉褰撳墠 client 娌℃湁鐧诲綍鎬侊紝浼氭墦鍗?`createTool auth error:` / `updateTool auth error:`銆?
- 淇 `category_id` 绌哄瓧绗︿覆闂锛歚""`銆乣undefined`銆乣"none"` 閮戒細杞垚 `null`銆?
- 淇 `website_url` 绌哄瓧绗︿覆闂锛氭湭濉啓鏃跺啓鍏?`null`銆?
- 淇 `cover_url` 鍐欏叆锛氭湭濉啓鏃跺啓鍏?`null`锛屽～鍐欐椂鍐欏叆瀛楃涓层€?
- 鍚屾 `tools.cover_url` 鐨勫墠绔被鍨嬶紝鏈敼鏁版嵁搴?SQL 缁撴瀯銆?
- 淇 slug 瑙勮寖锛氳嚜鍔?slug 鍙繚鐣欏皬鍐欒嫳鏂囥€佹暟瀛楀拰鐭í绾匡紱涓枃鏍囬鏃犳硶鐢熸垚绋冲畾 slug 鏃惰嚜鍔?fallback 涓?`tool-${Date.now()}`銆?
- 淇 status锛氬彧鍏佽 `draft` / `published`锛屼负绌烘垨寮傚父鏃堕粯璁?`draft`銆?
- 淇濆瓨 payload 鍙寘鍚厑璁稿啓鍏ョ殑鏁版嵁搴撳瓧娈碉細`title`銆乣slug`銆乣summary`銆乣description`銆乣website_url`銆乣cover_url`銆乣category_id`銆乣is_free`銆乣is_open_source`銆乣target_users`銆乣use_cases`銆乣pros`銆乣cons`銆乣risk_notice`銆乣status`銆乣updated_at`銆?
- 绉婚櫎鏂板鏃?payload 涓殑 `name` 鍜?`created_at`锛岄伩鍏嶅彂閫佹湰娆′笉鍏佽鐨勫瓧娈点€?
- 琛ㄥ崟淇濆瓨澶辫触鎻愮ず鏀逛负浼樺厛鏄剧ず杩斿洖鐨勯敊璇俊鎭紝鍚﹀垯鎻愮ず鈥滀繚瀛樺け璐ワ紝璇锋鏌ユ帶鍒跺彴閿欒淇℃伅銆傗€濄€?
- 宸茶繍琛?`npm run lint`锛岄€氳繃銆?
- 宸茶繍琛?`npm run build`锛岄€氳繃銆?

涓嬩竴姝ワ細

- 閲嶆柊鍦?`/admin/tools/new` 娴嬭瘯鏂板宸ュ叿锛涘鏋滀粛澶辫触锛屼紭鍏堟煡鐪嬫祻瑙堝櫒鎺у埗鍙颁腑鐨?`createTool payload:` 鍜?`createTool error:`銆?

## 2026-06-03

浠诲姟锛氬埗浣滃悗鍙板伐鍏风鐞?`/admin/tools`銆?

鏀瑰姩鏂囦欢锛?
- `src/app/admin/tools/page.tsx`
- `src/app/admin/tools/new/page.tsx`
- `src/app/admin/tools/[id]/edit/page.tsx`
- `src/components/admin/AdminShell.tsx`
- `src/components/admin/AdminToolForm.tsx`
- `src/lib/db/tools.ts`
- `src/lib/db/categories.ts`
- `src/types/tool.ts`
- `docs/ADMIN_RULES.md`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DESIGN_SYSTEM.md`銆乣docs/DATABASE_SCHEMA.md`銆乣docs/ADMIN_RULES.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- 鏈鍙仛 `tools` 琛ㄥ悗鍙扮鐞嗭紝涓嶄慨鏀瑰墠鍙伴〉闈€佹枃绔犲悗鍙般€佸垎绫诲悗鍙般€佹爣绛惧悗鍙般€佹暟鎹簱缁撴瀯銆佸瑙掕壊鏉冮檺鍜岃矾鐢辩粨鏋勩€?
- 鏂板 `/admin/tools` 宸ュ叿鍒楄〃椤碉紝浠?Supabase `tools` 琛ㄨ鍙栫湡瀹炴暟鎹紝鎸?`updated_at` 鍊掑簭鏄剧ず銆?
- 宸ュ叿鍒楄〃鏄剧ず宸ュ叿鍚嶇О銆乻lug銆佸畼缃戙€佸垎绫汇€佹槸鍚﹀厤璐广€佹槸鍚﹀紑婧愩€佺姸鎬併€佹洿鏂版椂闂村拰缂栬緫/鍒犻櫎鎿嶄綔銆?
- 鍒犻櫎宸ュ叿鍓嶄細浜屾纭锛屽垹闄ゅけ璐ユ樉绀哄弸濂芥彁绀恒€?
- 鏂板 `/admin/tools/new`锛屾敮鎸佹柊澧炲伐鍏峰苟鍐欏叆 `tools` 琛ㄣ€?
- 鏂板 `/admin/tools/[id]/edit`锛屾敮鎸佹寜 id 璇诲彇宸ュ叿骞舵洿鏂?`tools` 琛ㄣ€?
- 鏂板 `AdminShell`锛屼负宸ュ叿绠＄悊椤甸潰鎻愪緵鍚庡彴鐧诲綍鏍￠獙銆佷晶杈硅彍鍗曘€侀《閮ㄦ爮銆佸綋鍓嶉偖绠卞拰閫€鍑虹櫥褰曟寜閽€?
- 鏂板 `AdminToolForm`锛屽鐢ㄦ柊澧?缂栬緫琛ㄥ崟锛屽苟鎻愪緵蹇呭～鏍￠獙銆乁RL 鏍￠獙銆佺姸鎬佹牎楠屻€乴oading 鐘舵€佸拰鍙嬪ソ閿欒鎻愮ず銆?
- 琛ㄥ崟瀛楁鍖呭惈 title銆乻lug銆乻ummary銆乨escription銆亀ebsite_url銆乧over_url銆乧ategory_id銆乮s_free銆乮s_open_source銆乼arget_users銆乽se_cases銆乸ros銆乧ons銆乺isk_notice銆乻tatus銆?
- 褰撳墠鏁版嵁搴撶被鍨嬪拰鏂囨。鏈０鏄?`cover_url` 瀛楁锛屾湰娆′笉淇敼鏁版嵁搴撶粨鏋勶紝琛ㄥ崟鍏堜繚鐣欒杈撳叆浣嶏紝鍐欏叆 payload 鏆備笉鍖呭惈 `cover_url`銆?
- 鍒嗙被涓嬫媺浠?`categories` 琛ㄨ鍙栵紝璇诲彇澶辫触鏃堕〉闈笉宕╂簝銆?
- `src/lib/db/tools.ts` 鏂板 `getAdminTools()`銆乣getAdminToolById(id)`銆乣createTool(data)`銆乣updateTool(id, data)`銆乣deleteTool(id)`銆?
- 鏈娇鐢ㄣ€佹湭鏆撮湶銆佹湭鎵撳嵃 `service_role_key`銆?
- 宸茶繍琛?`npm run build`锛岄€氳繃銆?

涓嬩竴姝ワ細

- 濡傛灉鍚庡彴鏂板銆佺紪杈戙€佸垹闄ゅけ璐ワ紝闇€瑕佸湪 Supabase 涓负宸茬櫥褰曠敤鎴烽厤缃?`tools` 琛ㄧ殑 `insert`銆乣update`銆乣delete` RLS policy銆?

## 2026-06-03

浠诲姟锛氫慨澶?`/admin` 鍚庡彴棣栭〉缁熻鍗＄墖璇诲彇鐪熷疄 Supabase 鏁伴噺銆?

鏀瑰姩鏂囦欢锛?
- `src/app/admin/page.tsx`
- `src/lib/db/admin.ts`
- `src/lib/db/admin-stats.ts`
- `docs/TASK_LOG.md`

妫€鏌ヤ笌淇锛?

- 鏂板 `src/lib/db/admin.ts`锛岄泦涓疄鐜板悗鍙扮粺璁¤鍙栧嚱鏁?`getAdminStats()`銆?
- `getAdminStats()` 杩斿洖鏍煎紡涓?`{ tools, articles, submissions, reports }`銆?
- 宸ュ叿鏁伴噺浣跨敤 Supabase count 鏌ヨ `tools` 琛ㄣ€?
- 鏂囩珷鏁伴噺浣跨敤 Supabase count 鏌ヨ `articles` 琛ㄣ€?
- 鎶曠鏁伴噺浣跨敤 Supabase count 鏌ヨ `submissions` 琛ㄣ€?
- 鎶曡瘔鏁伴噺浣跨敤 Supabase count 鏌ヨ `reports` 琛ㄣ€?
- 姣忛」缁熻閮戒娇鐢?`{ count: "exact", head: true }`锛屼笉璇诲彇澶ч噺鏁版嵁銆?
- 浠绘剰鍗曢」鏌ヨ澶辫触鏃讹紝璇ラ」杩斿洖 `0`锛屽苟鍦ㄦ帶鍒跺彴杈撳嚭閿欒锛岄〉闈笉鏄剧ず鎶€鏈敊璇€?
- `/admin` 鍚庡彴棣栭〉鏀逛负浠?`src/lib/db/admin.ts` 璇诲彇缁熻銆?
- `src/lib/db/admin-stats.ts` 鏀逛负杞彂 `src/lib/db/admin.ts`锛岄伩鍏嶄繚鐣欎袱濂楃粺璁￠€昏緫銆?
- 淇濇寔鐜版湁 `/admin` 鐧诲綍淇濇姢閫昏緫涓嶅彉锛屼笉鍋?CRUD锛屼笉鏀瑰墠鍙伴〉闈€?
- 宸叉墽琛?`npm run lint`锛岄€氳繃銆?
- 宸叉墽琛?`npm run build`锛岄€氳繃銆?
- 宸叉竻鐞?`.next` 骞堕噸鍚?3001 绔彛 dev 鏈嶅姟銆?

涓嬩竴姝ワ細

- 鐧诲綍 `/admin` 鍚庢鏌ユ姇绋挎暟閲忔槸鍚﹀拰 Supabase `submissions` 琛ㄨ鏁颁竴鑷淬€?
- 濡傛灉 `submissions` 琛ㄦ湁鏁版嵁浣嗗悗鍙颁粛鏄剧ず `0`锛岄渶瑕佹鏌?Supabase RLS 鏄惁鍏佽褰撳墠宸茬櫥褰曠鐞嗗憳瀵?`submissions` 鎵ц `select/count`銆?

## 2026-06-03

浠诲姟锛氬悗鍙扮櫥褰曚笌鍚庡彴棣栭〉鍩虹楠屾敹淇銆?

鏀瑰姩鏂囦欢锛?
- `src/app/admin/login/page.tsx`
- `src/app/admin/page.tsx`
- `src/lib/db/admin-stats.ts`
- `docs/ADMIN_RULES.md`
- `docs/TASK_LOG.md`

妫€鏌ヤ笌淇锛?

- `/admin/login` 淇濇寔 Supabase Auth 閭瀵嗙爜鐧诲綍銆?
- `/admin/login` 鐧诲綍鐘舵€佹鏌ユ敼涓轰娇鐢?Supabase `auth.getUser()`銆?
- `/admin/login` 淇濈暀鐧诲綍澶辫触鍙嬪ソ鎻愮ず銆佺櫥褰曚腑 loading銆佹彁浜や腑绂佺敤鎸夐挳銆?
- `/admin/login` 瀵嗙爜杈撳叆妗嗕繚鎸?`type="password"`銆?
- `/admin` 鏉冮檺淇濇姢鏀逛负浣跨敤 Supabase `auth.getUser()` 鑾峰彇褰撳墠鐢ㄦ埛銆?
- `/admin` 鍦ㄧ敤鎴锋牎楠屽畬鎴愬墠鍙樉绀烘潈闄愭鏌ユ彁绀猴紝涓嶆樉绀哄悗鍙拌彍鍗曘€佺粺璁″崱鐗囨垨绠＄悊鍐呭銆?
- 鏈櫥褰曡闂?`/admin` 浼氳烦杞埌 `/admin/login?next=admin`銆?
- `/admin` 椤堕儴鏍忔樉绀哄綋鍓嶇櫥褰曢偖绠憋紝骞舵彁渚涢€€鍑虹櫥褰曟寜閽€?
- 閫€鍑虹櫥褰曡皟鐢?Supabase `auth.signOut()`锛屽け璐ユ椂鏄剧ず鍙嬪ソ鎻愮ず锛屼笉鍋氬墠绔亣閫€鍑恒€?
- 鍚庡彴鑿滃崟琛ラ綈锛氬悗鍙伴椤点€佸伐鍏风鐞嗐€佹枃绔犵鐞嗐€佸垎绫荤鐞嗐€佹爣绛剧鐞嗐€佹姇绋跨鐞嗐€佹姇璇夌鐞嗐€佽繑鍥炲墠鍙般€?
- 鏈疄鐜扮殑鍚庡彴鑿滃崟椤规樉绀衡€滃緟寮€鏀锯€濓紝淇濈暀鍚庣画璺敱缁撴瀯锛屼笉鍋?CRUD銆?
- `getAdminStats()` 澧炲姞 Supabase 褰撳墠鐢ㄦ埛鏍￠獙锛屾湭鐧诲綍涓嶄細璇诲彇缁熻銆?
- `getAdminStats()` 缁х画璇诲彇 `tools`銆乣articles`銆乣submissions`銆乣reports` 鍥涘紶琛ㄧ湡瀹炴暟閲忋€?
- 缁熻璇诲彇澶辫触鏃惰繑鍥?0 鍜屽弸濂芥彁绀猴紝鎺у埗鍙拌緭鍑洪敊璇敤浜庡紑鍙戣皟璇曘€?
- 宸叉墽琛?`npm run lint`锛岄€氳繃銆?
- 宸叉墽琛?`npm run build`锛岄€氳繃銆?
- 宸叉竻鐞?`.next` 骞堕噸鍚?3001 绔彛 dev 鏈嶅姟銆?
- 宸茬敤娴忚鍣ㄦ鏌ユ湭鐧诲綍璁块棶 `/admin`锛氭渶缁堝仠鍦?`/admin/login?next=admin`锛屾病鏈夊嚭鐜板悗鍙扮粺璁″唴瀹广€?
- 宸茬敤娴忚鍣ㄦ鏌?`/admin/login`锛欳SS 姝ｅ父鍔犺浇锛屾棤妯悜婊氬姩銆?

涓嬩竴姝ワ細

- 浣跨敤 Supabase Auth 涓殑绠＄悊鍛橀偖绠卞瘑鐮佹墜鍔ㄧ櫥褰曪紝纭 `/admin` 鏄惁鏄剧ず褰撳墠閭鍜屽洓涓粺璁″崱鐗囩湡瀹炴暟閲忋€?
- 濡傛灉缁熻鍗＄墖涓?0 鎴栨彁绀鸿鍙栧け璐ワ紝闇€瑕佹鏌?Supabase RLS 鏄惁鍏佽宸茬櫥褰曠敤鎴疯鍙?`tools`銆乣articles`銆乣submissions`銆乣reports`銆?

## 2026-06-03

浠诲姟锛氬垱寤哄悗鍙扮櫥褰?`/admin/login` 鍜屽悗鍙伴椤?`/admin`銆?

鏀瑰姩鏂囦欢锛?
- `src/app/admin/login/page.tsx`
- `src/app/admin/page.tsx`
- `src/lib/db/admin-stats.ts`
- `docs/ADMIN_RULES.md`
- `docs/TASK_LOG.md`

妫€鏌ヤ笌瀹炵幇锛?

- 鏂板 `/admin/login`锛屼娇鐢?Supabase Auth 閭瀵嗙爜鐧诲綍銆?
- 鐧诲綍椤典娇鐢ㄥ鎴风琛ㄥ崟鎻愪氦锛屽寘鍚偖绠便€佸瘑鐮併€佺櫥褰曚腑鐘舵€併€佸け璐ユ彁绀恒€?
- 鐧诲綍鎴愬姛鍚庤烦杞埌 `/admin`銆?
- 鏂板 `/admin` 鍚庡彴棣栭〉锛屽鎴风妫€鏌?Supabase session銆?
- 鏈櫥褰曡闂?`/admin` 浼氳嚜鍔ㄨ烦杞埌 `/admin/login?next=admin`銆?
- 鍚庡彴棣栭〉鍖呭惈宸︿晶鑿滃崟銆侀《閮ㄦ爮銆侀€€鍑虹櫥褰曟寜閽€?
- 鍚庡彴棣栭〉鏄剧ず缁熻鍗＄墖锛氬伐鍏锋暟閲忋€佹枃绔犳暟閲忋€佹姇绋挎暟閲忋€佹姇璇夋暟閲忋€?
- 鏂板 `getAdminStats()`锛岃鍙?`tools`銆乣articles`銆乣submissions`銆乣reports` 鍥涘紶琛ㄧ殑 count銆?
- 鍚庡彴缁熻鍙娇鐢?Supabase anon client 鎼厤褰撳墠鐧诲綍 session锛屼笉浣跨敤 `service_role_key`銆?
- 鑿滃崟涓殑宸ュ叿绠＄悊銆佹枃绔犵鐞嗐€佹姇绋垮鏍搞€佹姇璇夊鐞嗗綋鍓嶅彧浣滀负鍗犱綅鍏ュ彛锛屼笉鍋?CRUD銆?
- 宸叉洿鏂?`docs/ADMIN_RULES.md`锛岃褰曞綋鍓嶅悗鍙伴樁娈佃鍒欍€?
- 宸叉墽琛?`npm run lint`锛岄€氳繃銆?
- 宸叉墽琛?`npm run build`锛岄€氳繃銆?
- 宸查噸鍚?3001 绔彛 dev 鏈嶅姟骞舵竻鐞?`.next` 缂撳瓨锛岄伩鍏?build 鍜?dev 缂撳瓨娣风敤閫犳垚璧勬簮寮傚父銆?
- 宸茬敤娴忚鍣ㄦ鏌?`/admin/login`锛氭牱寮忓姞杞芥甯革紝鏃犳í鍚戞粴鍔ㄣ€?
- 宸茬敤娴忚鍣ㄦ鏌ユ湭鐧诲綍璁块棶 `/admin`锛氫細璺宠浆鍒?`/admin/login?next=admin`銆?

涓嬩竴姝ワ細

- 浣跨敤 Supabase Auth 涓凡鍒涘缓鐨勭鐞嗗憳閭瀵嗙爜鐧诲綍锛岀‘璁?`/admin` 缁熻鍗＄墖鏄惁鑳借鍒扮湡瀹炴暟閲忋€?
- 濡傛灉缁熻鍗＄墖璇诲彇澶辫触锛岄渶瑕佹鏌?Supabase RLS 鏄惁鍏佽宸茬櫥褰曠鐞嗗憳璇诲彇 `tools`銆乣articles`銆乣submissions`銆乣reports`銆?

## 2026-06-03

浠诲姟锛氱揣鎬ヤ慨澶嶅墠鍙版牱寮忚祫婧?404 鍜岃〃鍗曢粯璁?GET 鎻愪氦闂銆?

鏀瑰姩鏂囦欢锛?
- `src/app/submit/page.tsx`
- `src/app/copyright/page.tsx`
- `docs/TASK_LOG.md`

妫€鏌ユ枃浠讹細
- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/lib/db/submissions.ts`
- `src/lib/db/reports.ts`

妫€鏌ヤ笌淇锛?

- 纭 `src/app/layout.tsx` 宸叉纭紩鍏?`./globals.css`锛屽苟淇濈暀 `<html lang="zh-CN">` 涓?`<body>` 缁撴瀯銆?
- 纭 `src/app/globals.css` 椤堕儴淇濈暀 Tailwind 鍩虹鎸囦护锛屼笖鍏ㄧ珯娴呰壊娓愬彉鑳屾櫙銆乣overflow-x: hidden`銆乣glass-card` 绛夐€氱敤鏍峰紡鏈夋晥銆?
- 涓?`/submit` 琛ㄥ崟澧炲姞 `method="post"`锛岄伩鍏?React 灏氭湭鍔犺浇鎴栨按鍚堝紓甯告椂鍥為€€鎴愰粯璁?GET 鏌ヨ鎻愪氦銆?
- 纭 `/submit` 宸蹭娇鐢?`"use client"`銆乣onSubmit={handleSubmit}`銆乣event.preventDefault()`銆佹彁浜や腑 loading銆佹垚鍔熸彁绀哄拰澶辫触鎻愮ず銆?
- 涓?`/copyright` 琛ㄥ崟澧炲姞 `method="post"`锛岄伩鍏?React 灏氭湭鍔犺浇鎴栨按鍚堝紓甯告椂鍥為€€鎴愰粯璁?GET 鏌ヨ鎻愪氦銆?
- 纭 `/copyright` 宸蹭娇鐢?`"use client"`銆乣onSubmit={handleSubmit}`銆乣event.preventDefault()`銆佹彁浜や腑 loading銆佹垚鍔熸彁绀哄拰澶辫触鎻愮ず銆?
- 纭 `createSubmission(data)` 浣跨敤鍖垮悕 Supabase client 鍐欏叆 `submissions` 琛紝骞堕粯璁ゅ啓鍏?`status: "pending"`銆?
- 纭 `createReport(data)` 浣跨敤鍖垮悕 Supabase client 鍐欏叆 `reports` 琛紝骞堕粯璁ゅ啓鍏?`status: "pending"`銆?
- 宸叉墽琛?`npm run lint`锛岄€氳繃銆?
- 宸叉墽琛?`npm run build`锛岄€氳繃銆?
- 宸插仠姝㈡湰鍦?3000 绔彛 dev 鏈嶅姟锛岀‘璁?`.next` 浣嶄簬褰撳墠椤圭洰鐩綍鍚庡垹闄ょ紦瀛橈紝骞堕噸鏂板惎鍔?dev 鏈嶅姟銆?
- 宸茬敤娴忚鍣ㄦ鏌?`/submit` 涓?`/copyright`锛欳SS 宸插姞杞斤紝鐜荤拑鍗＄墖鏍峰紡鐢熸晥锛岄〉闈笉鍐嶆槸绾?HTML銆?
- 宸茬敤娴忚鍣ㄦ鏌ョ┖琛ㄥ崟鐐瑰嚮鎻愪氦锛歎RL 涓嶅啀鍑虹幇 `?toolName=...` 鎴?`?ownerName=...` 鐨勯粯璁?GET 鎻愪氦褰㈠紡銆?
- 宸茬敤娴忚鍣ㄦ鏌?`/submit` 涓?`/copyright` 鎵嬫満绔棤妯悜婊氬姩銆?

涓嬩竴姝ワ細

- 濡傛灉鐪熷疄鎻愪氦浠嶅啓鍏ュけ璐ワ紝闇€瑕佹鏌?Supabase 涓?`submissions` 鍜?`reports` 琛ㄦ槸鍚﹀瓨鍦紝骞剁‘璁?RLS 鏄惁鍏佽鍖垮悕 insert銆?

## 2026-06-03

浠诲姟锛氭帴鍏?`/submit` 鎶曠椤靛拰 `/copyright` 鐗堟潈鎶曡瘔椤电殑鏁版嵁鍐欏叆銆?

鏀瑰姩鏂囦欢锛?

- `src/app/submit/page.tsx`
- `src/app/copyright/page.tsx`
- `src/lib/db/submissions.ts`
- `src/lib/db/reports.ts`
- `src/types/submission.ts`
- `src/types/report.ts`
- `src/types/database.ts`
- `docs/DATABASE_SCHEMA.md`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DESIGN_SYSTEM.md`銆乣docs/DATABASE_SCHEMA.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- 鏂板 `createSubmission(data)`锛屽啓鍏?`submissions` 琛ㄣ€?
- 鏂板 `createReport(data)`锛屽啓鍏?`reports` 琛ㄣ€?
- 涓や釜鍐欏叆鍑芥暟閮戒娇鐢ㄧ幇鏈?Supabase anon client锛屼笉浣跨敤 `service_role_key`銆?
- `/submit` 瀛楁鏄犲皠涓?`tool_name`銆乣website_url`銆乣summary`銆乣reason`銆乣email`銆乣status`銆?
- `/submit` 榛樿鍐欏叆 `status = pending`銆?
- `/submit` 澧炲姞宸ュ叿鍚嶇О銆佸畼鏂瑰湴鍧€銆佸伐鍏风畝浠嬪繀濉牎楠屻€?
- `/submit` 澧炲姞瀹樻柟鍦板潃蹇呴』涓?`http` 鎴?`https` 閾炬帴鐨勬牎楠屻€?
- `/submit` 澧炲姞鍙€夐偖绠辨牸寮忔牎楠屻€?
- `/submit` 鎻愪氦涓寜閽樉绀衡€滄彁浜や腑...鈥濓紝骞剁姝㈤噸澶嶇偣鍑汇€?
- `/submit` 鎴愬姛鍚庢樉绀衡€滄彁浜ゆ垚鍔燂紝鎴戜滑浼氳繘琛屼汉宸ュ鏍稿悗鍐冲畾鏄惁鏀跺綍銆傗€濆苟娓呯┖琛ㄥ崟銆?
- `/submit` 澶辫触鍚庢樉绀衡€滄彁浜ゅけ璐ワ紝璇风◢鍚庨噸璇曘€傗€濓紝涓嶅悜鐢ㄦ埛灞曠ず鎶€鏈敊璇€?
- `/copyright` 瀛楁鏄犲皠涓?`owner_name`銆乣email`銆乣page_url`銆乣issue_type`銆乣proof`銆乣request`銆乣status`銆?
- `/copyright` 榛樿鍐欏叆 `status = pending`銆?
- `/copyright` 澧炲姞鏉冨埄浜恒€侀偖绠便€侀〉闈㈤摼鎺ャ€侀棶棰樼被鍨嬨€佸鐞嗚姹傚繀濉牎楠屻€?
- `/copyright` 澧炲姞閭鏍煎紡鏍￠獙銆?
- `/copyright` 澧炲姞娑夊強椤甸潰閾炬帴蹇呴』涓?`http` 鎴?`https` 閾炬帴鐨勬牎楠屻€?
- `/copyright` 鎻愪氦涓寜閽樉绀衡€滄彁浜や腑...鈥濓紝骞剁姝㈤噸澶嶇偣鍑汇€?
- `/copyright` 鎴愬姛鍚庢樉绀衡€滃弽棣堝凡鎻愪氦锛屾垜浠細鍦ㄦ牳瀹炲悗鍙婃椂澶勭悊銆傗€濆苟娓呯┖琛ㄥ崟銆?
- `/copyright` 澶辫触鍚庢樉绀衡€滄彁浜ゅけ璐ワ紝璇风◢鍚庨噸璇曘€傗€濓紝涓嶅悜鐢ㄦ埛灞曠ず鎶€鏈敊璇€?
- 宸叉洿鏂?`docs/DATABASE_SCHEMA.md`锛岃ˉ鍏?`submissions`銆乣reports` 琛ㄥ拰 RLS 娉ㄦ剰浜嬮」銆?
- 鏈慨鏀归椤点€佸伐鍏烽〉銆佹枃绔犻〉銆佹悳绱㈤〉銆丠eader銆丗ooter銆佸悗鍙般€丼upabase 璇诲彇閫昏緫銆佽瑙夎璁＄郴缁熷拰璺敱缁撴瀯銆?
- 宸茶繍琛?`npm run lint`锛岄€氳繃銆?
- 宸茶繍琛?`npm run build`锛岄€氳繃銆?
- 宸查噸鍚?`npm run dev`锛屽苟纭 `/submit` 鍜?`/copyright` 杩斿洖 200銆?
- 宸茬敤娴忚鍣ㄦ鏌?`/submit` 绌鸿〃鍗曟牎楠屻€乁RL 鏍煎紡鏍￠獙銆侀偖绠辨牸寮忔牎楠屾甯搞€?
- 宸茬敤娴忚鍣ㄦ鏌?`/copyright` 绌鸿〃鍗曟牎楠屻€乁RL 鏍煎紡鏍￠獙銆侀偖绠辨牸寮忔牎楠屾甯搞€?
- 宸茬敤娴忚鍣ㄦ鏌?`/submit` 鍜?`/copyright` 鎵嬫満绔棤妯悜婊氬姩銆?

涓嬩竴姝ワ細

- 濡傛灉琛ㄥ崟鎻愪氦澶辫触锛岄渶瑕佸埌 Supabase 缁?`submissions` 鍜?`reports` 琛ㄦ坊鍔犲厑璁稿尶鍚?`insert` 鐨?RLS policy銆?

## 鐢ㄩ€?

璁板綍姣忔灏忎换鍔＄殑鎵ц鎯呭喌锛屾柟渚夸互鍚庡洖鐪嬮」鐩负浠€涔堝彉鎴愮幇鍦ㄨ繖鏍枫€?

## 璁板綍瑙勫垯

- 姣忓畬鎴愪竴涓皬姝ラ锛岄兘鍦ㄦ湰鏂囨。杩藉姞璁板綍銆?
- 璁板綍鍐呭鍖呮嫭鏃ユ湡銆佷换鍔°€佹敼鍔ㄦ枃浠躲€佹鏌ユ柟寮忋€佷笅涓€姝ャ€?
- 涓嶅啓鏃犲叧闂茶亰锛屽彧淇濈暀椤圭洰浜嬪疄銆?

## 2026-05-31

浠诲姟锛氶」鐩垵濮嬪寲妫€鏌ュ苟鍒涘缓鍩虹鏂囨。銆?

鏀瑰姩鏂囦欢锛?

- `docs/PROJECT_RULES.md`
- `docs/ROADMAP.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/DATABASE_SCHEMA.md`
- `docs/CONTENT_RULES.md`
- `docs/ADMIN_RULES.md`
- `docs/CHANGELOG.md`
- `docs/TASK_LOG.md`
- `docs/ANTI_ENTROPY.md`

妫€鏌ユ柟寮忥細

- 鏌ョ湅浠撳簱鏂囦欢缁撴瀯銆?
- 纭褰撳墠浠撳簱鍙湁 `.git`锛屽皻鏈垵濮嬪寲 Next.js 椤圭洰鏂囦欢銆?

涓嬩竴姝ワ細

- 鍒濆鍖?Next.js App Router + TypeScript + Tailwind CSS 椤圭洰楠ㄦ灦銆?

## 2026-05-31

浠诲姟锛氬埗浣滈潤鎬侀椤点€?

鏀瑰姩鏂囦欢锛?

- `.gitignore`
- `eslint.config.mjs`
- `package.json`
- `package-lock.json`
- `next.config.ts`
- `postcss.config.mjs`
- `tailwind.config.ts`
- `tsconfig.json`
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/data/mock-tools.ts`
- `src/data/mock-articles.ts`
- `src/components/home-page.tsx`
- `src/components/site-header.tsx`
- `src/components/hero-section.tsx`
- `src/components/search-panel.tsx`
- `src/components/category-grid.tsx`
- `src/components/featured-tools.tsx`
- `src/components/tool-card.tsx`
- `src/components/latest-articles.tsx`
- `src/components/article-card.tsx`
- `src/components/site-footer.tsx`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 纭棣栭〉浠ｇ爜鎷嗗垎鍒?`src/components`銆?
- 纭鍋囨暟鎹綅浜?`src/data/mock-tools.ts` 鍜?`src/data/mock-articles.ts`銆?
- 宸茶繍琛?`npm run lint`銆?
- 宸茶繍琛?`npm run build`銆?
- 宸插惎鍔?`npm run dev`锛屽苟鍦ㄦ祻瑙堝櫒妫€鏌ョ數鑴戠鍜屾墜鏈虹甯冨眬銆?
- 鐢佃剳绔拰鎵嬫満绔鍙ｅ潎鏈彂鐜版í鍚戞孩鍑恒€?

涓嬩竴姝ワ細

- 缁х画妫€鏌ラ椤垫枃妗堝拰鍗＄墖鍐呭锛岀‘璁ゆ槸鍚﹂渶瑕佽皟鏁村垎绫汇€佸伐鍏峰拰鏂囩珷鐨勫睍绀轰俊鎭€?

## 2026-05-31

浠诲姟锛氬埗浣滃伐鍏峰垪琛ㄩ〉 `/tools`銆?

鏀瑰姩鏂囦欢锛?

- `src/app/tools/page.tsx`
- `src/components/tools/tools-page.tsx`
- `src/components/tools/tools-hero.tsx`
- `src/components/tools/tools-filter-panel.tsx`
- `src/components/tools/tools-grid.tsx`
- `src/components/tools/tools-card.tsx`
- `src/components/tools/tools-no-results.tsx`
- `src/components/site-header.tsx`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 浣跨敤 `src/data/mock-tools.ts` 鍋囨暟鎹€?
- 涓嶈繛鎺ユ暟鎹簱銆?
- 宸茶繍琛?`npm run lint`銆?
- 宸茶繍琛?`npm run build`銆?
- 宸插惎鍔?`npm run dev` 鍚庢墦寮€ `/tools`銆?
- 宸叉鏌ユ悳绱㈠姛鑳斤紝鍙尮閰嶅伐鍏锋爣棰樸€佺畝浠嬨€佸垎绫诲拰鏍囩銆?
- 宸叉鏌ュ垎绫荤瓫閫夊拰鏍囩绛涢€夈€?
- 宸叉鏌ユ棤缁撴灉鎻愮ず銆?
- 宸叉鏌ュ搷搴斿紡甯冨眬锛氱數鑴戠 3 鏍忥紝骞虫澘绔?2 鏍忥紝鎵嬫満绔?1 鏍忋€?
- 鐢佃剳绔€佸钩鏉跨鍜屾墜鏈虹瑙嗗彛鍧囨湭鍙戠幇妯悜婧㈠嚭銆?

涓嬩竴姝ワ細

- 妫€鏌ュ伐鍏峰垪琛ㄩ〉鐨勭瓫閫夋枃妗堝拰榛樿鍋囨暟鎹槸鍚﹂渶瑕佽ˉ鍏呫€?

## 2026-05-31

浠诲姟锛氳皟鏁村伐鍏峰睍绀洪€昏緫锛屾柊澧炲伐鍏疯鎯呴〉銆?

鏀瑰姩鏂囦欢锛?

- `src/data/mock-tools.ts`
- `src/components/tools/tools-card.tsx`
- `src/components/tool-card.tsx`
- `src/app/tools/[slug]/page.tsx`
- `src/components/tools/tool-detail-page.tsx`
- `src/components/common/CopyrightNotice.tsx`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 鍒楄〃椤靛伐鍏峰崱鐗囨敼涓衡€滄煡鐪嬭鎯呪€濓紝涓嶅啀鐩存帴鏄剧ず瀹樼綉鎸夐挳銆?
- 璇︽儏椤典娇鐢?`src/data/mock-tools.ts` 鍋囨暟鎹€?
- 璇︽儏椤靛畼缃戞寜閽粎鍦ㄥ瓨鍦?`website_url` 鏃舵樉绀恒€?
- 澶栭儴瀹樼綉閾炬帴浣跨敤鏂扮獥鍙ｆ墦寮€锛屽苟璁剧疆 `rel="nofollow noopener noreferrer"`銆?
- 宸茶繍琛?`npm run lint`銆?
- 宸茶繍琛?`npm run build`銆?
- 宸插惎鍔?`npm run dev` 鍚庢鏌?`/tools` 鍜?`/tools/raycast`銆?
- 宸叉鏌?`/tools` 鏈?6 涓€滄煡鐪嬭鎯呪€濆叆鍙ｏ紝鏈樉绀哄畼缃戞寜閽€?
- 宸叉鏌モ€滄煡鐪嬭鎯呪€濆彲璺宠浆鍒?`/tools/raycast`銆?
- 宸叉鏌ヨ鎯呴〉鍖呭惈涓昏鍐呭鍖恒€佺浉鍏虫帹鑽愩€佺粺涓€鐗堟潈澹版槑鍜?2 涓€滆闂畼鏂圭綉绔欌€濇寜閽€?
- 宸叉鏌ヨ鎯呴〉鐢佃剳绔拰鎵嬫満绔鍙ｅ潎鏈彂鐜版í鍚戞孩鍑恒€?

涓嬩竴姝ワ細

- 妫€鏌ヨ鎯呴〉鍐呭缁撴瀯鏄惁闇€瑕佺户缁ˉ鍏呯湡瀹炶繍钀ュ瓧娈点€?

## 2026-05-31

浠诲姟锛氫紭鍖?`/tools` 椤甸潰瑙嗚璁捐銆?

鏀瑰姩鏂囦欢锛?

- `src/components/tools/tools-page.tsx`
- `src/components/tools/tools-hero.tsx`
- `src/components/tools/tools-filter-panel.tsx`
- `src/components/tools/tools-card.tsx`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 浠呰皟鏁?`/tools` 椤甸潰瑙嗚灞傦紝涓嶄慨鏀圭瓫閫変笟鍔￠€昏緫銆?
- 涓嶈繛鎺ユ暟鎹簱銆?
- 涓嶄慨鏀硅矾鐢辩粨鏋勩€?
- 涓嶆柊澧炰緷璧栥€?
- 淇濇寔宸ュ叿鍗＄墖鎸夐挳涓衡€滄煡鐪嬭鎯呪€濓紝涓嶆樉绀衡€滄煡鐪嬪畼缃戔€濄€?
- 宸茶繍琛?`npm run lint`銆?
- 宸茶繍琛?`npm run build`銆?
- 宸插惎鍔?`npm run dev` 鍚庢鏌?`/tools` 鐢佃剳绔€佸钩鏉跨鍜屾墜鏈虹甯冨眬銆?
- 宸叉鏌ョ數鑴戠 3 鏍忋€佸钩鏉跨 2 鏍忋€佹墜鏈虹 1 鏍忋€?
- 鐢佃剳绔€佸钩鏉跨鍜屾墜鏈虹瑙嗗彛鍧囨湭鍙戠幇妯悜婧㈠嚭銆?
- 宸叉鏌ラ〉闈㈡湭鍑虹幇鈥滄煡鐪嬪畼缃戔€濄€?

涓嬩竴姝ワ細

- 鏍规嵁瀹為檯娴忚鏁堟灉缁х画寰皟宸ュ叿鍗＄墖鍐呭瀵嗗害鍜岀瓫閫夐」鏁伴噺銆?

## 2026-05-31

浠诲姟锛氬交搴曢噸鏂拌璁?`/tools` 椤甸潰瑙嗚銆?

鏀瑰姩鏂囦欢锛?

- `src/components/tools/tools-page.tsx`
- `src/components/tools/tools-grid.tsx`
- `src/components/tools/ToolsHero.tsx`
- `src/components/tools/ToolsFilterPanel.tsx`
- `src/components/tools/ToolCard.tsx`
- `src/components/tools/ToolsGridHeader.tsx`
- `src/components/tools/tools-hero.tsx`
- `src/components/tools/tools-filter-panel.tsx`
- `src/components/tools/tools-card.tsx`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 淇濈暀鐜版湁鎼滅储銆佺瓫閫夊拰璺宠浆璇︽儏鍔熻兘銆?
- 涓嶈繛鎺ユ暟鎹簱銆?
- 涓嶄慨鏀硅矾鐢辩粨鏋勩€?
- 涓嶆柊澧炰緷璧栥€?
- 浣跨敤鎸囧畾缁勪欢鎷嗗垎鏂囦欢銆?
- 宸茶繍琛?`npm run lint`銆?
- 宸茶繍琛?`npm run build`銆?
- 宸插惎鍔?`npm run dev` 鍚庢鏌?`/tools` 鐢佃剳绔€佸钩鏉跨鍜屾墜鏈虹甯冨眬銆?
- 宸叉鏌ョ數鑴戠 3 鏍忋€佸钩鏉跨 2 鏍忋€佹墜鏈虹 1 鏍忋€?
- 鐢佃剳绔€佸钩鏉跨鍜屾墜鏈虹瑙嗗彛鍧囨湭鍙戠幇妯悜婧㈠嚭銆?
- 宸叉鏌ュ垎绫荤瓫閫夊拰鏍囩绛涢€夈€?
- 宸叉鏌モ€滄煡鐪嬭鎯呪€濆彲璺宠浆鍒拌鎯呴〉銆?
- 宸叉鏌ラ〉闈㈡湭鍑虹幇鈥滄煡鐪嬪畼缃戔€濄€?

涓嬩竴姝ワ細

- 缁х画鏍规嵁瀹為檯瑙嗚鏁堟灉寰皟棣栧睆楂樺害銆佺瓫閫夐潰鏉垮瘑搴﹀拰宸ュ叿鍗＄墖鏂囨闀垮害銆?

## 2026-05-31

浠诲姟锛氫互 Apple 瀹樼綉璁捐鐞嗗康閲嶅啓 `/tools` 椤甸潰 UI銆?

鏀瑰姩鏂囦欢锛?

- `src/components/tools/tools-page.tsx`
- `src/components/tools/tools-grid.tsx`
- `src/components/tools/ToolsHero.tsx`
- `src/components/tools/ToolsFilterPanel.tsx`
- `src/components/tools/ToolCard.tsx`
- `src/components/tools/ToolsGridHeader.tsx`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 淇濈暀鐜版湁鎼滅储銆佸垎绫荤瓫閫夈€佹爣绛剧瓫閫夊拰璺宠浆璇︽儏鍔熻兘銆?
- 涓嶈繛鎺ユ暟鎹簱銆?
- 涓嶄慨鏀瑰悗鍙般€?
- 涓嶄慨鏀?mock 鏁版嵁鏉ユ簮銆?
- 涓嶆柊澧炰緷璧栥€?
- 椤甸潰涓嶅嚭鐜扳€滄煡鐪嬪畼缃戔€濄€?
- 宸茶繍琛?`npm run lint`銆?
- 宸茶繍琛?`npm run build`銆?
- 宸插惎鍔?`npm run dev` 鍚庢鏌?`/tools` 妗岄潰绔€佸钩鏉跨鍜屾墜鏈虹甯冨眬銆?
- 宸叉鏌ョ數鑴戠 3 鏍忋€佸钩鏉跨 2 鏍忋€佹墜鏈虹 1 鏍忋€?
- 宸叉鏌ユ悳绱?`Markdown` 鍙瓫閫夊嚭 `Obsidian`銆?
- 宸叉鏌ュ垎绫荤瓫閫?`寮€婧愰」鐩甡 鍙瓫閫夊嚭 `Supabase` 鍜?`LocalSend`銆?
- 宸叉鏌ユ爣绛剧瓫閫?`PostgreSQL` 鍙瓫閫夊嚭 `Supabase`銆?
- 宸叉鏌モ€滄煡鐪嬭鎯?鈫掆€濆彲璺宠浆鍒?`/tools/raycast`銆?
- 鐢佃剳绔€佸钩鏉跨鍜屾墜鏈虹瑙嗗彛鍧囨湭鍙戠幇妯悜婧㈠嚭銆?

涓嬩竴姝ワ細

- 鏍规嵁瀹為檯娴忚鏁堟灉缁х画寰皟 Apple 寮忕暀鐧姐€佸崱鐗囧唴瀹瑰瘑搴﹀拰绉诲姩绔灞忛珮搴︺€?

## 2026-05-31

浠诲姟锛氬 `/tools` 椤甸潰杩涜楂橀樁瑙嗚閲嶆瀯銆?

鏀瑰姩鏂囦欢锛?

- `src/components/tools/tools-page.tsx`
- `src/components/tools/ToolsHero.tsx`
- `src/components/tools/ToolsFilterPanel.tsx`
- `src/components/tools/ToolCard.tsx`
- `src/components/tools/ToolsGridHeader.tsx`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 淇濈暀鐜版湁鎼滅储銆佸垎绫荤瓫閫夈€佹爣绛剧瓫閫夊拰璺宠浆璇︽儏鍔熻兘銆?
- 涓嶈繛鎺ユ暟鎹簱銆?
- 涓嶄慨鏀硅矾鐢辩粨鏋勩€?
- 涓嶆柊澧炰緷璧栥€?
- 椤甸潰涓嶅嚭鐜扳€滄煡鐪嬪畼缃戔€濄€?
- 宸茶繍琛?`npm run lint`銆?
- 宸茶繍琛?`npm run build`銆?
- 宸插惎鍔?`npm run dev` 鍚庢鏌?`/tools` 妗岄潰绔€佸钩鏉跨鍜屾墜鏈虹甯冨眬銆?
- 宸叉鏌ョ數鑴戠 3 鏍忋€佸钩鏉跨 2 鏍忋€佹墜鏈虹 1 鏍忋€?
- 宸叉鏌ョЩ鍔ㄧ Hero 鏀逛负涓婁笅甯冨眬锛屾瑙堝崱寮卞寲涓虹畝娲佺粺璁″崱銆?
- 宸叉鏌ユ悳绱?`Markdown` 鍙瓫閫夊嚭 `Obsidian`銆?
- 宸叉鏌ュ垎绫荤瓫閫?`寮€婧愰」鐩甡 鍙瓫閫夊嚭 `Supabase` 鍜?`LocalSend`銆?
- 宸叉鏌ユ爣绛剧瓫閫?`PostgreSQL` 鍙瓫閫夊嚭 `Supabase`銆?
- 宸叉鏌モ€滄煡鐪嬭鎯呪€濆彲璺宠浆鍒?`/tools/raycast`銆?
- 鐢佃剳绔€佸钩鏉跨鍜屾墜鏈虹瑙嗗彛鍧囨湭鍙戠幇妯悜婧㈠嚭銆?

涓嬩竴姝ワ細

- 缁х画鏍规嵁鐪熷疄鍐呭鏁伴噺寰皟鍒嗙被缁熻銆佸崱鐗囨枃妗堥暱搴﹀拰绉诲姩绔灞忎俊鎭瘑搴︺€?

## 2026-05-31

浠诲姟锛氬ぇ骞呴噸鏋?`/tools` 椤甸潰 Hero 杩囨浮涓庣Щ鍔ㄧ姒傝灞曠ず銆?

鏀瑰姩鏂囦欢锛?

- `src/components/tools/tools-page.tsx`
- `src/components/tools/ToolsHero.tsx`
- `src/components/tools/ToolCard.tsx`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 淇濈暀鐜版湁鎼滅储銆佸垎绫荤瓫閫夈€佹爣绛剧瓫閫夊拰璺宠浆璇︽儏鍔熻兘銆?
- 涓嶈繛鎺ユ暟鎹簱銆?
- 涓嶄慨鏀硅矾鐢辩粨鏋勩€?
- 涓嶆柊澧炰緷璧栥€?
- Hero 搴曢儴澧炲姞闀挎煍鍜屾笎鍙樿繃娓″眰锛屽急鍖栨繁鑹插尯鍩熶笌娴呰壊鍐呭鍖虹‖鍒囥€?
- 绉诲姩绔殣钘忓畬鏁粹€滃凡鏁寸悊宸ュ叿鈥濇瑙堝崱锛屾敼涓洪珮搴﹁緝浣庣殑妯潯缁熻銆?
- 宸ュ叿鍗＄墖寮哄寲鐜荤拑鎬併€乭over 涓婃诞鍜岄潚钃濆井鍏夈€?
- 宸茶繍琛?`npm run lint`銆?
- 宸茶繍琛?`npm run build`銆?
- 宸插惎鍔?`npm run dev` 鍚庢鏌?`/tools` 妗岄潰绔€佸钩鏉跨鍜屾墜鏈虹甯冨眬銆?
- 宸叉鏌ユ闈㈢淇濈暀鍙充晶姒傝鍗★紝绉诲姩绔粎鏄剧ず鈥滃凡鏀跺綍 6 涓伐鍏?+ LIVE鈥濇í鏉°€?
- 宸叉鏌ョ數鑴戠 3 鏍忋€佸钩鏉跨 2 鏍忋€佹墜鏈虹 1 鏍忋€?
- 宸叉鏌ユ悳绱?`Markdown` 鍙瓫閫夊嚭 `Obsidian`銆?
- 宸叉鏌ュ垎绫荤瓫閫?`寮€婧愰」鐩甡 鍙瓫閫夊嚭 `Supabase` 鍜?`LocalSend`銆?
- 宸叉鏌モ€滄煡鐪嬭鎯呪€濆彲璺宠浆鍒?`/tools/raycast`銆?
- 鐢佃剳绔€佸钩鏉跨鍜屾墜鏈虹瑙嗗彛鍧囨湭鍙戠幇妯悜婧㈠嚭銆?

涓嬩竴姝ワ細

- 浣跨敤鐪熷疄绉诲姩璁惧灏哄缁х画纭棣栧睆楂樺害鍜岀瓫閫夐潰鏉块湶鍑烘瘮渚嬨€?

## 2026-05-31

浠诲姟锛氬垱寤虹粺涓€鐗堟潈澹版槑缁勪欢銆?

鏀瑰姩鏂囦欢锛?

- `src/components/common/CopyrightNotice.tsx`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 鏇存柊缁熶竴鐗堟潈澹版槑鏂囨銆?
- 缁勪欢鏀寔 `className` 鍙傛暟锛屾柟渚垮悗缁鐢ㄣ€?
- 宸ュ叿璇︽儏椤靛凡鍦ㄥ簳閮ㄨ皟鐢?`CopyrightNotice`銆?
- 褰撳墠椤圭洰鏈彂鐜?`/articles/[slug]` 鏂囩珷璇︽儏椤碉紝鍥犳鏈柊澧炴枃绔犺鎯呴〉寮曠敤銆?
- 宸茶繍琛?`npm run lint`銆?
- 宸茶繍琛?`npm run build`銆?

涓嬩竴姝ワ細

- 鍒涘缓鏂囩珷璇︽儏椤垫椂锛屽湪椤甸潰搴曢儴澶嶇敤 `CopyrightNotice`銆?

## 2026-05-31

浠诲姟锛氬垱寤哄箍鍛婂崰浣嶇粍浠跺苟鎺ュ叆宸ュ叿璇︽儏椤点€?

鏀瑰姩鏂囦欢锛?

- `src/components/common/AdPlaceholder.tsx`
- `src/components/tools/tool-detail-page.tsx`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 鏂板骞垮憡鍗犱綅缁勪欢锛屾敮鎸?`sidebar`銆乣banner`銆乣inline` 涓夌灏哄銆?
- 宸ュ叿璇︽儏椤靛彸渚ф爮鐢佃剳绔樉绀?`sidebar` 骞垮憡浣嶃€?
- 宸ュ叿璇︽儏椤垫鏂囦腑闂存樉绀?`inline` 骞垮憡浣嶃€?
- 宸ュ叿璇︽儏椤靛簳閮ㄦ樉绀?`banner` 骞垮憡浣嶃€?
- 浠呮樉绀衡€滃箍鍛婁綅鈥濓紝涓嶆帴鍏ョ湡瀹炲箍鍛婁唬鐮併€?
- 宸茶繍琛?`npm run lint`銆?
- 宸茶繍琛?`npm run build`銆?
- 宸查噸鍚?`npm run dev` 骞舵鏌?`/tools/raycast`銆?
- 妗岄潰绔彲瑙?3 涓箍鍛婁綅锛氬彸渚ф爮銆佹鏂囦腑闂淬€佸簳閮ㄦí骞呫€?
- 鎵嬫満绔彲瑙?2 涓箍鍛婁綅锛氭鏂囦腑闂淬€佸簳閮ㄦí骞咃紱鍙充晶鏍忓箍鍛婂凡闅愯棌銆?
- 璇︽儏椤垫湭鍙戠幇妯悜婊氬姩銆?

涓嬩竴姝ワ細

- 鍚庣画鎺ュ叆鐪熷疄骞垮憡鏃讹紝淇濇寔骞垮憡缁勪欢缁熶竴鏇挎崲锛屼笉鍦ㄩ〉闈㈠唴鍒嗘暎鍐欏箍鍛婁唬鐮併€?

## 2026-05-31

浠诲姟锛氬崌绾у叏绔欒瑙夎璁＄郴缁熸枃妗ｃ€?

鏀瑰姩鏂囦欢锛?

- `docs/DESIGN_SYSTEM.md`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 浠呮洿鏂拌璁℃枃妗ｏ紝涓嶄慨鏀归〉闈唬鐮併€?
- 宸插姞鍏ユ祬鑹查珮绾ч鏍笺€佺暀鐧姐€佹笎鍙樺垎鍖恒€佹恫鎬佺幓鐠冨崱鐗囥€佹寜閽€佸箍鍛婁綅鍜岀Щ鍔ㄧ瑙勮寖銆?
- 宸叉槑纭椤靛拰宸ュ叿椤电殑鍒嗗尯瑙勫垯銆?
- 宸蹭繚鐣欏搷搴斿紡銆佹帓鐗堝拰缁勪欢鍖栧熀纭€瑙勫垯銆?

涓嬩竴姝ワ細

- 鍚庣画鏀归€犻椤点€佸伐鍏烽〉鍜岃鎯呴〉瑙嗚鏃讹紝涓ユ牸鎸夋柊鐗?`DESIGN_SYSTEM.md` 鎵ц銆?

## 2026-05-31

浠诲姟锛氬崌绾у叏绔欏熀纭€瑙嗚鏍峰紡銆?

鏀瑰姩鏂囦欢锛?

- `src/app/globals.css`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 浠呬慨鏀瑰叏绔欏熀纭€ CSS锛屼笉鏀逛笟鍔￠€昏緫銆?
- 涓嶄慨鏀规暟鎹簱銆?
- 涓嶄慨鏀瑰悗鍙般€?
- 涓嶆柊澧炰緷璧栥€?
- 娣诲姞鍏ㄧ珯娴呰壊娓愬彉鑳屾櫙銆?
- 娣诲姞 `glass-card` 閫氱敤鐜荤拑鎷熸€佸崱鐗囩被銆?
- 娣诲姞 `section-gradient-blue`銆乣section-gradient-cyan`銆乣section-gradient-violet` 閫氱敤鍒嗗尯娓愬彉绫汇€?
- 娣诲姞 `soft-shadow` 閫氱敤鏌斿拰闃村奖绫汇€?
- 娣诲姞 `soft-card-hover` 閫氱敤 hover 涓婃诞鏁堟灉銆?
- 娣诲姞 `page-shell` 椤甸潰鏈€澶у搴﹀鍣ㄧ被銆?
- 娣诲姞 `section-block` 缁熶竴鍒嗗尯闂磋窛绫汇€?
- 宸茶繍琛?`npm run lint`銆?
- 宸茶繍琛?`npm run build`銆?
- 宸查噸鍚?`npm run dev` 骞舵鏌?`/tools/raycast` 姝ｅ父鎵撳紑銆?
- 宸茬‘璁ゅ叏绔欐祬鑹叉笎鍙樿儗鏅敓鏁堛€?
- 宸茬‘璁よ鎯呴〉鏈彂鐜版í鍚戞粴鍔ㄣ€?

涓嬩竴姝ワ細

- 鍚庣画鍗囩骇棣栭〉鍜岃鎯呴〉瑙嗚鏃讹紝浼樺厛澶嶇敤杩欎簺鍏ㄧ珯鍩虹 class锛岄伩鍏嶉〉闈㈠唴閲嶅鍐欐牱寮忋€?

## 2026-05-31

浠诲姟锛氶噸鍋氶椤佃瑙夎璁°€?

鏀瑰姩鏂囦欢锛?

- `src/components/home-page.tsx`
- `src/components/hero-section.tsx`
- `src/components/search-panel.tsx`
- `src/components/category-grid.tsx`
- `src/components/featured-tools.tsx`
- `src/components/tool-card.tsx`
- `src/components/latest-articles.tsx`
- `src/components/article-card.tsx`
- `src/components/common/AdPlaceholder.tsx`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 涓嶈繛鎺ユ暟鎹簱銆?
- 涓嶄慨鏀瑰悗鍙般€?
- 涓嶆柊澧炰緷璧栥€?
- 涓嶆敼鍙樺凡鏈夎矾鐢便€?
- 棣栭〉 Hero 浣跨敤 `section-gradient-blue`锛屽苟鍔犲叆鐜荤拑鎬佹暟鎹湅鏉裤€?
- 鎼滅储鍖轰娇鐢ㄧ嫭绔?`glass-card`锛屾悳绱㈡鍜屾寜閽昂瀵稿姞寮恒€?
- 鍒嗙被鍖轰娇鐢?`section-gradient-cyan`锛屽垎绫诲崱鐗囦娇鐢?`glass-card` 鍜?hover 涓婃诞銆?
- 鎺ㄨ崘宸ュ叿鍖轰娇鐢ㄦ祬鑹叉笎鍙樿儗鏅紝宸ュ叿鍗＄墖浣跨敤 `glass-card`锛屾寜閽枃妗堜繚鎸佲€滄煡鐪嬭鎯呪€濄€?
- 鏈€鏂版枃绔犲尯浣跨敤 `section-gradient-violet`锛屾枃绔犲崱鐗囨敼涓虹幓鐠冨崱鐗囥€?
- 鎺ㄨ崘宸ュ叿鍖哄拰鏈€鏂版枃绔犲尯涔嬮棿宸叉彃鍏?`AdPlaceholder` 骞垮憡浣嶃€?
- 骞垮憡浣嶆枃妗堜负鈥滃悎浣滄帹骞库€濆拰鈥滄澶勫彲灞曠ず璧炲姪宸ュ叿銆佺簿閫夋湇鍔℃垨骞垮憡鍐呭鈥濄€?
- 宸茶繍琛?`npm run lint`銆?
- 宸茶繍琛?`npm run build`銆?
- 宸查噸鍚?`npm run dev` 骞舵鏌ラ椤?`/`銆?
- 宸叉鏌ユ闈㈢棣栭〉 Hero 鏍囬銆佸箍鍛婁綅鍜屸€滄煡鐪嬭鎯呪€濇寜閽甯告樉绀恒€?
- 宸叉鏌ラ椤垫病鏈夊嚭鐜扳€滄煡鐪嬪畼缃戔€濄€?
- 宸叉鏌ユ墜鏈虹 Hero 鏍囬涓?`36px`锛屾湭瓒呰繃绉诲姩绔檺鍒躲€?
- 宸叉鏌ユ闈㈢鍜屾墜鏈虹鍧囨湭鍙戠幇妯悜婊氬姩銆?

涓嬩竴姝ワ細

- 缁х画鎸夋柊鐗堣璁＄郴缁熼€愭浼樺寲宸ュ叿璇︽儏椤靛拰鏂囩珷璇︽儏椤佃瑙夈€?

## 2026-06-01

浠诲姟锛氶噸鍋?`/tools` 宸ュ叿搴撻〉闈㈣瑙夎璁°€?

鏀瑰姩鏂囦欢锛?

- `src/components/tools/tools-page.tsx`
- `src/components/tools/ToolsHero.tsx`
- `src/components/tools/ToolsFilterPanel.tsx`
- `src/components/tools/ToolsGridHeader.tsx`
- `src/components/tools/tools-grid.tsx`
- `src/components/tools/ToolCard.tsx`
- `src/components/tools/tools-no-results.tsx`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 涓嶈繛鎺ユ暟鎹簱銆?
- 涓嶄慨鏀瑰悗鍙般€?
- 涓嶆柊澧炰緷璧栥€?
- 涓嶆敼鍙?mock 鏁版嵁缁撴瀯銆?
- 淇濈暀鍘熸湁鎼滅储銆佸垎绫荤瓫閫夈€佹爣绛剧瓫閫夈€佹竻绌虹瓫閫夊拰璇︽儏璺宠浆閫昏緫銆?
- 宸ュ叿搴?Hero 鏀逛负 `section-gradient-blue` 娴呰壊娓愬彉鍒嗗尯銆?
- Hero 鏍囬鏇存柊涓衡€滃彂鐜板疄鐢ㄣ€佸彲闈犮€佹潵婧愭竻鏅扮殑鏁板瓧宸ュ叿鈥濄€?
- Hero 鍙充晶鏂板 `glass-card` 鏁版嵁鍗★紝灞曠ず褰撳墠鏀跺綍鏁伴噺銆佸垎绫绘暟閲忓拰鎸佺画鏇存柊鐘舵€併€?
- 鎼滅储涓庣瓫閫夊尯鏀逛负 `glass-card`锛屾悳绱㈡鏀惧ぇ锛岀瓫閫夎兌鍥婇€変腑鎬佷娇鐢ㄩ潚钃濇笎鍙樸€?
- 缁撴灉缁熻鍖烘敼涓虹嫭绔嬬幓鐠冨崱鐗囥€?
- 宸ュ叿鍗＄墖浣跨敤 `glass-card` 鍜?`soft-card-hover`锛屼繚鐣欌€滄煡鐪嬭鎯呪€濓紝涓嶆樉绀衡€滄煡鐪嬪畼缃戔€濄€?
- 宸ュ叿鍒楄〃绗?6 涓伐鍏峰悗鎻掑叆妯悜 `AdPlaceholder` 骞垮憡浣嶏紱灏戜簬 6 涓椂鏀惧湪鍒楄〃涓嬫柟銆?
- 绌虹姸鎬佹敼涓?`glass-card`锛屾枃妗堟洿鏂颁负鈥滄病鏈夋壘鍒板尮閰嶇殑宸ュ叿鈥濆拰鈥滃彲浠ュ皾璇曞噺灏戠瓫閫夋潯浠舵垨鎹竴涓叧閿瘝銆傗€濄€?
- 宸茶繍琛?`npm run lint`銆?
- 宸茶繍琛?`npm run build`銆?
- 宸查噸鍚?`npm run dev` 骞舵鏌?`/tools`銆?
- 宸叉鏌ユ闈㈢ Hero 鏍囬銆佸壇鏍囬銆佸箍鍛婁綅鍜?6 涓€滄煡鐪嬭鎯呪€濇寜閽甯告樉绀恒€?
- 宸叉鏌?`/tools` 娌℃湁鍑虹幇鈥滄煡鐪嬪畼缃戔€濄€?
- 宸叉鏌ュ箍鍛婁綅浣嶄簬绗?6 涓伐鍏蜂箣鍚庛€?
- 宸叉鏌ユ悳绱?`Markdown` 鍙瓫閫夊嚭 `Obsidian`锛屼笖涓嶆樉绀?`Raycast`銆?
- 宸叉鏌ユ棤缁撴灉鐘舵€佹樉绀烘寚瀹氭枃妗堛€?
- 宸叉鏌ユ墜鏈虹 Hero 鏍囬涓?`36px`锛屽崱鐗囦负鍗曞垪甯冨眬銆?
- 宸叉鏌ユ闈㈢鍜屾墜鏈虹鍧囨湭鍙戠幇妯悜婊氬姩銆?

涓嬩竴姝ワ細

- 缁х画鎸夋柊鐗堣璁＄郴缁熼€愭浼樺寲宸ュ叿璇︽儏椤佃瑙夈€?

## 2026-06-01

浠诲姟锛氬弬鑰冪綉缁滆瑙夎祫鏂欏悗鍐嶆閲嶆敼 `/tools` 宸ュ叿搴撹瑙夋晥鏋溿€?

鏀瑰姩鏂囦欢锛?

- `src/app/globals.css`
- `src/components/tools/tools-page.tsx`
- `src/components/tools/ToolsHero.tsx`
- `src/components/tools/ToolsFilterPanel.tsx`
- `src/components/tools/ToolsGridHeader.tsx`
- `src/components/tools/ToolCard.tsx`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 浣跨敤 Chrome 鎻掍欢灏濊瘯鏌ョ湅 Liquid Glass / Glassmorphism 鐩稿叧瑙嗚鍙傝€冦€?
- 鍙傝€冩柟鍚戯細鍗婇€忔槑鏉愭枡銆佽儗鏅眰娆°€佺粏杈规銆佹煍鍜岄槾褰便€佺幓鐠冮珮鍏夈€佸唴瀹瑰彲璇绘€с€?
- 涓嶈繛鎺ユ暟鎹簱銆?
- 涓嶄慨鏀瑰悗鍙般€?
- 涓嶆柊澧炰緷璧栥€?
- 涓嶆敼鍙?`/tools` 涓氬姟閫昏緫銆佺瓫閫夐€昏緫鍜岃矾鐢辩粨鏋勩€?
- 鍗囩骇 `glass-card` 鍏ㄧ珯鐜荤拑璐ㄦ劅锛屽鍔犻ケ鍜屾ā绯娿€佸唴楂樺厜鍜屾洿鏌斿拰鐨勬恫鎬侀槾褰便€?
- 鏂板 `liquid-grid` 鍜?`liquid-panel` 閫氱敤瑙嗚绫汇€?
- `/tools` Hero 澧炲姞娑叉€佺幓鐠冧俊鎭潡鍜屾洿寮鸿儗鏅眰娆°€?
- `/tools` 鎼滅储绛涢€夊尯鏀逛负娴姩鎺у埗鍙拌瑙夈€?
- `/tools` 宸ュ叿鍗＄墖澧炲姞鐜荤拑鎶樺皠鎰熴€佸唴灞備俊鎭潡鍜屾洿鏄庣‘鐨勮鎯呮寜閽€?
- 宸茶繍琛?`npm run lint`銆?
- 宸茶繍琛?`npm run build`銆?
- 宸查噸鍚?`npm run dev` 骞舵鏌?`/tools`銆?
- 宸叉鏌ユ闈㈢鏈?10 涓?`glass-card` 鍜?5 涓?`liquid-panel`锛屾恫鎬佺幓鐠冩牱寮忓凡鐢熸晥銆?
- 宸叉鏌ユ悳绱?`Markdown` 鍙瓫閫夊嚭 `Obsidian`锛屼笖涓嶆樉绀?`Raycast`銆?
- 宸叉鏌ラ〉闈㈡湭鍑虹幇鈥滄煡鐪嬪畼缃戔€濓紝浠嶄繚鐣?6 涓€滄煡鐪嬭鎯呪€濇寜閽€?
- 宸叉鏌ュ箍鍛婁綅姝ｅ父鏄剧ず鈥滃悎浣滄帹骞库€濆拰鈥滆繖閲屽彲浠ュ睍绀鸿禐鍔╁伐鍏锋垨绮鹃€夋湇鍔♀€濄€?
- 宸叉鏌ユ墜鏈虹鏍囬涓?`36px`锛屽崱鐗囦负鍗曞垪甯冨眬銆?
- 宸叉鏌ユ闈㈢鍜屾墜鏈虹鍧囨湭鍙戠幇妯悜婊氬姩銆?
- 宸蹭繚瀛樻鏌ユ埅鍥撅細`.next-dev-logs/tools-liquid-desktop.png`銆乣.next-dev-logs/tools-liquid-mobile.png`銆?

涓嬩竴姝ワ細

- 缁х画鎸夋柊鐗堣瑙夎瑷€浼樺寲宸ュ叿璇︽儏椤点€?

## 2026-06-01

浠诲姟锛氭鏌ュ苟淇骞垮憡鍗犱綅缁勪欢 `AdPlaceholder`銆?

鏀瑰姩鏂囦欢锛?

- `src/components/common/AdPlaceholder.tsx`
- `src/components/home-page.tsx`
- `src/components/tools/tools-grid.tsx`
- `src/components/tools/tool-detail-page.tsx`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 纭 `src/components/common/AdPlaceholder.tsx` 宸插瓨鍦ㄣ€?
- 灏嗙粍浠?props 缁熶竴涓?`variant: "sidebar" | "banner" | "inline"`銆乣title?`銆乣description?`銆乣className?`銆?
- 榛樿鏂囨鏇存柊涓?`title: 鍚堜綔鎺ㄥ箍`銆?
- 榛樿璇存槑鏇存柊涓?`description: 姝ゅ鍙睍绀鸿禐鍔╁伐鍏枫€佺簿閫夋湇鍔℃垨骞垮憡鍐呭`銆?
- 淇濈暀 `glass-card`銆佽櫄绾胯竟妗嗐€佷綆璋冨箍鍛婃牱寮忓拰鎵嬫満绔嚜閫傚簲銆?
- 棣栭〉鎺ㄨ崘宸ュ叿鍖哄拰鏈€鏂版枃绔犲尯涔嬮棿缁х画浣跨敤 `variant="banner"`銆?
- `/tools` 宸ュ叿鍒楄〃绗?6 涓伐鍏峰悗缁х画浣跨敤 `variant="banner"`銆?
- `/tools/[slug]` 璇︽儏椤垫鏂囦腑闂翠娇鐢?`variant="inline"`锛屽簳閮ㄤ娇鐢?`variant="banner"`锛屽彸渚ф爮浣跨敤 `variant="sidebar"`銆?
- 涓嶆帴鍏ョ湡瀹炲箍鍛婁唬鐮併€?
- 涓嶄慨鏀规暟鎹簱銆?
- 涓嶄慨鏀瑰悗鍙般€?
- 宸茶繍琛?`npm run lint`銆?
- 宸茶繍琛?`npm run build`銆?
- 宸查噸鍚?`npm run dev` 骞舵鏌ラ椤?`/`銆佸伐鍏峰簱 `/tools`銆佸伐鍏疯鎯呴〉 `/tools/raycast`銆?
- 棣栭〉鎺ㄨ崘宸ュ叿鍖哄拰鏈€鏂版枃绔犲尯涔嬮棿鍙 1 涓?banner 骞垮憡浣嶃€?
- `/tools` 宸ュ叿鍒楄〃鍙 1 涓?banner 骞垮憡浣嶃€?
- `/tools/raycast` 妗岄潰绔彲瑙?3 涓箍鍛婁綅锛歩nline銆乥anner銆乻idebar銆?
- `/tools/raycast` 鎵嬫満绔彲瑙?2 涓箍鍛婁綅锛歩nline銆乥anner锛泂idebar 宸查殣钘忋€?
- 宸茬‘璁ら粯璁ゆ枃妗堚€滃悎浣滄帹骞库€濆拰鈥滄澶勫彲灞曠ず璧炲姪宸ュ叿銆佺簿閫夋湇鍔℃垨骞垮憡鍐呭鈥濇甯告樉绀恒€?
- 宸茬‘璁ら椤点€佸伐鍏峰簱椤靛拰璇︽儏椤靛潎鏈彂鐜版í鍚戞粴鍔ㄣ€?

涓嬩竴姝ワ細

- 鍚庣画鎺ュ叆鐪熷疄骞垮憡鏃讹紝鍙浛鎹?`AdPlaceholder` 鍐呴儴瀹炵幇锛屼笉鍦ㄩ〉闈腑鍒嗘暎鍐欏箍鍛婁唬鐮併€?

## 2026-06-01

浠诲姟锛氫紭鍖?`/tools/[slug]` 宸ュ叿璇︽儏椤佃瑙夊拰骞垮憡浣嶇粨鏋勩€?

鏀瑰姩鏂囦欢锛?

- `src/components/tools/tool-detail-page.tsx`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 涓嶈繛鎺ユ暟鎹簱銆?
- 涓嶄慨鏀瑰悗鍙般€?
- 涓嶆柊澧炰緷璧栥€?
- 涓嶇牬鍧忓凡鏈夎矾鐢便€?
- `CopyrightNotice` 缁勪欢宸插瓨鍦紝璇︽儏椤靛簳閮ㄧ户缁皟鐢ㄣ€?
- 璇︽儏椤?Hero 浣跨敤 `section-gradient-blue` 鍜?`glass-card`銆?
- Hero 宸叉樉绀哄伐鍏峰悕绉般€佷竴鍙ヨ瘽浠嬬粛銆佸垎绫汇€佹爣绛俱€佹槸鍚﹀厤璐广€佹槸鍚﹀紑婧愬拰鈥滆闂畼鏂圭綉绔欌€濇寜閽€?
- 姝ｆ枃涓诲唴瀹瑰尯鏀惧湪宸︿晶涓绘爮锛屽苟浣跨敤 `glass-card` 鍖呰９銆?
- 姝ｆ枃鍒嗗潡鏄剧ず璇︾粏浠嬬粛銆佷富瑕佸姛鑳姐€侀€傚悎浜虹兢銆佷娇鐢ㄥ満鏅€佷紭鐐广€佺己鐐瑰拰椋庨櫓鎻愮ず銆?
- 姝ｆ枃涓棿鎻掑叆 `variant="inline"` 骞垮憡浣嶃€?
- 椤甸潰搴曢儴鎻掑叆 `variant="banner"` 骞垮憡浣嶃€?
- 鐢佃剳绔彸渚ф彃鍏?`variant="sidebar"` 骞垮憡浣嶃€?
- 鐩稿叧鎺ㄨ崘鏀惧湪鍙充晶鏍忥紝鎵嬫満绔嚜鐒舵帓鍒版鏂囦笅鏂广€?
- 瀹樼綉鎸夐挳浣跨敤 `target="_blank"` 鍜?`rel="nofollow noopener noreferrer"`銆?
- 宸茬‘璁ゅ垪琛ㄩ〉鐩稿叧缁勪欢鏈嚭鐜扳€滄煡鐪嬪畼缃戔€濄€?
- 宸茶繍琛?`npm run lint`銆?
- 宸茶繍琛?`npm run build`銆?
- 宸查噸鍚?`npm run dev` 骞舵鏌?`/tools/raycast`銆?
- 妗岄潰绔彲瑙?3 涓箍鍛婁綅锛氭鏂?inline銆佸簳閮?banner銆佸彸渚?sidebar銆?
- 鎵嬫満绔彲瑙?2 涓箍鍛婁綅锛氭鏂?inline銆佸簳閮?banner锛涘彸渚?sidebar 宸查殣钘忋€?
- 宸叉鏌ヨ鎯呴〉鏈?2 涓€滆闂畼鏂圭綉绔欌€濇寜閽€?
- 宸叉鏌ュ畼缃戞寜閽潎浣跨敤 `target="_blank"` 鍜?`rel="nofollow noopener noreferrer"`銆?
- 宸叉鏌ヨ缁嗕粙缁嶃€佷富瑕佸姛鑳姐€侀€傚悎浜虹兢銆佷娇鐢ㄥ満鏅€佷紭鐐广€佺己鐐广€侀闄╂彁绀恒€佺浉鍏虫帹鑽愬拰鐗堟潈澹版槑鍧囨甯告樉绀恒€?
- 宸叉鏌ヨ鎯呴〉鏈嚭鐜扳€滄煡鐪嬪畼缃戔€濄€?
- 宸叉鏌ユ闈㈢鍜屾墜鏈虹鍧囨湭鍙戠幇妯悜婊氬姩銆?

涓嬩竴姝ワ細

- 缁х画鎸夋柊鐗堣瑙夎瑷€浼樺寲鏂囩珷璇︽儏椤垫垨鍚庣画鍚庡彴鍐呭绠＄悊銆?

## 2026-06-01

浠诲姟锛氭洿鏂扮粺涓€鐗堟潈澹版槑缁勪欢銆?

鏀瑰姩鏂囦欢锛?

- `src/components/common/CopyrightNotice.tsx`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 鏇存柊鐗堟潈澹版槑缁勪欢鏂囨銆?
- 浣跨敤 `glass-card` 鏍峰紡銆?
- 瀛楀彿鍋忓皬锛岄鑹蹭綆璋冿紝杈规鏌斿拰銆?
- 淇濈暀 `className` 鍙傛暟锛屾柟渚垮悗缁鐢ㄣ€?
- 宸ュ叿璇︽儏椤靛凡鍦ㄥ簳閮ㄥ紩鐢?`CopyrightNotice`銆?
- 褰撳墠椤圭洰鏈彂鐜?`/articles/[slug]` 鏂囩珷璇︽儏椤碉紝鍥犳鏈鏃犳硶娣诲姞鏂囩珷璇︽儏椤靛紩鐢ㄣ€?
- 鍚庣画鍒涘缓鏂囩珷璇︽儏椤垫椂锛屽繀椤诲湪搴曢儴寮曠敤 `CopyrightNotice`銆?
- 宸茶繍琛?`npm run lint`銆?
- 宸茶繍琛?`npm run build`銆?
- 宸查噸鍚?`npm run dev` 骞舵鏌?`/tools/raycast`銆?
- 宸茬‘璁ゆ柊鐗堟潈澹版槑鏂囨姝ｅ父鏄剧ず銆?
- 宸茬‘璁ょ増鏉冨０鏄庣粍浠朵娇鐢?`glass-card`銆?
- 宸茬‘璁よ鎯呴〉鏈彂鐜版í鍚戞粴鍔ㄣ€?

涓嬩竴姝ワ細

- 鍒涘缓鏂囩珷璇︽儏椤垫椂锛屽湪搴曢儴澶嶇敤 `CopyrightNotice`銆?

## 2026-06-01

浠诲姟锛氬崌绾у叏绔欏熀纭€瑙嗚鏍峰紡銆?

鏀瑰姩鏂囦欢锛?

- `src/app/globals.css`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 鍙慨鏀?`src/app/globals.css`锛屾湭淇敼棣栭〉銆佸伐鍏峰簱椤点€佸伐鍏疯鎯呴〉銆乵ock 鏁版嵁銆佹暟鎹簱銆佸悗鍙板拰璺敱缁撴瀯銆?
- 宸叉鏌?`src/app/layout.tsx`锛屾棤闇€淇敼銆?
- 宸茬‘璁?body 鑳屾櫙涓烘祬鑹叉笎鍙樸€?
- 宸茬‘璁?body 鏂囧瓧棰滆壊浣跨敤 `#0f172a`銆?
- 宸插湪 `html` 鍜?`body` 涓婅缃?`overflow-x: hidden`锛屽苟鏂板 `no-horizontal-scroll` 宸ュ叿绫汇€?
- 宸茶鑼?`page-shell`銆乣section-block`銆乣glass-card`銆乣soft-card-hover`銆?
- 宸叉柊澧?`glass-card-strong`銆乣section-gradient-soft`銆乣liquid-border`銆乣ad-glass`銆?
- 宸蹭繚鐣欑幇鏈?`section-gradient-blue`銆乣section-gradient-cyan`銆乣section-gradient-violet`銆?
- 宸茶繍琛?`npm run lint`銆?
- 宸茶繍琛?`npm run build`銆?
- 宸查噸鍚?`npm run dev` 骞舵鏌ラ椤?`/`銆佸伐鍏峰簱 `/tools`銆佸伐鍏疯鎯呴〉 `/tools/raycast`銆?
- 宸茬‘璁ゆ闈㈢鍜屾墜鏈虹 body 鑳屾櫙鍧囦负娴呰壊娓愬彉銆?
- 宸茬‘璁ゆ闈㈢鍜屾墜鏈虹 body 鏂囧瓧棰滆壊鍧囦负 `rgb(15, 23, 42)`銆?
- 宸茬‘璁ゆ闈㈢鍜屾墜鏈虹 `html`銆乣body` 鐨?`overflow-x` 鍧囦负 `hidden`銆?
- 宸茬‘璁ら椤点€佸伐鍏峰簱椤靛拰宸ュ叿璇︽儏椤靛湪妗岄潰绔拰鎵嬫満绔潎鏈彂鐜版í鍚戞粴鍔ㄣ€?

涓嬩竴姝ワ細

- 鍚庣画椤甸潰瑙嗚鍗囩骇浼樺厛澶嶇敤杩欎簺鍏ㄧ珯鍩虹鏍峰紡锛岄伩鍏嶉噸澶嶅啓灞€閮?CSS銆?

## 2026-06-01

浠诲姟锛氶噸鍋氶椤佃瑙夎璁°€?

鏀瑰姩鏂囦欢锛?

- `src/app/page.tsx`
- `src/components/home/home-page.tsx`
- `src/components/home/home-hero.tsx`
- `src/components/home/home-search-section.tsx`
- `src/components/home/home-category-section.tsx`
- `src/components/home/home-featured-tools.tsx`
- `src/components/home/home-tool-card.tsx`
- `src/components/home/home-latest-articles.tsx`
- `src/components/home/home-article-card.tsx`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 涓嶈繛鎺ユ暟鎹簱銆?
- 涓嶄慨鏀?`/tools` 椤甸潰銆?
- 涓嶄慨鏀?`/tools/[slug]` 椤甸潰銆?
- 涓嶄慨鏀瑰悗鍙般€丼upabase 鐩稿叧浠ｇ爜鍜?mock 鏁版嵁缁撴瀯銆?
- 棣栭〉鍏ュ彛鏀逛负浣跨敤 `src/components/home/` 涓嬬殑鏂伴椤电粍浠躲€?
- Hero 浣跨敤 `section-gradient-blue`銆乣page-shell` 鍜?`glass-card-strong` 鏁版嵁鐪嬫澘銆?
- Hero 鏂囨鏇存柊涓衡€滃彂鐜板€煎緱淇′换鐨勬暟瀛楀伐鍏封€濆拰鎸囧畾鍓爣棰樸€?
- Hero 鏍囩鏇存柊涓衡€滄潵婧愭竻鏅扳€濃€滀汉宸ユ暣鐞嗏€濃€滄寔缁洿鏂扳€濃€滈檷浣庤瘯閿欌€濄€?
- 鎼滅储鍖轰娇鐢?`glass-card-strong`锛屾悳绱㈡鍗犱綅鏂囨鏇存柊涓烘寚瀹氭枃妗堛€?
- 鍒嗙被鍖轰娇鐢?`section-gradient-cyan`锛屽垎绫诲崱鐗囦娇鐢?`glass-card` 鍜?`soft-card-hover`銆?
- 鎺ㄨ崘宸ュ叿鍖轰娇鐢?`section-gradient-soft`锛屽伐鍏峰崱鐗囦娇鐢?`glass-card`锛屾寜閽枃妗堜负鈥滄煡鐪嬭鎯呪€濄€?
- 鎺ㄨ崘宸ュ叿鍖哄拰鏈€鏂版枃绔犲尯涔嬮棿鎻掑叆 `AdPlaceholder` banner 骞垮憡浣嶃€?
- 鏈€鏂版枃绔犲尯浣跨敤 `section-gradient-violet`锛屾枃绔犲崱鐗囦娇鐢?`glass-card`銆?
- 宸茶繍琛?`npm run lint`銆?
- 宸茶繍琛?`npm run build`銆?
- 宸查噸鍚?`npm run dev` 骞舵鏌ラ椤?`/`銆?
- 宸叉鏌ユ闈㈢棣栭〉鏍囬銆佸壇鏍囬銆佹悳绱㈠崰浣嶆枃妗堛€佸箍鍛婁綅鍜?6 涓€滄煡鐪嬭鎯呪€濇寜閽甯告樉绀恒€?
- 宸叉鏌ラ椤垫病鏈夊嚭鐜扳€滄煡鐪嬪畼缃戔€濄€?
- 宸叉鏌ユ闈㈢鍒嗙被鍖轰负 4 鏍忥紝鎺ㄨ崘宸ュ叿鍖哄拰鏈€鏂版枃绔犲尯涓?3 鏍忋€?
- 宸叉鏌ユ墜鏈虹 Hero 鏍囬涓?`36px`锛孒ero 鏀逛负涓婁笅甯冨眬锛屽垎绫汇€佸伐鍏峰拰鏂囩珷鍗＄墖鍧囦负鍗曞垪銆?
- 宸叉鏌ユ闈㈢鍜屾墜鏈虹鍧囨湭鍙戠幇妯悜婊氬姩銆?

涓嬩竴姝ワ細

- 缁х画瀹屽杽鏂囩珷璇︽儏椤垫垨鍚庡彴鍐呭绠＄悊鍓嶏紝鍏堜繚鎸侀椤靛拰宸ュ叿椤佃瑙夎瑷€涓€鑷淬€?

## 2026-06-01

浠诲姟锛氶噸鍋?`/tools` 宸ュ叿搴撻〉闈㈣瑙夎璁°€?

鏀瑰姩鏂囦欢锛?

- `src/components/tools/tools-page.tsx`
- `src/components/tools/ToolsHero.tsx`
- `src/components/tools/ToolsFilterPanel.tsx`
- `src/components/tools/ToolsGridHeader.tsx`
- `src/components/tools/tools-grid.tsx`
- `src/components/tools/ToolCard.tsx`
- `src/components/tools/tools-no-results.tsx`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 涓嶈繛鎺ユ暟鎹簱銆?
- 涓嶄慨鏀归椤点€?
- 涓嶄慨鏀?`/tools/[slug]` 璇︽儏椤点€?
- 涓嶄慨鏀瑰悗鍙般€丼upabase 鐩稿叧浠ｇ爜銆佽矾鐢辩粨鏋勫拰 mock 鏁版嵁缁撴瀯銆?
- 淇濈暀鍘熸湁鎼滅储銆佸垎绫荤瓫閫夈€佹爣绛剧瓫閫夈€佹竻绌虹瓫閫夊拰璇︽儏璺宠浆閫昏緫銆?
- 宸ュ叿搴?Hero 浣跨敤 `section-gradient-blue` 鍜?`page-shell`锛屽彸渚т娇鐢?`glass-card-strong` 鏁版嵁鍗°€?
- Hero 鏂囨鏇存柊涓衡€滃彂鐜板疄鐢ㄣ€佸彲闈犮€佹潵婧愭竻鏅扮殑鏁板瓧宸ュ叿鈥濆拰鎸囧畾鍓爣棰樸€?
- Hero 鏍囩鏇存柊涓衡€淎I 宸ュ叿鈥濃€滃湪绾垮伐鍏封€濃€滃紑婧愰」鐩€濃€滄晥鐜囪蒋浠垛€濃€滀汉宸ユ暣鐞嗏€濄€?
- 鎼滅储涓庣瓫閫夊尯浣跨敤 `glass-card-strong`锛屾悳绱㈠崰浣嶆枃妗堟洿鏂颁负鈥滄悳绱㈠伐鍏锋爣棰樸€佺畝浠嬨€佸垎绫绘垨鏍囩鈥濄€?
- 鍒嗙被鍜屾爣绛剧瓫閫夌户缁娇鐢ㄥ渾瑙掕兌鍥婃寜閽紝閫変腑鐘舵€佷娇鐢ㄩ潚钃濇笎鍙樸€?
- 缁撴灉缁熻鍖烘敼涓鸿交閲忔爣棰?+ 鐜荤拑缁熻鏍囩銆?
- 宸ュ叿鍗＄墖浣跨敤 `glass-card` 鍜?`soft-card-hover`锛岄《閮ㄥ睍绀哄垎绫讳笌鍏嶈垂鐘舵€侊紝搴曢儴淇濈暀鈥滄煡鐪嬭鎯呪€濇寜閽€?
- 宸ュ叿鍒楄〃绗?6 涓伐鍏峰悗鎻掑叆 `AdPlaceholder` banner 骞垮憡浣嶃€?
- 骞垮憡浣嶆枃妗堟洿鏂颁负鈥滃悎浣滄帹骞库€濆拰鈥滆繖閲屽彲浠ュ睍绀鸿禐鍔╁伐鍏枫€佺簿閫夋湇鍔℃垨骞垮憡鍐呭鈥濄€?
- 绌虹姸鎬佷娇鐢?`glass-card`锛屾樉绀烘寚瀹氭棤缁撴灉鏂囨鍜屸€滄竻绌虹瓫閫夆€濇寜閽€?
- 宸茶繍琛?`npm run lint`銆?
- 宸茶繍琛?`npm run build`銆?
- 宸查噸鍚?`npm run dev` 骞舵鏌?`/tools`銆?
- 宸叉鏌?CSS 姝ｅ父鍔犺浇锛屾闈㈢宸ュ叿鍗＄墖涓?3 鏍忋€?
- 宸叉鏌ュ垎绫荤瓫閫?`寮€婧愰」鐩甡 鍙瓫閫夊嚭 `Supabase` 鍜?`LocalSend`锛屼笖涓嶆樉绀?`Raycast`銆?
- 宸叉鏌ュ垎绫诲拰鏍囩缁勫悎鏃犵粨鏋滄椂鏄剧ず鎸囧畾绌虹姸鎬佹枃妗堛€?
- 宸叉鏌ラ〉闈㈡湭鍑虹幇鈥滄煡鐪嬪畼缃戔€濓紝鏈?6 涓€滄煡鐪嬭鎯呪€濆叆鍙ｏ紝绀轰緥閾炬帴涓?`/tools/raycast`銆?
- 宸叉鏌ュ箍鍛婁綅姝ｅ父鏄剧ず鎸囧畾鏂囨銆?
- 宸叉鏌ユ墜鏈虹 Hero 涓轰笂涓嬪竷灞€锛屾爣棰樹负 `36px`锛屽伐鍏峰崱鐗囦负鍗曞垪銆?
- 宸叉鏌ユ闈㈢鍜屾墜鏈虹鍧囨湭鍙戠幇妯悜婊氬姩銆?

涓嬩竴姝ワ細

- 鍚庣画鍙户缁垱寤烘枃绔犲垪琛ㄩ〉鎴栨枃绔犺鎯呴〉锛屼繚鎸佷笌棣栭〉鍜屽伐鍏峰簱涓€鑷寸殑瑙嗚璇█銆?

## 2026-06-01

浠诲姟锛氭鏌ュ苟淇骞垮憡鍗犱綅缁勪欢 `AdPlaceholder`銆?

鏀瑰姩鏂囦欢锛?

- `src/components/common/AdPlaceholder.tsx`
- `src/components/home/home-page.tsx`
- `src/components/tools/tools-grid.tsx`
- `src/components/tools/tool-detail-page.tsx`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 纭 `src/components/common/AdPlaceholder.tsx` 宸插瓨鍦ㄣ€?
- 淇濈暀缁勪欢 props锛歚variant: "sidebar" | "banner" | "inline"`銆乣title?`銆乣description?`銆乣className?`銆?
- 淇濈暀榛樿鏂囨锛歚title: 鍚堜綔鎺ㄥ箍`銆乣description: 姝ゅ鍙睍绀鸿禐鍔╁伐鍏枫€佺簿閫夋湇鍔℃垨骞垮憡鍐呭`銆?
- 骞垮憡缁勪欢缁熶竴浣跨敤 `ad-glass`銆佽櫄绾胯竟妗嗐€佷綆璋冩枃瀛楋紝骞跺鍔犳槑纭殑鈥滃箍鍛婁綅鈥濇爣璇嗐€?
- `banner` 鐢ㄤ簬妯悜骞垮憡浣嶏紝閫傚悎棣栭〉鍒嗗尯涔嬮棿銆佸伐鍏峰垪琛ㄤ腑闂村拰璇︽儏椤靛簳閮ㄣ€?
- `sidebar` 鐢ㄤ簬璇︽儏椤靛彸渚у箍鍛婃爮锛屾墜鏈虹鑷劧鍙樻垚鏅€氭í鍚戝崱鐗囧苟鎺掑埌姝ｆ枃涓嬫柟銆?
- `inline` 鐢ㄤ簬璇︽儏椤垫鏂囦腑闂达紝淇濇寔杈冧綆楂樺害锛屼笉骞叉壈闃呰銆?
- 棣栭〉鎺ㄨ崘宸ュ叿鍖哄拰鏈€鏂版枃绔犲尯涔嬮棿缁х画鎻掑叆 `variant="banner"` 骞垮憡浣嶃€?
- `/tools` 宸ュ叿鍒楄〃绗?6 涓伐鍏峰悗缁х画鎻掑叆 `variant="banner"` 骞垮憡浣嶏紝骞朵娇鐢?`col-span-full` 妯法鏁磋銆?
- `/tools/[slug]` 璇︽儏椤靛寘鍚?3 涓箍鍛婁綅锛氭鏂囦腑闂?`inline`銆佸簳閮?`banner`銆佸彸渚ф爮 `sidebar`銆?
- 涓嶆帴鍏ョ湡瀹炲箍鍛婂钩鍙帮紝涓嶅姞鍏ュ箍鍛婅剼鏈€?
- 涓嶄慨鏀规暟鎹簱銆佸悗鍙般€丼upabase 鐩稿叧浠ｇ爜銆乵ock 鏁版嵁缁撴瀯鍜岃矾鐢辩粨鏋勩€?
- 宸茶繍琛?`npm run lint`銆?
- 宸茶繍琛?`npm run build`銆?
- 宸查噸鍚?`npm run dev`銆?
- 宸叉鏌ラ椤?`/`銆佸伐鍏峰簱 `/tools`銆佸伐鍏疯鎯呴〉 `/tools/raycast` 鍧囪繑鍥?200銆?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌ラ椤垫闈㈢鏈?1 涓箍鍛婁綅锛屾枃妗堜负鈥滃悎浣滄帹骞库€濆拰鈥滄澶勫彲灞曠ず璧炲姪宸ュ叿銆佺簿閫夋湇鍔℃垨骞垮憡鍐呭鈥濄€?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌?`/tools` 妗岄潰绔拰鎵嬫満绔潎鏈?1 涓箍鍛婁綅锛屾枃妗堜负鈥滃悎浣滄帹骞库€濆拰鈥滆繖閲屽彲浠ュ睍绀鸿禐鍔╁伐鍏枫€佺簿閫夋湇鍔℃垨骞垮憡鍐呭鈥濄€?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌?`/tools` 骞垮憡浣嶅湪 grid 涓?`grid-column` 涓?`1 / -1`锛屽彲妯法鏁磋銆?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌?`/tools/raycast` 妗岄潰绔拰鎵嬫満绔潎鏈?3 涓箍鍛婁綅銆?
- 宸茬‘璁ら椤点€佸伐鍏峰簱椤靛拰宸ュ叿璇︽儏椤靛潎鏈彂鐜版í鍚戞粴鍔ㄣ€?

涓嬩竴姝ワ細

- 鍚庣画鎺ュ叆鐪熷疄骞垮憡鎴栬仈鐩熼摼鎺ユ椂锛屽彧鏇挎崲 `AdPlaceholder` 鍐呴儴瀹炵幇锛岄〉闈腑缁х画澶嶇敤缁熶竴缁勪欢銆?

## 2026-06-01

浠诲姟锛氫紭鍖?`/tools/[slug]` 宸ュ叿璇︽儏椤佃瑙夊拰骞垮憡浣嶇粨鏋勩€?

鏀瑰姩鏂囦欢锛?

- `src/app/tools/[slug]/page.tsx`
- `src/components/tools/tool-detail-page.tsx`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 涓嶈繛鎺ユ暟鎹簱銆?
- 涓嶄慨鏀归椤点€?
- 涓嶄慨鏀?`/tools` 宸ュ叿鍒楄〃椤点€?
- 涓嶄慨鏀瑰悗鍙般€丼upabase 鐩稿叧浠ｇ爜銆佽矾鐢辩粨鏋勫拰 mock 鏁版嵁缁撴瀯銆?
- 璇︽儏椤?Hero 浣跨敤 `section-gradient-blue`銆乣page-shell` 鍜?`glass-card-strong`銆?
- Hero 鏄剧ず宸ュ叿鍚嶇О銆佷竴鍙ヨ瘽浠嬬粛銆佸垎绫汇€佹爣绛俱€佹槸鍚﹀厤璐广€佹槸鍚﹀紑婧愬拰鈥滆闂畼鏂圭綉绔欌€濇寜閽€?
- 瀹樼綉鎸夐挳浠呭湪瀛樺湪 `website_url` 鏃舵樉绀恒€?
- 瀹樼綉鎸夐挳浣跨敤 `target="_blank"` 鍜?`rel="nofollow noopener noreferrer"`銆?
- 姝ｆ枃涓诲唴瀹瑰尯浣跨敤 `page-shell`锛岀數鑴戠涓哄乏渚т富鍐呭 + 鍙充晶骞垮憡鏍忎袱鏍忓竷灞€銆?
- 涓诲唴瀹逛娇鐢?`glass-card`锛屽苟鎸夐『搴忔樉绀鸿缁嗕粙缁嶃€佷富瑕佸姛鑳姐€侀€傚悎浜虹兢銆佷娇鐢ㄥ満鏅€佷紭鐐广€佺己鐐瑰拰椋庨櫓鎻愮ず銆?
- 鍦ㄢ€滀富瑕佸姛鑳解€濆拰鈥滈€傚悎浜虹兢鈥濅箣闂存彃鍏?`AdPlaceholder variant="inline"`銆?
- 鍙充晶骞垮憡鏍忔彃鍏?`AdPlaceholder variant="sidebar"`锛岀數鑴戠 sticky锛屾墜鏈虹鑷劧鎺掑埌姝ｆ枃涓嬫柟銆?
- 姝ｆ枃缁撴潫鍚庢柊澧炲簳閮ㄥ畼缃戣闂?CTA锛屾爣棰樹负鈥滃噯澶囪闂繖涓伐鍏凤紵鈥濄€?
- 鐩稿叧鎺ㄨ崘绉诲姩鍒伴〉闈㈠簳閮紝浠呮帹鑽愬悓鍒嗙被宸ュ叿锛屾渶澶?3 涓紝鍗＄墖浣跨敤 `glass-card`锛屾寜閽枃妗堜负鈥滄煡鐪嬭鎯呪€濄€?
- 鐩稿叧鎺ㄨ崘涔嬪悗鎻掑叆 `AdPlaceholder variant="banner"`銆?
- 鏈€搴曢儴缁х画鏄剧ず `CopyrightNotice`銆?
- 鎵句笉鍒板伐鍏锋椂鏄剧ず鍙嬪ソ绌虹姸鎬侊紝鏂囨涓衡€滄病鏈夋壘鍒拌繖涓伐鍏封€濆拰鈥滀綘鍙互杩斿洖宸ュ叿搴撻噸鏂版祻瑙堛€傗€濓紝骞舵彁渚涒€滆繑鍥炲伐鍏峰簱鈥濇寜閽€?
- 宸茶繍琛?`npm run lint`銆?
- 宸茶繍琛?`npm run build`銆?
- 宸查噸鍚?`npm run dev` 骞舵鏌?`/tools/raycast` 鍜?`/tools/not-exist` 鍧囪繑鍥?200銆?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌?`/tools/raycast` 妗岄潰绔湁 3 涓箍鍛婁綅锛? 涓€滆闂畼鏂圭綉绔欌€濇寜閽€?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌?`/tools/raycast` 瀹樼綉鎸夐挳鍧囦娇鐢?`target="_blank"` 鍜?`rel="nofollow noopener noreferrer"`銆?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌?`/tools/raycast` 鏈嚭鐜扳€滄煡鐪嬪畼缃戔€濄€?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌?`/tools/raycast` 鎵嬫満绔爣棰樹负 `36px`锛岄〉闈㈡棤妯悜婊氬姩銆?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌ユ鏂囧垎鍧楅『搴忔纭紝inline 骞垮憡浣嶄綅浜庘€滀富瑕佸姛鑳解€濆拰鈥滈€傚悎浜虹兢鈥濅箣闂淬€?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌?`/tools/supabase` 鏈夊悓鍒嗙被鐩稿叧鎺ㄨ崘锛屽苟鏄剧ず鈥滄煡鐪嬭鎯呪€濇寜閽€?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌?`/tools/not-exist` 鏄剧ず鍙嬪ソ绌虹姸鎬佸拰鈥滆繑鍥炲伐鍏峰簱鈥濇寜閽€?

涓嬩竴姝ワ細

- 鍚庣画鍙互鍒涘缓鏂囩珷璇︽儏椤碉紝骞跺鐢ㄥ悓涓€濂楀箍鍛娿€佺増鏉冨拰搴曢儴鎺ㄨ崘缁撴瀯銆?

## 2026-06-01

浠诲姟锛氱粺涓€浼樺寲鏂囩珷鍒楄〃椤?`/articles` 鍜屾枃绔犺鎯呴〉 `/articles/[slug]`銆?

鏀瑰姩鏂囦欢锛?

- `src/app/articles/page.tsx`
- `src/app/articles/[slug]/page.tsx`
- `src/components/articles/article-content.ts`
- `src/components/articles/articles-page.tsx`
- `src/components/articles/articles-hero.tsx`
- `src/components/articles/articles-filter-panel.tsx`
- `src/components/articles/articles-grid.tsx`
- `src/components/articles/article-card.tsx`
- `src/components/articles/articles-no-results.tsx`
- `src/components/articles/article-detail-page.tsx`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 涓嶈繛鎺ユ暟鎹簱銆?
- 涓嶄慨鏀归椤点€?
- 涓嶄慨鏀?`/tools` 椤甸潰銆?
- 涓嶄慨鏀?`/tools/[slug]` 椤甸潰銆?
- 涓嶄慨鏀瑰悗鍙般€丼upabase 鐩稿叧浠ｇ爜銆佽矾鐢辩粨鏋勫拰 mock 鏁版嵁缁撴瀯銆?
- 鐢变簬 `src/data/mock-articles.ts` 鍙湁鍩虹鍒楄〃瀛楁锛屾湰娆″湪 `src/components/articles/article-content.ts` 涓仛璇︽儏鍐呭銆佹爣绛惧拰 slug 鍏煎琛ュ厖锛屾湭鏀瑰師 mock 鏂囦欢銆?
- 鏂板 `/articles` 鏂囩珷鍒楄〃椤点€?
- 鏂板 `/articles/[slug]` 鏂囩珷璇︽儏椤点€?
- 鏂囩珷鍒楄〃 Hero 浣跨敤 `section-gradient-violet`銆乣page-shell` 鍜?`glass-card-strong` 鏁版嵁鍗°€?
- 鏂囩珷鍒楄〃绛涢€夊尯浣跨敤 `glass-card-strong`锛屾敮鎸佹悳绱€佸垎绫荤瓫閫夈€佹爣绛剧瓫閫夈€佹樉绀哄綋鍓嶆枃绔犳暟閲忓拰娓呯┖绛涢€夈€?
- 鏂囩珷鍗＄墖浣跨敤 `glass-card` 鍜?`soft-card-hover`锛屾寜閽枃妗堜负鈥滈槄璇诲叏鏂団€濓紝閾炬帴鍒?`/articles/[slug]`銆?
- 鏂囩珷鍒楄〃骞垮憡浣嶄娇鐢?`AdPlaceholder variant="banner"`锛屽皯浜?6 绡囨椂鏀惧湪鍒楄〃涓嬫柟锛屽苟浣跨敤 `col-span-full` 妯法鏁磋銆?
- 鏂囩珷鍒楄〃绌虹姸鎬佷娇鐢?`glass-card`锛屾樉绀衡€滄病鏈夋壘鍒板尮閰嶇殑鏂囩珷鈥濆拰鈥滃彲浠ュ皾璇曞噺灏戠瓫閫夋潯浠舵垨鎹竴涓叧閿瘝銆傗€濄€?
- 鏂囩珷璇︽儏椤?Hero 浣跨敤 `section-gradient-violet`銆乣page-shell` 鍜?`glass-card-strong`銆?
- 鏂囩珷璇︽儏椤垫鏂囦娇鐢?`page-shell`锛岀數鑴戠涓哄乏渚ф鏂?+ 鍙充晶骞垮憡鏍忎袱鏍忓竷灞€锛屾墜鏈虹涓哄崟鍒椼€?
- 鏂囩珷璇︽儏椤垫鏂囦娇鐢?`glass-card`锛屾帓鐗堜娇鐢ㄨ緝瀹借璺濄€佹竻鏅版爣棰樺拰鍒楄〃銆?
- 鏂囩珷璇︽儏椤垫鏂囦腑閮ㄦ彃鍏?`AdPlaceholder variant="inline"`銆?
- 鏂囩珷璇︽儏椤靛彸渚ф爮鎻掑叆 `AdPlaceholder variant="sidebar"`锛屾墜鏈虹鑷劧鎺掑埌姝ｆ枃涓嬫柟銆?
- 鏂囩珷璇︽儏椤电浉鍏虫帹鑽愪紭鍏堟帹鑽愬悓鍒嗙被鏂囩珷锛屾渶澶?3 绡囷紝鎸夐挳鏂囨涓衡€滈槄璇诲叏鏂団€濄€?
- 鏂囩珷璇︽儏椤电浉鍏虫帹鑽愪箣鍚庢彃鍏?`AdPlaceholder variant="banner"`銆?
- 鏂囩珷璇︽儏椤靛簳閮ㄦ彃鍏?`CopyrightNotice`銆?
- 鎵句笉鍒版枃绔犳椂鏄剧ず鍙嬪ソ绌虹姸鎬侊紝鏂囨涓衡€滄病鏈夋壘鍒拌繖绡囨枃绔犫€濆拰鈥滀綘鍙互杩斿洖鏂囩珷鍒楄〃缁х画娴忚銆傗€濓紝骞舵彁渚涒€滆繑鍥炴枃绔犲垪琛ㄢ€濇寜閽€?
- 宸茶繍琛?`npm run lint`銆?
- 宸茶繍琛?`npm run build`銆?
- 宸查噸鍚?`npm run dev` 骞舵鏌?`/articles`銆乣/articles/ai-tool-checklist`銆乣/articles/not-exist` 鍧囪繑鍥?200銆?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌?`/articles` 妗岄潰绔枃绔犲崱鐗囦负 3 鏍忥紝鎵嬫満绔负 1 鏍忋€?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌?`/articles` Hero 鏍囬銆佹爣绛俱€佸唴瀹圭湅鏉裤€佹悳绱㈠崰浣嶆枃妗堝拰 banner 骞垮憡浣嶆甯告樉绀恒€?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌?`/articles` 骞垮憡浣?`grid-column` 涓?`1 / -1`锛屽彲妯法鏁磋銆?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌?`/articles` 鍒嗙被绛涢€?`寮€婧愰」鐩甡 鍙瓫閫夊嚭 1 绡囨枃绔犮€?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌?`/articles` 鍒嗙被涓庢爣绛剧粍鍚堟棤缁撴灉鏃舵樉绀烘寚瀹氱┖鐘舵€併€?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌?`/articles/ai-tool-checklist` 妗岄潰绔湁 3 涓箍鍛婁綅锛屽彸渚ф鏂囧竷灞€涓轰袱鏍忋€?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌?`/articles/ai-tool-checklist` 鎵嬫満绔爣棰樹负 `36px`锛岄〉闈㈡棤妯悜婊氬姩銆?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌?`/articles/ai-tool-checklist` 鏄剧ず鐗堟潈澹版槑銆?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌?`/articles/not-exist` 鏄剧ず鍙嬪ソ绌虹姸鎬佸拰鈥滆繑鍥炴枃绔犲垪琛ㄢ€濇寜閽€?

涓嬩竴姝ワ細

- 鍚庣画鎺ュ叆鏁版嵁搴撴椂锛屽皢 `article-content.ts` 涓殑鍏煎璇︽儏瀛楁杩佺Щ鍒扮湡瀹炴枃绔犺〃鍜屽悗鍙拌〃鍗曘€?

## 2026-06-01

浠诲姟锛氱粺涓€浼樺寲椤堕儴瀵艰埅 Header 鍜屽簳閮?Footer銆?

鏀瑰姩鏂囦欢锛?

- `src/components/layout/Header.tsx`
- `src/components/layout/MobileNav.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/site-header.tsx`
- `src/components/site-footer.tsx`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DESIGN_SYSTEM.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- 涓嶄慨鏀归椤靛唴瀹广€佸伐鍏烽〉銆佸伐鍏疯鎯呴〉銆佹枃绔犻〉銆佹枃绔犺鎯呴〉銆佹暟鎹簱銆佸悗鍙般€丼upabase 鐩稿叧浠ｇ爜鍜?mock 鏁版嵁銆?
- 鏂板 `src/components/layout/Header.tsx`锛岀粺涓€绔欑偣椤堕儴瀵艰埅銆?
- 鏂板 `src/components/layout/MobileNav.tsx`锛岀敤浜庢墜鏈虹灞曞紑寮忚彍鍗曘€?
- 鏂板 `src/components/layout/Footer.tsx`锛岀粺涓€绔欑偣搴曢儴椤佃剼銆?
- `src/components/site-header.tsx` 鍜?`src/components/site-footer.tsx` 鏀逛负鍏煎杞彂鍏ュ彛锛岄伩鍏嶉€愪釜椤甸潰淇敼寮曠敤銆?
- Header 浣跨敤鍗婇€忔槑鐜荤拑鑳屾櫙銆乥ackdrop blur銆佹祬杈规鍜?sticky 椤堕儴瀵艰埅銆?
- Header 鍖呭惈绔欑偣鍚嶁€滅煡浜€濄€佸壇鏍囪瘑鈥滃伐鍏蜂笌鐭ヨ瘑鍙戠幇绔欌€濄€侀椤点€佸伐鍏峰簱銆佹枃绔犮€佹姇绋裤€佺増鏉冩姇璇夈€佹悳绱€佹帹鑽愬伐鍏枫€?
- 褰撳墠椤甸潰瀵艰埅椤逛娇鐢ㄦ祬鑹茶兌鍥?娣辫壊楂樹寒鐘舵€併€?
- 鎵嬫満绔殣钘忎腑闂村鑸紝鏄剧ず鈥滆彍鍗曗€濇寜閽紝灞曞紑鍚庝娇鐢?`glass-card` 椋庢牸绉诲姩鑿滃崟銆?
- Footer 浣跨敤娴呰壊娓愬彉鑳屾櫙鍜?`page-shell`锛屽寘鍚珯鐐硅鏄庛€佸揩閫熻闂€佸弬涓庝笌鍙嶉銆佸唴瀹瑰師鍒欏拰鐗堟潈琛屻€?
- 宸茶繍琛?`npm run lint`銆?
- 宸茶繍琛?`npm run build`銆?
- 宸查噸鍚?`npm run dev`銆?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌?`/articles` 妗岄潰绔?Header 涓?sticky锛宐ackdrop blur 鐢熸晥锛屼富瀵艰埅鏄剧ず涓烘í鍚戝竷灞€銆?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌?`/articles` 妗岄潰绔綋鍓嶅鑸」鈥滄枃绔犫€濋珮浜€?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌?Footer 鍖呭惈鈥滃揩閫熻闂€濃€滃弬涓庝笌鍙嶉鈥濃€滃唴瀹瑰師鍒欌€濆拰 `漏 2026 鐭ヤ韩. All rights reserved.`銆?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌?390px 鎵嬫満绔腑闂村鑸殣钘忥紝绉诲姩鑿滃崟鎸夐挳鍙睍寮€锛岃彍鍗曞寘鍚叏閮ㄥ鑸叆鍙ｃ€?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌?390px 鎵嬫満绔?Footer 涓哄崟鍒楀竷灞€銆?
- 宸茬‘璁ゆ闈㈢鍜屾墜鏈虹鍧囨湭鍙戠幇妯悜婊氬姩銆?

涓嬩竴姝ワ細

- 鍚庣画鍙互琛ラ綈 `/search`銆乣/submit`銆乣/copyright` 椤甸潰锛岄伩鍏嶅鑸叆鍙ｈ繘鍏?404銆?

## 2026-06-01

浠诲姟锛氱粺涓€浼樺寲 `/submit` 鎶曠椤靛拰 `/copyright` 鐗堟潈鎶曡瘔椤点€?

鏀瑰姩鏂囦欢锛?

- `src/app/submit/page.tsx`
- `src/app/copyright/page.tsx`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DESIGN_SYSTEM.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- 涓嶄慨鏀归椤点€佸伐鍏烽〉銆佸伐鍏疯鎯呴〉銆佹枃绔犻〉銆佹枃绔犺鎯呴〉銆丠eader銆丗ooter銆佹暟鎹簱銆佸悗鍙般€丼upabase 鐩稿叧浠ｇ爜鍜?mock 鏁版嵁銆?
- 鏂板 `/submit` 鎶曠椤碉紝浣跨敤 `section-gradient-cyan`銆乣page-shell`銆乣glass-card`銆乣glass-card-strong`銆?
- `/submit` Hero 鏂囨涓衡€滄帹鑽愪竴涓€煎緱鏀跺綍鐨勫伐鍏封€濓紝骞舵樉绀衡€滀汉宸ュ鏍糕€濃€滀紭鍏堝畼缃戔€濃€滄嫆缁濈牬瑙ｇ洍鐗堚€濃€滄寔缁敹褰曗€濇爣绛俱€?
- `/submit` 鍖呭惈鎶曠璇存槑鍖恒€佹姇绋胯〃鍗曞尯鍜屾敹褰曞師鍒欏尯銆?
- `/submit` 琛ㄥ崟鍖呭惈宸ュ叿鍚嶇О銆佸畼鏂瑰湴鍧€銆佸伐鍏风畝浠嬨€佹帹鑽愮悊鐢便€佹帹鑽愪汉閭銆?
- `/submit` 宸插仛鍓嶅彴蹇呭～鏍￠獙锛氬伐鍏峰悕绉般€佸畼鏂瑰湴鍧€銆佸伐鍏风畝浠嬨€?
- `/submit` 鎻愪氦鎴愬姛鍚庢樉绀哄墠鍙版紨绀烘垚鍔熸彁绀猴紝褰撳墠涓嶈繛鎺ユ暟鎹簱銆?
- 鏂板 `/copyright` 鐗堟潈鎶曡瘔椤碉紝浣跨敤 `section-gradient-violet`銆乣page-shell`銆乣glass-card`銆乣glass-card-strong`銆?
- `/copyright` Hero 鏂囨涓衡€滅増鏉冧笌鏉冪泭闂鍙嶉鈥濓紝骞舵樉绀衡€滅増鏉冨弽棣堚€濃€滄潈鐩婂鐞嗏€濃€滈摼鎺ユ洿姝ｂ€濃€滃強鏃舵牳瀹炩€濇爣绛俱€?
- `/copyright` 鍖呭惈澶勭悊璇存槑鍖恒€佹姇璇夎〃鍗曞尯鍜屽鐞嗘祦绋嬪尯銆?
- `/copyright` 琛ㄥ崟鍖呭惈鏉冨埄浜哄鍚嶆垨鏈烘瀯鍚嶇О銆佽仈绯婚偖绠便€佹秹鍙婇〉闈㈤摼鎺ャ€侀棶棰樼被鍨嬨€佽瘉鏄庢潗鏂欒鏄庛€佸鐞嗚姹傘€?
- `/copyright` 闂绫诲瀷鍖呭惈鐗堟潈闂銆佸晢鏍囬棶棰樸€佹巿鏉冮棶棰樸€佷俊鎭敊璇€侀摼鎺ュけ鏁堛€佸叾浠栭棶棰樸€?
- `/copyright` 宸插仛鍓嶅彴蹇呭～鏍￠獙锛氭潈鍒╀汉濮撳悕鎴栨満鏋勫悕绉般€佽仈绯婚偖绠便€佹秹鍙婇〉闈㈤摼鎺ャ€侀棶棰樼被鍨嬨€佸鐞嗚姹傘€?
- `/copyright` 鎻愪氦鎴愬姛鍚庢樉绀哄墠鍙版紨绀烘垚鍔熸彁绀猴紝褰撳墠涓嶈繛鎺ユ暟鎹簱銆?
- 宸茶繍琛?`npm run lint`銆?
- 宸茶繍琛?`npm run build`銆?
- 宸查噸鍚?`npm run dev`锛屽苟纭 `/submit` 鍜?`/copyright` 杩斿洖 200銆?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌?`/submit` 绌鸿〃鍗曟彁浜や細鏄剧ず 3 鏉″繀濉敊璇€?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌?`/submit` 濉啓蹇呭～椤瑰悗浼氭樉绀烘垚鍔熸彁绀恒€?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌?`/copyright` 绌鸿〃鍗曟彁浜や細鏄剧ず 5 鏉″繀濉敊璇€?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌?`/copyright` 濉啓蹇呭～椤瑰悗浼氭樉绀烘垚鍔熸彁绀恒€?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌?390px 鎵嬫満绔?`/submit` 鍜?`/copyright` 鏍囬瀛楀彿涓?`36px`銆?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌?390px 鎵嬫満绔墍鏈夎緭鍏ユ鍜屾寜閽搴︽甯搞€?
- 宸茬‘璁ゆ闈㈢鍜屾墜鏈虹鍧囨湭鍙戠幇妯悜婊氬姩銆?

涓嬩竴姝ワ細

- 鍚庣画鍙互缁х画鍒朵綔 `/search` 鎼滅储椤碉紝鎴栧湪 Supabase 闃舵鎶婅繖涓や釜琛ㄥ崟鎺ュ叆瀹℃牳鏁版嵁琛ㄣ€?

## 2026-06-02

浠诲姟锛氱粺涓€浼樺寲 `/search` 鎼滅储椤点€?

鏀瑰姩鏂囦欢锛?

- `src/app/search/page.tsx`
- `src/components/search/search-page.tsx`
- `src/components/search/search-hero.tsx`
- `src/components/search/search-controls.tsx`
- `src/components/search/search-results.tsx`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DESIGN_SYSTEM.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- 涓嶄慨鏀归椤点€佸伐鍏烽〉銆佸伐鍏疯鎯呴〉銆佹枃绔犻〉銆佹枃绔犺鎯呴〉銆佹姇绋块〉銆佺増鏉冩姇璇夐〉銆丠eader銆丗ooter銆佹暟鎹簱銆佸悗鍙般€丼upabase 鐩稿叧浠ｇ爜鍜?mock 鏁版嵁缁撴瀯銆?
- 鏂板 `/search` 鎼滅储椤靛叆鍙ｃ€?
- 鏂板 `src/components/search/` 鐩綍锛岀敤浜庢壙杞芥悳绱㈤〉 Hero銆佹悳绱㈢瓫閫夊尯銆佺粨鏋滃尯鍜岀┖鐘舵€併€?
- 鎼滅储椤?Hero 浣跨敤 `section-gradient-blue`銆乣page-shell` 鍜?`glass-card-strong`銆?
- Hero 鏍囬涓衡€滄悳绱㈠伐鍏枫€佹枃绔犱笌鏁堢巼鎶€宸р€濓紝鍓爣棰樺拰鏍囩鎸変换鍔¤姹傝缃€?
- Hero 鍙充晶鎻愮ず鍗℃樉绀衡€滄悳绱㈠缓璁€濆拰 AI 鍐欎綔銆丳DF 宸ュ叿銆佸紑婧愰」鐩€佸浘鐗囧鐞嗐€佹晥鐜囪蒋浠躲€?
- 涓绘悳绱㈠尯浣跨敤 `glass-card-strong`锛屾悳绱㈡鍗犱綅鏂囨涓衡€滄悳绱㈠伐鍏枫€佹枃绔犮€佸垎绫绘垨鏍囩鈥濄€?
- 涓绘悳绱㈠尯鍖呭惈鈥滃紑濮嬫悳绱⑩€濇寜閽€佹竻绌烘寜閽拰鐑棬鍏抽敭璇嶈兌鍥娿€?
- 鐑棬鍏抽敭璇嶇偣鍑诲悗浼氳嚜鍔ㄥ～鍏ユ悳绱㈡骞惰Е鍙戞悳绱€?
- 蹇€熺瓫閫夊尯鍖呭惈鈥滃叏閮ㄢ€濃€滃彧鐪嬪伐鍏封€濃€滃彧鐪嬫枃绔犫€濓紝閫変腑鐘舵€佷娇鐢ㄩ潚钃濇笎鍙樸€?
- 鎼滅储鑼冨洿瑕嗙洊宸ュ叿鍚嶇О銆佺畝浠嬨€佸垎绫汇€佹爣绛俱€侀€傚悎浜虹兢銆佷娇鐢ㄥ満鏅紝浠ュ強鏂囩珷鏍囬銆佹憳瑕併€佸垎绫汇€佹爣绛惧拰姝ｆ枃娈佃惤/鍒楄〃鍐呭銆?
- 鍒濆鐘舵€佹樉绀衡€滀綘鍙互浠庤繖浜涘唴瀹瑰紑濮嬧€濓紝骞跺睍绀烘帹鑽愬伐鍏?3 涓€佹帹鑽愭枃绔?3 绡囥€?
- 宸ュ叿缁撴灉澶嶇敤 `ToolCard`锛屾寜閽枃妗堜负鈥滄煡鐪嬭鎯呪€濓紝璺宠浆鍒?`/tools/[slug]`锛屼笉鏄剧ず鈥滄煡鐪嬪畼缃戔€濄€?
- 鏂囩珷缁撴灉澶嶇敤 `ArticleCard`锛屾寜閽枃妗堜负鈥滈槄璇诲叏鏂団€濓紝璺宠浆鍒?`/articles/[slug]`銆?
- 宸ュ叿缁撴灉鍜屾枃绔犵粨鏋滀箣闂存彃鍏?`AdPlaceholder variant="banner"` 骞垮憡浣嶏紱鍙湁涓€绉嶇粨鏋滄椂骞垮憡浣嶆斁鍦ㄧ粨鏋滃垪琛ㄤ笅鏂广€?
- 鏃犳悳绱㈢粨鏋滄椂鏄剧ず `glass-card` 绌虹姸鎬侊紝鏂囨涓衡€滄病鏈夋壘鍒扮浉鍏冲唴瀹光€濆拰鈥滃彲浠ュ皾璇曟崲涓€涓叧閿瘝锛屾垨鍑忓皯绛涢€夋潯浠躲€傗€濓紝骞舵彁渚涒€滄竻绌烘悳绱⑩€濇寜閽€?
- 宸茶繍琛?`npm run lint`銆?
- 宸茶繍琛?`npm run build`銆?
- 宸查噸鍚?`npm run dev`锛屽苟纭 `/search` 杩斿洖 200銆?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌?`/search` 鍒濆鐘舵€佹湁 3 涓伐鍏疯鎯呭叆鍙ｅ拰 3 绡囨枃绔犻槄璇诲叆鍙ｃ€?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌?`/search` 鍒濆鐘舵€佹樉绀哄箍鍛婁綅鈥滃悎浣滄帹骞库€濆拰鈥滆繖閲屽彲浠ュ睍绀鸿禐鍔╁伐鍏枫€佺簿閫夋湇鍔℃垨骞垮憡鍐呭鈥濄€?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌?`/search` 椤甸潰鏈嚭鐜扳€滄煡鐪嬪畼缃戔€濄€?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌ョ偣鍑荤儹闂ㄥ叧閿瘝鈥滃紑婧愨€濆悗锛屾悳绱㈡鑷姩濉叆鈥滃紑婧愨€濓紝骞跺尮閰?2 涓伐鍏风粨鏋滃拰 2 绡囨枃绔犵粨鏋溿€?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌モ€滃彧鐪嬫枃绔犫€濈瓫閫夊悗浠呮樉绀烘枃绔犵粨鏋溿€?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌モ€滃彧鐪嬪伐鍏封€濈瓫閫夊悗浠呮樉绀哄伐鍏风粨鏋溿€?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌ョ偣鍑荤儹闂ㄥ叧閿瘝鈥淧DF鈥濆悗鏄剧ず鎸囧畾绌虹姸鎬併€?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌ョ偣鍑烩€滄竻绌烘悳绱⑩€濆悗鎭㈠鍒濆鎺ㄨ崘鍐呭銆?
- 宸蹭娇鐢ㄦ祻瑙堝櫒妫€鏌?390px 鎵嬫満绔爣棰樺瓧鍙蜂负 `36px`锛屾悳绱㈡瀹藉害姝ｅ父锛岀粨鏋滃崱鐗囦负鍗曞垪銆?
- 宸茬‘璁ゆ闈㈢鍜屾墜鏈虹鍧囨湭鍙戠幇妯悜婊氬姩銆?

涓嬩竴姝ワ細

- 鍚庣画鍙互鍦?Supabase 闃舵鎶婃悳绱㈣寖鍥存墿灞曞埌鐪熷疄宸ュ叿琛ㄥ拰鏂囩珷琛紝骞舵牴鎹湡瀹炲唴瀹规暟閲忓鍔犳帓搴忚鍒欍€?

## 2026-06-02

浠诲姟锛氬墠鍙伴〉闈㈢粺涓€楠屾敹涓庝慨澶嶃€?

鏀瑰姩鏂囦欢锛?

- `src/components/home/home-article-card.tsx`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DESIGN_SYSTEM.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- 鏈涓嶆柊澧炲姛鑳斤紝涓嶄慨鏀规暟鎹簱銆佸悗鍙般€丼upabase 鐩稿叧浠ｇ爜銆佽矾鐢辩粨鏋勫拰 mock 鏁版嵁缁撴瀯銆?
- 宸叉鏌ラ〉闈細`/`銆乣/tools`銆乣/tools/raycast`銆乣/articles`銆乣/articles/ai-tool-checklist`銆乣/search`銆乣/submit`銆乣/copyright`銆?
- 宸茶繍琛?`npm run lint`锛岄€氳繃銆?
- 宸茶繍琛?`npm run build`锛岄€氳繃銆?
- 宸查噸鍚?`npm run dev`锛屽苟纭 8 涓墠鍙伴〉闈㈠潎杩斿洖 200銆?
- 鍙戠幇骞朵慨澶嶉椤垫渶鏂版枃绔犲崱鐗囬棶棰橈細鍘熸寜閽摼鎺ヤ负 `#` 涓旀枃妗堜负鈥滈槄璇绘枃绔犫€濓紝宸叉敼涓鸿烦杞?`/articles/[slug]`锛屾寜閽枃妗堜负鈥滈槄璇诲叏鏂団€濄€?
- 宸叉鏌ラ椤靛伐鍏峰崱鐗囨寜閽烦杞埌 `/tools/[slug]`銆?
- 宸叉鏌ラ椤垫枃绔犲崱鐗囨寜閽烦杞埌 `/articles/[slug]`銆?
- 宸叉鏌?`/tools` 宸ュ叿鍗＄墖鎸夐挳璺宠浆鍒?`/tools/[slug]`锛屼笖鏈嚭鐜扳€滄煡鐪嬪畼缃戔€濄€?
- 宸叉鏌?`/tools/raycast` 鍙湪璇︽儏椤垫樉绀衡€滆闂畼鏂圭綉绔欌€濓紝瀹樼綉閾炬帴浣跨敤鏂扮獥鍙ｆ墦寮€锛屽苟甯?`rel="nofollow noopener noreferrer"`銆?
- 宸叉鏌?`/articles` 鏂囩珷鍗＄墖璺宠浆鍒?`/articles/[slug]`锛屾寜閽枃妗堜负鈥滈槄璇诲叏鏂団€濄€?
- 宸叉鏌?`/search` 宸ュ叿缁撴灉璺宠浆鍒?`/tools/[slug]`锛屾枃绔犵粨鏋滆烦杞埌 `/articles/[slug]`銆?
- 宸叉鏌ラ椤点€佸伐鍏峰簱銆佸伐鍏疯鎯呫€佹枃绔犲垪琛ㄣ€佹枃绔犺鎯呫€佹悳绱㈤〉銆佹姇绋块〉銆佺増鏉冩姇璇夐〉鍧囦娇鐢ㄦ祬鑹叉笎鍙樺垎鍖哄拰鐜荤拑鍗＄墖椋庢牸銆?
- 宸叉鏌?Header 鍏ㄧ珯缁熶竴锛屾闈㈢ sticky锛屾墜鏈虹鑿滃崟鍙睍寮€銆?
- 宸叉鏌?Footer 鍏ㄧ珯缁熶竴锛屾墜鏈虹涓哄崟鍒楀竷灞€銆?
- 宸叉鏌ラ椤靛箍鍛婁綅浣嶄簬鎺ㄨ崘宸ュ叿鍖哄拰鏈€鏂版枃绔犲尯涔嬮棿銆?
- 宸叉鏌?`/tools` 骞垮憡浣嶄綅浜庡伐鍏峰垪琛ㄤ腑锛屽苟浣跨敤 `col-span-full` 妯法鏁磋銆?
- 宸叉鏌?`/tools/raycast` 鏈?3 涓箍鍛婁綅锛氭鏂囦腑闂?inline銆佸彸渚?sidebar銆佸簳閮?banner銆?
- 宸叉鏌?`/articles` 骞垮憡浣嶄綅浜庢枃绔犲垪琛ㄤ腑锛屽苟浣跨敤 `col-span-full` 妯法鏁磋銆?
- 宸叉鏌?`/articles/ai-tool-checklist` 鏈?3 涓箍鍛婁綅锛氭鏂囦腑闂?inline銆佸彸渚?sidebar銆佸簳閮?banner銆?
- 宸叉鏌?`/search` 骞垮憡浣嶄綅浜庡伐鍏风粨鏋滃拰鏂囩珷缁撴灉涔嬮棿锛屾垨缁撴灉鍒楄〃涓嬫柟锛屽苟妯法鏁磋銆?
- 宸叉鏌?`/tools/raycast` 鍜?`/articles/ai-tool-checklist` 鍧囧彧鏈?1 涓?`CopyrightNotice`锛屾枃妗堝畬鏁淬€?
- 宸叉鏌?`/tools` 鎼滅储銆佸垎绫荤瓫閫夈€佹爣绛剧瓫閫夈€佹竻绌虹瓫閫夊拰鏃犵粨鏋滅姸鎬佸潎姝ｅ父銆?
- 宸叉鏌?`/articles` 鎼滅储銆佸垎绫荤瓫閫夈€佹爣绛剧瓫閫夈€佹竻绌虹瓫閫夊拰鏃犵粨鏋滅姸鎬佸潎姝ｅ父銆?
- 宸叉鏌?`/search` 鍒濆鐘舵€併€佺儹闂ㄥ叧閿瘝銆佸叏閮?鍙湅宸ュ叿/鍙湅鏂囩珷銆佹棤缁撴灉鐘舵€佸拰娓呯┖鎼滅储鍧囨甯搞€?
- 宸叉鏌?`/submit` 绌鸿〃鍗曟牎楠屽拰姝ｅ父鎻愪氦鎴愬姛鎻愮ず鍧囨甯搞€?
- 宸叉鏌?`/copyright` 绌鸿〃鍗曟牎楠屻€侀棶棰樼被鍨嬮€夋嫨鍜屾甯告彁浜ゆ垚鍔熸彁绀哄潎姝ｅ父銆?
- 宸蹭娇鐢?390px 鎵嬫満绔鏌ユ墍鏈夊墠鍙伴〉闈紝鍧囨湭鍙戠幇妯悜婊氬姩銆?
- 宸蹭娇鐢?390px 鎵嬫満绔鏌ヨ鎯呴〉涓ゆ爮甯冨眬浼氬彉涓哄崟鍒楋紝骞垮憡浣嶄笉婧㈠嚭銆?
- 宸蹭娇鐢?390px 鎵嬫満绔鏌?Hero 鏍囬涓嶈秴杩?`36px`锛岃〃鍗曡緭鍏ユ涓嶆孩鍑恒€?

涓嬩竴姝ワ細

- 褰撳墠鍓嶅彴闈欐€侀〉闈㈤獙鏀跺凡閫氳繃锛涘悗缁彲浠ヨ繘鍏?Supabase 鏁版嵁琛ㄨ璁″拰琛ㄥ崟鎺ュ叆闃舵銆?

## 2026-06-03

浠诲姟锛氭帴鍏?Supabase 鍓嶅彴鍙鏁版嵁锛屾妸 mock 鏁版嵁閫愭鏇挎崲涓虹湡瀹炴暟鎹簱璇诲彇銆?

鏀瑰姩鏂囦欢锛?

- `package.json`
- `package-lock.json`
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/lib/db/categories.ts`
- `src/lib/db/tags.ts`
- `src/lib/db/tools.ts`
- `src/lib/db/articles.ts`
- `src/lib/db/normalizers.ts`
- `src/types/database.ts`
- `src/types/tool.ts`
- `src/types/article.ts`
- `src/app/page.tsx`
- `src/app/tools/page.tsx`
- `src/app/tools/[slug]/page.tsx`
- `src/app/articles/page.tsx`
- `src/app/articles/[slug]/page.tsx`
- `src/app/search/page.tsx`
- `src/components/home/home-page.tsx`
- `src/components/home/home-category-section.tsx`
- `src/components/home/home-featured-tools.tsx`
- `src/components/home/home-latest-articles.tsx`
- `src/components/home/home-tool-card.tsx`
- `src/components/home/home-article-card.tsx`
- `src/components/tools/ToolCard.tsx`
- `src/components/tools/tool-detail-page.tsx`
- `src/components/tools/tools-page.tsx`
- `src/components/tools/tools-grid.tsx`
- `src/components/articles/articles-page.tsx`
- `src/components/articles/articles-grid.tsx`
- `src/components/search/search-page.tsx`
- `src/components/search/search-results.tsx`
- `docs/DATABASE_SCHEMA.md`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DESIGN_SYSTEM.md`銆乣docs/DATABASE_SCHEMA.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- 宸插畨瑁?`@supabase/supabase-js`銆?
- 鏂板 Supabase server/client 璇诲彇鍏ュ彛锛岀粺涓€璇诲彇 `NEXT_PUBLIC_SUPABASE_URL` 鍜?`NEXT_PUBLIC_SUPABASE_ANON_KEY`銆?
- 鏈娇鐢ㄣ€佹湭鏆撮湶銆佹湭鎵撳嵃 `service_role_key`銆?
- 鏂板 `src/lib/db/*` 鏁版嵁璁块棶灞傦紝椤甸潰涓嶇洿鎺ユ暎鍐?Supabase 鏌ヨ銆?
- 鏂板 `src/types/*` 绫诲瀷鏂囦欢锛屽噺灏戦〉闈腑鐨勫瓧娈电寽娴嬪拰 `any` 浣跨敤銆?
- 宸ュ叿鍜屾枃绔犺鍙栬鍒欎负 `status = 'published'`锛屽苟鎸?`created_at` 鍊掑簭銆?
- 鍒嗙被鍜屾爣绛炬敮鎸佺己澶卞吋瀹癸紝椤甸潰涓嶄細鍥犱负 `category` 鎴?`tags` 涓虹┖鎶ラ敊銆?
- Supabase 鐜鍙橀噺缂哄け鎴栨煡璇㈠け璐ユ椂锛屽墠鍙?fallback 鍒?mock 鏁版嵁銆?
- Supabase 閰嶇疆姝ｅ父浣嗘棤鏁版嵁鏃讹紝棣栭〉銆佸垪琛ㄩ〉鍜屾悳绱㈤〉鏄剧ず鍙嬪ソ绌虹姸鎬併€?
- Supabase 閰嶇疆姝ｅ父浣嗘棤宸ュ叿鎴栨棤鏂囩珷鏃讹紝`/tools` 鍜?`/articles` 鐨勭┖鐘舵€佷笅鏂逛粛鏄剧ず banner 骞垮憡浣嶃€?
- 棣栭〉鎺ㄨ崘宸ュ叿銆佹渶鏂版枃绔犮€佸垎绫诲叆鍙ｄ紭鍏堣鍙?Supabase銆?
- `/tools` 宸ュ叿鍒楄〃浼樺厛璇诲彇 Supabase锛屽苟淇濈暀鎼滅储銆佸垎绫荤瓫閫夊拰鏍囩绛涢€夈€?
- `/tools/[slug]` 宸ュ叿璇︽儏浼樺厛璇诲彇 Supabase锛屽苟淇濈暀鎵句笉鍒板伐鍏锋椂鐨勫弸濂界┖鐘舵€併€?
- `/articles` 鏂囩珷鍒楄〃浼樺厛璇诲彇 Supabase锛屽苟淇濈暀鎼滅储銆佸垎绫荤瓫閫夊拰鏍囩绛涢€夈€?
- `/articles/[slug]` 鏂囩珷璇︽儏浼樺厛璇诲彇 Supabase锛屽苟淇濈暀鎵句笉鍒版枃绔犳椂鐨勫弸濂界┖鐘舵€併€?
- `/search` 鍚屾椂浼樺厛璇诲彇 Supabase 宸ュ叿鍜屾枃绔狅紝骞朵繚鐣欏叏閮?/ 鍙湅宸ュ叿 / 鍙湅鏂囩珷绛涢€夈€?
- 鎼滅储鑼冨洿琛ュ厖鍏煎閫傚悎浜虹兢銆佷娇鐢ㄥ満鏅拰鏂囩珷姝ｆ枃鍐呭銆?
- 鏈慨鏀瑰悗鍙般€佺櫥褰曘€佹暟鎹簱 SQL銆丠eader銆丗ooter銆乣/submit`銆乣/copyright`銆佽瑙夎璁＄郴缁熷拰璺敱缁撴瀯銆?
- 宸茶繍琛?`npm run lint`锛岄€氳繃銆?
- 宸茶繍琛?`npm run build`锛岄€氳繃銆?
- 宸查噸鍚?`npm run dev` 骞舵鏌?`/`銆乣/tools`銆乣/articles`銆乣/search` 鍧囧彲鎵撳紑銆?
- 宸叉鏌ユ闈㈢鍜屾墜鏈虹 `/tools` 鏃犳í鍚戞粴鍔紝Supabase 绌烘暟鎹椂绌虹姸鎬佸拰骞垮憡浣嶆樉绀烘甯搞€?

涓嬩竴姝ワ細

- 鍦?Supabase 涓ˉ榻?`categories`銆乣tags`銆乣tools`銆乣articles` 鍙婂叧绯昏〃鏁版嵁鍚庯紝浣跨敤 `npm run dev` 妫€鏌ラ椤点€佸伐鍏峰簱銆佹枃绔犻〉鍜屾悳绱㈤〉鏄惁鏄剧ず鐪熷疄鍐呭銆?

## 2026-06-04

浠诲姟锛氶椤垫悳绱㈡敮鎸佺簿鍑嗙洿杈捐鎯呴〉銆?

鏀瑰姩鏂囦欢锛?
- `src/app/page.tsx`
- `src/components/home/home-page.tsx`
- `src/components/home/home-search-section.tsx`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DESIGN_SYSTEM.md`銆乣docs/DATABASE_SCHEMA.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- 棣栭〉缁х画璇诲彇 Supabase published 宸ュ叿鍜?published 鏂囩珷鏁版嵁锛屽苟鎶婂畬鏁?published 鏁版嵁浼犵粰棣栭〉鎼滅储缁勪欢鐢ㄤ簬绮惧噯鍖归厤銆?
- 棣栭〉鎼滅储妗嗚緭鍏ョ┖鍏抽敭璇嶆椂璺宠浆 `/search`銆?
- 棣栭〉鎼滅储妗嗚緭鍏ラ潪绮惧噯鍏抽敭璇嶆椂璺宠浆 `/search?q=鍏抽敭璇峘銆?
- 棣栭〉鎼滅储妗嗚緭鍏ュ敮涓€绮惧噯鍖归厤鐨?published 宸ュ叿 slug 鎴栨爣棰樻椂锛岀洿鎺ヨ烦杞?`/tools/[slug]`銆?
- 棣栭〉鎼滅储妗嗚緭鍏ュ敮涓€绮惧噯鍖归厤鐨?published 鏂囩珷 slug 鎴栨爣棰樻椂锛岀洿鎺ヨ烦杞?`/articles/[slug]`銆?
- 鍚岀被鍐呭鍖归厤鏃跺厛鍒ゆ柇 slug 瀹屽叏鍖归厤锛屽啀鍒ゆ柇鏍囬瀹屽叏鍖归厤銆?
- 宸ュ叿鍜屾枃绔犲悓鏃剁簿鍑嗗尮閰嶆椂浼樺厛璺宠浆宸ュ叿璇︽儏銆?
- 澶氫釜宸ュ叿鎴栧涓枃绔犲尮閰嶆椂涓嶇洿鎺ヨ繘鍏ヨ鎯呴〉锛屽洖閫€鍒?`/search?q=鍏抽敭璇峘銆?
- 鐑棬鍏抽敭璇嶆寜閽繚鎸佹ā绯婃悳绱㈤€昏緫锛岀粺涓€璺宠浆 `/search?q=鍏抽敭璇峘锛屼笉鍋氱簿鍑嗙洿杈俱€?
- 鏈慨鏀瑰悗鍙般€佹暟鎹簱缁撴瀯銆丼upabase RLS銆佸伐鍏疯鎯呴〉銆佹枃绔犺鎯呴〉鍜屾悳绱㈢粨鏋滈〉鏍峰紡銆?
- 宸茶繍琛?`npm run lint`锛岄€氳繃銆?
- 宸茶繍琛?`npm run build`锛岄€氳繃銆?
- 宸查噸鍚?`npm run dev -- -p 3000`锛屽苟纭棣栭〉杩斿洖 200銆?
- 宸茬敤褰撳墠 Supabase published 鏁版嵁鏍￠獙鍖归厤閫昏緫锛歚published-test-tool` 鍜?`Published Test Tool` 浼氳烦杞伐鍏疯鎯咃紝`published` 浼氳烦杞悳绱㈤〉锛岀┖鍏抽敭璇嶄細璺宠浆 `/search`銆?

涓嬩竴姝ワ細

- 鍦ㄦ祻瑙堝櫒涓粠棣栭〉鎵嬪姩娴嬭瘯瀹屾暣 slug銆佸畬鏁存爣棰樸€佹ā绯婂叧閿瘝鍜岀┖鍏抽敭璇嶅洓绉嶆悳绱㈣矾寰勩€?

## 2026-06-05

浠诲姟锛氭坊鍔犲熀纭€ SEO銆乻itemap銆乺obots 鍜屼笂绾垮墠妫€鏌ャ€?

鏀瑰姩鏂囦欢锛?
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/tools/page.tsx`
- `src/app/tools/[slug]/page.tsx`
- `src/app/articles/page.tsx`
- `src/app/articles/[slug]/page.tsx`
- `src/app/search/page.tsx`
- `src/app/submit/page.tsx`
- `src/app/submit/submit-client.tsx`
- `src/app/copyright/page.tsx`
- `src/app/copyright/copyright-client.tsx`
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/lib/seo.ts`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DESIGN_SYSTEM.md`銆乣docs/DATABASE_SCHEMA.md`銆乣docs/ADMIN_RULES.md`銆乣docs/CONTENT_RULES.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- 宸插湪 `src/lib/seo.ts` 缁熶竴绔欑偣鍚嶇О銆侀粯璁ゆ弿杩般€佸叧閿瘝銆佺珯鐐?URL銆乧anonical銆丱pen Graph 鍜?Twitter Card 鍩虹鐢熸垚閫昏緫銆?
- 鍏ㄧ珯榛樿 metadata 宸插湪 `src/app/layout.tsx` 涓畬鍠勶紝鏍囬妯℃澘涓?`%s锝滅煡浜玚銆?
- `NEXT_PUBLIC_SITE_URL` 鐢ㄤ簬鐢熸垚姝ｅ紡绔欑偣 URL锛涚己澶辨椂 fallback 鍒版湰鍦板紑鍙戝湴鍧€ `http://localhost:3000`銆?
- 棣栭〉銆佸伐鍏峰簱銆佸伐鍏疯鎯呫€佹枃绔犲垪琛ㄣ€佹枃绔犺鎯呫€佹悳绱㈤〉銆佹姇绋块〉銆佺増鏉冨弽棣堥〉宸叉坊鍔犻〉闈㈢骇 metadata銆?
- `/tools/[slug]` 鍔ㄦ€?metadata 鍙鍙?published 宸ュ叿锛涙壘涓嶅埌鎴栬鍙栧け璐ユ椂浣跨敤鈥滃伐鍏锋湭鎵惧埌鈥濆厹搴曘€?
- `/articles/[slug]` 鍔ㄦ€?metadata 鍙鍙?published 鏂囩珷锛涙壘涓嶅埌鎴栬鍙栧け璐ユ椂浣跨敤鈥滄枃绔犳湭鎵惧埌鈥濆厹搴曘€?
- `/submit` 涓?`/copyright` 鍘熸湰鏄?Client Component锛屽凡灏嗚〃鍗曚氦浜掍唬鐮佹媶鍒板悓鐩綍 client 鏂囦欢锛屽師 `page.tsx` 鍙礋璐?metadata 鍜岄〉闈㈡覆鏌撳叆鍙ｏ紝琛ㄥ崟瑙嗚鍜屽啓鍏ラ€昏緫涓嶅彉銆?
- 宸叉柊澧?`src/app/sitemap.ts`锛屽寘鍚椤点€佸伐鍏峰簱銆佹枃绔犮€佹悳绱€佹姇绋裤€佺増鏉冨弽棣堬紝浠ュ強 published 宸ュ叿璇︽儏椤靛拰 published 鏂囩珷璇︽儏椤点€?
- sitemap 鏌ヨ澶辫触鏃惰繑鍥炲熀纭€椤甸潰 sitemap锛屼笉璁╂瀯寤哄け璐ャ€?
- 宸叉柊澧?`src/app/robots.ts`锛屽厑璁稿墠鍙伴〉闈㈡姄鍙栵紝绂佹 `/admin`銆乣/admin/`銆乣/admin/*`锛屽苟鎸囧悜 `/sitemap.xml`銆?
- 鏈鏈慨鏀瑰悗鍙?CRUD銆佸悗鍙扮櫥褰曘€丼upabase 鏁版嵁搴撶粨鏋勩€丷LS 绛栫暐銆侀〉闈㈣瑙夊竷灞€銆佸箍鍛婃帴鍏ャ€佺粺璁′唬鐮佹垨澶嶆潅缁撴瀯鍖栨暟鎹€?
- 宸茶繍琛?`npm run lint`锛岄€氳繃銆?
- 宸茶繍琛?`npm run build`锛岄€氳繃锛涙瀯寤鸿緭鍑哄凡鍖呭惈 `/robots.txt` 鍜?`/sitemap.xml`銆?

涓婄嚎鐜鍙橀噺鎻愰啋锛?

- 蹇呴』閰嶇疆 `NEXT_PUBLIC_SUPABASE_URL`銆?
- 蹇呴』閰嶇疆 `NEXT_PUBLIC_SUPABASE_ANON_KEY`銆?
- 蹇呴』閰嶇疆 `NEXT_PUBLIC_SITE_URL`锛屼緥濡傛寮忓煙鍚?`https://your-domain.com`銆?
- 濡傛灉鍚庣画鍚庡彴鏈嶅姟绔换鍔￠渶瑕?`SUPABASE_SERVICE_ROLE_KEY`锛屽彧鑳芥斁鍦ㄦ湇鍔＄鐜鍙橀噺涓紝褰撳墠涓嶈鍦ㄥ墠鍙版毚闇叉垨鎵撳嵃銆?

涓嬩竴姝ワ細

- 閮ㄧ讲鍓嶅湪姝ｅ紡鍩熷悕妫€鏌?`/robots.txt`銆乣/sitemap.xml`銆侀椤垫簮鐮佷腑鐨?title/description/canonical锛屼互鍙婂伐鍏疯鎯呭拰鏂囩珷璇︽儏鐨勫姩鎬佹爣棰樸€?

## 2026-06-05

浠诲姟锛氭鏌ュ苟瀹屽杽绔欑偣 URL 閰嶇疆璇存槑銆?

鏀瑰姩鏂囦欢锛?
- `src/lib/seo.ts`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DESIGN_SYSTEM.md`銆乣docs/DATABASE_SCHEMA.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- 宸叉鏌?`src/app/sitemap.ts`锛岀‘璁?sitemap URL 缁熶竴閫氳繃 `getAbsoluteUrl()` 鐢熸垚銆?
- 宸叉鏌?`src/app/robots.ts`锛岀‘璁?robots 鐨?`host` 鍜?`sitemap` 缁熶竴閫氳繃 `getSiteUrl()` / `getAbsoluteUrl()` 鐢熸垚銆?
- 宸叉鏌?`src/lib/seo.ts`锛岀‘璁ょ珯鐐?URL 缁熶竴璇诲彇 `NEXT_PUBLIC_SITE_URL`銆?
- 宸插皢 `NEXT_PUBLIC_SITE_URL` 缂哄け鏃剁殑 fallback 浠?`https://example.com` 鏀逛负 `http://localhost:3000`锛岄伩鍏嶄笂绾垮墠蹇樿鏇挎崲 example.com銆?
- 鏈啓姝绘寮忓煙鍚嶃€?
- 鏈慨鏀瑰悗鍙般€佹暟鎹簱銆佷笟鍔″姛鑳芥垨椤甸潰瑙嗚銆?

鐜鍙橀噺鎻愰啋锛?

- 鏈湴 `.env.local` 闇€瑕侀厤缃細`NEXT_PUBLIC_SITE_URL=http://localhost:3000`銆?
- Vercel 鐢熶骇鐜闇€瑕侀厤缃細`NEXT_PUBLIC_SITE_URL=姝ｅ紡鍩熷悕`锛屼緥濡?`https://your-domain.com`銆?
- `NEXT_PUBLIC_SUPABASE_URL` 鍜?`NEXT_PUBLIC_SUPABASE_ANON_KEY` 浠嶉渶鎸?Supabase 椤圭洰閰嶇疆銆?

涓嬩竴姝ワ細

- 淇敼鎴栨柊澧炵幆澧冨彉閲忓悗閲嶅惎寮€鍙戞湇鍔★紝鍐嶆鏌?`/robots.txt` 鍜?`/sitemap.xml` 鏄惁杈撳嚭鏈熸湜鍩熷悕銆?

## 2026-06-05

浠诲姟锛歏ercel 閮ㄧ讲鍓嶆鏌ヤ笌涓婄嚎鍑嗗銆?

鏀瑰姩鏂囦欢锛?
- `.gitignore`
- `docs/DEPLOYMENT.md`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DESIGN_SYSTEM.md`銆乣docs/DATABASE_SCHEMA.md`銆乣docs/ADMIN_RULES.md`銆乣docs/CONTENT_RULES.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- 宸叉鏌?`package.json`锛屽綋鍓嶈剼鏈寘鍚?`dev`銆乣build`銆乣start`銆乣lint`锛屾棤闇€淇敼銆?
- 宸叉鏌?`next.config.ts`锛屽綋鍓嶆病鏈夊奖鍝?Vercel 閮ㄧ讲鐨勭壒娈婇厤缃紝鏆備笉淇敼銆?
- 宸叉鏌?`src/app/sitemap.ts`锛岀‘璁ら€氳繃 `getAbsoluteUrl()` 浣跨敤 `NEXT_PUBLIC_SITE_URL`锛屽苟鍙鍙?published 宸ュ叿鍜?published 鏂囩珷銆?
- 宸叉鏌?`src/app/robots.ts`锛岀‘璁ら€氳繃 `getSiteUrl()` / `getAbsoluteUrl()` 浣跨敤 `NEXT_PUBLIC_SITE_URL`锛屽苟绂佹 `/admin`銆乣/admin/`銆乣/admin/*`銆?
- 宸叉鏌?`src/lib/seo.ts`锛岀‘璁ゆ湭鍐欐姝ｅ紡鍩熷悕锛宍NEXT_PUBLIC_SITE_URL` 缂哄け鏃舵湰鍦?fallback 涓?`http://localhost:3000`銆?
- 宸叉鏌ョ幆澧冨彉閲忎娇鐢紝褰撳墠浠ｇ爜鍙娇鐢?`NEXT_PUBLIC_SUPABASE_URL`銆乣NEXT_PUBLIC_SUPABASE_ANON_KEY`銆乣NEXT_PUBLIC_SITE_URL`锛屾湭浣跨敤 `SUPABASE_SERVICE_ROLE_KEY`銆?
- 宸茶ˉ鍏?`.gitignore`锛屾柊澧?`.env.*.local`锛屽苟纭宸插寘鍚?`.env`銆乣.env.local`銆乣.next`銆乣node_modules`銆?
- 宸插垱寤?`docs/DEPLOYMENT.md`锛岃褰?Vercel 閮ㄧ讲姝ラ銆佺幆澧冨彉閲忋€丼upabase 琛ㄦ鏌ャ€丷LS 妫€鏌ャ€佸悗鍙扮鐞嗗憳鍒涘缓銆乺obots/sitemap 妫€鏌ュ拰涓婄嚎鍚庨獙鏀舵竻鍗曘€?
- 褰撳墠椤圭洰娌℃湁 `README.md`锛屾湰娆℃湭鏂板 README锛岄儴缃茶鏄庨泦涓斁鍦?`docs/DEPLOYMENT.md`銆?
- 宸茶繍琛?`npm run build`锛岄€氳繃銆?
- 鏋勫缓杈撳嚭宸插寘鍚?`/robots.txt` 鍜?`/sitemap.xml`銆?
- 鏋勫缓鏃ュ織涓粛鍑虹幇涓€鏉℃棦鏈?Supabase 鐩稿叧鎺ㄨ崘鏌ヨ鏃ュ織锛歚fetch related tools: 鏈垎绫籤锛屾湭瀵艰嚧鏋勫缓澶辫触锛涗笂绾垮墠鍙悗缁崟鐙竻鐞嗘湭鍒嗙被鐩稿叧鎺ㄨ崘鍙傛暟銆?

涓婄嚎鍓嶉闄╋細

- Vercel 鐢熶骇鐜蹇呴』閰嶇疆 `NEXT_PUBLIC_SITE_URL` 涓烘寮忓煙鍚嶏紝鍚﹀垯 robots銆乻itemap 鍜?canonical 浼氫娇鐢?fallback 鎴栨棫鍩熷悕銆?
- Supabase RLS 蹇呴』鍏佽鍓嶅彴鍖垮悕璇诲彇 published 鍐呭銆佸尶鍚嶅啓鍏ユ姇绋垮拰鎶曡瘔锛屽苟鍏佽 authenticated 绠＄悊鍚庡彴鏁版嵁銆?
- Supabase Authentication 闇€瑕佸厛鍒涘缓绠＄悊鍛樼敤鎴凤紝鍚﹀垯鍚庡彴鏃犳硶鐧诲綍銆?

涓嬩竴姝ワ細

- 鎶婁唬鐮佹彁浜ゅ埌 GitHub 鍚庯紝鎸?`docs/DEPLOYMENT.md` 鐨勬楠ゅ鍏?Vercel锛屽苟閰嶇疆鐢熶骇鐜鍙橀噺銆?

## 2026-06-05

浠诲姟锛氫笂绾垮悗瀹夊叏鏀跺熬涓庢祴璇曟暟鎹竻鐞嗚褰曘€?

鏀瑰姩鏂囦欢锛?
- `docs/DEPLOYMENT.md`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DATABASE_SCHEMA.md`銆乣docs/ADMIN_RULES.md`銆乣docs/DEPLOYMENT.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- 宸茬‘璁ら」鐩凡閮ㄧ讲鍒扮嚎涓婂湴鍧€锛歚https://zhishare.vercel.app`銆?
- 宸查€氳繃 `git ls-files` 妫€鏌ワ紝`.env.local` 鏈 Git 璺熻釜銆?
- 宸查€氳繃 `git check-ignore` 妫€鏌ワ紝`.env.local`銆乣.env`銆乣.env.production.local` 鍧囪 `.gitignore` 蹇界暐銆?
- 宸叉壂鎻?`src`銆乣package.json`銆乣next.config.ts`锛屾湭鍙戠幇 `SUPABASE_SERVICE_ROLE_KEY` 鎴?`service_role` 纭紪鐮併€?
- 宸叉鏌ョ嚎涓?`https://zhishare.vercel.app/robots.txt`锛岀‘璁ょ姝?`/admin`銆乣/admin/`銆乣/admin/*`銆?
- 宸叉鏌ョ嚎涓?`robots.txt` 鎸囧悜 `https://zhishare.vercel.app/sitemap.xml`銆?
- 宸叉鏌ョ嚎涓?`https://zhishare.vercel.app/sitemap.xml`锛岀‘璁や娇鐢ㄧ嚎涓婂煙鍚嶃€?
- 宸叉鏌ョ嚎涓?sitemap锛屽綋鍓嶆湭鍙戠幇 `published-test-tool`銆乣draft-test-tool`銆乣published-test-article`銆乣draft-test-article`銆?
- 宸插湪 `docs/DEPLOYMENT.md` 琛ュ厖 Vercel 鐜鍙橀噺澶嶆煡璇存槑锛氬綋鍓嶇増鏈彧闇€瑕?`NEXT_PUBLIC_SUPABASE_URL`銆乣NEXT_PUBLIC_SUPABASE_ANON_KEY`銆乣NEXT_PUBLIC_SITE_URL`銆?
- 宸插湪 `docs/DEPLOYMENT.md` 璁板綍褰撳墠鐗堟湰涓嶉渶瑕?`SUPABASE_SERVICE_ROLE_KEY`锛屽鏇炬坊鍔犱笉蹇呰 secret key锛屽缓璁垹闄ゅ苟杞崲鐩稿叧 key銆?
- 宸插湪 `docs/DEPLOYMENT.md` 璁板綍寤鸿杞崲 Supabase `service_role` key 鎴栦换浣曟浘缁忔毚闇插湪涓存椂浣嶇疆鐨?secret key銆?
- 宸插湪 `docs/DEPLOYMENT.md` 璁板綍娴嬭瘯鏁版嵁娓呯悊椤瑰拰鍚庡彴鍒犻櫎璺緞銆?
- 褰撳墠娌℃湁 `README.md`锛屾湰娆℃湭淇敼 README銆?
- 鏈鏈慨鏀瑰墠鍙伴〉闈€佸悗鍙?CRUD銆佹暟鎹簱缁撴瀯銆丷LS 绛栫暐銆佽瑙夎璁℃垨渚濊禆銆?

娴嬭瘯鏁版嵁娓呯悊鎻愰啋锛?

- 閫氳繃 `/admin/tools` 鍒犻櫎 `published-test-tool` 鍜?`draft-test-tool`銆?
- 閫氳繃 `/admin/articles` 鍒犻櫎 `published-test-article` 鍜?`draft-test-article`銆?
- 鍒犻櫎鍚庨噸鏂版鏌?`https://zhishare.vercel.app/sitemap.xml`锛岀‘璁や笉鍐嶅寘鍚祴璇?slug銆?

涓嬩竴姝ワ細

- 鍦?Vercel 椤圭洰璁剧疆涓汉宸ュ鏌ョ幆澧冨彉閲忥紝纭娌℃湁澶氫綑 secret锛涚劧鍚庡畬鎴愬悗鍙版祴璇曟暟鎹竻鐞嗗拰涓€娆″畬鏁寸嚎涓婂啋鐑熸祴璇曘€?

## 2026-06-05

浠诲姟锛氭帴鍏?Cloudflare Turnstile 浜烘満楠岃瘉銆?

鏀瑰姩鏂囦欢锛?
- `src/app/api/turnstile/verify/route.ts`
- `src/app/admin/login/page.tsx`
- `src/app/submit/submit-client.tsx`
- `src/app/copyright/copyright-client.tsx`
- `src/components/security/TurnstileWidget.tsx`
- `src/lib/security/turnstile.ts`
- `src/lib/security/turnstile-client.ts`
- `docs/DEPLOYMENT.md`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DATABASE_SCHEMA.md`銆乣docs/ADMIN_RULES.md`銆乣docs/DEPLOYMENT.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- 宸叉柊澧炴湇鍔＄ API锛歚/api/turnstile/verify`銆?
- 鏈嶅姟绔獙璇侀€氳繃 `TURNSTILE_SECRET_KEY` 璋冪敤 Cloudflare Turnstile siteverify 鎺ュ彛銆?
- `TURNSTILE_SECRET_KEY` 鍙湪鏈嶅姟绔鍙栵紝鏈毚闇插埌鍓嶇銆?
- 宸叉柊澧炲墠绔?Turnstile 缁勪欢锛屼娇鐢?`NEXT_PUBLIC_TURNSTILE_SITE_KEY` 娓叉煋 Widget銆?
- `/submit` 鎻愪氦鍓嶅繀椤诲畬鎴愪汉鏈洪獙璇侊紱鏈獙璇佹彁绀衡€滆鍏堝畬鎴愪汉鏈洪獙璇併€傗€濄€?
- `/copyright` 鎻愪氦鍓嶅繀椤诲畬鎴愪汉鏈洪獙璇侊紱鏈獙璇佹彁绀衡€滆鍏堝畬鎴愪汉鏈洪獙璇併€傗€濄€?
- `/admin/login` 鐧诲綍鍓嶅繀椤诲畬鎴愪汉鏈洪獙璇侊紱鏈獙璇佹彁绀衡€滆鍏堝畬鎴愪汉鏈洪獙璇併€傗€濄€?
- Turnstile 鏈嶅姟绔獙璇佸け璐ユ椂缁熶竴鎻愮ず鈥滀汉鏈洪獙璇佸け璐ワ紝璇峰埛鏂板悗閲嶈瘯銆傗€濄€?
- 楠岃瘉鎴愬姛鍚庢墠缁х画鍘熸潵鐨?Supabase 鎶曠鍐欏叆銆佺増鏉冩姇璇夊啓鍏ユ垨鍚庡彴鐧诲綍閫昏緫銆?
- 淇濈暀鍘熸湁 loading銆佹垚鍔熸彁绀哄拰澶辫触鎻愮ず銆?
- 鏈慨鏀瑰伐鍏烽〉銆佹枃绔犻〉銆佹悳绱㈤〉銆佸悗鍙?CRUD銆佹暟鎹簱缁撴瀯銆丷LS 绛栫暐鎴栬瑙夎璁°€?
- 宸叉洿鏂?`docs/DEPLOYMENT.md`锛岃褰?`NEXT_PUBLIC_TURNSTILE_SITE_KEY` 鍜?`TURNSTILE_SECRET_KEY` 鐨勬湰鍦?Vercel 閰嶇疆鏂瑰紡锛屼互鍙婁笂绾垮悗妫€鏌ユ柟娉曘€?
- 宸茶繍琛?`npm run lint`锛岄€氳繃銆?
- 宸茶繍琛?`npm run build`锛岄€氳繃锛涙瀯寤鸿緭鍑哄寘鍚?`/api/turnstile/verify`銆?

涓嬩竴姝ワ細

- 閮ㄧ讲鍒?Vercel 鍚庯紝鍦ㄧ嚎涓婂垎鍒祴璇?`/submit`銆乣/copyright`銆乣/admin/login`锛氭湭楠岃瘉鏃跺簲闃绘鎻愪氦锛岄獙璇侀€氳繃鍚庡簲缁х画鍘熸湁鍐欏叆鎴栫櫥褰曟祦绋嬨€?

## 2026-06-05

浠诲姟锛氫慨澶嶅苟澶嶆煡 Cloudflare Turnstile 鐪熷疄鎺ュ叆銆?

鏀瑰姩鏂囦欢锛?
- `src/app/admin/login/page.tsx`
- `src/app/submit/submit-client.tsx`
- `src/app/copyright/copyright-client.tsx`
- `src/components/security/TurnstileWidget.tsx`
- `docs/DEPLOYMENT.md`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DATABASE_SCHEMA.md`銆乣docs/DEPLOYMENT.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- 宸茬‘璁?`/submit`銆乣/copyright`銆乣/admin/login` 椤甸潰鎻愪氦鍓嶅潎妫€鏌?Turnstile token銆?
- 宸茬‘璁ゆ病鏈?token 鏃堕〉闈㈡彁绀?`璇峰厛瀹屾垚浜烘満楠岃瘉銆俙锛屼笉浼氱户缁皟鐢?Supabase 鍐欏叆鎴栫櫥褰曘€?
- 宸茬‘璁ゆ湁 token 鏃跺厛璋冪敤 `/api/turnstile/verify`锛屽彧鏈夐獙璇佹垚鍔熷悗鎵嶇户缁?`submissions`銆乣reports` 鎴?Supabase Auth 鐧诲綍璇锋眰銆?
- 宸茬‘璁?`TurnstileWidget` 浣跨敤 `NEXT_PUBLIC_TURNSTILE_SITE_KEY` 娓叉煋锛屽苟鍦ㄧ己灏戠珯鐐?key 鏃舵樉绀?`浜烘満楠岃瘉閰嶇疆缂哄け锛岃鑱旂郴绠＄悊鍛樸€俙銆?
- 宸茬‘璁ゆ湇鍔＄楠岃瘉鎺ュ彛浠嶄娇鐢?`TURNSTILE_SECRET_KEY`锛屼笉浼氭毚闇插埌鍓嶇銆?
- 宸叉鏌ョ嚎涓?`https://zhishare.vercel.app/submit` 褰撳墠鍔犺浇鐨?JS chunk锛氭湭鍖呭惈 `turnstile` 鍜?`/api/turnstile/verify`锛岃鏄庣嚎涓婂綋鍓嶄粛鏄湭鍖呭惈 Turnstile 鐨勬棫閮ㄧ讲鍖呮垨鏈€鏂颁唬鐮佸皻鏈儴缃叉垚鍔熴€?
- 宸叉洿鏂?`docs/DEPLOYMENT.md`锛岃ˉ鍏?Turnstile 鐨勭嚎涓?Network 妫€鏌ラ『搴忓拰鏃ч儴缃插寘鎺掓煡璇存槑銆?
- 宸茶繍琛?`npm run lint`锛岄€氳繃銆?
- 宸茶繍琛?`npm run build`锛岄€氳繃锛涙瀯寤鸿緭鍑哄寘鍚?`/api/turnstile/verify`銆?
- 宸插惎鍔ㄦ湰鍦?`http://localhost:3000` 鍋氳交閲忔鏌ワ紝`/submit` 杩斿洖 200锛岄〉闈㈣兘鏄剧ず浜烘満楠岃瘉鍖哄煙鎴栫己閰嶇疆鎻愮ず銆?
- 宸茬敤鏃犳晥 token 璇锋眰鏈湴 `/api/turnstile/verify`锛岃繑鍥?`{"success":false}`锛岀‘璁や笉浼氭斁琛屾棤鏁堥獙璇併€?

涓嬩竴姝ワ細

- 鎺ㄩ€佹渶鏂颁唬鐮佸苟閲嶆柊閮ㄧ讲 Vercel锛岀‘璁?Production 鐜鍚屾椂閰嶇疆 `NEXT_PUBLIC_TURNSTILE_SITE_KEY` 鍜?`TURNSTILE_SECRET_KEY`銆?
- 閲嶆柊閮ㄧ讲鍚庡湪绾夸笂娴嬭瘯 `/submit`銆乣/copyright`銆乣/admin/login`锛氶〉闈㈠簲鏄剧ず Turnstile锛孨etwork 涓簲鍏堝嚭鐜?`/api/turnstile/verify`锛岄獙璇佹垚鍔熷悗鎵嶅嚭鐜?Supabase 鍐欏叆鎴栫櫥褰曡姹傘€?

## 2026-06-05

浠诲姟锛氬己鍒惰ˉ寮?Cloudflare Turnstile 鎺ュ叆銆?

鏀瑰姩鏂囦欢锛?
- `src/app/api/turnstile/verify/route.ts`
- `src/components/security/TurnstileWidget.tsx`
- `src/app/admin/login/page.tsx`
- `src/app/submit/submit-client.tsx`
- `src/app/copyright/copyright-client.tsx`
- `docs/DEPLOYMENT.md`
- `docs/TASK_LOG.md`

妫€鏌ユ柟寮忥細

- 寮€鍙戝墠宸查槄璇?`docs/PROJECT_RULES.md`銆乣docs/DATABASE_SCHEMA.md`銆乣docs/DEPLOYMENT.md`銆乣docs/ANTI_ENTROPY.md`銆乣docs/TASK_LOG.md`銆?
- 宸插皢 `TurnstileWidget` 鐨勮剼鏈湴鍧€鍥哄畾涓?`https://challenges.cloudflare.com/turnstile/v0/api.js`銆?
- `TurnstileWidget` 鏂囦欢椤堕儴淇濈暀 `"use client";`銆?
- `TurnstileWidget` 浣跨敤 `NEXT_PUBLIC_TURNSTILE_SITE_KEY` 娓叉煋锛涚己灏?site key 鏃舵樉绀?`浜烘満楠岃瘉閰嶇疆缂哄け锛岃鑱旂郴绠＄悊鍛樸€俙锛屼笉浼氶潤榛樿烦杩囥€?
- `TurnstileWidget` 浣跨敤 `window.turnstile.render`锛屾覆鏌撳鍣ㄥ寘鍚?`cf-turnstile` class銆?
- `TurnstileWidget` 鍦ㄦ垚鍔?callback 鏃舵妸 token 浼犵粰鐖剁粍浠讹紝鍦?expired/error callback 鏃舵竻绌?token銆?
- 宸插皢 `/api/turnstile/verify` 鏀逛负鍦?route 鍐呯洿鎺ヨ鍙?`TURNSTILE_SECRET_KEY`銆佹帴鏀?`token`銆佷娇鐢?`FormData` 璋冪敤 Cloudflare `siteverify`銆?
- `/api/turnstile/verify` 鍦?token 缂哄け銆乻ecret 缂哄け銆丆loudflare 楠岃瘉澶辫触鏃堕兘杩斿洖 `{ success: false }`銆?
- `/api/turnstile/verify` 涓嶈緭鍑?`TURNSTILE_SECRET_KEY`銆?
- 宸茬‘璁?`/submit` 瀹為檯琛ㄥ崟閫昏緫鍦?`submit-client.tsx`锛屾彁浜ゆ椂鏃?token 浼氭彁绀?`璇峰厛瀹屾垚浜烘満楠岃瘉銆俙锛屾湁 token 鏃跺厛璋冪敤 `/api/turnstile/verify`锛屾垚鍔熷悗鎵嶈皟鐢?`createSubmission`銆?
- 宸茬‘璁?`/copyright` 瀹為檯琛ㄥ崟閫昏緫鍦?`copyright-client.tsx`锛屾彁浜ゆ椂鏃?token 浼氭彁绀?`璇峰厛瀹屾垚浜烘満楠岃瘉銆俙锛屾湁 token 鏃跺厛璋冪敤 `/api/turnstile/verify`锛屾垚鍔熷悗鎵嶈皟鐢?`createReport`銆?
- 宸茬‘璁?`/admin/login` 鐧诲綍鏃舵棤 token 浼氭彁绀?`璇峰厛瀹屾垚浜烘満楠岃瘉銆俙锛屾湁 token 鏃跺厛璋冪敤 `/api/turnstile/verify`锛屾垚鍔熷悗鎵嶈皟鐢?Supabase Auth 鐧诲綍銆?
- 楠岃瘉澶辫触鏂囨缁熶竴涓?`浜烘満楠岃瘉澶辫触锛岃鍒锋柊鍚庨噸璇曘€俙銆?
- 宸茶繍琛?`npm run lint`锛岄€氳繃銆?
- 宸茶繍琛?`npm run build`锛岄€氳繃锛涙瀯寤鸿緭鍑哄寘鍚?`/api/turnstile/verify`銆?
- 宸叉鏌?`.next` 鏋勫缓浜х墿锛岀‘璁ゅ寘鍚?`cf-turnstile`銆丆loudflare `api.js`銆乣/api/turnstile/verify` 鍜岄獙璇佹彁绀烘枃妗堛€?
- 宸插惎鍔ㄦ湰鍦板紑鍙戞湇鍔★紝鐢ㄦ棤鏁?token 璇锋眰 `http://localhost:3000/api/turnstile/verify`锛岃繑鍥?`{"success":false}`銆?

涓嬩竴姝ワ細

- 鎺ㄩ€佹渶鏂颁唬鐮佸苟閲嶆柊閮ㄧ讲 Vercel銆?
- 绾夸笂閲嶆柊娴嬭瘯 `/submit`銆乣/copyright`銆乣/admin/login`锛歂etwork 蹇呴』鍏堝嚭鐜?`/api/turnstile/verify`锛岄獙璇佹垚鍔熷悗鎵嶅嚭鐜?Supabase 鍐欏叆鎴栫櫥褰曡姹傘€?

## 2026-06-11 棣栨壒宸ュ叿鏍锋澘鍐呭鑽夌

### 鏈瀹屾垚

- 鏂板棣栨壒 5 涓伐鍏峰唴瀹硅崏绋匡細
  - ChatGPT
  - Canva
  - Photopea
  - Notion
  - Cursor
- 鑽夌缁熶竴鎸夌幇鏈夊悗鍙板伐鍏峰瓧娈电粍缁囥€?
- 姣忎釜鑽夌鍖呭惈锛?
  - 涓€鍙ヨ瘽缁撹
  - 宸ュ叿鎻忚堪
  - 閫傚悎鐢ㄦ埛
  - 浣跨敤鍦烘櫙
  - 浼樼偣
  - 缂虹偣
  - 椋庨櫓鎻愰啋
  - GEO 澶囨敞

### 鏈娌℃湁淇敼

- 娌℃湁淇敼鏁版嵁搴?schema銆?
- 娌℃湁鏂板 migration銆?
- 娌℃湁淇敼鍓嶅彴椤甸潰銆?
- 娌℃湁淇敼鍚庡彴琛ㄥ崟銆?
- 娌℃湁鍐欏叆 Supabase銆?
- 娌℃湁鎻愪氦 commit銆?

### 涓嬩竴姝?

瀹℃牳 5 涓伐鍏疯崏绋匡紝纭鍚庡啀鍐冲畾鏄惁褰曞叆鍚庡彴鎴栫户缁埗浣滄枃绔犳牱鏉裤€?

## 2026-06-09 鍐呭寤鸿瑙勮寖鏂囨。鍖?

### 鏈瀹屾垚

- 鏂板 `docs/content/` 鍐呭寤鸿鏂囨。鐩綍銆?
- 鏂板鍐呭瑙勫垯銆佸唴瀹规ā鏉裤€佸瓧娈垫槧灏勩€侀€夐姹犮€佸鏍告竻鍗曘€佸唴瀹逛换鍔℃棩蹇椼€?
- 鏄庣‘绗竴闃舵鍐呭寤鸿涓嶆墿鏁版嵁搴撱€?
- 鏄庣‘宸ュ叿椤典紭鍏堝鐢ㄧ幇鏈夊瓧娈碉細
  - `summary`
  - `description`
  - `target_users`
  - `use_cases`
  - `pros`
  - `cons`
  - `risk_notice`
- 鏄庣‘褰撳墠涓嶅仛璇勮銆佺偣璧炪€佽浆鍙戙€侀殢鏈烘暟鎹敓鎴愮瓑浜掑姩鍔熻兘銆?

### 鏈娌℃湁淇敼

- 娌℃湁淇敼鍓嶅彴椤甸潰銆?
- 娌℃湁淇敼鍚庡彴琛ㄥ崟銆?
- 娌℃湁淇敼 Supabase schema銆?
- 娌℃湁鏂板 SQL migration銆?
- 娌℃湁鐢熸垚鐪熷疄宸ュ叿鍐呭銆?

### 涓嬩竴姝?

寮€濮嬪埗浣?5 涓伐鍏锋牱鏉垮唴瀹癸紝骞舵牴鎹幇鏈夊悗鍙板瓧娈靛啓鍏ャ€?

## 2026-06-11 棣栨壒宸ュ叿鏍锋澘褰曞叆 Supabase

### 鏈瀹屾垚

- 灏嗛鎵?5 涓伐鍏锋牱鏉垮唴瀹瑰綍鍏?Supabase `tools` 琛細
  - ChatGPT
  - Canva
  - Photopea
  - Notion
  - Cursor
- 浣跨敤 `slug` 浣滀负鍐茬獊閿墽琛?upsert锛岄伩鍏嶉噸澶嶆彃鍏ャ€?
- 鑴氭湰宸叉寜鐪熷疄鏁版嵁搴撳瓧娈佃嚜鍔ㄨ繃婊ゅ啓鍏ュ瓧娈点€?
- 宸茬‘璁ょ湡瀹炴暟鎹簱缂哄皯锛?
  - `tools.name`
  - `categories.status`

### 鏈娌℃湁淇敼

- 娌℃湁淇敼鏁版嵁搴?schema銆?
- 娌℃湁鏂板 migration銆?
- 娌℃湁鏂板缂哄け瀛楁銆?
- 娌℃湁淇敼鍓嶅彴椤甸潰銆?
- 娌℃湁淇敼鍚庡彴琛ㄥ崟銆?
- 娌℃湁鏂板浜掑姩鍔熻兘銆?
- 娌℃湁鎻愪氦 commit銆?
- 娌℃湁 push銆?

### 涓嬩竴姝?

鍦ㄥ悗鍙版鏌?5 涓伐鍏峰唴瀹癸紝濡傛灉鏄剧ず姝ｅ父锛屽啀灏嗗鏍搁€氳繃鐨勫伐鍏锋敼涓?`published`銆?

## 2026-06-11 棣栨壒宸ュ叿鍙戝竷

### 鏈瀹屾垚

- 灏嗛鎵?5 涓伐鍏蜂粠 `draft` 鍙戝竷涓?`published`锛?
  - Canva
  - ChatGPT
  - Cursor
  - Notion
  - Photopea
- 宸茬‘璁?5 鏉″伐鍏峰潎鍦?Supabase `tools` 琛ㄤ腑銆?
- 宸茬‘璁?5 鏉″伐鍏风姸鎬佸潎涓?`published`銆?

### 鏈娌℃湁淇敼

- 娌℃湁淇敼鏁版嵁搴?schema銆?
- 娌℃湁鏂板 migration銆?
- 娌℃湁淇敼椤甸潰浠ｇ爜銆?
- 娌℃湁淇敼鍚庡彴琛ㄥ崟銆?
- 娌℃湁淇敼宸ュ叿姝ｆ枃鍐呭銆?
- 娌℃湁鏂板浜掑姩鍔熻兘銆?
- 娌℃湁鎻愪氦 commit銆?
- 娌℃湁 push銆?

### 涓嬩竴姝?

妫€鏌ュ墠鍙板伐鍏峰簱鍜?5 涓鎯呴〉灞曠ず鏁堟灉銆傜‘璁ゆ棤闂鍚庯紝鍐嶆彁浜ゅ唴瀹瑰缓璁炬枃妗ｅ彉鏇淬€?

## 2026-06-11 Phase 1 `download_url` rule update

### 本次完成

- Updated `docs/content/CONTENT_RULES.md` to require empty `download_url` values in phase 1.
- Updated `docs/content/CONTENT_TEMPLATES.md` with `website_url` and `download_url` writing rules.
- Updated `docs/content/CONTENT_REVIEW_CHECKLIST.md` so release checks now require `download_url` to stay empty.
- Updated `docs/content/CONTENT_DATA_MAP.md` to mark `download_url` as present-but-unused for real links in phase 1.
- Checked `docs/content/tool-drafts` and confirmed the first 5 tool drafts do not contain real netdisk or third-party download links.
- Ran a temporary Supabase cleanup script to set `download_url = null` for `canva`, `chatgpt`, `cursor`, `notion`, and `photopea`.
- Removed the temporary `.tmp` cleanup script after execution.

### 本次没有修改

- No database schema changes.
- No migrations.
- No frontend page code changes.
- No admin form logic changes.

### 结果

- Phase 1 keeps `download_url` empty across tool content.
- Official access continues to use `website_url` only.

## 2026-06-11 首批工具前台展示验收

### 本次任务

检查首批 5 个工具在前台工具库和详情页的显示效果。

### 检查页面

- `/tools`
- `/tools/canva`
- `/tools/chatgpt`
- `/tools/cursor`
- `/tools/notion`
- `/tools/photopea`

### 检查内容

- 页面可访问性
- 工具标题
- 工具摘要
- 工具描述
- 适合人群
- 使用场景
- 优点
- 缺点
- 风险提醒
- 官网按钮
- 网盘下载按钮空值状态
- 乱码、undefined、null、空模块问题

### 结论

- `/tools` 可以看到首批 5 个工具，但当前总数为 7。
- 5 个详情页都能访问，返回状态正常。
- 官网按钮可用，空值 `download_url` 对应的“网盘下载”按钮为灰置禁用状态，不会直接跳转。
- 5 个新工具都显示为“未分类”。
- 详情页存在明显中文乱码，主要集中在部分模块标题和辅助文案。
- 未发现 `null` 直接渲染到页面主体。
- 页面源码包含 `undefined`，但本次未发现其以用户可见文本直接出现在页面主体。
- 多行列表内容整体仍可读，移动端模块顺序正常。

### 本次没有修改

- 没有修改页面代码。
- 没有修改数据库 schema。
- 没有修改后台表单。
- 没有修改 Supabase 数据。
- 没有新增功能。
- 没有提交 commit。
- 没有 push。

## 2026-06-11 修复工具详情页静态中文乱码

### 本次完成

- 修复工具详情页前台代码中的静态中文乱码。
- 修复模块标题、按钮文案、空状态和提示文案。
- 保持网盘下载链接为空的内容规则不变。
- 构建通过。
- dev 页面复验通过。

### 本次没有修改

- 没有修改 Supabase 数据。
- 没有修改数据库 schema。
- 没有新增 migration。
- 没有修改后台表单。
- 没有新增互动功能。
- 没有提交 commit。
- 没有 push。

### 下一步

最终收尾检查，确认无问题后提交并 push。

## 2026-06-11 首批工具数据修复

### 本次完成

- 修复首批 5 个工具前台验收问题中的数据层部分。
- 将非首批 5 个 published 工具改回 `draft`，不删除数据。
- 为首批 5 个工具绑定正确分类。
- 重写首批 5 个工具中文内容，修复数据库正文中的乱码问题。
- 确认 `download_url` 为空。
- 确认首批 5 个工具均为 `published`。
- 重新验收后确认：
  - `/tools` 现在只显示首批 5 个工具。
  - 5 个工具不再显示“未分类”。

### 当前仍存在的问题

- `npm run build` 日志仍显示旧的 published 数量与 slug：
  - `getPublishedTools count: 3 slugs: open-design,raycast,chatgpt`
- dev 页面与直接 anon 查询都已显示 5 个工具：
  - `canva,chatgpt,cursor,notion,photopea`
- 工具详情页仍有静态中文乱码，说明剩余问题不在这 5 个工具的数据库正文数据中。

### 本次没有修改

- 没有修改数据库 schema。
- 没有新增 migration。
- 没有修改页面代码。
- 没有修改后台表单。
- 没有新增互动功能。
- 没有提交 commit。
- 没有 push。

### 下一步

优先排查前台代码中的静态乱码文本，以及 `npm run build` 阶段为什么仍读取到旧的 3 条 published 工具。

## 2026-06-11 修复 build 阶段工具数据读取路径

### 本次任务

修复 `npm run build` 阶段读取旧工具数据的问题。

### 问题表现

- Supabase anon 查询返回当前 5 个 published 工具。
- dev 页面显示当前 5 个工具。
- build 阶段曾显示旧 slug：
  - `open-design`
  - `raycast`
  - `chatgpt`

### 修复内容

- 旧数据来源：
  - `open-design` / `raycast` 的 mock 数据来源文件仍是 `src/data/mock-tools.ts`
  - 本次 build 异常的直接来源是本地 `.next` 残留的旧构建缓存，不是 `getPublishedTools()` 的运行时 mock fallback
- 修改文件：
  - `package.json`
  - `src/lib/db/tools.ts`
- 修复方式：
  - 为 `npm run build` 增加 `prebuild`，构建前自动清理 `.next`
  - 为 `getPublishedTools()` 增加数据来源日志：
    - `getPublishedTools source: supabase`
    - `getPublishedTools source: mock fallback`

### 修复后结果

- build 阶段不再读取旧工具数据。
- build 阶段工具数量与 dev 页面一致。
- 当前 5 个工具仍可正常访问。
- 构建通过。
- 详情页静态中文乱码仍存在，但这不是本次 build 数据路径问题。

### 本次没有修改

- 没有修改 Supabase 数据。
- 没有修改数据库 schema。
- 没有新增 migration。
- 没有修改工具正文内容。
- 没有新增互动功能。
- 没有提交 commit。
- 没有 push。
## 2026-06-11 修复工具详情页列表排版错误

### 本次完成

- 修复工具详情页列表字段解析问题。
- 适合人群、使用场景、优点、缺点不再按字符拆分。
- 修复列表项 key 重复风险。
- 页面高度恢复正常。
- 构建通过。
- dev 页面复验通过。

### 本次没有修改

- 没有修改 Supabase 数据。
- 没有修改数据库 schema。
- 没有新增 migration。
- 没有修改后台表单。
- 没有新增互动功能。
- 没有提交 commit。
- 没有 push。

### 下一步

继续检查并修复工具详情页静态中文乱码，确认无问题后进入最终提交。

## 2026-06-11 优化工具详情页内容卡片密度

### 本次完成

- 压缩工具详情页桌面端内容卡片间距。
- 适合人群、使用场景、优点、缺点模块更紧凑。
- 页面纵向长度缩短。
- 列表内容仍正常显示。
- 构建通过。
- dev 页面复验通过。

### 本次没有修改

- 没有修改 Supabase 数据。
- 没有修改数据库 schema。
- 没有新增 migration。
- 没有修改后台表单。
- 没有新增互动功能。
- 没有提交 commit。
- 没有 push。

### 下一步

继续检查详情页静态中文乱码和最终收尾。

## 2026-06-11 内容建设第一阶段最终验收

### 本次完成

- 完成首批 5 个工具的前台最终验收。
- 修复 build 阶段旧数据缓存问题。
- 修复工具详情页列表字段排版问题。
- 修复工具详情页静态中文乱码。
- 优化工具详情页内容卡片密度。
- 确认 `download_url` 第一阶段保持为空。
- 确认 `/tools` 只显示首批 5 个工具：
  - Canva
  - ChatGPT
  - Cursor
  - Notion
  - Photopea

### 验收结果

- `npm run build` 通过。
- build 阶段读取当前 5 个 Supabase published 工具。
- dev 页面显示当前 5 个工具。
- 5 个详情页均正常访问。
- 分类正常。
- 列表显示正常。
- 乱码检查通过。
- `.env.local` 未进入 git。
- `.tmp` 已清理。

### 本次没有修改

- 没有修改数据库 schema。
- 没有新增 migration。
- 没有修改后台表单。
- 没有新增互动功能。

### 下一步

提交并 push，触发 Vercel 部署。

## 2026-06-12 第四阶段工具列表页优化规划

### 本次完成

- 制定第四阶段 `/tools` 工具列表页优化规划。
- 明确工具数量扩展到 10 个后，需要提升信息密度、筛选体验和移动端浏览体验。
- 明确后续代码改造优先级：移动端密度、卡片信息重组、搜索与分类筛选、桌面端网格微调。

### 新增文件

- `docs/content/TOOLS_LIST_OPTIMIZATION_PLAN.md`

### 本次没有修改

- 没有修改页面代码。
- 没有修改 Supabase 数据。
- 没有修改数据库 schema。
- 没有新增 migration。
- 没有修改后台表单。
- 没有新增互动功能。
- 没有 commit。
- 没有 push。

### 下一步

按规划执行 `/tools` 工具列表页第一轮代码优化。

## 2026-06-12 第四阶段工具列表页优化收尾

### 本次完成

- 完成 `/tools` 工具列表页第一轮优化验收。
- 优化移动端首屏信息密度。
- 收紧搜索与筛选区。
- 优化工具卡片信息结构。
- 提升移动端连续浏览体验。
- 确认 10 个工具详情页正常。

### 验收结果

- `npm run build` 通过。
- build 阶段工具数据为 10 个 published 工具。
- `/tools` 本地验收通过。
- 10 个工具详情页验收通过。
- 连续问号检查通过。
- `.env.local` 未进入 git。
- `.tmp` 已清理。

### 本次没有修改

- 没有修改 Supabase 数据。
- 没有修改数据库 schema。
- 没有新增 migration。
- 没有修改后台表单。
- 没有新增互动功能。
- 没有填写任何网盘链接。

### 下一步

提交并 push，触发 Vercel 部署。
## 2026-06-12 第二阶段文章样板草稿

### 本次完成

- 创建第二阶段首批 3 篇文章样板草稿：
  - 免费 AI 工具一定安全吗？我建议先看这 4 点
  - 使用网盘资源前要注意什么？
  - 我试了 5 个免费图片工具，最适合小白的不是功能最多那个

### 本次目的

为文章系统建立第一批 GEO 内容样板，延续“真实痛点 - 哪里坑 - 怎么选”的内容方向。

### 本次没有修改

- 没有写入 Supabase。
- 没有发布文章。
- 没有修改数据库 schema。
- 没有新增 migration。
- 没有修改页面代码。
- 没有修改后台表单。
- 没有新增互动功能。
- 没有 commit。
- 没有 push。

### 下一步

审核 3 篇文章草稿，确认后再录入文章系统。

## 2026-06-12 第二阶段文章样板录入

### 本次完成

- 将第二阶段 3 篇文章样板录入 Supabase `articles` 表。
- 将 3 篇新文章设置为 `published`。
- 将旧的 2 篇 `published` 文章改为 `draft`，未删除。
- `/articles` 进入第二阶段文章样板展示。

### 已发布文章

- 免费 AI 工具一定安全吗？我建议先看这 4 点
- 使用网盘资源前要注意什么？
- 我试了 5 个免费图片工具，最适合小白的不是功能最多那个

### 本次没有修改

- 没有删除旧文章。
- 没有修改数据库 schema。
- 没有新增 migration。
- 没有修改页面代码。
- 没有修改后台表单。
- 没有新增互动功能。
- 没有 commit。
- 没有 push。

### 下一步

验收 `/articles` 和 3 个文章详情页。确认正常后，再提交并 push。

## 2026-06-12 文章内容改写与详情页渲染优化

### 本次完成

- 将 3 篇文章草稿改写为更接近作者经验分享的表达。
- 优化文章详情页渲染方式，让正文更像连续阅读内容，而不是参数罗列。
- 保持 3 篇新文章为 `published`。
- 保持旧的 2 篇文章不删除，仅维持为非展示状态。

### 本次没有修改

- 没有修改 Supabase 数据结构。
- 没有新增 migration。
- 没有修改工具页面。
- 没有修改后台表单。
- 没有新增互动功能。
- 没有 commit。
- 没有 push。

### 验收结果

- `/articles` 仍可正常访问。
- 3 个详情页均可正常访问。
- 详情页正文已不再展示原始 Markdown 语法。
- 构建通过。

## 2026-06-12 移动端文章详情页设计规划

### 本次完成

- 根据移动端文章详情页截图，制定移动端阅读体验优化规划。
- 明确文章详情页移动端应转向沉浸阅读，而不是桌面组件缩小版。
- 明确正文、标题、广告、相关阅读和 Footer 的移动端优化方向。

### 新增文件

- `docs/content/ARTICLE_MOBILE_LAYOUT_PLAN.md`

### 本次没有修改

- 没有修改页面代码。
- 没有修改 Supabase 数据。
- 没有修改数据库 schema。
- 没有新增 migration。
- 没有修改后台表单。
- 没有新增互动功能。
- 没有 commit。
- 没有 push。

### 下一步

按规划执行移动端文章详情页第一轮代码优化，优先调整正文阅读区、广告数量和 Footer。

## 2026-06-12 移动端文章详情页第一轮优化

### 本次完成

- 按 `ARTICLE_MOBILE_LAYOUT_PLAN.md` 执行移动端文章详情页第一轮优化。
- 优化正文阅读区、字号、行高和小标题层级。
- 减少移动端广告打断。
- 轻量化移动端 Footer。
- 保持文章内容不变。

### 本次没有修改

- 没有修改 Supabase 数据。
- 没有修改文章内容。
- 没有修改数据库 schema。
- 没有新增 migration。
- 没有修改后台表单。
- 没有新增互动功能。
- 没有 commit。
- 没有 push。

### 下一步

人工检查移动端文章详情页截图，确认阅读体验后再进入最终提交。

## 2026-06-12 第三阶段首批工具草稿

### 本次完成

- 创建第三阶段首批 5 个工具草稿：
  - Figma
  - CapCut
  - remove.bg
  - TinyPNG
  - Obsidian

### 本次目的

继续扩充工具库内容，但仍采用小步推进方式：先写草稿，再审核，再录入 Supabase。

### 本次没有修改

- 没有写入 Supabase。
- 没有发布工具。
- 没有修改数据库 schema。
- 没有新增 migration。
- 没有修改页面代码。
- 没有修改后台表单。
- 没有新增互动功能。
- 没有填写任何 `download_url`。
- 没有 commit。
- 没有 push。

### 下一步

审核 5 个工具草稿。确认后再进入录入和发布流程。

## 2026-06-16

### 本次完成

- Added a Feishu Bitable export skeleton for the content pipeline.
- Added a normalized-to-Feishu field mapping document.
- Added `npm run content:feishu-export` for dry-run payload generation.

### 本次没有修改

- 没有接入真实飞书鉴权。
- 没有写入飞书多维表格。
- 没有修改数据库 schema。
- 没有修改页面代码。
- 没有修改后台表单。

## 2026-06-16 - Local screenshot white-page false alarm

Status: resolved

Context:

- Local Playwright screenshots for `/`, `/tools`, and `/articles` briefly showed a default white background / blue link appearance.
- Online pages returned 200 and contained warm editorial markers.
- A clean production server on port 3011 rendered the warm editorial design correctly.
- The existing 3001 process was an old `next start -p 3001` process.
- On the old 3001 process, the main CSS chunk returned 400 and stylesheet requests failed.
- After stopping the old 3001 process, rebuilding, and starting a fresh production server on 3001, screenshots returned to the expected warm editorial design.

Conclusion:

- The issue was not a source-code regression.
- The issue was not a missing `globals.css` import.
- The issue was not a broken capture script.
- The issue was a stale local `next start` process serving mismatched static assets after a new build.

Future rule:

- If screenshots show default white background / blue links, first check whether the target port is running an old process.
- Verify `_next/static/css/*` responses are 200 before assuming a visual regression.
- Prefer starting a clean production server on a fresh port or restarting the target port after `npm run build`.
- Keep using `BASE_URL` override for screenshot scripts when testing on a clean temporary port.
## 2026-06-16 - Seed tools CSV template v1 with real-writer GEO anchor

Status: completed

Summary:

- Added the real-writer / GEO content anchor for zhishare.
- Added the first structured tool content schema.
- Added a draft CSV for 30 seed tools.
- Added a manual review checklist for seed tools.
- Kept all entries in draft state.
- Kept all first-hand experience fields as pending real testing.
- Kept official URLs and uncertain pricing as pending manual verification.
- Did not pretend any tool was personally tested.
- Did not import content into Supabase.
- Did not modify frontend pages.
- Did not run real scraping or Feishu sync.

Files:

- docs/content/REAL_WRITER_GEO_ANCHOR.md
- docs/content/TOOL_CONTENT_SCHEMA.md
- docs/content/seed-tools-v1.csv
- docs/content/SEED_TOOLS_REVIEW_CHECKLIST.md
## 2026-06-16 - Seed articles CSV template v1 with real-writer GEO fields

Status: completed

Summary:

- Added the first structured article content schema.
- Added a real-writer article template for zhishare.
- Added a draft CSV for 10 seed article topics.
- Added a manual review checklist for seed articles.
- Kept all article entries in draft state.
- Kept all real test status fields as pending real testing.
- Did not pretend any article was personally tested.
- Did not write full articles.
- Did not import content into Supabase.
- Did not modify frontend pages.
- Did not run real scraping or Feishu sync.

Files:

- docs/content/ARTICLE_CONTENT_SCHEMA.md
- docs/content/ARTICLE_REAL_WRITER_TEMPLATE.md
- docs/content/seed-articles-v1.csv
- docs/content/SEED_ARTICLES_REVIEW_CHECKLIST.md
## 2026-06-16 - First article test plan for free AI tools safety

Status: completed

Summary:

- Added the first real-writer article test plan.
- Added an observation sheet for 5 candidate AI tools.
- Kept all observations in draft / pending-test state.
- Did not write the full article.
- Did not pretend any tool was tested.
- Did not import content into Supabase.
- Did not modify frontend pages.
- Did not run real scraping or Feishu sync.

Files:

- docs/content/article-tests/free-ai-tools-safety-test-plan.md
- docs/content/article-tests/free-ai-tools-safety-observation-sheet.csv

## 2026-06-16 - Source checklist for free AI tools safety article

Status: completed

Summary:

- Added an official source checklist for the first real-writer article.
- Added a CSV checklist covering 5 candidate AI tools and 7 source types per tool.
- Kept all source URLs as pending manual fill.
- Kept all verification statuses as pending.
- Did not invent official links.
- Did not write the full article.
- Did not import content into Supabase.
- Did not modify frontend pages.
- Did not run real scraping or Feishu sync.

Files:

- docs/content/article-tests/free-ai-tools-safety-source-checklist.md
- docs/content/article-tests/free-ai-tools-safety-source-checklist.csv
## 2026-06-17 - ahhhhfs rare resource rewrite candidate pool v1

Status: completed

Summary:

- Added a rare resource rewrite rule document for ahhhhfs-derived topic discovery.
- Added a CSV candidate pool with 15 uncommon resources.
- Added rewrite angles, article title drafts, social hooks, risk notes, and test tasks.
- Treated ahhhhfs only as a topic radar, not as a copy source.
- Marked all official source checks as pending.
- Marked all first-hand status fields as pending real testing.
- Excluded gray-area directions such as piracy, paywall bypass, watermark removal, face swap, and trial reset.
- Did not write full articles.
- Did not import content into Supabase.
- Did not modify frontend pages.
- Did not run real scraping or Feishu sync.

Files:

- docs/content/AHHHHFS_RARE_RESOURCE_REWRITE_RULES.md
- docs/content/ahhhhfs-rare-resources-v1.csv
- docs/content/AHHHHFS_RARE_RESOURCE_REVIEW_CHECKLIST.md

## 2026-06-17 - Privacy Filter rewrite test plan

Status: completed

Summary:

- Added the first Privacy Filter rewrite test plan for the new resource-testing track.
- Added a draft observation sheet covering PII redaction, secret redaction, context preservation, false positives, and local-processing checks.
- Added an official source checklist for homepage, repository, license, privacy policy, local-processing claims, terms, network behavior, and alternatives.
- Kept all observation rows in draft state.
- Kept all source-check rows in pending state.
- Did not pretend the tool was tested.
- Did not write the full article.
- Did not import content into Supabase.
- Did not modify frontend pages.
- Did not run real scraping or Feishu sync.

Files:

- docs/content/resource-tests/privacy-filter-test-plan.md
- docs/content/resource-tests/privacy-filter-observation-sheet.csv
- docs/content/resource-tests/privacy-filter-source-checklist.csv

## 2026-06-17 - Privacy Filter official source prefill

Status: completed

Summary:

- Prefilled the official source checklist for Privacy Filter with source candidates from the official homepage, GitHub repository, license, and model card.
- Added a separate notes file to distinguish official-page claims from the eventual local test findings.
- Kept every source row in needs_review state so the checklist does not pretend the tool was already tested.
- Kept network behavior and terms checks as follow-up items for real browser observation.
- Did not write the full article.
- Did not import content into Supabase.
- Did not modify frontend pages.
- Did not run real scraping or Feishu sync.

Files:

- docs/content/resource-tests/privacy-filter-source-checklist.csv
- docs/content/resource-tests/privacy-filter-official-source-notes.md
## 2026-06-17 - Privacy Filter first real observation

Status: completed

Summary:

- Ran the first real observation for Privacy Filter using only fictional test data.
- Updated the observation sheet with observed results.
- Updated the network behavior row in the source checklist.
- Added a test-run note document separating observed behavior from official claims.
- Did not use real customer data.
- Did not use real API keys.
- Did not write a final article.
- Did not import content into Supabase.
- Did not modify frontend pages.
- Did not run Feishu sync.

Files:

- docs/content/resource-tests/privacy-filter-observation-sheet.csv
- docs/content/resource-tests/privacy-filter-source-checklist.csv
- docs/content/resource-tests/privacy-filter-test-run-2026-06-17.md
## 2026-06-17 - Privacy Filter second observation

Status: completed

Summary:

- Ran a second observation for Privacy Filter using only fictional test data.
- Extended waiting time to check whether the model would finish loading and produce stable redaction output.
- Updated the observation sheet with second-pass findings.
- Added a second test-run note document.
- Kept conclusions cautious because this is still not a production privacy evaluation.
- Did not use real customer data.
- Did not use real API keys.
- Did not write a final article.
- Did not import content into Supabase.
- Did not modify frontend pages.
- Did not run Feishu sync.

Files:

- docs/content/resource-tests/privacy-filter-observation-sheet.csv
- docs/content/resource-tests/privacy-filter-test-run-2026-06-17-pass2.md

## 2026-06-17 - Privacy Filter first article draft

Status: completed

Summary:

- Added the first real-writer article draft for Privacy Filter.
- Wrote the draft around the actual observation that stable redaction output was not obtained.
- Clearly separated official claims from zhishare observations.
- Avoided recommendation language.
- Avoided absolute safety claims.
- Added social post drafts for X, Xiaohongshu, and short-video narration.
- Did not import content into Supabase.
- Did not modify frontend pages.
- Did not publish the article.

Files:

- docs/content/article-drafts/privacy-filter-ai-redaction-first-look.md
- docs/content/article-drafts/privacy-filter-social-posts-v1.md

## 2026-06-17 - Privacy Filter editorial review and publish candidate

Status: completed

Summary:

- Added an editorial review document for the first Privacy Filter article draft.
- Added a publish-candidate package with metadata, GEO summary, suitability, risks, and review status.
- Kept the article in review status instead of published.
- Preserved the boundary that stable redaction output was not obtained.
- Avoided recommendation language and absolute safety claims.
- Aligned the publish candidate category with the final review wording.
- Did not import content into Supabase.
- Did not modify frontend pages.
- Did not publish the article.

Files:

- docs/content/article-drafts/privacy-filter-editorial-review.md
- docs/content/article-drafts/privacy-filter-publish-candidate.md



## 2026-06-17 - DropLock rewrite test plan

Status: completed

Summary:

- Added the DropLock rewrite test plan as the second P0 ahhhhfs-derived rare resource.
- Created a fictional secret-sharing sample for testing temporary secret sharing behavior.
- Added an observation sheet covering secret creation, recipient opening, one-time or expiration behavior, deletion or revocation, and network/security boundary checks.
- Added a source checklist for official homepage, repository, license, encryption design, expiration policy, privacy policy, terms, network behavior, and alternatives.
- Kept all observations in draft / pending-test state.
- Did not use real API keys, passwords, tokens, or customer data.
- Did not pretend the resource was tested.
- Did not write the full article.
- Did not import content into Supabase.
- Did not modify frontend pages.
- Did not run real scraping or Feishu sync.

Files:

- docs/content/resource-tests/droplock-test-plan.md
- docs/content/resource-tests/droplock-observation-sheet.csv
- docs/content/resource-tests/droplock-source-checklist.csv

## 2026-06-18 - DropLock official source discovery

Status: completed

Summary:

- Confirmed the official DropLock homepage and GitHub repository as primary sources.
- Prefilled the DropLock source checklist with checked rows for the official homepage, repository, and encryption design, while keeping network behavior pending.
- Marked license, expiration policy, privacy policy, terms, and alternative-tools items as source_unverified because reliable official sources were not confirmed yet.
- Added official source notes to keep the distinction clear between verified official sources and remaining manual checks.
- Kept network-behavior verification pending for later review.
- Did not create or share any real secret.
- Did not use real API keys, passwords, tokens, or customer data.
- Did not write the full article.
- Did not import content into Supabase.
- Did not modify frontend pages.
- Did not run Feishu sync.

Files:

- docs/content/resource-tests/droplock-source-checklist.csv
- docs/content/resource-tests/droplock-official-source-notes.md

## 2026-06-18 - DropLock first real observation

Status: completed

Summary:

- Ran the first real observation for DropLock using only fictional secret data.
- Updated the observation sheet with observed results.
- Updated the network behavior row in the source checklist.
- Added a test-run note document separating observed behavior from official claims.
- Did not use real API keys, passwords, tokens, or customer data.
- Did not write a final article.
- Did not import content into Supabase.
- Did not modify frontend pages.
- Did not run Feishu sync.

Files:

- docs/content/resource-tests/droplock-observation-sheet.csv
- docs/content/resource-tests/droplock-source-checklist.csv
- docs/content/resource-tests/droplock-test-run-2026-06-17.md

## 2026-06-17 - DropLock first article draft

Status: completed

Summary:

- Added the first real-writer article draft for DropLock.
- Wrote the draft around the actual observation that the secret-sharing flow produced a `#m=` fragment link.
- Clearly separated official claims from zhishare observations.
- Avoided recommendation language and absolute safety claims.
- Added social post drafts for X, Xiaohongshu, and short-video narration.
- Did not use real API keys, passwords, tokens, or customer data.
- Did not import content into Supabase.
- Did not modify frontend pages.
- Did not publish the article.

Files:

- docs/content/article-drafts/droplock-secret-sharing-first-look.md
- docs/content/article-drafts/droplock-social-posts-v1.md

## 2026-06-18 - DropLock article review package

Status: completed

Summary:

- Added an editorial review document for the first DropLock article draft.
- Added a publish-candidate package with metadata, GEO summary, suitability, risks, and review status.
- Kept the article in review status instead of published.
- Preserved the boundary that the article is not a security audit.
- Preserved the boundary that DropLock has not been reviewed by a security expert.
- Preserved the boundary that it cannot replace enterprise secret management.
- Avoided recommendation language and absolute safety claims.
- Did not import content into Supabase.
- Did not modify frontend pages.
- Did not publish the article.

Files:

- docs/content/article-drafts/droplock-editorial-review.md
- docs/content/article-drafts/droplock-publish-candidate.md

## 2026-06-18 - First real-writer content review queue

Status: completed

Summary:

- Added the first review queue for real-writer rewritten articles.
- Added Privacy Filter and DropLock to the review queue.
- Kept both articles in review status.
- Kept both recommendation levels as not recommended yet.
- Marked both articles as not publishable now.
- Added missing-before-ready and next-action fields for each article.
- Did not import content into Supabase.
- Did not modify frontend pages.
- Did not publish articles.

Files:

- docs/content/CONTENT_REVIEW_QUEUE_V1.md
- docs/content/content-review-queue-v1.csv

## 2026-06-18 - Third resource source precheck v1

Status: completed

Summary:

- Completed a source precheck for OpenLess, PlainApp, and Recordly.
- Confirmed official homepages and official repositories for all three candidates.
- Confirmed MIT for OpenLess and AGPL-3.0 for PlainApp and Recordly.
- Kept privacy or permission boundaries explicit instead of fabricating missing details.
- Marked OpenLess as the best third P0 candidate.
- Marked PlainApp as the fallback candidate.
- Kept Recordly on hold pending more manual source confirmation.
- Did not run any real scraping or import flow.
- Did not modify frontend pages.
- Did not write or publish a final article.

Files:

- docs/content/THIRD_RESOURCE_SOURCE_PRECHECK_V1.md
- docs/content/third-resource-source-precheck-v1.csv

## 2026-06-18 - OpenLess rewrite test plan

Status: completed

Summary:

- Added the OpenLess rewrite test plan as the third P0 resource test package.
- Locked the article direction around turning messy spoken requirements into usable prompts.
- Added draft-only observation rows for prompt cleanup quality, insertion behavior, permissions, and local-first boundaries.
- Added a source checklist covering homepage, repository, license, installation, permissions, local-first claims, provider boundaries, usage docs, network behavior, and alternatives.
- Kept all rows in draft or needs-review state.
- Did not run real tests.
- Did not write the final article.
- Did not import content into Supabase.
- Did not modify frontend pages.
- Did not run Feishu sync.

Files:

- docs/content/resource-tests/openless-test-plan.md
- docs/content/resource-tests/openless-observation-sheet.csv
- docs/content/resource-tests/openless-source-checklist.csv

## 2026-06-17 - OpenLess network behavior status correction

Status: completed

Summary:

- Corrected the OpenLess source checklist network_behavior row back to pending status.
- Kept network behavior unverified because no real OpenLess observation has been run yet.
- Did not modify the OpenLess test plan or observation sheet.
- Did not run real tests.
- Did not write an article.
- Did not modify frontend pages.

Files:

- docs/content/resource-tests/openless-source-checklist.csv

## 2026-06-17 - OpenLess official source notes

Status: completed

Summary:

- Added OpenLess official source notes.
- Recorded official homepage, GitHub README, USAGE.md, docs, license, permissions, local-first claims, and provider boundary.
- Updated OpenLess source checklist usage_docs, provider_boundary, and local_first_claim rows.
- Kept network_behavior pending because no real observation has been run yet.
- Did not run real tests.
- Did not write an article.
- Did not modify frontend pages.

Files:

- docs/content/resource-tests/openless-source-checklist.csv
- docs/content/resource-tests/openless-official-source-notes.md

## 2026-06-17 - OpenLess local test preflight

Status: completed

Summary:

- Added an OpenLess local test preflight document.
- Did not download OpenLess.
- Did not install OpenLess.
- Did not run OpenLess.
- Did not request microphone or accessibility permissions.
- Did not configure ASR or LLM credentials.
- Did not change the observation sheet status.
- Did not write an article.
- Did not modify frontend pages.

Files:

- docs/content/resource-tests/openless-local-test-preflight.md

## 2026-06-17 - PlainApp official source and permission boundary notes

Status: completed

Summary:

- Switched from OpenLess installation testing to PlainApp source strengthening per user choice.
- Added PlainApp official source checklist.
- Added PlainApp official source and permission boundary notes.
- Recorded official homepage, GitHub repository, license, privacy policy candidate, terms candidate, docs/FAQ, local network boundary, encryption claims, distribution channels, network behavior, and alternatives.
- Kept permission_boundary and network_behavior pending because no real Android test has been run.
- Did not download or install PlainApp.
- Did not connect an Android device.
- Did not access real files, photos, SMS, contacts, or call logs.
- Did not write an article.
- Did not modify frontend pages.

Files:

- docs/content/resource-tests/plainapp-source-checklist.csv
- docs/content/resource-tests/plainapp-official-source-notes.md

## 2026-06-20 - PlainApp local test preflight

Status: completed

Summary:

- Added a PlainApp local test preflight document.
- Clarified that PlainApp must not be tested on a primary phone.
- Clarified that a spare Android device or low-sensitivity environment is required before testing.
- Clarified sensitive Android data boundaries including files, photos, SMS, contacts, call logs, notifications, and screen mirroring.
- Kept permission_boundary and network_behavior pending.
- Did not download or install PlainApp.
- Did not connect an Android device.
- Did not access real phone data.
- Did not write an article.
- Did not modify frontend pages.

Files:

- docs/content/resource-tests/plainapp-local-test-preflight.md

## 2026-06-17 - Team-tested and public-review publishing rules

Status: completed

Summary:

- Updated the software publishing rules to allow team-tested language.
- Allowed tool copy to use terms such as team-tested and site-tested when the user provides the software.
- Added rules for public user-review excerpts from GitHub, Reddit, Product Hunt, app stores, forums, blogs, and social platforms.
- Clarified that public comments must be labeled as user feedback or public-review excerpts.
- Clarified that Codex must not invent testing details or user comments.
- Preserved official source verification before publishing.
- Preserved the ban on piracy, cracking, watermark removal, paid bypass, gray-market, privacy-invasive, and malicious tools.
- Did not import content into Supabase.
- Did not modify frontend pages.
- Did not publish tools.

Files:

- docs/content/TEAM_TESTED_SOFTWARE_PUBLISHING_RULES.md

## 2026-06-23 - Tested copy and public review excerpt rules

Status: completed

Summary:

- Updated the publishing rules to allow first-person tested copy when the user confirms personal testing.
- Allowed team-tested and site-tested copy when the user confirms team testing.
- Allowed strong marketing copy and exaggerated rhetorical style.
- Added boundaries for public user-review excerpts from GitHub, Reddit, Product Hunt, app stores, forums, blogs, and social platforms.
- Clarified that public comments must be labeled as user feedback or public-review excerpts.
- Clarified that Codex must not invent personal testing, team testing, user comments, prices, licenses, safety claims, or privacy claims.
- Preserved official source verification before publishing.
- Preserved the ban on piracy, cracking, watermark removal, paid bypass, gray-market, privacy-invasive, and malicious tools.
- Did not import content into Supabase.
- Did not modify frontend pages.
- Did not publish tools.

Files:

- docs/content/TEAM_TESTED_SOFTWARE_PUBLISHING_RULES.md

## 2026-06-23 - Bulk content publishing audit

Status: completed

Summary:

- Audited the current bulk content publishing path for tools and articles.
- Confirmed the public pages read published content from Supabase with mock fallback.
- Confirmed the admin pages can manually create and edit tools and articles.
- Confirmed the current pipeline is a source-collection and Feishu middle-layer skeleton rather than a direct CSV-to-Supabase publisher.
- Added a bulk content publishing audit document.
- Added a bulk content field map CSV.
- Did not import content into Supabase.
- Did not modify frontend pages.
- Did not publish tools or articles.

Files:

- docs/content/BULK_CONTENT_PUBLISHING_AUDIT.md
- docs/content/bulk-content-field-map.csv

## 2026-06-23 - Bulk tools staged CSV field freeze

Status: completed

Summary:

- Added the first bulk tools staged CSV field specification.
- Added an empty bulk tools staged CSV with frozen headers.
- Added a staged CSV review checklist.
- Prepared the project for the first batch of 50 tool entries.
- Did not generate real tool entries yet.
- Did not import content into Supabase.
- Did not modify frontend pages.
- Did not publish tools.

Files:

- docs/content/BULK_TOOL_STAGED_FIELDS_V1.md
- docs/content/bulk-tools-staged-v1.csv

## 2026-06-17 - Bulk tools staged import dry-run scaffold

Status: completed

Summary:

- Added a dry-run import scaffold for the first 50 staged tool entries.
- Added CSV validation for header, row count, slug uniqueness, publish_ready status, required fields, source fields, and risk markers.
- Added a JSON dry-run report output.
- Added a package script for dry-run validation.
- Did not import content into Supabase.
- Did not modify frontend pages.
- Did not publish tools.

Files:

- scripts/content-import/import-tools-staged.mjs
- docs/content/BULK_TOOLS_IMPORT_DRY_RUN_V1.md
- docs/content/bulk-tools-import-dry-run-report-v1.json
- docs/content/bulk-tools-staged-review-checklist.md

## 2026-06-17 - First 50 bulk tools staged content

Status: completed

Summary:

- Generated the first batch of 50 staged tool entries.
- Wrote all entries into docs/content/bulk-tools-staged-v1.csv.
- Kept every entry as copy_ready with publish_ready=no.
- Used team-tested/site-tested copy style while keeping specific testing details generic unless provided.
- Left public review excerpts as pending for a later review-mining step.
- Did not import content into Supabase.
- Did not modify frontend pages.
- Did not publish tools.

Files:

- docs/content/bulk-tools-staged-v1.csv

## 2026-06-17 - Bulk tools dry-run review and first 10 candidates

Status: completed

Summary:

- Reviewed the dry-run report for the first 50 staged tool entries.
- Kept all original staged entries unchanged.
- Identified the high-risk and needs-review state from the dry-run report.
- Selected the first 10 lower-risk candidates for manual review.
- Added a first-10 candidate CSV and review notes CSV.
- Kept every candidate as publish_ready=no.
- Did not import content into Supabase.
- Did not modify frontend pages.
- Did not publish tools.

Files:

- docs/content/BULK_TOOLS_DRY_RUN_REVIEW_V1.md
- docs/content/bulk-tools-first-10-publish-candidates-v1.csv
- docs/content/bulk-tools-first-10-review-notes-v1.csv

## 2026-06-17 - First 10 tools ready-to-publish package

Status: completed

Summary:

- Generated the first ready-to-publish package for 10 selected tool entries.
- Created a separate ready-to-publish CSV without modifying the original staged CSV or candidate CSV.
- Set item_status=ready_to_publish and publish_ready=yes only in the new package file.
- Added publish risk notes for the 10 selected tools.
- Did not import content into Supabase.
- Did not modify frontend pages.
- Did not publish tools.

Files:

- docs/content/bulk-tools-first-10-ready-to-publish-v1.csv
- docs/content/BULK_TOOLS_FIRST_10_READY_TO_PUBLISH_V1.md
- docs/content/bulk-tools-first-10-publish-risk-notes-v1.csv
