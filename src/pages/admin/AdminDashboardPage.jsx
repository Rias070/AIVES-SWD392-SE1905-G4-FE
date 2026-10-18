import React, { useState, useEffect } from 'react';
import { adminConfigApi, adminUserApi, adminSubjectApi } from '../../services/api';
import { 
  ShieldCheck, 
  Users, 
  UserCheck, 
  Settings, 
  Languages, 
  BookOpen, 
  CheckCircle2, 
  Search, 
  Plus, 
  SlidersHorizontal,
  UserPlus,
  Lock,
  Unlock,
  Trash2,
  X,
  AlertCircle,
  Edit2,
  Eye,
  EyeOff
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'assignments' | 'config'
  const [searchTerm, setSearchTerm] = useState('');
  const [actionNotice, setActionNotice] = useState(null);

  // ==========================================
  // TAB 1: USER MANAGEMENT STATE & LOGIC
  // ==========================================
  const initialUsers = [
    {
      id: 'usr-1',
      code: 'ADM-001',
      name: 'AIVES Administrator',
      email: 'admin@aives.edu.vn',
      role: 'ADMIN',
      status: 'ACTIVE',
      assignedSubjects: 'Toàn quyền quản trị',
    },
    {
      id: 'usr-2',
      code: 'LEC-104',
      name: 'GS.TS Nguyễn Hoàng Nam',
      email: 'lecturer@aives.edu.vn',
      role: 'LECTURER',
      status: 'ACTIVE',
      assignedSubjects: 'SWD392, SWP391, PRJ301',
    },
    {
      id: 'usr-3',
      code: 'STU-992',
      name: 'Trần Thị Mai',
      email: 'student@aives.edu.vn',
      role: 'STUDENT',
      status: 'ACTIVE',
      assignedSubjects: 'SWD392 (SE1905)',
    },
  ];

  const [usersList, setUsersList] = useState(initialUsers);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    code: '',
    name: '',
    email: '',
    role: 'LECTURER',
    assignedSubjects: '',
    password: 'Aives@2026',
    confirmPassword: 'Aives@2026',
  });

  // Fetch users from backend if available
  const fetchUsers = async () => {
    try {
      const res = await adminUserApi.getUsers();
      const data = res.data?.result || res.data?.data;
      if (Array.isArray(data) && data.length > 0) {
        setUsersList(data.map(u => ({
          id: u.id || u.uuid,
          code: u.code || `USR-${String(u.id).slice(0, 4)}`,
          name: u.fullName || u.name || u.email,
          email: u.email,
          role: u.role || 'STUDENT',
          status: u.status || (u.deletedAt ? 'INACTIVE' : 'ACTIVE'),
          assignedSubjects: u.assignedSubjects || 'Chưa phân công',
        })));
      }
    } catch (err) {
      // Keep existing users state
    }
  };

  const handleToggleUserStatus = async (user) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      if (adminUserApi.updateUserStatus) {
        await adminUserApi.updateUserStatus(user.id, newStatus);
      }
    } catch (e) {
      console.warn('Backend offline, toggling locally:', e);
    }
    setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
    showToast(`Đã ${newStatus === 'ACTIVE' ? 'mở khóa' : 'khóa'} tài khoản ${user.name}`);
  };

  const handleSoftDeleteUser = async (user) => {
    if (!window.confirm(`Xác nhận xóa mềm tài khoản ${user.name} (${user.email})?`)) return;
    try {
      if (adminUserApi.softDeleteUser) {
        await adminUserApi.softDeleteUser(user.id);
      }
    } catch (e) {
      console.warn('Backend offline, soft-deleting locally:', e);
    }
    setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, status: 'INACTIVE', deletedAt: new Date().toISOString() } : u));
    showToast(`Đã xóa mềm tài khoản ${user.name} (chuyển trạng thái INACTIVE & đánh dấu deleted_at)`);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) return;

    // Client-side validation: password match
    if (!newUserForm.password || newUserForm.password.length < 6) {
      showToast('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }
    if (newUserForm.password !== newUserForm.confirmPassword) {
      showToast('Mật khẩu nhập lại không khớp. Vui lòng kiểm tra lại!');
      return;
    }

    const createdUser = {
      id: `usr-${Date.now()}`,
      code: newUserForm.code || `USR-${Math.floor(100 + Math.random() * 900)}`,
      name: newUserForm.name,
      email: newUserForm.email,
      role: newUserForm.role,
      status: 'ACTIVE',
      assignedSubjects: newUserForm.assignedSubjects || 'Chưa phân công',
    };

    // Payload that matches BE UserCreateRequest
    const createPayload = {
      userCode: createdUser.code,
      fullName: createdUser.name,
      email: createdUser.email,
      password: newUserForm.password,
      roleName: createdUser.role,
      role: createdUser.role,
      status: 'ACTIVE',
      assignedSubjects: createdUser.assignedSubjects,
    };

    try {
      if (adminUserApi.createUser) {
        await adminUserApi.createUser(createPayload);
      }
    } catch (e) {
      console.warn('Backend offline or validation error, creating locally:', e);
      // Surface the BE error message to the admin if available
      const apiMsg = e?.response?.data?.message || e?.friendlyMessage;
      if (apiMsg) {
        showToast(`Lỗi từ máy chủ: ${apiMsg}`);
      }
    }

    setUsersList(prev => [createdUser, ...prev]);
    setIsCreateUserModalOpen(false);
    setNewUserForm({
      code: '',
      name: '',
      email: '',
      role: 'LECTURER',
      assignedSubjects: '',
      password: 'Aives@2026',
      confirmPassword: 'Aives@2026',
    });
    setShowCreatePassword(false);
    showToast(`Tạo thành công tài khoản ${createdUser.name} (${createdUser.role})`);
  };

  // Filtered users for search input
  const filteredUsers = usersList.filter(u => {
    const q = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.code.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  // ==========================================
  // TAB 2: SUBJECT ASSIGNMENT STATE & LOGIC
  // ==========================================
  const initialAssignments = [
    {
      id: 'sub-1',
      subjectCode: 'SWD392',
      subjectName: 'Software Architecture & Design',
      leadLecturer: 'GS.TS Nguyễn Hoàng Nam (lecturer@aives.edu.vn)',
      totalQuestions: 142,
      activeExams: 3,
      language: 'vi-VN',
      technicalTerms: 'Microservices, RESTful API, CQRS, Event-Driven, Docker',
    },
    {
      id: 'sub-2',
      subjectCode: 'SWP391',
      subjectName: 'Software Development Project',
      leadLecturer: 'GS.TS Nguyễn Hoàng Nam (lecturer@aives.edu.vn)',
      totalQuestions: 98,
      activeExams: 2,
      language: 'vi-VN',
      technicalTerms: 'Scrum, Agile, Sprint Backlog, CI/CD, Git Flow',
    },
    {
      id: 'sub-3',
      subjectCode: 'PRJ301',
      subjectName: 'Java Web Applications',
      leadLecturer: 'ThS. Lê Hoàng Nam (namlh@aives.edu.vn)',
      totalQuestions: 215,
      activeExams: 5,
      language: 'en-US',
      technicalTerms: 'Servlet Lifecycle, JSP, JDBC, MVC Pattern, Session Management',
    },
  ];

  const [subjectAssignments, setSubjectAssignments] = useState(initialAssignments);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedSubjectToAssign, setSelectedSubjectToAssign] = useState(null);
  const [newLecturerName, setNewLecturerName] = useState('');
  const [selectedSubjectLanguage, setSelectedSubjectLanguage] = useState('vi-VN');
  const [selectedSubjectTechnicalTerms, setSelectedSubjectTechnicalTerms] = useState('');

  const fetchSubjects = async () => {
    try {
      const res = await adminSubjectApi.getSubjects();
      const data = res.data?.result || res.data?.data;
      if (Array.isArray(data) && data.length > 0) {
        setSubjectAssignments(data.map(s => ({
          id: s.id,
          subjectCode: s.code || s.subjectCode,
          subjectName: s.name || s.subjectName,
          leadLecturer: s.leadLecturer || 'Chưa phân công giảng viên',
          totalQuestions: s.totalQuestions || 0,
          activeExams: s.activeExams || 0,
          language: s.language || localStorage.getItem(`aives_subject_lang_${s.code || s.subjectCode}`) || 'vi-VN',
          technicalTerms: s.technicalTerms || '',
        })));
      }
    } catch (e) {
      // Keep existing state
    }
  };

  const handleOpenAssignModal = (subj) => {
    setSelectedSubjectToAssign(subj);
    setNewLecturerName(subj.leadLecturer || '');
    const currentLang = subj.language || localStorage.getItem(`aives_subject_lang_${subj.subjectCode}`) || 'vi-VN';
    setSelectedSubjectLanguage(currentLang);
    setSelectedSubjectTechnicalTerms(subj.technicalTerms || '');
    setIsAssignModalOpen(true);
  };

  const handleSaveAssignment = async (e) => {
    e.preventDefault();
    if (!selectedSubjectToAssign || !newLecturerName) return;

    try {
      if (adminSubjectApi.assignSubject) {
        await adminSubjectApi.assignSubject({
          subjectId: selectedSubjectToAssign.id,
          lecturerName: newLecturerName,
        });
      }
      if (adminSubjectApi.updateSubjectLanguageConfig && selectedSubjectToAssign.id) {
        await adminSubjectApi.updateSubjectLanguageConfig(selectedSubjectToAssign.id, {
          language: selectedSubjectLanguage,
          technicalTerms: selectedSubjectTechnicalTerms,
        });
      }
    } catch (e) {
      console.warn('Backend offline, saving assignment and language locally:', e);
    }

    localStorage.setItem(`aives_subject_lang_${selectedSubjectToAssign.subjectCode}`, selectedSubjectLanguage);

    setSubjectAssignments(prev =>
      prev.map(s =>
        s.id === selectedSubjectToAssign.id
          ? { 
              ...s, 
              leadLecturer: newLecturerName,
              language: selectedSubjectLanguage,
              technicalTerms: selectedSubjectTechnicalTerms
            }
          : s
      )
    );
    setIsAssignModalOpen(false);
    showToast(`Đã cập nhật phân công & cấu hình ngôn ngữ (${selectedSubjectLanguage}) cho môn ${selectedSubjectToAssign.subjectCode}`);
  };

  const handleSoftDeleteSubject = async (subj) => {
    if (!window.confirm(`Xác nhận xóa mềm môn học ${subj.subjectCode} (${subj.subjectName})?`)) return;
    try {
      if (adminSubjectApi.softDeleteSubject) {
        await adminSubjectApi.softDeleteSubject(subj.id);
      }
    } catch (e) {
      console.warn('Backend offline, soft-deleting locally:', e);
    }
    setSubjectAssignments(prev => prev.filter(s => s.id !== subj.id));
    showToast(`Đã xóa mềm môn ${subj.subjectCode} khỏi danh mục hoạt động`);
  };

  // ==========================================
  // TAB 3: STT / TTS CONFIGURATION STATE & LOGIC
  // ==========================================
  const [aiConfig, setAiConfig] = useState({
    defaultLanguage: 'vi',
    maxFollowupTurns: 3,
    maxAnswerTimeSec: 180,
    isHumanInTheLoop: true,
  });

  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [saveConfigNotice, setSaveConfigNotice] = useState(null);

  const fetchAIVivaConfig = async () => {
    try {
      const res = await adminConfigApi.getAIVivaConfig();
      const payload = res.data?.result || res.data?.data;
      if (payload) {
        const langCode = payload.defaultLanguage?.toLowerCase().startsWith('en') ? 'en' : 'vi';
        setAiConfig({
          defaultLanguage: langCode,
          maxFollowupTurns: payload.maxFollowupTurns || payload.maxTurns || 3,
          maxAnswerTimeSec: payload.maxAnswerTimeSec || payload.turnTimeoutSeconds || 180,
          isHumanInTheLoop: payload.isHumanInTheLoop ?? true,
        });
      }
    } catch (err) {
      try {
        const stored = JSON.parse(localStorage.getItem('aives_ai_config') || '{}');
        if (stored.defaultLanguage) {
          setAiConfig((prev) => ({
            ...prev,
            defaultLanguage: stored.defaultLanguage.toLowerCase().startsWith('en') ? 'en' : 'vi',
            maxFollowupTurns: stored.maxFollowupTurns || prev.maxFollowupTurns,
            maxAnswerTimeSec: stored.maxAnswerTimeSec || prev.maxAnswerTimeSec,
          }));
        }
      } catch (e) {}
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'assignments') {
      fetchSubjects();
    } else if (activeTab === 'config') {
      fetchAIVivaConfig();
    }
  }, [activeTab]);

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setIsSavingConfig(true);
    const normalizedLang = aiConfig.defaultLanguage === 'en' ? 'en-US' : 'vi-VN';
    const configPayload = {
      defaultLanguage: normalizedLang,
      maxFollowupTurns: aiConfig.maxFollowupTurns,
      maxAnswerTimeSec: aiConfig.maxAnswerTimeSec,
      isHumanInTheLoop: aiConfig.isHumanInTheLoop,
    };

    try {
      await adminConfigApi.updateAIVivaConfig(configPayload);

      localStorage.setItem('aives_ai_config', JSON.stringify(configPayload));
      localStorage.setItem('aives_exam_lang', normalizedLang);

      setSaveConfigNotice({
        type: 'success',
        text: `Cấu hình ngôn ngữ STT/TTS (${normalizedLang}) và tham số AI Viva đã được cập nhật thành công cho toàn hệ thống!`,
      });
    } catch (err) {
      localStorage.setItem('aives_ai_config', JSON.stringify(configPayload));
      localStorage.setItem('aives_exam_lang', normalizedLang);

      const msg = err.friendlyMessage || 'Đã áp dụng cấu hình cục bộ (Backend API chưa sẵn sàng).';
      setSaveConfigNotice({
        type: 'warning',
        text: `Đã lưu cấu hình ngôn ngữ (${normalizedLang}) & tham số hệ thống. (${msg})`,
      });
    } finally {
      setIsSavingConfig(false);
      setTimeout(() => setSaveConfigNotice(null), 5000);
    }
  };

  const showToast = (message) => {
    setActionNotice(message);
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notice for User/Subject Actions */}
      {actionNotice && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-semibold shadow-lg flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
          <button onClick={() => setActionNotice(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2.5">
            <ShieldCheck className="w-8 h-8 text-sky-600" />
            Quản trị hệ thống
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-1">
            Quản lý tài khoản, phân công giảng dạy và cấu hình ca thi vấn đáp.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 self-start md:self-auto shadow-xs">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'users'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tài Khoản
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'assignments'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Phân Quyền Môn
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'config'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cấu hình thi
          </button>
        </div>
      </div>

      {/* TAB 1: Quản lý tài khoản (Users) */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã, họ tên, email, vai trò..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </div>

            <button 
              onClick={() => setIsCreateUserModalOpen(true)}
              className="btn-glacier-primary px-4 py-2.5 text-xs w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Thêm người dùng</span>
            </button>
          </div>

          <div className="glacier-light-card rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider">Mã ID</th>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider">Họ và Tên</th>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider">Vai trò</th>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider">Phụ Trách / Lớp</th>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider">Trạng Thái</th>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-slate-400 italic">
                        Không tìm thấy tài khoản người dùng phù hợp với từ khóa "{searchTerm}".
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-3.5 font-mono font-bold text-sky-800">{user.code}</td>
                        <td className="px-6 py-3.5 font-semibold text-slate-900">{user.name}</td>
                        <td className="px-6 py-3.5 text-slate-500">{user.email}</td>
                        <td className="px-6 py-3.5">
                          <span
                            className={`px-3 py-0.5 rounded-full font-bold text-[11px] border ${
                              user.role === 'ADMIN'
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                : user.role === 'LECTURER'
                                ? 'bg-sky-50 text-sky-700 border-sky-200'
                                : 'bg-cyan-50 text-cyan-700 border-cyan-200'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-slate-600 font-mono text-[11px]">{user.assignedSubjects}</td>
                        <td className="px-6 py-3.5">
                          <span 
                            className={`px-2.5 py-0.5 rounded-full border font-medium ${
                              user.status === 'ACTIVE'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            {user.status === 'ACTIVE' ? 'Đang hoạt động' : 'Đã khóa / Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-right space-x-2">
                          <button 
                            onClick={() => handleToggleUserStatus(user)}
                            className="px-2 py-1 rounded-md text-[11px] font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 inline-flex items-center gap-1"
                            title={user.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                          >
                            {user.status === 'ACTIVE' ? <Lock className="w-3 h-3 text-amber-600" /> : <Unlock className="w-3 h-3 text-emerald-600" />}
                            <span>{user.status === 'ACTIVE' ? 'Khóa' : 'Mở'}</span>
                          </button>
                          <button 
                            onClick={() => handleSoftDeleteUser(user)}
                            className="px-2 py-1 rounded-md text-[11px] font-semibold border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 inline-flex items-center gap-1"
                            title="Xóa tài khoản"
                          >
                            <Trash2 className="w-3 h-3 text-rose-600" />
                            <span>Xóa mềm</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Phân quyền Giảng viên & Môn học */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="glacier-light-panel p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Danh Mục Môn Học & Giảng Viên Phụ Trách</h3>
              <p className="text-xs text-slate-500">Giảng viên chỉ có quyền quản lý ngân hàng câu hỏi RAG và tổ chức ca thi cho môn học được phân công.</p>
            </div>
          </div>

          <div className="glacier-light-card rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider">Mã Môn</th>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider">Tên Học Phần</th>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider">Giảng Viên Trưởng Môn</th>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider">Ngôn Ngữ Khảo Thí (STT/TTS)</th>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider">Số Câu Hỏi RAG</th>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider">Ca Thi Đang Mở</th>
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-right">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {subjectAssignments.map((subj) => (
                    <tr key={subj.id || subj.subjectCode} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-3.5 font-mono font-bold text-sky-700">{subj.subjectCode}</td>
                      <td className="px-6 py-3.5 font-semibold text-slate-900">{subj.subjectName}</td>
                      <td className="px-6 py-3.5 text-slate-600 font-medium">{subj.leadLecturer}</td>
                      <td className="px-6 py-3.5">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 border shadow-2xs ${
                          subj.language === 'en-US'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          <span className="text-sm leading-none">{subj.language === 'en-US' ? '🇺🇸' : '🇻🇳'}</span>
                          <span>{subj.language === 'en-US' ? 'English (en-US)' : 'Tiếng Việt (vi-VN)'}</span>
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-slate-700 font-medium">{subj.totalQuestions} câu</td>
                      <td className="px-6 py-3.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                          {subj.activeExams} phiên thi
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right space-x-2">
                        <button 
                          onClick={() => handleOpenAssignModal(subj)}
                          className="px-2.5 py-1 rounded-md text-[11px] font-semibold border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-700 inline-flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3 text-sky-600" />
                          <span>Gán & Cấu hình</span>
                        </button>
                        <button 
                          onClick={() => handleSoftDeleteSubject(subj)}
                          className="px-2.5 py-1 rounded-md text-[11px] font-semibold border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3 text-rose-600" />
                          <span>Xóa môn</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Cấu hình ngôn ngữ STT / TTS */}
      {activeTab === 'config' && (
        <form onSubmit={handleSaveConfig} className="glacier-light-card p-6 md:p-8 rounded-2xl space-y-6 shadow-xs">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Languages className="w-5 h-5 text-sky-600" />
              Cấu Hình Ngôn Ngữ & Tham Số Nhận Diện Giọng Nói (STT / Whisper / TTS)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Điều chỉnh ngôn ngữ mặc định và tham số phỏng vấn AI cho toàn bộ hệ thống ca thi.
            </p>
          </div>

          {/* Toast Notice */}
          {saveConfigNotice && (
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{saveConfigNotice.text}</span>
              </div>
              <button
                type="button"
                onClick={() => setSaveConfigNotice(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <label className="block font-bold text-slate-800">Ngôn Ngữ Mặc Định Cho Ca Thi</label>
              <select
                id="stt-tts-lang-select"
                value={aiConfig.defaultLanguage}
                onChange={(e) => setAiConfig({ ...aiConfig, defaultLanguage: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-sky-500"
              >
                <option value="vi">Tiếng Việt (vi-VN)</option>
                <option value="en">English (en-US)</option>
              </select>
              <p className="text-[11px] text-slate-500">Áp dụng cho giọng đọc và nhận diện lời nói trong phòng thi.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <label className="block font-bold text-slate-800">Giới Hạn Lượt Hỏi Xoáy Tối Đa Mỗi Câu</label>
              <input 
                id="stt-tts-max-turns"
                type="number" 
                value={aiConfig.maxFollowupTurns}
                onChange={(e) => setAiConfig({ ...aiConfig, maxFollowupTurns: Math.max(1, Math.min(5, Number(e.target.value))) })}
                min={1} 
                max={5}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-sky-500"
              />
              <p className="text-[11px] text-slate-500">Số lần AI được phép hỏi sâu / làm rõ khi câu trả lời của sinh viên còn mơ hồ (Tối đa 5 lượt).</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <label className="block font-bold text-slate-800">Thời Gian Tối Đa Mỗi Lượt Trả Lời (Giây)</label>
              <input 
                id="stt-tts-timeout"
                type="number" 
                value={aiConfig.maxAnswerTimeSec}
                onChange={(e) => setAiConfig({ ...aiConfig, maxAnswerTimeSec: Number(e.target.value) })}
                step={10}
                min={30}
                max={300}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-sky-500"
              />
              <p className="text-[11px] text-slate-500">Đồng hồ đếm ngược tự động khóa micro khi sinh viên trả lời quá thời lượng quy định.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <label className="block font-bold text-slate-800">Chế Độ Chấm Điểm Thẩm Quyền</label>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] font-semibold">Giảng viên luôn là người chốt điểm cuối (Bắt buộc)</span>
              </div>
              <p className="text-[11px] text-slate-500">AI chỉ cung cấp điểm gợi ý dựa trên Rubric, không tự ý công bố điểm chính thức.</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <button
              id="btn-save-ai-config"
              type="submit"
              disabled={isSavingConfig}
              className="btn-glacier-primary px-6 py-2.5 text-xs flex items-center gap-2"
            >
              {isSavingConfig ? (
                <span>Đang lưu...</span>
              ) : (
                <span>Lưu Cấu Hình</span>
              )}
            </button>
          </div>
        </form>
      )}

      {/* MODAL: TẠO TÀI KHOẢN MỚI */}
      {isCreateUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-sky-600" />
                Thêm người dùng mới
              </h3>
              <button onClick={() => { setIsCreateUserModalOpen(false); setShowCreatePassword(false); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mã Định Danh (Tùy chọn)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: LEC-205, STU-108..."
                  value={newUserForm.code}
                  onChange={(e) => setNewUserForm({ ...newUserForm, code: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Họ và Tên *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: TS. Đặng Minh Tuấn"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Công Tác / Học Tập *</label>
                <input
                  type="email"
                  required
                  placeholder="Ví dụ: tuandm@aives.edu.vn"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Vai Trò Hệ Thống (Role)</label>
                <select
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-sky-500"
                >
                  <option value="LECTURER">LECTURER (Giảng viên khảo thí & thẩm định RAG)</option>
                  <option value="STUDENT">STUDENT (Sinh viên tham gia phòng thi viva)</option>
                  <option value="ADMIN">ADMIN (Quản trị viên toàn quyền)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phụ Trách Môn Học / Lớp Sinh Hoạt</label>
                <input
                  type="text"
                  placeholder="Ví dụ: SWD392, PRJ301"
                  value={newUserForm.assignedSubjects}
                  onChange={(e) => setNewUserForm({ ...newUserForm, assignedSubjects: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mật khẩu khởi tạo *</label>
                <div className="relative">
                  <input
                    type={showCreatePassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Mặc định: Aives@2026 (tối thiểu 6 ký tự)"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    className="w-full px-3 py-2 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-sky-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCreatePassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    title={showCreatePassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showCreatePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Mật khẩu phải có ít nhất 6 ký tự. Người dùng nên đổi mật khẩu sau lần đăng nhập đầu tiên.</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nhập lại mật khẩu *</label>
                <input
                  type={showCreatePassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="Nhập lại chính xác mật khẩu phía trên"
                  value={newUserForm.confirmPassword}
                  onChange={(e) => setNewUserForm({ ...newUserForm, confirmPassword: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl bg-slate-50 border text-slate-800 focus:outline-none font-mono ${
                    newUserForm.confirmPassword && newUserForm.password !== newUserForm.confirmPassword
                      ? 'border-rose-400 focus:border-rose-500'
                      : 'border-slate-200 focus:border-sky-500'
                  }`}
                />
                {newUserForm.confirmPassword && newUserForm.password !== newUserForm.confirmPassword && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1">Mật khẩu nhập lại không khớp!</p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setIsCreateUserModalOpen(false); setShowCreatePassword(false); }}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-glacier-primary px-5 py-2 font-semibold"
                >
                  Tạo Tài Khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: GÁN GIẢNG VIÊN PHỤ TRÁCH MÔN HỌC */}
      {isAssignModalOpen && selectedSubjectToAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-sky-600" />
                Phân Công Giảng Viên Cho Môn {selectedSubjectToAssign.subjectCode}
              </h3>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAssignment} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mã Môn & Tên Môn Học</label>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-700">
                  <span className="font-bold text-sky-700">{selectedSubjectToAssign.subjectCode}</span> - {selectedSubjectToAssign.subjectName}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Giảng Viên Trưởng Môn / Phụ Trách Khảo Thí *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: GS.TS Nguyễn Hoàng Nam (lecturer@aives.edu.vn)"
                  value={newLecturerName}
                  onChange={(e) => setNewLecturerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-sky-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">Giảng viên được phân công sẽ có toàn quyền duyệt ngân hàng câu hỏi RAG và tổ chức ca thi viva cho môn học này.</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ngôn Ngữ Khảo Thí (STT / TTS Language) *</label>
                <select
                  value={selectedSubjectLanguage}
                  onChange={(e) => setSelectedSubjectLanguage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:border-sky-500"
                >
                  <option value="vi-VN">🇻🇳 Tiếng Việt (vi-VN) - Nhận diện giọng nói STT & AI Voice tiếng Việt</option>
                  <option value="en-US">🇺🇸 English (en-US) - Speech-to-Text STT & AI Voice in English</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">Khi sinh viên vào phòng thi môn này, Web Speech API (STT) và giọng đọc AI (TTS) sẽ tự động đồng bộ theo ngôn ngữ này.</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Thuật Ngữ Chuyên Ngành Gợi Ý (Technical Glossary)</label>
                <textarea
                  rows={2}
                  placeholder="Ví dụ: Microservices, RESTful API, Docker, CI/CD, CQRS, Database Indexing..."
                  value={selectedSubjectTechnicalTerms}
                  onChange={(e) => setSelectedSubjectTechnicalTerms(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-sky-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">Gợi ý từ khóa chuyên ngành giúp Speech-to-Text nhận diện chính xác thuật ngữ khoa học/kỹ thuật.</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-glacier-primary px-5 py-2 font-semibold"
                >
                  Lưu Phân Công & Cấu Hình
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
