// Finite State Machine States
export const STATES = {
  AI_SPEAKING: 'AI_SPEAKING',
  STUDENT_ANSWERING: 'STUDENT_ANSWERING',
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
  }
};

// Multilingual Question Bank & Speech Content by Course Subject
export const COURSE_MULTILANG_CONTENT = {
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
export const getCourseContent = (subjectCode = 'CS301', langCode = 'vi-VN') => {
  const normSubject = (subjectCode || 'CS301').toUpperCase();
  const subjectBank = COURSE_MULTILANG_CONTENT[normSubject] || COURSE_MULTILANG_CONTENT['CS301'];
  return subjectBank[langCode] || subjectBank['vi-VN'] || COURSE_MULTILANG_CONTENT['CS301']['vi-VN'];
};

// Legacy fallback alias
export const MULTILANG_CONTENT = COURSE_MULTILANG_CONTENT['CS301'];
