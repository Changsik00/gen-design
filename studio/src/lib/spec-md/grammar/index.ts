/**
 * peggy parser — runtime 컴파일.
 *
 * spec-md.ts 의 SPEC_MD_GRAMMAR 문자열을 peggy.generate 로 컴파일하여 parser 인스턴스 생성.
 * 모듈 로드 시 1회 컴파일 → 이후 재사용.
 */

import peggy from "peggy";
import { SPEC_MD_GRAMMAR } from "./spec-md";

export interface PeggyParser {
  parse(input: string): unknown;
}

export const parser: PeggyParser = peggy.generate(SPEC_MD_GRAMMAR);
