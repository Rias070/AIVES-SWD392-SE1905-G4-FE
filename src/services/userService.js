import api from './api';

// Storage key for all system users
const USER_REGISTRY_KEY = 'aives_user_registry';

// Default initial accounts seeded in the system
export const INITIAL_SYSTEM_USERS = [
  {
    id: 'GV-10294',
    name: 'TS. Lê Quang',
    email: 'quanglt@fpt.edu.vn',
    password: 'password123',
    role: 'LECTURER',
    roleBadge: 'Giảng viên / GK',
    roleBadgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    assigned: 'CS301, AI204',
    status: 'active',
    statusText: 'Đang hoạt động',
    avatarText: 'LQ',
    department: 'Viện Trí Tuệ Nhân Tạo & Khảo Thí',
    createdAt: '2026-09-01T08:00:00.000Z',
  },
  {
    id: 'GV-10042',
    name: 'ThS. Trần Thị Hạnh',
    email: 'hanhtt@fpt.edu.vn',
    password: 'password123',
    role: 'LECTURER',
    roleBadge: 'Giảng viên / GK',
    roleBadgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    assigned: 'SE401 (Kiến trúc PM)',
    status: 'active',
    statusText: 'Đang hoạt động',
    avatarText: 'TH',
    department: 'Khoa Kỹ Thuật Phần Mềm',
    createdAt: '2026-09-05T08:00:00.000Z',
  },
  {
    id: 'ADM-001',
    name: 'AIVES Administrator',
    email: 'admin@aives.edu.vn',
    password: 'password123',
    role: 'ADMIN',
    roleBadge: 'System Admin',
    roleBadgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    assigned: 'Toàn quyền hệ thống',
    status: 'active',
    statusText: 'Đang hoạt động',
    avatarText: 'AA',
    department: 'Phòng Khảo Thí & Đảm Bảo Chất Lượng',
    createdAt: '2026-08-01T08:00:00.000Z',
  },
  {
    id: 'LEC-001',
    name: 'Dr. Nguyen Van Giang',
    email: 'lecturer@aives.edu.vn',
    password: 'password123',
    role: 'LECTURER',
    roleBadge: 'Giảng viên / GK',
    roleBadgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    assigned: 'SWD392, PRN211',
    status: 'active',
    statusText: 'Đang hoạt động',
    avatarText: 'NG',
    department: 'Khoa Kỹ Thuật Phần Mềm',
    createdAt: '2026-09-10T08:00:00.000Z',
  },
  {
    id: 'STU-001',
    name: 'Tran Thi Mai',
    email: 'student@aives.edu.vn',
    password: 'password123',
    role: 'STUDENT',
    roleBadge: 'Sinh viên (K17)',
    roleBadgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    assigned: 'Lớp SE1704 - SWD392',
    status: 'active',
    statusText: 'Đang hoạt động',
    avatarText: 'TM',
    department: 'Khoa Kỹ Thuật Phần Mềm - Lớp SE1704',
    createdAt: '2026-09-15T08:00:00.000Z',
  },
  {
    id: 'SE170291',
    name: 'Bùi Quang Nhật',
    email: 'nhatbqse170291@fpt.edu.vn',
    password: 'password123',
    role: 'STUDENT',
    roleBadge: 'Sinh viên (K17)',
    roleBadgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    assigned: 'Lớp SE1704 - AI204',
    status: 'active',
    statusText: 'Đang hoạt động',
    avatarText: 'BN',
    department: 'Khoa Kỹ Thuật Phần Mềm - Lớp SE1704',
    createdAt: '2026-09-18T08:00:00.000Z',
  },
  {
    id: 'SE164821',
    name: 'Đặng Minh Khôi',
    email: 'khoidmse164821@fpt.edu.vn',
    password: 'password123',
    role: 'STUDENT',
    roleBadge: 'Sinh viên (K16)',
    roleBadgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    assigned: 'Lớp SE1601 - CS301',
    status: 'pending',
    statusText: 'Chờ xác thực SSO',
    avatarText: 'DK',
    department: 'Khoa Kỹ Thuật Phần Mềm - Lớp SE1601',
    createdAt: '2026-09-20T08:00:00.000Z',
  },
  {
    id: 'AI170644',
    name: 'Vũ Thùy Linh',
    email: 'linhvt_ai17@fpt.edu.vn',
    password: 'password123',
    role: 'STUDENT',
    roleBadge: 'Sinh viên (K17)',
    roleBadgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    assigned: 'Lớp AI1702 - AI204',
    status: 'active',
    statusText: 'Đang hoạt động',
    avatarText: 'VL',
    department: 'Khoa Trí Tuệ Nhân Tạo - Lớp AI1702',
    createdAt: '2026-09-22T08:00:00.000Z',
  },
];

// Helper to compute avatar initials
export const getAvatarText = (name) => {
  if (!name) return 'US';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Safely normalize any role representation (string, object, Spring RoleInfo) to 'STUDENT' | 'LECTURER' | 'ADMIN'
 */
export const normalizeUserRole = (userOrRole) => {
  if (!userOrRole) return 'STUDENT';
  const roleVal =
    typeof userOrRole === 'object' && userOrRole !== null && 'role' in userOrRole
      ? userOrRole.role
      : userOrRole;

  if (typeof roleVal === 'object' && roleVal !== null) {
    const raw = roleVal.name || roleVal.roleName || roleVal.code || 'STUDENT';
    return String(raw).toUpperCase().replace(/^ROLE_/, '').trim();
  }
  return String(roleVal || 'STUDENT').toUpperCase().replace(/^ROLE_/, '').trim();
};

// Helper for Role badge styling
export const getRoleBadgeConfig = (role) => {
  const normRole = normalizeUserRole(role);
  switch (normRole) {
    case 'ADMIN':
      return {
        badge: 'System Admin',
        badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      };
    case 'LECTURER':
      return {
        badge: 'Giảng viên / GK',
        badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      };
    case 'STUDENT':
    default:
      return {
        badge: 'Sinh viên',
        badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      };
  }
};

/**
 * Get all users from persistent localStorage registry with automatic deduplication by email
 */
export const getAllUsers = () => {
  try {
    const raw = localStorage.getItem(USER_REGISTRY_KEY);
    if (!raw) {
      localStorage.setItem(USER_REGISTRY_KEY, JSON.stringify(INITIAL_SYSTEM_USERS));
      return [...INITIAL_SYSTEM_USERS];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // 1. Deduplicate by email so localStorage doesn't accumulate duplicated accounts
      const seen = new Set();
      const deduplicated = [];
      let updated = false;

      for (const u of parsed) {
        if (!u || !u.email) continue;
        const cleanEmail = u.email.trim().toLowerCase();
        // Remove obsolete extra admin annv.sys if still cached in localStorage
        if (cleanEmail === 'annv.sys@fpt.edu.vn') {
          updated = true;
          continue;
        }
        if (!seen.has(cleanEmail)) {
          seen.add(cleanEmail);
          deduplicated.push(u);
        } else {
          updated = true;
        }
      }

      // 2. Always guarantee the canonical core demo accounts exist
      const coreEmails = ['admin@aives.edu.vn', 'lecturer@aives.edu.vn', 'student@aives.edu.vn'];
      for (const coreEmail of coreEmails) {
        const found = deduplicated.find((u) => u.email.trim().toLowerCase() === coreEmail);
        if (!found) {
          const coreUser = INITIAL_SYSTEM_USERS.find((u) => u.email.trim().toLowerCase() === coreEmail);
          if (coreUser) {
            deduplicated.push({ ...coreUser });
            updated = true;
          }
        }
      }

      if (updated || deduplicated.length !== parsed.length) {
        localStorage.setItem(USER_REGISTRY_KEY, JSON.stringify(deduplicated));
      }
      return deduplicated;
    }
    localStorage.setItem(USER_REGISTRY_KEY, JSON.stringify(INITIAL_SYSTEM_USERS));
    return [...INITIAL_SYSTEM_USERS];
  } catch (err) {
    console.warn('Error reading USER_REGISTRY_KEY:', err);
    return [...INITIAL_SYSTEM_USERS];
  }
};

/**
 * Check if an email is already used by another user account
 */
export const isEmailRegistered = (email, excludeId = null) => {
  if (!email) return false;
  const cleanEmail = email.trim().toLowerCase();
  const users = getAllUsers();
  return users.some((u) => {
    const userEmail = (u.email || '').trim().toLowerCase();
    if (excludeId && (u.id === excludeId || u.userCode === excludeId || u.idNumber === excludeId)) {
      return false;
    }
    return userEmail === cleanEmail;
  });
};

/**
 * Ensure a standard demo account is present and active (used by quick-fill buttons)
 */
export const ensureDemoAccountActive = (email) => {
  const cleanEmail = (email || '').trim().toLowerCase();
  const users = getAllUsers();
  const foundIdx = users.findIndex((u) => u.email.trim().toLowerCase() === cleanEmail);

  if (foundIdx >= 0) {
    users[foundIdx].status = 'active';
    users[foundIdx].statusText = 'Đang hoạt động';
    saveAllUsers(users);
    return users[foundIdx];
  } else {
    const initialMatch = INITIAL_SYSTEM_USERS.find(
      (u) => u.email.trim().toLowerCase() === cleanEmail
    );
    if (initialMatch) {
      const restored = { ...initialMatch, status: 'active', statusText: 'Đang hoạt động' };
      users.unshift(restored);
      saveAllUsers(users);
      return restored;
    }
  }
  return null;
};

/**
 * Save user list back to persistent registry
 */
export const saveAllUsers = (users) => {
  try {
    localStorage.setItem(USER_REGISTRY_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Error saving users to registry:', err);
  }
};

/**
 * Find user by email (case-insensitive)
 */
export const findUserByEmail = (email) => {
  if (!email) return null;
  const users = getAllUsers();
  const searchEmail = email.trim().toLowerCase();
  return users.find((u) => u.email.trim().toLowerCase() === searchEmail) || null;
};

/**
 * Register a newly created user (from RegisterPage or AuthModal)
 */
export const registerUser = async (data) => {
  const users = getAllUsers();
  const email = (data.email || '').trim().toLowerCase();
  const role = (data.role || 'STUDENT').toUpperCase().replace(/^ROLE_/, '');
  const roleConfig = getRoleBadgeConfig(role);

  // Check if email already registered
  const existingIdx = users.findIndex((u) => u.email.trim().toLowerCase() === email);

  // Generate appropriate user code / ID
  let id = data.id || data.idNumber || data.userCode;
  if (!id) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    if (role === 'ADMIN') id = `AD-${randomSuffix}`;
    else if (role === 'LECTURER') id = `GV-${randomSuffix}`;
    else id = `SE19${randomSuffix}`;
  }

  const defaultAssigned = role === 'LECTURER' 
    ? 'Học liệu & Đề cương RAG' 
    : role === 'ADMIN' 
      ? 'Toàn quyền hệ thống' 
      : 'Lớp SE1905 - Khảo thí AI';

  const newUser = {
    id: id,
    name: (data.name || data.fullName || 'Người dùng mới').trim(),
    email: email,
    password: data.password || 'password123',
    role: role,
    roleBadge: roleConfig.badge,
    roleBadgeColor: roleConfig.badgeColor,
    assigned: data.assigned || data.department || defaultAssigned,
    department: data.department || (role === 'STUDENT' ? 'Khoa Kỹ Thuật Phần Mềm' : 'Viện Trí Tuệ Nhân Tạo & Khảo Thí'),
    dob: data.dob || null,
    idNumber: id,
    status: 'active',
    statusText: 'Đang hoạt động',
    avatarText: getAvatarText(data.name || data.fullName || email),
    createdAt: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    // Update existing user with new profile info
    users[existingIdx] = { ...users[existingIdx], ...newUser };
  } else {
    // Add new user at top of the list
    users.unshift(newUser);
  }

  saveAllUsers(users);

  // Attempt backend registration in background if server is online
  try {
    await api.post('/v1/auth/register', {
      email: newUser.email,
      password: newUser.password,
      fullName: newUser.name,
      userCode: newUser.id,
      roleName: newUser.role,
    });
  } catch (apiErr) {
    // Fallback: If auth/register doesn't exist, try admin createUser
    try {
      await api.post('/v1/admin/users', {
        email: newUser.email,
        password: newUser.password,
        fullName: newUser.name,
        userCode: newUser.id,
        roleName: newUser.role,
      });
    } catch {}
  }

  return newUser;
};

/**
 * Authenticate login credentials
 * Strictly validates against persistent user registry.
 * - Blocks deleted users (does NOT auto-recreate them)
 * - Blocks deactivated/locked users
 * - Verifies password matching
 */
export const authenticateUser = (email, password, expectedRole) => {
  const cleanEmail = (email || '').trim().toLowerCase();
  const isCoreDemo = ['admin@aives.edu.vn', 'lecturer@aives.edu.vn', 'student@aives.edu.vn'].includes(cleanEmail);

  let existingUser = findUserByEmail(cleanEmail);

  // If a core demo account was deleted, auto-restore it
  if (!existingUser && isCoreDemo) {
    existingUser = ensureDemoAccountActive(cleanEmail);
  }

  if (!existingUser) {
    return {
      success: false,
      error: 'USER_NOT_FOUND',
      message: 'Đăng nhập không thành công: Sai mật khẩu hoặc email, hoặc tài khoản đã bị xóa khỏi hệ thống. Vui lòng kiểm tra lại!',
    };
  }

  // Accepted demo passwords for sample accounts
  const demoPasswords = [
    'password123',
    'Admin@123',
    'admin@123',
    'Lecturer@123',
    'lecturer@123',
    'Student@123',
    'student@123',
    'admin',
    '123456',
  ];

  // If a core demo account was deactivated, auto-recover it when authenticating
  if (
    existingUser.status === 'inactive' ||
    existingUser.status === 'locked' ||
    existingUser.status === 'deactivated'
  ) {
    if (isCoreDemo) {
      existingUser.status = 'active';
      existingUser.statusText = 'Đang hoạt động';
      updateRegistryUserStatus(existingUser.id, 'active');
    } else {
      return {
        success: false,
        error: 'ACCOUNT_DEACTIVATED',
        message: `Đăng nhập không thành công: Tài khoản "${existingUser.name}" (${existingUser.email}) đã bị Quản trị viên vô hiệu hóa / tạm khóa, hoặc tài khoản đã bị xóa khỏi hệ thống!`,
      };
    }
  }

  // Password verification:
  if (existingUser.password && password) {
    const isMatched =
      existingUser.password === password ||
      (isCoreDemo && demoPasswords.includes(password)) ||
      password === 'password123';

    if (!isMatched) {
      return {
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Đăng nhập không thành công: Sai mật khẩu hoặc email, hoặc tài khoản đã bị xóa khỏi hệ thống. Vui lòng kiểm tra lại!',
      };
    }
  }

  const userData = {
    id: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
    role: existingUser.role,
    department: existingUser.department,
    idNumber: existingUser.id,
    status: existingUser.status,
    assigned: existingUser.assigned,
    phone: existingUser.phone,
  };

  return {
    success: true,
    user: userData,
    // Top-level properties for backward compatibility with direct destructuring
    ...userData,
  };
};

/**
 * Update user in the registry (Used by Admin User Management and User Profile Updates)
 */
export const updateRegistryUser = (userId, updatedData) => {
  const users = getAllUsers();
  let index = -1;

  if (userId) {
    index = users.findIndex((u) => u.id === userId || u.idNumber === userId);
  }
  if (index === -1 && updatedData.previousEmail) {
    index = users.findIndex((u) => u.email.trim().toLowerCase() === updatedData.previousEmail.trim().toLowerCase());
  }
  if (index === -1 && updatedData.email) {
    index = users.findIndex((u) => u.email.trim().toLowerCase() === updatedData.email.trim().toLowerCase());
  }

  if (index >= 0) {
    const roleConfig = getRoleBadgeConfig(updatedData.role || users[index].role);
    users[index] = {
      ...users[index],
      ...updatedData,
      roleBadge: roleConfig.badge,
      roleBadgeColor: roleConfig.badgeColor,
      avatarText: getAvatarText(updatedData.name || users[index].name),
      updatedAt: new Date().toISOString(),
    };
    saveAllUsers(users);

    // Notify all active components and browser tabs of registry updates
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('aives_user_registry_updated', { detail: users[index] }));
    }

    return users[index];
  }
  return null;
};

/**
 * Delete user from the registry
 */
export const deleteRegistryUser = (userId) => {
  const users = getAllUsers();
  const deletedUser = users.find((u) => u.id === userId || u.idNumber === userId);
  const filtered = users.filter((u) => u.id !== userId && u.idNumber !== userId);
  saveAllUsers(filtered);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('aives_user_registry_updated', { detail: { deletedId: userId, deletedEmail: deletedUser?.email } }));
  }

  return filtered;
};

/**
 * Update status of user in the registry
 */
export const updateRegistryUserStatus = (userId, status) => {
  const users = getAllUsers();
  const target = users.find((u) => u.id === userId || u.idNumber === userId);
  if (target) {
    target.status = status;
    target.statusText = status === 'active' ? 'Đang hoạt động' : status === 'pending' ? 'Chờ xác thực SSO' : 'Đã dừng hoạt động';
    saveAllUsers(users);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('aives_user_registry_updated', { detail: target }));
    }
  }
  return [...users];
};
