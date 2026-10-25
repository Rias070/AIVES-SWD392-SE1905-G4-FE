import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  XCircle, 
  Mail, 
  ArrowRight, 
  RefreshCw, 
  Bot, 
  ShieldCheck, 
  AlertCircle,
  Home
} from 'lucide-react';
import { authApi } from '../../services/api';

export default function ActivationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('LOADING'); // 'LOADING' | 'SUCCESS' | 'ERROR' | 'IDLE'
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState(null);

  // Resend email state
  const [resendEmail, setResendEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState(null);
  const [resendError, setResendError] = useState(null);

  useEffect(() => {
    if (!token) {
      setStatus('IDLE');
      return;
    }

    let isMounted = true;
    const verifyToken = async () => {
      setStatus('LOADING');
      try {
        const response = await authApi.activate(token);
        if (isMounted) {
          const res = response.data;
          setStatus('SUCCESS');
          setMessage(res.message || 'Tài khoản của bạn đã được kích hoạt thành công!');
          if (res.result) {
            setUserData(res.result);
          }
        }
      } catch (err) {
        if (isMounted) {
          setStatus('ERROR');
          setMessage(err.friendlyMessage || 'Mã xác thực không hợp lệ hoặc liên kết đã hết hạn.');
        }
      }
    };

    verifyToken();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail.trim()) {
      setResendError('Vui lòng nhập địa chỉ email.');
      return;
    }
    setIsResending(true);
    setResendError(null);
    setResendMessage(null);
    try {
      const response = await authApi.resendActivation(resendEmail.trim());
      setResendMessage(response.data?.message || 'Email kích hoạt mới đã được gửi. Vui lòng kiểm tra hộp thư.');
    } catch (err) {
      setResendError(err.friendlyMessage || 'Không thể gửi lại email kích hoạt. Vui lòng thử lại sau.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Decorative glacier background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-xl p-8 relative z-10">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 via-sky-600 to-cyan-600 p-[1px] shadow-md shadow-sky-500/20 items-center justify-center mb-3">
            <div className="w-full h-full bg-white rounded-[15px] flex items-center justify-center">
              <Bot className="w-6 h-6 text-sky-600" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">AI Viva Voice Pro</h2>
          <p className="text-xs text-slate-500 mt-1">Xác thực & Kích hoạt Tài khoản Người dùng</p>
        </div>

        {/* State: LOADING */}
        {status === 'LOADING' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center animate-spin">
              <RefreshCw className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-800">Đang kích hoạt tài khoản...</h3>
              <p className="text-xs text-slate-500 mt-1">Hệ thống đang kiểm tra chữ ký mã token và kích hoạt quyền truy cập.</p>
            </div>
          </div>
        )}

        {/* State: SUCCESS */}
        {status === 'SUCCESS' && (
          <div className="text-center py-4 space-y-5">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Kích Hoạt Thành Công!</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{message}</p>
            </div>

            {userData && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-semibold text-slate-800">{userData.email || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Vai trò:</span>
                  <span className="font-semibold text-sky-700">{userData.role || 'STUDENT'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Trạng thái:</span>
                  <span className="font-semibold text-emerald-700">ACTIVE</span>
                </div>
              </div>
            )}

            <button
              onClick={() => navigate('/login')}
              className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-600/20"
            >
              <span>Đăng nhập vào hệ thống</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* State: ERROR or IDLE (Request Resend Form) */}
        {(status === 'ERROR' || status === 'IDLE') && (
          <div className="space-y-6">
            {status === 'ERROR' ? (
              <div className="text-center py-2 space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Kích Hoạt Không Thành Công</h3>
                  <p className="text-xs text-rose-600 mt-1 leading-relaxed">{message}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-2 space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-sky-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Yêu Cầu Kích Hoạt Tài Khoản</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Nhập email đăng ký của bạn để nhận liên kết kích hoạt mới.
                </p>
              </div>
            )}

            {/* Resend Form */}
            <form onSubmit={handleResend} className="space-y-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Địa chỉ Email đăng ký
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    placeholder="nguyenvana@gmail.com"
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {resendError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{resendError}</span>
                </div>
              )}

              {resendMessage && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{resendMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isResending}
                className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-sm"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang gửi lại email...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-3.5 h-3.5" />
                    <span>Gửi lại mã kích hoạt</span>
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center justify-between pt-2 text-xs">
              <Link to="/login" className="text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1">
                <span>Quay lại Đăng nhập</span>
              </Link>
              <Link to="/" className="text-slate-500 hover:text-slate-700 flex items-center gap-1">
                <Home className="w-3.5 h-3.5" />
                <span>Trang chủ</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
