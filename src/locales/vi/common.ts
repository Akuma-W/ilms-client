/**
 * Common user-facing UI labels, buttons, actions, and fallback messages.
 * Language: Vietnamese (vi)
 */
export const commonLocales = {
  actions: {
    save: 'Lưu',
    cancel: 'Hủy',
    create: 'Tạo mới',
    edit: 'Chỉnh sửa',
    delete: 'Xóa',
    confirm: 'Xác nhận',
    search: 'Tìm kiếm...',
    filter: 'Bộ lọc',
    refresh: 'Làm mới',
    back: 'Quay lại',
    close: 'Đóng',
    submit: 'Nộp bài',
    join: 'Tham gia',
    leave: 'Rời khỏi',
    viewDetails: 'Xem chi tiết',
    download: 'Tải xuống',
    upload: 'Tải lên',
    copy: 'Sao chép',
    copied: 'Đã sao chép!',
  },
  states: {
    loading: 'Đang tải dữ liệu...',
    submitting: 'Đang xử lý...',
    empty: 'Chưa có dữ liệu hiển thị.',
    error: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
    noResults: 'Không tìm thấy kết quả phù hợp.',
  },
  nav: {
    home: 'Trang chủ',
    classes: 'Lớp học',
    quizzes: 'Bài trắc nghiệm',
    tools: 'Công cụ AI',
    profile: 'Hồ sơ cá nhân',
    admin: 'Quản trị hệ thống',
    contact: 'Liên hệ',
    logout: 'Đăng xuất',
  },
  pagination: {
    previous: 'Trang trước',
    next: 'Trang sau',
    pageOf: 'Trang {page} trên {total}',
  },
} as const;
