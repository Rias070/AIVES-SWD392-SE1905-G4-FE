import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminUserApi, adminSubjectApi } from '../../services/api';
import {
  Users,
  Shield,
  BookOpen,
  GraduationCap,
  Search,
  Filter,
  Plus,
  Upload,
  CheckCircle2,
  AlertCircle,
  Clock,
  MoreVertical,
  Check,
  X,
  FileSpreadsheet,
  Layers,
  ChevronRight,
  ExternalLink,
  Edit,
  Trash2,
  Lock,
  RefreshCw
} from 'lucide-react';

// Available course catalog to choose from when assigning to lecturers
const AVAILABLE_COURSES = [
  { code: 'SWD392', title: 'Software Architecture & Design', classes: '02 lớp (SE1905, SE1906) • 60 sinh viên' },
  { code: 'SWP391', title: 'Software Development Project', classes: '01 lớp (SE1901) • 30 sinh viên' },
  { code: 'PRJ301', title: 'Java Web Applications', classes: '03 lớp (SE1801, SE1802) • 90 sinh viên' },
  { code: 'ML101', title: 'Machine Learning Fundamentals', classes: '02 lớp (AI1801) • 55 sinh viên' },
  { code: 'CS301', title: 'Cấu trúc dữ liệu & Thuật toán nâng cao', classes: '03 lớp (SE1701, SE1702, SE1704) • 84 sinh viên' },
  { code: 'AI204', title: 'Nhập môn Xử lý Ngôn ngữ Tự nhiên & LLM', classes: '02 lớp (AI1701) • 62 sinh viên' },
  { code: 'SE401', title: 'Kiến trúc Phần mềm Nâng cao', classes: '01 lớp (SE1601) • 40 sinh viên' },
];

export default function UserManagementPage() {
  const navigate = useNavigate();

  // Filters & Tabs
  const [roleTab, setRoleTab] = useState('ALL'); // 'ALL' | 'ADMIN' | 'LECTURER' | 'STUDENT'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLecturer, setSelectedLecturer] = useState({
    id: 'GV-10294',
    name: 'TS. Lê Quang',
    email: 'quanglt@fpt.edu.vn',
    title: 'Giám khảo trưởng',
    examsCount: 32,
    avatar: 'LQ',
    courses: [
      {
        code: 'CS301',
        title: 'Cấu trúc dữ liệu & Thuật toán nâng cao',
        classes: '03 lớp (SE1701, SE1702, SE1704) • 84 sinh viên',
        canApproveRAG: true,
        canEditRubric: true,
      },
      {
        code: 'AI204',
        title: 'Nhập môn Xử lý Ngôn ngữ Tự nhiên & LLM',
        classes: '02 lớp (AI1701) • 62 sinh viên',
        canApproveRAG: true,
        canEditRubric: true,
      },
    ],
  });

  // UI state for adding new course & toast feedback
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [selectedCourseToAdd, setSelectedCourseToAdd] = useState('');
  const [assignmentNotice, setAssignmentNotice] = useState(null);

  // Select lecturer & fetch their assignments (Connected to adminSubjectApi)
  const handleSelectLecturerRow = async (u) => {
    if (u.role !== 'LECTURER') return;
    try {
      const res = await adminSubjectApi.getLecturerAssignments(u.id);
      if (res.data && res.data.data && Array.isArray(res.data.data)) {
        setSelectedLecturer({
          id: u.id,
          name: u.name,
          email: u.email,
          title: 'Giám khảo trưởng',
          examsCount: 32,
          avatar: u.avatarText,
          courses: res.data.data,
        });
        return;
      }
    } catch (err) {
      console.warn('API getLecturerAssignments warning, using fallback selection:', err);
    }

    setSelectedLecturer({
      id: u.id,
      name: u.name,
      email: u.email,
      title: 'Giám khảo trưởng',
      examsCount: 32,
      avatar: u.avatarText,
      courses: selectedLecturer.id === u.id ? selectedLecturer.courses : [
        {
          code: 'CS301',
          title: 'Cấu trúc dữ liệu & Thuật toán nâng cao',
          classes: '03 lớp • 84 sinh viên',
          canApproveRAG: true,
          canEditRubric: true,
        },
      ],
    });
  };

  // Toggle permission checkbox for a course (Connected to adminSubjectApi)
  const handleTogglePermission = async (courseCode, permissionType) => {
    const updatedCourses = selectedLecturer.courses.map((c) =>
      c.code === courseCode ? { ...c, [permissionType]: !c[permissionType] } : c
    );
    const targetCourse = updatedCourses.find((c) => c.code === courseCode);
    
    // Optimistic UI update
    setSelectedLecturer((prev) => ({ ...prev, courses: updatedCourses }));

    try {
      await adminSubjectApi.updateAssignmentPermissions(courseCode, {
        canApproveRAG: targetCourse.canApproveRAG,
        canEditRubric: targetCourse.canEditRubric,
      });
    } catch (err) {
      console.warn('API update assignment permissions warning:', err);
    }
  };

  // Remove course from lecturer assignment (Connected to adminSubjectApi)
  const handleRemoveCourse = async (courseCode) => {
    setSelectedLecturer((prev) => ({
      ...prev,
      courses: prev.courses.filter((c) => c.code !== courseCode),
    }));

    try {
      await adminSubjectApi.removeAssignment(courseCode);
      setAssignmentNotice({ type: 'success', text: `Đã hủy phân công môn ${courseCode} khỏi giảng viên!` });
      setTimeout(() => setAssignmentNotice(null), 3000);
    } catch (err) {
      console.warn('API remove assignment warning:', err);
    }
  };

  // Add selected course to lecturer assignment (Connected to adminSubjectApi)
  const handleAddCourse = async () => {
    if (!selectedCourseToAdd) return;
    const foundCourse = AVAILABLE_COURSES.find((c) => c.code === selectedCourseToAdd);
    if (!foundCourse) return;

    // Avoid duplicate assignment
    if (selectedLecturer.courses.some((c) => c.code === foundCourse.code)) {
      setAssignmentNotice({ type: 'warning', text: `Giảng viên đã được gán môn ${foundCourse.code} trước đó!` });
      setTimeout(() => setAssignmentNotice(null), 3000);
      return;
    }

    try {
      await adminSubjectApi.assignSubject({
        lecturerId: selectedLecturer.id,
        subjectCode: foundCourse.code,
        canApproveRAG: true,
        canEditRubric: true,
      });
    } catch (err) {
      console.warn('API assignSubject warning:', err);
    }

    setSelectedLecturer((prev) => ({
      ...prev,
      courses: [
        ...prev.courses,
        {
          code: foundCourse.code,
          title: foundCourse.title,
          classes: foundCourse.classes,
          canApproveRAG: true,
          canEditRubric: true,
        },
      ],
    }));
    setIsAddingCourse(false);
    setSelectedCourseToAdd('');
    setAssignmentNotice({ type: 'success', text: `Đã bổ sung môn ${foundCourse.code} vào danh sách phân công!` });
    setTimeout(() => setAssignmentNotice(null), 3000);
  };

  // Save overall course assignment (Connected to adminSubjectApi)
  const handleSaveAssignment = async () => {
    try {
      await adminSubjectApi.assignSubject({
        lecturerId: selectedLecturer.id,
        courses: selectedLecturer.courses,
      });
    } catch (err) {
      console.warn('API save assignment warning:', err);
    }

    setAssignmentNotice({
      type: 'success',
      text: `Đã lưu thành công phân công môn học cho ${selectedLecturer.name}!`,
    });
    setTimeout(() => setAssignmentNotice(null), 4000);
  };

  // Users list state (stateful so add/edit/import dynamically update the table)
  const [usersListState, setUsersListState] = useState([
    {
      id: 'GV-10294',
      name: 'TS. Lê Quang',
      email: 'quanglt@fpt.edu.vn',
      role: 'LECTURER',
      roleBadge: 'Giảng viên / GK',
      roleBadgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      assigned: 'CS301, AI204',
      status: 'active',
      statusText: 'Đang hoạt động',
      avatarText: 'LQ',
    },
    {
      id: 'GV-10042',
      name: 'ThS. Trần Thị Hạnh',
      email: 'hanhtt@fpt.edu.vn',
      role: 'LECTURER',
      roleBadge: 'Giảng viên / GK',
      roleBadgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      assigned: 'SE401 (Kiến trúc PM)',
      status: 'active',
      statusText: 'Đang hoạt động',
      avatarText: 'TH',
    },
    {
      id: 'AD-00012',
      name: 'Nguyễn Văn An',
      email: 'annv.sys@fpt.edu.vn',
      role: 'ADMIN',
      roleBadge: 'System Admin',
      roleBadgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      assigned: 'Toàn quyền hệ thống',
      status: 'active',
      statusText: 'Đang hoạt động',
      avatarText: 'NA',
    },
    {
      id: 'SE170291',
      name: 'Bùi Quang Nhật',
      email: 'nhatbqse170291@fpt.edu.vn',
      role: 'STUDENT',
      roleBadge: 'Sinh viên (K17)',
      roleBadgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      assigned: 'Lớp SE1704 - AI204',
      status: 'active',
      statusText: 'Đang hoạt động',
      avatarText: 'BN',
    },
    {
      id: 'SE164821',
      name: 'Đặng Minh Khôi',
      email: 'khoidmse164821@fpt.edu.vn',
      role: 'STUDENT',
      roleBadge: 'Sinh viên (K16)',
      roleBadgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      assigned: 'Lớp SE1601 - CS301',
      status: 'pending',
      statusText: 'Chờ xác thực SSO',
      avatarText: 'DK',
    },
    {
      id: 'AI170644',
      name: 'Vũ Thùy Linh',
      email: 'linhvt_ai17@fpt.edu.vn',
      role: 'STUDENT',
      roleBadge: 'Sinh viên (K17)',
      roleBadgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      assigned: 'Lớp AI1702 - AI204',
      status: 'active',
      statusText: 'Đang hoạt động',
      avatarText: 'VL',
    },
  ]);

  // API Loading & Submitting States
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);

  // Fetch users list from Backend API with local fallback
  const fetchUsersFromApi = async () => {
    setIsLoadingUsers(true);
    try {
      const params = {
        search: searchQuery || undefined,
        role: roleTab !== 'ALL' ? roleTab : undefined,
      };
      const response = await adminUserApi.getUsers(params);
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setUsersListState(response.data.data);
      }
    } catch (error) {
      console.warn('Backend API offline / not running yet. Using client-side state fallback:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsersFromApi();
  }, [roleTab, searchQuery]);

  // Modal 1: Add / Edit User Modal State & Validation Errors
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userModalMode, setUserModalMode] = useState('CREATE'); // 'CREATE' | 'EDIT'
  const [userFormData, setUserFormData] = useState({
    id: '',
    name: '',
    email: '',
    role: 'STUDENT',
    assigned: '',
    status: 'active',
  });
  const [userFormErrors, setUserFormErrors] = useState({
    id: '',
    name: '',
    email: '',
  });

  // Real-time single field validation
  const validateUserField = (field, value) => {
    let error = '';
    const val = value ? value.trim() : '';

    if (field === 'id') {
      if (!val) {
        error = 'Mã định danh không được để trống';
      } else if (!/^[A-Za-z0-9_-]{3,20}$/.test(val)) {
        error = 'Mã định danh gồm 3-20 ký tự (VD: SE190501, GV-10294)';
      }
    }

    if (field === 'name') {
      if (!val) {
        error = 'Họ và tên không được để trống';
      } else if (val.length < 2) {
        error = 'Họ và tên phải dài ít nhất 2 ký tự';
      }
    }

    if (field === 'email') {
      if (!val) {
        error = 'Email không được để trống';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        error = 'Định dạng email không hợp lệ';
      } else {
        const domain = val.toLowerCase().split('@')[1];
        const allowedDomains = ['fpt.edu.vn', 'fe.edu.vn', 'fpt.com'];
        if (!allowedDomains.includes(domain)) {
          error = 'Email phải thuộc tên miền @fpt.edu.vn hoặc @fe.edu.vn';
        }
      }
    }

    setUserFormErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  };

  // Validate entire user form before submission
  const validateUserForm = () => {
    const errId = validateUserField('id', userFormData.id);
    const errName = validateUserField('name', userFormData.name);
    const errEmail = validateUserField('email', userFormData.email);
    return !errId && !errName && !errEmail;
  };

  // Modal 2: Excel Import Modal State
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [selectedExcelFile, setSelectedExcelFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [excelPreviewData, setExcelPreviewData] = useState([]);

  // Toast / General Global Page Notification
  const [pageToast, setPageToast] = useState(null);

  const showToast = (text, type = 'success') => {
    setPageToast({ text, type });
    setTimeout(() => setPageToast(null), 4000);
  };

  // Open Create User Modal
  const handleOpenCreateModal = () => {
    setUserModalMode('CREATE');
    setUserFormData({
      id: `SE${Math.floor(100000 + Math.random() * 900000)}`,
      name: '',
      email: '',
      role: 'STUDENT',
      assigned: 'Lớp SE1905',
      status: 'active',
    });
    setUserFormErrors({ id: '', name: '', email: '' });
    setIsUserModalOpen(true);
  };

  // Open Edit User Modal
  const handleOpenEditModal = (user) => {
    setUserModalMode('EDIT');
    setUserFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      assigned: user.assigned,
      status: user.status,
    });
    setUserFormErrors({ id: '', name: '', email: '' });
    setIsUserModalOpen(true);
  };

  // Submit Add / Edit User Form (Connected to adminUserApi)
  const handleSaveUserForm = async (e) => {
    e.preventDefault();
    if (!validateUserForm()) {
      showToast('Vui lòng kiểm tra và sửa các thông tin bị lỗi màu đỏ!', 'warning');
      return;
    }

    setIsSubmittingUser(true);
    const roleBadges = {
      ADMIN: { badge: 'System Admin', color: 'bg-amber-50 text-amber-800 border-amber-200' },
      LECTURER: { badge: 'Giảng viên / GK', color: 'bg-sky-50 text-sky-700 border-sky-200' },
      STUDENT: { badge: 'Sinh viên', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    };

    const initials = userFormData.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    try {
      if (userModalMode === 'CREATE') {
        await adminUserApi.createUser({
          userCode: userFormData.id,
          fullName: userFormData.name,
          email: userFormData.email,
          role: userFormData.role,
          assignedSubjects: userFormData.assigned,
          status: userFormData.status === 'active' ? 'ACTIVE' : 'PENDING_SSO',
        });
      } else {
        await adminUserApi.updateUser(userFormData.id, {
          fullName: userFormData.name,
          email: userFormData.email,
          role: userFormData.role,
          assignedSubjects: userFormData.assigned,
          status: userFormData.status === 'active' ? 'ACTIVE' : 'PENDING_SSO',
        });
      }
    } catch (error) {
      console.warn('API call error. Applying state changes locally:', error);
    } finally {
      setIsSubmittingUser(false);
    }

    if (userModalMode === 'CREATE') {
      const newUser = {
        id: userFormData.id || `USR-${Math.floor(1000 + Math.random() * 9000)}`,
        name: userFormData.name,
        email: userFormData.email,
        role: userFormData.role,
        roleBadge: roleBadges[userFormData.role].badge,
        roleBadgeColor: roleBadges[userFormData.role].color,
        assigned: userFormData.assigned || 'Chưa phân công',
        status: userFormData.status,
        statusText: userFormData.status === 'active' ? 'Đang hoạt động' : 'Chờ xác thực SSO',
        avatarText: initials || 'US',
      };
      setUsersListState([newUser, ...usersListState]);
      showToast(`Đã thêm thành công tài khoản người dùng ${newUser.name}!`);
    } else {
      setUsersListState((prev) =>
        prev.map((u) =>
          u.id === userFormData.id
            ? {
                ...u,
                name: userFormData.name,
                email: userFormData.email,
                role: userFormData.role,
                roleBadge: roleBadges[userFormData.role].badge,
                roleBadgeColor: roleBadges[userFormData.role].color,
                assigned: userFormData.assigned,
                status: userFormData.status,
                statusText: userFormData.status === 'active' ? 'Đang hoạt động' : 'Chờ xác thực SSO',
                avatarText: initials || u.avatarText,
              }
            : u
        )
      );
      showToast(`Đã cập nhật thông tin tài khoản ${userFormData.name}!`);
    }

    setIsUserModalOpen(false);
  };

  // Open Excel Import Modal
  const handleOpenExcelModal = () => {
    setSelectedExcelFile(null);
    setExcelPreviewData([
      { id: 'SE190501', name: 'Nguyễn Văn Bình', email: 'binhnv.se1905@fpt.edu.vn', role: 'STUDENT', assigned: 'SE1905' },
      { id: 'SE190502', name: 'Trần Thị Hà', email: 'hatt.se1905@fpt.edu.vn', role: 'STUDENT', assigned: 'SE1905' },
      { id: 'SE190503', name: 'Lê Hoàng Minh', email: 'minhlh.se1905@fpt.edu.vn', role: 'STUDENT', assigned: 'SE1905' },
      { id: 'GV-20011', name: 'TS. Phạm Đức Anh', email: 'anhpd@fpt.edu.vn', role: 'LECTURER', assigned: 'SWD392' },
    ]);
    setIsExcelModalOpen(true);
  };

  // Handle Excel File Drop/Select
  const handleExcelFileSelect = (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setSelectedExcelFile(file);
    }
  };

  // Submit Excel Import Process (Connected to adminUserApi)
  const handleConfirmExcelImport = async () => {
    setIsImporting(true);

    if (selectedExcelFile) {
      try {
        await adminUserApi.importUserExcel(selectedExcelFile);
      } catch (error) {
        console.warn('API Excel import error. Falling back to local preview data:', error);
      }
    }

    setTimeout(() => {
      setIsImporting(false);
      const importedUsers = excelPreviewData.map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
        roleBadge: row.role === 'LECTURER' ? 'Giảng viên / GK' : 'Sinh viên (K19)',
        roleBadgeColor: row.role === 'LECTURER' ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-cyan-50 text-cyan-700 border-cyan-200',
        assigned: row.assigned,
        status: 'active',
        statusText: 'Đang hoạt động',
        avatarText: row.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase(),
      }));

      setUsersListState((prev) => [...importedUsers, ...prev]);
      setIsExcelModalOpen(false);
      showToast(`Đã import thành công ${importedUsers.length} tài khoản từ tệp Excel!`);
    }, 800);
  };

  const filteredUsers = usersListState.filter((u) => {
    if (roleTab !== 'ALL' && u.role !== roleTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Global Toast Notification */}
      {pageToast && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-3 shadow-sm ${
            pageToast.type === 'warning'
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{pageToast.text}</span>
          </div>
          <button onClick={() => setPageToast(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Breadcrumb & Action bar */}
      <div className="p-4 md:px-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Left: Breadcrumb */}
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Cổng Quản trị viên</span>
            <span className="text-slate-300">›</span>
            <span className="text-sky-700 font-semibold">Quản lý người dùng & Phân công môn học</span>
          </div>
          <h1 className="text-base md:text-lg font-bold text-slate-900 mt-1">
            Phân quyền hệ thống & Phân công giảng dạy
          </h1>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenExcelModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Import danh sách Excel</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="btn-glacier-primary px-4 py-2 text-xs font-semibold shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm người dùng mới</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">TỔNG SỐ NGƯỜI DÙNG</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">3,420</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              +12.4%
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            <span>Sinh viên: <strong className="text-slate-800">3,250</strong></span>
            <span>•</span>
            <span>Giảng viên: <strong className="text-slate-800">150</strong></span>
            <span>•</span>
            <span>Admin: <strong className="text-slate-800">20</strong></span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">TỶ LỆ KÍCH HOẠT TÀI KHOẢN</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">98.4%</span>
            <span className="text-[10px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded font-mono">
              SSO FPT Edu Sync
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            <span>Đã kích hoạt: <strong className="text-emerald-700">3,365</strong></span>
            <span>•</span>
            <span>Chờ xác thực: <strong className="text-amber-700">55</strong></span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">MÔN HỌC ĐÃ PHÂN CÔNG</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">48 / 48</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              100% Hoàn tất
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            <span>RAG Học liệu: <strong className="text-sky-700">48 Ready</strong></span>
            <span>•</span>
            <span>Barem chấm AI: <strong className="text-emerald-700">Đã chuẩn hóa</strong></span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Table (8 cols) / Assignment Drawer (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT TABLE (8 COLS) ================= */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-5 md:p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    Danh sách tài khoản hệ thống
                  </h3>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    3,420 bản ghi
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Phân quyền vai trò, quản lý tài khoản định danh sinh viên và hội đồng chấm thi.
                </p>
              </div>

              {/* Role filter tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setRoleTab('ALL')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${roleTab === 'ALL' ? 'bg-white text-sky-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setRoleTab('ADMIN')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${roleTab === 'ADMIN' ? 'bg-white text-sky-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Admin (20)
                </button>
                <button
                  onClick={() => setRoleTab('LECTURER')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${roleTab === 'LECTURER' ? 'bg-white text-sky-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Giảng viên (150)
                </button>
                <button
                  onClick={() => setRoleTab('STUDENT')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${roleTab === 'STUDENT' ? 'bg-white text-sky-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Sinh viên (3.2k)
                </button>
              </div>
            </div>

            {/* Filter Search Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
              <div className="relative sm:col-span-2">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nhập tên, MSSV, email FPT..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              <select className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs focus:outline-none">
                <option>Viện Trí tuệ Nhân tạo</option>
                <option>Khoa Kỹ thuật Phần mềm</option>
              </select>

              <select className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs focus:outline-none">
                <option>Đang hoạt động (Active)</option>
                <option>Chờ kích hoạt</option>
              </select>

              <button
                onClick={fetchUsersFromApi}
                disabled={isLoadingUsers}
                title="Tải lại danh sách"
                className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors flex items-center justify-center gap-1 font-semibold disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingUsers ? 'animate-spin text-sky-600' : ''}`} />
                <span className="hidden sm:inline">Tải lại</span>
              </button>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/70 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 pr-3">Mã định danh</th>
                    <th className="pb-3 px-3">Họ và tên</th>
                    <th className="pb-3 px-3">Email FPT/Edu</th>
                    <th className="pb-3 px-3">Vai trò</th>
                    <th className="pb-3 px-3">Môn phụ trách / Lớp</th>
                    <th className="pb-3 px-3">Trạng thái</th>
                    <th className="pb-3 pl-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoadingUsers ? (
                    Array.from({ length: 5 }).map((_, idx) => (
                      <tr key={`skeleton-user-${idx}`} className="animate-pulse">
                        <td className="py-4 pr-3">
                          <div className="h-4 w-16 bg-slate-200/80 rounded-md"></div>
                        </td>
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-200/80"></div>
                            <div className="h-4 w-28 bg-slate-200/80 rounded-md"></div>
                          </div>
                        </td>
                        <td className="py-4 px-3">
                          <div className="h-4 w-36 bg-slate-200/80 rounded-md"></div>
                        </td>
                        <td className="py-4 px-3">
                          <div className="h-5 w-24 bg-slate-200/80 rounded-full"></div>
                        </td>
                        <td className="py-4 px-3">
                          <div className="h-4 w-28 bg-slate-200/80 rounded-md"></div>
                        </td>
                        <td className="py-4 px-3">
                          <div className="h-5 w-20 bg-slate-200/80 rounded-full"></div>
                        </td>
                        <td className="py-4 pl-3 text-right">
                          <div className="h-6 w-16 bg-slate-200/80 rounded-lg ml-auto"></div>
                        </td>
                      </tr>
                    ))
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shadow-2xs">
                            <Search className="w-6 h-6" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-slate-800">Không tìm thấy người dùng phù hợp</h4>
                            <p className="text-xs text-slate-500">
                              Không có tài khoản nào khớp với từ khóa{' '}
                              {searchQuery && <span className="font-semibold text-slate-700">"{searchQuery}"</span>}
                              {roleTab !== 'ALL' && (
                                <span> tại vai trò <strong className="text-slate-700">{roleTab}</strong></span>
                              )}.
                            </p>
                          </div>
                          {(searchQuery || roleTab !== 'ALL') && (
                            <button
                              onClick={() => {
                                setSearchQuery('');
                                setRoleTab('ALL');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Xóa bộ lọc tìm kiếm</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const isSelected = selectedLecturer?.id === u.id;
                      return (
                        <tr
                          key={u.id}
                          onClick={() => handleSelectLecturerRow(u)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-sky-50/80' : 'hover:bg-slate-50/60'
                          }`}
                        >
                          <td className="py-3.5 pr-3 font-mono font-bold text-sky-700">
                            {u.id}
                          </td>

                          <td className="py-3.5 px-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                                {u.avatarText}
                              </div>
                              <span className="font-bold text-slate-900">{u.name}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-3 text-slate-600 font-mono text-[11px]">
                            {u.email}
                          </td>

                          <td className="py-3.5 px-3 whitespace-nowrap">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${u.roleBadgeColor}`}>
                              {u.roleBadge}
                            </span>
                          </td>

                          <td className="py-3.5 px-3 text-slate-700 font-medium">
                            {u.assigned}
                          </td>

                          <td className="py-3.5 px-3 whitespace-nowrap">
                            {u.status === 'active' ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Hoạt động
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                Chờ SSO
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 pl-3 text-right whitespace-nowrap">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEditModal(u);
                              }}
                              className="px-2.5 py-1 text-[11px] font-bold text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded-lg border border-sky-100 transition-colors"
                            >
                              Chỉnh sửa
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
              <span>Hiển thị 6 / trang trong tổng số 3,420 người dùng</span>
              <div className="flex items-center gap-1 font-mono">
                <button className="px-2 py-1 rounded border border-slate-200 bg-slate-50">‹</button>
                <button className="px-2.5 py-1 rounded bg-sky-600 text-white font-bold">1</button>
                <button className="px-2.5 py-1 rounded border border-slate-200">2</button>
                <button className="px-2.5 py-1 rounded border border-slate-200">3</button>
                <button className="px-2 py-1 rounded border border-slate-200 bg-slate-50">›</button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT ASSIGNMENT DRAWER (4 COLS) ================= */}
        <div className="lg:col-span-4 space-y-5">
          <div className="p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  HỌC KỲ: SPRING 2026
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">Bảng phân công giảng dạy</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                Đang chỉnh sửa
              </span>
            </div>

            {/* Lecturer Profile Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                  {selectedLecturer.avatar}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{selectedLecturer.name}</h4>
                  <span className="text-[10px] text-sky-700 font-semibold block">{selectedLecturer.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{selectedLecturer.email}</span>
                </div>
              </div>
              <div className="text-right text-[10px] font-mono text-slate-500">
                <span>Mã: {selectedLecturer.id}</span>
                <span className="block font-bold text-slate-700">Ca thi: {selectedLecturer.examsCount} ca</span>
              </div>
            </div>

            {/* Notification Banner */}
            {assignmentNotice && (
              <div
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between gap-2 ${
                  assignmentNotice.type === 'warning'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{assignmentNotice.text}</span>
                </div>
                <button onClick={() => setAssignmentNotice(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Assigned Courses List */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                MÔN HỌC & HỌC PHẦN ĐƯỢC PHÂN CÔNG ({selectedLecturer.courses.length} môn)
              </span>

              {selectedLecturer.courses.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  Giảng viên chưa được gán môn học nào.
                </div>
              ) : (
                selectedLecturer.courses.map((c) => (
                  <div key={c.code} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-sky-100 text-sky-800">
                            {c.code}
                          </span>
                          <h5 className="text-xs font-bold text-slate-900">{c.title}</h5>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">{c.classes}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveCourse(c.code)}
                        title="Hủy gán môn này"
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Permissions checkboxes */}
                    <div className="space-y-1.5 text-xs text-slate-600 pt-1 border-t border-slate-100">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={c.canApproveRAG}
                          onChange={() => handleTogglePermission(c.code, 'canApproveRAG')}
                          className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        />
                        <span className="text-[11px]">Phân quyền duyệt học liệu RAG (Knowledge Hub)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={c.canEditRubric}
                          onChange={() => handleTogglePermission(c.code, 'canEditRubric')}
                          className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        />
                        <span className="text-[11px]">Hiệu chỉnh Barem chấm điểm vấn đáp AI (Rubric Editor)</span>
                      </label>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add course section / select */}
            {isAddingCourse ? (
              <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/50 space-y-3">
                <label className="block text-xs font-bold text-slate-800">Chọn môn học cần bổ sung:</label>
                <select
                  value={selectedCourseToAdd}
                  onChange={(e) => setSelectedCourseToAdd(e.target.value)}
                  className="w-full p-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                >
                  <option value="">-- Chọn môn học từ danh mục --</option>
                  {AVAILABLE_COURSES.map((course) => (
                    <option key={course.code} value={course.code}>
                      [{course.code}] {course.title}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddCourse}
                    disabled={!selectedCourseToAdd}
                    className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-bold transition-colors"
                  >
                    Xác nhận thêm
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingCourse(false);
                      setSelectedCourseToAdd('');
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingCourse(true)}
                className="w-full py-2.5 rounded-xl border border-dashed border-sky-300 hover:bg-sky-50 text-xs font-semibold text-sky-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Chọn môn học bổ sung để phân công...</span>
              </button>
            )}

            {/* Audit log notice */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 space-y-1 flex items-start gap-2">
              <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Tài khoản này được cấp quyền ký số bảo mật trên mô hình AI Viva Voce RAG. Mọi thay đổi barem chấm sẽ được ghi nhận vào Audit Log của Viện Đào Tạo.
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={handleSaveAssignment}
                className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Lưu phân công môn học
              </button>
              <button
                onClick={() => setAssignmentNotice({ type: 'warning', text: 'Đã hủy các thay đổi chưa lưu!' })}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL 1: THÊM / SỬA NGƯỜI DÙNG ================= */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {userModalMode === 'CREATE' ? 'Thêm Người Dùng Mới' : 'Chỉnh Sửa Thông Tin Người Dùng'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {userModalMode === 'CREATE'
                    ? 'Khởi tạo tài khoản định danh mới trên hệ thống AIVES'
                    : `Cập nhật thông tin tài khoản ${userFormData.id}`}
                </p>
              </div>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveUserForm} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Mã định danh (MSSV/MSGV)</label>
                  <input
                    type="text"
                    value={userFormData.id}
                    onChange={(e) => {
                      setUserFormData({ ...userFormData, id: e.target.value });
                      validateUserField('id', e.target.value);
                    }}
                    required
                    readOnly={userModalMode === 'EDIT'}
                    placeholder="VD: SE190501"
                    className={`w-full px-3 py-2 rounded-xl bg-slate-50 border font-mono text-slate-900 focus:outline-none transition-colors ${
                      userFormErrors.id
                        ? 'border-rose-400 bg-rose-50/20 text-rose-900 focus:border-rose-500'
                        : 'border-slate-200 focus:border-sky-500'
                    }`}
                  />
                  {userFormErrors.id && (
                    <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{userFormErrors.id}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Vai Trò (Role)</label>
                  <select
                    value={userFormData.role}
                    onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-sky-500"
                  >
                    <option value="STUDENT">Sinh viên (STUDENT)</option>
                    <option value="LECTURER">Giảng viên (LECTURER)</option>
                    <option value="ADMIN">Quản trị viên (ADMIN)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">Họ và Tên</label>
                <input
                  type="text"
                  value={userFormData.name}
                  onChange={(e) => {
                    setUserFormData({ ...userFormData, name: e.target.value });
                    validateUserField('name', e.target.value);
                  }}
                  required
                  placeholder="VD: Nguyễn Văn Anh"
                  className={`w-full px-3 py-2 rounded-xl bg-slate-50 border text-slate-900 focus:outline-none transition-colors ${
                    userFormErrors.name
                      ? 'border-rose-400 bg-rose-50/20 text-rose-900 focus:border-rose-500'
                      : 'border-slate-200 focus:border-sky-500'
                  }`}
                />
                {userFormErrors.name && (
                  <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{userFormErrors.name}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-slate-700">Email FPT / Edu</label>
                  <span className="text-[10px] text-sky-700 font-mono font-medium">Domain: @fpt.edu.vn / @fe.edu.vn</span>
                </div>
                <input
                  type="email"
                  value={userFormData.email}
                  onChange={(e) => {
                    setUserFormData({ ...userFormData, email: e.target.value });
                    validateUserField('email', e.target.value);
                  }}
                  required
                  placeholder="anhnv@fpt.edu.vn"
                  className={`w-full px-3 py-2 rounded-xl bg-slate-50 border font-mono text-slate-900 focus:outline-none transition-colors ${
                    userFormErrors.email
                      ? 'border-rose-400 bg-rose-50/20 text-rose-900 focus:border-rose-500'
                      : 'border-slate-200 focus:border-sky-500'
                  }`}
                />
                {userFormErrors.email && (
                  <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{userFormErrors.email}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Lớp / Môn phụ trách</label>
                  <input
                    type="text"
                    value={userFormData.assigned}
                    onChange={(e) => setUserFormData({ ...userFormData, assigned: e.target.value })}
                    placeholder="VD: Lớp SE1905"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Trạng Thái Tài Khoản</label>
                  <select
                    value={userFormData.status}
                    onChange={(e) => setUserFormData({ ...userFormData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-sky-500"
                  >
                    <option value="active">Hoạt động (Active)</option>
                    <option value="pending">Chờ xác thực SSO</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100"
                >
                  Hủy bỏ
                </button>
                <button type="submit" disabled={isSubmittingUser} className="btn-glacier-primary px-5 py-2 font-semibold">
                  {isSubmittingUser
                    ? 'Đang xử lý...'
                    : userModalMode === 'CREATE'
                    ? 'Tạo Tài Khoản'
                    : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: IMPORT DANH SÁCH EXCEL ================= */}
      {isExcelModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  Import Danh Sách Người Dùng Từ File Excel (.xlsx)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Tải lên file danh sách sinh viên/giảng viên để tạo tài khoản hàng loạt
                </p>
              </div>
              <button
                onClick={() => setIsExcelModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              {/* File Dropzone */}
              <div className="p-6 border-2 border-dashed border-slate-200 hover:border-emerald-400 bg-slate-50/50 rounded-2xl text-center space-y-2 cursor-pointer relative">
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleExcelFileSelect}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-800">
                    {selectedExcelFile ? selectedExcelFile.name : 'Kéo thả tệp Excel vào đây hoặc click để chọn'}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Hỗ trợ định dạng .xlsx, .xls (Tối đa 10MB)</p>
                </div>
              </div>

              {/* Preview Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-slate-600 font-semibold">
                  <span>Bảng xem trước dữ liệu trích xuất từ File (4 bản ghi):</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono">
                    Sẵn sàng Import
                  </span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase">
                      <tr>
                        <th className="px-3 py-2">Mã ID</th>
                        <th className="px-3 py-2">Họ và Tên</th>
                        <th className="px-3 py-2">Email</th>
                        <th className="px-3 py-2">Role</th>
                        <th className="px-3 py-2">Lớp / Môn</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {excelPreviewData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="px-3 py-2 font-mono font-bold text-sky-700">{row.id}</td>
                          <td className="px-3 py-2 font-medium">{row.name}</td>
                          <td className="px-3 py-2 text-slate-500 font-mono">{row.email}</td>
                          <td className="px-3 py-2">
                            <span
                              className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                                row.role === 'LECTURER' ? 'bg-sky-50 text-sky-700' : 'bg-cyan-50 text-cyan-700'
                              }`}
                            >
                              {row.role}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-slate-600">{row.assigned}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsExcelModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleConfirmExcelImport}
                  disabled={isImporting}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  {isImporting ? (
                    <span>Đang xử lý import...</span>
                  ) : (
                    <>
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>Xác nhận Import ({excelPreviewData.length} bản ghi)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
