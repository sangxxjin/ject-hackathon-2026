import { redirect } from "next/navigation";

/**
 * 없는 주소(예: /asdfj)로 들어오면 404 화면 대신 메인으로 보낸다.
 * 루트 not-found는 매칭되지 않는 모든 URL을 받는다. /api/judge, /logo.svg 같은 실제 경로는 영향 없음.
 */
export default function NotFound() {
  redirect("/");
}
