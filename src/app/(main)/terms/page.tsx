import { Metadata } from 'next';
import { SITE_CONFIG } from '@/config';
import { FileText, ShieldCheck, UserCheck, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: `Điều khoản sử dụng | ${SITE_CONFIG.name}`,
  description: 'Quy định và điều khoản sử dụng nền tảng học tập trực tuyến KEIVerse.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Single Unified Document Card */}
        <div className="rounded-xl p-8 sm:p-12 bg-white border border-slate-200 shadow-sm relative overflow-hidden space-y-8">
          {/* Header Banner Accent Line */}
          <div className="h-2 w-full bg-galaxy absolute top-0 left-0" />

          {/* Header */}
          <div className="space-y-3 border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-galaxy-blue/10 text-galaxy-blue border border-galaxy-blue/20">
              <FileText className="size-3.5" />
              <span>Pháp lý & Quy chế</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-galaxy-blue tracking-tight">
              Điều khoản sử dụng nền tảng {SITE_CONFIG.name}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Chào mừng bạn đến với {SITE_CONFIG.name}. Bằng việc truy cập hoặc sử dụng hệ thống,
              bạn đồng ý tuân thủ toàn bộ các điều khoản và quy định học tập dưới đây.
            </p>
            <div className="text-xs text-slate-400 font-medium pt-1">
              Cập nhật lần cuối: Tháng 11/2026 • Áp dụng cho toàn bộ Giảng viên và Sinh viên
            </div>
          </div>

          {/* Document Content Sections in 1 Card */}
          <div className="space-y-8">
            {/* Section 1 */}
            <section className="space-y-3 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-2.5 text-galaxy-blue font-bold text-lg">
                <UserCheck className="size-5 shrink-0" />
                <h2>1. Tài khoản và Trách nhiệm Người dùng</h2>
              </div>
              <div className="text-slate-600 text-sm leading-relaxed space-y-2 pl-7.5">
                <p>
                  • Mỗi người dùng chỉ được sở hữu một tài khoản định danh duy nhất tương ứng với mã
                  số sinh viên hoặc mã số giảng viên được cấp bởi nhà trường.
                </p>
                <p>
                  • Bạn có trách nhiệm bảo mật tuyệt đối thông tin đăng nhập, mã xác thực OTP và mật
                  khẩu. Không chia sẻ phiên đăng nhập cho bên thứ ba.
                </p>
                <p>
                  • Mọi hoạt động phát sinh từ tài khoản của bạn sẽ do bạn chịu trách nhiệm hoàn
                  toàn trước quy chế nhà trường và pháp luật.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section className="space-y-3 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-2.5 text-galaxy-blue font-bold text-lg">
                <ShieldCheck className="size-5 shrink-0" />
                <h2>2. Quy chế Liêm chính Học thuật (Academic Integrity)</h2>
              </div>
              <div className="text-slate-600 text-sm leading-relaxed space-y-2 pl-7.5">
                <p>
                  • Người học cam kết thực hiện các bài thi trắc nghiệm, bài tập cá nhân và đồ án
                  với tinh thần trung thực, liêm chính.
                </p>
                <p>
                  • Nghiêm cấm mọi hành vi gian lận thi cử, sao chép mã nguồn trái phép, can thiệp
                  vào mã client/API nhằm thao túng điểm số.
                </p>
                <p>
                  • Dữ liệu bài nộp, thời gian hoàn thành và lịch sử tương tác được hệ thống ghi
                  nhận tự động phục vụ công tác thanh tra và đánh giá học phần.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-3 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-2.5 text-galaxy-blue font-bold text-lg">
                <FileText className="size-5 shrink-0" />
                <h2>3. Bản quyền Bài giảng & Học liệu</h2>
              </div>
              <div className="text-slate-600 text-sm leading-relaxed space-y-2 pl-7.5">
                <p>
                  • Toàn bộ bài giảng, tài liệu tham khảo, ngân hàng câu hỏi và video được lưu trữ
                  trên {SITE_CONFIG.name} thuộc quyền sở hữu trí tuệ của Giảng viên và Nhà trường.
                </p>
                <p>
                  • Người học chỉ được sử dụng học liệu cho mục đích học tập cá nhân; nghiêm cấm sao
                  chép, phân phối lại hoặc thương mại hóa dưới mọi hình thức mà không có sự cho phép
                  bằng văn bản.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2.5 text-galaxy-blue font-bold text-lg">
                <AlertTriangle className="size-5 shrink-0" />
                <h2>4. Xử lý Vi phạm & Chấm dứt Quyền truy cập</h2>
              </div>
              <div className="text-slate-600 text-sm leading-relaxed space-y-2 pl-7.5">
                <p>
                  • Hệ thống có quyền tạm khóa hoặc thu hồi vĩnh viễn quyền truy cập của bất kỳ tài
                  khoản nào có dấu hiệu tấn công mạng, phá hoại dữ liệu hoặc vi phạm nghiêm trọng
                  quy chế học tập.
                </p>
                <p>
                  • Các trường hợp vi phạm sẽ được chuyển báo cáo tới Hội đồng kỷ luật của Nhà
                  trường để xử lý theo quy định hiện hành.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
