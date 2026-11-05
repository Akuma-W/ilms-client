/**
 * Authentication and User Profile UI strings.
 * Language: Vietnamese (vi)
 */
export const authLocales = {
  login: {
    title: 'Đăng nhập vào KEIVerse',
    subtitle: 'Hệ thống Quản lý Học tập Tương tác Thông minh',
    emailLabel: 'Địa chỉ Email',
    emailPlaceholder: 'name@school.edu.vn',
    passwordLabel: 'Mật khẩu',
    passwordPlaceholder: '••••••••',
    rememberMe: 'Ghi nhớ đăng nhập',
    forgotPassword: 'Quên mật khẩu?',
    submitButton: 'Đăng nhập',
    googleButton: 'Tiếp tục với Google',
    noAccount: 'Chưa có tài khoản?',
    registerLink: 'Đăng ký ngay',
    successToast: 'Đăng nhập thành công!',
    errorToast: 'Email hoặc mật khẩu không chính xác.',
  },
  register: {
    title: 'Tạo tài khoản mới',
    subtitle: 'Bắt đầu trải nghiệm học tập số thông minh',
    nameLabel: 'Họ và tên',
    namePlaceholder: 'Nguyễn Văn A',
    emailLabel: 'Địa chỉ Email',
    passwordLabel: 'Mật khẩu',
    confirmPasswordLabel: 'Xác nhận mật khẩu',
    schoolLabel: 'Trường học trực thuộc',
    schoolPlaceholder: 'Chọn trường học của bạn',
    roleLabel: 'Vai trò của bạn',
    roleStudent: 'Học sinh / Sinh viên',
    roleTeacher: 'Giáo viên / Giảng viên',
    submitButton: 'Hoàn tất đăng ký',
    alreadyHaveAccount: 'Đã có tài khoản?',
    loginLink: 'Đăng nhập',
    successToast: 'Đăng ký tài khoản thành công!',
  },
  onboarding: {
    title: 'Hoàn thiện hồ sơ Google',
    subtitle: 'Vui lòng cung cấp thêm thông tin để kích hoạt tài khoản',
    schoolRequired: 'Vui lòng chọn trường học',
    roleRequired: 'Vui lòng chọn vai trò',
    submitButton: 'Kích hoạt tài khoản',
  },
} as const;
