# AA Design – aa-design.vn

Website giới thiệu AA Design. Next.js 16 (Pages Router), React 18, TypeScript, SCSS modules, hai ngôn ngữ `vi` (mặc định) và `en`.

## Yêu cầu

- Node 24 (xem `.nvmrc`; Vercel dùng `engines.node`)
- npm (dùng `package-lock.json`, không dùng yarn/pnpm)

## Chạy dự án

```bash
npm ci          # cài đúng phiên bản trong lockfile
npm run dev     # http://localhost:3000
npm run lint    # ESLint (next lint đã bị gỡ từ Next 16)
npm run build   # build production
npm start       # chạy bản build
npm run format  # Prettier cho src/, scripts/ và các file *.mjs ở gốc
```

Hook pre-commit chạy `npm run lint && npm run build`.

## Kiểm tra nhanh

Các script trong `scripts/` kiểm tra i18n, header, hero, liên hệ nổi, loading và SEO:

```bash
for s in scripts/check-*.mjs; do node "$s"; done
```

`check-seo-output.mjs` đọc HTML đã build nên cần chạy `npm run build` trước.

## Biến môi trường

Đặt trong `.env.local` (không commit). Tất cả đều là `NEXT_PUBLIC_*` nên sẽ nằm trong bundle, không đặt bí mật ở đây.

| Biến | Mặc định | Dùng cho |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://aa-design.vn` | canonical, hreflang, sitemap |
| `NEXT_PUBLIC_LINK_S3` | rỗng | tiền tố cho đường dẫn ảnh không bắt đầu bằng `/` |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | rỗng | thẻ xác minh Google Search Console |

## Cấu trúc

```
src/
  pages/            route (index, construction, contact, profile, api/sitemap)
  component-page/   section riêng của trang chủ
  components/       header, footer, layout, form, SEO...
  styles/           *.module.scss (alias @/scss/*)
  data/             nội dung dự án (static-content.json, project-content.json)
  locales/          bản dịch vi/en
  utils/            slug, SEO, schema, gsap...
public/             ảnh, robots.txt, llms.txt
scripts/            các script check-*
```

`/sitemap.xml` được sinh động từ dữ liệu dự án (`src/pages/api/sitemap.ts`, rewrite trong `next.config.mjs`).

## Deploy

Site chạy trên Vercel, deploy tự động khi push (không còn CI riêng hay EC2/pm2). Vercel lấy Node từ `engines.node` trong `package.json` (hiện `24.x`) và tự chạy `npm install` + `next build`. Đặt các biến `NEXT_PUBLIC_*` ở bảng trên trong Project Settings → Environment Variables. Vì Next 16 không lint lúc build, hãy chạy `npm run lint` (hook pre-commit đã làm việc này) trước khi push.
