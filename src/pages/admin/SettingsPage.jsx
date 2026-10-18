import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Languages, Mic, Volume2, Save, Check, Info } from 'lucide-react';
import { PageHeader } from './adminComponents';

export default function SettingsPage() {
  const { currentUser } = useOutletContext();
  const [cfg, setCfg] = useState({
    language: 'vi',
    maxFollowup: 3,
    maxAnswerSec: 180,
    whisperModel: 'base',
    ttsVoice: 'female-vi',
    sttTimeout: 5,
  });
  const [saved, setSaved] = useState(false);

  const save = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader
        title="Cấu hình hệ thống"
        subtitle="Thiết lập ngôn ngữ và tham số AI Viva"
        action={
          saved && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
              <Check className="w-3.5 h-3.5" /> Đã lưu
            </span>
          )
        }
      />

      <form onSubmit={save} className="space-y-5">
        {/* Panel: Ngôn ngữ + AI Viva */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Languages className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">Ngôn ngữ & AI Viva</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ngôn ngữ */}
            <SettingBlock label="Ngôn ngữ mặc định" hint="Áp dụng cho TTS + STT">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { v: 'vi', l: 'Tiếng Việt', d: 'vi-VN' },
                  { v: 'en', l: 'Tiếng Anh', d: 'en-US' },
                ].map((o) => (
                  <button
                    key={o.v}
                    type="button"
                    onClick={() => setCfg({ ...cfg, language: o.v })}
                    className={`p-3 rounded-xl border-2 text-left transition ${
                      cfg.language === o.v
                        ? 'border-sky-500 bg-sky-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <p className="text-sm font-bold text-slate-900">{o.l}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{o.d}</p>
                  </button>
                ))}
              </div>
            </SettingBlock>

            {/* Max followup */}
            <SettingBlock label="Lượt hỏi xoáy tối đa" hint="AI hỏi sâu khi SV trả lời mơ hồ">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setCfg({ ...cfg, maxFollowup: n })}
                    className={`w-10 h-10 rounded-lg font-bold text-sm transition ${
                      cfg.maxFollowup === n
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </SettingBlock>

            {/* Max answer time */}
            <SettingBlock label="Thời gian trả lời" hint="Đếm ngược mỗi lượt">
              <div className="space-y-2">
                <input
                  type="range"
                  min="30"
                  max="300"
                  step="30"
                  value={cfg.maxAnswerSec}
                  onChange={(e) => setCfg({ ...cfg, maxAnswerSec: Number(e.target.value) })}
                  className="w-full accent-sky-600"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>30s</span>
                  <span className="text-sky-700 font-bold">{cfg.maxAnswerSec}s ({Math.floor(cfg.maxAnswerSec / 60)}:{String(cfg.maxAnswerSec % 60).padStart(2, '0')})</span>
                  <span>300s</span>
                </div>
              </div>
            </SettingBlock>

            {/* Notice bắt buộc HITL */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-600" />
                <p className="text-sm font-semibold text-emerald-800">Giảng viên chốt điểm cuối</p>
              </div>
              <p className="text-xs text-emerald-700 mt-1">AI chỉ đưa điểm gợi ý. Bắt buộc theo yêu cầu đề tài.</p>
            </div>
          </div>
        </div>

        {/* Panel: STT / TTS chi tiết */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* STT */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">STT (Speech → Text)</h2>
                <p className="text-[11px] text-slate-500">Whisper</p>
              </div>
            </div>
            <SettingBlock label="Model" hint="Càng lớn càng chính xác, càng chậm">
              <div className="space-y-1.5">
                {[
                  { v: 'tiny',   l: 'Tiny',   d: 'Nhanh nhất' },
                  { v: 'base',   l: 'Base',   d: 'Cân bằng (khuyên dùng)' },
                  { v: 'small',  l: 'Small',  d: 'Chính xác' },
                  { v: 'medium', l: 'Medium', d: 'Rất chính xác' },
                ].map((o) => (
                  <button
                    key={o.v}
                    type="button"
                    onClick={() => setCfg({ ...cfg, whisperModel: o.v })}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition ${
                      cfg.whisperModel === o.v ? 'border-sky-500 bg-sky-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-sm font-semibold text-slate-800">{o.l}</span>
                    <span className="text-[11px] text-slate-500">{o.d}</span>
                  </button>
                ))}
              </div>
            </SettingBlock>
            <SettingBlock label="Timeout STT (giây)" hint="Không nhận diện được thì tự kết thúc">
              <input
                type="number"
                min="2"
                max="30"
                value={cfg.sttTimeout}
                onChange={(e) => setCfg({ ...cfg, sttTimeout: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-sky-500"
              />
            </SettingBlock>
          </div>

          {/* TTS */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">TTS (Text → Speech)</h2>
                <p className="text-[11px] text-slate-500">Giọng đọc AI giám khảo</p>
              </div>
            </div>
            <SettingBlock label="Giọng đọc" hint="Giọng theo ngôn ngữ đang chọn">
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { v: 'female-vi', l: 'Nữ miền Bắc',    icon: '♀' },
                  { v: 'male-vi',   l: 'Nam miền Bắc',    icon: '♂' },
                  { v: 'female-en', l: 'Female (US)',     icon: '♀' },
                  { v: 'male-en',   l: 'Male (US)',       icon: '♂' },
                ].map((o) => (
                  <button
                    key={o.v}
                    type="button"
                    onClick={() => setCfg({ ...cfg, ttsVoice: o.v })}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg border transition ${
                      cfg.ttsVoice === o.v ? 'border-sky-500 bg-sky-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-sm font-bold">
                      {o.icon}
                    </span>
                    <span className="text-sm font-medium text-slate-800">{o.l}</span>
                  </button>
                ))}
              </div>
            </SettingBlock>
          </div>
        </div>

        {/* Save bar */}
        <div className="sticky bottom-0 -mx-6 px-6 py-3 bg-white border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4" /> Lưu cấu hình
          </button>
        </div>
      </form>
    </div>
  );
}

function SettingBlock({ label, hint, children }) {
  return (
    <div>
      <div className="mb-2">
        <p className="text-xs font-bold text-slate-700">{label}</p>
        {hint && <p className="text-[10px] text-slate-500 mt-0.5">{hint}</p>}
      </div>
      {children}
    </div>
  );
}
