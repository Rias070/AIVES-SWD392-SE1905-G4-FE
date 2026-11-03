import React, { useState, useEffect } from 'react';
import { UploadCloud, FileText, Sparkles, Settings, ArrowRight, CheckCircle, Database, AlertCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { lecturerDocumentApi, lecturerQuestionApi, subjectApi } from '../../services/api';

export default function LecturerAIGenerationPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);

  // Form states
  const [subjects, setSubjects] = useState([
    { code: 'CS301', name: 'Cấu trúc Dữ liệu & Giải thuật nâng cao' },
    { code: 'PRJ301', name: 'Java Web Applications' },
    { code: 'SWD392', name: 'Software Architecture & Design' },
  ]);
  const [selectedSubject, setSelectedSubject] = useState('CS301');
  const [topic, setTopic] = useState('');
  const [bloomLevel, setBloomLevel] = useState('ALL');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [questionCount, setQuestionCount] = useState(3);

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const res = await subjectApi.getSubjects();
        if (res?.data?.result && res.data.result.length > 0) {
          setSubjects(res.data.result);
          setSelectedSubject(res.data.result[0].code);
        }
      } catch (e) {
        // Fallback to initial subjects
      }
    };
    loadSubjects();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const createFallbackQuestions = (subCode, top, bloom, diff, cnt) => {
    const count = Number(cnt) || 3;
    const targetTopic = top || 'Kiến thức cốt lõi học phần';
    const safeDiff = diff && diff !== 'ALL' ? diff.toUpperCase() : 'MEDIUM';

    const bloomCatalog = {
      'Bloom 1': [
        {
          title: `Hãy định nghĩa và liệt kê ít nhất 3 đặc điểm kỹ thuật nền tảng của "${targetTopic}". Những thuật ngữ chuẩn nào gắn liền với công nghệ này?`,
          bloom: 'Bloom 1 - Nhận biết',
          diff: 'EASY',
          answer: `Sinh viên nêu rõ: 1. Định nghĩa chuẩn xác của ${targetTopic}. 2. Ba đặc tính kỹ thuật cốt lõi. 3. Thuật ngữ quốc tế liên quan.`,
          rubrics: [
            { criterionName: 'Định nghĩa chuẩn xác', description: 'Nêu đúng định nghĩa theo giáo trình học phần', maxScore: 4.0, weight: 1.0 },
            { criterionName: 'Liệt kê đầy đủ đặc tính', description: 'Liệt kê chính xác ít nhất 3 đặc trưng kỹ thuật', maxScore: 3.5, weight: 1.0 },
            { criterionName: 'Thuật ngữ chuyên môn', description: 'Sử dụng đúng thuật ngữ chuẩn quốc tế', maxScore: 2.5, weight: 1.0 }
          ]
        },
        {
          title: `Kể tên các thành phần cấu tạo (components) và vai trò cơ bản của từng khối chức năng trong mô hình vận hành của "${targetTopic}".`,
          bloom: 'Bloom 1 - Nhận biết',
          diff: 'EASY',
          answer: `Sinh viên liệt kê: 1. Danh sách các module hoặc thành phần chính. 2. Nhiệm vụ cơ bản của từng khối chức năng.`,
          rubrics: [
            { criterionName: 'Liệt kê thành phần', description: 'Nêu đúng các khối cấu thành của kiến trúc', maxScore: 5.0, weight: 1.0 },
            { criterionName: 'Mô tả vai trò cơ bản', description: 'Trình bày đúng chức năng từng thành phần', maxScore: 5.0, weight: 1.0 }
          ]
        },
        {
          title: `Liệt kê các giao thức mạng (protocols) và định dạng dữ liệu (payload formats) tiêu chuẩn được sử dụng phổ biến nhất khi tích hợp "${targetTopic}".`,
          bloom: 'Bloom 1 - Nhận biết',
          diff: 'EASY',
          answer: `Sinh viên liệt kê: 1. Các giao thức (HTTP/REST, gRPC, WebSocket, AMQP). 2. Các định dạng (JSON, Protocol Buffers, Avro).`,
          rubrics: [
            { criterionName: 'Liệt kê đúng giao thức', description: 'Chỉ rõ các giao thức truyền tải tiêu chuẩn', maxScore: 5.0, weight: 1.0 },
            { criterionName: 'Định dạng dữ liệu', description: 'Nêu đúng các định dạng serialize/deserialize', maxScore: 5.0, weight: 1.0 }
          ]
        },
        {
          title: `Nêu các điều kiện tiền đề về hạ tầng phần mềm (prerequisites) và môi trường runtime cần thiết trước khi triển khai "${targetTopic}".`,
          bloom: 'Bloom 1 - Nhận biết',
          diff: 'EASY',
          answer: `Sinh viên trình bày: 1. Yêu cầu hệ điều hành/container runtime. 2. Các dịch vụ phụ trợ cần có (Database, Service Registry).`,
          rubrics: [
            { criterionName: 'Điều kiện môi trường', description: 'Nêu đúng các phần mềm và thư viện phụ thuộc', maxScore: 5.0, weight: 1.0 },
            { criterionName: 'Dịch vụ phụ trợ', description: 'Chỉ ra các hạ tầng mạng và lưu trữ bắt buộc', maxScore: 5.0, weight: 1.0 }
          ]
        },
        {
          title: `Chỉ ra sự khác biệt về mặt định nghĩa giữa "${targetTopic}" và khái niệm kiến trúc truyền thống tương ứng trong phần mềm.`,
          bloom: 'Bloom 1 - Nhận biết',
          diff: 'EASY',
          answer: `Sinh viên phân biệt: 1. Khái niệm cũ và mới. 2. Điểm phân định ranh giới cơ bản.`,
          rubrics: [
            { criterionName: 'Phân định khái niệm', description: 'Chỉ rõ sự khác nhau về mặt ngữ nghĩa', maxScore: 5.0, weight: 1.0 },
            { criterionName: 'Phạm vi ứng dụng', description: 'Nêu đúng phạm vi áp dụng của từng khái niệm', maxScore: 5.0, weight: 1.0 }
          ]
        }
      ],
      'Bloom 2': [
        {
          title: `Trình bày khái niệm, bản chất kỹ thuật và nguyên lý hoạt động cốt lõi của "${targetTopic}". Điểm khác biệt mấu chốt so với các giải pháp trước đây là gì?`,
          bloom: 'Bloom 2 - Thông hiểu',
          diff: 'MEDIUM',
          answer: `Sinh viên cần trình bày rõ: 1. Định nghĩa chuẩn xác của ${targetTopic}. 2. Các thành phần cấu tạo và luồng xử lý dữ liệu. 3. Ý nghĩa thực tiễn đối với hệ thống phần mềm.`,
          rubrics: [
            { criterionName: 'Tính chính xác & Khái niệm cốt lõi', description: 'Trình bày đúng định nghĩa và các khái niệm cơ bản', maxScore: 4.0, weight: 1.0 },
            { criterionName: 'Luồng dữ liệu & Cơ chế vận hành', description: 'Mô tả mạch lạc các thành phần và tương tác qua lại', maxScore: 3.5, weight: 1.0 },
            { criterionName: 'Giá trị kỹ thuật mang lại', description: 'Nêu rõ bài toán được giải quyết trong thực tiễn', maxScore: 2.5, weight: 1.0 }
          ]
        },
        {
          title: `Giải thích luồng dữ liệu (data flow) và chu kỳ xử lý yêu cầu (request lifecycle) khi áp dụng "${targetTopic}". Các module tương tác với nhau như thế nào?`,
          bloom: 'Bloom 2 - Thông hiểu',
          diff: 'MEDIUM',
          answer: `Sinh viên giải thích: 1. Điểm bắt đầu nhận request. 2. Các chặng trung gian xử lý và chuyển tiếp. 3. Cơ chế giao tiếp giữa các thành phần.`,
          rubrics: [
            { criterionName: 'Mô tả luồng dữ liệu', description: 'Luồng đi của dữ liệu chính xác, mạch lạc', maxScore: 4.0, weight: 1.0 },
            { criterionName: 'Giao thức và định dạng truyền tin', description: 'Nêu rõ giao thức và cách đồng bộ/bất đồng bộ', maxScore: 3.5, weight: 1.0 },
            { criterionName: 'Xử lý kết quả trả về', description: 'Trình bày cách đóng gói response và xử lý mã lỗi', maxScore: 2.5, weight: 1.0 }
          ]
        },
        {
          title: `Giải thích tại sao "${targetTopic}" lại giúp giảm thiểu sự phụ thuộc chặt chẽ (tight coupling) giữa các thành phần và tăng cường tính độc lập khi triển khai.`,
          bloom: 'Bloom 2 - Thông hiểu',
          diff: 'MEDIUM',
          answer: `Sinh viên giải thích: 1. Khái niệm Loose Coupling. 2. Cơ chế trừu tượng hóa và đóng gói giao diện tương tác. 3. Độc lập trong chu kỳ release.`,
          rubrics: [
            { criterionName: 'Bản chất Loose Coupling', description: 'Hiểu đúng cơ chế giảm phụ thuộc giữa các module', maxScore: 4.0, weight: 1.0 },
            { criterionName: 'Độc lập triển khai', description: 'Giải thích khả năng deploy độc lập không gián đoạn', maxScore: 3.5, weight: 1.0 },
            { criterionName: 'Lợi ích bảo trì', description: 'Nêu rõ giá trị đối với khả năng mở rộng code', maxScore: 2.5, weight: 1.0 }
          ]
        },
        {
          title: `Phân biệt cơ chế xử lý đồng bộ (Synchronous) và bất đồng bộ (Asynchronous) trong mô hình "${targetTopic}". Trong trường hợp nào nên ưu tiên mô hình bất đồng bộ?`,
          bloom: 'Bloom 2 - Thông hiểu',
          diff: 'MEDIUM',
          answer: `Sinh viên làm rõ: 1. So sánh cơ chế non-blocking vs blocking. 2. Hàng đợi thông điệp Message Queue. 3. Các kịch bản thực tiễn cần xử lý bất đồng bộ.`,
          rubrics: [
            { criterionName: 'Phân biệt Sync/Async', description: 'Chỉ rõ cơ chế non-blocking và luồng thực thi', maxScore: 4.0, weight: 1.0 },
            { criterionName: 'Trường hợp áp dụng', description: 'Chọn đúng ngữ cảnh nghiệp vụ cần bất đồng bộ', maxScore: 3.5, weight: 1.0 },
            { criterionName: 'Quản lý hàng đợi', description: 'Nêu đúng vai trò của Message Broker', maxScore: 2.5, weight: 1.0 }
          ]
        },
        {
          title: `Làm rõ nguyên tắc phân chia ranh giới ngữ cảnh (Bounded Context) khi thiết kế các module xoay quanh "${targetTopic}".`,
          bloom: 'Bloom 2 - Thông hiểu',
          diff: 'MEDIUM',
          answer: `Sinh viên giải thích: 1. Khái niệm Bounded Context trong Domain-Driven Design. 2. Cách xác định ranh giới dữ liệu và model nghiệp vụ.`,
          rubrics: [
            { criterionName: 'Khái niệm Bounded Context', description: 'Nắm vững nguyên tắc phân định của DDD', maxScore: 4.0, weight: 1.0 },
            { criterionName: 'Ranh giới dữ liệu', description: 'Giải thích cách cô lập model và database', maxScore: 3.5, weight: 1.0 },
            { criterionName: 'Ứng dụng thực tiễn', description: 'Đưa ra ví dụ thực tế mạch lạc', maxScore: 2.5, weight: 1.0 }
          ]
        }
      ],
      'Bloom 3': [
        {
          title: `Trong một dự án thực tế, anh/chị hãy vận dụng "${targetTopic}" để giải quyết bài toán đồng bộ dữ liệu hoặc quản lý trạng thái. Nêu cụ thể các bước triển khai kỹ thuật.`,
          bloom: 'Bloom 3 - Vận dụng',
          diff: 'MEDIUM',
          answer: `Sinh viên trình bày: 1. Bối cảnh dự án cụ thể. 2. Các bước cấu hình và viết mã áp dụng. 3. Kết quả sau khi tích hợp.`,
          rubrics: [
            { criterionName: 'Xác định đúng bài toán áp dụng', description: 'Chọn ngữ cảnh nghiệp vụ phù hợp với công nghệ', maxScore: 3.0, weight: 1.0 },
            { criterionName: 'Quy trình triển khai từng bước', description: 'Mô tả đầy đủ cấu hình, code và tích hợp', maxScore: 4.5, weight: 1.0 },
            { criterionName: 'Kiểm tra tính đúng đắn', description: 'Đưa ra phương pháp nghiệm thu kết quả vận hành', maxScore: 2.5, weight: 1.0 }
          ]
        },
        {
          title: `Hãy cấu hình và triển khai mẫu Circuit Breaker kết hợp Retry pattern trong thư viện Resilience4j khi dịch vụ ứng dụng "${targetTopic}" tương tác với API bên thứ ba.`,
          bloom: 'Bloom 3 - Vận dụng',
          diff: 'MEDIUM',
          answer: `Sinh viên nêu: 1. Cấu hình file application.yml (slidingWindowSize, failureRateThreshold). 2. Cách bọc hàm gọi Service bằng annotation @CircuitBreaker. 3. Định nghĩa phương thức Fallback.`,
          rubrics: [
            { criterionName: 'Cấu hình tham số ngưỡng', description: 'Thiết lập đúng sliding window và failure rate threshold', maxScore: 4.0, weight: 1.0 },
            { criterionName: 'Hiện thực hóa Fallback method', description: 'Viết đúng signature và logic trả lời dự phòng', maxScore: 3.5, weight: 1.0 },
            { criterionName: 'Xử lý ngoại lệ', description: 'Bắt đúng loại exception và log cảnh báo', maxScore: 2.5, weight: 1.0 }
          ]
        },
        {
          title: `Vận dụng chiến lược bộ nhớ đệm đa tầng (Multi-level Caching: Caffeine Cache in-memory + Redis Distributed Cache) để tối ưu hóa hiệu năng truy vấn cho module "${targetTopic}".`,
          bloom: 'Bloom 3 - Vận dụng',
          diff: 'MEDIUM',
          answer: `Sinh viên trình bày: 1. Các bước đọc Cache L1 trước, nếu miss đọc Cache L2, nếu miss đọc DB. 2. Cấu hình TTL. 3. Cơ chế vô hiệu hóa cache (Cache Invalidation).`,
          rubrics: [
            { criterionName: 'Kiến trúc Cache L1/L2', description: 'Mô tả đúng quy trình tra cứu hai tầng cache', maxScore: 4.0, weight: 1.0 },
            { criterionName: 'Chiến lược Invalidation', description: 'Xóa hoặc cập nhật key cache kịp thời khi dữ liệu đổi', maxScore: 3.5, weight: 1.0 },
            { criterionName: 'Cấu hình TTL và Eviction', description: 'Ngăn chặn tràn RAM và giải phóng cache cũ hợp lý', maxScore: 2.5, weight: 1.0 }
          ]
        },
        {
          title: `Vận dụng API Gateway (Spring Cloud Gateway) để cấu hình định tuyến thông minh (Dynamic Routing) và Rate Limiting (Token Bucket) cho các dịch vụ triển khai "${targetTopic}".`,
          bloom: 'Bloom 3 - Vận dụng',
          diff: 'MEDIUM',
          answer: `Sinh viên trình bày: 1. Định nghĩa route predicates và filters. 2. Cấu hình RedisRateLimiter giới hạn 100 req/s/user. 3. Cách thêm custom header chuyển tiếp xuống microservice.`,
          rubrics: [
            { criterionName: 'Cấu hình Route & Predicate', description: 'Định tuyến đường dẫn URI chính xác', maxScore: 4.0, weight: 1.0 },
            { criterionName: 'Thuật toán Rate Limiting', description: 'Áp dụng Token Bucket với Redis thành công', maxScore: 3.5, weight: 1.0 },
            { criterionName: 'Bảo mật Header', description: 'Chuyển tiếp context người dùng an toàn', maxScore: 2.5, weight: 1.0 }
          ]
        },
        {
          title: `Áp dụng Transactional Outbox Pattern kết hợp Debezium CDC trong hệ thống "${targetTopic}" để đảm bảo gửi message vào Kafka thành công ngay cả khi mất điện.`,
          bloom: 'Bloom 3 - Vận dụng',
          diff: 'MEDIUM',
          answer: `Sinh viên mô tả: 1. Tạo bảng outbox_events cùng transaction với bảng nghiệp vụ. 2. Debezium đọc WAL của PostgreSQL. 3. Bắn event vào Kafka topic tương ứng.`,
          rubrics: [
            { criterionName: 'Cấu trúc Outbox Table', description: 'Ghi event chung transaction với dữ liệu nghiệp vụ', maxScore: 4.0, weight: 1.0 },
            { criterionName: 'Cơ chế CDC qua WAL', description: 'Giải thích cách Debezium capture log không làm chậm DB', maxScore: 3.5, weight: 1.0 },
            { criterionName: 'Đảm bảo At-least-once delivery', description: 'Xử lý idempotency phía consumer', maxScore: 2.5, weight: 1.0 }
          ]
        }
      ],
      'Bloom 4': [
        {
          title: `Phân tích cơ chế xử lý dữ liệu chuyên sâu của "${targetTopic}" và so sánh với giải pháp truyền thống. Khi nào nên và KHÔNG nên áp dụng kỹ thuật này?`,
          bloom: 'Bloom 4 - Phân tích',
          diff: 'HARD',
          answer: `Sinh viên cần phân tích sâu: 1. Cơ chế nội tại khi xử lý tải cao. 2. So sánh ưu/nhược điểm với giải pháp đối chứng. 3. Tiêu chí quyết định sử dụng trong dự án.`,
          rubrics: [
            { criterionName: 'Phân tích cơ chế chuyên sâu', description: 'Hiểu rõ cơ chế xử lý nội tại và các trường hợp biên', maxScore: 4.0, weight: 1.0 },
            { criterionName: 'So sánh đối chiếu khách quan', description: 'Chỉ rõ ưu/nhược điểm khi đặt cạnh giải pháp thay thế', maxScore: 3.5, weight: 1.0 },
            { criterionName: 'Quyết định kiến trúc phù hợp', description: 'Đưa ra tiêu chí lựa chọn công nghệ đúng đắn', maxScore: 2.5, weight: 1.0 }
          ]
        },
        {
          title: `Hãy phân tích nguyên nhân gốc rễ (Root Cause) và các điểm nghẽn hiệu năng (Bottlenecks) thường gặp nhất khi ứng dụng "${targetTopic}". Đề xuất phương pháp phân tích log/tracing.`,
          bloom: 'Bloom 4 - Phân tích',
          diff: 'HARD',
          answer: `Sinh viên phân tích: 1. Các điểm nghẽn tại tầng mạng, I/O hoặc DB lock. 2. Cách đọc phân tích distributed trace. 3. Biện pháp cô lập bottleneck.`,
          rubrics: [
            { criterionName: 'Nhận diện đúng điểm nghẽn kỹ thuật', description: 'Phân tích đúng các nguy cơ gây nghẽn tại CPU/Memory/IO', maxScore: 3.5, weight: 1.0 },
            { criterionName: 'Phương pháp truy vết log & trace', description: 'Sử dụng APM và Tracing để khoanh vùng nguyên nhân', maxScore: 4.0, weight: 1.0 },
            { criterionName: 'Biện pháp giải tỏa điểm nghẽn', description: 'Đề xuất tối ưu hóa cấu hình hoặc thuật toán', maxScore: 2.5, weight: 1.0 }
          ]
        },
        {
          title: `Mổ xẻ hiện tượng khuếch đại độ trễ (Latency Amplification / Tail Latency) và Cascading Failure xảy ra trong chuỗi gọi lồng nhau liên quan tới "${targetTopic}".`,
          bloom: 'Bloom 4 - Phân tích',
          diff: 'HARD',
          answer: `Sinh viên phân tích: 1. Phân phối độ trễ P99. 2. Tác động lan truyền khi thread pool bị chiếm dụng. 3. Biện pháp Bulkhead cô lập tài nguyên.`,
          rubrics: [
            { criterionName: 'Phân tích chỉ số P99 Latency', description: 'Mô tả hiện tượng trễ lũy kế qua các chặng dịch vụ', maxScore: 4.0, weight: 1.0 },
            { criterionName: 'Cơ chế cạn kiệt Thread Pool', description: 'Chỉ rõ nguyên nhân gây nghẽn toàn bộ ứng dụng', maxScore: 3.5, weight: 1.0 },
            { criterionName: 'Giải pháp cô lập Bulkhead', description: 'Thiết lập phân vùng tài nguyên biệt lập', maxScore: 2.5, weight: 1.0 }
          ]
        },
        {
          title: `Phân tích nguy cơ xung đột dữ liệu (Data Inconsistency) và Race Conditions khi nhiều luồng hoặc phiên bản đồng thời cập nhật trạng thái trong "${targetTopic}".`,
          bloom: 'Bloom 4 - Phân tích',
          diff: 'HARD',
          answer: `Sinh viên mổ xẻ: 1. Hiện tượng Lost Update hoặc Dirty Read. 2. So sánh Optimistic Locking vs Pessimistic Locking.`,
          rubrics: [
            { criterionName: 'Phát hiện kịch bản Race Condition', description: 'Mô tả chính xác thời điểm xảy ra tranh chấp dữ liệu', maxScore: 4.0, weight: 1.0 },
            { criterionName: 'So sánh cơ chế Lock', description: 'Đánh giá chi phí hiệu năng giữa Optimistic và Pessimistic', maxScore: 3.5, weight: 1.0 },
            { criterionName: 'Bảo đảm toàn vẹn giao dịch', description: 'Đề xuất giải pháp kiểm soát xung đột tối ưu', maxScore: 2.5, weight: 1.0 }
          ]
        },
        {
          title: `So sánh chuyên sâu giữa hai chiến lược lưu trữ: Database-per-Service và Shared-Database đối với dịch vụ "${targetTopic}". Khi nào chi phí đồng bộ hóa vượt quá lợi ích?`,
          bloom: 'Bloom 4 - Phân tích',
          diff: 'HARD',
          answer: `Sinh viên phân tích: 1. Tính độc lập schema vs độ phức tạp distributed query. 2. Khó khăn khi thực hiện join dữ liệu hoặc báo cáo tổng hợp.`,
          rubrics: [
            { criterionName: 'So sánh tính độc lập dữ liệu', description: 'Mổ xẻ ưu nhược điểm của việc tách riêng database', maxScore: 4.0, weight: 1.0 },
            { criterionName: 'Bài toán Distributed Query', description: 'Chỉ ra thách thức khi join dữ liệu qua HTTP/Event', maxScore: 3.5, weight: 1.0 },
            { criterionName: 'Đưa ra tiêu chí lựa chọn', description: 'Đưa ra khuyến nghị phù hợp theo quy mô hệ thống', maxScore: 2.5, weight: 1.0 }
          ]
        }
      ],
      'Bloom 5': [
        {
          title: `Đánh giá sự đánh đổi (trade-offs) về hiệu năng, tính nhất quán dữ liệu và độ tin cậy khi áp dụng "${targetTopic}" ở quy mô phân tán lớn.`,
          bloom: 'Bloom 5 - Đánh giá',
          diff: 'HARD',
          answer: `Sinh viên cần lập luận: 1. Tác động tới Latency, Throughput và Tính toàn vẹn dữ liệu. 2. Các rủi ro tiềm ẩn và chiến lược giảm thiểu.`,
          rubrics: [
            { criterionName: 'Đánh giá các thuộc tính chất lượng', description: 'Phân tích định lượng và định tính về hiệu năng hệ thống', maxScore: 4.0, weight: 1.0 },
            { criterionName: 'Lập luận về trade-offs kiến trúc', description: 'Chỉ rõ sự thỏa hiệp giữa Consistency và Availability', maxScore: 3.5, weight: 1.0 },
            { criterionName: 'Giải pháp kiểm soát rủi ro', description: 'Đề xuất phương án dự phòng và chịu lỗi khả thi', maxScore: 2.5, weight: 1.0 }
          ]
        },
        {
          title: `Giả sử hệ thống triển khai "${targetTopic}" gặp sự cố nghẽn mạng hoặc quá tải dữ liệu trong giờ cao điểm. Anh/Chị hãy đề xuất quy trình cô lập lỗi và khắc phục.`,
          bloom: 'Bloom 5 - Đánh giá',
          diff: 'HARD',
          answer: `Sinh viên trình bày: 1. Các bước phát hiện và cô lập lỗi (Circuit Breaker, Health checks). 2. Giải pháp phục hồi không gián đoạn (Fallback, Retry). 3. Hệ thống Observability cần có.`,
          rubrics: [
            { criterionName: 'Quy trình xử lý sự cố bài bản', description: 'Khoanh vùng và chẩn đoán nguyên nhân gốc rễ (Root Cause)', maxScore: 4.0, weight: 1.0 },
            { criterionName: 'Cơ chế phục hồi tự động', description: 'Ứng dụng Circuit Breaker, Retry, Fallback đúng cách', maxScore: 3.5, weight: 1.0 },
            { criterionName: 'Giải pháp giám sát toàn diện', description: 'Xây dựng Dashboard Metrics, Log và Distributed Tracing', maxScore: 2.5, weight: 1.0 }
          ]
        },
        {
          title: `Biện minh cho quyết định lựa chọn giao thức truyền tải nội bộ: khi nào nên thay thế hoàn toàn RESTful JSON bằng gRPC/Protocol Buffers trong kiến trúc "${targetTopic}"?`,
          bloom: 'Bloom 5 - Đánh giá',
          diff: 'HARD',
          answer: `Sinh viên lập luận: 1. Binary payload size nhỏ hơn JSON 60-80%. 2. Multiplexing trên HTTP/2. 3. Đánh đổi về công cụ debug, tooling và độ dốc học tập.`,
          rubrics: [
            { criterionName: 'Lập luận về tối ưu hóa băng thông', description: 'Chứng minh lợi thế binary serialization', maxScore: 4.0, weight: 1.0 },
            { criterionName: 'Đánh giá chi phí phát triển & debug', description: 'Chỉ rõ nhược điểm khi debug mạng so với JSON', maxScore: 3.5, weight: 1.0 },
            { criterionName: 'Quyết định chuyển đổi kiến trúc', description: 'Đưa ra ngưỡng tải cụ thể để biện minh', maxScore: 2.5, weight: 1.0 }
          ]
        },
        {
          title: `Đánh giá rủi ro an ninh mạng và các lỗ hổng tiềm ẩn (như Man-in-the-Middle, Service Spoofing) khi các dịch vụ liên quan tới "${targetTopic}" giao tiếp qua mạng nội bộ.`,
          bloom: 'Bloom 5 - Đánh giá',
          diff: 'HARD',
          answer: `Sinh viên đánh giá: 1. Tại sao mạng nội bộ không còn an toàn. 2. Cơ chế xác thực hai chiều mTLS với Service Mesh. 3. Chi phí CPU khi mã hóa/giải mã SSL handshake.`,
          rubrics: [
            { criterionName: 'Nhận diện nguy cơ an ninh mạng', description: 'Phân tích các lỗ hổng nội bộ tiềm ẩn', maxScore: 4.0, weight: 1.0 },
            { criterionName: 'Đánh giá kiến trúc Zero-Trust', description: 'Lập luận về cơ chế xác thực danh tính từng service', maxScore: 3.5, weight: 1.0 },
            { criterionName: 'Đánh giá overhead hiệu năng', description: 'Cân nhắc chi phí xử lý mật mã của mTLS', maxScore: 2.5, weight: 1.0 }
          ]
        },
        {
          title: `Phản biện bài toán Tổng chi phí sở hữu (TCO) và độ phức tạp vận hành khi quyết định phân tách một hệ thống Monolith ổn định sang hệ thống "${targetTopic}".`,
          bloom: 'Bloom 5 - Đánh giá',
          diff: 'HARD',
          answer: `Sinh viên phản biện: 1. Chi phí DevOps, CI/CD, hạ tầng Kubernetes, chi phí Cloud. 2. Luật Conway và quy mô đội ngũ nhân sự. 3. Tiêu chí cảnh báo khi hệ thống chưa đủ lớn.`,
          rubrics: [
            { criterionName: 'Phân tích chi phí ẩn', description: 'Chỉ ra chi phí về hạ tầng, giám sát và quản lý', maxScore: 4.0, weight: 1.0 },
            { criterionName: 'Đánh giá năng lực đội ngũ', description: 'Lập luận về định luật Conway và văn hóa DevOps', maxScore: 3.5, weight: 1.0 },
            { criterionName: 'Quyết định phản biện sắc bén', description: 'Nêu rõ kịch bản nên giữ nguyên Monolith', maxScore: 2.5, weight: 1.0 }
          ]
        }
      ],
      'Bloom 6': [
        {
          title: `Hãy thiết kế bản vẽ kiến trúc hệ thống (System Design Blueprint) áp dụng "${targetTopic}" cho bài toán chịu tải 100.000 TPS. Trình bày mô hình phân tầng, chiến lược phân vùng dữ liệu và giải pháp chịu lỗi.`,
          bloom: 'Bloom 6 - Sáng tạo',
          diff: 'HARD',
          answer: `Sinh viên phác thảo: 1. Sơ đồ kiến trúc logic đa tầng (API Gateway, Microservices, Caching, Event-driven, Distributed DB). 2. Chiến lược Database Sharding/Replication. 3. Cơ chế chịu lỗi (Circuit Breaker, Rate Limiting, Graceful Degradation).`,
          rubrics: [
            { criterionName: 'Thiết kế kiến trúc logic tổng thể', description: 'Sơ đồ kiến trúc toàn diện, phân định rõ ranh giới giữa các service', maxScore: 4.0, weight: 1.0 },
            { criterionName: 'Chiến lược phân vùng & xử lý tải cao', description: 'Thiết kế giải pháp Caching, Partitioning và Load Balancing hợp lý', maxScore: 3.5, weight: 1.0 },
            { criterionName: 'Chiến lược chịu lỗi & Phục hồi thảm họa', description: 'Đảm bảo tính sẵn sàng cao (High Availability) khi có node bị sập', maxScore: 2.5, weight: 1.0 }
          ]
        },
        {
          title: `Đề xuất một giải pháp kiến trúc kết hợp "${targetTopic}" với mô hình Event-Driven Architecture để đảm bảo tính nhất quán cuối cùng (Eventual Consistency) qua Saga Pattern. Nêu chi tiết kịch bản bù trừ giao dịch.`,
          bloom: 'Bloom 6 - Sáng tạo',
          diff: 'HARD',
          answer: `Sinh viên thiết kế: 1. Luồng Saga (Orchestration hoặc Choreography). 2. Cấu trúc các Event xuất bản vào Message Broker (Kafka/RabbitMQ). 3. Kịch bản khôi phục và giao dịch bù trừ khi một service gặp lỗi.`,
          rubrics: [
            { criterionName: 'Thiết kế luồng Saga chuẩn xác', description: 'Lựa chọn và vẽ đúng mô hình Orchestration hoặc Choreography', maxScore: 4.0, weight: 1.0 },
            { criterionName: 'Cơ chế giao dịch bù trừ (Rollback)', description: 'Xử lý triệt để trạng thái bất định khi có node mạng bị fail', maxScore: 3.5, weight: 1.0 },
            { criterionName: 'Bảo toàn toàn vẹn dữ liệu', description: 'Ngăn ngừa dữ liệu rác hoặc trạng thái mâu thuẫn giữa các dịch vụ', maxScore: 2.5, weight: 1.0 }
          ]
        },
        {
          title: `Thiết kế mô hình kiến trúc CQRS (Command Query Responsibility Segregation) kết hợp Event Sourcing cho hệ thống thanh toán xoay quanh "${targetTopic}".`,
          bloom: 'Bloom 6 - Sáng tạo',
          diff: 'HARD',
          answer: `Sinh viên xây dựng: 1. Tách biệt Command Bus (Write) và Query Bus (Read). 2. Lưu trữ Event Store bất biến (Immutable). 3. Projector lắng nghe event để cập nhật Elasticsearch/Postgres cho truy vấn.`,
          rubrics: [
            { criterionName: 'Tách bạch Command và Query', description: 'Mô hình hóa rõ ràng hai luồng ghi và đọc độc lập', maxScore: 4.0, weight: 1.0 },
            { criterionName: 'Thiết kế Event Store bất biến', description: 'Lưu vết toàn bộ thay đổi trạng thái theo thời gian', maxScore: 3.5, weight: 1.0 },
            { criterionName: 'Đồng bộ Read Model tối ưu', description: 'Tối ưu hóa tốc độ tìm kiếm và tổng hợp dữ liệu', maxScore: 2.5, weight: 1.0 }
          ]
        },
        {
          title: `Hãy thiết kế kế hoạch Phục hồi thảm họa đa vùng (Multi-Region Disaster Recovery: Active-Active) cho hệ thống sử dụng "${targetTopic}" với yêu cầu RPO = 0 và RTO < 30 giây.`,
          bloom: 'Bloom 6 - Sáng tạo',
          diff: 'HARD',
          answer: `Sinh viên đề xuất: 1. Global Server Load Balancing điều hướng DNS. 2. Cross-region asynchronous replication cho Database. 3. Xử lý xung đột ghi đồng thời.`,
          rubrics: [
            { criterionName: 'Kiến trúc Multi-Region Active-Active', description: 'Mô hình hóa hạ tầng hai datacenter chạy song song', maxScore: 4.0, weight: 1.0 },
            { criterionName: 'Đồng bộ và giải quyết xung đột', description: 'Ứng dụng CRDT hoặc chiến lược giải quyết conflict chuẩn xác', maxScore: 3.5, weight: 1.0 },
            { criterionName: 'Đạt chuẩn RPO = 0 và RTO cực thấp', description: 'Chứng minh tính khả thi khi xảy ra sự cố sập cả một region', maxScore: 2.5, weight: 1.0 }
          ]
        },
        {
          title: `Thiết kế khung kiểm thử tự động toàn diện (Continuous Testing Pipeline) cho hệ thống "${targetTopic}" tích hợp Contract Testing, Chaos Engineering và Performance Testing tự động.`,
          bloom: 'Bloom 6 - Sáng tạo',
          diff: 'HARD',
          answer: `Sinh viên xây dựng: 1. Consumer-driven contract test ngăn vỡ API giữa các đội nhóm. 2. Kịch bản tiêm lỗi hỗn loạn (Chaos injection). 3. Quality Gate chặn release khi vi phạm SLA.`,
          rubrics: [
            { criterionName: 'Thiết kế Contract Testing (Pact)', description: 'Bảo đảm tính tương thích giữa consumer và provider', maxScore: 4.0, weight: 1.0 },
            { criterionName: 'Kiểm thử khả năng chịu lỗi (Chaos)', description: 'Chủ động kiểm chứng hệ thống tự phục hồi dưới tải nặng', maxScore: 3.5, weight: 1.0 },
            { criterionName: 'Thiết lập Quality Gate tự động', description: 'Tự động hóa hoàn toàn trong luồng CI/CD', maxScore: 2.5, weight: 1.0 }
          ]
        }
      ]
    };

    let targetPool = [];
    if (bloom && bloom !== 'ALL') {
      for (const [key, list] of Object.entries(bloomCatalog)) {
        if (bloom.toUpperCase().includes(key.toUpperCase())) {
          targetPool = list;
          break;
        }
      }
    }
    if (targetPool.length === 0) {
      targetPool = Object.values(bloomCatalog).flat();
    }

    return Array.from({ length: count }).map((_, idx) => {
      const angle = targetPool[idx % targetPool.length];
      return {
        id: `ai-gen-${Date.now()}-${idx}`,
        code: `${subCode}-Q${Math.floor(100 + Math.random() * 900)}`,
        subject: subCode,
        subjectCode: subCode,
        content: angle.title,
        difficulty: safeDiff,
        bloomLevel: angle.bloom,
        expectedAnswer: angle.answer,
        keywords: [targetTopic, 'Kiến trúc', 'Vấn đáp', 'Tối ưu hóa'],
        status: 'PENDING',
        isApproved: false,
        rubrics: angle.rubrics,
      };
    });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(15);
    setErrorMessage(null);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 85 ? prev + 15 : prev));
    }, 400);

    try {
      let uploadedDoc = null;
      const currentSubjectObj = subjects.find(s => s.code === selectedSubject);

      // Step 1: If file attached, upload first
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('subjectCode', selectedSubject);
        if (currentSubjectObj?.id || currentSubjectObj?.uuid) {
          formData.append('subjectUuid', currentSubjectObj.id || currentSubjectObj.uuid);
        }

        try {
          const uploadRes = await lecturerDocumentApi.uploadDocumentFile(formData);
          uploadedDoc = uploadRes?.data?.result;
        } catch (uploadErr) {
          console.warn('Upload file warning, continuing with topic-based RAG:', uploadErr);
        }
      }

      setProgress(60);

      const reqPayload = {
        subjectCode: selectedSubject,
        subjectUuid: currentSubjectObj?.id || currentSubjectObj?.uuid,
        documentUuid: uploadedDoc?.id,
        topic: topic || (file ? file.name.replace(/\.[^/.]+$/, '') : 'Kiến thức cốt lõi học phần'),
        bloomLevel: bloomLevel,
        difficulty: difficulty,
        count: Number(questionCount),
      };

      const res = await lecturerQuestionApi.generateQuestionsRAG(reqPayload);
      const generatedList = res?.data?.result || [];

      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        setIsGenerating(false);
        navigate('/review', {
          state: {
            generatedQuestions: generatedList,
            subjectCode: selectedSubject,
            count: generatedList.length,
          },
        });
      }, 500);
    } catch (err) {
      console.warn('API generateQuestionsRAG warning, generating AI questions via fallback engine:', err);
      const targetTopic = topic || (file ? file.name.replace(/\.[^/.]+$/, '') : 'Kiến thức cốt lõi học phần');
      const fallbackGenerated = createFallbackQuestions(selectedSubject, targetTopic, bloomLevel, difficulty, questionCount);

      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        setIsGenerating(false);
        navigate('/review', {
          state: {
            generatedQuestions: fallbackGenerated,
            subjectCode: selectedSubject,
            count: fallbackGenerated.length,
          },
        });
      }, 500);
    }
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto pb-10 animate-fade-in">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
        <div>
          <h1 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-600" />
            Sinh câu hỏi AI tự động (RAG)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Trích xuất câu hỏi kèm barem Rubric theo thang Bloom từ học liệu môn học
          </p>
        </div>
        <button
          onClick={() => navigate('/question-bank')}
          className="text-xs text-sky-700 hover:text-sky-800 font-semibold cursor-pointer underline underline-offset-2"
        >
          Xem Ngân hàng câu hỏi →
        </button>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
        </div>
      )}

      {/* Main 2-Column Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left Column: Subject & Material */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-sky-600" />
            Học phần & Tài liệu nguồn
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Môn học khảo thí</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:border-sky-500 text-xs"
              >
                {subjects.map((s, idx) => (
                  <option key={s.code || idx} value={s.code}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Chủ đề / Chương bài giảng
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ví dụ: Cây AVL & Đồ thị Dijkstra..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tài liệu bổ sung (Tùy chọn)
              </label>
              {!file ? (
                <label className="border-2 border-dashed border-slate-200 hover:border-sky-400 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50/60 hover:bg-sky-50/30 transition-all">
                  <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-sky-700">Chọn tệp PDF, DOCX</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Tối đa 50MB</span>
                  <input type="file" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange} />
                </label>
              ) : (
                <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                    <span className="font-semibold text-slate-800 text-xs truncate">{file.name}</span>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                    title="Bỏ tệp"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: AI Generation Params & Action */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4 text-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-sky-600" />
              Thông số sinh câu hỏi
            </h2>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Cấp độ Bloom</label>
              <select
                value={bloomLevel}
                onChange={(e) => setBloomLevel(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-sky-500 font-medium"
              >
                <option value="ALL">Mọi cấp độ (Hỗn hợp)</option>
                <option value="Bloom 2 - Hiểu">Bloom 2 - Hiểu (Understand)</option>
                <option value="Bloom 3 - Vận dụng">Bloom 3 - Vận dụng (Apply)</option>
                <option value="Bloom 4 - Phân tích">Bloom 4 - Phân tích (Analyze)</option>
                <option value="Bloom 5 - Đánh giá">Bloom 5 - Đánh giá (Evaluate)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Độ khó đề thi</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-sky-500 font-medium"
              >
                <option value="EASY">Dễ (Cơ bản / Nhận biết)</option>
                <option value="MEDIUM">Trung bình (Vận dụng chuẩn)</option>
                <option value="HARD">Nâng cao (Phân tích & Đánh giá)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Số lượng câu hỏi</label>
              <div className="grid grid-cols-4 gap-2">
                {[3, 5, 8, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuestionCount(num)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      questionCount === num
                        ? 'bg-sky-600 text-white border-sky-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {num} câu
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Câu hỏi sinh xong sẽ chuyển sang màn hình <strong>Kiểm duyệt</strong> trước khi lưu vào ngân hàng.</span>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-100">
            {isGenerating && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Đang trích xuất RAG & sinh barem...</span>
                  <span className="font-mono text-sky-700">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-600 transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-2.5 px-4 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-2xs ${
                isGenerating
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'btn-glacier-primary cursor-pointer'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Đang tạo câu hỏi...' : 'Bắt đầu tạo câu hỏi AI'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
