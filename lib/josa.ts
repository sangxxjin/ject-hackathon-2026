type Pair = "은/는" | "이/가" | "을/를" | "과/와";

const DIGIT_HAS_BATCHIM = [true, true, false, true, false, false, true, true, true, false]; // 영 일 이 삼 사 오 육 칠 팔 구

/** 마지막 글자에 받침이 있는지. "페이커 (이상혁)"처럼 괄호가 끝에 붙으면 괄호 앞 단어로 판단한다. */
export function hasBatchim(word: string): boolean {
  const base = word.replace(/\s*\([^)]*\)\s*$/, "").trim();
  const last = base.charCodeAt(base.length - 1);
  if (last >= 0xac00 && last <= 0xd7a3) return (last - 0xac00) % 28 !== 0;
  const ch = base[base.length - 1];
  if (ch && /[0-9]/.test(ch)) return DIGIT_HAS_BATCHIM[Number(ch)];
  return false;
}

/** josa("손흥민", "은/는") → "손흥민은" */
export function josa(word: string, pair: Pair): string {
  const [withB, withoutB] = pair.split("/");
  return word + (hasBatchim(word) ? withB : withoutB);
}

/** 화면 표시용 짧은 이름: "페이커 (이상혁)" → "페이커" */
export function shortName(name: string): string {
  return name.replace(/\s*\([^)]*\)\s*$/, "").trim();
}
