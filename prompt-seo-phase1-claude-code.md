# Nhiệm vụ: Sửa lỗi SEO kỹ thuật cho website aa-design.vn (Giai đoạn 1)

Bạn là lead agent. Hãy dùng **subagent (Agent/Task tool)** để chia việc và chạy song song khi các phần việc không đụng cùng file. Bạn chịu trách nhiệm điều phối, gộp kết quả và kiểm tra cuối.

## Bối cảnh (từ Google Search Console, dữ liệu 01/08–31/10/2026)
- Domain: https://aa-design.vn (2 ngôn ngữ: vi mặc định, en dưới `/en`)
- 32 trang đã index, **65 trang chưa index**:
  - 38 trang "Đã thu thập dữ liệu – chưa lập chỉ mục": phần lớn là URL cũ dạng ID MongoDB, ví dụ:
    - `/construction/67f9f2a56644672a6bf73b6f`
    - `/en/construction/67fa24db6644672a6bf73bb0`
  - Có URL lỗi lặp locale: `/en/en/construction/67fa237d6644672a6bf73ba4`
  - URL chuẩn hiện tại dùng slug, ví dụ: `/construction/biet-thu-van-phu-ha-dong-ha-noi`
  - 9 trang chuyển hướng, 1 trang 404, 1 trang Google chọn canonical khác
- Sitemap `/sitemap-0.xml` cũ (Google đọc lần cuối 7/4/2026, chỉ 48 URL). Mục `/construction` bị gửi nhầm như sitemap.
- 2 trang lỗi JSON-LD: "Lỗi phân tích cú pháp: Thiếu '}' hoặc tên thành viên đối tượng".

## Bước 0 — Khảo sát (lead tự làm hoặc 1 Explore agent, KHÔNG sửa code)
Xác định và báo lại ngắn gọn:
1. Framework/phiên bản (Next.js App Router hay Pages Router?), thư viện i18n (next-intl, next-i18next, tự viết?).
2. Nguồn dữ liệu dự án (MongoDB/API?), trường `_id` và `slug`.
3. Các file liên quan: middleware, component chuyển ngôn ngữ, route `construction/[...]`, layout, nơi tạo sitemap/robots, nơi chèn JSON-LD, `next.config`.
4. Lệnh lint / typecheck / build của project.

Sau bước này, **lập bảng phân công file cho từng agent** để không có 2 agent cùng sửa 1 file. Nếu bắt buộc phải dùng chung file (ví dụ `generateMetadata` trong page dự án), giao file đó cho đúng 1 agent và để agent kia gửi lại đoạn code cho lead gộp.

## Bước 1 — Chạy song song các agent

### Agent A — URL & Redirect (ưu tiên cao nhất)
- Sửa nguyên nhân gốc lỗi `/en/en/...`: link chuyển ngôn ngữ phải ghép locale vào pathname **đã bỏ locale**. Ưu tiên dùng `Link`/router của thư viện i18n thay vì tự nối chuỗi.
- Redirect 301 `/en/en/:path*` → `/en/:path*`.
- Redirect 301 URL dạng ObjectId (24 ký tự hex) → URL slug tương ứng, cho cả vi và `/en`. Tra slug từ database theo `_id`. Nếu không còn dự án đó thì trả về 404/410, **không redirect về trang chủ**.
- Rà link nội bộ (menu, footer, card dự án, breadcrumb) để mọi link trỏ thẳng tới URL cuối cùng (thống nhất https, có/không www, dấu `/` cuối).

### Agent B — Sitemap & robots
- Tạo sitemap động (`app/sitemap.ts` hoặc tương đương): lấy dự án từ database, gồm cả URL vi và en, chỉ URL slug chuẩn (không URL ID, không URL bị redirect), có `lastModified`, khai báo `alternates.languages` nếu framework hỗ trợ.
- Gỡ hoặc thay `next-sitemap`/sitemap tĩnh cũ nếu bị trùng.
- `robots.txt`: có dòng `Sitemap: https://aa-design.vn/sitemap.xml`, không chặn `/_next/` hay thư mục ảnh.

### Agent C — Metadata: canonical, hreflang, title, description, Open Graph
- Mỗi trang (trang chủ, `/construction`, chi tiết dự án, `/profile`, `/contact`, và bản `/en`) có:
  - `canonical` là URL tuyệt đối, trỏ về chính trang đó.
  - `alternates.languages`: `vi`, `en`, `x-default` (x-default = bản vi).
  - Title riêng, không trùng nhau, dạng `<Tên dự án/dịch vụ>, <Địa điểm> | AA Design`.
  - Description 140–160 ký tự, có lời mời liên hệ.
  - Open Graph/Twitter: `og:image` là ảnh đại diện dự án.
- Đặt `metadataBase` ở root layout.

### Agent D — Dữ liệu có cấu trúc (JSON-LD)
- Tìm và sửa 2 chỗ JSON-LD lỗi. Chuyển toàn bộ JSON-LD sang dạng object + `JSON.stringify()`, không viết JSON tay trong template string.
- Thêm `HomeAndConstructionBusiness` cho trang chủ (name, url, logo, address, telephone, sameAs), lấy thông tin thật đang có trong code/web. **Không tự bịa địa chỉ hay số điện thoại**: thiếu thì để TODO và liệt kê trong báo cáo.
- Thêm `BreadcrumbList` cho trang dự án.
- Escape `<` trong JSON trước khi chèn vào `<script>` để tránh XSS (ví dụ `.replace(/</g, '\\u003c')`).

### Agent E — Ảnh & hiệu năng
- Chuyển `<img>` sang `next/image` (nếu là Next.js), đặt `sizes` hợp lý, ảnh hero đặt `priority`, còn lại lazy load.
- Kiểm tra cấu hình `images` (`remotePatterns`, formats `avif/webp`).
- Mọi ảnh có `alt` mô tả. Ảnh dự án dùng tên dự án + vị trí/phòng, không để `alt=""` hay `alt="image"`.
- Liệt kê ảnh tĩnh > 300KB trong repo, đề xuất nén (chưa xóa file gốc).

## Bước 2 — Kiểm tra (lead làm sau khi gộp)
1. Chạy lint + typecheck + build. Phải pass hết. Lỗi nào thì sửa.
2. Chạy dev/prod server local và dùng `curl -I` để xác nhận:
   - `/en/en/construction/<slug>` → 301 về `/en/construction/<slug>`
   - `/construction/<một ObjectId có thật>` → 301 về slug
   - `/construction/<ObjectId không tồn tại>` → 404/410
   - `/sitemap.xml` và `/robots.txt` trả 200, nội dung đúng
3. Kiểm tra HTML render của 1 trang dự án vi và 1 trang en: có canonical, hreflang, title, description, og:image, JSON-LD parse được (dùng `JSON.parse` trong script test).
4. Bấm chuyển ngôn ngữ nhiều lần (đọc code hoặc test bằng Playwright nếu có): URL không bị nhân đôi `/en`.
5. Rà bảo mật: không lộ secret/env ra client, không có XSS qua JSON-LD hay dữ liệu từ DB, redirect không nhận URL ngoài từ query (open redirect).

## Quy tắc
- Tạo branch mới `fix/seo-phase-1` trước khi sửa. **Không commit, push hay merge khi chưa hỏi tôi.**
- Không đổi URL slug hiện có, không đổi giao diện, không xóa dữ liệu.
- Không thêm dependency mới nếu không cần. Nếu cần thì nêu lý do.
- Gặp điểm phải quyết định (ví dụ: dự án đã xóa thì trả 404 hay 410; có www hay không) thì hỏi tôi, đừng đoán.

## Báo cáo cuối (tiếng Việt, ngắn gọn)
1. Bảng: mục đã sửa → file thay đổi → vì sao sửa như vậy.
2. Kết quả lint/typecheck/build và các lệnh `curl` kiểm tra.
3. Danh sách TODO cần tôi cung cấp (địa chỉ, số điện thoại, logo…).
4. Việc tôi cần làm thủ công trên Google Search Console sau khi deploy:
   - Xóa mục sitemap `/construction`, gửi `sitemap.xml` mới.
   - Kiểm tra URL → Yêu cầu lập chỉ mục cho trang chủ và 5–10 trang dự án chính.
   - Bấm "Xác thực kết quả khắc phục" cho từng lỗi trong báo cáo Lập chỉ mục và Dữ liệu có cấu trúc.
