// ============================================================================
// 班主任模拟器 - 完整游戏逻辑
// ============================================================================

// ============================================================================
// 常量配置
// ============================================================================

// 时间配置
const SEMESTER_LENGTH = 10;  // 每学期10周
const WEEKS_PER_MONTH = 4;
const TOTAL_SEMESTERS = 6;  // 共6学期，总时长60周

// 精力配置
const TEACHER_ENERGY_DEFAULT = 100;
const TEACHER_ENERGY_WARNING = 20;
const TEACHER_ENERGY_RECOVER_WEEKLY = 0;
const STUDENT_ENERGY_DEFAULT = 70;
const STUDENT_ENERGY_MAX = 100;
const STUDENT_ENERGY_MIN = 0;
const STUDENT_ENERGY_RECOVER_NORMAL = 3.0;
const STUDENT_ENERGY_RECOVER_LEAVE = 8.0;
const STUDENT_ENERGY_EXAM_COST = 20;
const STUDENT_ENERGY_ACTIVITY_COST = 1;
const STUDENT_ENERGY_TREAT_SINGLE = 30;
const STUDENT_ENERGY_TREAT_CLASS = 5;

// 积极性配置
const STUDENT_ENTHUSIASM_MAX = 100;
const STUDENT_ENTHUSIASM_MIN = 15;
const STUDENT_ENTHUSIASM_DECAY_BASE = 0.60;
const STUDENT_ENTHUSIASM_DECAY_LEAVE = 2.0;
const STUDENT_ENTHUSIASM_COUNSEL_GAIN = 5;
const STUDENT_ENTHUSIASM_ACTIVITY_GAIN = 3;
const STUDENT_ENTHUSIASM_ACTIVITY_LOSS = 1;

// 成绩计算权重
const SCORE_WEIGHT_CAPACITY = 0.60;
const SCORE_WEIGHT_ENTHUSIASM = 0.25;
const SCORE_WEIGHT_IQ = 0.10;
const SCORE_WEIGHT_ENERGY = 0.05;
const SCORE_FLUCTUATION_STD = 0.02;

// 成绩影响积极性
const SCORE_DIFF_THRESHOLD = 200;
const SCORE_IMPROVEMENT_FACTOR = 0.8;
const SCORE_DECLINE_FACTOR = 1.2;
const SCORE_CHANGE_DECAY = 0.8;

// 班主任配置
const TEACHER_HEALTH_MAX = 10;
const TEACHER_HEALTH_EXAM_COST = 5;
const TEACHER_HEALTH_COUNSEL_FAIL = 1;
const TEACHER_HEALTH_INSTIGATE_LOVING = 4;
const TEACHER_HEALTH_INSTIGATE_BOY = 3;
const TEACHER_MONTHLY_SALARY = 1500;
const TEACHER_MEDICINE_COST = 500;
const TEACHER_MEDICINE_HEAL = 5;
const TEACHER_COUNSEL_ENERGY_COST = 20;
const TEACHER_ACTIVITY_ENERGY_COST = 40;
const TEACHER_TREAT_SINGLE_ENERGY_COST = 30;
const TEACHER_TREAT_CLASS_ENERGY_COST = 40;
const TEACHER_TREAT_SINGLE_COST = 350;
const TEACHER_TREAT_CLASS_COST = 2000;
const TEACHER_CLASS_MEETING_ENERGY_COST = 40;
const TEACHER_CLASS_MEETING_COST = 500;

// 关系配置
const RELATION_IMPROVE_CHAR_DIFF = 0.3;
const RELATION_NORMAL_TO_BETTER = 0.02;
const RELATION_BETTER_TO_FRIEND = 0.015;
const RELATION_RANDOM_HATING = 0.005;
const RELATION_LOVING_DIFFERENT_GENDER = 0.008;
const RELATION_LOVING_SAME_GENDER = 0.003;
const RELATION_NEIGHBOR_FRIEND = 0.03;
const RELATION_NEIGHBOR_DISLIKE = 0.01;
const RELATION_INSTIGATE_SUCCESS = 0.7;
const RELATION_FRIEND_ENERGY_GAIN = 0.6;
const RELATION_FRIEND_ENTHUSIASM_REDUCTION = 0.3;
const RELATION_FRIEND_HIGH_ENTH_GAIN = 0.2;
const RELATION_HATING_ENERGY_LOSS = 0.4;
const RELATION_HATING_ENTHUSIASM_INCREASE = 0.3;
const RELATION_HATING_HIGH_ENTH_PENALTY = 0.4;
const RELATION_HATING_SEVERE_PENALTY = 0.8;
const RELATION_LOVING_POSITIVE_PROB = 0.6;

// 座位配置
const SEAT_COLUMNS = 9;
const SEAT_ROWS_MAX = 12;

// 请假配置
const LEAVE_REQUEST_PROB = 0.1;
const LEAVE_REQUEST_MAX_STUDENTS = 2;
const LEAVE_DURATION_MIN = 1;
const LEAVE_DURATION_MAX = 5;
const LEAVE_REQUEST_MUST_HANDLE = true;

// 请假理由池
const LEAVE_REASONS_COMMON = [
    "回家玩原神",
    "参加爸爸妈妈的婚礼",
    "steam求生之路2打折要回家买",
    "痔疮发作",
    "感冒",
    "高烧1538摄氏度",
    "拉裤子回家换裤头",
    "继承家产",
    "计算芙宁娜IP价值",
    "往迷你世界充了6块被发现了，回家挨打",
    "网卡断触卡键手抖误触瓶颈期没手感没心态没状态",
    "叛徒特务大军阀，反党分子野心家，走资派投降派修正主义大恶霸回家挨批斗",
    "孙笑川过世，继承日本天皇王位",
    "柚子社发新作了"
];

// 男生专属请假理由
const LEAVE_REASONS_BOY_ONLY = [
    "网购的斐济杯到货了",
    "小区发魅魔",
    "得了唐氏综合征",
    "炉管炸膛",
    "白嫖染梅毒"
];

// 成长配置
const GROWTH_RATE_EASY = 0.0020;  // 简单模式成长率稍高
const GROWTH_RATE_NORMAL = 0.0018;
const GROWTH_RATE_HARD = 0.0015;  // 困难模式成长率最低
const BASE_CAP_EASY = 50;  // 简单模式基础能力值最高
const BASE_CAP_NORMAL = 35;  // 普通模式基础能力值中等
const BASE_CAP_HARD = 25;  // 困难模式基础能力值最低
const LEARN_CAP_STD = 5;
const LEARN_CAP_MIN = 20;
const LEARN_CAP_MAX = 65;  // 全局上限，简单模式实际最大62
const LEARN_INCREASE_NOISE = 0.08;
const LEARN_CAP_DECAY_WEEKLY = 0.03;
const LEARN_CAP_DECAY_LEAVE = 0.5;  // 请假期间学习能力每周衰减

// 天赋系统配置
const TALENT_PROBABILITY = 0.6;  // 学生拥有天赋的概率
const TALENT_MIN_COUNT = 1;  // 最少天赋个数
const TALENT_MAX_COUNT = 2;  // 最多天赋个数
const TALENT_RESET_COST = 300;  // 调教消耗资金
const TALENT_RESET_ENERGY = 30;  // 调教消耗精力
const TALENT_RESET_SUCCESS_RATE = 0.8;  // 调教成功率

// 天赋定义
const Talent = {
    FILL_MISSING_EXAM: 1,        // 填缺考标记
    FORGET_NAME: 2,              // 忘填名字
    SPORTS_STUDENT: 3,           // 体育生
    LEGENDARY_CAPTAIN: 4,        // 传奇机长
    BOXER_MEMBER: 5,             // 义和团员
    GOOD_STUDENT: 6,             // 三好学生
    CLAIRVOYANT: 7,              // 千里眼
    SCIENCE_GOD: 8,              // 理科战神
    IRON_MAN: 9,                 // 铁人
    INDIFFERENT: 10,             // 冷漠
    BURST: 11,                   // 爆发
    GALOIS: 12,                  // 伽罗瓦
    LITERATURE_STAR: 13,         // 文曲星
    DARK_CRAWLER: 14,            // 阴暗爬行
    VIOLENT: 15,                 // 暴力
    PARRY: 16,                   // 弹反
    PLAYBOY: 17,                 // 海王
    ENTHUSIASTIC: 18,            // 热情
    LIN_DAIYU: 19,               // 林黛玉
    SMOKER: 20                   // 大烟鬼
};

// 天赋详细信息
const TALENT_INFO = {
    [Talent.FILL_MISSING_EXAM]: {
        name: '填缺考标记',
        description: '每次考试各科均有20%概率得0分'
    },
    [Talent.FORGET_NAME]: {
        name: '忘填名字',
        description: '每次考试每科均有5%概率得0分'
    },
    [Talent.SPORTS_STUDENT]: {
        name: '体育生',
        description: '精力恢复快，学习能力增长慢'
    },
    [Talent.LEGENDARY_CAPTAIN]: {
        name: '传奇机长',
        description: '每次考前一星期大幅降低精力，大幅增加学习能力（仅限男生）'
    },
    [Talent.BOXER_MEMBER]: {
        name: '义和团员',
        description: '英语学习能力保持较低'
    },
    [Talent.GOOD_STUDENT]: {
        name: '三好学生',
        description: '积极性增长快，学习能力增长快'
    },
    [Talent.CLAIRVOYANT]: {
        name: '千里眼',
        description: '每次考试有一科30%概率多得20分，20%概率得0分'
    },
    [Talent.SCIENCE_GOD]: {
        name: '理科战神',
        description: '数理化生学习能力高，语文英语与政史地能力保持较低'
    },
    [Talent.IRON_MAN]: {
        name: '铁人',
        description: '永不请假，不会因精力耗尽而死'
    },
    [Talent.INDIFFERENT]: {
        name: '冷漠',
        description: '与他人关系不会变化，不与他人交往'
    },
    [Talent.BURST]: {
        name: '爆发',
        description: '考试成绩降低超10%，则积极性增加20'
    },
    [Talent.GALOIS]: {
        name: '伽罗瓦',
        description: '数学学习能力保持较高'
    },
    [Talent.LITERATURE_STAR]: {
        name: '文曲星',
        description: '语文学习能力保持较高'
    },
    [Talent.DARK_CRAWLER]: {
        name: '阴暗爬行',
        description: '积极性保持较低'
    },
    [Talent.VIOLENT]: {
        name: '暴力',
        description: '每回合有2%概率殴打班主任，扣除班主任3血量'
    },
    [Talent.PARRY]: {
        name: '弹反',
        description: '无法被劝退；当被劝退时殴打班主任，扣除班主任7点血量'
    },
    [Talent.PLAYBOY]: {
        name: '海王',
        description: '大概率同时与多人恋爱；恋人迅速变化'
    },
    [Talent.ENTHUSIASTIC]: {
        name: '热情',
        description: '与他人关系只增不减'
    },
    [Talent.LIN_DAIYU]: {
        name: '林黛玉',
        description: '大幅增加请假概率'
    },
    [Talent.SMOKER]: {
        name: '大烟鬼',
        description: '每回合10%概率抽烟，抽烟时50%概率恢复50精力（到100为止），50%概率被直接劝退'
    }
};

// 天赋池（所有天赋）
const TALENT_POOL = Object.values(Talent);

// 其他配置
const IMPOSSIBLE_CHANCE_EASY_COMPETITION = 5;
const ENERGY_NOISE_RANGE = 0.8;
const ENTHUSIASM_NOISE_RANGE = 2.0;
const COUNSEL_SUCCESS_RATE = 0.5;
const ACTIVITY_SUCCESS_RATE = 0.7;
const NAME_DISPLAY_LENGTH = 4;

// 竞赛配置
const COMPETITION_STUDENT_RATIO = 0.2;  // 竞赛生比例（20%）
const COMPETITION_TRAINING_WEEKS = 2;  // 集训周数（2周）
const COMPETITION_LEAGUE_TO_PROVINCIAL_RATE = 0.4;  // 联赛进入省队概率（40%）
const COMPETITION_NATIONAL_GOLD_RATE = 0.05;  // 国赛金牌概率（5%）
const COMPETITION_NATIONAL_SILVER_RATE = 0.1;  // 国赛银牌概率（10%）
const COMPETITION_NATIONAL_BRONZE_RATE = 0.15;  // 国赛铜牌概率（15%）
const COMPETITION_TRAINING_LEARN_CAP_DECAY = 0.8;  // 集训期间学习能力衰减

// ============================================================================
// 竞赛相关枚举
// ============================================================================

const Competition = {
    MO: 1,
    PhO: 2,
    ChO: 3,
    BO: 4,
    OI: 5
};

const CompetitionStage = {
    League: 1,
    National: 2
};

const CompetitionAward = {
    None: 0,
    Bronze: 1,
    Silver: 2,
    Gold: 3
};

// 竞赛时间表（高二）
const COMPETITION_SCHEDULE = {
    // 第3学期
    31: [{ competition: Competition.ChO, stage: CompetitionStage.National }],  // 化学国赛
    31: [{ competition: Competition.MO, stage: CompetitionStage.League }],  // 数学联赛
    32: [{ competition: Competition.PhO, stage: CompetitionStage.League }],  // 物理联赛
    33: [{ competition: Competition.MO, stage: CompetitionStage.National }, { competition: Competition.PhO, stage: CompetitionStage.National }],  // 数学国赛 + 物理国赛
    34: [{ competition: Competition.OI, stage: CompetitionStage.League }],  // 信息学联赛
    // 第4学期
    43: [{ competition: Competition.BO, stage: CompetitionStage.League }],  // 生物联赛
    50: [{ competition: Competition.BO, stage: CompetitionStage.National }, { competition: Competition.OI, stage: CompetitionStage.National }]  // 生物国赛 + 信息学国赛
};

// ============================================================================
// 随机事件系统
// ============================================================================

const RandomEventType = {
    CONFIRM: 'confirm',  // 确认事件（只有一个确认按钮）
    CHOICE: 'choice'     // 选择事件（有多个选项按钮）
};

// 随机事件数据
const RANDOM_EVENTS = [
    // 带选项的事件
    {
        id: 1,
        type: RandomEventType.CHOICE,
        template: '{student}跑路去机房打游戏',
        options: [
            {
                text: '严厉惩罚',
                effect: 'energy:-10, enthusiasm:-5, learnCap:-2'
            },
            {
                text: '耐心劝导',
                effect: 'energy:-5, enthusiasm:+5, learnCap:+1'
            },
            {
                text: '关我吊事',
                effect: 'energy:+2'
            }
        ]
    },
    {
        id: 2,
        type: RandomEventType.CHOICE,
        template: '{student}带手机被发现',
        options: [
            {
                text: '没收手机',
                effect: 'energy:-5, enthusiasm:-3, learnCap:+1'
            },
            {
                text: '批评教育',
                effect: 'energy:-3, enthusiasm:-1'
            },
            {
                text: '睁一只眼闭一只眼',
                effect: 'enthusiasm:+2, energy:-2'
            }
        ]
    },
    {
        id: 3,
        type: RandomEventType.CHOICE,
        template: '{student}偷偷吃屎而不给大家分享！！',
        options: [
            {
                text: '勒令其与全班分享',
                effect: 'enthusiasm:+5, learnCap:+2'
            },
            {
                text: '关我吊事',
                effect: 'energy:+3'
            }
        ]
    },
    {
        id: 4,
        type: RandomEventType.CHOICE,
        template: '{student}晚上开卧谈会，聊到了3点',
        options: [
            {
                text: '严厉批评',
                effect: 'energy:-5, enthusiasm:-3'
            },
            {
                text: '提醒注意休息',
                effect: 'energy:+2, enthusiasm:+3'
            },
            {
                text: '不管',
                effect: 'energy:-3, enthusiasm:-2'
            }
        ]
    },
    {
        id: 5,
        type: RandomEventType.CHOICE,
        template: '{student}上{subject1}课写{subject2}作业',
        options: [
            {
                text: '这是个好事啊',
                effect: 'enthusiasm:+5, learnCap:+3'
            },
            {
                text: '大胆?!',
                effect: 'energy:-3, enthusiasm:-2, learnCap:+1'
            }
        ]
    },
    {
        id: 6,
        type: RandomEventType.CHOICE,
        template: '{subject}老师试图侵占体育课',
        options: [
            {
                text: '坚决阻止',
                effect: 'enthusiasm:+5, energy:-3'
            },
            {
                text: '这是个好事啊',
                effect: 'learnCap:+3, enthusiasm:-3'
            }
        ]
    },
    {
        id: 7,
        type: RandomEventType.CHOICE,
        template: '{student}使用三根笔祭奠你的浮木！！',
        options: [
            {
                text: '大胆?!',
                effect: 'energy:-3, enthusiasm:-5'
            },
            {
                text: '善',
                effect: 'energy:+3, enthusiasm:+5, learnCap:+1'
            }
        ]
    },
    {
        id: 8,
        type: RandomEventType.CHOICE,
        template: '{student}在希沃上通关了魔女的夜宴',
        options: [
            {
                text: '这辈子也就这样了',
                effect: 'energy:-3, enthusiasm:-5'
            },
            {
                text: '能度过一个相对成功的人生',
                effect: 'energy:+3, enthusiasm:+5'
            }
        ]
    },
    {
        id: 9,
        type: RandomEventType.CHOICE,
        template: '{student}在小说里把你写死了',
        options: [
            {
                text: '善',
                effect: 'energy:+2, enthusiasm:+3, learnCap:+1'
            },
            {
                text: '大胆?!',
                effect: 'energy:-5, enthusiasm:-3'
            }
        ]
    },
    {
        id: 10,
        type: RandomEventType.CHOICE,
        template: '{student}在希沃上打开cmd运行了tree，惊呆了所有人！！',
        options: [
            {
                text: '嘉豪一个',
                effect: 'energy:+2, enthusiasm:+3'
            },
            {
                text: '加以鼓励',
                effect: 'energy:+3, enthusiasm:+5, learnCap:+2'
            }
        ]
    },
    {
        id: 11,
        type: RandomEventType.CHOICE,
        template: '{student}携带mp3进班',
        options: [
            {
                text: '没收',
                effect: 'energy:-3, enthusiasm:-2'
            },
            {
                text: '警告',
                effect: 'energy:-1'
            }
        ]
    },
    {
        id: 12,
        type: RandomEventType.CHOICE,
        template: '{student}携带mp4进班',
        options: [
            {
                text: '没收',
                effect: 'energy:-5, enthusiasm:-3'
            },
            {
                text: '警告',
                effect: 'energy:-2'
            }
        ]
    },
    {
        id: 13,
        type: RandomEventType.CHOICE,
        template: '{student}携带mp5进班',
        options: [
            {
                text: '没收并上报',
                effect: 'teacher:kill'
            },
            {
                text: '没收',
                effect: 'teacher:hurt:-5, enthusiasm:-3'
            }
        ]
    },
    {
        id: 14,
        type: RandomEventType.CHOICE,
        template: '{student}在班里吃螺蛳粉',
        options: [
            {
                text: '严厉禁止',
                effect: 'energy:-3, enthusiasm:-2'
            },
            {
                text: '不管',
                effect: 'energy:+2, enthusiasm:+1'
            }
        ]
    },
    {
        id: 15,
        type: RandomEventType.CHOICE,
        template: '{student}把{target}鞋带在桌腿上系死结',
        options: [
            {
                text: '批评教育',
                effect: 'energy:-3, enthusiasm:-2'
            },
            {
                text: '调解',
                effect: 'energy:+2, enthusiasm:+3'
            }
        ]
    },
    
    // 确认事件
    {
        id: 101,
        type: RandomEventType.CONFIRM,
        template: '隔壁厕所爆炸了，班里香气四溢！！',
        buttonText: '大吃一斤',
        effect: 'energy:+5'
    },
    {
        id: 102,
        type: RandomEventType.CONFIRM,
        template: '{student}公然在班里散播反党反国言论！！',
        buttonText: '严肃处理',
        effect: 'energy:-5, student:kill'
    },
    {
        id: 103,
        type: RandomEventType.CONFIRM,
        template: '学生目击了流浪猫交配！！',
        buttonText: '这很正常',
        effect: 'energy:+3, enthusiasm:+2'
    },
    {
        id: 104,
        type: RandomEventType.CONFIRM,
        template: '{student}被发现在地上爬行',
        buttonText: '...',
        effect: 'energy:-2'
    },
    {
        id: 105,
        type: RandomEventType.CONFIRM,
        template: '你被制作成了游戏!',
        buttonText: '玩',
        effect: 'energy:+5, enthusiasm:+3'
    },
    {
        id: 106,
        type: RandomEventType.CONFIRM,
        template: '你的语录被整理起来发到了网上',
        buttonText: '查看',
        effect: 'enthusiasm:+5, energy:+2'
    },
    {
        id: 107,
        type: RandomEventType.CONFIRM,
        template: '{student}买茶粹连中{count}次一元乐享',
        buttonText: '太欧了',
        effect: 'energy:+5, enthusiasm:+5'
    },
    {
        id: 108,
        type: RandomEventType.CONFIRM,
        template: '雷霆乍惊, {student}刚刚放了个屁也',
        buttonText: '...',
        effect: 'energy:-1'
    },
    {
        id: 109,
        type: RandomEventType.CONFIRM,
        template: '希沃上的potplayer关不掉了!',
        buttonText: '重启',
        effect: 'energy:-2'
    },
    {
        id: 110,
        type: RandomEventType.CONFIRM,
        template: '天花板掉下来把{student}砸死了!!',
        buttonText: '...',
        effect: 'student:kill'
    }
];

// 高考配置
const GAOKAO_TOTAL_SCORE = 750;
const GAOKAO_SCORE_RANDOM_RANGE = 30;
const GAOKAO_UNIVERSITY_ASSIGN_RANDOM = 20;

// ============================================================================
// 枚举类型定义
// ============================================================================

const ContestType = {
    Mid: 1,
    End: 2,
    Final: 3
};

const GameMode = {
    Hard: 40,
    Normal: 60,
    Easy: 80
};

const Character = {
    WEI: 'wei',
    WANG: 'wang',
    QIN: 'qin'
};

const ClassType = {
    Science: 1,
    Art: 2
};

const Subject = {
    Chinese: 1,
    Maths: 2,
    English: 3,
    Physics: 4,
    Chemistry: 5,
    Biology: 6,
    Politics: 7,
    History: 8,
    Geography: 9
};

const CharacterData = {
    [Character.WEI]: {
        name: '魏教授',
        subject: Subject.Physics,
        trait: '半步年级长',
        monthlySalary: 1700,
        maxEnergy: 100,
        recoverEnergy: 100,
        noSalaryPenalty: true,
        reviveChance: 0
    },
    [Character.WANG]: {
        name: '王老师',
        subject: Subject.Chemistry,
        trait: '劳模体质',
        monthlySalary: 1500,
        maxEnergy: 140,
        recoverEnergy: 140,
        noSalaryPenalty: false,
        reviveChance: 0
    },
    [Character.QIN]: {
        name: '秦老师',
        subject: Subject.Maths,
        trait: '装糖阴他们一手',
        monthlySalary: 1500,
        maxEnergy: 100,
        recoverEnergy: 100,
        noSalaryPenalty: false,
        reviveChance: 0.35
    }
};

const Gender = {
    Boy: "male",
    Girl: "female"
};

const Status = {
    Normal: 1,
    Leave: 2,
    Train: 3,
    Dead: 4
};

const Relations = {
    Normal: 1,
    Better: 2,
    Friend: 3,
    Loving: 4,
    Disliking: 5,
    Hating: 6,
    Self: 7
};

const UniversityTier = {
    TIER_985: "985 工程",
    TIER_211: "211 工程",
    TIER_DOUBLE_FIRST: "双一流",
    TIER_TIER1: "一本",
    TIER_TIER2: "二本",
    TIER_TIER3: "三本/专科"
};

const ClassMeetingType = {
    CHICKEN_SOUP: "鸡汤班会",
    THREAT: "恐吓班会",
    AWARD: "表彰班会",
    FREE: "自由班会",
    COMPLAINT: "吐槽大会",
    SURPRISE: "惊喜班会"
};

const ActivityType = {
    SPORTS: "运动会",
    MOVIE: "看电影",
    FIELD_TRIP: "春游踏青",
    TALENT_SHOW: "才艺展示",
    GROUP_STUDY: "集体自习",
    PICNIC: "野餐聚会",
    GAME_NIGHT: "游戏之夜",
    VOLUNTEER: "志愿服务"
};

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 智能检测是否为移动设备
 * 综合使用多种检测方法，避免仅依赖屏幕宽度
 * @returns {boolean} 是否为移动设备
 */
function isMobileDevice() {
    // 方法1: User-Agent 检测
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobileKeywords = [
        'Android', 'iPhone', 'iPad', 'iPod', 'BlackBerry',
        'Windows Phone', 'webOS', 'Opera Mini', 'IEMobile',
        'Mobile', 'Tablet'
    ];
    
    const isMobileUA = mobileKeywords.some(keyword => 
        userAgent.indexOf(keyword) > -1
    );
    
    // 方法2: 触摸能力检测
    const hasTouch = 'ontouchstart' in window || 
                     navigator.maxTouchPoints > 0 || 
                     navigator.msMaxTouchPoints > 0;
    
    // 方法3: 屏幕比例检测（移动设备通常更窄）
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const aspectRatio = Math.min(screenWidth, screenHeight) / Math.max(screenWidth, screenHeight);
    
    // 移动设备通常比例小于0.7（竖屏时）
    const isMobileRatio = aspectRatio < 0.7;
    
    // 方法4: 结合窗口大小和设备像素比
    const devicePixelRatio = window.devicePixelRatio || 1;
    const logicalWidth = window.innerWidth;
    
    // 现代移动设备通常有高DPI（2x-3x）
    const isHighDPI = devicePixelRatio >= 2;
    
    // 综合判断：
    // - 如果有明确的移动设备User-Agent，优先判断为移动设备
    // - 如果支持触摸且有典型的移动设备比例，判断为移动设备
    // - 如果逻辑宽度较小且支持触摸，判断为移动设备
    
    if (isMobileUA) {
        return true;
    }
    
    if (hasTouch && isMobileRatio) {
        return true;
    }
    
    if (hasTouch && logicalWidth <= 768 && isHighDPI) {
        return true;
    }
    
    return false;
}

function isThisImpossible(n) {
    return Math.floor(Math.random() * n) + 1 === 1;
}

function randomGauss(mid, d, lft, rt, maxAttempts = 1000) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const res = Math.round(mid + z0 * d);

    if (lft <= res && res <= rt) {
        return res;
    }

    return Math.floor(Math.random() * (rt - lft + 1)) + lft;
}

function randomCap(gameMode) {
    const mid = gameMode.value;
    if (gameMode === GameMode.Easy) {
        return randomGauss(90, 8, 75, 100);  // 简单模式积极性最高
    } else if (gameMode === GameMode.Normal) {
        return randomGauss(65, 10, 45, 85);  // 普通模式积极性中等
    } else {
        return randomGauss(45, 10, 25, 65);  // 困难模式积极性最低
    }
}

// ============================================================================
// 姓名生成
// ============================================================================

// 自定义男生名字池
let customBoyNamesPool = [
    "张子恒", "李嘉祥", "张宸玮", "王志鑫", "郭家庆", "娄嘉耕", "徐墨林", "王荣浚",
    "孟文宣", "杨思博", "宋伟豪", "张晨旭", "王英浩", "陈宇鑫", "孟祺烜",
    "王凯博", "卫宇轩", "陈东鹏", "马圣骅", "王雅儒", "仝子轩", "段轶燃", "李林鑫",
    "朱为", "王梦成", "陈皓轩", "连峰逵", "马政泽", "吕睿臣",
    "张峻彬", "郇东洋", "陈柏霖", "智若镜", "莫思宇"
];

// 自定义女生名字池
let customGirlNamesPool = [
    "于尚熙", "李丽亚", "卢祺欣", "张语嫣", "张雅琪", "李沐霏",
    "黄婧雅", "张熙雯", "左晨希", "胡芳瑜", "乔一甜", "王家琪", "张馨艺", "曹梓菲",
    "伊若萱", "赖奕璇", "郭果", "宋若溪", "董紫涵", "凌皙悦", "郑雨荷", "雷玉清",
    "顾梦烜", "冯家琦", "张昀晞", "贾洪叶"
];

// 已使用的名字集合
let usedNames = new Set();

let boyNamesPool = [
    "伟", "强", "磊", "洋", "勇", "军", "杰", "涛", "超", "明",
    "刚", "平", "辉", "鹏", "华", "飞", "鑫", "波", "斌", "宇",
    "浩", "凯", "健", "俊", "晨", "旭", "林", "帆", "宇", "浩",
    "子豪", "俊杰", "博文", "天宇", "浩宇", "子轩", "梓豪", "俊杰", "博文", "天宇"
];

let girlNamesPool = [
    "静", "婷", "燕", "芳", "娜", "敏", "霞", "丽", "娟", "娟",
    "萍", "红", "梅", "玲", "琳", "霞", "燕", "芳", "婷", "娜",
    "雪", "慧", "雯", "颖", "悦", "瑶", "琪", "欣", "怡", "雅",
    "雨婷", "欣怡", "子涵", "雨萱", "佳琪", "诗涵", "欣怡", "子涵", "雨萱", "佳琪"
];

let boySurnamesPool = [
    "王", "李", "张", "刘", "陈", "杨", "赵", "黄", "周", "吴",
    "徐", "孙", "胡", "朱", "高", "林", "何", "郭", "马", "罗",
    "梁", "宋", "郑", "谢", "韩", "唐", "冯", "于", "董", "萧",
    "程", "曹", "袁", "邓", "许", "傅", "沈", "曾", "彭", "吕"
];

let girlSurnamesPool = [
    "李", "王", "张", "刘", "陈", "杨", "赵", "黄", "周", "吴",
    "徐", "孙", "胡", "朱", "高", "林", "何", "郭", "马", "罗",
    "梁", "宋", "郑", "谢", "韩", "唐", "冯", "于", "董", "萧",
    "程", "曹", "袁", "邓", "许", "傅", "沈", "曾", "彭", "吕"
];

function generateUniqueName(gender) {
    // 优先从自定义名字池中选择不重复的名字
    if (gender === Gender.Boy) {
        if (customBoyNamesPool.length > 0) {
            const randomIndex = Math.floor(Math.random() * customBoyNamesPool.length);
            const name = customBoyNamesPool.splice(randomIndex, 1)[0];
            return name;
        }
        // 如果自定义名字池用完了，使用原来的生成方式
        const surname = boySurnamesPool[Math.floor(Math.random() * boySurnamesPool.length)];
        const givenName = boyNamesPool[Math.floor(Math.random() * boyNamesPool.length)];
        return surname + givenName;
    } else {
        if (customGirlNamesPool.length > 0) {
            const randomIndex = Math.floor(Math.random() * customGirlNamesPool.length);
            const name = customGirlNamesPool.splice(randomIndex, 1)[0];
            return name;
        }
        // 如果自定义名字池用完了，使用原来的生成方式
        const surname = girlSurnamesPool[Math.floor(Math.random() * girlSurnamesPool.length)];
        const givenName = girlNamesPool[Math.floor(Math.random() * girlNamesPool.length)];
        return surname + givenName;
    }
}

function resetNamePool() {
    // 重置自定义男生名字池
    customBoyNamesPool = [
        "张子恒", "李嘉祥", "张宸玮", "王志鑫", "郭家庆", "娄嘉耕", "徐墨林", "王荣浚",
        "孟文宣", "杨思博", "宋伟豪", "张晨旭", "王英浩", "陈宇鑫", "孟祺烜",
        "王凯博", "卫宇轩", "陈东鹏", "马圣骅", "王雅儒", "仝子轩", "段轶燃", "李林鑫",
        "朱为", "王梦成", "陈皓轩", "连峰逵", "马政泽", "吕睿臣",
        "张峻彬", "郇东洋", "陈柏霖", "智若镜", "莫思宇"
    ];

    // 重置自定义女生名字池
    customGirlNamesPool = [
        "于尚熙", "李丽亚", "卢祺欣", "张语嫣", "张雅琪", "李沐霏",
        "黄婧雅", "张熙雯", "左晨希", "胡芳瑜", "乔一甜", "王家琪", "张馨艺", "曹梓菲",
        "伊若萱", "赖奕璇", "郭果", "宋若溪", "董紫涵", "凌皙悦", "郑雨荷", "雷玉清",
        "顾梦烜", "冯家琦", "张昀晞", "贾洪叶"
    ];

    // 重置已使用名字集合
    usedNames.clear();

    boyNamesPool = [
        "伟", "强", "磊", "洋", "勇", "军", "杰", "涛", "超", "明",
        "刚", "平", "辉", "鹏", "华", "飞", "鑫", "波", "斌", "宇",
        "浩", "凯", "健", "俊", "晨", "旭", "林", "帆", "宇", "浩",
        "子豪", "俊杰", "博文", "天宇", "浩宇", "子轩", "梓豪", "俊杰", "博文", "天宇"
    ];

    girlNamesPool = [
        "静", "婷", "燕", "芳", "娜", "敏", "霞", "丽", "娟", "娟",
        "萍", "红", "梅", "玲", "琳", "霞", "燕", "芳", "婷", "娜",
        "雪", "慧", "雯", "颖", "悦", "瑶", "琪", "欣", "怡", "雅",
        "雨婷", "欣怡", "子涵", "雨萱", "佳琪", "诗涵", "欣怡", "子涵", "雨萱", "佳琪"
    ];
}

// ============================================================================
// 大学类
// ============================================================================

class University {
    constructor(name, tier, scienceScore, artScore, location = "未知", category = "综合") {
        this.name = name;
        this.tier = tier;
        this.scienceScore = scienceScore;
        this.artScore = artScore;
        this.location = location;
        this.category = category;
    }

    getScoreRequirement(classType) {
        if (classType === ClassType.Science) {
            return this.scienceScore;
        } else {
            return this.artScore;
        }
    }
}

function getUniversityDatabase() {
    return [
        new University("清华大学", UniversityTier.TIER_985, 695, 680, "北京", "综合"),
        new University("北京大学", UniversityTier.TIER_985, 690, 675, "北京", "综合"),
        new University("复旦大学", UniversityTier.TIER_985, 680, 665, "上海", "综合"),
        new University("上海交通大学", UniversityTier.TIER_985, 678, 660, "上海", "综合"),
        new University("浙江大学", UniversityTier.TIER_985, 675, 658, "杭州", "综合"),
        new University("中国科学技术大学", UniversityTier.TIER_985, 670, 650, "合肥", "理工"),
        new University("南京大学", UniversityTier.TIER_985, 668, 655, "南京", "综合"),
        new University("武汉大学", UniversityTier.TIER_985, 655, 640, "武汉", "综合"),
        new University("华中科技大学", UniversityTier.TIER_985, 650, 635, "武汉", "理工"),
        new University("中山大学", UniversityTier.TIER_985, 645, 630, "广州", "综合"),
        new University("西安交通大学", UniversityTier.TIER_985, 640, 625, "西安", "综合"),
        new University("哈尔滨工业大学", UniversityTier.TIER_985, 638, 620, "哈尔滨", "理工"),
        new University("北京航空航天大学", UniversityTier.TIER_985, 665, 650, "北京", "理工"),
        new University("同济大学", UniversityTier.TIER_985, 660, 645, "上海", "理工"),
        new University("南开大学", UniversityTier.TIER_985, 650, 638, "天津", "综合"),
        new University("厦门大学", UniversityTier.TIER_985, 645, 635, "厦门", "综合"),
        new University("四川大学", UniversityTier.TIER_985, 640, 630, "成都", "综合"),
        new University("山东大学", UniversityTier.TIER_985, 635, 625, "济南", "综合"),
        new University("上海财经大学", UniversityTier.TIER_211, 655, 645, "上海", "财经"),
        new University("中央财经大学", UniversityTier.TIER_211, 650, 640, "北京", "财经"),
        new University("对外经济贸易大学", UniversityTier.TIER_211, 645, 635, "北京", "财经"),
        new University("北京邮电大学", UniversityTier.TIER_211, 640, 625, "北京", "理工"),
        new University("西安电子科技大学", UniversityTier.TIER_211, 630, 615, "西安", "理工"),
        new University("南京航空航天大学", UniversityTier.TIER_211, 625, 610, "南京", "理工"),
        new University("武汉理工大学", UniversityTier.TIER_211, 615, 600, "武汉", "理工"),
        new University("西南交通大学", UniversityTier.TIER_211, 610, 595, "成都", "理工"),
        new University("北京交通大学", UniversityTier.TIER_211, 620, 605, "北京", "理工"),
        new University("华东理工大学", UniversityTier.TIER_211, 625, 610, "上海", "理工"),
        new University("郑州大学", UniversityTier.TIER_211, 605, 590, "郑州", "综合"),
        new University("河南大学", UniversityTier.TIER_DOUBLE_FIRST, 595, 580, "开封", "综合"),
        new University("北京科技大学", UniversityTier.TIER_DOUBLE_FIRST, 615, 600, "北京", "理工"),
        new University("北京化工大学", UniversityTier.TIER_DOUBLE_FIRST, 605, 590, "北京", "理工"),
        new University("南京理工大学", UniversityTier.TIER_DOUBLE_FIRST, 620, 605, "南京", "理工"),
        new University("苏州大学", UniversityTier.TIER_DOUBLE_FIRST, 625, 610, "苏州", "综合"),
        new University("上海大学", UniversityTier.TIER_DOUBLE_FIRST, 620, 605, "上海", "综合"),
        new University("暨南大学", UniversityTier.TIER_DOUBLE_FIRST, 615, 600, "广州", "综合"),
        new University("福州大学", UniversityTier.TIER_DOUBLE_FIRST, 605, 590, "福州", "理工"),
        new University("南昌大学", UniversityTier.TIER_DOUBLE_FIRST, 600, 585, "南昌", "综合"),
        new University("河南工业大学", UniversityTier.TIER_TIER1, 570, 555, "郑州", "理工"),
        new University("河南理工大学", UniversityTier.TIER_TIER1, 560, 545, "焦作", "理工"),
        new University("河南农业大学", UniversityTier.TIER_TIER1, 555, 540, "郑州", "农林"),
        new University("河南师范大学", UniversityTier.TIER_TIER1, 565, 550, "新乡", "师范"),
        new University("河南科技大学", UniversityTier.TIER_TIER1, 560, 545, "洛阳", "理工"),
        new University("华北水利水电大学", UniversityTier.TIER_TIER1, 565, 550, "郑州", "理工"),
        new University("河南财经政法大学", UniversityTier.TIER_TIER1, 575, 560, "郑州", "财经"),
        new University("新乡医学院", UniversityTier.TIER_TIER1, 580, 565, "新乡", "医药"),
        new University("郑州轻工业大学", UniversityTier.TIER_TIER1, 555, 540, "郑州", "理工"),
        new University("中原工学院", UniversityTier.TIER_TIER1, 550, 535, "郑州", "理工"),
        new University("河南工程学院", UniversityTier.TIER_TIER2, 520, 505, "郑州", "理工"),
        new University("河南科技学院", UniversityTier.TIER_TIER2, 510, 495, "新乡", "农林"),
        new University("洛阳师范学院", UniversityTier.TIER_TIER2, 515, 500, "洛阳", "师范"),
        new University("安阳师范学院", UniversityTier.TIER_TIER2, 510, 495, "安阳", "师范"),
        new University("南阳师范学院", UniversityTier.TIER_TIER2, 505, 490, "南阳", "师范"),
        new University("商丘师范学院", UniversityTier.TIER_TIER2, 500, 485, "商丘", "师范"),
        new University("郑州科技学院", UniversityTier.TIER_TIER3, 450, 435, "郑州", "理工"),
        new University("黄河科技学院", UniversityTier.TIER_TIER3, 440, 425, "郑州", "综合"),
        new University("郑州工商学院", UniversityTier.TIER_TIER3, 430, 415, "郑州", "财经")
    ];
}

// ============================================================================
// 数据模型
// ============================================================================

class Student {
    constructor(index, belongClass, mode = GameMode.Normal, classType = ClassType.Science) {
        this.belongClass = belongClass;
        this.index = index;
        this.gender = Math.random() < 0.5 ? Gender.Boy : Gender.Girl;
        this.name = generateUniqueName(this.gender);
        this.gameMode = mode;
        this.status = Status.Normal;
        this.energy = STUDENT_ENERGY_DEFAULT;
        this.enthusiasm = randomCap(this.gameMode);
        this.character = [Math.random(), Math.random()];
        this.IQ = randomCap(this.gameMode) + 20;
        this.seatCol = 0;
        this.seatRow = 0;
        this.relation = {};
        for (let i = 1; i <= belongClass.studentNum; i++) {
            this.relation[i] = Relations.Normal;
        }
        this.relation[this.index] = Relations.Self;
        
        // 竞赛相关属性（仅简单模式）
        this.competition = null;
        this.competitionStage = null;
        this.competitionAward = CompetitionAward.None;
        this.inTraining = false;
        this.trainingEndWeek = null;
        this.admittedEarly = null;  // 通过竞赛提前录取
        
        // 死亡标记
        this.hasBeenDead = false;
        
        // 天赋系统
        this.talents = [];
        this._generateTalents();
        
        // 天赋影响的历史记录（用于爆发天赋）
        this.lastExamScoreChange = 0;
        
        if (this.gameMode === GameMode.Easy && isThisImpossible(IMPOSSIBLE_CHANCE_EASY_COMPETITION)) {
            const competitions = Object.values(Competition);
            this.competition = competitions[Math.floor(Math.random() * competitions.length)];
        }
        if (classType === ClassType.Science) {
            this.validSubjects = [Subject.Chinese, Subject.Maths, Subject.English,
                                  Subject.Physics, Subject.Chemistry, Subject.Biology];
        } else {
            this.validSubjects = [Subject.Chinese, Subject.Maths, Subject.English,
                                  Subject.Politics, Subject.History, Subject.Geography];
        }
        let baseCap;
        let maxCap;
        if (this.gameMode === GameMode.Easy) {
            this.growthRate = GROWTH_RATE_EASY;
            baseCap = BASE_CAP_EASY;
            maxCap = 62;  // 简单模式最大能力值最高
        } else if (this.gameMode === GameMode.Normal) {
            this.growthRate = GROWTH_RATE_NORMAL;
            baseCap = BASE_CAP_NORMAL;
            maxCap = 48;  // 普通模式最大能力值中等
        } else {
            this.growthRate = GROWTH_RATE_HARD;
            baseCap = BASE_CAP_HARD;
            maxCap = 38;  // 困难模式最大能力值最低
        }
        
        this.learnCap = {};
        for (let subject of this.validSubjects) {
            this.learnCap[subject] = randomGauss(baseCap, LEARN_CAP_STD, LEARN_CAP_MIN, maxCap);
        }
        this.previousScore = null;
        this.firstExamScore = null;
        this.scoreChangeFactor = 0.0;
        this.lastExamRank = null;
        this.leaveStartWeek = null;
        this.leaveEndWeek = null;
        this.gaokaoScore = null;
        this.gaokaoScores = null;
        this.admittedUniversity = null;
    }

    getNeighbors() {
        const neighbors = [];
        if (!this.seatCol || !this.seatRow) {
            return neighbors;
        }
        const seats = this.belongClass.seats;
        const c = this.seatCol - 1;
        const r = this.seatRow - 1;
        if (c > 0 && r < seats[c - 1].length && seats[c - 1][r] !== null) {
            neighbors.push(seats[c - 1][r]);
        }
        if (c < SEAT_COLUMNS - 1 && r < seats[c + 1].length && seats[c + 1][r] !== null) {
            neighbors.push(seats[c + 1][r]);
        }
        if (r > 0 && seats[c][r - 1] !== null) {
            neighbors.push(seats[c][r - 1]);
        }
        if (r + 1 < seats[c].length && seats[c][r + 1] !== null) {
            neighbors.push(seats[c][r + 1]);
        }
        return neighbors;
    }

    updateWeekly() {
        let energyRecover = STUDENT_ENERGY_RECOVER_NORMAL;
        if (this.status === Status.Leave) {
            energyRecover = STUDENT_ENERGY_RECOVER_LEAVE;
        }
        
        // 天赋影响：体育生精力恢复快
        if (this.talents.includes(Talent.SPORTS_STUDENT)) {
            energyRecover *= 1.8;
        }
        
        // 天赋影响：传奇机长考前一星期大幅降低精力
        if (this.talents.includes(Talent.LEGENDARY_CAPTAIN)) {
            const examWeeks = this.belongClass.contests[ContestType.Mid].concat(
                this.belongClass.contests[ContestType.End],
                this.belongClass.contests[ContestType.Final]
            );
            if (examWeeks.includes(this.belongClass.week + 1)) {
                energyRecover -= 5.0;
            }
        }
        
        // 天赋影响：阴暗爬行积极性保持较低
        if (this.talents.includes(Talent.DARK_CRAWLER)) {
            this.enthusiasm = Math.max(STUDENT_ENTHUSIASM_MIN, Math.min(30, this.enthusiasm));
        }
        
        // 天赋影响：三好学生积极性增长快
        let enthusiasmGrowthMultiplier = 1.0;
        if (this.talents.includes(Talent.GOOD_STUDENT)) {
            enthusiasmGrowthMultiplier = 2.0;
        }
        
        let enthusiasmDecay = STUDENT_ENTHUSIASM_DECAY_BASE;
        enthusiasmDecay += this.scoreChangeFactor;
        this.scoreChangeFactor *= SCORE_CHANGE_DECAY;
        // 天赋影响：冷漠 - 不与他人交往
        if (this.talents.includes(Talent.INDIFFERENT)) {
            // 跳过关系处理
        } else {
            const neighbors = this.getNeighbors();
            let hatingNeighborPenalty = 0.0;
            for (let neighbor of neighbors) {
                if (neighbor === null || neighbor.status === Status.Dead) {
                    continue;
                }
                const rel = this.relation[neighbor.index] || Relations.Normal;
                
                // 天赋影响：热情 - 与他人关系只增不减
                if (this.talents.includes(Talent.ENTHUSIASTIC)) {
                    if (rel === Relations.Hating || rel === Relations.Disliking) {
                        // 热情天赋会将不良关系改善为普通
                        this.relation[neighbor.index] = Relations.Normal;
                    }
                }
                
                if (rel === Relations.Friend || rel === Relations.Better) {
                    energyRecover += RELATION_FRIEND_ENERGY_GAIN;
                    enthusiasmDecay -= RELATION_FRIEND_ENTHUSIASM_REDUCTION * enthusiasmGrowthMultiplier;
                    if (neighbor.enthusiasm > 80) {
                        energyRecover += RELATION_FRIEND_HIGH_ENTH_GAIN;
                        enthusiasmDecay -= 0.2;
                    }
                } else if (rel === Relations.Hating || rel === Relations.Disliking) {
                    energyRecover -= RELATION_HATING_ENERGY_LOSS;
                    enthusiasmDecay += RELATION_HATING_ENTHUSIASM_INCREASE;
                    if (neighbor.enthusiasm > 70) {
                        energyRecover -= RELATION_HATING_HIGH_ENTH_PENALTY;
                        enthusiasmDecay += 0.2;
                    }
                    if (rel === Relations.Hating) {
                        hatingNeighborPenalty += RELATION_HATING_SEVERE_PENALTY;
                    }
                } else if (rel === Relations.Loving) {
                    if (Math.random() > RELATION_LOVING_POSITIVE_PROB) {
                        energyRecover += 0.4;
                        enthusiasmDecay -= 0.6;
                    } else {
                        energyRecover -= 0.4;
                        enthusiasmDecay -= 0.2;
                    }
                }
            }
            energyRecover -= hatingNeighborPenalty;
        }
        const energyNoise = (Math.random() * 2 - 1) * ENERGY_NOISE_RANGE;
        const enthusiasmNoise = (Math.random() * 2 - 1) * ENTHUSIASM_NOISE_RANGE;
        this.energy = Math.max(STUDENT_ENERGY_MIN,
            Math.min(STUDENT_ENERGY_MAX, this.energy + energyRecover + energyNoise));
        this.enthusiasm = Math.max(STUDENT_ENTHUSIASM_MIN,
            Math.min(STUDENT_ENTHUSIASM_MAX, this.enthusiasm - enthusiasmDecay + enthusiasmNoise));
        const efficiency = (this.energy / STUDENT_ENERGY_MAX) * (this.enthusiasm / STUDENT_ENTHUSIASM_MAX);
        const iqFactor = this.IQ / 100.0;
        
        // 天赋影响：学习能力增长
        let growthMultiplier = 1.0;
        if (this.talents.includes(Talent.SPORTS_STUDENT)) {
            growthMultiplier *= 0.3;  // 体育生学习能力增长很慢
        }
        if (this.talents.includes(Talent.GOOD_STUDENT)) {
            growthMultiplier *= 2.0;  // 三好学生学习能力增长更快
        }
        if (this.talents.includes(Talent.LEGENDARY_CAPTAIN)) {
            // 传奇机长考前一星期大幅增加学习能力
            const examWeeks = this.belongClass.contests[ContestType.Mid].concat(
                this.belongClass.contests[ContestType.End],
                this.belongClass.contests[ContestType.Final]
            );
            if (examWeeks.includes(this.belongClass.week + 1)) {
                growthMultiplier *= 3.0;  // 学习能力大幅增加
            }
        }
        
        for (let subject of this.validSubjects) {
            const currentCap = this.learnCap[subject];
            let increase = (LEARN_CAP_MAX - currentCap) * this.growthRate * efficiency * iqFactor * growthMultiplier;
            increase += (Math.random() * 2 - 1) * LEARN_INCREASE_NOISE;
            const decay = LEARN_CAP_DECAY_WEEKLY * (1.0 - efficiency);
            let newCap = currentCap + increase - decay;
            
            // 天赋影响：特定科目能力保持较高或较低
            if (this.talents.includes(Talent.GALOIS) && subject === Subject.Maths) {
                newCap = Math.max(60, newCap);  // 伽罗瓦：数学学习能力保持很高
            }
            if (this.talents.includes(Talent.LITERATURE_STAR) && subject === Subject.Chinese) {
                newCap = Math.max(60, newCap);  // 文曲星：语文学习能力保持很高
            }
            if (this.talents.includes(Talent.BOXER_MEMBER) && subject === Subject.English) {
                newCap = Math.min(25, newCap);  // 义和团员：英语学习能力保持很低
            }
            if (this.talents.includes(Talent.SCIENCE_GOD)) {
                // 理科战神：数理化生学习能力很高，语文英语与政史地能力保持很低
                const scienceSubjects = [Subject.Maths, Subject.Physics, Subject.Chemistry, Subject.Biology];
                const humanitiesSubjects = [Subject.Chinese, Subject.English, Subject.Politics, Subject.History, Subject.Geography];
                if (scienceSubjects.includes(subject)) {
                    newCap = Math.max(60, newCap);  // 理科科目学习能力更高
                } else if (humanitiesSubjects.includes(subject)) {
                    newCap = Math.min(25, newCap);  // 文科科目学习能力更低
                }
            }
            
            this.learnCap[subject] = Math.max(LEARN_CAP_MIN, Math.min(LEARN_CAP_MAX, newCap));
        }
        
        // 集训期间学习能力衰减
        if (this.inTraining) {
            for (let subject of this.validSubjects) {
                this.learnCap[subject] = Math.max(LEARN_CAP_MIN,
                    this.learnCap[subject] - COMPETITION_TRAINING_LEARN_CAP_DECAY);
            }
        }

        // 请假期间学习能力衰减（时间越久下降越多）
        if (this.status === Status.Leave) {
            for (let subject of this.validSubjects) {
                const currentCap = this.learnCap[subject];
                // 衰减量 = 基础衰减 * (1 + 请假周数的0.1倍)
                const weeksOnLeave = this.belongClass.week - this.leaveStartWeek;
                const decayMultiplier = 1 + weeksOnLeave * 0.1;
                const leaveDecay = LEARN_CAP_DECAY_LEAVE * decayMultiplier;
                this.learnCap[subject] = Math.max(LEARN_CAP_MIN, currentCap - leaveDecay);
            }
        }

        // 天赋效果：暴力 - 每回合有2%概率殴打班主任
        if (this.talents.includes(Talent.VIOLENT) && Math.random() < 0.02) {
            this.belongClass.teacher.health = Math.max(0, this.belongClass.teacher.health - 3);
            this.belongClass.log(`👊 学生 ${this.name} 殴打了班主任！班主任血量-3`, 'danger');
            
            // 添加弹窗提示
            if (typeof showNotification === 'function') {
                showNotification('danger', '警告！', `学生 ${this.name} 殴打了班主任！血量-3`);
            }
            
            checkTeacherDeath(this.belongClass);
        }
        
        // 天赋效果：大烟鬼 - 每回合10%概率抽烟
        if (this.talents.includes(Talent.SMOKER) && Math.random() < 0.1 && this.status !== Status.Dead) {
            if (Math.random() < 0.5) {
                // 50%概率恢复50精力
                this.energy = Math.min(STUDENT_ENERGY_MAX, this.energy + 50);
                this.belongClass.log(`🚬 学生 ${this.name} 抽烟恢复了50精力`, 'highlight');
            } else {
                // 50%概率被直接劝退
                this.status = Status.Dead;
                this.belongClass.studentAliveNum--;
                this.belongClass.log(`🚬 学生 ${this.name} 抽烟被劝退！`, 'danger');
                
                // 添加弹窗提示
                if (typeof showNotification === 'function') {
                    showNotification('danger', '学生被劝退！', `学生 ${this.name} 抽烟被发现，已被劝退！`);
                }
            }
        }

        // 检查精力是否归零
        if (this.energy <= 0) {
            // 天赋影响：铁人 - 不会因精力耗尽而死
            if (this.talents.includes(Talent.IRON_MAN)) {
                this.energy = 0;
                this.belongClass.log(`🛡️ 学生 ${this.name} 因铁人天赋，精力耗尽但未死亡！`, 'highlight');
                console.log(`[IRON_MAN] Student ${this.name} energy drained but survived due to Iron Man talent.`);
            } else {
                this.energy = 0;
                this.status = Status.Dead;
                this.belongClass.studentAliveNum--;
                this.belongClass.log(`💀 学生 ${this.name} 因精力耗尽而死亡！`, 'danger');
                console.log(`[DEATH] Student ${this.name} died. studentAliveNum: ${this.belongClass.studentAliveNum}`);
                
                // 直接显示死亡通知弹窗
                if (typeof showStudentDeathModal === 'function') {
                    console.log(`[DEATH] Calling showStudentDeathModal for ${this.name}`);
                    showStudentDeathModal(this.name);
                } else {
                    console.error(`[DEATH] ERROR: showStudentDeathModal function not found!`);
                }
            }
        }
    }

    // 生成天赋
    _generateTalents(forceHaveTalent = false) {
        // forceHaveTalent为true时必定有天赋，否则按概率
        if (forceHaveTalent || Math.random() < TALENT_PROBABILITY) {
            const count = Math.floor(Math.random() * (TALENT_MAX_COUNT - TALENT_MIN_COUNT + 1)) + TALENT_MIN_COUNT;
            
            // 随机选择天赋（不重复）
            const availableTalents = [...TALENT_POOL];
            let addedCount = 0;
            
            while (addedCount < count && availableTalents.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableTalents.length);
                const talent = availableTalents.splice(randomIndex, 1)[0];
                
                // 检查天赋限制
                if (this._canHaveTalent(talent)) {
                    this.talents.push(talent);
                    addedCount++;
                }
            }
        }
    }

    // 检查是否可以拥有某个天赋
    _canHaveTalent(talent) {
        // 传奇机长仅限男生
        if (talent === Talent.LEGENDARY_CAPTAIN && this.gender !== Gender.Boy) {
            return false;
        }
        
        // 弹反天赋优先级高，如果有弹反，就不需要检查其他天赋
        if (this.talents.includes(Talent.PARRY)) {
            return false;
        }
        
        // 暴力和弹反不能同时存在
        if (talent === Talent.VIOLENT && this.talents.includes(Talent.PARRY)) {
            return false;
        }
        
        // 冷漠和热情不能同时存在
        if (talent === Talent.INDIFFERENT && this.talents.includes(Talent.ENTHUSIASTIC)) {
            return false;
        }
        
        if (talent === Talent.ENTHUSIASTIC && this.talents.includes(Talent.INDIFFERENT)) {
            return false;
        }
        
        // 阴暗爬行和三好学生不能同时存在
        if (talent === Talent.DARK_CRAWLER && this.talents.includes(Talent.GOOD_STUDENT)) {
            return false;
        }
        
        if (talent === Talent.GOOD_STUDENT && this.talents.includes(Talent.DARK_CRAWLER)) {
            return false;
        }
        
        // 铁人和林黛玉不能同时存在
        if (talent === Talent.IRON_MAN && this.talents.includes(Talent.LIN_DAIYU)) {
            return false;
        }
        
        if (talent === Talent.LIN_DAIYU && this.talents.includes(Talent.IRON_MAN)) {
            return false;
        }
        
        return true;
    }

    // 重置天赋
    resetTalents(forceHaveTalent = false) {
        this.talents = [];
        this._generateTalents(forceHaveTalent);
        this.lastExamScoreChange = 0;
    }

    toString() {
        return this.name;
    }
}

class Teacher {
    constructor(characterType = null) {
        this.characterType = characterType;
        this.salary = 0;
        this.health = TEACHER_HEALTH_MAX;
        
        // 应用角色特质
        if (characterType && CharacterData[characterType]) {
            const charData = CharacterData[characterType];
            this.energy = charData.maxEnergy;
            this.maxEnergy = charData.maxEnergy;
            this.monthlySalary = charData.monthlySalary;
            this.noSalaryPenalty = charData.noSalaryPenalty;
            this.reviveChance = charData.reviveChance;
            this.subject = charData.subject;
        } else {
            this.energy = TEACHER_ENERGY_DEFAULT;
            this.maxEnergy = TEACHER_ENERGY_DEFAULT;
            this.monthlySalary = TEACHER_MONTHLY_SALARY;
            this.noSalaryPenalty = false;
            this.reviveChance = 0;
            this.subject = null;
        }
        
        this.lastSalaryWeek = 0;
    }

    recoverEnergy() {
        if (this.characterType && CharacterData[this.characterType]) {
            this.energy = CharacterData[this.characterType].recoverEnergy;
        } else {
            this.energy = TEACHER_ENERGY_DEFAULT;
        }
    }
}

class LeaveRequest {
    constructor(student, duration, reason) {
        this.student = student;
        this.duration = duration;
        this.reason = reason || this.generateReason(student);
        this.requestedWeek = null;
        this.approved = null;
        this.processed = false;
    }

    generateReason(student) {
        // 男生可以从通用池和男生专属池中选择
        if (student.gender === Gender.Boy) {
            const allReasons = [...LEAVE_REASONS_COMMON, ...LEAVE_REASONS_BOY_ONLY];
            return allReasons[Math.floor(Math.random() * allReasons.length)];
        } else {
            // 女生只能从通用池中选择
            return LEAVE_REASONS_COMMON[Math.floor(Math.random() * LEAVE_REASONS_COMMON.length)];
        }
    }
}

// ============================================================================
// 全局Tooltip系统
// ============================================================================

function initGlobalTooltip() {
    const tooltip = document.createElement('div');
    tooltip.id = 'global-tooltip';
    tooltip.style.cssText = `
        position: fixed;
        z-index: 99999;
        background: rgba(0, 0, 0, 0.95);
        color: #f0ede8;
        padding: 10px 14px;
        border-radius: 6px;
        font-size: 0.75em;
        white-space: pre-wrap;
        pointer-events: none;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s, visibility 0.2s;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
        min-width: 150px;
    max-width: 400px;
        text-align: left;
        line-height: 1.5;
        word-wrap: break-word;
        word-break: break-word;
    `;
    document.body.appendChild(tooltip);

    const arrow = document.createElement('div');
    arrow.id = 'global-tooltip-arrow';
    arrow.style.cssText = `
        position: fixed;
        z-index: 99999;
        border: 6px solid transparent;
        border-top-color: rgba(0, 0, 0, 0.95);
        pointer-events: none;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s, visibility 0.2s;
    `;
    document.body.appendChild(arrow);

    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest('[data-tooltip]');
        if (target) {
            const text = target.getAttribute('data-tooltip');
            showGlobalTooltip(target, text);
        }
    }, true);

    document.addEventListener('mouseout', (e) => {
        const target = e.target.closest('[data-tooltip]');
        if (target) {
            hideGlobalTooltip();
        }
    }, true);

    document.addEventListener('mousemove', (e) => {
        const target = e.target.closest('[data-tooltip]');
        if (target && tooltip.style.visibility === 'visible') {
            updateTooltipPosition(target);
        }
    }, true);
}

function showGlobalTooltip(element, text) {
    const tooltip = document.getElementById('global-tooltip');
    const arrow = document.getElementById('global-tooltip-arrow');

    tooltip.textContent = text;
    tooltip.style.visibility = 'visible';
    tooltip.style.opacity = '1';
    arrow.style.visibility = 'visible';
    arrow.style.opacity = '1';

    updateTooltipPosition(element);
}

function hideGlobalTooltip() {
    const tooltip = document.getElementById('global-tooltip');
    const arrow = document.getElementById('global-tooltip-arrow');

    tooltip.style.opacity = '0';
    tooltip.style.visibility = 'hidden';
    arrow.style.opacity = '0';
    arrow.style.visibility = 'hidden';
}

function updateTooltipPosition(element) {
    const tooltip = document.getElementById('global-tooltip');
    const arrow = document.getElementById('global-tooltip-arrow');

    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    let top = rect.top - tooltipRect.height - 12;
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);

    if (top < 10) {
        top = rect.bottom + 12;
    }

    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
    }

    tooltip.style.top = top + 'px';
    tooltip.style.left = left + 'px';

    arrow.style.left = (rect.left + rect.width / 2) + 'px';
}

/**
 * 显示关系模式下的悬停信息
 * @param {HTMLElement} element - 悬停的学生单元格元素
 * @param {Student} student - 悬停的学生对象
 */
function showRelationTooltip(element, student) {
    if (selectedStudentIndex === null) {
        showGlobalTooltip(element, `${student.name}\n请先选择一个学生查看关系`);
        return;
    }

    const selectedStudent = gameClass._getStudentByIndex(selectedStudentIndex);
    if (!selectedStudent) {
        return;
    }

    // 获取关系
    const relation = student.relation[selectedStudentIndex] || Relations.Normal;
    const relationName = getRelationName(relation);

    // 获取选中的学生对悬停学生的关系
    const reverseRelation = selectedStudent.relation[student.index] || Relations.Normal;
    const reverseRelationName = getRelationName(reverseRelation);

    // 构建tooltip文本
    let tooltipText = `${student.name}\n`;
    tooltipText += `对 ${selectedStudent.name} 的关系：${relationName}\n`;
    tooltipText += `${selectedStudent.name} 对 ${student.name} 的关系：${reverseRelationName}`;

    showGlobalTooltip(element, tooltipText);
}

/**
 * 显示状态模式下的悬停信息
 * @param {HTMLElement} element - 悬停的学生单元格元素
 * @param {Student} student - 悬停的学生对象
 */
function showStatusTooltip(element, student) {
    const statusName = getStatusName(student.status);
    
    let tooltipText = `${student.name}\n`;
    tooltipText += `状态：${statusName}\n`;
    tooltipText += `精力：${student.energy.toFixed(1)}/${STUDENT_ENERGY_MAX}\n`;
    tooltipText += `积极性：${student.enthusiasm.toFixed(1)}/${STUDENT_ENTHUSIASM_MAX}`;

    showGlobalTooltip(element, tooltipText);
}

/**
 * 显示竞赛模式下的悬停信息
 * @param {HTMLElement} element - 悬停的学生单元格元素
 * @param {Student} student - 悬停的学生对象
 */
function showCompetitionTooltip(element, student) {
    let tooltipText = `${student.name}\n`;
    
    if (student.competition !== null) {
        const compName = gameClass._getCompetitionName(student.competition);
        let stageInfo = '';
        if (student.competitionStage) {
            stageInfo = student.competitionStage === CompetitionStage.League ? '（联赛）' : '（省队）';
        }
        
        let awardInfo = '';
        if (student.competitionAward !== CompetitionAward.None) {
            const awardName = student.competitionAward === CompetitionAward.Gold ? '🥇金牌' : 
                            student.competitionAward === CompetitionAward.Silver ? '🥈银牌' : '🥉铜牌';
            awardInfo = ` - ${awardName}`;
        }
        
        tooltipText += `竞赛科目：${compName}${stageInfo}${awardInfo}`;
        
        if (student.inTraining) {
            const weeksLeft = student.trainingEndWeek - gameClass.week;
            tooltipText += `\n集训中（剩余${weeksLeft}周）`;
        }
        
        if (student.admittedEarly) {
            tooltipText += `\n已提前录取：${student.admittedEarly.name}`;
        }
    } else {
        tooltipText += `非竞赛生`;
    }

    showGlobalTooltip(element, tooltipText);
}

// ============================================================================
// UI 相关函数
// ============================================================================

function renderAll() {
    if (!gameClass) return;

    updateStatusBar();
    renderSeatingGrid();
    renderExamHistory();
    updateButtonStates();
    updateInfoPanel();
}

function updateStatusBar() {
    if (!gameClass) return;

    const updateWithEffect = (element, newValue, effectClass) => {
        const oldValue = parseInt(element.textContent) || 0;
        element.textContent = newValue;
        
        // 如果数值发生了变化，添加特效
        if (oldValue !== newValue) {
            // 移除旧的动画类
            element.classList.remove('value-increase', 'value-decrease');
            
            // 强制重排，让浏览器识别class的移除
            void element.offsetWidth;
            
            // 根据数值变化方向添加不同的动画类
            if (newValue > oldValue) {
                element.classList.add('value-increase');
            } else if (newValue < oldValue) {
                element.classList.add('value-decrease');
            }
            
            // 1.5秒后移除动画类
            setTimeout(() => {
                element.classList.remove('value-increase', 'value-decrease');
            }, 1500);
        }
    };

    weekDisplay.textContent = `${gameClass.week}/60`;
    
    // 显示角色信息
    if (gameClass.characterType && CharacterData[gameClass.characterType]) {
        characterDisplay.textContent = CharacterData[gameClass.characterType].name;
    } else {
        characterDisplay.textContent = '-';
    }
    
    nextExamDisplay.textContent = gameClass.getNextExamWeek();
    updateWithEffect(energyDisplay, Math.round(gameClass.teacher.energy));
    updateWithEffect(salaryDisplay, gameClass.teacher.salary);
    updateWithEffect(healthDisplay, gameClass.teacher.health);
}

function renderSeatingGrid() {
    if (!gameClass) return;

    seatingGrid.innerHTML = '';

    for (let col = 0; col < SEAT_COLUMNS; col++) {
        for (let row = 0; row < gameClass.seats[col].length; row++) {
            const student = gameClass.seats[col][row];

            const cell = document.createElement('div');
            cell.className = 'student-cell';

            // 跳过死亡的学生，视为空座位
            if (student === null || student.status === Status.Dead) {
                cell.classList.add('empty');
            } else {
                cell.classList.add(`mode-${viewMode}`);

                if (viewMode === 'normal') {
                    cell.classList.add(student.gender === Gender.Boy ? 'male' : 'female');
                } else if (viewMode === 'relation') {
                    if (selectedStudentIndex !== null) {
                        const rel = student.relation[selectedStudentIndex] || Relations.Normal;
                        cell.classList.add(`relation-${getRelationClass(rel)}`);
                    } else {
                        cell.classList.add('relation-normal');
                    }
                } else if (viewMode === 'status') {
                    cell.classList.add(`status-${getStatusClass(student.status)}`);
                } else if (viewMode === 'competition') {
                    // 竞赛模式：根据竞赛科目显示不同颜色
                    if (student.competition !== null) {
                        const competitionClass = getCompetitionClass(student.competition);
                        cell.classList.add(`competition-${competitionClass}`);
                    } else {
                        cell.classList.add('competition-none');
                    }
                }

                if (student.index === selectedStudentIndex) {
                    cell.classList.add('selected');
                }

                if (swapMode) {
                    if (student.index === swapFirstStudent) {
                        cell.classList.add('swap-source');
                    } else {
                        cell.classList.add('swap-target');
                        cell.style.cursor = 'pointer';
                    }
                }

                if (instigateMode) {
                    cell.classList.add('instigate-target');
                    cell.style.cursor = 'pointer';
                    if (student.index === selectedStudentIndex) {
                        cell.classList.add('instigate-source');
                    }
                }

                // 性别图标
                const genderIcon = document.createElement('div');
                genderIcon.className = `gender-icon ${student.gender === Gender.Boy ? 'male' : 'female'}`;
                genderIcon.textContent = student.gender === Gender.Boy ? '♂' : '♀';
                cell.appendChild(genderIcon);

                // 竞赛生标记已删除，现在通过竞赛模式显示

                // 天赋标签
                if (student.talents.length > 0) {
                    const talentsContainer = document.createElement('div');
                    talentsContainer.className = 'talents-container';
                    
                    for (let talent of student.talents) {
                        const talentInfo = TALENT_INFO[talent];
                        if (talentInfo) {
                            const talentTag = document.createElement('div');
                            talentTag.className = 'talent-tag';
                            talentTag.textContent = talentInfo.name;
                            talentTag.setAttribute('data-tooltip', talentInfo.description);
                            talentsContainer.appendChild(talentTag);
                        }
                    }
                    
                    cell.appendChild(talentsContainer);
                }

                const nameDiv = document.createElement('div');
                nameDiv.className = 'student-name';
                nameDiv.textContent = student.name;
                cell.appendChild(nameDiv);

                if (student.lastExamRank !== null) {
                    const rankBadge = document.createElement('div');
                    rankBadge.className = 'rank-badge';
                    const rankColor = student.lastExamRank <= 3 ? 'rank-gold' :
                                     student.lastExamRank <= 10 ? 'rank-silver' : 'rank-bronze';
                    rankBadge.classList.add(rankColor);
                    rankBadge.textContent = `#${student.lastExamRank}`;
                    cell.appendChild(rankBadge);
                }

                const totalAbility = Object.values(student.learnCap).reduce((a, b) => a + b, 0);
                const maxAbility = Object.keys(student.learnCap).length * LEARN_CAP_MAX;
                const abilityPercent = (totalAbility / maxAbility) * 100;

                // 能力值进度条和精力值进度条容器
                const barsContainer = document.createElement('div');
                barsContainer.className = 'bars-container';

                // 能力值进度条
                const abilityBarContainer = document.createElement('div');
                abilityBarContainer.className = 'bar-container';

                const abilityBar = document.createElement('div');
                abilityBar.className = 'bar ability-bar';
                abilityBar.style.width = `${abilityPercent}%`;
                abilityBarContainer.appendChild(abilityBar);

                barsContainer.appendChild(abilityBarContainer);

                // 精力值进度条
                const energyPercent = (student.energy / STUDENT_ENERGY_MAX) * 100;
                const energyBarContainer = document.createElement('div');
                energyBarContainer.className = 'bar-container';

                const energyBar = document.createElement('div');
                energyBar.className = 'bar energy-bar';
                energyBar.style.width = `${energyPercent}%`;
                energyBarContainer.appendChild(energyBar);

                barsContainer.appendChild(energyBarContainer);

                cell.appendChild(barsContainer);
            }

            // 设置点击事件（无论是否为空位置都可点击）
            cell.onclick = () => {
                const studentAtSeat = student || null;
                handleSeatClick(col + 1, row + 1, studentAtSeat);
            };

            // 设置鼠标悬停事件
            if (student) {
                cell.onmouseover = () => {
                    if (viewMode === 'relation') {
                        showRelationTooltip(cell, student);
                    } else if (viewMode === 'status') {
                        showStatusTooltip(cell, student);
                    } else if (viewMode === 'competition') {
                        showCompetitionTooltip(cell, student);
                    }
                };

                cell.onmouseout = () => {
                    hideGlobalTooltip();
                };
            }

            seatingGrid.appendChild(cell);
        }
    }
}

function updateInfoPanel() {
    if (!gameClass || selectedStudentIndex === null) {
        infoPanel.style.display = 'none';
        return;
    }

    const student = gameClass._getStudentByIndex(selectedStudentIndex);
    if (!student) {
        infoPanel.style.display = 'none';
        return;
    }

    infoPanel.style.display = 'block';
    infoPanel.innerHTML = '';

    infoPanel.innerHTML += `
        <div class="student-info">
            <div class="info-row"><strong>姓名：</strong>${student.name}</div>
            <div class="info-row"><strong>性别：</strong>${student.gender === Gender.Boy ? '男' : '女'}</div>
            <div class="info-row"><strong>状态：</strong>${getStatusName(student.status)}</div>
            <div class="info-row"><strong>精力：</strong>${student.energy.toFixed(1)}/${STUDENT_ENERGY_MAX}</div>
            <div class="info-row"><strong>积极性：</strong>${student.enthusiasm.toFixed(1)}/${STUDENT_ENTHUSIASM_MAX}</div>
            <div class="info-row"><strong>智商：</strong>${student.IQ}</div>
        </div>
    `;

    // 竞赛生信息（仅简单模式）
    if (gameClass.mode === GameMode.Easy && student.competition) {
        infoPanel.innerHTML += `<div class="student-info" style="margin-top: 10px;"><strong>竞赛信息：</strong></div>`;
        const compName = gameClass._getCompetitionName(student.competition);
        
        let stageInfo = '';
        if (student.competitionStage) {
            stageInfo = student.competitionStage === CompetitionStage.League ? '（联赛）' : '（省队）';
        }
        
        let awardInfo = '';
        if (student.competitionAward !== CompetitionAward.None) {
            const awardName = student.competitionAward === CompetitionAward.Gold ? '🥇金牌' : 
                            student.competitionAward === CompetitionAward.Silver ? '🥈银牌' : '🥉铜牌';
            awardInfo = ` - ${awardName}`;
        }
        
        let admittedInfo = '';
        if (student.admittedEarly) {
            admittedInfo = ` → ${student.admittedEarly.name}`;
        }
        
        infoPanel.innerHTML += `
            <div class="info-row" style="margin-left: 10px;">
                ${compName}竞赛生${stageInfo}${awardInfo}${admittedInfo}
            </div>
        `;
        
        if (student.inTraining) {
            const weeksLeft = student.trainingEndWeek - gameClass.week;
            infoPanel.innerHTML += `
                <div class="info-row" style="margin-left: 10px; color: #f39c12;">
                    🏋️ 集训中（剩余${weeksLeft}周）
                </div>
            `;
        }
    }

    // 天赋信息
    if (student.talents.length > 0) {
        infoPanel.innerHTML += `<div class="student-info" style="margin-top: 10px;"><strong>天赋：</strong></div>`;
        for (let talent of student.talents) {
            const talentInfo = TALENT_INFO[talent];
            if (talentInfo) {
                infoPanel.innerHTML += `
                    <div class="info-row" style="margin-left: 10px;">
                        <span class="talent-tag" data-talent="${talent}">${talentInfo.name}</span>
                    </div>
                `;
            }
        }
    }

    infoPanel.innerHTML += `<div class="student-info" style="margin-top: 10px;"><strong>学习能力：</strong></div>`;
    for (let [subject, cap] of Object.entries(student.learnCap)) {
        const subjectName = getSubjectName(parseInt(subject));
        infoPanel.innerHTML += `
            <div class="info-row" style="margin-left: 10px;">
                ${subjectName}: ${cap.toFixed(1)}
            </div>
        `;
    }

    infoPanel.innerHTML += `<div class="student-info" style="margin-top: 10px;"><strong>关系：</strong></div>`;
    const relations = [];
    for (let [otherIdx, rel] of Object.entries(student.relation)) {
        if (parseInt(otherIdx) !== student.index && rel !== Relations.Normal) {
            const otherStudent = gameClass._getStudentByIndex(parseInt(otherIdx));
            if (otherStudent && otherStudent.status !== Status.Dead) {
                relations.push({
                    name: otherStudent.name,
                    relation: rel
                });
            }
        }
    }

    if (relations.length === 0) {
        infoPanel.innerHTML += `<div class="info-row" style="margin-left: 10px;">无特殊关系</div>`;
    } else {
        for (let relInfo of relations) {
            infoPanel.innerHTML += `
                <div class="info-row" style="margin-left: 10px;">
                    ${relInfo.name}: ${getRelationName(relInfo.relation)}
                </div>
            `;
        }
    }
}

function getStatusName(status) {
    switch (status) {
        case Status.Normal:
            return '正常';
        case Status.Leave:
            return '请假';
        case Status.Train:
            return '集训';
        case Status.Dead:
            return '已劝退';
        default:
            return '未知';
    }
}

function getSubjectName(subject) {
    // subject可能是枚举键名（字符串，如"Chinese"）或枚举值（数字，如1）
    if (typeof subject === 'string') {
        // 如果是字符串，检查是否是Subject枚举的键
        switch (subject) {
            case 'Chinese':
                return '语文';
            case 'Maths':
                return '数学';
            case 'English':
                return '英语';
            case 'Physics':
                return '物理';
            case 'Chemistry':
                return '化学';
            case 'Biology':
                return '生物';
            case 'Politics':
                return '政治';
            case 'History':
                return '历史';
            case 'Geography':
                return '地理';
            default:
                console.warn('Unknown subject key:', subject);
                return '未知';
        }
    } else {
        // 如果是数字，使用枚举值
        const subjectValue = parseInt(subject);
        switch (subjectValue) {
            case Subject.Chinese:
                return '语文';
            case Subject.Maths:
                return '数学';
            case Subject.English:
                return '英语';
            case Subject.Physics:
                return '物理';
            case Subject.Chemistry:
                return '化学';
            case Subject.Biology:
                return '生物';
            case Subject.Politics:
                return '政治';
            case Subject.History:
                return '历史';
            case Subject.Geography:
                return '地理';
            default:
                console.warn('Unknown subject value:', subject, 'Type:', typeof subject);
                return '未知';
        }
    }
}

function getRelationName(rel) {
    switch (rel) {
        case Relations.Normal:
            return '普通';
        case Relations.Better:
            return '较好';
        case Relations.Friend:
            return '朋友';
        case Relations.Loving:
            return '恋人';
        case Relations.Disliking:
            return '不喜欢';
        case Relations.Hating:
            return '讨厌';
        case Relations.Self:
            return '自己';
        default:
            return '未知';
    }
}

function getRelationClass(rel) {
    switch (rel) {
        case Relations.Normal:
            return 'normal';
        case Relations.Better:
            return 'better';
        case Relations.Friend:
            return 'friend';
        case Relations.Loving:
            return 'loving';
        case Relations.Disliking:
            return 'disliking';
        case Relations.Hating:
            return 'hating';
        case Relations.Self:
            return 'self';
        default:
            return 'normal';
    }
}

function getStatusClass(status) {
    switch (status) {
        case Status.Normal:
            return 'normal';
        case Status.Leave:
            return 'leave';
        case Status.Train:
            return 'train';
        case Status.Dead:
            return 'dead';
        default:
            return 'normal';
    }
}

function getCompetitionClass(competition) {
    switch (competition) {
        case Competition.MO:
            return 'math';
        case Competition.PhO:
            return 'physics';
        case Competition.ChO:
            return 'chemistry';
        case Competition.BO:
            return 'biology';
        case Competition.OI:
            return 'informatics';
        default:
            return 'none';
    }
}

function updateButtonStates() {
    if (!gameClass) return;

    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        if (btn.disabled !== undefined) {
            btn.disabled = false;
        }
    });

    // 更新需要选中学生的按钮状态
    const hasSelectedStudent = selectedStudentIndex !== null;
    expelBtn.disabled = !hasSelectedStudent;
            counselBtn.disabled = !hasSelectedStudent;
            treatSingleBtn.disabled = !hasSelectedStudent;
            reformBtn.disabled = !hasSelectedStudent;
            sellBtn.disabled = !hasSelectedStudent;
            swapSeatsBtn.disabled = !hasSelectedStudent;    instigateBtn.disabled = !hasSelectedStudent;
}

// ============================================================================
// 班主任死亡检测函数
// ============================================================================

/**
 * 检查班主任血量，如果归零则结束游戏并显示结算画面
 * @param {Class} gameClass - 班级实例
 */
function checkTeacherDeath(gameClass) {
    if (gameClass.teacher.health <= 0) {
        gameClass.log("\n💀 班主任血量归零！游戏结束！", 'danger');
        gameClass.ended = true;
        gameClass.failReason = '班主任血量归零';
        // 显示结算画面
        setTimeout(() => {
            showEndGameScreen();
        }, 2000);
        return true;
    }
    return false;
}

// ============================================================================
// 班级类 - 核心游戏逻辑
// ============================================================================

class Class {
    constructor(mode = GameMode.Normal, classType = ClassType.Science, studentNum = 50, characterType = null) {
        this.mode = mode;
        this.classType = classType;
        this.studentNum = studentNum;
        this.characterType = characterType;
        this.ended = false;
        this.failReason = null;

        this.students = [];
        for (let i = 1; i <= studentNum; i++) {
            this.students.push(new Student(i, this, this.mode, this.classType));
        }

        // 为简单模式分配竞赛生（仅高二）
        if (this.mode === GameMode.Easy) {
            this._assignCompetitionStudents();
        }

        for (let s1 of this.students) {
            for (let s2 of this.students) {
                if (s1.index !== s2.index) {
                    s1.relation[s2.index] = Relations.Normal;
                    s2.relation[s1.index] = Relations.Normal;
                }
            }
        }

        // 应用角色特质：略微提升所有学生在角色所教科目的成绩
        if (characterType && CharacterData[characterType]) {
            const characterSubject = CharacterData[characterType].subject;
            const subjectName = this._getSubjectName(characterSubject);
            
            for (let student of this.students) {
                if (characterSubject in student.learnCap) {
                    // 略微提升角色所教科目的学习能力（提升10%）
                    student.learnCap[characterSubject] = Math.min(LEARN_CAP_MAX, student.learnCap[characterSubject] * 1.1);
                }
            }
        }

        this._initializeSeats();

        this.contests = {
            [ContestType.Mid]: [],
            [ContestType.End]: [],
            [ContestType.Final]: [TOTAL_SEMESTERS * SEMESTER_LENGTH]
        };

        for (let i = 0; i < TOTAL_SEMESTERS; i++) {
            this.contests[ContestType.Mid].push(i * SEMESTER_LENGTH + SEMESTER_LENGTH / 2);
            if (i < TOTAL_SEMESTERS - 1) {
                this.contests[ContestType.End].push((i + 1) * SEMESTER_LENGTH);
            }
        }

        this.contestsHistory = [];
        this.week = 0;
        this.studentAliveNum = this.studentNum;

        this.teacher = new Teacher(characterType);

        this.pendingLeaveRequests = [];
        this.activeLeaves = {};

        this.universityDatabase = getUniversityDatabase();
        this.gaokaoResults = [];

        this.firstExamAverage = null;

        this.logCallback = null;
    }

    setLogCallback(callback) {
        this.logCallback = callback;
    }

    log(message, type = 'normal') {
        if (this.logCallback) {
            this.logCallback(message, type);
        }
    }

    _initializeSeats() {
        // 根据学生人数计算需要的行列数
        const totalSeats = this.studentNum;
        const cols = SEAT_COLUMNS;
        const rows = Math.ceil(totalSeats / cols);

        this.seats = [];
        for (let i = 0; i < cols; i++) {
            this.seats.push(new Array(rows).fill(null));
        }

        // 随机安排活的学生
        const aliveStudents = this.students.filter(s => s.status !== Status.Dead);
        const shuffled = [...aliveStudents].sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < shuffled.length; i++) {
            const colIdx = i % cols;
            const rowIdx = Math.floor(i / cols);
            
            if (rowIdx < rows) {
                shuffled[i].seatCol = colIdx + 1;
                shuffled[i].seatRow = rowIdx + 1;
                this.seats[colIdx][rowIdx] = shuffled[i];
            }
        }
    }

    _recalculateSeats() {
        // 清空座位表
        for (let col = 0; col < this.seats.length; col++) {
            for (let row = 0; row < this.seats[col].length; row++) {
                this.seats[col][row] = null;
            }
        }

        // 根据所有学生的seatCol和seatRow重新构建座位表
        for (let student of this.students) {
            // 跳过死亡的学生
            if (student.status === Status.Dead) {
                continue;
            }

            // 检查座位是否在有效范围内
            const col = student.seatCol - 1;  // 转换为0-based索引
            const row = student.seatRow - 1;

            if (col >= 0 && col < this.seats.length && 
                row >= 0 && row < this.seats[col].length) {
                this.seats[col][row] = student;
            }
        }
    }

    _assignCompetitionStudents() {
        // 计算竞赛生数量（20%）
        const competitionStudentCount = Math.floor(this.studentNum * COMPETITION_STUDENT_RATIO);
        
        // 按IQ从高到低排序学生
        const sortedByIQ = [...this.students].sort((a, b) => b.IQ - a.IQ);
        
        // 选择前N名学生作为竞赛生
        const competitionStudents = sortedByIQ.slice(0, competitionStudentCount);
        
        // 为每个竞赛生分配竞赛科目（五科平均分配）
        const competitions = Object.values(Competition);
        const studentsPerCompetition = Math.floor(competitionStudentCount / competitions.length);
        
        let currentCompetitionIndex = 0;
        for (let student of competitionStudents) {
            student.competition = competitions[currentCompetitionIndex];
            currentCompetitionIndex = (currentCompetitionIndex + 1) % competitions.length;
        }
        
        this.log(`🏆 已分配 ${competitionStudentCount} 名竞赛生，分布在${competitions.length}个科目`, 'highlight');
    }

    _getStudentByIndex(index) {
        if (index >= 1 && index <= this.studentNum) {
            return this.students[index - 1];
        }
        return null;
    }

    _hasLover(student) {
        if (!student.relation) return false;
        for (let relation of Object.values(student.relation)) {
            if (relation === Relations.Loving) {
                return true;
            }
        }
        return false;
    }

    _hasBeenDeadBefore(student) {
        return student.hasBeenDead === true;
    }
    
    _checkTraining() {
        if (this.mode !== GameMode.Easy) return;
        
        for (let student of this.students) {
            // 检查集训是否结束
            if (student.inTraining && this.week >= student.trainingEndWeek) {
                student.inTraining = false;
                student.trainingEndWeek = null;
                student.status = Status.Normal;
                this.log(`🏋️ 学生 ${student.name} 集训结束，恢复正常状态！`, 'highlight');
            }
        }
    }
    
    _processCompetition() {
        if (this.mode !== GameMode.Easy) return;
        
        const weekCompetitions = COMPETITION_SCHEDULE[this.week];
        if (!weekCompetitions || weekCompetitions.length === 0) return;
        
        this.log(`\n🏆 第${this.week}周竞赛日！`, 'highlight');
        
        for (let compInfo of weekCompetitions) {
            const competition = compInfo.competition;
            const stage = compInfo.stage;
            
            // 找到参加该科目竞赛的学生
            const competitionStudents = this.students.filter(s => 
                s.competition === competition && s.status !== Status.Dead && 
                !(s.index in this.activeLeaves) && !s.admittedEarly
            );
            
            if (competitionStudents.length === 0) continue;
            
            const compName = this._getCompetitionName(competition);
            const stageName = stage === CompetitionStage.League ? '联赛' : '国赛';
            
            this.log(`   ${compName} ${stageName} - ${competitionStudents.length}人参赛`);
            
            for (let student of competitionStudents) {
                if (stage === CompetitionStage.League) {
                    // 联赛：40%进入省队（准备国赛）
                    if (Math.random() < COMPETITION_LEAGUE_TO_PROVINCIAL_RATE) {
                        this.log(`      ✨ ${student.name} 晋升省队！`, 'highlight');
                        student.competitionStage = CompetitionStage.National;
                    } else {
                        this.log(`      ${student.name} 未进入省队`);
                    }
                } else {
                    // 国赛：颁奖
                    const rand = Math.random();
                    if (rand < COMPETITION_NATIONAL_GOLD_RATE) {
                        student.competitionAward = CompetitionAward.Gold;
                        this._grantEarlyAdmission(student, CompetitionAward.Gold);
                        this.log(`      🥇 ${student.name} 获得${compName}国赛金牌！`, 'highlight');
                    } else if (rand < COMPETITION_NATIONAL_GOLD_RATE + COMPETITION_NATIONAL_SILVER_RATE) {
                        student.competitionAward = CompetitionAward.Silver;
                        this._grantEarlyAdmission(student, CompetitionAward.Silver);
                        this.log(`      🥈 ${student.name} 获得${compName}国赛银牌！`, 'highlight');
                    } else if (rand < COMPETITION_NATIONAL_GOLD_RATE + COMPETITION_NATIONAL_SILVER_RATE + COMPETITION_NATIONAL_BRONZE_RATE) {
                        student.competitionAward = CompetitionAward.Bronze;
                        this._grantEarlyAdmission(student, CompetitionAward.Bronze);
                        this.log(`      🥉 ${student.name} 获得${compName}国赛铜牌！`, 'highlight');
                    } else {
                        this.log(`      ${student.name} 未获奖`);
                    }
                }
            }
        }

        // 显示竞赛结果弹窗
        let resultMessage = '';
        let hasAnyResult = false;

        weekCompetitions.forEach(compInfo => {
            const competition = compInfo.competition;
            const stage = compInfo.stage;
            const competitionStudents = this.students.filter(s =>
                s.competition === competition && s.status !== Status.Dead &&
                !(s.index in this.activeLeaves) && !s.admittedEarly
            );

            if (competitionStudents.length > 0) {
                const compName = this._getCompetitionName(competition);
                const stageName = stage === CompetitionStage.League ? '联赛' : '国赛';

                if (stage === CompetitionStage.League) {
                    // 联赛：显示晋级的学生
                    const advancedStudents = competitionStudents.filter(s => s.competitionStage === CompetitionStage.National);
                    if (advancedStudents.length > 0) {
                        hasAnyResult = true;
                        const names = advancedStudents.map(s => s.name).join('、');
                        resultMessage += `${compName}${stageName}：${names} 晋级省队\n`;
                    }
                } else {
                    // 国赛：显示获奖的学生
                    const goldStudents = competitionStudents.filter(s => s.competitionAward === CompetitionAward.Gold);
                    const silverStudents = competitionStudents.filter(s => s.competitionAward === CompetitionAward.Silver);
                    const bronzeStudents = competitionStudents.filter(s => s.competitionAward === CompetitionAward.Bronze);

                    if (goldStudents.length > 0 || silverStudents.length > 0 || bronzeStudents.length > 0) {
                        hasAnyResult = true;
                        resultMessage += `${compName}${stageName}：\n`;
                        if (goldStudents.length > 0) {
                            resultMessage += `  🥇 ${goldStudents.map(s => s.name).join('、')}\n`;
                        }
                        if (silverStudents.length > 0) {
                            resultMessage += `  🥈 ${silverStudents.map(s => s.name).join('、')}\n`;
                        }
                        if (bronzeStudents.length > 0) {
                            resultMessage += `  🥉 ${bronzeStudents.map(s => s.name).join('、')}\n`;
                        }
                    }
                }
            }
        });

        // 只有当有人晋级或获奖时才显示弹窗
        if (hasAnyResult) {
            showExamResultModal('warning', `第${this.week}周竞赛结束`, resultMessage.trim());
        }
    }
    
    _getCompetitionName(competition) {
        switch (competition) {
            case Competition.MO: return '数学';
            case Competition.PhO: return '物理';
            case Competition.ChO: return '化学';
            case Competition.BO: return '生物';
            case Competition.OI: return '信息学';
            default: return '未知';
        }
    }

    _getSubjectName(subject) {
        switch (subject) {
            case Subject.Chinese: return '语文';
            case Subject.Maths: return '数学';
            case Subject.English: return '英语';
            case Subject.Physics: return '物理';
            case Subject.Chemistry: return '化学';
            case Subject.Biology: return '生物';
            case Subject.Politics: return '政治';
            case Subject.History: return '历史';
            case Subject.Geography: return '地理';
            default: return '未知';
        }
    }
    
    _grantEarlyAdmission(student, award) {
        let university;
        
        if (award === CompetitionAward.Gold) {
            // 金牌：清华北大
            const topUniversities = this.universityDatabase.filter(u => 
                u.tier === UniversityTier.TIER_985 && 
                (u.name.includes('清华') || u.name.includes('北大'))
            );
            if (topUniversities.length > 0) {
                university = topUniversities[Math.floor(Math.random() * topUniversities.length)];
            }
        } else if (award === CompetitionAward.Silver) {
            // 银牌：其他985
            const universities = this.universityDatabase.filter(u => 
                u.tier === UniversityTier.TIER_985 && 
                !(u.name.includes('清华') || u.name.includes('北大'))
            );
            if (universities.length > 0) {
                university = universities[Math.floor(Math.random() * universities.length)];
            }
        } else if (award === CompetitionAward.Bronze) {
            // 铜牌：211或双一流
            const universities = this.universityDatabase.filter(u => 
                u.tier === UniversityTier.TIER_211 || u.tier === UniversityTier.TIER_DOUBLE_FIRST
            );
            if (universities.length > 0) {
                university = universities[Math.floor(Math.random() * universities.length)];
            }
        }
        
        if (university) {
            student.admittedEarly = university;
            this.log(`      🎓 ${student.name} 被 ${university.name} 提前录取！`, 'highlight');
        }
    }
    
    _arrangeTraining() {
        if (this.mode !== GameMode.Easy) return;
        
        // 检查未来2周是否有竞赛
        const futureWeek = this.week + COMPETITION_TRAINING_WEEKS;
        const futureCompetitions = COMPETITION_SCHEDULE[futureWeek];
        
        if (!futureCompetitions || futureCompetitions.length === 0) return;
        
        for (let compInfo of futureCompetitions) {
            const competition = compInfo.competition;
            const stage = compInfo.stage;
            
            // 只为国赛安排集训
            if (stage !== CompetitionStage.National) continue;
            
            // 找到参加该科目竞赛且在省队的学生
            const competitionStudents = this.students.filter(s => 
                s.competition === competition && 
                s.competitionStage === CompetitionStage.National &&
                s.status === Status.Normal &&
                !s.inTraining &&
                !s.admittedEarly
            );
            
            for (let student of competitionStudents) {
                student.inTraining = true;
                student.trainingEndWeek = futureWeek;
                student.status = Status.Train;
                this.log(`🏋️ ${student.name} 从下周开始集训（${COMPETITION_TRAINING_WEEKS}周）`, 'warning');
            }
        }
    }

    _getSubjectScores() {
        if (this.classType === ClassType.Science) {
            return {
                [Subject.Chinese]: 150,
                [Subject.Maths]: 150,
                [Subject.English]: 150,
                [Subject.Physics]: 100,
                [Subject.Chemistry]: 100,
                [Subject.Biology]: 100
            };
        } else {
            return {
                [Subject.Chinese]: 150,
                [Subject.Maths]: 150,
                [Subject.English]: 150,
                [Subject.Politics]: 100,
                [Subject.History]: 100,
                [Subject.Geography]: 100
            };
        }
    }

    _calculateExamScore(student, subject, baseScore) {
        if (!(subject in student.learnCap)) {
            return 0.0;
        }

        // 天赋影响：填缺考标记 - 每次考试各科均有20%概率得0分
        if (student.talents.includes(Talent.FILL_MISSING_EXAM) && Math.random() < 0.2) {
            return 0.0;
        }

        // 天赋影响：忘填名字 - 每次考试每科均有5%概率得0分
        if (student.talents.includes(Talent.FORGET_NAME) && Math.random() < 0.05) {
            return 0.0;
        }

        const basePart = student.learnCap[subject] * baseScore / 100.0;

        const enthusiasmBonus = baseScore * SCORE_WEIGHT_ENTHUSIASM * (student.enthusiasm / STUDENT_ENTHUSIASM_MAX);

        const iqBonus = baseScore * SCORE_WEIGHT_IQ * (student.IQ / 100.0);

        const energyAdj = baseScore * SCORE_WEIGHT_ENERGY * ((student.energy - 50) / 50.0);

        const fluctuation = this._gaussRandom(0, baseScore * SCORE_FLUCTUATION_STD);

        let subjectScore = basePart + enthusiasmBonus + iqBonus + energyAdj + fluctuation;
        subjectScore = Math.max(0, Math.min(baseScore, subjectScore));
        
        // 天赋影响：千里眼 - 每次考试有一科30%概率多得20分，20%概率得0分
        // 这个效果在考试后单独处理，这里只是标记
        
        return subjectScore;
    }

    _gaussRandom(mean, stdDev) {
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return z0 * stdDev + mean;
    }

    _processExamResults(student, totalScore, studentScores, examResults, classTotalSum, aliveCount, isFirstExam = false) {
        const prevScore = student.previousScore;
        if (prevScore !== null) {
            const scoreDiff = totalScore - prevScore;
            const scoreDiffPercent = Math.abs(scoreDiff / prevScore * 100);
            
            if (scoreDiff > 0) {
                const improvementFactor = Math.min(1.0, scoreDiff / SCORE_DIFF_THRESHOLD);
                student.scoreChangeFactor = -Math.abs(improvementFactor * SCORE_IMPROVEMENT_FACTOR);
            } else {
                const declineFactor = Math.abs(scoreDiff) / SCORE_DIFF_THRESHOLD;
                student.scoreChangeFactor = declineFactor * SCORE_DECLINE_FACTOR;
                
                // 天赋影响：爆发 - 成绩降低超10%，则积极性增加20
                if (student.talents.includes(Talent.BURST) && scoreDiffPercent > 10) {
                    student.enthusiasm = Math.min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + 20);
                    this.log(`💥 学生 ${student.name} 爆发！积极性+20`, 'highlight');
                }
            }
        }

        student.previousScore = totalScore;

        if (isFirstExam && student.firstExamScore === null) {
            student.firstExamScore = totalScore;
        }

        examResults.push({
            studentIndex: student.index,
            name: student.name,
            totalScore: totalScore,
            iq: student.IQ,
            enthusiasm: student.enthusiasm,
            energy: student.energy,
            scores: this._subjectScoresToObject(studentScores)
        });

        classTotalSum += totalScore;
        aliveCount++;

        student.energy = Math.max(STUDENT_ENERGY_MIN, student.energy - STUDENT_ENERGY_EXAM_COST);

        return { classTotalSum, aliveCount };
    }

    _subjectScoresToObject(scores) {
        const result = {};
        for (let [subject, score] of Object.entries(scores)) {
            const subjectName = Object.keys(Subject).find(key => Subject[key] === parseInt(subject));
            if (subjectName) {
                result[subjectName] = Math.round(score);
            }
        }
        return result;
    }

    updateRelations() {
        for (let student1 of this.students) {
            if (student1.status === Status.Dead || student1.index in this.activeLeaves) {
                continue;
            }

            // 天赋影响：冷漠 - 与他人关系不会变化
            if (student1.talents.includes(Talent.INDIFFERENT)) {
                continue;
            }

            for (let student2 of this.students) {
                if (student1.index === student2.index) {
                    continue;
                }
                if (student2.status === Status.Dead || student2.index in this.activeLeaves) {
                    continue;
                }

                // 天赋影响：冷漠 - 不与他人交往
                if (student2.talents.includes(Talent.INDIFFERENT)) {
                    continue;
                }

                const currentRel = student1.relation[student2.index] || Relations.Normal;

                if (currentRel === Relations.Self) {
                    continue;
                }

                const charDiff = Math.abs(student1.character[0] - student2.character[0]) +
                                Math.abs(student1.character[1] - student2.character[1]);

                // 天赋影响：海王 - 大概率同时与多人恋爱
                let lovingProbDifferent = RELATION_LOVING_DIFFERENT_GENDER;
                let lovingProbSame = RELATION_LOVING_SAME_GENDER;
                
                if (student1.talents.includes(Talent.PLAYBOY) || student2.talents.includes(Talent.PLAYBOY)) {
                    lovingProbDifferent = 0.03;  // 大幅增加恋爱概率
                    lovingProbSame = 0.01;
                }

                if (charDiff < RELATION_IMPROVE_CHAR_DIFF) {
                    if (currentRel === Relations.Normal && Math.random() < RELATION_NORMAL_TO_BETTER) {
                        student1.relation[student2.index] = Relations.Better;
                        student2.relation[student1.index] = Relations.Better;
                    } else if (currentRel === Relations.Better && Math.random() < RELATION_BETTER_TO_FRIEND) {
                        student1.relation[student2.index] = Relations.Friend;
                        student2.relation[student1.index] = Relations.Friend;
                    }
                }

                // 天赋影响：热情 - 不会产生仇恨关系
                if (!(student1.talents.includes(Talent.ENTHUSIASTIC) || student2.talents.includes(Talent.ENTHUSIASTIC))) {
                    if (Math.random() < RELATION_RANDOM_HATING) {
                        student1.relation[student2.index] = Relations.Hating;
                        student2.relation[student1.index] = Relations.Hating;
                    }
                }

                // 检查两个学生是否都还没有恋人关系
                const hasLover1 = this._hasLover(student1);
                const hasLover2 = this._hasLover(student2);

                // 天赋影响：海王 - 恋人迅速变化
                if (student1.talents.includes(Talent.PLAYBOY) || student2.talents.includes(Talent.PLAYBOY)) {
                    if (currentRel === Relations.Loving && Math.random() < 0.1) {
                        // 恋人关系有10%概率变为普通
                        student1.relation[student2.index] = Relations.Normal;
                        student2.relation[student1.index] = Relations.Normal;
                    }
                }

                if (!hasLover1 && !hasLover2) {
                    if (student1.gender !== student2.gender && Math.random() < lovingProbDifferent) {
                        student1.relation[student2.index] = Relations.Loving;
                        student2.relation[student1.index] = Relations.Loving;
                    }

                    if (student1.gender === student2.gender && Math.random() < lovingProbSame) {
                        student1.relation[student2.index] = Relations.Loving;
                        student2.relation[student1.index] = Relations.Loving;
                    }
                }

                const neighbors = student1.getNeighbors();
                if (neighbors.includes(student2)) {
                    if (currentRel === Relations.Normal && Math.random() < RELATION_NEIGHBOR_FRIEND) {
                        const newRel = Math.random() < 0.5 ? Relations.Better : Relations.Friend;
                        student1.relation[student2.index] = newRel;
                        student2.relation[student1.index] = newRel;
                    } else if (currentRel === Relations.Normal && Math.random() < RELATION_NEIGHBOR_DISLIKE) {
                        // 天赋影响：热情 - 不会产生不满关系
                        if (!(student1.talents.includes(Talent.ENTHUSIASTIC) || student2.talents.includes(Talent.ENTHUSIASTIC))) {
                            student1.relation[student2.index] = Relations.Disliking;
                            student2.relation[student1.index] = Relations.Disliking;
                        }
                    }
                }
            }
        }
    }

    nextWeek() {
        // 检查是否有未处理请假
        if (this.pendingLeaveRequests.length > 0) {
            // 如果设置了自动处理，就自动处理
            if (leaveAutoHandle === 'approve') {
                // 自动同意所有请假
                const count = this.pendingLeaveRequests.length;
                for (let i = count - 1; i >= 0; i--) {
                    this.approveLeaveRequest(i, true);
                }
                this.log(`✅ 自动批准了 ${count} 个请假申请！`, 'highlight');
            } else if (leaveAutoHandle === 'reject') {
                // 自动拒绝所有请假
                const count = this.pendingLeaveRequests.length;
                for (let i = count - 1; i >= 0; i--) {
                    this.approveLeaveRequest(i, false);
                }
                this.log(`❌ 自动拒绝了 ${count} 个请假申请！`, 'warning');
            } else {
                // 手动处理模式，弹出处理界面
                this.log(`⛔ 无法进入下一周！有 ${this.pendingLeaveRequests.length} 个请假申请待处理！`, 'warning');
                return false;
            }
        }

        if (this.ended) {
            throw new Error("game is ended");
        }

        if (this.studentAliveNum === 0) {
            this.fail();
            return true;
        }

        this.week++;

        const weeksSinceLastSalary = this.week - this.teacher.lastSalaryWeek;
        if (weeksSinceLastSalary >= WEEKS_PER_MONTH) {
            let actualSalary = this.teacher.monthlySalary;
            
            // 只有魏教授（半步年级长）才不会因为学生死亡扣工资
            if (!this.teacher.noSalaryPenalty) {
                const deadStudents = this.students.filter(s => s.status === Status.Dead).length;
                const salaryPenalty = deadStudents * 300;  // 每死一个学生扣300
                actualSalary = Math.max(300, this.teacher.monthlySalary - salaryPenalty);  // 最低工资300
                
                if (salaryPenalty > 0) {
                    this.log(`💰 班主任获得月薪 ${actualSalary} RMB（因${deadStudents}名学生死亡，工资减少${salaryPenalty} RMB）`, 'warning');
                } else {
                    this.log(`💰 班主任获得月薪 ${this.teacher.monthlySalary} RMB！`, 'highlight');
                }
            } else {
                // 魏教授：学生死亡不扣工资
                const deadStudents = this.students.filter(s => s.status === Status.Dead).length;
                this.log(`💰 班主任获得月薪 ${actualSalary} RMB（魏教授特质：${deadStudents}名学生死亡未扣工资）`, 'highlight');
            }
            
            this.teacher.salary += actualSalary;
            this.teacher.lastSalaryWeek = this.week;
        }

        this.log(`\n📅 第${this.week}周开始`);
        this.log(`👨‍🏫 班主任工资：${this.teacher.salary}元 | 血量：${this.teacher.health} | 精力：${this.teacher.energy}`);
        this.log(`📝 待处理请假：${this.pendingLeaveRequests.length} | 正在请假：${Object.keys(this.activeLeaves).length}`);

        if (this.teacher.energy < TEACHER_ENERGY_WARNING) {
            this.teacher.health -= TEACHER_HEALTH_EXAM_COST;
            this.log(`⚠️ 班主任精力不足${TEACHER_ENERGY_WARNING}，血量-${TEACHER_HEALTH_EXAM_COST}！当前血量：${this.teacher.health}`, 'warning');
        }

        if (this.teacher.health <= 0) {
            this.log(`\n💀 班主任血量归零！游戏结束！`, 'danger');
            this.ended = true;
            this.failReason = '班主任血量归零';
            // 显示结算画面
            setTimeout(() => {
                showEndGameScreen();
            }, 2000);
            return true;
        }

        // 检查学生死亡率是否超过50%
        const deadRate = (this.students.filter(s => s.status === Status.Dead).length / this.students.length);
        if (deadRate > 0.5) {
            this.log(`\n💀 学生死亡率超过50%！游戏结束！`, 'danger');
            this.ended = true;
            this.failReason = '学生死亡率超过50%';
            // 显示结算画面
            setTimeout(() => {
                showEndGameScreen();
            }, 2000);
            return true;
        }

        this.teacher.recoverEnergy();
        this.log(`🔄 班主任精力恢复至 ${TEACHER_ENERGY_DEFAULT}`);

        // 检查是否有林黛玉天赋的学生，如果有则增加请假触发概率
        // 获取所有正常状态的学生
        const normalStudents = this.students.filter(s =>
            s.status === Status.Normal && !(s.index in this.activeLeaves));

        if (normalStudents.length > 0) {
            // ===== 处理林黛玉天赋学生的请假（独立逻辑，不影响其他学生） =====
            const linDaiyuStudents = normalStudents.filter(s => 
                s.talents.includes(Talent.LIN_DAIYU) && 
                !s.talents.includes(Talent.IRON_MAN)
            );
            
            // 林黛玉天赋的学生有60%的概率申请请假
            for (let linDaiyuStudent of linDaiyuStudents) {
                if (Math.random() < 0.6) {
                    const duration = Math.floor(Math.random() * (LEAVE_DURATION_MAX - LEAVE_DURATION_MIN + 1)) + LEAVE_DURATION_MIN;
                    const req = new LeaveRequest(linDaiyuStudent, duration);
                    req.requestedWeek = this.week;
                    this.pendingLeaveRequests.push(req);
                    this.log(`📝 学生 ${linDaiyuStudent.name} [林黛玉天赋] 申请请假 ${duration} 周！理由：${req.reason}（需本周处理）`, 'warning');
                }
            }
            
            // ===== 处理普通学生的请假（独立逻辑，不受林黛玉影响） =====
            const normalStudentsWithoutLinDaiyu = normalStudents.filter(s => 
                !s.talents.includes(Talent.LIN_DAIYU) && 
                !s.talents.includes(Talent.IRON_MAN)
            );
            
            if (normalStudentsWithoutLinDaiyu.length > 0 && Math.random() < LEAVE_REQUEST_PROB) {
                const numApplicants = Math.min(
                    LEAVE_REQUEST_MAX_STUDENTS,
                    normalStudentsWithoutLinDaiyu.length);

                const applicants = normalStudentsWithoutLinDaiyu
                    .sort(() => Math.random() - 0.5)
                    .slice(0, numApplicants);

                for (let student of applicants) {
                    const duration = Math.floor(Math.random() * (LEAVE_DURATION_MAX - LEAVE_DURATION_MIN + 1)) + LEAVE_DURATION_MIN;
                    const req = new LeaveRequest(student, duration);
                    req.requestedWeek = this.week;
                    this.pendingLeaveRequests.push(req);
                    this.log(`📝 学生 ${student.name} 申请请假 ${duration} 周！理由：${req.reason}（需本周处理）`, 'warning');
                }
            }
        }

        const expiredLeaves = [];
        for (let [idx, endWeek] of Object.entries(this.activeLeaves)) {
            if (this.week >= endWeek) {
                const student = this._getStudentByIndex(parseInt(idx));
                if (student && student.status === Status.Leave) {
                    student.status = Status.Normal;
                    student.leaveStartWeek = null;
                    student.leaveEndWeek = null;
                    expiredLeaves.push(parseInt(idx));
                    this.log(`✅ 学生 ${student.name} 请假结束，恢复正常状态！`, 'highlight');
                }
            }
        }

        for (let idx of expiredLeaves) {
            delete this.activeLeaves[idx];
        }

        for (let student of this.students) {
            if (student.status === Status.Dead) {
                continue;
            }

            if (student.index in this.activeLeaves) {
                student.enthusiasm = Math.max(STUDENT_ENTHUSIASM_MIN,
                    student.enthusiasm - STUDENT_ENTHUSIASM_DECAY_LEAVE);
            } else {
                student.updateWeekly();
            }
        }

        this.updateRelations();

        // 秦老师特质：每回合30%概率复活一个精力归0的学生
        if (this.teacher.reviveChance > 0 && Math.random() < this.teacher.reviveChance) {
            // 找到所有精力归零的学生
            const deadByEnergy = this.students.filter(s => s.status === Status.Dead && s.energy <= 0);
            
            if (deadByEnergy.length > 0) {
                // 随机选择一个学生复活
                const revivedStudent = deadByEnergy[Math.floor(Math.random() * deadByEnergy.length)];
                revivedStudent.status = Status.Normal;
                revivedStudent.energy = 70;
                this.studentAliveNum++;
                
                this.log(`✨ 秦老师使用【装糖阴他们一手】！学生 ${revivedStudent.name} 被复活，精力恢复至70！`, 'highlight');
                
                // 添加弹窗提示
                if (typeof showNotification === 'function') {
                    showNotification('success', '奇迹复活！', `秦老师使用【装糖阴他们一手】！学生 ${revivedStudent.name} 被复活，精力恢复至70！`);
                }
                
                // 重新计算座位表
                this._recalculateSeats();
            }
        }

        // 检查是否有学生因精力归零而死亡，如果有则重新计算座位表
        const currentAliveNum = this.students.filter(s => s.status !== Status.Dead).length;
        if (currentAliveNum !== this.studentAliveNum) {
            this.studentAliveNum = currentAliveNum;
            this._recalculateSeats();
        }

        // 检查集训状态
        this._checkTraining();
        
        // 安排集训（为未来2周的竞赛）
        this._arrangeTraining();
        
        // 处理竞赛
        this._processCompetition();

        // 触发随机事件（每5周2-3个）
        this.triggerRandomEvent();

        if (this.contests[ContestType.Mid].includes(this.week)) {
            this.contest(ContestType.Mid);
        } else if (this.contests[ContestType.End].includes(this.week)) {
            this.contest(ContestType.End);
        } else if (this.contests[ContestType.Final].includes(this.week)) {
            this.lastDitch();
        }

        if (this.week % SEMESTER_LENGTH === 1) {
            this.semesterStart();
        } else if (this.week % SEMESTER_LENGTH === 0) {
            this.semesterEnd();
        }

        return true;
    }

    contest(type) {
        this.log(`\n📝 第${this.week}周 - ${type === ContestType.Mid ? '期中' : type === ContestType.End ? '期末' : '最终'} 考试`);

        const SUBJECT_SCORES = this._getSubjectScores();
        const examResults = [];
        let classTotalSum = 0;
        let aliveStudentCount = 0;

        const isFirstExam = (this.contestsHistory.length === 0);

        for (let student of this.students) {
            if (student.status === Status.Dead || student.index in this.activeLeaves) {
                continue;
            }

            const studentScores = {};
            let totalScore = 0;

            for (let [subject, baseScore] of Object.entries(SUBJECT_SCORES)) {
                const subjectScore = this._calculateExamScore(student, parseInt(subject), baseScore);
                studentScores[subject] = subjectScore;
                totalScore += subjectScore;
            }

            // 天赋影响：千里眼 - 每次考试有一科30%概率多得20分，20%概率得0分
            if (student.talents.includes(Talent.CLAIRVOYANT) && Object.keys(studentScores).length > 0) {
                const subjects = Object.keys(studentScores);
                const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
                const randomChance = Math.random();
                
                if (randomChance < 0.3) {
                    // 30%概率多得20分
                    const oldScore = studentScores[randomSubject];
                    const newScore = Math.min(SUBJECT_SCORES[randomSubject], oldScore + 20);
                    studentScores[randomSubject] = newScore;
                    totalScore += (newScore - oldScore);
                } else if (randomChance < 0.5) {
                    // 20%概率得0分
                    const oldScore = studentScores[randomSubject];
                    studentScores[randomSubject] = 0;
                    totalScore -= oldScore;
                }
            }

            const result = this._processExamResults(
                student, totalScore, studentScores, examResults,
                classTotalSum, aliveStudentCount, isFirstExam);
            classTotalSum = result.classTotalSum;
            aliveStudentCount = result.aliveCount;
        }

        const avgScore = aliveStudentCount > 0 ? classTotalSum / aliveStudentCount : 0;

        if (isFirstExam && this.firstExamAverage === null) {
            this.firstExamAverage = avgScore;
            this.log(`\n📊 第一次考试平均分：${avgScore.toFixed(1)} (将作为结算基准)`, 'highlight');
        }

        examResults.sort((a, b) => b.totalScore - a.totalScore);

        examResults.forEach((result, index) => {
            const student = this._getStudentByIndex(result.studentIndex);
            if (student) {
                student.lastExamRank = index + 1;
            }
        });

        this.log(`📊 平均分：${avgScore.toFixed(1)} | 参与人数：${aliveStudentCount}`);

        this.contestsHistory.push({
            week: this.week,
            type: type,
            average: avgScore,
            details: examResults
        });

        // 显示考试结果弹窗（详细成绩）
        const examTypeName = type === ContestType.Mid ? '期中考试' : 
                            type === ContestType.End ? '期末考试' : '最终考试';
        
        // 生成详细成绩信息
        let detailMessage = `平均分：${avgScore.toFixed(1)} | 参与人数：${aliveStudentCount}\n\n`;
        
        // 显示前10名（或所有学生，如果少于10人）
        const displayCount = Math.min(10, examResults.length);
        for (let i = 0; i < displayCount; i++) {
            const result = examResults[i];
            const rank = i + 1;
            const rankBadge = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '  ';
            
            // 格式化各科成绩
            const subjectScores = [];
            for (let [subject, score] of Object.entries(result.scores)) {
                // subject是枚举键名（如"Chinese", "Maths"），不是值
                const subjectName = getSubjectName(subject);
                subjectScores.push(`${subjectName}:${Math.round(score)}`);
            }
            
            // 格式化排名和姓名（固定宽度）
            const rankStr = rank < 10 ? `#${rank} ` : `#${rank}`;
            const nameStr = result.name.padEnd(4, ' ');
            const totalStr = result.totalScore.toFixed(1).padStart(6, ' ');
            
            detailMessage += `${rankBadge} ${rankStr} ${nameStr} 总分:${totalStr}\n`;
            detailMessage += `      ${subjectScores.join(' ')}\n\n`;
        }
        
        if (examResults.length > 10) {
            detailMessage += `...（共${examResults.length}名学生）`;
        }
        
        showExamResultModal('success', `${examTypeName}结束`, detailMessage.trim());
    }

    semesterStart() {
        this.log(`📚 第${this.week}周 新学期开始`);
    }

    semesterEnd() {
        this.log(`📚 第${this.week}周 学期结束`);
    }

    fail() {
        this.log("💀 所有学生都死亡了！游戏结束。", 'danger');
        this.ended = true;
    }

    approveLeaveRequest(requestIndex, approved) {
        if (requestIndex < 0 || requestIndex >= this.pendingLeaveRequests.length) {
            return false;
        }

        const req = this.pendingLeaveRequests[requestIndex];
        const student = req.student;

        if (approved) {
            student.status = Status.Leave;
            const startWeek = this.week;
            const endWeek = startWeek + req.duration;
            this.activeLeaves[student.index] = endWeek;
            student.leaveStartWeek = startWeek;
            student.leaveEndWeek = endWeek;
            this.log(`✅ 批准学生 ${student.name} 请假 ${req.duration} 周！（至第 ${endWeek} 周）`, 'highlight');
        } else {
            student.energy = Math.max(STUDENT_ENERGY_MIN, student.energy - 15);
            this.log(`❌ 拒绝学生 ${student.name} 请假申请！学生精力 -15，当前精力：${student.energy.toFixed(1)}`, 'warning');
        }

        req.approved = approved;
        req.processed = true;
        this.pendingLeaveRequests.splice(requestIndex, 1);

        return true;
    }

    counselStudent(studentIndex) {
        const student = this._getStudentByIndex(studentIndex);
        if (!student || student.status === Status.Dead || student.index in this.activeLeaves) {
            return { success: false, message: "学生已死亡或正在请假，无法约谈！" };
        }

        if (this.teacher.energy < TEACHER_COUNSEL_ENERGY_COST) {
            return { success: false, message: "班主任精力不足 20，无法进行约谈！" };
        }

        this.teacher.energy -= TEACHER_COUNSEL_ENERGY_COST;
        this.log(`班主任精力-${TEACHER_COUNSEL_ENERGY_COST}，当前精力：${this.teacher.energy}`);

        const success = Math.random() < COUNSEL_SUCCESS_RATE;

        if (success) {
            student.enthusiasm = Math.min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + STUDENT_ENTHUSIASM_COUNSEL_GAIN);
            this.log(`✅ 约谈成功！${student.name} 积极性+${STUDENT_ENTHUSIASM_COUNSEL_GAIN}，当前积极性：${student.enthusiasm.toFixed(1)}`, 'highlight');
            return {
                success: true,
                message: `约谈成功！${student.name} 积极性提升！\n精力-${TEACHER_COUNSEL_ENERGY_COST}，积极性+${STUDENT_ENTHUSIASM_COUNSEL_GAIN}`
            };
        } else {
            this.teacher.health -= TEACHER_HEALTH_COUNSEL_FAIL;
            this.log(`❌ 约谈失败！${student.name} 不听劝告，还殴打了老师！班主任血量-${TEACHER_HEALTH_COUNSEL_FAIL}，当前血量：${this.teacher.health}`, 'danger');
            checkTeacherDeath(this);
            return {
                success: false,
                message: `约谈失败！${student.name} 殴打了老师！\n精力-${TEACHER_COUNSEL_ENERGY_COST}，血量-${TEACHER_HEALTH_COUNSEL_FAIL}`
            };
        }
    }

    reformStudent(studentIndex) {
        const student = this._getStudentByIndex(studentIndex);
        if (!student || student.status === Status.Dead) {
            return { success: false, message: "学生已死亡或不存在！" };
        }

        if (this.teacher.salary < TALENT_RESET_COST) {
            return { success: false, message: `资金不足！需要${TALENT_RESET_COST}元，当前工资：${this.teacher.salary}元` };
        }

        if (this.teacher.energy < TALENT_RESET_ENERGY) {
            return { success: false, message: `班主任精力不足！需要${TALENT_RESET_ENERGY}精力，当前精力：${this.teacher.energy}` };
        }

        this.teacher.salary -= TALENT_RESET_COST;
        this.teacher.energy -= TALENT_RESET_ENERGY;

        // 60%概率重置天赋成功
        if (Math.random() < TALENT_RESET_SUCCESS_RATE) {
            const oldTalents = student.talents.map(t => TALENT_INFO[t].name).join('、');
            student.resetTalents(true);  // 调教成功后必定有天赋
            const newTalents = student.talents.map(t => TALENT_INFO[t].name).join('、');
            
            this.log(`🎭 班主任调教 ${student.name} 成功！`, 'highlight');
            this.log(`  资金-${TALENT_RESET_COST}，精力-${TALENT_RESET_ENERGY}`, 'info');
            this.log(`  天赋重置成功！`, 'highlight');
            this.log(`  原天赋：${oldTalents || '无'}`, 'info');
            this.log(`  新天赋：${newTalents}`, 'info');
            
            return {
                success: true,
                message: `调教成功！\n资金-${TALENT_RESET_COST}元，精力-${TALENT_RESET_ENERGY}\n天赋已重置：${newTalents}`
            };
        } else {
            this.log(`🎭 班主任调教 ${student.name} 失败！`, 'danger');
            this.log(`  资金-${TALENT_RESET_COST}，精力-${TALENT_RESET_ENERGY}`, 'info');
            this.log(`  调教失败，天赋未改变`, 'warning');
            
            return {
                success: false,
                message: `调教失败！\n资金-${TALENT_RESET_COST}元，精力-${TALENT_RESET_ENERGY}\n天赋未改变`
            };
        }
    }

    organizeActivity(activityType = null) {
        if (this.teacher.energy < TEACHER_ACTIVITY_ENERGY_COST) {
            return { success: false, message: "班主任精力不足 60，无法组织活动！" };
        }

        this.teacher.energy -= TEACHER_ACTIVITY_ENERGY_COST;
        this.log(`班主任精力-${TEACHER_ACTIVITY_ENERGY_COST}，当前精力：${this.teacher.energy}`);

        if (!activityType) {
            const activityTypes = Object.values(ActivityType);
            activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
        }

        this.log(`\n🎪 组织${activityType}活动`, 'highlight');

        const aliveStudents = this.students.filter(s => s.status !== Status.Dead && !(s.index in this.activeLeaves));

        switch (activityType) {
            case ActivityType.SPORTS:
                this.log("🏃‍♂️ 运动会开始！学生们在操场上挥洒汗水...");
                let injuredCount = 0;
                for (let student of aliveStudents) {
                    const injured = Math.random() < 0.10;
                    if (injured) {
                        student.energy = Math.max(STUDENT_ENERGY_MIN, student.energy - 20);
                        student.enthusiasm = Math.max(STUDENT_ENTHUSIASM_MIN, student.enthusiasm - 10);
                        this.log(`  ⚠️ ${student.name} 受伤了！精力-20，积极性-10`, 'danger');
                        injuredCount++;
                    } else {
                        student.energy = Math.max(STUDENT_ENERGY_MIN, student.energy - 10);
                        student.enthusiasm = Math.min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + 3);
                    }
                }
                this.log(`效果：精力-10，积极性+3（${injuredCount}人受伤）`);
                return {
                    success: true,
                    message: `运动会举办成功！\n精力-${TEACHER_ACTIVITY_ENERGY_COST}\n学生精力-10，积极性+3（${injuredCount}人受伤）`
                };

            case ActivityType.MOVIE:
                this.log("🎬 观看电影！学生们看得津津有味...");
                for (let student of aliveStudents) {
                    student.energy = Math.min(STUDENT_ENERGY_MAX, student.energy + 1);
                    student.enthusiasm = Math.min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + 2);
                }
                this.log(`效果：精力+1，积极性+2`);
                return {
                    success: true,
                    message: `电影放映成功！\n精力-${TEACHER_ACTIVITY_ENERGY_COST}\n学生精力+1，积极性+2`
                };

            case ActivityType.FIELD_TRIP:
                this.log("🌸 春游踏青！学生们走进大自然...");
                for (let student of aliveStudents) {
                    student.energy = Math.min(STUDENT_ENERGY_MAX, student.energy + 2);
                    student.enthusiasm = Math.min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + 2);
                }
                this.log(`效果：精力+2，积极性+2`);
                return {
                    success: true,
                    message: `春游踏青成功！\n精力-${TEACHER_ACTIVITY_ENERGY_COST}\n学生精力+2，积极性+2`
                };

            case ActivityType.TALENT_SHOW:
                this.log("🎤 才艺展示！学生们展示各自的特长...");
                const shuffled = [...aliveStudents].sort(() => Math.random() - 0.5);
                shuffled.forEach((student, index) => {
                    if (index < 3) {
                        student.enthusiasm = Math.min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + 5);
                        student.energy = Math.min(STUDENT_ENERGY_MAX, student.energy + 1);
                        this.log(`  🏆 ${student.name} 表现优异！积极性+5，精力+1`, 'highlight');
                    } else {
                        student.enthusiasm = Math.min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + 1);
                    }
                });
                this.log(`效果：前三名积极性+5精力+1，其他积极性+1`);
                return { success: true, message: "才艺展示成功举办！" };

            case ActivityType.GROUP_STUDY:
                this.log("📚 集体自习！学生们一起学习，互相帮助...");
                let studyImprovedCount = 0;
                for (let student of aliveStudents) {
                    student.enthusiasm = Math.max(STUDENT_ENTHUSIASM_MIN, student.enthusiasm - 8);
                    if (Math.random() < 0.3) {
                        for (let subject of student.validSubjects) {
                            student.learnCap[subject] = Math.min(LEARN_CAP_MAX, student.learnCap[subject] + 0.5);
                        }
                        studyImprovedCount++;
                    }
                }
                this.log(`效果：积极性-8，${studyImprovedCount}人学习能力+0.5`);
                return { success: true, message: "集体自习结束！" };

            case ActivityType.PICNIC:
                this.log("🧺 野餐聚会！学生们享受美食，增进友谊...");
                let relationImproved = false;
                for (let student of aliveStudents) {
                    student.energy = Math.min(STUDENT_ENERGY_MAX, student.energy + 2);
                    student.enthusiasm = Math.min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + 3);
                }
                if (Math.random() < 0.05 && aliveStudents.length >= 2) {
                    const s1 = aliveStudents[Math.floor(Math.random() * aliveStudents.length)];
                    const s2 = aliveStudents[Math.floor(Math.random() * aliveStudents.length)];
                    if (s1.index !== s2.index) {
                        const currentRel = s1.relation[s2.index] || Relations.Normal;
                        if (currentRel === Relations.Normal) {
                            s1.relation[s2.index] = Relations.Better;
                            s2.relation[s1.index] = Relations.Better;
                            relationImproved = true;
                        }
                    }
                }
                this.log(`效果：精力+2，积极性+3${relationImproved ? '，1对关系提升' : ''}`);
                return { success: true, message: "野餐聚会成功！" };

            case ActivityType.GAME_NIGHT:
                this.log("🎮 游戏之夜！学生们玩得不亦乐乎...");
                for (let student of aliveStudents) {
                    student.energy = Math.min(STUDENT_ENERGY_MAX, student.energy + 1);
                    student.enthusiasm = Math.min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + 3);
                }
                this.log(`效果：精力+1，积极性+3`);
                return { success: true, message: "游戏之夜圆满结束！" };

            case ActivityType.VOLUNTEER:
                this.log("🤝 志愿服务！学生们帮助社区，收获成长...");
                let volunteerImprovedCount = 0;
                for (let student of aliveStudents) {
                    student.energy = Math.max(STUDENT_ENERGY_MIN, student.energy - 5);
                    student.enthusiasm = Math.min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + 2);
                    if (Math.random() < 0.2) {
                        const subjects = Object.keys(student.learnCap);
                        const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
                        student.learnCap[randomSubject] = Math.min(LEARN_CAP_MAX, student.learnCap[randomSubject] + 0.5);
                        volunteerImprovedCount++;
                    }
                }
                this.log(`效果：精力-5，积极性+2，${volunteerImprovedCount}人随机科目+0.5`);
                return { success: true, message: "志愿服务圆满完成！" };

            default:
                const success = Math.random() < ACTIVITY_SUCCESS_RATE;
                if (success) {
                    this.log("✅ 活动组织成功！", 'highlight');
                    for (let student of aliveStudents) {
                        student.enthusiasm = Math.min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + STUDENT_ENTHUSIASM_ACTIVITY_GAIN);
                        student.energy = Math.max(STUDENT_ENERGY_MIN, student.energy - STUDENT_ENERGY_ACTIVITY_COST);
                    }
                    this.log(`正常状态学生积极性+${STUDENT_ENTHUSIASM_ACTIVITY_GAIN}，精力-${STUDENT_ENERGY_ACTIVITY_COST}`);
                    return { success: true, message: "活动组织成功！" };
                } else {
                    this.log("❌ 活动组织失败！", 'danger');
                    for (let student of aliveStudents) {
                        student.enthusiasm = Math.max(STUDENT_ENTHUSIASM_MIN, student.enthusiasm - STUDENT_ENTHUSIASM_ACTIVITY_LOSS);
                        student.energy = Math.max(STUDENT_ENERGY_MIN, student.energy - STUDENT_ENERGY_ACTIVITY_COST);
                    }
                    this.log(`正常状态学生积极性-${STUDENT_ENTHUSIASM_ACTIVITY_LOSS}，精力-${STUDENT_ENERGY_ACTIVITY_COST}`);
                    return { success: false, message: "活动组织失败！" };
                }
        }
    }

    holdClassMeeting(meetingType = null) {
        if (this.teacher.energy < TEACHER_CLASS_MEETING_ENERGY_COST) {
            return { success: false, message: "班主任精力不足40，无法召开班会！" };
        }

        if (this.teacher.salary < TEACHER_CLASS_MEETING_COST) {
            return { success: false, message: `资金不足！需要${TEACHER_CLASS_MEETING_COST}元，当前工资：${this.teacher.salary}元` };
        }

        this.teacher.energy -= TEACHER_CLASS_MEETING_ENERGY_COST;
        this.teacher.salary -= TEACHER_CLASS_MEETING_COST;

        if (!meetingType) {
            const meetingTypes = Object.values(ClassMeetingType);
            meetingType = meetingTypes[Math.floor(Math.random() * meetingTypes.length)];
        }

        this.log(`\n📢 召开班会：${meetingType}`, 'highlight');

        const aliveStudents = this.students.filter(s =>
            s.status !== Status.Dead && !(s.index in this.activeLeaves));

        if (meetingType === ClassMeetingType.CHICKEN_SOUP) {
            this.log("🍲 班主任端出一碗热气腾腾的鸡汤...");
            for (let student of aliveStudents) {
                student.enthusiasm = Math.min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + 5);
            }
            this.log("效果：全员积极性+5");
            return {
                success: true,
                message: `鸡汤班会召开成功！\n精力-${TEACHER_CLASS_MEETING_ENERGY_COST}，资金-${TEACHER_CLASS_MEETING_COST}元\n全员积极性+5`
            };

        } else if (meetingType === ClassMeetingType.THREAT) {
            this.log("😠 班主任严厉地威胁学生...");
            for (let student of aliveStudents) {
                student.enthusiasm = Math.min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + 8);
                student.energy = Math.max(STUDENT_ENERGY_MIN, student.energy - 5);
            }
            this.log("效果：全员积极性+8，精力-5");
            return {
                success: true,
                message: `恐吓班会召开成功！\n精力-${TEACHER_CLASS_MEETING_ENERGY_COST}，资金-${TEACHER_CLASS_MEETING_COST}元\n全员积极性+8，精力-5`
            };

        } else if (meetingType === ClassMeetingType.AWARD) {
            this.log("🏆 班主任表彰优秀学生...");
            const topStudents = [...aliveStudents]
                .sort((a, b) => (b.previousScore || 0) - (a.previousScore || 0))
                .slice(0, 5);
            for (let student of topStudents) {
                student.enthusiasm = Math.min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + 10);
                this.log(`  🎖️ ${student.name} 积极性+10`, 'highlight');
            }
            this.log("效果：前5名学生积极性+10");
            return { success: true, message: "表彰班会召开成功！" };

        } else if (meetingType === ClassMeetingType.FREE) {
            this.log("🎲 班主任让学生自由讨论...");
            for (let student of aliveStudents) {
                student.enthusiasm = Math.min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + 3);
                student.energy = Math.min(STUDENT_ENERGY_MAX, student.energy + 2);
            }
            this.log("效果：全员积极性+3，精力+2");
            return { success: true, message: "自由班会召开成功！" };

        } else if (meetingType === ClassMeetingType.COMPLAINT) {
            this.log("💬 班主任组织吐槽大会...");
            for (let student of aliveStudents) {
                student.enthusiasm = Math.min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + 4);
                student.energy = Math.min(STUDENT_ENERGY_MAX, student.energy + 1);
            }
            this.log("效果：全员积极性+4，精力+1");
            return { success: true, message: "吐槽大会召开成功！" };

        } else if (meetingType === ClassMeetingType.SURPRISE) {
            this.log("🎁 班主任准备了一个惊喜班会...");
            for (let student of aliveStudents) {
                student.enthusiasm = Math.min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + 7);
            }
            this.log("效果：全员积极性+7");
            return { success: true, message: "惊喜班会召开成功！" };

        } else {
            this.log("✅ 班会召开成功！", 'highlight');
            for (let student of aliveStudents) {
                student.enthusiasm = Math.min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + 5);
            }
            this.log("效果：全员积极性+5");
            return { success: true, message: "班会召开成功！" };
        }
    }

    expelStudent(studentIndex) {
        const student = this._getStudentByIndex(studentIndex);
        if (!student || student.status === Status.Dead) {
            return { success: false, message: "学生不存在或已劝退！" };
        }

        // 天赋影响：弹反 - 无法被劝退；当被劝退时殴打班主任，扣除班主任7点血量
        if (student.talents.includes(Talent.PARRY)) {
            this.teacher.health = Math.max(0, this.teacher.health - 7);
            this.log(`🛡️ 学生 ${student.name} 发动弹反！殴打班主任！`, 'danger');
            this.log(`班主任血量 -7，当前血量：${this.teacher.health}`, 'warning');

            if (checkTeacherDeath(this)) {
                return { success: false, message: "劝退失败，学生弹反导致班主任死亡！" };
            }

            return { success: false, message: `劝退失败！${student.name} 发动弹反殴打了老师！\n班主任血量-7` };
        }

        // 50%概率学生拒绝被劝退
        if (Math.random() < 0.5) {
            this.teacher.health -= 2;
            this.log(`💢 学生 ${student.name} 拒绝被劝退，反而殴打了班主任！`, 'danger');
            this.log(`班主任血量 -2，当前血量：${this.teacher.health}`, 'warning');

            if (checkTeacherDeath(this)) {
                return { success: false, message: "劝退失败，班主任被殴打致死！" };
            }

            return { success: false, message: `劝退失败！${student.name} 拒绝被劝退并殴打了老师！\n班主任血量-2` };
        }

        // 学生接受劝退
        student.status = Status.Dead;
        this.studentAliveNum--;

        this._recalculateSeats();

        if (student.index in this.activeLeaves) {
            delete this.activeLeaves[student.index];
        }

        this.log(`🚫 学生 ${student.name} 被成功劝退！`, 'highlight');
        return { success: true, message: `学生 ${student.name} 被成功劝退！` };
    }

    sellStudent(studentIndex) {
        const student = this._getStudentByIndex(studentIndex);
        if (!student || student.status === Status.Dead) {
            return { success: false, message: "学生不存在或已死亡！" };
        }

        if (this.teacher.energy < 40) {
            return { success: false, message: "班主任精力不足40，无法进行贩卖！" };
        }

        this.teacher.energy -= 40;

        // 60%概率贩卖成功
        if (Math.random() < 0.6) {
            // 计算获得的金钱
            let moneyEarned = 1500;
            
            // 如果学生有传奇机长天赋，总共只获得200元
            if (student.talents.includes(Talent.LEGENDARY_CAPTAIN)) {
                moneyEarned = 200;
            }

            this.teacher.salary += moneyEarned;
            
            // 学生死亡
            student.status = Status.Dead;
            this.studentAliveNum--;

            this._recalculateSeats();

            if (student.index in this.activeLeaves) {
                delete this.activeLeaves[student.index];
            }

            this.log(`💰 学生 ${student.name} 已变成內阁，卖出了${moneyEarned}金钱！`, 'highlight');
            this.log(`班主任精力-40，工资+${moneyEarned}`, 'info');
            
            return {
                success: true,
                message: `贩卖成功！\n学生 ${student.name} 已变成內阁\n精力-40，工资+${moneyEarned}`
            };
        } else {
            // 40%概率贩卖失败，学生殴打班主任
            this.teacher.health -= 7;
            this.log(`💢 贩卖失败！学生 ${student.name} 殴打了班主任！班主任血量-7，当前血量：${this.teacher.health}`, 'danger');

            if (checkTeacherDeath(this)) {
                return { success: false, message: "贩卖失败，班主任被殴打致死！" };
            }

            return {
                success: false,
                message: `贩卖失败！学生 ${student.name} 殴打了老师！\n精力-40，血量-7`
            };
        }
    }

    swapSeats(pos1Col, pos1Row, pos2Col, pos2Row) {
        // 检查坐标是否有效
        if (pos1Col < 1 || pos1Col > SEAT_COLUMNS ||
            pos1Row < 1 || pos1Row > this.seats[pos1Col - 1].length ||
            pos2Col < 1 || pos2Col > SEAT_COLUMNS ||
            pos2Row < 1 || pos2Row > this.seats[pos2Col - 1].length) {
            return { success: false, message: "座位坐标无效！" };
        }

        const s1 = this.seats[pos1Col - 1][pos1Row - 1];
        const s2 = this.seats[pos2Col - 1][pos2Row - 1];

        // 交换座位
        this.seats[pos1Col - 1][pos1Row - 1] = s2;
        this.seats[pos2Col - 1][pos2Row - 1] = s1;

        // 更新学生的座位信息
        if (s1) {
            s1.seatCol = pos2Col;
            s1.seatRow = pos2Row;
        }
        if (s2) {
            s2.seatCol = pos1Col;
            s2.seatRow = pos1Row;
        }

        // 生成日志消息
        if (s1 && s2) {
            this.log(`🔄 学生 ${s1.name} 和 ${s2.name} 交换座位！`, 'highlight');
            return { success: true, message: `学生 ${s1.name} 和 ${s2.name} 交换座位成功！` };
        } else if (s1) {
            this.log(`🔄 学生 ${s1.name} 移动到座位 (${pos2Col},${pos2Row})`, 'highlight');
            return { success: true, message: `学生 ${s1.name} 移动成功！` };
        } else if (s2) {
            this.log(`🔄 学生 ${s2.name} 移动到座位 (${pos1Col},${pos1Row})`, 'highlight');
            return { success: true, message: `学生 ${s2.name} 移动成功！` };
        } else {
            return { success: true, message: "空座位交换成功！" };
        }
    }

    randomizeSeats() {
        const aliveStudents = this.students.filter(s => s.status !== Status.Dead);
        const shuffled = [...aliveStudents].sort(() => Math.random() - 0.5);

        for (let i = 0; i < shuffled.length; i++) {
            const colIdx = i % SEAT_COLUMNS;
            const rowIdx = Math.floor(i / SEAT_COLUMNS);

            shuffled[i].seatCol = colIdx + 1;
            shuffled[i].seatRow = rowIdx + 1;
        }

        this._recalculateSeats();
        this.log(`🎲 座位随机重排！`, 'highlight');
        return { success: true, message: "座位随机重排成功！" };
    }

    treatStudent(studentIndex) {
        const student = this._getStudentByIndex(studentIndex);
        if (!student || student.status === Status.Dead || student.index in this.activeLeaves) {
            return { success: false, message: "学生已死亡或正在请假，无法请吃饭！" };
        }

        if (this.teacher.salary < TEACHER_TREAT_SINGLE_COST) {
            return { success: false, message: `资金不足！需要${TEACHER_TREAT_SINGLE_COST}元，当前工资：${this.teacher.salary}元` };
        }

        if (this.teacher.energy < TEACHER_TREAT_SINGLE_ENERGY_COST) {
            return { success: false, message: "班主任精力不足30，无法请学生吃饭！" };
        }

        this.teacher.salary -= TEACHER_TREAT_SINGLE_COST;
        this.teacher.energy -= TEACHER_TREAT_SINGLE_ENERGY_COST;

        student.energy = Math.min(STUDENT_ENERGY_MAX, student.energy + STUDENT_ENERGY_TREAT_SINGLE);
        student.enthusiasm = Math.min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + 5);

        this.log(`🍽️ 班主任请 ${student.name} 吃饭！资金-${TEACHER_TREAT_SINGLE_COST}，精力-${TEACHER_TREAT_SINGLE_ENERGY_COST}`, 'highlight');
        this.log(`学生 ${student.name} 精力+${STUDENT_ENERGY_TREAT_SINGLE}，积极性+5`, 'highlight');

        return {
            success: true,
            message: `请 ${student.name} 吃饭成功！\n资金-${TEACHER_TREAT_SINGLE_COST}元，精力-${TEACHER_TREAT_SINGLE_ENERGY_COST}\n学生精力+${STUDENT_ENERGY_TREAT_SINGLE}，积极性+5`
        };
    }

    treatAllStudents() {
        if (this.teacher.salary < TEACHER_TREAT_CLASS_COST) {
            return { success: false, message: `资金不足！需要${TEACHER_TREAT_CLASS_COST}元，当前工资：${this.teacher.salary}元` };
        }

        if (this.teacher.energy < TEACHER_TREAT_CLASS_ENERGY_COST) {
            return { success: false, message: "班主任精力不足40，无法请全班吃饭！" };
        }

        const aliveStudents = this.students.filter(s => s.status !== Status.Dead && !(s.index in this.activeLeaves));

        this.teacher.salary -= TEACHER_TREAT_CLASS_COST;
        this.teacher.energy -= TEACHER_TREAT_CLASS_ENERGY_COST;

        for (let student of aliveStudents) {
            student.energy = Math.min(STUDENT_ENERGY_MAX, student.energy + STUDENT_ENERGY_TREAT_CLASS);
            student.enthusiasm = Math.min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + 3);
        }

        this.log(`🍽️ 班主任请全班吃饭！资金-${TEACHER_TREAT_CLASS_COST}，精力-${TEACHER_TREAT_CLASS_ENERGY_COST}`, 'highlight');
        this.log(`全班学生精力+${STUDENT_ENERGY_TREAT_CLASS}，积极性+3`, 'highlight');

        return {
            success: true,
            message: `请全班吃饭成功！${aliveStudents.length}名学生受益。\n资金-${TEACHER_TREAT_CLASS_COST}元，精力-${TEACHER_TREAT_CLASS_ENERGY_COST}\n学生精力+${STUDENT_ENERGY_TREAT_CLASS}，积极性+3`
        };
    }

    instigate(student1Index, student2Index) {
        const s1 = this._getStudentByIndex(student1Index);
        const s2 = this._getStudentByIndex(student2Index);

        if (!s1 || !s2) {
            return { success: false, message: "学生编号无效！" };
        }

        if (s1.status === Status.Dead || s2.status === Status.Dead) {
            return { success: false, message: "不能与已劝退的学生进行挑拨！" };
        }

        const currentRel = s1.relation[s2.index] || Relations.Normal;

        const success = Math.random() < RELATION_INSTIGATE_SUCCESS;

        if (success) {
            s1.relation[s2.index] = Relations.Hating;
            s2.relation[s1.index] = Relations.Hating;

            // 如果是恋人关系被挑拨，被发现的概率更高
            if (currentRel === Relations.Loving) {
                this.log(`💔 ${s1.name} 和 ${s2.name} 的恋人关系被挑拨成功！`, 'highlight');
                // 恋人关系挑拨失败，被殴打的概率增加到80%
                if (Math.random() < 0.8) {
                    const damage = s1.gender === Gender.Boy ? TEACHER_HEALTH_INSTIGATE_BOY : TEACHER_HEALTH_INSTIGATE_LOVING;
                    this.teacher.health -= damage;
                    this.log(`💢 挑拨恋人关系被发现！班主任被愤怒的恋人殴打了，血量-${damage}，当前血量：${this.teacher.health}`, 'danger');

                    if (checkTeacherDeath(this)) {
                        return { success: false, message: "挑拨恋人关系失败，班主任被殴打致死！" };
                    }
                }
            } else {
                // 普通关系挑拨失败，被殴打的概率是50%
                if (Math.random() < 0.5) {
                    const damage = s1.gender === Gender.Boy ? TEACHER_HEALTH_INSTIGATE_BOY : TEACHER_HEALTH_INSTIGATE_LOVING;
                    this.teacher.health -= damage;
                    this.log(`💢 挑拨被发现！班主任被殴打了，血量-${damage}，当前血量：${this.teacher.health}`, 'danger');

                    if (checkTeacherDeath(this)) {
                        return { success: false, message: "挑拨失败，班主任被殴打致死！" };
                    }
                }
            }

            this.log(`💢 成功挑拨 ${s1.name} 和 ${s2.name} 的关系！`, 'highlight');
            return { success: true, message: `成功挑拨 ${s1.name} 和 ${s2.name} 的关系！` };
        } else {
            const damage = s1.gender === Gender.Boy ? TEACHER_HEALTH_INSTIGATE_BOY : TEACHER_HEALTH_INSTIGATE_LOVING;
            this.teacher.health -= damage;
            
            if (currentRel === Relations.Loving) {
                this.log(`💢 挑拨恋人关系失败！班主任被愤怒的恋人殴打了，血量-${damage}，当前血量：${this.teacher.health}`, 'danger');
            } else {
                this.log(`💢 挑拨失败！班主任被殴打了，血量-${damage}，当前血量：${this.teacher.health}`, 'danger');
            }

            if (checkTeacherDeath(this)) {
                return { success: false, message: "挑拨失败，班主任被殴打致死！" };
            }

            return { success: false, message: "挑拨失败！" };
        }
    }

    buyMedicine() {
        if (this.teacher.salary < TEACHER_MEDICINE_COST) {
            return { success: false, message: `资金不足！需要${TEACHER_MEDICINE_COST}元，当前工资：${this.teacher.salary}元` };
        }

        this.teacher.salary -= TEACHER_MEDICINE_COST;
        this.teacher.health = Math.min(TEACHER_HEALTH_MAX, this.teacher.health + TEACHER_MEDICINE_HEAL);

        this.log(`💊 购买药品成功！资金-${TEACHER_MEDICINE_COST}，血量+${TEACHER_MEDICINE_HEAL}，当前血量：${this.teacher.health}`, 'highlight');
        return {
            success: true,
            message: `购买药品成功！\n资金-${TEACHER_MEDICINE_COST}元，血量+${TEACHER_MEDICINE_HEAL}`
        };
    }

    // 随机事件系统
    triggerRandomEvent() {
        // 获取考试周列表
        const examWeeks = [
            ...this.contests[ContestType.Mid],
            ...this.contests[ContestType.End]
        ];
        
        // 每4周出现2-3个随机事件（改为4周，避免与考试周冲突）
        if (this.week % 4 !== 0) return;
        if (examWeeks.includes(this.week)) return;  // 跳过考试周
        
        // 检查是否有存活的学生
        const aliveStudents = this.students.filter(s => s.status !== Status.Dead);
        if (aliveStudents.length === 0) return;
        
        // 随机选择2-3个事件
        const eventCount = Math.floor(Math.random() * 2) + 2;  // 2-3个事件
        const availableEvents = [...RANDOM_EVENTS];
        const selectedEvents = [];
        
        for (let i = 0; i < eventCount && availableEvents.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availableEvents.length);
            selectedEvents.push(availableEvents.splice(randomIndex, 1)[0]);
        }
        
        // 触发选中的事件
        for (let event of selectedEvents) {
            this._processEvent(event);
        }
    }
    
    // 在控制台触发特定事件（用于测试）
    triggerSpecificEvent(eventId) {
        const event = RANDOM_EVENTS.find(e => e.id === eventId);
        if (event) {
            this.log(`🧪 [调试] 触发事件 #${eventId}: ${event.template}`, 'info');
            this._processEvent(event);
        } else {
            console.error(`事件ID ${eventId} 不存在`);
        }
    }
    
    _processEvent(event) {
        // 替换模板中的占位符并获取选中的学生索引
        const result = this._replaceEventPlaceholders(event);
        
        if (event.type === RandomEventType.CONFIRM) {
            // 确认事件：显示一个确认按钮
            this._showConfirmEvent(event, result.message, result.studentIndex1, result.studentIndex2, result.subject1, result.subject2);
        } else if (event.type === RandomEventType.CHOICE) {
            // 选择事件：显示多个选项按钮
            this._showChoiceEvent(event, result.message, result.studentIndex1, result.studentIndex2, result.subject1, result.subject2);
        }
    }
    
    _replaceEventPlaceholders(event) {
        let message = event.template;
        let studentIndex1 = null;
        let studentIndex2 = null;
        let subject1 = null;
        let subject2 = null;
        
        // 替换 {student}
        if (message.includes('{student}')) {
            const aliveStudents = this.students.filter(s => s.status !== Status.Dead);
            if (aliveStudents.length > 0) {
                const randomStudent = aliveStudents[Math.floor(Math.random() * aliveStudents.length)];
                studentIndex1 = randomStudent.index;
                message = message.replace(/{student}/g, randomStudent.name);
            }
        }
        
        // 替换 {target}（另一个学生）
        if (message.includes('{target}')) {
            const aliveStudents = this.students.filter(s => s.status !== Status.Dead);
            if (aliveStudents.length > 0) {
                const targetStudent = aliveStudents[Math.floor(Math.random() * aliveStudents.length)];
                studentIndex2 = targetStudent.index;
                message = message.replace(/{target}/g, targetStudent.name);
            }
        }
        
        // 替换 {subject} 或 {subject1} 或 {subject2}
        const allSubjects = Object.values(Subject);
        const subjectNameMap = {
            Chinese: '语文',
            Maths: '数学',
            English: '英语',
            Physics: '物理',
            Chemistry: '化学',
            Biology: '生物',
            Politics: '政治',
            History: '历史',
            Geography: '地理'
        };
        
        if (message.includes('{subject}')) {
            const subjectValue = allSubjects[Math.floor(Math.random() * allSubjects.length)];
            const subjectKey = Object.keys(Subject).find(key => Subject[key] === subjectValue) || subjectValue;
            subject1 = subjectNameMap[subjectKey] || subjectKey;
            message = message.replace(/{subject}/g, subject1);
        }
        if (message.includes('{subject1}')) {
            const subjectValue = allSubjects[Math.floor(Math.random() * allSubjects.length)];
            const subjectKey = Object.keys(Subject).find(key => Subject[key] === subjectValue) || subjectValue;
            subject1 = subjectNameMap[subjectKey] || subjectKey;
            message = message.replace(/{subject1}/g, subject1);
        }
        if (message.includes('{subject2}')) {
            const subjectValue = allSubjects[Math.floor(Math.random() * allSubjects.length)];
            const subjectKey = Object.keys(Subject).find(key => Subject[key] === subjectValue) || subjectValue;
            subject2 = subjectNameMap[subjectKey] || subjectKey;
            message = message.replace(/{subject2}/g, subject2);
        }
        
        // 替换 {count}
        if (message.includes('{count}')) {
            const count = Math.floor(Math.random() * 5) + 6;  // 6-10
            message = message.replace(/{count}/g, count.toString());
        }
        
        return { message, studentIndex1, studentIndex2, subject1, subject2 };
    }
    
    _showConfirmEvent(event, message, studentIndex1 = null, studentIndex2 = null, subject1 = null, subject2 = null) {
        // 构建弹窗数据
        const eventData = {
            id: event.id,
            type: RandomEventType.CONFIRM,
            title: '突发事件',
            message: message,  // 使用已经替换的message
            icon: '📢',
            effect: event.effect || '',
            buttonText: event.buttonText || '知道了'
        };
        
        // 显示弹窗
        if (typeof showRandomEventModal === 'function') {
            showRandomEventModal(eventData, studentIndex1, studentIndex2, subject1, subject2);
        } else {
            // 如果弹窗函数不可用，只记录日志
            this.log(`📢 ${message}`, 'info');
            this._applyEventEffect(event, event.effect, studentIndex1, studentIndex2);
        }
    }
    
    _showChoiceEvent(event, message, studentIndex1 = null, studentIndex2 = null, subject1 = null, subject2 = null) {
        // 构建弹窗数据
        const eventData = {
            id: event.id,
            type: RandomEventType.CHOICE,
            title: '突发事件',
            message: message,  // 使用已经替换的message
            icon: '📢',
            options: event.options.map(opt => ({
                label: opt.text,
                effect: opt.effect
            }))
        };
        
        // 显示弹窗
        if (typeof showRandomEventModal === 'function') {
            showRandomEventModal(eventData, studentIndex1, studentIndex2, subject1, subject2);
        } else {
            // 如果弹窗函数不可用，只记录日志
            this.log(`📢 ${message}`, 'info');
            const randomOption = event.options[Math.floor(Math.random() * event.options.length)];
            this.log(`  选项：${randomOption.text}`, 'info');
            this._applyEventEffect(event, randomOption.effect, studentIndex1, studentIndex2);
        }
    }
    
    _applyEventEffect(event, effect, studentIndex1 = null, studentIndex2 = null) {
        // 解析效果字符串
        const parts = effect.split(', ');
        
        // 查找受影响的学生（优先使用传入的索引）
        let targetStudent = null;
        
        if (studentIndex1 !== null) {
            targetStudent = this._getStudentByIndex(studentIndex1);
        }
        
        // 如果没有传入学生索引，随机选择一个
        if (!targetStudent) {
            const aliveStudents = this.students.filter(s => s.status !== Status.Dead);
            if (aliveStudents.length > 0) {
                targetStudent = aliveStudents[Math.floor(Math.random() * aliveStudents.length)];
            }
        }
        
        for (let part of parts) {
            if (part.startsWith('energy:')) {
                const value = parseFloat(part.split(':')[1]);
                if (value < 0) {
                    this.teacher.energy = Math.max(0, this.teacher.energy + value);
                } else {
                    this.teacher.energy = Math.min(TEACHER_ENERGY_DEFAULT, this.teacher.energy + value);
                }
                this.log(`  班主任精力${value >= 0 ? '+' : ''}${value}`, value >= 0 ? 'info' : 'warning');
            }
            
            if (part.startsWith('enthusiasm:')) {
                if (targetStudent) {
                    const value = parseFloat(part.split(':')[1]);
                    if (value < 0) {
                        targetStudent.enthusiasm = Math.max(STUDENT_ENTHUSIASM_MIN, targetStudent.enthusiasm + value);
                    } else {
                        targetStudent.enthusiasm = Math.min(STUDENT_ENTHUSIASM_MAX, targetStudent.enthusiasm + value);
                    }
                    this.log(`  ${targetStudent.name} 积极性${value >= 0 ? '+' : ''}${value}`, value >= 0 ? 'info' : 'warning');
                }
            }
            
            if (part.startsWith('learnCap:')) {
                if (targetStudent) {
                    const value = parseFloat(part.split(':')[1]);
                    const subjects = Object.keys(targetStudent.learnCap);
                    if (subjects.length > 0) {
                        const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
                        targetStudent.learnCap[randomSubject] = Math.min(LEARN_CAP_MAX, targetStudent.learnCap[randomSubject] + value);
                        this.log(`  ${targetStudent.name} ${randomSubject}能力+${value}`, 'info');
                    }
                }
            }
            
            if (part.startsWith('student:kill')) {
                if (targetStudent) {
                    targetStudent.status = Status.Dead;
                    this.studentAliveNum--;
                    this._recalculateSeats();
                    this.log(`  ${targetStudent.name} 死亡了！`, 'danger');
                }
            }
            
            if (part.startsWith('teacher:hurt')) {
                const value = parseFloat(part.split(':')[2]);
                this.teacher.health = Math.max(0, this.teacher.health + value);
                this.log(`  班主任血量${value >= 0 ? '+' : ''}${value}`, value >= 0 ? 'info' : 'warning');
                
                // 检查班主任是否死亡
                if (this.teacher.health <= 0) {
                    this.log(`\n💀 班主任血量归零！游戏结束！`, 'danger');
                    this.ended = true;
                    this.failReason = '班主任血量归零';
                    setTimeout(() => {
                        showEndGameScreen();
                    }, 2000);
                }
            }
            
            if (part.startsWith('teacher:kill')) {
                this.teacher.health = 0;
                this.log(`  班主任死亡！`, 'danger');
                this.ended = true;
                this.failReason = '班主任被杀害';
                setTimeout(() => {
                    showEndGameScreen();
                }, 2000);
            }
        }
    }
    
    handleRandomEventChoice(eventId, optionIndex, studentIndex1, studentIndex2) {
        // 查找事件
        const event = RANDOM_EVENTS.find(e => e.id === eventId);
        if (!event) return;
        
        let effect = '';
        let isMP5Attack = false;  // 标记是否是MP5攻击
        
        // 判断是确认事件还是选择事件
        if (optionIndex === -1) {
            // 确认事件：使用事件本身的effect
            effect = event.effect || '';
            this.log(`📢 确认事件`, 'info');
        } else {
            // 选择事件：使用选项的effect
            const option = event.options[optionIndex];
            if (!option) return;
            
            effect = option.effect;
            const student1 = studentIndex1 !== null ? this._getStudentByIndex(studentIndex1) : null;
            const student2 = studentIndex2 !== null ? this._getStudentByIndex(studentIndex2) : null;
            
            this.log(`📢 选择了：${option.text}`, 'info');
            
            // 检查是否是MP5攻击事件
            if (eventId === 13 && (effect.includes('teacher:kill') || effect.includes('teacher:hurt'))) {
                isMP5Attack = true;
            }
        }
        
        // 应用效果（传入学生索引）
        this._applyEventEffect(event, effect, studentIndex1, studentIndex2);
        
        // 如果是MP5攻击，显示弹窗提示
        if (isMP5Attack) {
            const student1 = studentIndex1 !== null ? this._getStudentByIndex(studentIndex1) : null;
            if (student1) {
                showNotification('danger', '⚠️ 警告', `${student1.name}使用mp5扫射了你！`);
            }
        }
    }

    lastDitch() {
        this.log("\n🎓 高考时间到！", 'highlight');
        this.log(`🎉 祝同学们金榜题名！`, 'highlight');

        const SUBJECT_SCORES = this._getSubjectScores();
        const examResults = [];

        for (let student of this.students) {
            if (student.status === Status.Dead || student.index in this.activeLeaves) {
                continue;
            }

            const studentScores = {};
            let totalScore = 0;

            for (let [subject, baseScore] of Object.entries(SUBJECT_SCORES)) {
                const subjectScore = this._calculateExamScore(student, parseInt(subject), baseScore);
                studentScores[subject] = subjectScore;
                totalScore += subjectScore;
            }

            examResults.push({
                studentIndex: student.index,
                name: student.name,
                totalScore: totalScore,
                scores: this._subjectScoresToObject(studentScores)
            });
        }

        examResults.sort((a, b) => b.totalScore - a.totalScore);

        for (let result of examResults) {
            const student = this._getStudentByIndex(result.studentIndex);
            let admittedUniversity = null;

            const randomVariation = Math.floor((Math.random() * 2 - 1) * GAOKAO_SCORE_RANDOM_RANGE);
            const finalScore = result.totalScore + randomVariation;
            student.gaokaoScore = finalScore;

            // 将randomVariation分配到各科成绩
            const adjustedScores = {};
            let remainingVariation = randomVariation;
            const subjectKeys = Object.keys(result.scores);

            // 按科目分数比例分配randomVariation
            for (let i = 0; i < subjectKeys.length; i++) {
                const subject = subjectKeys[i];
                const originalScore = result.scores[subject];
                const proportion = originalScore / result.totalScore;

                let variationForSubject;
                if (i === subjectKeys.length - 1) {
                    // 最后一个科目承担剩余的variation
                    variationForSubject = remainingVariation;
                } else {
                    variationForSubject = Math.round(randomVariation * proportion);
                    remainingVariation -= variationForSubject;
                }

                adjustedScores[subject] = Math.max(0, originalScore + variationForSubject);
            }

            student.gaokaoScores = adjustedScores;

            // 更新examResults中的scores和totalScore
            result.scores = adjustedScores;
            result.totalScore = finalScore;

            const universities = this.universityDatabase.sort((a, b) => b.getScoreRequirement(this.classType) - a.getScoreRequirement(this.classType));

            for (let uni of universities) {
                if (finalScore >= uni.getScoreRequirement(this.classType)) {
                    if (Math.random() < 0.2 && universities.indexOf(uni) < universities.length - 1) {
                        admittedUniversity = universities[universities.indexOf(uni) + 1];
                    } else {
                        admittedUniversity = uni;
                    }
                    break;
                }
            }

            if (admittedUniversity) {
                student.admittedUniversity = admittedUniversity;
                this.log(`🎉 ${student.name} 高考成绩：${finalScore}，被 ${admittedUniversity.name} 录取！`, 'highlight');
            } else {
                this.log(`😢 ${student.name} 高考成绩：${finalScore}，落榜了！`, 'warning');
            }

            this.gaokaoResults.push({
                student: student,
                gaokaoScore: finalScore,
                admittedUniversity: admittedUniversity
            });
        }

        // 计算高考平均分
        const avgScore = examResults.length > 0 ? examResults.reduce((sum, r) => sum + r.totalScore, 0) / examResults.length : 0;
        
        // 记录高考到考试历史
        this.contestsHistory.push({
            week: this.week,
            type: ContestType.Final,
            average: avgScore,
            details: examResults
        });

        this.log(`📊 高考平均分：${avgScore.toFixed(1)} | 参与人数：${examResults.length}`);

        this.ended = true;
        
        // 显示结算画面
        setTimeout(() => {
            showEndGameScreen();
        }, 2000);
    }

    getWeekInfo() {
        const semester = Math.floor((this.week - 1) / SEMESTER_LENGTH) + 1;
        const weekInSemester = ((this.week - 1) % SEMESTER_LENGTH) + 1;
        const monthsPassed = Math.floor(this.week / WEEKS_PER_MONTH);
        const weeksSinceMonthStart = this.week % WEEKS_PER_MONTH;
        return `第${semester}学期 第${weekInSemester}周 (总第${this.week}周) - 第${monthsPassed}个月第${weeksSinceMonthStart}周`;
    }

    getNextExamWeek() {
        const allExamWeeks = [
            ...this.contests[ContestType.Mid],
            ...this.contests[ContestType.End],
            ...this.contests[ContestType.Final]
        ].filter(w => w > this.week);

        if (allExamWeeks.length === 0) {
            return "-";
        }

        const nextExam = Math.min(...allExamWeeks);
        return nextExam - this.week;
    }
}

// ============================================================================
// 游戏主程序
// ============================================================================

let gameClass = null;
let selectedStudentIndex = null;
let viewMode = 'normal';
let instigateMode = false;
let swapMode = false;
let swapFirstStudent = null;
let leaveAutoHandle = 'manual';  // 请假自动处理设置：manual/manual/approve/reject

// DOM 元素
const menuScreen = document.getElementById('menuScreen');
const gameScreen = document.getElementById('gameScreen');
const endGameScreen = document.getElementById('endGameScreen');
const logPanel = document.getElementById('logPanel');
const seatingGrid = document.getElementById('seatingGrid');
const infoPanel = document.getElementById('infoPanel');
const examHistory = document.getElementById('examHistory');

// 状态栏元素
const weekDisplay = document.getElementById('weekDisplay');
const characterDisplay = document.getElementById('characterDisplay');
const nextExamDisplay = document.getElementById('nextExamDisplay');
const energyDisplay = document.getElementById('energyDisplay');
const salaryDisplay = document.getElementById('salaryDisplay');
const healthDisplay = document.getElementById('healthDisplay');

// 按钮
const nextWeekBtn = document.getElementById('nextWeekBtn');
const expelBtn = document.getElementById('expelBtn');
const counselBtn = document.getElementById('counselBtn');
const treatSingleBtn = document.getElementById('treatSingleBtn');
const treatClassBtn = document.getElementById('treatClassBtn');
const reformBtn = document.getElementById('reformBtn');
const sellBtn = document.getElementById('sellBtn');
const swapSeatsBtn = document.getElementById('swapSeatsBtn');
const randomizeSeatsBtn = document.getElementById('randomizeSeatsBtn');
const organizeActivityBtn = document.getElementById('organizeActivityBtn');
const holdMeetingBtn = document.getElementById('holdMeetingBtn');
const instigateBtn = document.getElementById('instigateBtn');
const buyMedicineBtn = document.getElementById('buyMedicineBtn');
const showLeavesBtn = document.getElementById('showLeavesBtn');
const returnMenuBtn = document.getElementById('returnMenuBtn');

// 弹窗
const leaveModal = document.getElementById('leaveModal');
const instigateModal = document.getElementById('instigateModal');
const swapModal = document.getElementById('swapModal');
const examDetailModal = document.getElementById('examDetailModal');

// 初始化

// 通知队列系统
let notificationQueue = [];
let isShowingNotification = false;

// 显示通知弹窗
function showNotification(type, title, message) {
    // 将通知加入队列
    notificationQueue.push({ type, title, message });
    
    // 如果当前没有正在显示的通知，立即显示队列中的第一个
    if (!isShowingNotification) {
        showNextNotification();
    }
}

// 显示队列中的下一个通知
function showNextNotification() {
    if (notificationQueue.length === 0) {
        isShowingNotification = false;
        return;
    }
    
    isShowingNotification = true;
    const notification = notificationQueue[0];
    
    const modal = document.getElementById('notificationModal');
    const icon = document.getElementById('notificationIcon');
    const titleEl = document.getElementById('notificationTitle');
    const messageEl = document.getElementById('notificationMessage');
    const queueInfo = document.getElementById('notificationQueueInfo');
    const queueCount = document.getElementById('notificationQueueCount');
    const confirmAllBtn = document.getElementById('confirmAllNotificationsBtn');

    // 设置样式
    modal.querySelector('.modal-content').className = 'modal-content notification ' + notification.type;

    // 设置图标
    switch (notification.type) {
        case 'success':
            icon.textContent = '✓';
            break;
        case 'error':
            icon.textContent = '✗';
            break;
        case 'warning':
            icon.textContent = '⚠';
            break;
        case 'danger':
            icon.textContent = '⚠';
            break;
        default:
            icon.textContent = 'ℹ';
    }

    // 设置内容
    titleEl.textContent = notification.title;
    messageEl.textContent = notification.message;

    // 更新剩余通知数量
    const remainingCount = notificationQueue.length - 1;
    if (remainingCount > 0) {
        queueInfo.style.display = 'block';
        queueCount.textContent = remainingCount;
        confirmAllBtn.style.display = 'inline-block';
    } else {
        queueInfo.style.display = 'none';
        confirmAllBtn.style.display = 'none';
    }

    // 显示弹窗
    modal.style.display = 'flex';
}

// 关闭当前通知并显示下一个
function closeCurrentNotification() {
    if (notificationQueue.length > 0) {
        notificationQueue.shift(); // 移除已显示的通知
    }
    
    showNextNotification();
    
    // 如果队列为空，隐藏弹窗
    if (notificationQueue.length === 0) {
        const modal = document.getElementById('notificationModal');
        modal.style.display = 'none';
    }
}

// 确认全部通知
function confirmAllNotifications() {
    notificationQueue = []; // 清空队列
    const modal = document.getElementById('notificationModal');
    modal.style.display = 'none';
    isShowingNotification = false;
}

// 显示随机事件弹窗
function showRandomEventModal(eventData, studentIndex1, studentIndex2, subject1, subject2) {
    const modal = document.getElementById('randomEventModal');
    const icon = document.getElementById('randomEventIcon');
    const titleEl = document.getElementById('randomEventTitle');
    const messageEl = document.getElementById('randomEventMessage');
    const buttonsContainer = document.getElementById('randomEventButtons');

    // 设置图标
    icon.textContent = eventData.icon || '📢';

    // 设置标题
    titleEl.textContent = eventData.title || '突发事件';

    // 设置消息（message已经在调用前被替换过）
    messageEl.textContent = eventData.message;

    // 清空并重建按钮
    buttonsContainer.innerHTML = '';

    if (eventData.type === RandomEventType.CHOICE) {
        // 选择事件：显示多个选项按钮
        for (let i = 0; i < eventData.options.length; i++) {
            const option = eventData.options[i];
            const btn = document.createElement('button');
            btn.className = 'btn';
            
            // 创建按钮内容容器
            const btnContent = document.createElement('div');
            const labelSpan = document.createElement('span');
            labelSpan.textContent = option.label;
            labelSpan.style.display = 'block';
            labelSpan.style.marginBottom = '4px';
            btnContent.appendChild(labelSpan);
            
            // 显示效果提示（转换为中文）
            if (option.effect) {
                const effectSpan = document.createElement('span');
                effectSpan.style.fontSize = '0.85em';
                effectSpan.style.color = 'rgba(232,199,106,0.7)';
                effectSpan.textContent = _formatEffectText(option.effect);
                btnContent.appendChild(effectSpan);
            }
            
            btn.appendChild(btnContent);
            
            btn.onclick = () => {
                // 调用事件处理
                gameClass.handleRandomEventChoice(eventData.id, i, studentIndex1, studentIndex2);
                modal.style.display = 'none';
                if (typeof renderAll === 'function') {
                    renderAll();
                }
            };
            
            buttonsContainer.appendChild(btn);
        }
    } else {
        // 确认事件：显示确认按钮
        const btn = document.createElement('button');
        btn.className = 'btn';
        
        // 创建按钮内容容器
        const btnContent = document.createElement('div');
        const labelSpan = document.createElement('span');
        labelSpan.textContent = eventData.buttonText || '知道了';
        labelSpan.style.display = 'block';
        labelSpan.style.marginBottom = '4px';
        btnContent.appendChild(labelSpan);
        
        // 添加效果提示（转换为中文）
        if (eventData.effect) {
            const effectSpan = document.createElement('span');
            effectSpan.style.fontSize = '0.85em';
            effectSpan.style.color = 'rgba(232,199,106,0.7)';
            effectSpan.textContent = _formatEffectText(eventData.effect);
            btnContent.appendChild(effectSpan);
        }
        
        btn.appendChild(btnContent);
        
        btn.onclick = () => {
            // 应用效果（使用选项索引-1表示确认事件）
            if (gameClass && typeof gameClass.handleRandomEventChoice === 'function') {
                gameClass.handleRandomEventChoice(eventData.id, -1, studentIndex1, studentIndex2);
            }
            modal.style.display = 'none';
            if (typeof renderAll === 'function') {
                renderAll();
            }
        };
        buttonsContainer.appendChild(btn);
    }

    // 显示弹窗
    hideGlobalTooltip();  // 隐藏tooltip避免遮挡
    modal.style.display = 'flex';
}

// 将效果字符串转换为中文描述
function _formatEffectText(effect) {
    if (!effect) return '';
    
    const parts = effect.split(', ');
    const descriptions = [];
    
    for (let part of parts) {
        if (part.startsWith('energy:')) {
            const value = parseFloat(part.split(':')[1]);
            if (value > 0) {
                descriptions.push('班主任精力+' + value);
            } else if (value < 0) {
                descriptions.push('班主任精力' + value);
            }
        } else if (part.startsWith('enthusiasm:')) {
            const value = parseFloat(part.split(':')[1]);
            if (value > 0) {
                descriptions.push('积极性+' + value);
            } else if (value < 0) {
                descriptions.push('积极性' + value);
            }
        } else if (part.startsWith('learnCap:')) {
            const value = parseFloat(part.split(':')[1]);
            if (value > 0) {
                descriptions.push('学习能力+' + value);
            } else if (value < 0) {
                descriptions.push('学习能力' + value);
            }
        } else if (part.startsWith('student:kill')) {
            descriptions.push('学生死亡');
        }
    }
    
    return descriptions.join('，');
}

// 显示考试/竞赛结果弹窗
function showExamResultModal(type, title, message) {
    const modal = document.getElementById('examResultModal');
    const icon = document.getElementById('examResultIcon');
    const titleEl = document.getElementById('examResultTitle');
    const messageEl = document.getElementById('examResultMessage');

    // 设置样式
    modal.querySelector('.modal-content').className = 'modal-content notification ' + type;

    // 设置图标
    switch (type) {
        case 'success':
            icon.textContent = '📊';
            break;
        case 'warning':
            icon.textContent = '🏆';
            break;
        default:
            icon.textContent = '📝';
    }

    // 设置内容
    titleEl.textContent = title;
    messageEl.textContent = message;

    // 显示弹窗
    modal.style.display = 'flex';
}

function showStudentDeathModal(studentName = null, names = null) {
    console.log(`[showStudentDeathModal] Called with studentName=${studentName}, names=${names}`);
    
    const modal = document.getElementById('studentDeathModal');
    
    if (!modal) {
        console.error(`[showStudentDeathModal] ERROR: #studentDeathModal element not found!`);
        return;
    }
    
    const message = document.getElementById('deathMessage');

    if (studentName) {
        message.textContent = `学生 ${studentName} 因精力耗尽而不幸离世！`;
    } else if (names) {
        message.textContent = `学生 ${names} 因精力耗尽而不幸离世！`;
    } else {
        message.textContent = `学生因精力耗尽而不幸离世！`;
    }

    console.log(`[showStudentDeathModal] Showing modal`);
    modal.style.display = 'flex';
}

function init() {
    // 检测移动设备并添加相应的类
    if (isMobileDevice()) {
        document.body.classList.add('mobile-device');
    }
    
    initGlobalTooltip();
    setupEventListeners();
    initMenuBackground();
    initCharacterSelectBackground();
    updateViewModeButtons();
}

function initCharacterSelectBackground() {
    const canvas = document.getElementById('characterBg');
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const particleCount = 80;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            radius: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.4 + 0.1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#0d1117');
        gradient.addColorStop(1, '#161b22');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let p of particles) {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(232, 199, 106, ${p.opacity})`;
            ctx.fill();
        }

        requestAnimationFrame(animate);
    }

    animate();
}

function initMenuBackground() {
    const canvas = document.getElementById('menuBg');
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#0d1117');
        gradient.addColorStop(1, '#161b22');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let p of particles) {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
            ctx.fill();
        }

        requestAnimationFrame(animate);
    }

    animate();
}

function setupEventListeners() {
    // 角色选择界面事件监听
    document.querySelectorAll('.character-card').forEach(card => {
        card.addEventListener('click', () => {
            const characterType = card.dataset.character;
            startGameWithCharacter(characterType);
        });
    });

    document.getElementById('gameSetupForm').addEventListener('submit', startGame);

    nextWeekBtn.addEventListener('click', () => {
        // 检查是否有待处理的请假请求
        if (gameClass && gameClass.pendingLeaveRequests.length > 0) {
            // 如果设置了自动处理，直接进入下一周（nextWeek会自动处理）
            if (leaveAutoHandle !== 'manual') {
                const success = gameClass.nextWeek();
                if (success) {
                    renderAll();
                }
                return;
            }
            // 手动处理模式，弹出处理界面
            showLeaveRequests();
            addLogEntry(`⚠️ 有 ${gameClass.pendingLeaveRequests.length} 个请假申请待处理！`, 'warning');
            return;
        }
        
        const success = gameClass.nextWeek();
        if (success) {
            renderAll();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && gameScreen.style.display === 'flex') {
            // 按z-index从高到低的顺序检查弹窗（考试弹窗优先）
            const modalsWithPriority = [
                { id: 'examResultModal', z: 700, handler: () => document.getElementById('closeExamResultBtn').click() },
                { id: 'randomEventModal', z: 650, handler: () => { /* 随机事件弹窗不能通过空格关闭，需要玩家选择 */ } },
                { id: 'notificationModal', z: 600, handler: () => document.getElementById('closeNotificationBtn').click() },
                { id: 'studentDeathModal', z: 600, handler: () => document.getElementById('closeDeathBtn').click() },
                { id: 'expelConfirmModal', z: 600, handler: () => document.getElementById('confirmExpelBtn').click() },
                { id: 'rulesModal', z: 500, handler: () => document.getElementById('rulesCloseBtn').click() },
                { id: 'leaveModal', z: 300, handler: () => document.getElementById('closeLeaveBtn').click() },
                { id: 'instigateModal', z: 300, handler: () => document.getElementById('cancelInstigateBtn').click() },
                { id: 'swapModal', z: 300, handler: () => document.getElementById('cancelSwapBtn').click() },
                { id: 'examDetailModal', z: 300, handler: () => document.getElementById('closeExamDetailBtn').click() }
            ];
            
            // 按z-index从高到低排序
            modalsWithPriority.sort((a, b) => b.z - a.z);
            
            // 检查是否有弹窗打开
            let modalOpen = false;
            for (let modal of modalsWithPriority) {
                const modalElement = document.getElementById(modal.id);
                if (modalElement && modalElement.style.display === 'flex') {
                    modalOpen = true;
                    e.preventDefault();
                    modal.handler();
                    break;
                }
            }

            // 如果没有弹窗打开，则进入下一周
            if (!modalOpen) {
                e.preventDefault();
                hideGlobalTooltip();  // 隐藏tooltip避免遮挡
                nextWeekBtn.click();
            }
        }
    });

    document.getElementById('normalModeBtn').addEventListener('click', () => toggleViewMode('normal'));
    document.getElementById('relationModeBtn').addEventListener('click', () => toggleViewMode('relation'));
    document.getElementById('statusModeBtn').addEventListener('click', () => toggleViewMode('status'));
    document.getElementById('competitionModeBtn').addEventListener('click', () => toggleViewMode('competition'));

    document.getElementById('cancelModeBtn').addEventListener('click', cancelMode);

    expelBtn.addEventListener('click', expelSelectedStudent);
    counselBtn.addEventListener('click', counselSelectedStudent);
    treatSingleBtn.addEventListener('click', treatSelectedStudent);
    treatClassBtn.addEventListener('click', treatAllStudents);
    reformBtn.addEventListener('click', reformSelectedStudent);
    sellBtn.addEventListener('click', sellSelectedStudent);
    swapSeatsBtn.addEventListener('click', startSwapMode);
    randomizeSeatsBtn.addEventListener('click', () => {
        const result = gameClass.randomizeSeats();
        renderSeatingGrid();
        if (result.success) {
            showNotification('success', '重排成功', result.message);
        } else {
            showNotification('error', '重排失败', result.message);
        }
    });

    organizeActivityBtn.addEventListener('click', organizeActivity);
    holdMeetingBtn.addEventListener('click', holdClassMeeting);
    
    // 为select添加change事件，更新tooltip
    document.getElementById('activityTypeSelect').addEventListener('change', updateActivityTooltip);
    document.getElementById('meetingTypeSelect').addEventListener('change', updateMeetingTooltip);
    
    instigateBtn.addEventListener('click', startInstigateMode);
    buyMedicineBtn.addEventListener('click', buyMedicine);
    showLeavesBtn.addEventListener('click', showLeaveRequests);

    document.getElementById('saveGameBtn').addEventListener('click', saveGame);

    document.getElementById('loadGameBtnMenu').addEventListener('click', () => {
        document.getElementById('loadGameInputMenu').click();
    });
    document.getElementById('loadGameInputMenu').addEventListener('change', loadGame);

    returnMenuBtn.addEventListener('click', returnToMenu);

    document.getElementById('rulesCloseBtn').addEventListener('click', () => {
        document.getElementById('rulesModal').style.display = 'none';
    });

    document.getElementById('closeLeaveBtn').addEventListener('click', () => {
        document.getElementById('leaveModal').style.display = 'none';
    });

    // 添加请假自动处理设置的事件监听
    document.querySelectorAll('input[name="leaveAutoHandle"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            leaveAutoHandle = e.target.value;
            
            // 提示用户设置已更改
            const settingText = {
                'manual': '手动处理：每次都需要手动处理请假申请',
                'approve': '自动同意：所有请假申请将自动批准',
                'reject': '自动拒绝：所有请假申请将自动拒绝'
            };
            
            addLogEntry(`⚙️ 请假设置已更改：${settingText[leaveAutoHandle]}`, 'info');
        });
    });

    document.getElementById('cancelInstigateBtn').addEventListener('click', cancelMode);

    document.getElementById('cancelSwapBtn').addEventListener('click', cancelMode);

    document.getElementById('closeExamDetailBtn').addEventListener('click', () => {
        examDetailModal.style.display = 'none';
    });

    document.getElementById('returnMenuBtn').addEventListener('click', returnToMenu);

    // 关闭通知弹窗
    document.getElementById('closeNotificationBtn').addEventListener('click', () => {
        closeCurrentNotification();
    });
    
    // 确认全部通知
    document.getElementById('confirmAllNotificationsBtn').addEventListener('click', () => {
        confirmAllNotifications();
    });

    // 关闭考试结果弹窗
    document.getElementById('closeExamResultBtn').addEventListener('click', () => {
        document.getElementById('examResultModal').style.display = 'none';
    });

    // 关闭学生死亡通知弹窗
    document.getElementById('closeDeathBtn').addEventListener('click', () => {
        document.getElementById('studentDeathModal').style.display = 'none';
    });
}

function setupTooltips() {
    // 动态tooltip的更新（HTML中已静态设置）
    updateMeetingTooltip();
    updateActivityTooltip();
}

function updateMeetingTooltip() {
    const meetingType = document.getElementById('meetingTypeSelect').value;
    const tooltipText = getMeetingTooltip(meetingType);
    document.getElementById('holdMeetingBtn').setAttribute('data-tooltip', tooltipText);
}

function updateActivityTooltip() {
    const activityType = document.getElementById('activityTypeSelect').value;
    const tooltipText = getActivityTooltip(activityType);
    document.getElementById('organizeActivityBtn').setAttribute('data-tooltip', tooltipText);
}

function getMeetingTooltip(meetingType) {
    switch (meetingType) {
        case 'CHICKEN_SOUP':
            return '消耗40精力，500元。全员积极性+5。班主任的鸡汤激励全班士气。';
        case 'THREAT':
            return '消耗40精力，500元。全员积极性+8，精力-5。严厉警告提升紧迫感，但消耗学生精力。';
        case 'AWARD':
            return '消耗40精力，500元。前5名学生积极性+10。表彰优秀学生激励竞争。';
        case 'FREE':
            return '消耗40精力，500元。全员积极性+3，精力+2。自由交流改善班级氛围。';
        case 'COMPLAINT':
            return '消耗40精力，500元。全员积极性+4，精力+1。发泄不满情绪，恢复学习状态。';
        case 'SURPRISE':
            return '消耗40精力，500元。全员积极性+7。惊喜活动大幅提升班级氛围。';
        default:
            return '召开班会，提升班级状态。';
    }
}

function getActivityTooltip(activityType) {
    switch (activityType) {
        case 'SPORTS':
            return '消耗40精力。全员精力-10，积极性+3。10%学生受伤风险，消耗精力但提升积极性。';
        case 'MOVIE':
            return '消耗40精力。全员精力+1，积极性+2。观影放松，小幅恢复状态。';
        case 'FIELD_TRIP':
            return '消耗40精力。全员精力+2，积极性+2。春游踏青，放松身心。';
        case 'TALENT_SHOW':
            return '消耗40精力。前三名积极性+5精力+1，其他积极性+1。展示才艺，激发自信。';
        case 'GROUP_STUDY':
            return '消耗40精力。全员积极性-8，30%人学习能力+0.5。集体学习，提升能力但消耗积极性。';
        case 'PICNIC':
            return '消耗40精力。全员精力+2，积极性+3。野餐聚会，增进友谊（5%概率提升关系）。';
        case 'GAME_NIGHT':
            return '消耗40精力。全员精力+1，积极性+3。游戏娱乐，放松心情。';
        case 'VOLUNTEER':
            return '消耗40精力。全员精力-5，积极性+2，20%人随机科目+0.5。志愿服务，提升社会责任感。';
        default:
            return '组织活动，提升班级状态。';
    }
}

function startGame(e) {
    e.preventDefault();

    // 保存游戏设置到全局变量
    window.gameSettings = {
        difficulty: document.getElementById('difficulty').value,
        classTypeStr: document.getElementById('classType').value,
        studentCount: parseInt(document.getElementById('studentCount').value)
    };

    // 隐藏主菜单，显示角色选择界面
    menuScreen.style.display = 'none';
    document.getElementById('characterSelectScreen').style.display = 'flex';
    
    // 初始化角色选择界面背景
    initCharacterSelectBackground();
}

function startGameWithCharacter(characterType) {
    const settings = window.gameSettings;
    if (!settings) {
        console.error('游戏设置未找到！');
        return;
    }

    let mode;
    switch (settings.difficulty) {
        case 'Easy':
            mode = GameMode.Easy;
            break;
        case 'Normal':
            mode = GameMode.Normal;
            break;
        case 'Hard':
            mode = GameMode.Hard;
            break;
    }

    let type;
    switch (settings.classTypeStr) {
        case 'Science':
            type = ClassType.Science;
            break;
        case 'Art':
            type = ClassType.Art;
            break;
    }

    resetNamePool();

    gameClass = new Class(mode, type, settings.studentCount, characterType);

    gameClass.setLogCallback(addLogEntry);

    document.getElementById('characterSelectScreen').style.display = 'none';
    gameScreen.style.display = 'flex';

    renderAll();

    setupTooltips();

    addLogEntry('🎮 游戏开始！', 'highlight');
    
    // 显示角色信息
    if (characterType && CharacterData[characterType]) {
        const charData = CharacterData[characterType];
        const subjectName = gameClass._getSubjectName(charData.subject);
        addLogEntry(`👤 角色：${charData.name}（${subjectName}老师）`, 'highlight');
        addLogEntry(`✨ 特质：${charData.trait}`, 'info');
    }
    
    // 显示难度中文名称
    const difficultyName = settings.difficulty === 'Easy' ? '简单' : 
                          settings.difficulty === 'Normal' ? '普通' : '困难';
    
    addLogEntry(`📚 班型：${type === ClassType.Science ? '理科班' : '文科班'} | 难度：${difficultyName} | 学生人数：${settings.studentCount}`);
}

function saveGame() {
    if (!gameClass) {
        showNotification('warning', '提示', '没有正在进行的游戏！');
        return;
    }

    const gameData = {
        saveVersion: '2.2',
        mode: gameClass.mode,
        classType: gameClass.classType,
        studentNum: gameClass.studentNum,
        week: gameClass.week,
        ended: gameClass.ended,
        studentAliveNum: gameClass.studentAliveNum,
        failReason: gameClass.failReason,
        teacher: {
            health: gameClass.teacher.health,
            energy: gameClass.teacher.energy,
            salary: gameClass.teacher.salary,
            last_salary_week: gameClass.teacher.last_salary_week
        },
        contestsHistory: gameClass.contestsHistory,
        pendingLeaveRequests: gameClass.pendingLeaveRequests.map(req => ({
            student_index: req.student.index,
            duration: req.duration,
            reason: req.reason,
            requested_week: req.requested_week,
            approved: req.approved,
            processed: req.processed
        })),
        activeLeaves: gameClass.activeLeaves,
        firstExamAverage: gameClass.firstExamAverage,
        gaokaoResults: gameClass.gaokaoResults.map(result => ({
            student_index: result.student.index,
            gaokao_score: result.gaokao_score,
            university: result.admitted_university ? result.admitted_university.name : null
        })),
        pending_leave_requests: gameClass.pendingLeaveRequests.map(req => ({
            student_index: req.student.index,
            duration: req.duration,
            reason: req.reason,
            requested_week: req.requested_week,
            approved: req.approved,
            processed: req.processed
        })),
        active_leaves: gameClass.activeLeaves,
        first_exam_average: gameClass.firstExamAverage,
        gaokao_results: gameClass.gaokaoResults.map(result => ({
            student_index: result.student.index,
            gaokao_score: result.gaokao_score,
            university: result.admitted_university ? result.admitted_university.name : null
        })),
        students: gameClass.students.map(student => ({
            index: student.index,
            gender: student.gender,
            name: student.name,
            status: student.status,
            energy: student.energy,
            enthusiasm: student.enthusiasm,
            character: student.character,
            IQ: student.IQ,
            relation: student.relation,
            competition: student.competition,
            competitionStage: student.competitionStage,
            competitionAward: student.competitionAward,
            inTraining: student.inTraining,
            trainingEndWeek: student.trainingEndWeek,
            admittedEarly: student.admittedEarly,
            learnCap: student.learnCap,
            validSubjects: student.validSubjects,
            previous_score: student.previousScore,
            first_exam_score: student.firstExamScore,
            score_change_factor: student.scoreChangeFactor,
            leave_start_week: student.leaveStartWeek,
            leave_end_week: student.leaveEndWeek,
            seat_col: student.seatCol,
            seat_row: student.seatRow,
            lastExamRank: student.lastExamRank,
            gaokao_score: student.gaokaoScore,
            gaokao_scores: student.gaokaoScores,
            admitted_university: student.admittedUniversity ? student.admittedUniversity.name : null,
            talents: student.talents
        })),
        students_data: gameClass.students.map(student => ({
            index: student.index,
            gender: student.gender,
            name: student.name,
            status: student.status,
            energy: student.energy,
            enthusiasm: student.enthusiasm,
            character: student.character,
            IQ: student.IQ,
            relation: student.relation,
            competition: student.competition,
            competitionStage: student.competitionStage,
            competitionAward: student.competitionAward,
            inTraining: student.inTraining,
            trainingEndWeek: student.trainingEndWeek,
            admittedEarly: student.admittedEarly,
            learnCap: student.learnCap,
            validSubjects: student.validSubjects,
            previous_score: student.previousScore,
            first_exam_score: student.firstExamScore,
            score_change_factor: student.scoreChangeFactor,
            leave_start_week: student.leaveStartWeek,
            leave_end_week: student.leaveEndWeek,
            seat_col: student.seatCol,
            seat_row: student.seatRow,
            lastExamRank: student.lastExamRank,
            gaokao_score: student.gaokaoScore,
            gaokao_scores: student.gaokaoScores,
            admitted_university: student.admittedUniversity ? student.admittedUniversity.name : null,
            talents: student.talents
        }))
    };

    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    const filename = `班主任模拟器_${timestamp}.json`;

    const blob = new Blob([JSON.stringify(gameData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addLogEntry(`💾 存档已保存：${filename}`, 'highlight');
}

function loadGame(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const gameData = JSON.parse(e.target.result);

            const saveVersion = gameData.saveVersion || '1.0';

            if (!gameData.mode || !gameData.classType || !gameData.students) {
                throw new Error('存档格式不正确');
            }

            const mode = Object.values(GameMode).find(m => m === gameData.mode) || GameMode.Normal;
            const classType = Object.values(ClassType).find(c => c === gameData.classType) || ClassType.Science;

            gameClass = new Class(mode, classType, gameData.studentNum);

            gameClass.setLogCallback(addLogEntry);

            gameClass.week = gameData.week;
            gameClass.ended = gameData.ended;
            gameClass.studentAliveNum = gameData.studentAliveNum;
            gameClass.failReason = gameData.failReason || null;
            gameClass.firstExamAverage = gameData.firstExam_average || gameData.firstExamAverage || null;

            gameClass.teacher.health = gameData.teacher.health;
            gameClass.teacher.energy = gameData.teacher.energy;
            gameClass.teacher.salary = gameData.teacher.salary;
            gameClass.teacher.last_salary_week = gameData.teacher.last_salary_week;

            gameClass.contestsHistory = gameData.contestsHistory || gameData.contests_history || [];

            const pendingLeaveData = gameData.pendingLeaveRequests || gameData.pending_leave_requests || [];
            gameClass.pendingLeaveRequests = pendingLeaveData.map(req => {
                const student = gameClass._getStudentByIndex(req.student_index);
                const leaveReq = new LeaveRequest(student, req.duration, req.reason || LEAVE_REASONS[Math.floor(Math.random() * LEAVE_REASONS.length)]);
                leaveReq.requestedWeek = req.requested_week;
                leaveReq.approved = req.approved;
                leaveReq.processed = req.processed;
                return leaveReq;
            });

            gameClass.activeLeaves = gameData.activeLeaves || gameData.active_leaves || {};

            const studentsData = gameData.students || gameData.students_data || [];
            gameClass.students = studentsData.map(studentData => {
                const student = gameClass.students[studentData.index - 1] || new Student(studentData.index, gameClass, mode, classType);
                student.gender = studentData.gender;
                student.name = studentData.name;
                student.status = studentData.status;
                student.energy = studentData.energy;
                student.enthusiasm = studentData.enthusiasm;
                student.character = studentData.character;
                student.IQ = studentData.IQ;
                student.relation = studentData.relation;
                                student.competition = studentData.competition || null;
                                student.competitionStage = studentData.competitionStage || null;
                                student.competitionAward = studentData.competitionAward || CompetitionAward.None;
                                student.inTraining = studentData.inTraining || false;
                                student.trainingEndWeek = studentData.trainingEndWeek || null;
                                student.admittedEarly = studentData.admittedEarly || null;
                                student.learnCap = studentData.learnCap;                student.validSubjects = studentData.validSubjects;
                student.previousScore = studentData.previous_score;
                student.firstExamScore = studentData.first_exam_score;
                student.scoreChangeFactor = studentData.score_change_factor;
                student.leaveStartWeek = studentData.leave_start_week;
                student.leaveEndWeek = studentData.leave_end_week;
                student.seatCol = studentData.seat_col;
                student.seatRow = studentData.seat_row;
                student.lastExamRank = studentData.lastExamRank || null;
                student.gaokaoScore = studentData.gaokao_score || null;
                student.gaokaoScores = studentData.gaokao_scores || null;

                // 加载天赋（v2.2及以上版本）
                if (studentData.talents && Array.isArray(studentData.talents)) {
                    student.talents = studentData.talents;
                }

                if (studentData.admitted_university) {
                    for (let uni of gameClass.universityDatabase) {
                        if (uni.name === studentData.admitted_university) {
                            student.admittedUniversity = uni;
                            break;
                        }
                    }
                }

                return student;
            });

            const gaokaoResultsData = gameData.gaokaoResults || gameData.gaokao_results || [];
            gameClass.gaokaoResults = gaokaoResultsData.map(result => {
                const student = gameClass._getStudentByIndex(result.student_index);
                const university = result.university ? gameClass.universityDatabase.find(u => u.name === result.university) : null;
                return {
                    student: student,
                    gaokao_score: result.gaokao_score,
                    admitted_university: university
                };
            });

            gameClass._initializeSeats();
            gameClass._recalculateSeats();

            menuScreen.style.display = 'none';
            gameScreen.style.display = 'flex';

            renderAll();

            addLogEntry(`📂 存档已加载：第${gameClass.week}周`, 'highlight');
            addLogEntry(`📚 班型：${classType === ClassType.Science ? '理科班' : '文科班'} | 难度：${mode === GameMode.Easy ? '简单' : mode === GameMode.Normal ? '普通' : '困难'} | 学生人数：${gameClass.studentNum}`);

            setupTooltips();

            showNotification('success', '加载成功', '存档加载成功！');

        } catch (error) {
            console.error('加载存档失败:', error);
            showNotification('error', '加载失败', '加载存档失败：' + error.message);
        }
    };
    reader.readAsText(file);

    event.target.value = '';
}

function returnToMenu() {
    endGameScreen.style.display = 'none';
    gameScreen.style.display = 'none';
    document.getElementById('characterSelectScreen').style.display = 'none';
    menuScreen.style.display = 'flex';

    gameClass = null;
    selectedStudentIndex = null;
    viewMode = 'normal';
    instigateMode = false;
    swapMode = false;
    swapFirstStudent = null;

    logPanel.innerHTML = '';
    examHistory.innerHTML = '';
    infoPanel.style.display = 'none';
}

function selectStudent(index) {
    if (index === null) {
        selectedStudentIndex = null;
    } else {
        selectedStudentIndex = index;
    }
    renderSeatingGrid();
    updateInfoPanel();
    updateButtonStates();
}

function handleSeatClick(col, row, student) {
    if (swapMode) {
        handleSwapClick(col, row, student);
        return;
    }

    if (instigateMode) {
        handleInstigateClick(col, row, student);
        return;
    }

    if (student) {
        selectStudent(student.index);
    } else {
        // 点击空座位，取消选择
        selectStudent(null);
    }
}

function toggleViewMode(mode) {
    viewMode = mode;
    renderSeatingGrid();
    updateViewModeButtons();
}

function updateViewModeButtons() {
    const buttons = document.querySelectorAll('.view-mode-btn');
    buttons.forEach(btn => {
        if (btn.dataset.mode === viewMode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function cancelMode() {
    instigateMode = false;
    swapMode = false;
    swapFirstStudent = null;
    document.getElementById('cancelModeBtn').style.display = 'none';
    renderSeatingGrid();
}

function expelSelectedStudent() {
    if (!gameClass || selectedStudentIndex === null) return;

    const student = gameClass._getStudentByIndex(selectedStudentIndex);
    if (!student) return;

    // 显示劝退确认弹窗
    const modal = document.getElementById('expelConfirmModal');
    const icon = document.getElementById('expelConfirmIcon');
    const titleEl = document.getElementById('expelConfirmTitle');
    const messageEl = document.getElementById('expelConfirmMessage');

    icon.textContent = '⚠';
    modal.querySelector('.modal-content').className = 'modal-content notification warning';
    titleEl.textContent = '确认劝退';
    messageEl.textContent = `确定要劝退学生 ${student.name} 吗？`;

    modal.style.display = 'flex';

    // 设置确认按钮的事件
    const confirmBtn = document.getElementById('confirmExpelBtn');
    const cancelBtn = document.getElementById('cancelExpelBtn');

    // 移除之前的事件监听器
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    const newCancelBtn = cancelBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

    // 确认按钮
    newConfirmBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        const result = gameClass.expelStudent(selectedStudentIndex);
        if (result.success) {
            selectedStudentIndex = null;
            renderAll();
            showNotification('success', '劝退成功', result.message);
        } else {
            renderAll();
            showNotification('error', '劝退失败', result.message);
        }
    });

    // 取消按钮
    newCancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

function counselSelectedStudent() {
    if (!gameClass || selectedStudentIndex === null) return;

    const result = gameClass.counselStudent(selectedStudentIndex);
    renderAll();
    if (result.success) {
        showNotification('success', '约谈成功', result.message);
    } else {
        showNotification('error', '约谈失败', result.message);
    }
}

function treatSelectedStudent() {
    if (!gameClass || selectedStudentIndex === null) return;

    const result = gameClass.treatStudent(selectedStudentIndex);
    renderAll();
    if (result.success) {
        showNotification('success', '请客成功', result.message);
    } else {
        showNotification('error', '请客失败', result.message);
    }
}

function treatAllStudents() {
    if (!gameClass) return;

    const result = gameClass.treatAllStudents();
    if (result.success) {
        renderAll();
        showNotification('success', '请客成功', result.message);
    } else {
        showNotification('error', '请客失败', result.message);
    }
}

function reformSelectedStudent() {
    if (!gameClass || selectedStudentIndex === null) return;

    const result = gameClass.reformStudent(selectedStudentIndex);
    renderAll();
    if (result.success) {
        showNotification('success', '调教成功', result.message);
    } else {
        showNotification('error', '调教失败', result.message);
    }
}

function sellSelectedStudent() {
    if (!gameClass || selectedStudentIndex === null) return;

    const result = gameClass.sellStudent(selectedStudentIndex);
    renderAll();
    if (result.success) {
        showNotification('success', '贩卖成功', result.message);
    } else {
        showNotification('error', '贩卖失败', result.message);
    }
}

function startSwapMode() {
    if (!gameClass || selectedStudentIndex === null) {
        showNotification('warning', '提示', '请先选择一个学生！');
        return;
    }

    swapMode = true;
    swapFirstStudent = selectedStudentIndex;
    document.getElementById('cancelModeBtn').style.display = 'inline-block';
    
    // 在日志中添加提示
    if (gameClass && gameClass.logCallback) {
        gameClass.log('💡 请点击目标位置进行交换', 'highlight');
    }
    
    renderSeatingGrid();
}

function handleSwapClick(col, row, student) {
    if (!gameClass) return;

    if (swapFirstStudent === null) {
        // 第一次点击，选择一个学生
        if (student) {
            swapFirstStudent = student.index;
            showNotification('info', '选择完成', '请点击目标位置进行交换');
            renderSeatingGrid();
        }
        return;
    }

    // 第二次点击，执行交换
    const firstStudent = gameClass._getStudentByIndex(swapFirstStudent);
    if (!firstStudent) {
        cancelMode();
        return;
    }

    const pos1Col = firstStudent.seatCol;
    const pos1Row = firstStudent.seatRow;

    const result = gameClass.swapSeats(pos1Col, pos1Row, col, row);
    if (result.success) {
        cancelMode();
        renderAll();
        showNotification('success', '交换成功', result.message);
    } else {
        showNotification('error', '交换失败', result.message);
    }
}

function organizeActivity() {
    if (!gameClass) return;

    const activityType = document.getElementById('activityTypeSelect').value;
    const result = gameClass.organizeActivity(ActivityType[activityType]);
    renderAll();
    if (result.success) {
        showNotification('success', '活动组织成功', result.message);
    } else {
        showNotification('error', '活动组织失败', result.message);
    }
}

function holdClassMeeting() {
    if (!gameClass) return;

    const meetingType = document.getElementById('meetingTypeSelect').value;
    const result = gameClass.holdClassMeeting(ClassMeetingType[meetingType]);
    renderAll();
    if (result.success) {
        showNotification('success', '班会召开成功', result.message);
    } else {
        showNotification('error', '班会召开失败', result.message);
    }
}

function startInstigateMode() {
    if (!gameClass || selectedStudentIndex === null) {
        showNotification('warning', '提示', '请先选择一个学生！');
        return;
    }

    instigateMode = true;
    document.getElementById('cancelModeBtn').style.display = 'inline-block';
    
    // 在日志中添加提示
    if (gameClass && gameClass.logCallback) {
        gameClass.log('💡 请点击另一个学生的座位进行挑拨', 'highlight');
    }
    
    renderSeatingGrid();
}

function handleInstigateClick(col, row, student) {
    if (!gameClass || selectedStudentIndex === null) return;

    if (!student) {
        showNotification('warning', '提示', '请点击另一个学生的座位进行挑拨！');
        return;
    }

    if (student.index === selectedStudentIndex) {
        showNotification('warning', '提示', '不能挑拨自己！');
        return;
    }

    const result = gameClass.instigate(selectedStudentIndex, student.index);
    if (result.success) {
        cancelMode();
        renderAll();
        showNotification('success', '挑拨成功', result.message);
    } else {
        showNotification('error', '挑拨失败', result.message);
        cancelMode();
        renderAll();
    }
}

function buyMedicine() {
    if (!gameClass) return;

    const result = gameClass.buyMedicine();
    if (result.success) {
        renderAll();
        showNotification('success', '购买成功', result.message);
    } else {
        showNotification('error', '购买失败', result.message);
    }
}

function showLeaveRequests() {
    if (!gameClass) return;

    const container = document.getElementById('leaveModal');
    const listElement = document.getElementById('leaveRequestsList');

    // 同步设置单选框的值
    document.querySelectorAll('input[name="leaveAutoHandle"]').forEach(radio => {
        radio.checked = (radio.value === leaveAutoHandle);
    });

    if (gameClass.pendingLeaveRequests.length === 0) {
        listElement.innerHTML = '<p style="color: rgba(255,255,255,0.65);">没有待处理的请假申请。</p>';
    } else {
        listElement.innerHTML = '';
        gameClass.pendingLeaveRequests.forEach((req, index) => {
            const reqElement = document.createElement('div');
            reqElement.className = 'leave-request-item';
            reqElement.innerHTML = `
                <div class="leave-request-info">
                    <strong>学生 ${req.student.name}</strong>
                    <span>申请请假 ${req.duration} 周</span>
                    <div class="leave-request-reason">理由：${req.reason}</div>
                </div>
                <div class="leave-request-actions">
                    <button class="btn btn-success btn-sm" onclick="handleSingleLeaveRequest(${index}, true)">批准</button>
                    <button class="btn btn-danger btn-sm" onclick="handleSingleLeaveRequest(${index}, false)">拒绝</button>
                </div>
            `;
            listElement.appendChild(reqElement);
        });
    }

    container.style.display = 'flex';
}

function handleSingleLeaveRequest(index, approved) {
    if (!gameClass) return;
    
    const success = gameClass.approveLeaveRequest(index, approved);
    if (success) {
        renderAll();
        // 如果还有其他待处理的请假请求，刷新列表
        if (gameClass.pendingLeaveRequests.length > 0) {
            showLeaveRequests();
        } else {
            document.getElementById('leaveModal').style.display = 'none';
        }
    } else {
        showNotification('error', '处理失败', '处理失败！');
    }
}

function showLeaveRequestModal() {
    showLeaveRequests();
}

// 全局函数，用于处理单个请假请求
window.handleSingleLeaveRequest = handleSingleLeaveRequest;

// 全局函数，用于处理单个请假请求
window.handleSingleLeaveRequest = handleSingleLeaveRequest;

function addLogEntry(message, type = 'normal') {
    const entry = document.createElement('div');
    entry.className = `log-entry log-${type}`;
    entry.textContent = message;
    logPanel.appendChild(entry);
    logPanel.scrollTop = logPanel.scrollHeight;
}

function renderExamHistory() {
    if (!gameClass) return;

    examHistory.innerHTML = '';

    if (gameClass.contestsHistory.length === 0) {
        examHistory.innerHTML = '<div style="color: rgba(255,255,255,0.4); font-size: 0.85em; text-align: center; padding: 20px;">暂无考试记录</div>';
        return;
    }

    // 从后往前遍历，让最新的考试记录在最上面
    for (let i = gameClass.contestsHistory.length - 1; i >= 0; i--) {
        const exam = gameClass.contestsHistory[i];
        const examItem = document.createElement('div');
        examItem.className = 'exam-item';
        examItem.onclick = () => showExamDetail(exam);

        const weekInfo = exam.week <= 60 ? `第${exam.week}周` : '高考';
        const examType = exam.type === ContestType.Mid ? '期中' :
                        exam.type === ContestType.End ? '期末' :
                        exam.type === ContestType.Final ? '高考' : '考试';

        examItem.innerHTML = `
            <div class="exam-header">
                <span class="exam-week">${weekInfo}</span>
                <span class="exam-type" data-type="${examType}">${examType}</span>
            </div>
            <div class="exam-average">
                班级平均分：<span class="exam-average-value">${exam.average.toFixed(1)}</span>
            </div>
        `;

        examHistory.appendChild(examItem);
    }
}

function showExamDetail(exam) {
    if (!exam) return;

    document.getElementById('examDetailTitle').textContent =
        `第${exam.week}周 ${exam.type === ContestType.Mid ? '期中' : exam.type === ContestType.End ? '期末' : '高考'}考试详情`;

    const content = document.getElementById('examDetailContent');
    content.innerHTML = '';

    // 添加考试统计信息
    const statsDiv = document.createElement('div');
    statsDiv.className = 'exam-stats';
    
    const sortedDetails = [...exam.details].sort((a, b) => b.totalScore - a.totalScore);
    const maxScore = sortedDetails[0].totalScore;
    const minScore = sortedDetails[sortedDetails.length - 1].totalScore;
    const scoreRange = maxScore - minScore;
    
    statsDiv.innerHTML = `
        <div class="stat-item">
            <span class="stat-label">参与人数：</span>
            <span class="stat-value">${exam.details.length}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">平均分：</span>
            <span class="stat-value">${exam.average.toFixed(1)}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">最高分：</span>
            <span class="stat-value">${maxScore.toFixed(1)}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">最低分：</span>
            <span class="stat-value">${minScore.toFixed(1)}</span>
        </div>
    `;
    content.appendChild(statsDiv);

    // 分隔线
    const divider = document.createElement('div');
    divider.className = 'exam-divider';
    divider.innerHTML = '<div class="divider-line"></div>';
    content.appendChild(divider);

    // 学生成绩列表
    for (let i = 0; i < sortedDetails.length; i++) {
        const result = sortedDetails[i];
        const item = document.createElement('div');
        item.className = 'exam-detail-item';

        const scoresHtml = Object.entries(result.scores).map(([subject, score]) => {
            return `<span>${getSubjectName(Subject[subject])}: ${score}</span>`;
        }).join(' | ');

        item.innerHTML = `
            <div class="detail-name">
                <span class="detail-rank">#${i + 1}</span>
                ${result.name}
            </div>
            <div class="detail-score">总分：<span class="detail-score-value">${result.totalScore.toFixed(1)}</span></div>
            <div class="detail-scores">${scoresHtml}</div>
        `;

        content.appendChild(item);
    }

    examDetailModal.style.display = 'flex';
}

function getSubjectEnum(name) {
    switch (name) {
        case 'Chinese': return Subject.Chinese;
        case 'Maths': return Subject.Maths;
        case 'English': return Subject.English;
        case 'Physics': return Subject.Physics;
        case 'Chemistry': return Subject.Chemistry;
        case 'Biology': return Subject.Biology;
        case 'Politics': return Subject.Politics;
        case 'History': return Subject.History;
        case 'Geography': return Subject.Geography;
        default: return null;
    }
}

function showEndGameScreen() {
    if (!gameClass) return;

    const aliveStudents = gameClass.students.filter(s => s.status !== Status.Dead);
    const totalStudents = gameClass.studentNum;
    const aliveRate = (aliveStudents.length / totalStudents * 100).toFixed(1);

    const admissions = aliveStudents.filter(s => s.admittedUniversity);
    const keyAdmissions = admissions.filter(s =>
        s.admittedUniversity.tier === UniversityTier.TIER_985 ||
        s.admittedUniversity.tier === UniversityTier.TIER_211 ||
        s.admittedUniversity.tier === UniversityTier.TIER_DOUBLE_FIRST
    );
    const keyRate = (keyAdmissions.length / aliveStudents.length * 100).toFixed(1);

    document.getElementById('endAlive').textContent = `${aliveStudents.length}/${totalStudents}`;
    document.getElementById('endAliveRate').textContent = `存活率 ${aliveRate}%`;
    document.getElementById('endKeyRate').textContent = `${keyRate}%`;
    document.getElementById('endSalary').textContent = gameClass.teacher.salary;
    document.getElementById('endHealth').textContent = `剩余血量: ${gameClass.teacher.health}`;

    // 显示失败原因
    if (gameClass.failReason) {
        document.getElementById('endReasonBadge').textContent = '游戏失败';
        document.getElementById('endTitle').textContent = gameClass.failReason;
    } else {
        document.getElementById('endReasonBadge').textContent = '游戏结束';
        document.getElementById('endTitle').textContent = '游戏结束';
    }

    let evalText, medal;
    // 死亡率超过20%（存活率低于80%）
    if (aliveRate < 80) {
        evalText = '沟槽班主任';
        medal = '💀';
    } else if (keyRate >= 80) {
        evalText = '特级教师';
        medal = '🏆';
    } else if (keyRate >= 60) {
        evalText = '优秀班主任';
        medal = '🎖️';
    } else if (keyRate >= 40) {
        evalText = '合格班主任';
        medal = '📜';
    } else {
        evalText = '需改进';
        medal = '📝';
    }

    document.getElementById('endEvalTitle').textContent = evalText;
    document.getElementById('endMedal').textContent = medal;

    const tierBars = document.getElementById('endTierBars');
    tierBars.innerHTML = '';

    const tiers = [
        { name: '985 工程', tier: UniversityTier.TIER_985, color: '#f39c12' },
        { name: '211 工程', tier: UniversityTier.TIER_211, color: '#e74c3c' },
        { name: '双一流', tier: UniversityTier.TIER_DOUBLE_FIRST, color: '#9b59b6' },
        { name: '一本', tier: UniversityTier.TIER_TIER1, color: '#3498db' },
        { name: '二本', tier: UniversityTier.TIER_TIER2, color: '#2ecc71' },
        { name: '三本/专科', tier: UniversityTier.TIER_TIER3, color: '#95a5a6' }
    ];

    for (let tierInfo of tiers) {
        const count = admissions.filter(s => s.admittedUniversity.tier === tierInfo.tier).length;
        if (count > 0) {
            const percentage = (count / aliveStudents.length * 100).toFixed(1);
            const bar = document.createElement('div');
            bar.className = 'tier-bar';
            bar.innerHTML = `
                <div class="tier-name">${tierInfo.name}</div>
                <div class="tier-bar-fill" style="width: ${percentage}%; background: ${tierInfo.color};"></div>
                <div class="tier-count">${count}人 (${percentage}%)</div>
            `;
            tierBars.appendChild(bar);
        }
    }

    // 生成缅怀区（死亡学生名单）
    const deadStudents = gameClass.students.filter(s => s.status === Status.Dead);
    const memorialSection = document.getElementById('endMemorialSection');
    const memorialList = document.getElementById('endMemorialList');

    if (deadStudents.length > 0) {
        memorialSection.style.display = 'block';
        memorialList.innerHTML = '';

        deadStudents.forEach(student => {
            const memorialCard = document.createElement('div');
            memorialCard.className = 'memorial-card';
            memorialCard.innerHTML = `
                <div class="memorial-icon">🕯️</div>
                <div class="memorial-name">${student.name}</div>
                <div class="memorial-reason">因精力耗尽而不幸离世</div>
            `;
            memorialList.appendChild(memorialCard);
        });
    } else {
        memorialSection.style.display = 'none';
    }

    // 生成学生录取名单
    const studentsList = document.getElementById('endStudentsList');
    studentsList.innerHTML = '';

    // 按高考成绩从高到低排序
    const sortedStudents = aliveStudents.sort((a, b) => (b.gaokaoScore || 0) - (a.gaokaoScore || 0));

    for (let i = 0; i < sortedStudents.length; i++) {
        const student = sortedStudents[i];
        const rank = i + 1;
        const score = student.gaokaoScore || 0;
        const university = student.admittedUniversity;

        // 获取排名徽章样式
        let rankBadgeClass = 'rank-bronze';
        let rankIcon = `#${rank}`;
        if (rank === 1) {
            rankBadgeClass = 'rank-gold';
            rankIcon = '🥇';
        } else if (rank === 2) {
            rankBadgeClass = 'rank-silver';
            rankIcon = '🥈';
        } else if (rank === 3) {
            rankBadgeClass = 'rank-silver';
            rankIcon = '🥉';
        }

        // 获取各科成绩
        let scoresHtml = '';
        if (student.gaokaoScores && Object.keys(student.gaokaoScores).length > 0) {
            scoresHtml = Object.entries(student.gaokaoScores).map(([subject, score]) => {
                const subjectName = getSubjectName(Subject[subject]);
                return `<span class="subject-score">${subjectName}: ${score}</span>`;
            }).join(' | ');
        } else {
            // 如果没有各科成绩，则显示总成绩
            scoresHtml = `<span class="subject-score">总成绩: ${score.toFixed(1)}</span>`;
        }

        const studentCard = document.createElement('div');
        studentCard.className = 'student-result-card';

        studentCard.innerHTML = `
            <div class="student-result-header">
                <div class="student-result-rank ${rankBadgeClass}">${rankIcon} 第${rank}名</div>
                <div class="student-result-name">${student.name}</div>
                <div class="student-result-score">${score.toFixed(1)}分</div>
            </div>
            <div class="student-result-scores">${scoresHtml}</div>
            <div class="student-result-university">
                ${university ? 
                    `<span class="university-badge" style="background: ${getTierColor(university.tier)}">${university.name}</span>` : 
                    '<span class="university-badge" style="background: #95a5a6;">落榜</span>'}
            </div>
        `;

        studentsList.appendChild(studentCard);
    }

    endGameScreen.style.display = 'flex';
}

// 辅助函数：获取大学等级颜色
function getTierColor(tier) {
    switch (tier) {
        case UniversityTier.TIER_985:
            return '#f39c12';
        case UniversityTier.TIER_211:
            return '#e74c3c';
        case UniversityTier.TIER_DOUBLE_FIRST:
            return '#9b59b6';
        case UniversityTier.TIER_TIER1:
            return '#3498db';
        case UniversityTier.TIER_TIER2:
            return '#2ecc71';
        case UniversityTier.TIER_TIER3:
            return '#95a5a6';
        default:
            return '#95a5a6';
    }
}

// 初始化游戏
window.addEventListener('DOMContentLoaded', init);

// ============================================================================
// 控制台调试函数 - 运动会系统
// ============================================================================

/**
 * 打开运动会活动选择界面
 * 在浏览器控制台中输入: openSportsDayEvent()
 */
window.openSportsDayEvent = function() {
    if (typeof openSportsDay === 'function') {
        openSportsDay();
    } else {
        console.error('❌ 运动会系统未加载，请确保 sports_day.js 已正确加载');
    }
};

console.log('🏆 运动会系统已就绪');
console.log('📝 使用 openSportsDayEvent() 打开运动会活动选择界面');