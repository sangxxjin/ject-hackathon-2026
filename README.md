# 그 나이에 걔는

나이를 넣으면 그 나이에 내가 응원하는 종목의 선수가 뭘 했는지 알려주고, 오늘 밖으로 나가게 만드는 서비스. (젝커톤 2026)

## 문서

- [docs/intent.md](docs/intent.md) — 의도와 판단 기준
- [docs/spec.md](docs/spec.md) — 구현 명세
- [docs/fallback.md](docs/fallback.md) — 비상용 결과

## 실행 방법

Node.js 20 이상이 필요합니다.

```bash
git clone https://github.com/sangxxjin/ject-hackathon-2026.git
cd ject-hackathon-2026
npm install
cp .env.example .env.local
```

`.env.local`에 키와 모델을 넣습니다. (이 파일은 커밋되지 않습니다)

```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

```bash
npm run dev
```

브라우저에서 http://localhost:3000 을 엽니다. 배포 전에는 `npm run build`로 빌드가 되는지 확인합니다.

Next.js 16 · TypeScript · Tailwind CSS 4 · OpenAI · Vercel
