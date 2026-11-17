import { Metadata } from 'next';
import { SITE_CONFIG } from '@/config';
import { Shield, Lock, Eye, Database, Server } from 'lucide-react';

export const metadata: Metadata = {
  title: `Chính sách bảo mật | ${SITE_CONFIG.name}`,
  description: 'Chính sách bảo mật thông tin cá nhân và dữ liệu học tập tại KEIVerse.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Single Unified Document Card */}
        <div className="rounded-xl p-8 sm:p-12 bg-white border border-slate-200 shadow-sm relative overflow-hidden space-y-8">
          {/* Header Banner Accent Line */}
          <div className="h-2 w-full bg-galaxy absolute top-0 left-0" />

          {/* Header */}
          <div className="space-y-3 border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-galaxy-purple/10 text-galaxy-purple border border-galaxy-purple/20">
              <Shield className="size-3.5" />
              <span>Bảo mật thông tin</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-galaxy-purple tracking-tight">
              Chính sách bảo mật thông tin {SITE_CONFIG.name}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {SITE_CONFIG.name} cam kết bảo vệ sự riêng tư, thông tin cá nhân và dữ liệu học tập
              của toàn thể Giảng viên và Sinh viên theo tiêu chuẩn an toàn cao nhất.
            </p>
            <div className="text-xs text-slate-400 font-medium pt-1">
              Có hiệu lực từ: Tháng 11/2026 • Tuân thủ các quy định về an toàn dữ liệu số
            </div>
          </div>

          {/* Document Content Sections in 1 Card */}
          <div className="space-y-6">
            {/* Section 1 */}
            <section className="space-y-3 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-2.5 text-galaxy-purple font-bold text-lg">
                <Database className="size-5 shrink-0" />
                <h2>1. Dữ liệu Thu thập</h2>
              </div>
              <div className="text-slate-600 text-sm leading-relaxed space-y-2 pl-7.5">
                <p>
                  • <strong>Thông tin định danh:</strong> Họ và tên, email sinh viên/công vụ, mã số
                  sinh viên (MSSV) hoặc mã số giảng viên (MSGV), đơn vị trường học trực thuộc.
                </p>
                <p>
                  • <strong>Dữ liệu quá trình học tập:</strong> Điểm số, lịch sử làm bài trắc
                  nghiệm, bài tập nộp, tỷ lệ xem học liệu, điểm danh trực tuyến.
                </p>
                <p>
                  • <strong>Thông tin kỹ thuật:</strong> Địa chỉ IP, loại trình duyệt, nhật ký phiên
                  làm việc (session logs) phục vụ mục đích bảo mật và giám sát truy cập.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section className="space-y-3 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-2.5 text-galaxy-purple font-bold text-lg">
                <Eye className="size-5 shrink-0" />
                <h2>2. Mục đích Sử dụng Dữ liệu</h2>
              </div>
              <div className="text-slate-600 text-sm leading-relaxed space-y-2 pl-7.5">
                <p>
                  • Cung cấp dịch vụ quản lý học tập, tổ chức thi trắc nghiệm, thống kê tiến độ học
                  và tính điểm tự động.
                </p>
                <p>
                  • Hỗ trợ Giảng viên theo dõi năng lực học sinh, đánh giá kết quả học tập và hỗ trợ
                  kịp thời.
                </p>
                <p>
                  • Tối ưu hóa thuật toán gợi ý học tập và trợ lý ảo AI nhằm mang lại trải nghiệm
                  học tập cá nhân hóa.
                </p>
                <p>
                  • Tuyệt đối không bán, cho thuê hay thương mại hóa dữ liệu cá nhân của người dùng
                  cho bất kỳ bên thứ ba nào.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-3 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-2.5 text-galaxy-purple font-bold text-lg">
                <Lock className="size-5 shrink-0" />
                <h2>3. Cơ chế Bảo mật và Lưu trữ</h2>
              </div>
              <div className="text-slate-600 text-sm leading-relaxed space-y-2 pl-7.5">
                <p>
                  • Mật khẩu người dùng được băm một chiều an toàn bằng thuật toán mã hóa hiện đại
                  trước khi lưu vào cơ sở dữ liệu.
                </p>
                <p>
                  • Phiên đăng nhập được quản lý bằng HttpOnly Cookie với cơ chế Silent Token
                  Rotation để chống các cuộc tấn công XSS và trộm cắp phiên.
                </p>
                <p>
                  • Dữ liệu tệp đính kèm và bài nộp được lưu trữ biệt lập trên máy chủ lưu trữ đối
                  tượng chuẩn S3 MinIO.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5 text-galaxy-purple font-bold text-lg">
                <Server className="size-5 shrink-0" />
                <h2>4. Quyền của Người dùng với Dữ liệu Cá nhân</h2>
              </div>
              <div className="text-slate-600 text-sm leading-relaxed space-y-2 pl-7.5">
                <p>
                  • Bạn có quyền xem, cập nhật hoặc yêu cầu điều chỉnh thông tin hồ sơ thông qua
                  trang Hồ sơ cá nhân.
                </p>
                <p>
                  • Yêu cầu trích xuất dữ liệu học tập hoặc xóa tài khoản có thể gửi thông qua biểu
                  mẫu Liên hệ hoặc quản trị viên nhà trường.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
