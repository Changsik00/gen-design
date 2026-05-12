# Walkthrough: spec-08-06 — inferChat diff 모드

## 🎯 한 줄 요약

기존 chat.md 의 **Narrative / History / frontmatter 를 *bit-for-bit* 보존** 하면서 Paper 변경분만 Structure 에 적용. ADR-010 D-3 (제안 + confirm) 호응 — `gen-design diff` dry-run 기본, `--apply` 명시.

## 📊 Before / After

### Before

- spec-08-04 가 chat.md 의 3-layer (Narrative / Structure / History) 인식 가능
- spec-08-05 의 `gen-design paper-import` → chat.md *전체 생성* 만 가능
- Paper 변경 1 줄 → **Narrative 통째로 사라짐** + History 0
- ADR-010 D-3 (제안/confirm) 의 *실행 방식* 미정

### After

- `inferChatDiff(existingChatText, newTree, options)` — 변경분만 적용
- `gen-design diff <chat.md> <tree.json>` — dry-run 기본, `--apply` 명시
- Narrative / History / frontmatter / title **그대로 복사** → 디자이너 자연어 의도 보호
- History 자동 라인: `- **YYYY-MM-DD** Paper sync — texts X, variants Y, +A / -B`
- 변경 0 시 자동 라인 추가 X (git diff 깔끔)

## 🔑 8 핵심 결정

| ID | 결정 | 근거 |
|---|---|---|
| **D-1** | Narrative / History / frontmatter / title **불변 보존** | 디자이너 자연어 의도는 자동 수정 대상 X. ADR-010 D-3 핵심 |
| **D-2** | Structure 만 inferChat 결과로 *교체* | Paper 는 *권위 source* — Structure 영역만 갱신 |
| **D-3** | diff 키 = ComponentInstance.name + props 비교 (sorted keys) | 간단 + 충분. rename 검출은 add+remove 로 회피 |
| **D-4** | History 자동 라인 = 단순 통계 (의미 추론 X) | ADR-010 D-3 자동 갱신 영역 — agent 가 의미 추론하면 *디자인 결정 자동화* 위험 |
| **D-5** | 변경 0 → History 자동 라인 X | no-op git diff 깔끔 — 신뢰성 |
| **D-6** | dry-run 기본, `--apply` 명시 필수 | ADR-010 D-3 호응 — *제안만* 자동, *실행은 디자이너* |
| **D-7** | `emitDocument` 신규 — full-Document (4-layer) serialize | 기존 `emit()` 은 body 만. diff 결과의 emit 필수 |
| **D-8** | 테스트 catalog inline (실제 catalog 의 LoginForm 은 axes []) | 테스트 격리 + 의도 명확. CLI 는 실제 catalog 사용 |

## 🧪 테스트 결과

| 영역 | 신규 | 결과 |
|---|---|---|
| emit-document (frontmatter / sections / 호환 / round-trip) | 9 | 9/9 PASS |
| diff 알고리즘 (no-op / variant / add / remove / 혼합 / 결정성 / 보존 / 자동라인) | 13 | 13/13 PASS |
| diff-args (정상 + 오류) | 9 | 9/9 PASS |
| diff-runtime (dry-run / --apply / --output / --no-history / 오류) | 10 | 10/10 PASS |
| router | 2 신규 | 7/7 PASS |
| 5 통합 시나리오 (A no-op / B variant / C add / D remove / E mixed) | 5 | 5/5 PASS |
| dogfood (login.chat.md 진화 시뮬) | 4 | 4/4 PASS |
| **총 신규** | **52** | **52/52 PASS** |
| **전체 회귀** | **887** | **887/887 PASS** |
| **studio build** | — | exit 0 |
| **manual CLI** | dry-run + `--apply` | PASS (Narrative bit-for-bit 보존 확인) |

## 🔗 후속 spec 연결점

| spec | 활용 |
|---|---|
| **spec-08-07** chat-react-compiler | inferChat 의 *입력 측* — diff 모드와 무관하나 `emitDocument` 재사용 |
| **spec-08-08** gen-design merge | shell 승격 휴리스틱 — diff 알고리즘의 patterns 응용 |
| **spec-08-09** gen-design lint | `validateChatSchema` + diff 모드의 *변경 감지* 응용 |
| **spec-08-11** 외부 alpha | dogfood 흐름 (Paper 수정 → diff → confirm) 의 실 사용자 검증 |

## 💬 사용자 협의

- **Narrative 불변 보존** — 자연어 의도는 자동 수정 대상 X. 합의.
- **History 자동 라인 = 통계만** — 의미 추론 X. agent 가 *왜* 변경됐는지 추론하면 *디자인 결정 자동화* 위험. 합의.
- **dry-run 기본** — `--apply` 명시 필수. ADR-010 D-3 *제안 + 디자이너 confirm* 의 CLI-level 호응. 합의.
- **catalog axes 의 격차** — 실제 `catalog.json` 의 LoginForm 은 `axes: []` 이라 inferChat 가 `extra_0/extra_1` 로 fallback. 테스트는 inline catalog 로 격리. 향후 *catalog 보강* spec 후보.

## 🎓 교훈

- **emit-document 가 의외의 가치** — diff 결과를 텍스트로 serialize 하려면 *frontmatter + 3-layer* 통합 emit 이 필수 (기존 `emit()` 은 body 만). 부수 결과로 *full-Document round-trip* 가능 — 후속 spec (08-07, 08-08) 의 가능성 확장.
- **dogfood 가 *진짜* 검증** — playground/chats/scenes/login.chat.md 의 디자이너 자연어 의도 ("헤더 부재 = *몰입*", "법적 의무") 가 **bit-for-bit 보존** 되는지가 *유일하게 중요한* assertion. 단위 테스트 50+ 보다 dogfood 1 시나리오가 더 큰 신뢰 제공.
- **diff 의 *키 선택*** — name + props (sorted key 비교) 가 *간단* 하지만 충분. catalog 의 axis 가 *바뀌면* (예: variant → kind 로 rename) 모든 diff 가 variantChange 로 잡힘 — 향후 catalog 변경 시 *별도 1회 마이그* 필요. 알려진 한계.
- **dry-run 기본의 가치** — `--apply` 가 *명시되어야* 실행. 디자이너의 *우발적 덮어쓰기* 방지. ADR-010 D-3 의 *제안/실행* 분리가 CLI-level 에서 자연 호응.
