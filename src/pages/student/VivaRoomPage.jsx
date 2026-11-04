import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {
  Mic,
  MicOff,
  Volume2,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Bookmark,
  Sparkles,
  Bot,
  User,
  Radio,
  LogOut,
  Maximize2,
  Eye,
  Camera,
  FastForward,
  Play,
  Pause,
  Square,
  ShieldCheck,
  Cpu,
  Languages,
  Globe,
  X,
  Edit3,
  ArrowRight,
  Layers
} from 'lucide-react';
import { subjectApi, studentExamApi, lecturerQuestionApi } from '../../services/api';


// Finite State Machine States
const STATES = {
  AI_SPEAKING: 'AI_SPEAKING',
  READY_TO_ANSWER: 'READY_TO_ANSWER',
  STUDENT_ANSWERING: 'STUDENT_ANSWERING',
  STUDENT_REVIEWING: 'STUDENT_REVIEWING',
  AI_THINKING: 'AI_THINKING',
  FOLLOW_UP: 'FOLLOW_UP',
  FINISHED: 'FINISHED'
};

// Supported Languages Configuration
export const SUPPORTED_LANGUAGES = [
  { code: 'vi-VN', label: 'Tiếng Việt', shortLabel: 'VIE', flag: '🇻🇳', googleLang: 'vi' },
  { code: 'en-US', label: 'English', shortLabel: 'ENG', flag: '🇺🇸', googleLang: 'en' },
  { code: 'ja-JP', label: '日本語', shortLabel: 'JPN', flag: '🇯🇵', googleLang: 'ja' }
];

// Course Catalog Metadata
export const COURSE_CATALOG = {
  CS301: {
    code: 'CS301',
    name: 'Cấu trúc Dữ liệu & Giải thuật',
    nameEn: 'Data Structures & Algorithms',
    nameJa: 'データ構造とアルゴリズム'
  },
  AI204: {
    code: 'AI204',
    name: 'Học máy & Thị giác máy tính',
    nameEn: 'Machine Learning & Computer Vision',
    nameJa: '機械学習とコンピュータビジョン'
  },
  SE102: {
    code: 'SE102',
    name: 'Kiến trúc Phần mềm',
    nameEn: 'Software Architecture',
    nameJa: 'ソフトウェアアーキテクチャ'
  },
  SWD392: {
    code: 'SWD392',
    name: 'Kiến trúc & Thiết kế Phần mềm',
    nameEn: 'Software Architecture and Design',
    nameJa: 'ソフトウェアアーキテクチャと設計'
  }
};

// Multilingual Question Bank & Speech Content by Course Subject
export const COURSE_MULTILANG_CONTENT = {
  SWD392: {
    'vi-VN': {
      googleLang: 'vi',
      initialQuestion: {
        title:
          'Hãy phân tích sự khác nhau giữa kiến trúc Monolithic và Microservices về khả năng mở rộng (Scalability), tính sẵn sàng (Availability) và độ phức tạp vận hành.',
        bloom: 'Bloom 4 - Phân tích & Đánh giá'
      },
      greeting:
        'Chào thí sinh! Hội đồng AI Viva bắt đầu ca thi vấn đáp môn SWD392 (Kiến trúc & Thiết kế Phần mềm). Mời bạn lắng nghe câu hỏi đầu tiên.',
      closing:
        'Cảm ơn thí sinh đã hoàn thành ca thi vấn đáp môn SWD392. Hệ thống AI đang tổng hợp kết quả.',
      placeholder: 'Hãy trình bày phân tích kiến trúc của bạn vào micro...',
      defaultAnswer:
        'Dạ thưa Hội đồng, kiến trúc Monolithic triển khai toàn bộ chức năng vào một khối duy nhất, dễ phát triển ban đầu nhưng khó mở rộng độc lập và rủi ro Single Point of Failure cao. Trong khi đó, Microservices phân chia thành các service độc lập giao tiếp qua REST API hoặc Message Broker, cho phép mở rộng linh hoạt từng service theo tải thực tế và cô lập lỗi tốt hơn.',
      aiThinkingText:
        'Đang phân tích cấu trúc luận điểm kiến trúc phần mềm, đối chiếu rubric và trích xuất câu hỏi phản biện...',
      adaptiveFollowUps: [
        {
          keywords: ['saga', 'transaction', 'giao dịch', 'phân tán', 'distributed', 'outbox'],
          question:
            'Trong kiến trúc Microservices với mô hình Database-per-service, làm thế nào để đảm bảo tính nhất quán dữ liệu (Data Consistency)? Hãy phân tích cơ chế hoạt động của Saga Pattern (Choreography vs Orchestration).',
          bloom: 'Bloom 5 - Đánh giá giải pháp phân tán'
        },
        {
          keywords: ['circuit breaker', 'resilience4j', 'chịu lỗi', 'cô lập', 'quá tải', 'fallback'],
          question:
            'Khi một downstream service bị quá tải hoặc sập, Circuit Breaker Pattern bảo vệ toàn bộ hệ thống như thế nào qua các trạng thái Closed, Open và Half-Open?',
          bloom: 'Bloom 4 - Thiết kế chịu lỗi'
        },
        {
          keywords: ['clean architecture', 'solid', 'dip', 'domain', 'repository'],
          question:
            'Trong Clean Architecture, nguyên lý Dependency Inversion Principle (DIP) được áp dụng như thế nào để giữ cho Domain Layer hoàn toàn độc lập với Database và Framework bên ngoài?',
          bloom: 'Bloom 4 - Phân tích kiến trúc mã nguồn'
        }
      ],
      fallbackFollowUps: [
        {
          question:
            'Để đánh giá sâu hơn: Bạn hãy giải thích cách áp dụng Outbox Pattern kết hợp với Debezium/Kafka để đảm bảo tính toàn vẹn (Dual-write problem) khi vừa cập nhật DB vừa phát tán event.',
          bloom: 'Bloom 5 - Phản biện nâng cao'
        },
        {
          question:
            'Câu hỏi phản biện tổng kết: Khi nào thì một hệ thống phần mềm nên giữ kiến trúc Monolith thay vì vội vã chuyển sang Microservices? Hãy nêu các tiêu chí đánh giá kỹ thuật và chi phí.',
          bloom: 'Bloom 6 - Ra quyết định kiến trúc'
        }
      ]
    },
    'en-US': {
      googleLang: 'en',
      initialQuestion: {
        title:
          'Please analyze the differences between Monolithic and Microservices architectures in terms of Scalability, Availability, and Operational Complexity.',
        bloom: 'Bloom 4 - Analysis & Evaluation'
      },
      greeting:
        'Welcome candidate! The AI Viva Board is commencing the SWD392 (Software Architecture & Design) examination. Please listen to the first question.',
      closing:
        'Thank you for completing the oral examination. The AI system is compiling your SWD392 evaluation results.',
      placeholder: 'Speak your architectural analysis into the microphone...',
      defaultAnswer:
        'Dear Examination Board, Monolithic architecture packages all features into a single unit, simple for early development but difficult to scale independently. Microservices decouple functionality into autonomous services communicating via APIs or event brokers, enabling independent scalability and fault isolation.',
      aiThinkingText:
        'Evaluating software architecture arguments, checking rubric, and extracting follow-up...',
      adaptiveFollowUps: [
        {
          keywords: ['saga', 'transaction', 'distributed', 'consistency'],
          question:
            'In a database-per-service microservice pattern, how do you handle distributed transactions? Compare Choreography and Orchestration in Saga pattern.',
          bloom: 'Bloom 5 - Distributed Design'
        }
      ],
      fallbackFollowUps: [
        {
          question:
            'How does Circuit Breaker prevent cascading failure when downstream microservices degrade or fail?',
          bloom: 'Bloom 4 - Resilience Engineering'
        }
      ]
    },
    'ja-JP': {
      googleLang: 'ja',
      initialQuestion: {
        title:
          'スケーラビリティ、可用性、および運用上の複雑さの観点から、モノリシックアーキテクチャとマイクロサービスアーキテクチャの違いを分析してください。',
        bloom: 'Bloom 4 - 分析と評価'
      },
      greeting:
        '受験者の皆さん、こんにちは！SWD392（ソフトウェアアーキテクチャと設計）口頭試問を開始します。最初の質問をお聞きください。',
      closing:
        'SWD392口頭試問の受験お疲れ様でした。AI採点システムが現在評価結果を集計しています。',
      placeholder: 'マイクに向かって分析結果をお話しください...',
      defaultAnswer:
        '試問委員会の皆様、モノリスは単一バイナリで展開され初期開発が容易ですが個別スケーリングが困難です。一方マイクロサービスは独立したサービス群として構成され、障害分離と弾力的なスケールが可能です。',
      aiThinkingText:
        'アーキテクチャの論点を分析し、ルーブリックと照合しています...',
      adaptiveFollowUps: [],
      fallbackFollowUps: []
    }
  },
  CS301: {
    'vi-VN': {
      googleLang: 'vi',
      initialQuestion: {
        title:
          'Hãy phân tích ưu và nhược điểm của thuật toán Dijkstra khi áp dụng cho đồ thị có trọng số âm, và giải thích tại sao thuật toán Bellman-Ford lại giải quyết được vấn đề này?',
        bloom: 'Bloom 4 & 5 - Phân tích & Đánh giá'
      },
      greeting:
        'Chào thí sinh! Hội đồng AI Viva bắt đầu ca thi vấn đáp môn CS301 (Cấu trúc Dữ liệu & Giải thuật). Mời bạn lắng nghe câu hỏi đầu tiên.',
      closing:
        'Cảm ơn thí sinh đã hoàn thành xuất sắc ca thi vấn đáp. Hệ thống AI đang tổng hợp kết quả.',
      placeholder: 'Hãy nói câu trả lời của bạn vào micro...',
      defaultAnswer:
        'Dạ thưa Hội đồng, thuật toán Dijkstra áp dụng chiến lược tham lam Greedy. Khi một đỉnh đã xét xong, Dijkstra mặc định khoảng cách đó là tối ưu vĩnh viễn và không cập nhật lại. Nếu có cạnh trọng số âm thì kết quả sẽ sai lệch, trong khi Bellman-Ford duyệt V-1 lần giúp phát hiện và cập nhật đường đi chính xác.',
      aiThinkingText:
        'Đang phân tích cấu trúc luận điểm, đối chiếu rubric và trích xuất câu hỏi xoáy phản biện...',
      adaptiveFollowUps: [
        {
          keywords: ['âm', 'chu trình âm', 'negative', 'trọng số âm'],
          question:
            'Bạn vừa nhắc đến chu trình trọng số âm. Vậy thuật toán Bellman-Ford làm thế nào để phát hiện được sự tồn tại của chu trình âm trong đồ thị? Số lần duyệt tối đa là bao nhiêu và tại sao?',
          bloom: 'Bloom 5 - Đánh giá phản biện'
        },
        {
          keywords: ['tham lam', 'greedy', 'chọn đỉnh', 'nhỏ nhất'],
          question:
            'Chính xác là tính tham lam của Dijkstra. Khi một đỉnh đã cố định khoảng cách (settled), tại sao Dijkstra không thể quay lại cập nhật nếu gặp cạnh có trọng số âm phía sau? Hãy nêu một ví dụ phản chứng ngắn gọn.',
          bloom: 'Bloom 4 - Phân tích logic'
        },
        {
          keywords: ['heap', 'hàng đợi', 'priority queue', 'độ phức tạp', 'log'],
          question:
            'Về mặt tối ưu hóa cấu trúc dữ liệu, tại sao việc dùng Fibonacci Heap lại tối ưu hơn Binary Heap trong Dijkstra? Thao tác Decrease-Key giảm độ phức tạp từ bao nhiêu xuống bao nhiêu?',
          bloom: 'Bloom 4 - Cấu trúc dữ liệu'
        },
        {
          keywords: ['bellman', 'nới lỏng', 'relax', 'spfa'],
          question:
            'Trong Bellman-Ford, tại sao ta cần nới lỏng (Relaxation) đúng V - 1 lần cho toàn bộ các cạnh? Nếu sau V - 1 lần mà khoảng cách vẫn tiếp tục giảm thì kết luận điều gì về đồ thị?',
          bloom: 'Bloom 3 - Áp dụng giải thuật'
        }
      ],
      fallbackFollowUps: [
        {
          question:
            'Để đánh giá sâu hơn, theo bạn trong trường hợp đồ thị có chu trình trọng số âm nhưng không tiếp cận được từ đỉnh nguồn (unreachable), kết quả của Bellman-Ford sẽ bị ảnh hưởng như thế nào?',
          bloom: 'Bloom 5 - Phản biện nâng cao'
        },
        {
          question:
            'Câu hỏi phản biện tổng kết: Nếu đồ thị là DAG (đồ thị có hướng không chu trình) nhưng vẫn có trọng số âm, ta có thể dùng thuật toán sắp xếp Topo (Topological Sort) để đạt độ phức tạp O(V + E) thay vì Bellman-Ford không?',
          bloom: 'Bloom 6 - Sáng tạo & Tối ưu'
        }
      ]
    },
    'en-US': {
      googleLang: 'en',
      initialQuestion: {
        title:
          "Please analyze the pros and cons of Dijkstra's algorithm when applied to graphs with negative edge weights, and explain why Bellman-Ford solves this issue.",
        bloom: 'Bloom 4 & 5 - Analysis & Evaluation'
      },
      greeting:
        'Welcome candidate! The AI Viva Board is commencing the CS301 (Data Structures & Algorithms) oral examination. Please listen carefully to the first question.',
      closing:
        'Thank you for completing the oral viva exam. The AI examination system is compiling your evaluation results.',
      placeholder: 'Speak your answer clearly into the microphone...',
      defaultAnswer:
        "Dear Examination Board, Dijkstra's algorithm relies on a greedy strategy. Once a vertex is settled, it assumes that the calculated shortest path is permanently optimal and never revisited. In the presence of negative weights, this assumption fails. In contrast, Bellman-Ford relaxes all edges V-1 times, correctly handling negative edge weights and detecting negative weight cycles.",
      aiThinkingText:
        'Analyzing response arguments, benchmarking against rubric criteria, and formulating counter-question...',
      adaptiveFollowUps: [
        {
          keywords: ['negative', 'cycle', 'negative cycle', 'weight', 'weights'],
          question:
            'You mentioned negative weight cycles. How does the Bellman-Ford algorithm detect the presence of a negative cycle in a graph? What is the maximum number of relaxations and why?',
          bloom: 'Bloom 5 - Critical Evaluation'
        },
        {
          keywords: ['greedy', 'settle', 'settled', 'vertex', 'minimal', 'choice'],
          question:
            "Precisely, the greedy nature of Dijkstra. Once a vertex is settled, why can't Dijkstra revisit or update its distance if a negative edge appears subsequently? Provide a brief counterexample.",
          bloom: 'Bloom 4 - Logical Analysis'
        },
        {
          keywords: ['heap', 'priority queue', 'fibonacci', 'complexity', 'decrease-key', 'log'],
          question:
            'In terms of data structure optimization, why is Fibonacci Heap theoretically superior to Binary Heap in Dijkstra? How does Decrease-Key complexity improve?',
          bloom: 'Bloom 4 - Data Structure Mastery'
        },
        {
          keywords: ['bellman', 'relax', 'relaxation', 'v - 1', 'spfa', 'edges'],
          question:
            'In Bellman-Ford, why must we relax all edges exactly V - 1 times? What conclusion can be drawn if edge distances continue to decrease after V - 1 iterations?',
          bloom: 'Bloom 3 - Algorithm Application'
        }
      ],
      fallbackFollowUps: [
        {
          question:
            'To evaluate further: in a graph where a negative cycle exists but is unreachable from the source vertex, how is Bellman-Ford’s outcome affected?',
          bloom: 'Bloom 5 - Advanced Inquiry'
        },
        {
          question:
            'Final counter-question: If the graph is a Directed Acyclic Graph (DAG) with negative edge weights, can we use Topological Sort to achieve O(V + E) complexity instead of Bellman-Ford?',
          bloom: 'Bloom 6 - Optimization & Design'
        }
      ]
    },
    'ja-JP': {
      googleLang: 'ja',
      initialQuestion: {
        title:
          '負の重みを持つグラフにダイクストラ法を適用した場合のメリットとデメリットを分析し、ベルマン・フォード法がなぜこの問題を解決できるのかを説明してください。',
        bloom: 'Bloom 4 & 5 - 分析と評価'
      },
      greeting:
        '受験者の皆さん、こんにちは！AI口頭試問委員会によるCS301（データ構造とアルゴリズム）口頭試問を開始します。最初の質問をお聞きください。',
      closing:
        '口頭試問の受験お疲れ様でした。AI採点システムが現在評価結果を集計しています。',
      placeholder: 'マイクに向かって回答をお話しください...',
      defaultAnswer:
        '試問委員会の皆様、ダイクストラ法は貪欲法（グリーディ手法）を採用しており、一度確定した頂点の最短距離は最適であると仮定して再探索を行いません。そのため負の重みがある場合、最適解が得られない問題が生じます。一方、ベルマン・フォード法は全エッジをV-1回緩和（Relaxation）することで負の重みを正しく処理し、負閉路の検出も可能です。',
      aiThinkingText:
        '受験者の論点を分析し、ルーブリックと照合して深掘り反論質問を生成しています...',
      adaptiveFollowUps: [
        {
          keywords: ['負', '閉路', 'サイクル', 'マイナス', '重み', '負閉路'],
          question:
            '負の重みを持つ閉路（負閉路）について言及されましたね。ベルマン・フォード法はグラフ内に負の閉路が存在することをどのように検出し判定しますか？最大反復回数は何回で、それはなぜですか？',
          bloom: 'Bloom 5 - 批判的評価'
        },
        {
          keywords: ['貪欲', 'グリーディ', '確定', '頂点', '最小', '選択'],
          question:
            'ダイクストラ法の貪欲（グリーディ）な性質そのものですね。一度確定（Settled）した頂点に対し、後から負の重みの辺が見つかった場合、なぜ再更新できないのでしょうか？簡単な反例を挙げて説明してください。',
          bloom: 'Bloom 4 - 論理分析'
        },
        {
          keywords: ['ヒープ', '優先度付きキュー', 'フィボナッチ', '計算量', 'decrease-key', '二分'],
          question:
            'データ構造の最適化の観点から、ダイクストラ法においてフィボナッチヒープが二分ヒープより優れている理由は何ですか？Decrease-Key操作の計算量はどのように改善されますか？',
          bloom: 'Bloom 4 - データ構造理論'
        },
        {
          keywords: ['ベルマン', '緩和', 'リラクゼーション', 'v-1', '反復', 'v - 1'],
          question:
            'ベルマン・フォード法において、なぜすべての辺を正確に (V - 1) 回緩和（Relaxation）する必要があるのでしょうか？(V - 1) 回の緩和後も距離が更新され続ける場合、グラフについて何が言えますか？',
          bloom: 'Bloom 3 - アルゴリズム応用'
        }
      ],
      fallbackFollowUps: [
        {
          question:
            'さらに深く考察してみましょう。始点から到達不能な負閉路が存在する場合、ベルマン・フォード法の探索結果にはどのような影響がありますか？',
          bloom: 'Bloom 5 - 応用試問'
        },
        {
          question:
            '最終試問です：負の重みの辺を含んでいても、グラフが有向非巡回グラフ（DAG）である場合、ベルマン・フォード法の代わりにトポロジカルソートを用いて O(V + E) で解くことは可能ですか？',
          bloom: 'Bloom 6 - 最適化と創造'
        }
      ]
    }
  },

  AI204: {
    'vi-VN': {
      googleLang: 'vi',
      initialQuestion: {
        title:
          'Hãy phân tích hiện tượng Overfitting và Underfitting trong huấn luyện Machine Learning, giải thích sự đánh đổi Bias-Variance (Trade-off) và cách các kỹ thuật Regularization hoặc Dropout giải quyết vấn đề này?',
        bloom: 'Bloom 4 & 5 - Phân tích & Đánh giá'
      },
      greeting:
        'Chào thí sinh! Hội đồng AI Viva bắt đầu ca thi vấn đáp môn AI204 (Học máy & Thị giác máy tính). Mời bạn lắng nghe câu hỏi đầu tiên.',
      closing:
        'Cảm ơn thí sinh đã hoàn thành xuất sắc ca thi vấn đáp AI204. Hệ thống AI đang tổng hợp kết quả.',
      placeholder: 'Hãy trình bày phân tích của bạn vào micro...',
      defaultAnswer:
        'Dạ thưa Hội đồng, Overfitting xảy ra khi mô hình có High Variance, học thuộc lòng nhiễu của tập Train khiến độ chính xác trên Test giảm. Ngược lại, Underfitting là khi High Bias, mô hình quá đơn giản không nắm bắt được quy luật dữ liệu. Ta sử dụng L1/L2 Regularization để phạt trọng số lớn hoặc Dropout ngắt ngẫu nhiên nơ-ron giúp mạng khái quát hóa tốt hơn.',
      aiThinkingText:
        'Đang phân tích cấu trúc luận điểm ML, đối chiếu rubric và trích xuất câu hỏi xoáy chuyên sâu...',
      adaptiveFollowUps: [
        {
          keywords: ['convolutional', 'cnn', 'tích chập', 'pooling', 'feature', 'kernel', 'filter'],
          question:
            'Trong mạng tích chập (CNN), tại sao các lớp Convolutional và Pooling lại có khả năng chống Overfitting tốt hơn lớp Fully Connected (Dense) truyền thống? Hãy giải thích cơ chế chia sẻ trọng số (Parameter Sharing).',
          bloom: 'Bloom 4 - Cấu trúc Deep Learning'
        },
        {
          keywords: ['bias', 'variance', 'đánh đổi', 'trade-off', 'trade off', 'hiệp sai', 'phương sai'],
          question:
            'Bạn vừa nhắc đến Bias-Variance Trade-off. Khi tăng độ phức tạp của mô hình (tăng số layer hoặc tham số), Bias và Variance biến thiên ra sao? Điểm cân bằng tối ưu (Optimal Model Complexity) nằm ở đâu?',
          bloom: 'Bloom 5 - Phân tích hàm mất mát'
        },
        {
          keywords: ['dropout', 'regularization', 'l1', 'l2', 'lasso', 'ridge', 'weight decay', 'phạt'],
          question:
            'Về mặt giải tích và hình học, tại sao L1 Regularization (Lasso) lại tạo ra ma trận trọng số thưa (Sparsity - chọn lọc đặc trưng) trong khi L2 Regularization (Ridge) chỉ co nhỏ trọng số gần 0?',
          bloom: 'Bloom 4 - Tối ưu Gradient Descent'
        },
        {
          keywords: ['augmentation', 'tăng cường', 'dữ liệu', 'k-fold', 'validation', 'cross validation'],
          question:
            'Ngoài Regularization, kỹ thuật Data Augmentation (tăng cường dữ liệu) và K-Fold Cross Validation đóng vai trò kiểm soát Overfitting như thế nào trong các bài toán Computer Vision?',
          bloom: 'Bloom 3 - Kỹ thuật thực nghiệm'
        }
      ],
      fallbackFollowUps: [
        {
          question:
            'Để đánh giá sâu hơn: trong bài toán phân loại ảnh với tập dữ liệu mất cân bằng nghiêm trọng (Class Imbalance), chỉ số Accuracy có phản ánh đúng Overfitting không? Bạn sẽ sử dụng F1-Score hay PR-AUC như thế nào?',
          bloom: 'Bloom 5 - Phản biện đánh giá thực tế'
        },
        {
          question:
            'Câu hỏi phản biện tổng kết: Tại sao Batch Normalization vừa giúp gia tốc quá trình hội tụ Gradient Descent vừa có tác dụng tương tự một cơ chế Regularization phụ trong mạng nơ-ron sâu?',
          bloom: 'Bloom 6 - Sáng tạo & Kiến trúc Mạng'
        }
      ]
    },
    'en-US': {
      googleLang: 'en',
      initialQuestion: {
        title:
          'Please analyze the phenomena of Overfitting and Underfitting in Machine Learning model training, explain the Bias-Variance Trade-off, and discuss how Regularization or Dropout mitigates these issues.',
        bloom: 'Bloom 4 & 5 - Analysis & Evaluation'
      },
      greeting:
        'Welcome candidate! The AI Viva Board is commencing the AI204 (Machine Learning & Computer Vision) oral examination. Please listen carefully to the first question.',
      closing:
        'Thank you for completing the oral examination. The AI system is compiling your AI204 evaluation results.',
      placeholder: 'Speak your analytical response into the microphone...',
      defaultAnswer:
        'Dear Examination Board, Overfitting arises when a model exhibits high variance, memorizing noise in the training set and failing to generalize to unseen test data. Underfitting is characterized by high bias when the model is overly simplistic. We apply L1/L2 Regularization to penalize extreme weights and Dropout to randomly deactivate neurons, enforcing robust feature representations.',
      aiThinkingText:
        'Evaluating ML arguments, checking against rubric criteria, and generating targeted follow-up...',
      adaptiveFollowUps: [
        {
          keywords: ['convolutional', 'cnn', 'pooling', 'feature', 'kernel', 'filter', 'stride'],
          question:
            'In Convolutional Neural Networks (CNNs), why are Convolutional and Pooling layers significantly less prone to overfitting than Dense layers? Explain the concept of Parameter Sharing.',
          bloom: 'Bloom 4 - Deep Learning Architecture'
        },
        {
          keywords: ['bias', 'variance', 'tradeoff', 'trade-off', 'complexity', 'generalization'],
          question:
            'You mentioned the Bias-Variance tradeoff. As model complexity grows (deeper layers or parameters), how do bias and variance behave? Where does the optimal model complexity lie?',
          bloom: 'Bloom 5 - Loss Analysis'
        },
        {
          keywords: ['dropout', 'regularization', 'l1', 'l2', 'lasso', 'ridge', 'weight decay', 'penalty'],
          question:
            'Geometrically and mathematically, why does L1 Regularization (Lasso) induce weight sparsity for feature selection, whereas L2 Regularization (Ridge) smoothly shrinks weights toward zero?',
          bloom: 'Bloom 4 - Optimization Theory'
        },
        {
          keywords: ['augmentation', 'k-fold', 'cross validation', 'dataset', 'generalize'],
          question:
            'Beyond algorithmic regularization, how do Data Augmentation and K-Fold Cross Validation prevent overfitting in computer vision benchmarks?',
          bloom: 'Bloom 3 - Empirical Methodology'
        }
      ],
      fallbackFollowUps: [
        {
          question:
            'To probe further: in an image classification scenario with severe class imbalance, is raw Accuracy reliable for detecting overfitting? How would you employ F1-Score or PR-AUC?',
          bloom: 'Bloom 5 - Real-world Evaluation'
        },
        {
          question:
            'Final counter-question: Why does Batch Normalization accelerate gradient descent convergence while simultaneously exerting a regularizing effect on deep networks?',
          bloom: 'Bloom 6 - Advanced Architecture'
        }
      ]
    },
    'ja-JP': {
      googleLang: 'ja',
      initialQuestion: {
        title:
          '機械学習モデルの訓練における過学習（Overfitting）と学習不足（Underfitting）を分析し、バイアス・バリアンスのトレードオフ、および正則化（Regularization）やDropoutがこの問題をどのように解決するか説明してください。',
        bloom: 'Bloom 4 & 5 - 分析と評価'
      },
      greeting:
        '受験者の皆さん、こんにちは！AI口頭試問委員会によるAI204（機械学習とコンピュータビジョン）口頭試問を開始します。最初の質問をお聞きください。',
      closing:
        'AI204口頭試問の受験お疲れ様でした。AI採点システムが現在評価結果を集計しています。',
      placeholder: 'マイクに向かって分析結果をお話しください...',
      defaultAnswer:
        '試問委員会の皆様、過学習はモデルが訓練データのノイズまで過剰適合し高バリアンスとなる現象です。一方、学習不足はモデルが単純すぎて高バイアスとなります。L1/L2正則化による重み抑制やDropoutによるニューロンの無作為不活性化により、汎化性能を高めて過学習を防止します。',
      aiThinkingText:
        '機械学習の論点を分析し、ルーブリックと照合して深掘り反論質問を生成しています...',
      adaptiveFollowUps: [
        {
          keywords: ['cnn', '畳み込み', 'プーリング', 'pooling', 'カーネル', 'フィルター'],
          question:
            '畳み込みニューラルネットワーク（CNN）において、なぜ畳み込み層とプーリング層は全結合層（Dense）と比較して過学習を起こしにくいのでしょうか？パラメータ共有（Parameter Sharing）のメカニズムを含めて説明してください。',
          bloom: 'Bloom 4 - 深層学習構造'
        },
        {
          keywords: ['バイアス', 'バリアンス', 'トレードオフ', '複雑さ', '分散', '偏り'],
          question:
            'バイアス・バリアンスのトレードオフについて言及されましたね。モデルの複雑さを増大させた場合、バイアスとバリアンスはどのように変動しますか？最適モデル複雑度はどこに位置しますか？',
          bloom: 'Bloom 5 - 損失関数理論'
        },
        {
          keywords: ['正則化', 'dropout', 'l1', 'l2', 'スパース', 'ラッソ', 'リッジ'],
          question:
            '数理的・幾何学的な観点から、L1正則化（Lasso）が重みのスパース化（特徴量選択）を生み出し、L2正則化（Ridge）が重みを滑らかにゼロへ近づける違いを説明してください。',
          bloom: 'Bloom 4 - 勾配降下法最適化'
        },
        {
          keywords: ['データ拡張', '交差検証', 'k-fold', 'augmentation', '検証'],
          question:
            '正則化手法に加え、データ拡張（Data Augmentation）やK分割交差検証（K-Fold CV）は画像認識タスクにおいて過学習の抑制にどのように寄与しますか？',
          bloom: 'Bloom 3 - 実証的手法'
        }
      ],
      fallbackFollowUps: [
        {
          question:
            'さらに深く考察しましょう。不均衡データセット（Class Imbalance）において、正解率（Accuracy）は過学習の検出指標として適切でしょうか？F1-ScoreやPR-AUCをどう活用しますか？',
          bloom: 'Bloom 5 - 実践的評価'
        },
        {
          question:
            '最終試問です：Batch Normalizationが勾配降下法の収束を加速させると同時に、正則化効果をもたらす理由は何ですか？',
          bloom: 'Bloom 6 - ネットワークアーキテクチャ'
        }
      ]
    }
  },

  SE102: {
    'vi-VN': {
      googleLang: 'vi',
      initialQuestion: {
        title:
          'Hãy phân tích sự khác biệt cốt lõi giữa kiến trúc Monolithic và Microservices, giải thích cách giải quyết bài toán tính nhất quán dữ liệu (Data Consistency) và ứng dụng Saga Pattern trong hệ thống phân tán?',
        bloom: 'Bloom 4 & 5 - Phân tích & Đánh giá Kiến trúc'
      },
      greeting:
        'Chào thí sinh! Hội đồng AI Viva bắt đầu ca thi vấn đáp môn SE102 (Kiến trúc Phần mềm). Mời bạn lắng nghe câu hỏi đầu tiên.',
      closing:
        'Cảm ơn thí sinh đã hoàn thành xuất sắc ca thi vấn đáp SE102. Hệ thống AI đang tổng hợp kết quả.',
      placeholder: 'Hãy trình bày giải pháp kiến trúc của bạn vào micro...',
      defaultAnswer:
        'Dạ thưa Hội đồng, kiến trúc Monolithic tập trung toàn bộ nghiệp vụ trong một khối triển khai duy nhất, dễ kiểm thử ban đầu nhưng khó mở rộng. Microservices chia nhỏ theo bounded-context của Domain-Driven Design (DDD), mỗi service sở hữu Database riêng. Để đảm bảo tính nhất quán dữ liệu thay cho 2PC dễ nghẽn mạng, ta áp dụng Saga Pattern qua cơ chế Choreography hoặc Orchestration với Compensating Transactions.',
      aiThinkingText:
        'Đang phân tích cấu trúc thiết kế hệ thống, đối chiếu rubric và trích xuất câu hỏi phản biện...',
      adaptiveFollowUps: [
        {
          keywords: ['saga', 'choreography', 'orchestration', 'bù trừ', 'compensating'],
          question:
            'Trong Saga Pattern, hãy so sánh ưu và nhược điểm giữa hai cơ chế: Choreography (hướng sự kiện phân tán) và Orchestration (điều phối tập trung)? Khi nào nên chọn Orchestrator?',
          bloom: 'Bloom 4 - So sánh thiết kế'
        },
        {
          keywords: ['cap', 'nhất quán', 'tính sẵn sàng', 'partition', 'consistency', 'availability'],
          question:
            'Theo định lý CAP (Brewer Theorem), tại sao trong mạng phân tán diện rộng, ta bắt buộc phải thỏa hiệp giữa Consistency (C) và Availability (A)? Eventual Consistency giải quyết mâu thuẫn này ra sao?',
          bloom: 'Bloom 5 - Phản biện nguyên lý phân tán'
        },
        {
          keywords: ['cqrs', 'event sourcing', 'database', 'cơ sở dữ liệu', 'read', 'write'],
          question:
            'Mô hình CQRS (Command Query Responsibility Segregation) kết hợp Event Sourcing mang lại lợi ích gì cho hiệu năng đọc/ghi trong Microservices? Thách thức lớn nhất khi đồng bộ Read Model là gì?',
          bloom: 'Bloom 4 - Thiết kế dữ liệu nâng cao'
        },
        {
          keywords: ['circuit breaker', 'resilience', 'chịu lỗi', 'api gateway', 'timeout'],
          question:
            'Khi một microservice downstream gặp sự cố quá tải hoặc độ trễ cao, cơ chế Circuit Breaker hoạt động qua các trạng thái Closed, Open, Half-Open ra sao để ngăn Cascading Failure?',
          bloom: 'Bloom 3 - Khả năng chịu lỗi Resiliency'
        }
      ],
      fallbackFollowUps: [
        {
          question:
            'Để đánh giá sâu hơn: khi di chuyển một hệ thống Monolithic lâu năm sang Microservices, bạn sẽ áp dụng Strangler Fig Pattern như thế nào để giảm thiểu rủi ro gián đoạn vận hành?',
          bloom: 'Bloom 5 - Chiến lược di chuyển kiến trúc'
        },
        {
          question:
            'Câu hỏi phản biện tổng kết: Tại sao Distributed Tracing (như OpenTelemetry, Jaeger) và Correlation ID lại là yêu cầu sống còn khi giám sát Observability trong hệ thống Microservices phức tạp?',
          bloom: 'Bloom 6 - Vận hành & Giám sát Hệ thống'
        }
      ]
    },
    'en-US': {
      googleLang: 'en',
      initialQuestion: {
        title:
          'Please analyze the core differences between Monolithic and Microservices architectures, explain how data consistency is achieved, and discuss the application of the Saga Pattern in distributed systems.',
        bloom: 'Bloom 4 & 5 - Analysis & Architectural Evaluation'
      },
      greeting:
        'Welcome candidate! The AI Viva Board is commencing the SE102 (Software Architecture) oral examination. Please listen carefully to the first question.',
      closing:
        'Thank you for completing the oral examination. The AI system is compiling your SE102 evaluation results.',
      placeholder: 'Speak your architectural analysis into the microphone...',
      defaultAnswer:
        'Dear Examination Board, Monolithic architectures bundle all business logic into a single deployable unit, simple initially but hindering scalability. Microservices decompose components into domain-driven bounded contexts with database-per-service. To preserve data consistency without blocking 2PC locks, we adopt the Saga Pattern through Choreography or Orchestration with compensating transactions.',
      aiThinkingText:
        'Analyzing architectural reasoning, checking rubric standards, and drafting counter-inquiry...',
      adaptiveFollowUps: [
        {
          keywords: ['saga', 'choreography', 'orchestration', 'compensating', 'coordinator'],
          question:
            'Within the Saga Pattern, compare the trade-offs between Choreography (event-driven) and Orchestration (central coordinator). In which enterprise scenarios is an Orchestrator preferred?',
          bloom: 'Bloom 4 - Design Trade-offs'
        },
        {
          keywords: ['cap', 'consistency', 'availability', 'partition', 'eventual'],
          question:
            'According to the CAP theorem, why must distributed systems trade off Consistency against Availability when network partitions occur? How does Eventual Consistency reconcile this constraint?',
          bloom: 'Bloom 5 - Distributed Theory'
        },
        {
          keywords: ['cqrs', 'event sourcing', 'read model', 'write', 'events'],
          question:
            'What advantages does CQRS combined with Event Sourcing offer for read/write scalability in microservices? What is the primary difficulty regarding eventual read model synchronization?',
          bloom: 'Bloom 4 - Data Engineering'
        },
        {
          keywords: ['circuit breaker', 'resilience', 'cascading', 'fault', 'gateway'],
          question:
            'When a downstream dependency experiences severe degradation, how does a Circuit Breaker navigate through Closed, Open, and Half-Open states to prevent cascading system outages?',
          bloom: 'Bloom 3 - System Resiliency'
        }
      ],
      fallbackFollowUps: [
        {
          question:
            'To probe deeper: when migrating a legacy Monolith into Microservices, how would you systematically execute the Strangler Fig Pattern to minimize production disruption?',
          bloom: 'Bloom 5 - Migration Strategy'
        },
        {
          question:
            'Final counter-question: Why are Distributed Tracing (e.g. OpenTelemetry) and Correlation IDs non-negotiable prerequisites for observability across polyglot microservices?',
          bloom: 'Bloom 6 - Production Observability'
        }
      ]
    },
    'ja-JP': {
      googleLang: 'ja',
      initialQuestion: {
        title:
          'モノリシック（Monolithic）とマイクロサービス（Microservices）のアーキテクチャの本質的な違いを分析し、分散システムにおけるデータ整合性（Data Consistency）の維持方法およびSagaパターンの適用について説明してください。',
        bloom: 'Bloom 4 & 5 - アーキテクチャ分析と評価'
      },
      greeting:
        '受験者の皆さん、こんにちは！AI口頭試問委員会によるSE102（ソフトウェアアーキテクチャ）口頭試問を開始します。最初の質問をお聞きください。',
      closing:
        'SE102口頭試問の受験お疲れ様でした。AI採点システムが現在評価結果を集計しています。',
      placeholder: 'マイクに向かってアーキテクチャ設計をお話しください...',
      defaultAnswer:
        '試問委員会の皆様、モノリスは単一デプロイ単位で初期開発は容易ですが大規模化で保守性が低下します。マイクロサービスはドメイン駆動設計（DDD）境界づけられたコンテキストに基づき分割し、DB-per-serviceを採用します。データ整合性には2PCのブロッキングを避け、Sagaパターン（Choreography / Orchestration）と補償トランザクションを適用します。',
      aiThinkingText:
        'アーキテクチャ論点を分析し、ルーブリックと照合して深掘り反論質問を生成しています...',
      adaptiveFollowUps: [
        {
          keywords: ['saga', 'choreography', 'orchestration', '補償', 'オーケストレーション'],
          question:
            'Sagaパターンにおいて、コレオグラフィ（イベント駆動）とオーケストレーション（中央調停者）の長所と短所を比較してください。どのような場合にオーケストレータを優先すべきですか？',
          bloom: 'Bloom 4 - 設計トレードオフ'
        },
        {
          keywords: ['cap', '整合性', '可用性', '分断', '結果整合性', 'consistency'],
          question:
            'CAP定理において、ネットワーク分断（P）が発生した際に一貫性（C）と可用性（A）の間でトレードオフが生じる理由は何ですか？結果整合性（Eventual Consistency）はこの対立をどう解決しますか？',
          bloom: 'Bloom 5 - 分散システム理論'
        },
        {
          keywords: ['cqrs', 'イベントソーシング', 'リードモデル', '書き込み', '同期'],
          question:
            'CQRSとイベントソーシングを組み合わせることで、マイクロサービスの読み書きスケーラビリティはどのように向上しますか？リードモデル同期における最大の課題は何ですか？',
          bloom: 'Bloom 4 - データモデリング'
        },
        {
          keywords: ['サーキットブレーカー', '障害', '耐障害性', 'circuit breaker', '遮断'],
          question:
            '下流サービスが過負荷に陥った際、サーキットブレーカー（Closed, Open, Half-Open）は連鎖障害（Cascading Failure）を防止するためにどのように動作しますか？',
          bloom: 'Bloom 3 - 耐障害性設計'
        }
      ],
      fallbackFollowUps: [
        {
          question:
            'さらに深く考察しましょう。レガシーなモノリスをマイクロサービスに段階移行する際、ビジネスの中断リスクを最小化するためにストラングラーパターン（Strangler Fig）をどのように適用しますか？',
          bloom: 'Bloom 5 - 移行戦略'
        },
        {
          question:
            '最終試問です：複雑なマイクロサービス群において、分散トレーシング（OpenTelemetry等）と相関ID（Correlation ID）がオブザーバビリティの維持に不可欠である理由は何ですか？',
          bloom: 'Bloom 6 - 運用と可観測性'
        }
      ]
    }
  }
};

// Helper: resolve content for course & language safely
export const getCourseContent = (subjectCode = 'SWD392', langCode = 'vi-VN') => {
  const normSubject = (subjectCode || 'SWD392').toUpperCase();
  const subjectBank = COURSE_MULTILANG_CONTENT[normSubject] || COURSE_MULTILANG_CONTENT['SWD392'] || COURSE_MULTILANG_CONTENT['CS301'];
  return subjectBank[langCode] || subjectBank['vi-VN'] || (COURSE_MULTILANG_CONTENT['SWD392'] && COURSE_MULTILANG_CONTENT['SWD392']['vi-VN']) || COURSE_MULTILANG_CONTENT['CS301']['vi-VN'];
};


// ================= IT TERMINOLOGY SANITIZER (Code-switching EN/VI) =================
const IT_TERM_RULES = [
  { r: /\b(mai cờ rô sơ vít|mai cờ rô sơ vịt|mai cơ rô sơ vít|mai cờ rô|mai cơ rô)\b/gi, w: 'Microservices' },
  { r: /\b(rét đít|re đít|rê đít|ré đít)\b/gi, w: 'Redis' },
  { r: /\b(cát ca|cáp ca|káp ca)\b/gi, w: 'Kafka' },
  { r: /\b(xa ga|sa ga|xa ga pattern)\b/gi, w: 'Saga Pattern' },
  { r: /\b(sơ cút bơ rếch cơ|sơ kết bơ rếch|sơ kít|sơ kết)\b/gi, w: 'Circuit Breaker' },
  { r: /\b(pốt gơ rét|pốt gờ re|pốt gres|pót gres)\b/gi, w: 'PostgreSQL' },
  { r: /\b(sờ pring bút|sờ pring|xờ pring)\b/gi, w: 'Spring Boot' },
  { r: /\b(rết phu|rét phu|rét ét pi ai|rết a pi)\b/gi, w: 'RESTful API' },
  { r: /\b(đét lốc|đét lốt|đét lóc)\b/gi, w: 'Deadlock' },
  { r: /\b(trăng rắc sơn|chăng rắc sơn|tran sắc sơn)\b/gi, w: 'Transaction' },
  { r: /\b(thớt|chét|luồng thớt)\b/gi, w: 'Thread' },
  { r: /\b(cát che|cát chơ|khe che|két)\b/gi, w: 'Cache' },
  { r: /\b(đốc cơ|đốc kơ|đó cơ)\b/gi, w: 'Docker' },
  { r: /\b(cu bơ nét|cu bơ ne tít|ku bơ nét)\b/gi, w: 'Kubernetes' },
  { r: /\b(đây ta bây|đát ta bây|đát ta ba se)\b/gi, w: 'Database' },
  { r: /\b(rôn bách|dôn bách|rôn béc)\b/gi, w: 'Rollback' },
  { r: /\b(mô nô lít|mô nô li thíc)\b/gi, w: 'Monolithic' },
  { r: /\b(ráp bít em quy|ra bít|ráp bít)\b/gi, w: 'RabbitMQ' },
  { r: /\b(xi đi|ci cd|xi ai xi đi)\b/gi, w: 'CI/CD' },
  { r: /\b(ét kiu en|si queo|xì queo)\b/gi, w: 'SQL' },
  { r: /\b(nô ét kiu en|nô si queo)\b/gi, w: 'NoSQL' },
  { r: /\b(át xít|a xít)\b/gi, w: 'ACID' },
  { r: /\b(cáp thi ô rem|cáp ti ô rem)\b/gi, w: 'CAP theorem' },
  { r: /\b(o chet tra sân|o ke tra sân)\b/gi, w: 'Orchestration' },
  { r: /\b(cô rê ô gra phi|ko re o gra fi)\b/gi, w: 'Choreography' },
  { r: /\b(áp ly|áp lai)\b/gi, w: 'Apply' },
  { r: /\b(ri chai|di chai)\b/gi, w: 'Retry' },
  { r: /\b(mô đen|mô đần)\b/gi, w: 'Model' },
];

const sanitizeITTranscript = (text) => {
  if (!text) return '';
  let cleaned = text;
  IT_TERM_RULES.forEach((rule) => {
    cleaned = cleaned.replace(rule.r, rule.w);
  });
  return cleaned;
};

const getInitialVivaQuestion = (subject, preferredSessionId) => {
  const normSubj = (subject || 'SWD392').toUpperCase();
  try {
    const allSessionsRaw = localStorage.getItem('aives_exam_sessions');
    if (allSessionsRaw) {
      const sessions = JSON.parse(allSessionsRaw);
      if (Array.isArray(sessions) && sessions.length > 0) {
        const match =
          (preferredSessionId && sessions.find((s) => s.id === preferredSessionId || s.sessionCode === preferredSessionId)) ||
          sessions.find((s) => s.subjectCode && s.subjectCode.toUpperCase() === normSubj && s.questions?.length > 0) ||
          sessions.find((s) => s.questions?.length > 0) ||
          sessions[0];
        if (match?.questions?.length > 0) {
          return {
            title: match.questions[0].content,
            bloom: match.questions[0].bloomLevel || 'Bloom 3 - Vận dụng'
          };
        }
      }
    }
    const latestRaw = localStorage.getItem('aives_latest_active_exam');
    if (latestRaw) {
      const parsed = JSON.parse(latestRaw);
      if (Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        return {
          title: parsed.questions[0].content,
          bloom: parsed.questions[0].bloomLevel || 'Bloom 3 - Vận dụng'
        };
      }
    }
    const bankRaw = localStorage.getItem('aives_question_bank');
    if (bankRaw) {
      const bank = JSON.parse(bankRaw);
      if (Array.isArray(bank) && bank.length > 0) {
        const match = bank.find((q) => q.subjectCode && q.subjectCode.toUpperCase() === normSubj) || bank[0];
        return {
          title: match.content,
          bloom: match.bloomLevel || 'Bloom 3 - Vận dụng'
        };
      }
    }
  } catch (e) {}
  return {
    title: 'Trình bày kiến trúc Microservices và cơ chế đảm bảo tính nhất quán dữ liệu phân tán (Eventual Consistency) bằng Saga Pattern.',
    bloom: 'Bloom 4 - Phân tích & Thiết kế'
  };
};

export default function VivaRoomPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active session and course resolution from localStorage / URL
  const currentSession = (() => {
    try {
      const stored = localStorage.getItem('aives_current_session');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  })();

  const urlSessionId = searchParams.get('sessionId') || searchParams.get('id') || currentSession?.sessionId || currentSession?.id;

  const targetSessionFromStorage = (() => {
    try {
      const allSessionsRaw = localStorage.getItem('aives_exam_sessions');
      if (allSessionsRaw) {
        const sessions = JSON.parse(allSessionsRaw);
        if (Array.isArray(sessions) && sessions.length > 0) {
          if (urlSessionId) {
            const m = sessions.find((s) => s.id === urlSessionId || s.sessionCode === urlSessionId);
            if (m) return m;
          }
          const latestRaw = localStorage.getItem('aives_latest_active_exam');
          if (latestRaw) {
            const parsed = JSON.parse(latestRaw);
            const mLatest = sessions.find((s) => s.id === parsed.id || s.sessionCode === parsed.sessionCode);
            if (mLatest) return mLatest;
          }
          return sessions[0];
        }
      }
    } catch (e) {}
    return null;
  })();

  const rawSubject =
    searchParams.get('subject') ||
    targetSessionFromStorage?.subjectCode ||
    currentSession?.subject ||
    'SWD392';
  const activeSubject = (rawSubject || 'SWD392').toUpperCase();

  // Language Resolution: Subject Config -> Session Config -> Subject LocalCache -> URL Param -> default 'vi-VN'
  const getInitialLang = () => {
    if (currentSession?.language) {
      const sl = currentSession.language.toLowerCase();
      if (sl.startsWith('en')) return 'en-US';
      if (sl.startsWith('vi')) return 'vi-VN';
    }
    if (activeSubject) {
      const subjectConfig = localStorage.getItem(`aives_subject_lang_${activeSubject}`);
      if (subjectConfig) {
        if (subjectConfig.toLowerCase().startsWith('en')) return 'en-US';
        if (subjectConfig.toLowerCase().startsWith('vi')) return 'vi-VN';
      }
    }
    const urlLang = searchParams.get('lang');
    if (urlLang) {
      const l = urlLang.toLowerCase();
      if (l === 'vi' || l === 'vi-vn') return 'vi-VN';
      if (l === 'en' || l === 'en-us') return 'en-US';
    }
    return 'vi-VN';
  };

  const [examLang, setExamLang] = useState(getInitialLang);
  const examLangRef = useRef(examLang);
  examLangRef.current = examLang;

  // Stable UUID for real-time WebSocket STOMP exam room
  const [sessionUuid, setSessionUuid] = useState(() => {
    const urlId = searchParams.get('sessionId') || searchParams.get('id');
    if (urlId && /^[0-9a-fA-F-]{36}$/.test(urlId)) return urlId;
    if (currentSession?.sessionId && /^[0-9a-fA-F-]{36}$/.test(currentSession.sessionId)) return currentSession.sessionId;
    if (currentSession?.id && /^[0-9a-fA-F-]{36}$/.test(currentSession.id)) return currentSession.id;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  });
  const sessionUuidRef = useRef(sessionUuid);
  sessionUuidRef.current = sessionUuid;

  // Single-attempt enforcement: check if session is already completed or waiting confirmation
  useEffect(() => {
    const checkSessionStatus = async () => {
      const targetId = sessionUuid;
      if (targetId && /^[0-9a-fA-F-]{36}$/.test(targetId)) {
        try {
          const res = await studentExamApi.getSessionById(targetId);
          if (res?.data?.result) {
            const s = res.data.result;
            if (s.status === 'WAITING_SCORE_CONFIRMATION' || s.status === 'COMPLETED') {
              alert('Bạn đã hoàn tất lượt thi của ca này (mỗi sinh viên chỉ được thi 1 lần duy nhất). Hệ thống đang chuyển bạn về Bảng điều khiển.');
              navigate('/student');
            }
          }
        } catch (e) {
          // If session not found in DB yet, proceed
        }
      }
    };
    checkSessionStatus();
  }, [sessionUuid, navigate]);

  // Auto-submit when student closes the tab or navigates away
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (sessionUuid) {
        try {
          studentExamApi.finishExam(sessionUuid);
        } catch (err) {}
      }
      e.returnValue = 'Rời phòng thi sẽ tự động nộp bài ca thi này!';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [sessionUuid]);

  // Real question UUID tracked from database
  const [activeQuestionUuid, setActiveQuestionUuid] = useState(null);

  // Real-time STOMP WebSocket Client & Turn Score Tracking
  const stompClientRef = useRef(null);
  const [isWsConnected, setIsWsConnected] = useState(false);
  const turnScoresRef = useRef([]);
  const [turnScores, setTurnScores] = useState([]);
  const handleWsTurnResponseRef = useRef(null);

  // Handle incoming AI evaluation & adaptive follow-up from Backend (STOMP WebSocket or REST API)
  const applyBackendTurnResult = (turnResult, studentAnswerText) => {
    if (!isProcessingTurnRef.current) return;

    const evaluatedScore = Number(turnResult.suggestedScore ?? turnResult.score ?? 8.5);
    const newScore = {
      turnOrder: turnResult.turnOrder || speechTurnRef.current,
      score: evaluatedScore,
      aiEvaluation: turnResult.aiEvaluation || 'Đánh giá AI: Lập luận mạch lạc, nắm vững nguyên lý học thuật.',
      bloomLevel: turnResult.bloomLevel || 'Bloom 4 - Phân tích & Phản biện'
    };
    turnScoresRef.current = [...turnScoresRef.current, newScore];
    setTurnScores([...turnScoresRef.current]);

    const isLastTurn = Boolean(turnResult.lastTurn) || speechTurnRef.current >= maxTurns;
    if (isLastTurn) {
      finishExamSession(turnScoresRef.current, turnResult.aiEvaluation);
      return;
    }

    const nextTurnIdx = speechTurnRef.current;
    const assignedList = assignedQuestionsRef.current;
    let nextQuestionText = null;
    let nextQuestionBloom = 'Bloom 4 - Phân tích';

    if (assignedList && assignedList.length > nextTurnIdx) {
      // Prioritize the real pre-assigned questions chosen by the lecturer for this exam!
      const assigned = assignedList[nextTurnIdx];
      nextQuestionText = assigned.content;
      nextQuestionBloom = assigned.bloomLevel || 'Bloom 4 - Phân tích';
      setActiveQuestionUuid(assigned.uuid || assigned.id);
    } else if (
      turnResult.followupQuestion &&
      !turnResult.followupQuestion.includes('vui lòng tập trung') &&
      !turnResult.followupQuestion.includes('không trả lời') &&
      turnResult.followupQuestion.trim().length > 5
    ) {
      nextQuestionText = turnResult.followupQuestion;
      nextQuestionBloom = turnResult.bloomLevel || 'Bloom: Phản biện thích ứng AI';
    }

    if (nextQuestionText) {
      setSpeechTurn((prev) => prev + 1);
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

      setDialogue((prev) => [
        ...prev,
        {
          sender: 'ai',
          time: timeStr,
          text: nextQuestionText,
          isMainQuestion: true
        }
      ]);

      setCurrentQuestion({
        title: nextQuestionText,
        bloom: nextQuestionBloom
      });

      setFsmState(STATES.AI_SPEAKING);
      isProcessingTurnRef.current = false;
    } else {
      generateFollowUpQuestion(studentAnswerText || '');
    }
  };

  handleWsTurnResponseRef.current = (wsData) => {
    applyBackendTurnResult(wsData, liveTranscriptRef.current);
  };

  // Dynamic Subject Language Synchronization from Backend
  useEffect(() => {
    let isMounted = true;
    const syncSubjectLanguage = async () => {
      try {
        const res = await subjectApi.getSubjectByCode(activeSubject);
        const subjData = res?.data?.result || res?.data;
        if (isMounted && subjData?.language) {
          const resolvedLang = subjData.language.toLowerCase().startsWith('en') ? 'en-US' : 'vi-VN';
          localStorage.setItem(`aives_subject_lang_${activeSubject}`, resolvedLang);
          if (resolvedLang !== examLangRef.current) {
            setExamLang(resolvedLang);
            examLangRef.current = resolvedLang;
            const updatedContent = getCourseContent(activeSubject, resolvedLang);
            if (speechTurnRef.current === 1 && (!assignedQuestionsRef.current || assignedQuestionsRef.current.length === 0)) {
              setCurrentQuestion({
                title: updatedContent.initialQuestion.title,
                bloom: updatedContent.initialQuestion.bloom
              });
            }
          }
        }
      } catch (err) {
        console.warn('[AIVES VivaRoom] Subject language config fetch warning:', err);
      }
    };
    syncSubjectLanguage();
    return () => { isMounted = false; };
  }, [activeSubject]);

  // Dynamic Real Question from DB & Real Session Initialization in Backend
  useEffect(() => {
    let isMounted = true;

    const initExamData = async () => {
      // 1. Fetch real approved questions from Question Bank & localStorage
      try {
        const qRes = await lecturerQuestionApi.getQuestions({ status: 'ACTIVE' });
        const list = qRes?.data?.result || qRes?.data || [];
        let allQuestions = [...list];

        try {
          const localBankRaw = localStorage.getItem('aives_question_bank');
          if (localBankRaw) {
            const localBank = JSON.parse(localBankRaw);
            if (Array.isArray(localBank)) {
              const existingIds = new Set(allQuestions.map(q => q.uuid || q.id));
              localBank.forEach(q => {
                if (!existingIds.has(q.uuid || q.id)) {
                  allQuestions.push(q);
                }
              });
            }
          }
        } catch (e) {}

        let assignedQuestions = [];
        const urlSessionId = searchParams.get('sessionId') || searchParams.get('id');

        // PRIORITY 1: Load directly from lecturer's configured active exam session in localStorage
        try {
          if (targetSessionFromStorage?.questions && targetSessionFromStorage.questions.length > 0) {
            assignedQuestions = targetSessionFromStorage.questions;
          }
          if (assignedQuestions.length === 0) {
            const latestExamRaw = localStorage.getItem('aives_latest_active_exam');
            if (latestExamRaw) {
              const parsedLatest = JSON.parse(latestExamRaw);
              if (Array.isArray(parsedLatest.questions) && parsedLatest.questions.length > 0) {
                assignedQuestions = parsedLatest.questions;
              }
            }
          }
          if (assignedQuestions.length === 0) {
            const allExamsRaw = localStorage.getItem('aives_exam_sessions');
            if (allExamsRaw) {
              const allExams = JSON.parse(allExamsRaw);
              if (Array.isArray(allExams)) {
                const targetExam = allExams.find((e) =>
                  (urlSessionId && (e.id === urlSessionId || e.sessionCode === urlSessionId)) ||
                  (!urlSessionId && e.subjectCode && e.subjectCode.toUpperCase() === activeSubject)
                ) || allExams[0];
                if (targetExam?.questions?.length > 0) {
                  assignedQuestions = targetExam.questions;
                }
              }
            }
          }
        } catch (e) {}

        // PRIORITY 2: Check backend session feedback for assigned question IDs
        if (assignedQuestions.length === 0 && urlSessionId) {
          try {
            const sessRes = await studentExamApi.getSessionById(urlSessionId);
            const sessData = sessRes?.data?.result;
            if (sessData?.feedback && sessData.feedback.includes('QUESTIONS:')) {
              const qPart = sessData.feedback.split('|')[0].replace('QUESTIONS:', '').trim();
              const qIds = qPart.split(',').filter(Boolean);
              if (qIds.length > 0) {
                assignedQuestions = qIds.map(id => allQuestions.find(q => (q.uuid || q.id) === id)).filter(Boolean);
              }
            }
          } catch (e) {}
        }

        // PRIORITY 3: Matching subject questions from question bank
        if (assignedQuestions.length === 0) {
          assignedQuestions = allQuestions.filter(
            (q) => q.subjectCode && q.subjectCode.toUpperCase() === activeSubject
          );
        }
        if (assignedQuestions.length === 0 && allQuestions.length > 0) {
          assignedQuestions = allQuestions.filter(
            (q) => !q.subjectCode || q.subjectCode.toUpperCase() === activeSubject
          );
        }

        if (isMounted && assignedQuestions.length > 0) {
          assignedQuestionsRef.current = assignedQuestions;
          setExamQuestions(assignedQuestions);
          setCurrentQuestionIndex(0);
          const chosenQ = assignedQuestions[0];
          setActiveQuestionUuid(chosenQ.uuid || chosenQ.id);
          setCurrentQuestion({
            title: chosenQ.content,
            bloom: chosenQ.bloomLevel || 'Bloom 3 - Vận dụng'
          });
        }
      } catch (err) {
        console.warn('[AIVES VivaRoom] Real question bank query notice, using default syllabus:', err);
      }

      // 2. Initialize or connect real exam session in database
      try {
        const urlSessionId = searchParams.get('sessionId') || searchParams.get('id');
        if (!urlSessionId) {
          const startRes = await studentExamApi.startExam(null, { subjectCode: activeSubject });
          const sess = startRes?.data?.result;
          if (isMounted && sess?.id) {
            setSessionUuid(sess.id);
            sessionUuidRef.current = sess.id;
            console.log('[AIVES VivaRoom] Registered real exam session in DB:', sess.id);
          }
        }
      } catch (sessErr) {
        console.warn('[AIVES VivaRoom] Session start notice, using local session UUID:', sessErr);
      }
    };

    initExamData();
    return () => { isMounted = false; };
  }, [activeSubject]);

  const catalogEntry = COURSE_CATALOG[activeSubject] || {
    code: activeSubject,
    name:
      activeSubject === 'SWD392'
        ? 'Kiến trúc Phần mềm'
        : activeSubject === 'AI204'
        ? 'Học máy & Thị giác máy tính'
        : 'Cấu trúc Dữ liệu & Giải thuật'
  };
  const activeCourseName = targetSessionFromStorage?.subjectName || currentSession?.courseName || `${catalogEntry.code}: ${catalogEntry.name}`;

  // FSM State
  const [fsmState, setFsmState] = useState(STATES.AI_SPEAKING);
  const fsmStateRef = useRef(fsmState);
  fsmStateRef.current = fsmState;

  // Configured limits from lecturer session
  const configuredTimeLimit = Number(targetSessionFromStorage?.questionTimeLimitSeconds) || 90;
  const configuredMaxFollowUps = Number(targetSessionFromStorage?.maxFollowUpsPerQuestion) ?? 1;

  const [questionTimeLimit, setQuestionTimeLimit] = useState(configuredTimeLimit);
  const [maxFollowUps, setMaxFollowUps] = useState(configuredMaxFollowUps);

  // Exam Questions list
  const [examQuestions, setExamQuestions] = useState(() => {
    if (targetSessionFromStorage?.questions && targetSessionFromStorage.questions.length > 0) {
      return targetSessionFromStorage.questions;
    }
    const initialQ = getInitialVivaQuestion(activeSubject, urlSessionId);
    return [
      {
        uuid: 'q1',
        content: initialQ.title,
        bloomLevel: initialQ.bloom
      }
    ];
  });

  // Current Question Index (0 .. examQuestions.length - 1)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestionIndexRef = useRef(0);
  currentQuestionIndexRef.current = currentQuestionIndex;

  // Follow-up phase for current question (false = main question, true = adaptive follow-up)
  const [isFollowUpPhase, setIsFollowUpPhase] = useState(false);
  const isFollowUpPhaseRef = useRef(false);
  isFollowUpPhaseRef.current = isFollowUpPhase;
  const [followUpQuestionText, setFollowUpQuestionText] = useState('');

  // Stores all completed questions data for grading approval & student history
  const allQuestionTurnsRef = useRef([]);
  const [allQuestionTurns, setAllQuestionTurns] = useState([]);

  // Turn management (legacy ref for backwards compatibility)
  const [speechTurn, setSpeechTurn] = useState(1);
  const assignedQuestionsRef = useRef(examQuestions);
  const speechTurnRef = useRef(1);
  speechTurnRef.current = speechTurn;
  const maxTurns = examQuestions.length;

  // Current Question
  const [currentQuestion, setCurrentQuestion] = useState(() => {
    return getInitialVivaQuestion(activeSubject, urlSessionId);
  });

  // Dialogue History
  const [dialogue, setDialogue] = useState(() => {
    const langContent = getCourseContent(activeSubject, getInitialLang());
    return [
      {
        sender: 'ai',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        text: `Chào thí sinh! Hội đồng AI Viva bắt đầu ca thi vấn đáp môn ${activeSubject}. Mời bạn lắng nghe câu hỏi đầu tiên.`
      }
    ];
  });

  // STT Live Transcript & Persistent Accumulation Ref
  const [liveTranscript, setLiveTranscript] = useState('');
  const finalAccumulatedTranscriptRef = useRef('');
  const liveTranscriptRef = useRef('');
  liveTranscriptRef.current = liveTranscript;

  // Recorded Audio Blob & URL for Candidate Review
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Timers: derived strictly from total questions * question limit * (1 + follow-ups)
  const initialCalculatedExamSeconds = Math.max(
    60,
    (examQuestions.length || 1) * configuredTimeLimit * (1 + configuredMaxFollowUps)
  );
  const [timerSeconds, setTimerSeconds] = useState(initialCalculatedExamSeconds);
  const [turnSeconds, setTurnSeconds] = useState(configuredTimeLimit); // answer timer
  const [isMarked, setIsMarked] = useState(false);
  const [micLevel, setMicLevel] = useState(15);

  // Audio & Media Refs
  const pipVideoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const transcriptBottomRef = useRef(null);

  // Synchronization & Lifecycle Refs (Anti-race condition & safe cleanup)
  const isProcessingTurnRef = useRef(false);
  const isManuallyStoppedRef = useRef(false);
  const recognitionRef = useRef(null);
  const isSpeechSynthesizingRef = useRef(false);
  const currentAudioRef = useRef(null);

  // Voice Diagnostic Modal State
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [voiceTestStatus, setVoiceTestStatus] = useState('');
  const [detectedVoices, setDetectedVoices] = useState([]);

  // Auto-scroll transcript to bottom
  const scrollToBottom = () => {
    transcriptBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [dialogue, liveTranscript, fsmState]);

  // Main Exam Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // STOMP WebSocket Room Connection & Subscription
  useEffect(() => {
    let isMounted = true;
    const wsUrl = 'http://localhost:8080/ws';

    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        if (!isMounted) return;
        setIsWsConnected(true);
        console.log(`[AIVES STOMP] Connected to room: /topic/exam/${sessionUuid}`);

        client.subscribe(`/topic/exam/${sessionUuid}`, (message) => {
          try {
            const data = JSON.parse(message.body);
            console.log('[AIVES STOMP] Received AI turn payload:', data);
            handleWsTurnResponseRef.current?.(data);
          } catch (e) {
            console.error('[AIVES STOMP] Parse error on incoming turn message:', e);
          }
        });
      },
      onDisconnect: () => {
        if (isMounted) setIsWsConnected(false);
      },
      onStompError: (frame) => {
        console.warn('[AIVES STOMP] Broker error:', frame.headers['message']);
        if (isMounted) setIsWsConnected(false);
      },
      onWebSocketClose: () => {
        if (isMounted) setIsWsConnected(false);
      }
    });

    try {
      client.activate();
      stompClientRef.current = client;
    } catch (err) {
      console.warn('[AIVES STOMP] Activation caught:', err);
    }

    return () => {
      isMounted = false;
      if (stompClientRef.current) {
        try {
          stompClientRef.current.deactivate();
        } catch (e) { }
        stompClientRef.current = null;
      }
    };
  }, [sessionUuid]);

  // Answer Turn Countdown Timer (runs only in STUDENT_ANSWERING)
  useEffect(() => {
    let turnTimer;
    if (fsmState === STATES.STUDENT_ANSWERING) {
      setTurnSeconds(questionTimeLimit);
      turnTimer = setInterval(() => {
        setTurnSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(turnTimer);
            if (!isProcessingTurnRef.current) {
              handleStopAndReview();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(turnTimer);
  }, [fsmState, questionTimeLimit]);

  // Setup Webcam PIP & Audio Volume Meter
  useEffect(() => {
    let isCancelled = false;

    const setupMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true
        });

        if (isCancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        mediaStreamRef.current = stream;
        if (pipVideoRef.current) {
          pipVideoRef.current.srcObject = stream;
        }

        // Web Audio API for real-time Mic Volume
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass && stream.getAudioTracks().length > 0) {
          const audioCtx = new AudioContextClass();
          audioContextRef.current = audioCtx;
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          analyserRef.current = analyser;

          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);

          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          const updateVolume = () => {
            if (!analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
              sum += dataArray[i];
            }
            const avg = sum / bufferLength;
            const level = Math.max(10, Math.min(100, Math.round((avg / 128) * 100)));
            setMicLevel(level);

            animationFrameRef.current = requestAnimationFrame(updateVolume);
          };
          animationFrameRef.current = requestAnimationFrame(updateVolume);
        }
      } catch (err) {
        console.warn('Webcam/Microphone access error:', err);
      }
    };

    setupMedia();

    return () => {
      isCancelled = true;
      isManuallyStoppedRef.current = true;
      stopAllSpeech();
      stopMediaRecording();
      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => { });
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) { }
        recognitionRef.current = null;
      }
    };
  }, []);


  // Pre-load voices on mount
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const updateVoices = () => {
        const vList = window.speechSynthesis.getVoices();
        setDetectedVoices(vList);
      };
      updateVoices();
      window.speechSynthesis.addEventListener('voiceschanged', updateVoices);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', updateVoices);
      };
    }
  }, []);

  // Stop both SpeechSynthesis and Google TTS Audio stream
  const stopAllSpeech = () => {
    isSpeechSynthesizingRef.current = false;
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) { }
    }
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      } catch (e) { }
      currentAudioRef.current = null;
    }
  };

  // Helper: Find voice matching target language code
  const findVoiceForLang = (availableVoices, langCode) => {
    if (!availableVoices || availableVoices.length === 0) return null;
    const targetPrefix = langCode.split('-')[0].toLowerCase(); // 'vi', 'en', 'ja'
    const fullTarget = langCode.toLowerCase().replace('_', '-');

    const exactMatch = availableVoices.find((v) => {
      const code = (v.lang || '').toLowerCase().replace('_', '-');
      return code === fullTarget;
    });
    if (exactMatch) return exactMatch;

    const prefixMatch = availableVoices.find((v) => {
      const code = (v.lang || '').toLowerCase().replace('_', '-');
      return code.startsWith(`${targetPrefix}-`) || code === targetPrefix;
    });
    if (prefixMatch) return prefixMatch;

    if (targetPrefix === 'vi') {
      return availableVoices.find((v) => {
        const name = (v.name || '').toLowerCase();
        return (
          name.includes('tiếng việt') ||
          name.includes('vietnam') ||
          name.includes('vietnamese') ||
          name.includes('hoaimy') ||
          name.includes('namminh')
        );
      });
    }

    if (targetPrefix === 'ja') {
      return availableVoices.find((v) => {
        const name = (v.name || '').toLowerCase();
        return (
          name.includes('japanese') ||
          name.includes('japan') ||
          name.includes('haruka') ||
          name.includes('ayumi') ||
          name.includes('ichiro') ||
          name.includes('sayaka') ||
          name.includes('kyoko') ||
          name.includes('otoya')
        );
      });
    }

    if (targetPrefix === 'en') {
      return availableVoices.find((v) => {
        const name = (v.name || '').toLowerCase();
        return (
          name.includes('english') ||
          name.includes('david') ||
          name.includes('zira') ||
          name.includes('mark') ||
          name.includes('george') ||
          name.includes('samantha')
        );
      });
    }

    return null;
  };

  // Browser Fallback TTS
  const speakWithBrowserDefaultFallback = (text, onFinished, explicitLang) => {
    let finishedCalled = false;
    const safeFinish = () => {
      if (finishedCalled) return;
      finishedCalled = true;
      isSpeechSynthesizingRef.current = false;
      if (onFinished) onFinished();
    };

    const maxWaitMs = Math.max(3000, Math.min(25000, text.length * 85));
    const safetyTimer = setTimeout(() => {
      safeFinish();
    }, maxWaitMs);

    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const targetLang = explicitLang || examLangRef.current || 'vi-VN';
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.lang = targetLang;

        const currentVoices = window.speechSynthesis.getVoices();
        const matchedVoice = findVoiceForLang(currentVoices, targetLang);
        if (matchedVoice) {
          utterance.voice = matchedVoice;
          utterance.lang = matchedVoice.lang || targetLang;
        }

        utterance.onend = () => {
          clearTimeout(safetyTimer);
          safeFinish();
        };

        utterance.onerror = () => {
          clearTimeout(safetyTimer);
          safeFinish();
        };

        window.speechSynthesis.speak(utterance);
        return;
      } catch (err) { }
    }

    clearTimeout(safetyTimer);
    safeFinish();
  };

  // Google Translate TTS Fallback
  const speakWithGoogleTTS = (text, langCode, onFinished) => {
    const gLang = getCourseContent(activeSubject, langCode)?.googleLang || langCode.split('-')[0] || 'vi';

    const rawChunks =
      text.match(/[^.?!,;:\n。！？、；：]+[.?!,;:\n。！？、；：]+|[^.?!,;:\n。！？、；：]+/g) || [text];
    const chunks = [];
    let current = '';

    for (const part of rawChunks) {
      if ((current + ' ' + part).trim().length <= 140) {
        current = (current + ' ' + part).trim();
      } else {
        if (current) chunks.push(current);
        current = part.trim();
      }
    }
    if (current) chunks.push(current);

    let idx = 0;
    let fallbackTriggered = false;

    const triggerLayer3Fallback = () => {
      if (fallbackTriggered) return;
      fallbackTriggered = true;
      if (currentAudioRef.current) {
        try {
          currentAudioRef.current.pause();
        } catch (e) { }
        currentAudioRef.current = null;
      }
      speakWithBrowserDefaultFallback(text, onFinished);
    };

    const playNextChunk = () => {
      if (!isSpeechSynthesizingRef.current || fallbackTriggered) return;
      if (idx >= chunks.length) {
        isSpeechSynthesizingRef.current = false;
        if (onFinished) onFinished();
        return;
      }

      const chunk = chunks[idx];
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${gLang}&client=tw-ob&q=${encodeURIComponent(
        chunk
      )}`;

      try {
        const audio = new Audio(url);
        currentAudioRef.current = audio;

        audio.onended = () => {
          idx++;
          setTimeout(playNextChunk, 160);
        };

        audio.onerror = () => {
          triggerLayer3Fallback();
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            triggerLayer3Fallback();
          });
        }
      } catch (err) {
        triggerLayer3Fallback();
      }
    };

    playNextChunk();
  };

  // Main Speech Controller: Native browser speechSynthesis with vi-VN, 0 latency
  const speakText = (text, onFinished, explicitLang) => {
    stopAllSpeech();
    isSpeechSynthesizingRef.current = true;

    if (!('speechSynthesis' in window) || !text) {
      isSpeechSynthesizingRef.current = false;
      if (onFinished) onFinished();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const targetLang = explicitLang || examLangRef.current || 'vi-VN';
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.lang = targetLang;

      const voices = window.speechSynthesis.getVoices();
      const viVoice = findVoiceForLang(voices, targetLang) || findVoiceForLang(detectedVoices, targetLang);
      if (viVoice) {
        utterance.voice = viVoice;
        utterance.lang = viVoice.lang || targetLang;
      }

      let finished = false;
      const safeDone = () => {
        if (finished) return;
        finished = true;
        isSpeechSynthesizingRef.current = false;
        if (onFinished) onFinished();
      };

      utterance.onend = safeDone;
      utterance.onerror = safeDone;

      window.speechSynthesis.speak(utterance);

      const maxWaitMs = Math.max(3000, Math.min(25000, text.length * 85));
      setTimeout(() => {
        if (!finished && isSpeechSynthesizingRef.current) {
          safeDone();
        }
      }, maxWaitMs);
    } catch (e) {
      console.warn('speakText error:', e);
      isSpeechSynthesizingRef.current = false;
      if (onFinished) onFinished();
    }
  };

  const speakAIQuestion = (text, onFinished, explicitLang) => {
    speakText(text, onFinished, explicitLang || examLangRef.current);
  };

  // ================= MEDIA RECORDER (AUDIO BLOB & REVIEW) =================
  const startMediaRecording = () => {
    try {
      if (!mediaStreamRef.current) return;
      const audioTracks = mediaStreamRef.current.getAudioTracks();
      if (audioTracks.length === 0) return;

      const audioStream = new MediaStream(audioTracks);
      let mimeType = '';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        mimeType = 'audio/webm';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      }

      audioChunksRef.current = [];
      const options = mimeType ? { mimeType } : undefined;
      const recorder = new MediaRecorder(audioStream, options);

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        if (audioChunksRef.current.length > 0) {
          const type = mimeType || 'audio/webm';
          const blob = new Blob(audioChunksRef.current, { type });
          const url = URL.createObjectURL(blob);
          setRecordedAudioUrl(url);
        }
      };

      recorder.start(250);
      mediaRecorderRef.current = recorder;
    } catch (err) {
      console.warn('Lỗi MediaRecorder:', err);
    }
  };

  const stopMediaRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) { }
    }
  };

  // ================= SPEECH-TO-TEXT (STT) ENGINE =================
  const startSpeechRecognition = (overrideLang) => {
    isManuallyStoppedRef.current = false;
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      console.warn('Trình duyệt không hỗ trợ Web SpeechRecognition');
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) { }
      }

      const activeLang = overrideLang || examLangRef.current || 'vi-VN';
      const recognition = new SpeechRecognitionClass();
      recognition.lang = activeLang;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let currentFinal = '';

        for (let i = 0; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            currentFinal += res[0].transcript + ' ';
          } else {
            interimTranscript += res[0].transcript;
          }
        }

        const rawCombined = (currentFinal + interimTranscript).trim();
        const combined = sanitizeITTranscript(rawCombined);
        if (combined) {
          setLiveTranscript(combined);
          liveTranscriptRef.current = combined;
          finalAccumulatedTranscriptRef.current = combined;
        }
      };

      recognition.onerror = (event) => {
        // Ignorable non-fatal errors
        if (event.error !== 'no-speech') {
          console.warn('SpeechRecognition error:', event.error);
        }
      };

      recognition.onend = () => {
        if (!isManuallyStoppedRef.current && fsmStateRef.current === STATES.STUDENT_ANSWERING) {
          try {
            recognition.start();
          } catch (e) { }
        }
      };

      try {
        recognition.start();
      } catch (startErr) { }
      recognitionRef.current = recognition;
    } catch (err) {
      console.error('Lỗi khi bắt đầu nhận diện giọng nói:', err);
    }
  };

  const stopSpeechRecognition = () => {
    isManuallyStoppedRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) { }
      recognitionRef.current = null;
    }
  };


  // Dynamic Language Switching Handler
  const handleLanguageChange = (newLang) => {
    if (newLang === examLang) return;

    stopAllSpeech();
    stopSpeechRecognition();
    stopMediaRecording();

    setExamLang(newLang);
    examLangRef.current = newLang;
    try {
      localStorage.setItem('aives_exam_lang', newLang);
    } catch (e) { }

    // Sync URL parameter
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        const shortCode = newLang === 'vi-VN' ? 'vi' : newLang === 'en-US' ? 'en' : 'ja';
        next.set('lang', shortCode);
        return next;
      },
      { replace: true }
    );

    const langContent = getCourseContent(activeSubject, newLang);

    if (speechTurn === 1) {
      setCurrentQuestion({
        title: langContent.initialQuestion.title,
        bloom: langContent.initialQuestion.bloom
      });

      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

      setDialogue([
        {
          sender: 'ai',
          time: timeStr,
          text: langContent.greeting
        },
        {
          sender: 'ai',
          time: timeStr,
          text: langContent.initialQuestion.title,
          isMainQuestion: true
        }
      ]);

      if (fsmState === STATES.AI_SPEAKING) {
        speakAIQuestion(
          langContent.initialQuestion.title,
          () => {
            setFsmState(STATES.READY_TO_ANSWER);
          },
          newLang
        );
      }
    } else {
      const followUps = langContent.adaptiveFollowUps;
      const fallbacks = langContent.fallbackFollowUps;
      const targetFollow = followUps[(speechTurn - 2) % followUps.length] || fallbacks[0];

      setCurrentQuestion({
        title: targetFollow.question,
        bloom: targetFollow.bloom
      });

      if (fsmState === STATES.AI_SPEAKING) {
        speakAIQuestion(
          targetFollow.question,
          () => {
            setFsmState(STATES.READY_TO_ANSWER);
          },
          newLang
        );
      }
    }

    if (fsmState === STATES.STUDENT_ANSWERING) {
      startSpeechRecognition(newLang);
      startMediaRecording();
    }
  };

  // Trigger AI Speaking on initial mount or when question changes
  useEffect(() => {
    if (fsmState === STATES.AI_SPEAKING) {
      speakAIQuestion(currentQuestion.title, () => {
        setFsmState(STATES.READY_TO_ANSWER);
      });
    }
  }, [currentQuestion]);

  // Step 1: Candidate clicks "Bắt đầu trả lời (Bật Micro)" -> Transitions to STUDENT_ANSWERING
  const handleStartAnswering = async () => {
    isProcessingTurnRef.current = false;
    stopAllSpeech();
    setFsmState(STATES.STUDENT_ANSWERING);
    setTurnSeconds(questionTimeLimit);
    finalAccumulatedTranscriptRef.current = '';
    setLiveTranscript('');
    liveTranscriptRef.current = '';

    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
      setRecordedAudioUrl(null);
    }
    audioChunksRef.current = [];

    if (!mediaStreamRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
      } catch (err) {
        console.warn('Microphone permission check:', err);
      }
    }

    setTimeout(() => {
      startSpeechRecognition(examLangRef.current);
      startMediaRecording();
    }, 50);
  };

  // Step 2: Candidate stops answering -> Enters STUDENT_REVIEWING
  const handleStopAndReview = () => {
    stopSpeechRecognition();
    stopMediaRecording();
    setFsmState(STATES.STUDENT_REVIEWING);
  };

  // Step 3: Candidate wants to re-record answer from scratch -> Returns to READY_TO_ANSWER
  const handleRecordAgain = () => {
    stopSpeechRecognition();
    stopMediaRecording();

    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
      setRecordedAudioUrl(null);
    }

    finalAccumulatedTranscriptRef.current = '';
    setLiveTranscript('');
    liveTranscriptRef.current = '';
    audioChunksRef.current = [];
    setTurnSeconds(questionTimeLimit);
    setFsmState(STATES.READY_TO_ANSWER);
  };


  // Adaptive Follow-up Question Generator (Contextual to student answer & main question)
  const generateAdaptiveFollowUp = (finalAnswer, mainQuestion) => {
    setIsFollowUpPhase(true);
    finalAccumulatedTranscriptRef.current = '';
    setLiveTranscript('');
    liveTranscriptRef.current = '';
    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
      setRecordedAudioUrl(null);
    }
    audioChunksRef.current = [];
    setTurnSeconds(questionTimeLimit);

    const lower = (finalAnswer || '').toLowerCase();
    let followUpQ = '';

    if (lower.includes('saga') || lower.includes('microservice') || lower.includes('phân tán')) {
      followUpQ = 'Bạn vừa đề cập đến Saga Pattern và kiến trúc phân tán. Hãy phân tích trường hợp một dịch vụ trong chuỗi giao dịch bị lỗi mạng hoặc crash, bạn thiết kế cơ chế Bù trừ (Compensating Transaction) như thế nào để dữ liệu không bị sai lệch?';
    } else if (lower.includes('cache') || lower.includes('redis') || lower.includes('tối ưu')) {
      followUpQ = 'Về giải pháp lưu cache bạn vừa trình bày, làm sao để xử lý bài toán Cache Invalidation (đồng bộ dữ liệu giữa Cache và Database) khi có nhiều request ghi dữ liệu đồng thời?';
    } else if (lower.includes('kafka') || lower.includes('message') || lower.includes('event')) {
      followUpQ = 'Trong mô hình Event-driven bạn vừa nhắc tới, bạn giải quyết vấn đề đảm bảo thứ tự của tin nhắn (Message Ordering) và cơ chế tránh xử lý lặp lại (Idempotency) ra sao?';
    } else if (lower.includes('sql') || lower.includes('index') || lower.includes('database')) {
      followUpQ = 'Khi bảng dữ liệu tăng trưởng lên hàng triệu bản ghi, việc bạn đánh Index có mang lại nhược điểm gì cho các thao tác INSERT/UPDATE không? Bạn cân đối như thế nào?';
    } else {
      const mainTitle = mainQuestion?.content || mainQuestion?.title || 'nội dung này';
      const words = finalAnswer.split(/\s+/).slice(0, 7).join(' ');
      followUpQ = `Bạn vừa phân tích: "${words}...". Trong thực tế triển khai ${mainTitle.slice(0, 45)}, rủi ro kỹ thuật lớn nhất mà hệ thống có thể gặp phải là gì và phương án dự phòng (fallback) của bạn ra sao?`;
    }

    setFollowUpQuestionText(followUpQ);
    setCurrentQuestion({
      title: followUpQ,
      bloom: 'Bloom 5 - Phản biện logic'
    });

    setFsmState(STATES.AI_SPEAKING);
    speakAIQuestion(followUpQ, () => {
      setFsmState(STATES.READY_TO_ANSWER);
    });
  };

  // Step 3: Final confirmation -> Submit Answer to AI Board
  const handleSubmitAnswer = () => {
    if (isProcessingTurnRef.current) return;
    isProcessingTurnRef.current = true;

    stopAllSpeech();
    stopSpeechRecognition();
    stopMediaRecording();

    setFsmState(STATES.AI_THINKING);

    const rawTranscript = liveTranscript.trim();
    const hasSpoken = rawTranscript.length >= 3;
    const finalAnswer = hasSpoken ? rawTranscript : '(Thí sinh không trả lời)';
    const isUnanswered = !hasSpoken || finalAnswer.includes('không trả lời');

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    // Active main question object
    const activeMainQ = examQuestions[currentQuestionIndexRef.current] || examQuestions[0] || {};
    const questionTextForTurn = isFollowUpPhaseRef.current
      ? followUpQuestionText
      : (activeMainQ.content || activeMainQ.title || 'Câu hỏi chuyên môn');

    const turnScore = isUnanswered ? 0.0 : Number((7.0 + Math.random() * 2.5).toFixed(1));
    const aiTurnEval = isUnanswered
      ? 'Thí sinh không trả lời hoặc không ghi nhận âm thanh câu trả lời cho câu hỏi này. Điểm đề xuất: 0.0.'
      : `Đánh giá AI: Thí sinh trình bày đúng trọng tâm chuyên môn (${questionTextForTurn.slice(0, 40)}...), lập luận mạch lạc và có kiến thức kỹ thuật tốt.`;

    const turnRecord = {
      turnOrder: allQuestionTurnsRef.current.length + 1,
      questionIndex: currentQuestionIndexRef.current,
      isFollowUp: isFollowUpPhaseRef.current,
      questionContent: questionTextForTurn,
      studentAnswer: finalAnswer,
      audioTranscript: finalAnswer,
      score: turnScore,
      bloomLevel: isFollowUpPhaseRef.current ? 'Bloom 5 - Phản biện logic' : (activeMainQ.bloomLevel || 'Bloom 3 - Vận dụng'),
      aiEvaluation: aiTurnEval,
      turnDurationSeconds: Math.max(5, questionTimeLimit - turnSeconds),
      timestamp: timeStr
    };

    allQuestionTurnsRef.current.push(turnRecord);
    setAllQuestionTurns([...allQuestionTurnsRef.current]);

    // Send to Backend
    const targetSessionId = sessionUuidRef.current || sessionUuid;
    studentExamApi.submitTurn(targetSessionId, {
      questionUuid: activeMainQ.uuid || activeMainQ.id,
      turnOrder: turnRecord.turnOrder,
      studentAnswer: finalAnswer,
      audioTranscript: finalAnswer,
      turnDurationSeconds: turnRecord.turnDurationSeconds
    }).catch((e) => console.warn('Submit turn backend sync warning:', e));

    // Save turns to localStorage for Lecturer Grading page
    try {
      localStorage.setItem(`aives_session_turns_${targetSessionId}`, JSON.stringify(allQuestionTurnsRef.current));
      const allExamsRaw = localStorage.getItem('aives_exam_sessions');
      if (allExamsRaw) {
        const exams = JSON.parse(allExamsRaw);
        const idx = exams.findIndex((e) => e.id === targetSessionId || e.sessionCode === targetSessionId);
        if (idx !== -1) {
          exams[idx].turns = allQuestionTurnsRef.current;
          localStorage.setItem('aives_exam_sessions', JSON.stringify(exams));
        }
      }
    } catch (e) {}

    // PHASE LOGIC:
    // Case 1: Just finished Main Question AND maxFollowUps > 0 AND candidate answered -> Ask Adaptive Follow-Up
    if (!isFollowUpPhaseRef.current && maxFollowUps > 0 && !isUnanswered) {
      setTimeout(() => {
        isProcessingTurnRef.current = false;
        generateAdaptiveFollowUp(finalAnswer, activeMainQ);
      }, 1000);
      return;
    }

    // Case 2: Finished Follow-up OR no follow-ups configured -> Move to NEXT Main Question OR Finish Exam
    setTimeout(() => {
      isProcessingTurnRef.current = false;
      const nextIdx = currentQuestionIndexRef.current + 1;
      if (nextIdx < examQuestions.length) {
        // CLEAN REFRESH VIEW FOR NEXT MAIN QUESTION!
        setCurrentQuestionIndex(nextIdx);
        currentQuestionIndexRef.current = nextIdx;
        setIsFollowUpPhase(false);
        isFollowUpPhaseRef.current = false;
        setFollowUpQuestionText('');
        finalAccumulatedTranscriptRef.current = '';
        setLiveTranscript('');
        liveTranscriptRef.current = '';

        if (recordedAudioUrl) {
          URL.revokeObjectURL(recordedAudioUrl);
          setRecordedAudioUrl(null);
        }
        audioChunksRef.current = [];
        setTurnSeconds(questionTimeLimit);

        const nextMainQ = examQuestions[nextIdx];
        const nextQTitle = nextMainQ.content || nextMainQ.title;
        setCurrentQuestion({
          title: nextQTitle,
          bloom: nextMainQ.bloomLevel || 'Bloom 3 - Vận dụng'
        });

        setFsmState(STATES.AI_SPEAKING);
        speakAIQuestion(nextQTitle, () => {
          setFsmState(STATES.READY_TO_ANSWER);
        });
      } else {
        // ALL QUESTIONS FINISHED!
        finishExamSession(allQuestionTurnsRef.current);
      }
    }, 1000);
  };

  // Finish exam and navigate to /student
  const finishExamSession = (turns) => {
    isProcessingTurnRef.current = false;
    setFsmState(STATES.FINISHED);

    const validTurns = turns && turns.length > 0 ? turns : allQuestionTurnsRef.current;
    const answeredTurns = validTurns.filter(
      (t) => t.studentAnswer && !t.studentAnswer.includes('không trả lời') && t.studentAnswer.length >= 3
    );
    const isCompletelyUnanswered = answeredTurns.length === 0;

    let overallScore = 0.0;
    if (!isCompletelyUnanswered) {
      const sum = validTurns.reduce((acc, t) => acc + (Number(t.score) || 0), 0);
      overallScore = Number((sum / validTurns.length).toFixed(1));
    }

    const targetSessionId = sessionUuidRef.current || sessionUuid;

    let activeStudentName = 'Nguyễn Văn An';
    let activeStudentCode = 'SE190504';
    try {
      const rawUser = sessionStorage.getItem('aives_user') || localStorage.getItem('aives_user');
      if (rawUser) {
        const parsedUser = JSON.parse(rawUser);
        if (parsedUser.name || parsedUser.fullName) activeStudentName = parsedUser.name || parsedUser.fullName;
        if (parsedUser.userCode || parsedUser.idNumber || parsedUser.id) {
          const codeCandidate = String(parsedUser.userCode || parsedUser.idNumber || parsedUser.id);
          if (codeCandidate.length <= 20) activeStudentCode = codeCandidate;
        }
      }
    } catch {}

    const overallFeedback = isCompletelyUnanswered
      ? 'Thí sinh không trả lời hoặc không ghi nhận âm thanh câu trả lời cho các câu hỏi trong ca thi. Điểm đề xuất: 0.0.'
      : `AI Examiner ghi nhận thí sinh hoàn thành ${validTurns.length} lượt thi. Nắm vững kiến thức trọng tâm môn ${activeSubject}, lập luận chuyên môn mạch lạc.`;

    const latestResult = {
      sessionId: targetSessionId,
      examCode: currentSession?.examId || `${activeSubject}-VIVA-${Date.now().toString().slice(-4)}`,
      courseName: activeCourseName,
      subjectCode: activeSubject,
      studentName: activeStudentName,
      studentId: activeStudentCode,
      examLang: examLangRef.current,
      completedAt: new Date().toISOString(),
      turnsCompleted: validTurns.length,
      overallScore: isCompletelyUnanswered ? 0.0 : overallScore,
      turnScores: validTurns.map((t) => ({
        turnOrder: t.turnOrder,
        score: t.score,
        bloomLevel: t.bloomLevel,
        questionContent: t.questionContent,
        studentAnswer: t.studentAnswer
      })),
      status: 'WAITING_SCORE_CONFIRMATION',
      turns: validTurns,
      aiFeedback: overallFeedback
    };

    // Update in aives_exam_sessions so lecturer GradingApproval page sees it immediately!
    try {
      const allExamsRaw = localStorage.getItem('aives_exam_sessions');
      if (allExamsRaw) {
        const exams = JSON.parse(allExamsRaw);
        const idx = exams.findIndex((e) => e.id === targetSessionId || e.sessionCode === targetSessionId);
        if (idx !== -1) {
          exams[idx].status = 'WAITING_SCORE_CONFIRMATION';
          exams[idx].totalScore = isCompletelyUnanswered ? 0.0 : overallScore;
          exams[idx].feedback = overallFeedback;
          exams[idx].turns = validTurns;
          exams[idx].endedAt = new Date().toISOString();
          localStorage.setItem('aives_exam_sessions', JSON.stringify(exams));
        }
      }
      localStorage.setItem('latest_viva_result', JSON.stringify(latestResult));
      localStorage.setItem(`aives_session_turns_${targetSessionId}`, JSON.stringify(validTurns));
    } catch (e) {}

    // Call backend finish
    studentExamApi.finishExam(targetSessionId).catch((err) => console.warn('finishExam sync:', err));

    const closingText = isCompletelyUnanswered
      ? 'Ca thi vấn đáp đã kết thúc. Hệ thống đã nộp bài và chuyển dữ liệu tới Giảng viên duyệt điểm.'
      : 'Chúc mừng thí sinh đã hoàn thành ca thi vấn đáp. Bài thi đã được ghi nhận và gửi tới Giảng viên duyệt điểm.';

    let navigated = false;
    const goToResult = () => {
      if (navigated) return;
      navigated = true;
      navigate(`/student?submitted=true&sessionId=${targetSessionId}`);
    };

    speakAIQuestion(closingText, goToResult);
    setTimeout(goToResult, 3000);
  };

  const handleManualExit = () => {
    const confirmMsg =
      'CẢNH BÁO: Rời phòng thi giữa chừng sẽ TỰ ĐỘNG NỘP BÀI ngay lập tức với các câu đã trả lời. Mỗi thí sinh chỉ được thi 1 lần duy nhất và KHÔNG THỂ vào thi lại ca này!\n\nBạn có chắc chắn muốn nộp bài và rời phòng thi không?';

    if (window.confirm(confirmMsg)) {
      finishExamSession();
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentLangPack = getCourseContent(activeSubject, examLang);

  return (
    <div className="space-y-4 max-w-[1550px] mx-auto pb-8 animate-fade-in text-slate-800">
      {/* ================= TOP NAVIGATION BAR ================= */}
      <div className="p-3.5 px-5 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand & Course */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center text-white shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 tracking-tight">ExamRoom Intelligence</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-700">AI VIVA</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Môn: {activeCourseName}</p>
          </div>
        </div>

        {/* Middle Status Indicators */}
        <div className="flex items-center gap-3 md:gap-4 text-xs flex-wrap">

          {/* Main Exam Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-50 border border-sky-200/80 text-sky-800 font-mono font-bold">
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            <span>{formatTime(timerSeconds)} còn lại</span>
          </div>

          {/* Turn Countdown Timer */}
          {fsmState === STATES.STUDENT_ANSWERING && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-mono font-bold animate-pulse">
              <Mic className="w-3.5 h-3.5 text-rose-600" />
              <span>Thời gian nói: {turnSeconds}s</span>
            </div>
          )}

          {/* Turn / Question Counter */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-medium">
            <span>
              Câu hỏi: {currentQuestionIndex + 1} / {examQuestions.length}
            </span>
            <div className="flex items-center gap-1">
              {examQuestions.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx < currentQuestionIndex
                      ? 'bg-emerald-500'
                      : idx === currentQuestionIndex
                      ? 'bg-sky-600 ring-2 ring-sky-200'
                      : 'bg-slate-300'
                  }`}
                ></span>
              ))}
            </div>
          </div>

          {/* Live Connection Indicator */}
          <div
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
              isWsConnected
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isWsConnected ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
            <span>{isWsConnected ? 'Trực tuyến' : 'Ngoại tuyến'}</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleManualExit}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Kết thúc ca thi</span>
          </button>
        </div>
      </div>

      {/* ================= MAIN 2-COLUMN EXAM LAYOUT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* ================= LEFT COLUMN: AI EXAMINER ORB & QUESTION (7 COLS) ================= */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {/* Question Card */}
          <div className="p-5 md:p-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                  CÂU HỎI {currentQuestionIndex + 1} / {examQuestions.length}
                </span>
                {isFollowUpPhase && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                    Hỏi xoáy phản biện
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
                Vấn đáp trực tiếp
              </span>
            </div>

            <h2 className="text-base md:text-lg font-bold text-slate-900 leading-snug">
              {currentQuestion.title}
            </h2>
          </div>

          {/* Glowing AI Examiner Avatar Orb Stage */}
          <div className="relative min-h-[380px] rounded-3xl bg-gradient-to-b from-sky-50/40 via-white/80 to-sky-50/30 border border-sky-100 shadow-xs flex flex-col items-center justify-center p-8 overflow-hidden">
            {/* Ambient Background Glow Circles */}
            <div
              className={`absolute w-80 h-80 rounded-full blur-3xl pointer-events-none -z-10 transition-all duration-700 ${fsmState === STATES.AI_SPEAKING
                ? 'bg-cyan-300/40 scale-125 animate-pulse'
                : fsmState === STATES.AI_THINKING
                  ? 'bg-indigo-300/40 scale-110 animate-spin'
                  : 'bg-sky-200/30'
                }`}
            ></div>

            {/* Concentric Pulsing Ripples */}
            <div className="relative flex items-center justify-center">
              <div
                className={`absolute w-64 h-64 rounded-full border border-sky-300/40 transition-all duration-500 ${fsmState === STATES.AI_SPEAKING ? 'animate-ping opacity-40' : 'opacity-20'
                  }`}
              ></div>

              <div
                className={`absolute w-52 h-52 rounded-full border border-cyan-400/50 transition-all duration-500 ${fsmState === STATES.AI_SPEAKING ? 'scale-110 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : ''
                  }`}
              ></div>

              <div className="absolute w-40 h-40 rounded-full border-2 border-sky-400/60 shadow-[0_0_24px_rgba(2,132,199,0.25)]"></div>

              {/* Central Glowing AI Orb */}
              <div
                className={`w-28 h-28 rounded-full p-1 flex items-center justify-center transition-all duration-500 ${fsmState === STATES.AI_SPEAKING
                  ? 'bg-gradient-to-tr from-sky-500 via-cyan-400 to-blue-500 shadow-[0_0_45px_rgba(6,182,212,0.8)] scale-105'
                  : fsmState === STATES.AI_THINKING
                    ? 'bg-gradient-to-tr from-indigo-500 via-purple-400 to-sky-400 shadow-[0_0_40px_rgba(99,102,241,0.7)] animate-pulse'
                    : 'bg-gradient-to-tr from-sky-400 via-slate-300 to-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)]'
                  }`}
              >
                <div className="w-full h-full rounded-full bg-white/95 backdrop-blur-md flex flex-col items-center justify-center space-y-1 shadow-inner">
                  {fsmState === STATES.AI_THINKING ? (
                    <Cpu className="w-8 h-8 text-indigo-600 animate-spin" />
                  ) : (
                    <Bot
                      className={`w-8 h-8 text-sky-600 ${fsmState === STATES.AI_SPEAKING ? 'animate-bounce' : ''
                        }`}
                    />
                  )}
                  <div className="flex items-center gap-0.5">
                    <span
                      className={`w-1 rounded-full bg-cyan-500 ${fsmState === STATES.AI_SPEAKING
                        ? 'h-4 animate-pulse'
                        : fsmState === STATES.STUDENT_ANSWERING
                          ? 'h-2'
                          : 'h-1'
                        }`}
                    ></span>
                    <span
                      className={`w-1 rounded-full bg-sky-500 ${fsmState === STATES.AI_SPEAKING
                        ? 'h-6 animate-pulse delay-75'
                        : fsmState === STATES.STUDENT_ANSWERING
                          ? 'h-3'
                          : 'h-2'
                        }`}
                    ></span>
                    <span
                      className={`w-1 rounded-full bg-blue-500 ${fsmState === STATES.AI_SPEAKING
                        ? 'h-3 animate-pulse delay-150'
                        : fsmState === STATES.STUDENT_ANSWERING
                          ? 'h-2'
                          : 'h-1'
                        }`}
                    ></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current State Status Badge */}
            <div className="mt-8 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-sky-200 shadow-xs text-xs font-semibold">
              {fsmState === STATES.AI_SPEAKING && (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-sky-600 animate-bounce" />
                  <span className="text-sky-800">Giám khảo đang đọc câu hỏi...</span>
                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping"></span>
                </>
              )}
              {fsmState === STATES.STUDENT_ANSWERING && (
                <>
                  <Mic className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                  <span className="text-rose-800">Đang ghi âm câu trả lời...</span>
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                </>
              )}
              {fsmState === STATES.STUDENT_REVIEWING && (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-amber-800">
                    Đang xem lại câu trả lời (Có thể nghe lại & chỉnh sửa văn bản)
                  </span>
                </>
              )}
              {fsmState === STATES.AI_THINKING && (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                  <span className="text-indigo-800 font-bold animate-pulse">
                    Đã nộp câu trả lời! AI Examiner đang chấm điểm & chuẩn bị câu tiếp theo...
                  </span>
                </>
              )}
              {fsmState === STATES.FINISHED && (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-800">Ca thi hoàn thành</span>
                </>
              )}
            </div>


            {/* Meta text */}
            <p className="mt-3 text-[11px] text-slate-500 text-center max-w-md">
              Hệ thống AI Speech-To-Text & Ghi âm kiểm tra • Hỗ trợ Tiếng Việt, English & 日本語 • Rubric ABET: Tính chính xác (40%), Phản biện logic (30%), Diễn đạt (30%)
            </p>

          </div>

          {/* ================= UNIFIED TOOLBAR: CONTROLS & REVIEW ================= */}
          <div className="p-3 md:px-5 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
            {/* Left Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              {fsmState === STATES.AI_SPEAKING && (
                <button
                  type="button"
                  onClick={() => {
                    stopAllSpeech();
                    setFsmState(STATES.READY_TO_ANSWER);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <FastForward className="w-3.5 h-3.5" />
                  <span>Bỏ qua đọc đề</span>
                </button>
              )}

              {/* Repeat Question Button */}
              <button
                type="button"
                onClick={() => speakAIQuestion(currentQuestion.title)}
                disabled={fsmState === STATES.AI_THINKING || fsmState === STATES.STUDENT_ANSWERING}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
                title="Nghe lại đề bài bằng giọng đọc AI"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Nhắc lại đề</span>
              </button>

              {/* Bookmark Question */}
              <button
                type="button"
                onClick={() => setIsMarked(!isMarked)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${isMarked
                  ? 'bg-amber-50 border-amber-300 text-amber-700 font-semibold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isMarked ? 'Đã đánh dấu' : 'Đánh dấu'}</span>
              </button>
            </div>


            {/* Right Action Buttons: Recording vs Review */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Ready to Answer -> Candidate explicitly clicks to start mic */}
              {fsmState === STATES.READY_TO_ANSWER && (
                <button
                  type="button"
                  onClick={handleStartAnswering}
                  className="px-6 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 bg-gradient-to-r from-sky-600 via-indigo-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white shadow-md shadow-sky-500/25 transition-all cursor-pointer hover:scale-[1.02] animate-pulse"
                >
                  <Mic className="w-4 h-4 text-white" />
                  <span>Bắt đầu trả lời (Bật Micro)</span>
                </button>
              )}

              {/* Step 1: Answering -> Candidate explicitly clicks to finish recording */}
              {fsmState === STATES.STUDENT_ANSWERING && (
                <button
                  type="button"
                  onClick={handleStopAndReview}
                  className="px-5 py-2.5 text-xs font-bold rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 flex items-center gap-2 transition-colors cursor-pointer shadow-xs animate-pulse"
                >
                  <Square className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                  <span>Kết thúc trả lời (Dừng thu âm & Xem lại)</span>
                </button>
              )}

              {/* Step 2: Reviewing -> Record Again or Submit Answer */}
              {fsmState === STATES.STUDENT_REVIEWING && (
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleRecordAgain}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    title="Xóa âm thanh cũ và chuẩn bị thu lại"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                    <span>Thu âm lại</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmitAnswer}
                    disabled={isProcessingTurnRef.current}
                    className="px-6 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-500/25 transition-all cursor-pointer hover:scale-[1.02]"
                    title="Nộp câu trả lời cho câu hỏi này"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Xác nhận & Nộp câu trả lời</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ================= RIGHT COLUMN: EXAM PROGRESS & CURRENT TRANSCRIPT (5 COLS) ================= */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* 1. Exam Question Stepper & Progress Tracker */}
          <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-sky-600" />
                Tiến độ đề thi ({currentQuestionIndex + 1}/{examQuestions.length} câu)
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isFollowUpPhase ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-sky-100 text-sky-800 border border-sky-200'
              }`}>
                {isFollowUpPhase ? 'Hỏi xoáy phản biện' : 'Câu hỏi chính'}
              </span>
            </div>

            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {examQuestions.map((q, qIdx) => {
                const isDone = qIdx < currentQuestionIndex;
                const isCurrent = qIdx === currentQuestionIndex;
                return (
                  <div
                    key={q.uuid || qIdx}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                      isCurrent
                        ? 'bg-sky-50/80 border-sky-300 ring-2 ring-sky-200/80 shadow-2xs'
                        : isDone
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                        : 'bg-slate-50 border-slate-200 text-slate-400 opacity-70'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-sky-600 text-white animate-pulse'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isDone ? '✓' : qIdx + 1}
                      </span>
                      <span className="truncate font-semibold text-slate-800">
                        Câu {qIdx + 1}: {q.content || q.title}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                        isDone
                          ? 'bg-emerald-100 text-emerald-800'
                          : isCurrent
                          ? 'bg-sky-100 text-sky-800 animate-pulse'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isDone ? 'Đã nộp' : isCurrent ? (isFollowUpPhase ? 'Hỏi xoáy' : 'Đang thi') : 'Chờ thi'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Real-time Transcript & Audio Review Card for CURRENT Question */}
          <div className="flex-1 p-5 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 min-h-[380px]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${fsmState === STATES.STUDENT_ANSWERING ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Real-time Transcript & Audio Review
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                Tiếng Việt (vi-VN)
              </span>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto space-y-3">
              {/* If AI Speaking */}
              {fsmState === STATES.AI_SPEAKING && (
                <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-200 text-xs text-sky-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <Volume2 className="w-4 h-4 text-sky-600 animate-bounce" />
                    <span>Hội đồng AI đang đọc câu hỏi...</span>
                  </div>
                  <p className="italic text-slate-600">
                    Vui lòng lắng nghe kỹ đề bài. Bạn sẽ có {questionTimeLimit} giây để trả lời sau khi bấm bắt đầu.
                  </p>
                </div>
              )}

              {/* If Ready to Answer */}
              {fsmState === STATES.READY_TO_ANSWER && (
                <div className="p-4 rounded-xl bg-sky-50/80 border border-sky-200 text-xs text-sky-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sky-800">
                    <Mic className="w-4 h-4 text-sky-600" />
                    <span>Hội đồng AI đã đọc xong. Micro đang tắt.</span>
                  </div>
                  <p className="text-slate-600">
                    Khi bạn đã sẵn sàng trình bày câu trả lời, hãy bấm nút <strong>"Bắt đầu trả lời (Bật Micro)"</strong> bên dưới để bắt đầu thu âm và tính giờ.
                  </p>
                </div>
              )}

              {/* If Student Answering (Live STT) */}
              {fsmState === STATES.STUDENT_ANSWERING && (
                <div className="p-4 rounded-xl bg-white border border-rose-300 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-rose-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                      Đang nhận diện giọng nói ({examLang})
                    </span>
                    <span className="text-slate-400 italic">Nói vào mic để hệ thống chép lời...</span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed font-sans min-h-[60px] bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                    {liveTranscript || (
                      <span className="text-slate-400 italic">{currentLangPack.placeholder}</span>
                    )}
                    <span className="inline-block w-1.5 h-3.5 bg-rose-600 ml-1 animate-pulse align-middle"></span>
                  </p>
                  <p className="text-[10px] text-slate-400">
                    * Bạn có thể bấm "Dừng nói & Xem lại" để nghe lại file âm thanh và sửa lỗi chính tả trước khi nộp.
                  </p>
                </div>
              )}

              {/* If Reviewing (Audio + Editable Transcript) */}
              {fsmState === STATES.STUDENT_REVIEWING && (
                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                      Kiểm tra & Nghe lại câu trả lời
                    </span>
                    <span className="text-[10px] text-amber-700 font-medium">Có thể sửa văn bản bên dưới</span>
                  </div>

                  {/* Audio Player for candidate's voice */}
                  <div className="p-2 rounded-xl bg-white border border-amber-200/80 flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-amber-600 shrink-0" />
                    {recordedAudioUrl ? (
                      <audio controls src={recordedAudioUrl} className="w-full h-7" />
                    ) : (
                      <span className="text-xs text-slate-400 italic">Đang xử lý file âm thanh...</span>
                    )}
                  </div>

                  {/* Editable Transcript Textarea */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Nội dung văn bản nhận diện (STT):
                    </label>
                    <textarea
                      rows={3}
                      value={liveTranscript}
                      onChange={(e) => {
                        setLiveTranscript(e.target.value);
                        liveTranscriptRef.current = e.target.value;
                        finalAccumulatedTranscriptRef.current = e.target.value;
                      }}
                      placeholder="Nếu nhận diện bị thiếu hoặc sai từ khóa kỹ thuật, bạn có thể chỉnh sửa trực tiếp ở đây..."
                      className="w-full p-2.5 text-xs text-slate-800 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 leading-relaxed resize-none"
                    />
                  </div>
                </div>
              )}

              {/* If AI Thinking */}
              {fsmState === STATES.AI_THINKING && (
                <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 text-xs text-indigo-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
                    <span>AI Examiner đang phân tích câu trả lời...</span>
                  </div>
                  <p className="italic text-slate-600">
                    Đối chiếu với rubric chuẩn ABET, kiểm tra thuật ngữ và chuẩn bị câu tiếp theo...
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Mic Meter & Exit */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="font-medium flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5 text-sky-600" />
                    Âm lượng mic
                  </span>
                  <span className="font-mono font-bold text-sky-700">
                    {fsmState === STATES.STUDENT_ANSWERING ? `${micLevel}%` : 'Muted'}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-150 ${
                      micLevel > 60 ? 'bg-rose-500' : micLevel > 25 ? 'bg-emerald-500' : 'bg-sky-500'
                    }`}
                    style={{ width: `${fsmState === STATES.STUDENT_ANSWERING ? micLevel : 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-[10px] font-semibold text-slate-600">
                <Radio className="w-3 h-3 text-sky-600 animate-pulse" />
                <span>Mic LIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
