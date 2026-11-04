import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Layers,
  Save,
  RefreshCw,
  BookOpen,
  ListChecks,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { lecturerRubricApi, lecturerQuestionApi, subjectApi } from '../../services/api';
import RubricBuilder, { normalizeRubricItem } from '../../components/lecturer/RubricBuilder';

const TARGET_SCORE = 10;

const emptyTemplate = () => [
  { uuid: null, criterionName: 'Tính chính xác kiến thức', description: 'Nêu đúng định nghĩa và khái niệm cốt lõi', maxScore: 4, weight: 0 },
  { uuid: null, criterionName: 'Phân tích & Vận dụng', description: 'Áp dụng kiến thức vào tình huống thực tế', maxScore: 4, weight: 0 },
  { uuid: null, criterionName: 'Phản biện & Trình bày', description: 'Lập luận, so sánh và trình bày rõ ràng', maxScore: 2, weight: 0 },
];

/**
 * Trang Quản lý Rubric cho Giảng viên.
 *
 * - Barem môn học (Rubric Template): rubric dùng chung cho môn (question_uuid = NULL).
 *   Khi tạo câu hỏi mới, template sẽ được copy vào câu hỏi đó.
 * - Rubric theo câu hỏi: bản riêng của từng câu, có thể sửa tự do.
 */
export default function LecturerRubricManagementPage() {
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState(null);

  const [template, setTemplate] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [questionRubrics, setQuestionRubrics] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ---------------------------------------------------------------
  // Load danh sách môn học
  // ---------------------------------------------------------------
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const res = await subjectApi.getSubjects();
        const list = res?.data?.result || [];
        setSubjects(list);
        if (list.length > 0) {
          setSubjectId(list[0].id || list[0].uuid);
        }
      } catch (e) {
        console.warn('Failed to load subjects:', e);
        showToast('Không tải được danh sách môn học', 'error');
      }
    };
    loadSubjects();
  }, []);

  // ---------------------------------------------------------------
  // Load template + câu hỏi của môn đang chọn
  // ---------------------------------------------------------------
  const loadTemplate = useCallback(async (sid) => {
    if (!sid) return;
    try {
      const res = await lecturerRubricApi.getRubricsBySubject(sid);
      const list = (res?.data?.result || []).map(normalizeRubricItem);
      setTemplate(list);
    } catch (e) {
      console.warn('Failed to load rubric template:', e);
      setTemplate([]);
    }
  }, []);

  const loadQuestions = useCallback(async (sid) => {
    if (!sid) return;
    try {
      const res = await lecturerQuestionApi.getQuestions({ subjectUuid: sid });
      const list = res?.data?.result || [];
      setQuestions(list);
    } catch (e) {
      console.warn('Failed to load questions:', e);
      setQuestions([]);
    }
  }, []);

  useEffect(() => {
    if (!subjectId) return;
    setLoading(true);
    setSelectedQuestionId(null);
    setQuestionRubrics([]);
    Promise.all([loadTemplate(subjectId), loadQuestions(subjectId)]).finally(() => setLoading(false));
  }, [subjectId, loadTemplate, loadQuestions]);

  // ---------------------------------------------------------------
  // Load rubric của câu hỏi được chọn
  // ---------------------------------------------------------------
  const loadQuestionRubrics = useCallback(async (qid) => {
    if (!qid) {
      setQuestionRubrics([]);
      return;
    }
    try {
      const res = await lecturerRubricApi.getRubricsByQuestion(qid);
      setQuestionRubrics((res?.data?.result || []).map(normalizeRubricItem));
    } catch (e) {
      console.warn('Failed to load question rubrics:', e);
      setQuestionRubrics([]);
    }
  }, []);

  useEffect(() => {
    loadQuestionRubrics(selectedQuestionId);
  }, [selectedQuestionId, loadQuestionRubrics]);

  const selectedQuestion = useMemo(
    () => questions.find((q) => (q.id || q.uuid) === selectedQuestionId) || null,
    [questions, selectedQuestionId]
  );

  // ---------------------------------------------------------------
  // Lưu Barem môn học
  // ---------------------------------------------------------------
  const handleSaveTemplate = async () => {
    if (!subjectId) return;
    setSaving(true);
    try {
      const res = await lecturerRubricApi.bulkSaveRubrics({
        subjectUuid: subjectId,
        questionUuid: null,
        rubrics: template.map((r) => ({
          uuid: r.uuid || undefined,
          criterionName: r.criterionName,
          description: r.description,
          maxScore: r.maxScore,
        })),
      });
      const saved = (res?.data?.result || []).map(normalizeRubricItem);
      setTemplate(saved);
      showToast(`Đã lưu Barem môn học (${saved.length} tiêu chí)`);
    } catch (e) {
      console.error('Save template failed:', e);
      showToast(e?.response?.data?.message || 'Không lưu được Barem môn học', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------------------------------
  // Lưu rubric của câu hỏi
  // ---------------------------------------------------------------
  const handleSaveQuestionRubrics = async () => {
    if (!subjectId || !selectedQuestionId) return;
    setSaving(true);
    try {
      const res = await lecturerRubricApi.bulkSaveRubrics({
        subjectUuid: subjectId,
        questionUuid: selectedQuestionId,
        rubrics: questionRubrics.map((r) => ({
          uuid: r.uuid || undefined,
          criterionName: r.criterionName,
          description: r.description,
          maxScore: r.maxScore,
        })),
      });
      const saved = (res?.data?.result || []).map(normalizeRubricItem);
      setQuestionRubrics(saved);
      showToast(`Đã lưu rubric cho câu hỏi (${saved.length} tiêu chí)`);
    } catch (e) {
      console.error('Save question rubrics failed:', e);
      showToast(e?.response?.data?.message || 'Không lưu được rubric của câu hỏi', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------------------------------
  // Tổng điểm / trọng số do RubricBuilder tự hiển thị ở footer
  // ---------------------------------------------------------------
  return (
    <div className="space-y-5 pb-12 animate-fade-in max-w-7xl mx-auto">
      {/* ==================== HEADER ==================== */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 font-bold">
            <ListChecks className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Quản lý Rubric Chấm Điểm</h2>
            <p className="text-[11px] text-slate-500">
              Barem môn học làm tiêu chuẩn dự phòng; mỗi câu hỏi có bộ tiêu chí riêng để AI chấm điểm Viva.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={subjectId || ''}
            onChange={(e) => setSubjectId(e.target.value || null)}
            className="text-xs font-bold px-3 py-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 focus:outline-none cursor-pointer"
          >
            {subjects.map((s, idx) => (
              <option key={s.uuid || s.id || idx} value={s.id || s.uuid}>
                {s.code} - {s.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => {
              setTemplate(emptyTemplate());
              showToast('Đã tạo mẫu Barem mặc định, nhớ bấm "Lưu Barem môn học"');
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Mẫu mặc định
          </button>
        </div>
      </div>

      {/* ==================== BODY: 2 CỘT ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ---------- Cột 1: Barem môn học ---------- */}
        <section className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-600" />
              <div>
                <h3 className="text-xs font-bold text-slate-900">Barem môn học (Rubric Template)</h3>
                <p className="text-[10.5px] text-slate-500">
                  Tiêu chuẩn dự phòng khi câu hỏi chưa có rubric riêng. Trọng số tự tính theo tỉ lệ điểm.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSaveTemplate}
              disabled={saving || !subjectId}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Lưu Barem môn học
            </button>
          </div>

          <RubricBuilder
            value={template}
            onChange={setTemplate}
            title="Tiêu chí chấm điểm"
            emptyHint="Môn học chưa có Barem. Bấm 'Thêm tiêu chí' hoặc nạp từ JSON."
            targetScore={TARGET_SCORE}
          />
        </section>

        {/* ---------- Cột 2: Rubric theo câu hỏi ---------- */}
        <section className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-violet-600" />
              <div>
                <h3 className="text-xs font-bold text-slate-900">Rubric theo câu hỏi</h3>
                <p className="text-[10.5px] text-slate-500">
                  Mỗi câu hỏi có bộ tiêu chí riêng, dùng để AI chấm điểm Viva.
                </p>
              </div>
            </div>
            {selectedQuestionId && (
              <button
                type="button"
                onClick={handleSaveQuestionRubrics}
                disabled={saving}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" /> Lưu rubric câu hỏi
              </button>
            )}
          </div>

          {/* Danh sách câu hỏi */}
          <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
            {loading ? (
              <div className="p-4 text-center text-xs text-slate-400">Đang tải câu hỏi...</div>
            ) : questions.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-[11px] text-slate-500">
                Môn học này chưa có câu hỏi nào trong Ngân hàng câu hỏi.
              </div>
            ) : (
              questions.map((q) => {
                const qid = q.id || q.uuid;
                const active = qid === selectedQuestionId;
                const hasRubric = (q.rubrics?.length || q.rubricCount || 0) > 0;
                return (
                  <button
                    key={qid}
                    type="button"
                    onClick={() => setSelectedQuestionId(active ? null : qid)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-colors cursor-pointer ${
                      active
                        ? 'border-violet-300 bg-violet-50'
                        : 'border-slate-200 bg-slate-50/60 hover:border-violet-200 hover:bg-violet-50/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-slate-500 shrink-0">{q.code}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold shrink-0 ${
                          hasRubric
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {hasRubric ? `${q.rubrics?.length || q.rubricCount} tiêu chí` : 'Chưa có rubric'}
                      </span>
                      <ChevronRight className="w-3 h-3 text-slate-300 ml-auto shrink-0" />
                    </div>
                    <p className="text-[11px] text-slate-700 line-clamp-2 mt-1">{q.content}</p>
                  </button>
                );
              })
            )}
          </div>

          {/* Builder rubric của câu hỏi được chọn */}
          {selectedQuestion ? (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-slate-700">
                  Rubric của câu hỏi <span className="font-mono text-slate-500">{selectedQuestion.code}</span>
                </span>
              </div>

              <RubricBuilder
                value={questionRubrics}
                onChange={setQuestionRubrics}
                title="Tiêu chí của câu hỏi"
                emptyHint="Câu hỏi này chưa có rubric. Bấm 'Thêm tiêu chí' để thêm tiêu chí đánh giá."
                targetScore={TARGET_SCORE}
              />
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 text-center text-[11px] text-slate-400">
              Chọn một câu hỏi ở danh sách trên để xem và sửa rubric của câu đó.
            </div>
          )}
        </section>
      </div>

      {/* ==================== TOAST ==================== */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-bold flex items-center gap-2 animate-scale-in ${
            toast.type === 'error'
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : toast.type === 'info'
              ? 'bg-sky-50 text-sky-700 border-sky-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertTriangle className="w-4 h-4" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
}
