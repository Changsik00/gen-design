/**
 * Document 노드들을 신뢰도 기준으로 3 분류:
 *   confident: confidence ≥ 0.8
 *   confirm:   0.5 ≤ confidence < 0.8
 *   unknown:   confidence < 0.5
 */

import type { Block } from "../chat-md/parser/ast-types";
import type { NodeMeta } from "./ast-builder";

export interface InferReport {
  confident: NodeMeta[];
  confirm: NodeMeta[];
  unknown: NodeMeta[];
  /** 종합 통계 */
  total: number;
  thresholds: { confident: number; confirm: number };
}

export interface ClassifyOptions {
  /** confident 임계값 (기본 0.8). `--threshold` CLI 옵션 연동. */
  confidentThreshold?: number;
  /** confirm 임계값 (기본 0.5). */
  confirmThreshold?: number;
}

export function classify(
  nodeMetaMap: Map<string, NodeMeta>,
  options: ClassifyOptions = {},
): InferReport {
  const confidentThreshold = options.confidentThreshold ?? 0.8;
  const confirmThreshold = options.confirmThreshold ?? 0.5;

  const confident: NodeMeta[] = [];
  const confirm: NodeMeta[] = [];
  const unknown: NodeMeta[] = [];

  for (const meta of nodeMetaMap.values()) {
    if (meta.confidence >= confidentThreshold) {
      confident.push(meta);
    } else if (meta.confidence >= confirmThreshold) {
      confirm.push(meta);
    } else {
      unknown.push(meta);
    }
  }

  return {
    confident,
    confirm,
    unknown,
    total: nodeMetaMap.size,
    thresholds: { confident: confidentThreshold, confirm: confirmThreshold },
  };
}

/** Block 타입에 무관하게 Document body 를 NodeMeta map 에서 집계. */
export function classifyBlocks(_blocks: Block[], nodeMetaMap: Map<string, NodeMeta>, options?: ClassifyOptions): InferReport {
  return classify(nodeMetaMap, options);
}
