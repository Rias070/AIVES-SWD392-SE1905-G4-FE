import { Layers, Plus, Trash2, Info } from 'lucide-react';

/**
 * Tính trọng số (%) theo tỉ lệ maxScore của từng tiêu chí.
 * Backend cũng chuẩn hoá lại theo cùng công thức nên FE chỉ cần hiển thị cho khớp.
 *
 * Tiêu chí cuối nhận phần trọng số còn lại để tổng luôn đúng 100 (giống BE).
 */
export function computeRubricWeights(rubrics) {
  if (!Array.isArray(rubrics) || rubrics.length === 0) return [];
  const total = rubrics.reduce((sum, r) => sum + (Number(r.maxScore) || 0), 0);

  if (total <= 0) {
    const even = Math.round((100 / rubrics.length) * 100) / 100;
    return rubrics.map((r) => ({ ...r, weight: even }));
  }

  let assigned = 0;
  return rubrics.map((r, i) => {
    const score = Number(r.maxScore) || 0;
    let weight;
    if (i === rubrics.length - 1) {
      weight = Math.round((100 - assigned) * 100) / 100;
      if (weight < 0) weight = 0;
    } else {
      weight = Math.round((score / total) * 10000) / 100;
      assigned += weight;
    }
    return { ...r, weight };
  });
}

/**
 * Chuẩn hoá 1 tiêu chí về shape thống nhất dùng chung cho FE.
 */
export function normalizeRubricItem(raw = {}) {
  return {
    uuid: raw.uuid || raw.id || null,
    criterionName: raw.criterionName || '',
    description: raw.description || '',
    maxScore: Number(raw.maxScore) || 0,
    weight: Number(raw.weight) || 0,
  };
}

const DEFAULT_MAX_SCORE = 3.0;

/**
 * RubricBuilder - Component dùng chung để thêm / sửa / xóa tiêu chí Rubric.
 *
 * Props:
 *  - value        : array các tiêu chí
 *  - onChange     : (nextArray) => void
 *  - title        : tiêu đề khối
 *  - emptyHint    : gợi ý khi chưa có tiêu chí
 *  - targetScore  : tổng điểm mong đợi (mặc định 10)
 *  - allowDeleteLast : cho phép xóa cả tiêu chí cuối cùng (mặc định false)
 *  - compact      : giao diện gọn (dùng trong modal)
 */
export default function RubricBuilder({
  value = [],
  onChange,
  title = 'Barem Tiêu Chí Chấm Điểm (Rubrics)',
  emptyHint = 'Chưa có tiêu chí nào. Bấm "Thêm tiêu chí" để bắt đầu.',
  targetScore = 10,
  allowDeleteLast = false,
  compact = false,
}) {
  const list = Array.isArray(value) ? value : [];

  const totalScore = list.reduce((sum, r) => sum + (Number(r.maxScore) || 0), 0);
  const totalWeight = list.reduce((sum, r) => sum + (Number(r.weight) || 0), 0);
  const scoreMismatch = list.length > 0 && Math.abs(totalScore - targetScore) > 0.01;

  const emit = (next) => {
    onChange?.(computeRubricWeights(next));
  };

  const handleAdd = () => {
    emit([
      ...list,
      {
        uuid: null,
        criterionName: `Tiêu chí #${list.length + 1}`,
        description: 'Mô tả yêu cầu đạt điểm',
        maxScore: DEFAULT_MAX_SCORE,
        weight: 0,
      },
    ]);
  };

  const handleUpdate = (index, patch) => {
    const next = list.map((r, i) => (i === index ? { ...r, ...patch } : r));
    emit(next);
  };

  const handleRemove = (index) => {
    const next = list.filter((_, i) => i !== index);
    emit(next);
  };

  return (
    <div className="pt-2 border-t border-slate-100 space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-sky-600" />
          {title}
          <span className="text-[10px] font-normal text-slate-400">({list.length} tiêu chí)</span>
        </label>
        <button
          type="button"
          onClick={handleAdd}
          className="text-[11px] font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Thêm tiêu chí
        </button>
      </div>

      {list.length === 0 ? (
        <div className="p-3 rounded-xl border border-dashed border-slate-200 text-center text-[11px] text-slate-500">
          {emptyHint}
        </div>
      ) : (
        <div className={`space-y-2 ${compact ? 'max-h-48 overflow-y-auto pr-1' : 'max-h-72 overflow-y-auto pr-1'}`}>
          {list.map((rubric, rIdx) => (
            <div key={rubric.uuid || rIdx} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={rubric.criterionName || ''}
                  onChange={(e) => handleUpdate(rIdx, { criterionName: e.target.value })}
                  placeholder="Tên tiêu chí (ví dụ: Tính chính xác)"
                  className="flex-1 px-2.5 py-1 text-xs rounded-lg bg-white border border-slate-200 font-semibold focus:outline-none focus:border-sky-500"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="100"
                    value={rubric.maxScore}
                    onChange={(e) => handleUpdate(rIdx, { maxScore: parseFloat(e.target.value) || 0 })}
                    className="w-16 px-2 py-1 text-xs font-mono font-bold rounded-lg bg-white border border-slate-200 text-center text-sky-700"
                    title="Điểm tối đa"
                  />
                  <span className="text-[10px] text-slate-500">đ</span>
                </div>
                <span
                  className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-100"
                  title="Trọng số (tự tính theo tỉ lệ điểm)"
                >
                  {Number(rubric.weight || 0).toFixed(1)}%
                </span>
                {(allowDeleteLast || list.length > 1) && (
                  <button
                    type="button"
                    onClick={() => handleRemove(rIdx)}
                    className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                    title="Xóa tiêu chí này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <input
                type="text"
                value={rubric.description || ''}
                onChange={(e) => handleUpdate(rIdx, { description: e.target.value })}
                placeholder="Mô tả chuẩn đạt điểm cho sinh viên..."
                className="w-full px-2.5 py-1 text-[11px] rounded-lg bg-white border border-slate-200 text-slate-600 focus:outline-none"
              />
            </div>
          ))}
        </div>
      )}

      {list.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10.5px] text-slate-500">
          <span className="font-mono">
            Tổng điểm: <b className="text-slate-800">{totalScore.toFixed(1)}</b>/{targetScore}
          </span>
          <span className="font-mono">
            Tổng trọng số: <b className="text-slate-800">{totalWeight.toFixed(1)}</b>%
          </span>
          {scoreMismatch && (
            <span className="flex items-center gap-1 text-amber-600 font-semibold">
              <Info className="w-3 h-3" />
              Tổng điểm chưa bằng {targetScore}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
