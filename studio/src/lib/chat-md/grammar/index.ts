/**
 * peggy parser — runtime 컴파일.
 *
 * chat-md.ts 의 CHAT_MD_GRAMMAR 문자열을 peggy.generate 로 컴파일하여 parser 인스턴스 생성.
 * 모듈 로드 시 1회 컴파일 → 이후 재사용.
 */

import peggy from "peggy";
import { CHAT_MD_GRAMMAR } from "./chat-md";

export interface PeggyParser {
  parse(input: string): unknown;
}

export const parser: PeggyParser = peggy.generate(CHAT_MD_GRAMMAR);
