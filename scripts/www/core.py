import random as r
from enum import Enum
import name_generate  # 保留原始导入
import json
import os
import sys

# ============================================================================
# --- 常量配置区 (所有魔术数字集中管理) ---
# ============================================================================

# 时间配置
SEMESTER_LENGTH = 20              # 每学期周数
WEEKS_PER_MONTH = 4               # 每月周数
TOTAL_SEMESTERS = 6               # 总学期数

# 精力配置
TEACHER_ENERGY_DEFAULT = 100      # 班主任初始精力
TEACHER_ENERGY_WARNING = 20       # 班主任精力警告阈值
TEACHER_ENERGY_RECOVER_WEEKLY = 0 # 班主任每周自然恢复 (目前为 0)
STUDENT_ENERGY_DEFAULT = 70       # 学生初始精力
STUDENT_ENERGY_MAX = 100          # 学生精力上限
STUDENT_ENERGY_MIN = 0            # 学生精力下限
STUDENT_ENERGY_RECOVER_NORMAL = 2.0      # 学生每周精力恢复 (正常)
STUDENT_ENERGY_RECOVER_LEAVE = 8.0       # 学生每周精力恢复 (请假)
STUDENT_ENERGY_EXAM_COST = 35     # 【平衡】考试后精力消耗 (30→35)
STUDENT_ENERGY_ACTIVITY_COST = 1  # 活动后精力消耗
STUDENT_ENERGY_TREAT_SINGLE = 5   # 请单个学生吃饭精力恢复
STUDENT_ENERGY_TREAT_CLASS = 4    # 请全班吃饭精力恢复

# 积极性配置
STUDENT_ENTHUSIASM_MAX = 100      # 积极性上限
STUDENT_ENTHUSIASM_MIN = 15       # 积极性下限
STUDENT_ENTHUSIASM_DECAY_BASE = 0.60     # 【平衡】每周基础衰减 (0.55→0.60)
STUDENT_ENTHUSIASM_DECAY_LEAVE = 2.0     # 请假期间每周衰减
STUDENT_ENTHUSIASM_COUNSEL_GAIN = 5      # 约谈成功积极性提升
STUDENT_ENTHUSIASM_ACTIVITY_GAIN = 3     # 活动成功积极性提升
STUDENT_ENTHUSIASM_ACTIVITY_LOSS = 1     # 活动失败积极性损失

# 成绩计算权重【平衡调整】
SCORE_WEIGHT_CAPACITY = 0.60      # 【平衡】能力值权重 (0.70→0.60)
SCORE_WEIGHT_ENTHUSIASM = 0.25    # 【平衡】积极性权重 (0.17→0.25)
SCORE_WEIGHT_IQ = 0.10            # 智商权重 (不变)
SCORE_WEIGHT_ENERGY = 0.05        # 【平衡】精力权重 (0.03→0.05)
SCORE_FLUCTUATION_STD = 0.02      # 随机波动标准差

# 成绩影响积极性
SCORE_DIFF_THRESHOLD = 200        # 成绩差异阈值
SCORE_IMPROVEMENT_FACTOR = 0.8    # 进步对积极性影响系数
SCORE_DECLINE_FACTOR = 1.2        # 退步对积极性影响系数
SCORE_CHANGE_DECAY = 0.8          # 成绩影响衰减率

# 班主任配置
TEACHER_HEALTH_MAX = 10           # 班主任血量上限
TEACHER_HEALTH_EXAM_COST = 5      # 精力不足扣血
TEACHER_HEALTH_COUNSEL_FAIL = 1   # 约谈失败扣血
TEACHER_HEALTH_INSTIGATE_LOVING = 4  # 挑拨情侣扣血
TEACHER_HEALTH_INSTIGATE_BOY = 3     # 挑拨男生扣血
TEACHER_MONTHLY_SALARY = 1500     # 班主任月薪
TEACHER_MEDICINE_COST = 500       # 药品价格
TEACHER_MEDICINE_HEAL = 5         # 药品回血量
TEACHER_COUNSEL_ENERGY_COST = 20  # 约谈精力消耗
TEACHER_ACTIVITY_ENERGY_COST = 60 # 组织活动精力消耗
TEACHER_TREAT_SINGLE_ENERGY_COST = 30  # 请单个学生精力消耗
TEACHER_TREAT_CLASS_ENERGY_COST = 40   # 请全班精力消耗
TEACHER_TREAT_SINGLE_COST = 300   # 请单个学生费用
TEACHER_TREAT_CLASS_COST = 2000   # 请全班费用
TEACHER_CLASS_MEETING_ENERGY_COST = 40  # 【新增】班会精力消耗
TEACHER_CLASS_MEETING_COST = 500        # 【新增】班会费用

# 关系配置
RELATION_IMPROVE_CHAR_DIFF = 0.3  # 性格相似度阈值
RELATION_NORMAL_TO_BETTER = 0.02  # 普通->较好概率
RELATION_BETTER_TO_FRIEND = 0.015 # 较好->朋友概率
RELATION_RANDOM_HATING = 0.005    # 随机变仇恨概率
RELATION_LOVING_DIFFERENT_GENDER = 0.008  # 异性变爱慕概率
RELATION_LOVING_SAME_GENDER = 0.003       # 同性变爱慕概率
RELATION_NEIGHBOR_FRIEND = 0.03   # 邻座变友好概率
RELATION_NEIGHBOR_DISLIKE = 0.01  # 邻座变厌恶概率
RELATION_INSTIGATE_SUCCESS = 0.7  # 挑拨成功率

# 【平衡】关系影响配置 (略微降低朋友 buff)
RELATION_FRIEND_ENERGY_GAIN = 0.6       # 【平衡】朋友关系精力恢复 (0.8→0.6)
RELATION_FRIEND_ENTHUSIASM_REDUCTION = 0.3  # 【平衡】朋友关系积极性衰减减少 (0.4→0.3)
RELATION_FRIEND_HIGH_ENTH_GAIN = 0.2    # 【平衡】高积极性朋友额外增益 (0.3→0.2)
RELATION_HATING_ENERGY_LOSS = 0.8       # 仇恨关系精力损失
RELATION_HATING_ENTHUSIASM_INCREASE = 0.3   # 仇恨关系积极性衰减增加
RELATION_HATING_HIGH_ENTH_PENALTY = 0.4 # 高积极性仇恨额外惩罚
RELATION_HATING_SEVERE_PENALTY = 1.5    # 仇恨严重惩罚
RELATION_LOVING_POSITIVE_PROB = 0.5     # 爱慕正面影响概率

# 座位配置
SEAT_COLUMNS = 9                  # 座位列数
SEAT_ROWS_MAX = 12                # 最大行数 (根据学生数动态)

# 请假配置 (优化：1-5 周，必须当周处理)
LEAVE_REQUEST_PROB = 0.1          # 每周请假申请概率
LEAVE_REQUEST_MAX_STUDENTS = 2    # 最多申请人数
LEAVE_DURATION_MIN = 1            # 请假最短周数
LEAVE_DURATION_MAX = 5            # 请假最长周数 (优化：从 4 改为 5)
LEAVE_REQUEST_MUST_HANDLE = True  # 【关键】必须手动处理，不能自动拒绝

# 成长配置
GROWTH_RATE_EASY = 0.0018         # 简单模式成长率
GROWTH_RATE_NORMAL = 0.0025       # 普通模式成长率
GROWTH_RATE_HARD = 0.0035         # 困难模式成长率
BASE_CAP_EASY = 58                # 简单模式基础能力
BASE_CAP_NORMAL = 50              # 普通模式基础能力
BASE_CAP_HARD = 42                # 困难模式基础能力
LEARN_CAP_STD = 5                 # 能力值正态分布标准差
LEARN_CAP_MIN = 30                # 能力值下限
LEARN_CAP_MAX = 95                # 能力值上限
LEARN_INCREASE_NOISE = 0.08       # 学习增长随机波动
LEARN_CAP_DECAY_WEEKLY = 0.03     # 【平衡】能力值每周自然衰减 (不学习会遗忘)

# 其他配置
IMPOSSIBLE_CHANCE_EASY_COMPETITION = 5  # 简单模式竞赛概率 (1/n)
ENERGY_NOISE_RANGE = 1.0          # 精力随机波动范围
ENTHUSIASM_NOISE_RANGE = 2.0      # 积极性随机波动范围
COUNSEL_SUCCESS_RATE = 0.5        # 约谈成功率
ACTIVITY_SUCCESS_RATE = 0.7       # 活动成功率
NAME_DISPLAY_LENGTH = 4           # 姓名显示长度

# 高考配置 (新增)
GAOKAO_TOTAL_SCORE = 750          # 高考总分
GAOKAO_SCORE_RANDOM_RANGE = 30    # 高考成绩随机波动范围 (±)
GAOKAO_UNIVERSITY_ASSIGN_RANDOM = 20  # 大学分配随机波动 (±分)


# ============================================================================
# --- 工具函数 ---
# ============================================================================

def isThisImpossible(n: int) -> bool:
    """判断是否触发小概率事件"""
    return r.randint(1, n) == 1


def randomGauss(mid: float, d: float, lft: int, rt: int, max_attempts: int = 1000) -> int:
    """生成限制范围内的正态分布随机整数"""
    for _ in range(max_attempts):
        res = int(round(r.gauss(mid, d)))
        if lft <= res <= rt:
            return res
    return r.randint(lft, rt)


def randomCap(gameMode: 'GameMode') -> int:
    """根据游戏难度生成能力上限"""
    mid = gameMode.value
    if gameMode == GameMode.Easy:
        return randomGauss(85, 8, 65, 100)
    elif gameMode == GameMode.Normal:
        return randomGauss(65, 10, 45, 85)
    else:
        return randomGauss(45, 10, 25, 65)


# ============================================================================
# --- 枚举类 ---
# ============================================================================

class ContestType(Enum):
    Mid = 1
    End = 2
    Final = 3  # 高考


class GameMode(Enum):
    Hard = 40
    Normal = 60
    Easy = 80


class ClassType(Enum):
    Science = 1  # 理科
    Art = 2      # 文科


class Subject(Enum):
    Chinese = 1
    Maths = 2
    English = 3
    Physics = 4
    Chemistry = 5
    Biology = 6
    Politics = 7
    History = 8
    Geography = 9


class Gender(Enum):
    Boy = "male"
    Girl = "female"


class Competition(Enum):
    MO = 1
    PhO = 2
    ChO = 3
    BO = 4
    OI = 5


class Status(Enum):
    Normal = 1
    Leave = 2
    Train = 3
    Dead = 4


class Relations(Enum):
    Normal = 1
    Better = 2
    Friend = 3
    Loving = 4
    Disliking = 5
    Hating = 6
    Self = 7


class UniversityTier(Enum):
    """大学层次"""
    TIER_985 = "985 工程"
    TIER_211 = "211 工程"
    TIER_DOUBLE_FIRST = "双一流"
    TIER_TIER1 = "一本"
    TIER_TIER2 = "二本"
    TIER_TIER3 = "三本/专科"


class ClassMeetingType(Enum):
    """班会类型"""
    CHICKEN_SOUP = "鸡汤班会"
    THREAT = "恐吓班会"
    AWARD = "表彰班会"
    FREE = "自由班会"
    COMPLAINT = "吐槽大会"
    SURPRISE = "惊喜班会"


# ============================================================================
# --- 大学数据库 (2025 年河南分数线模拟数据) ---
# ============================================================================

class University:
    def __init__(self, name: str, tier: UniversityTier, 
                 science_score: int, art_score: int,
                 location: str = "未知", category: str = "综合"):
        self.name = name
        self.tier = tier
        self.science_score = science_score  # 理科最低分数线
        self.art_score = art_score          # 文科最低分数线
        self.location = location
        self.category = category
    
    def get_score_requirement(self, class_type: ClassType) -> int:
        """根据班型获取分数线"""
        if class_type == ClassType.Science:
            return self.science_score
        else:
            return self.art_score
    
    def __str__(self):
        return f"{self.name} ({self.tier.value})"


# 2025 年河南高校录取分数线数据库 (模拟数据，基于历年趋势)
def get_university_database() -> list:
    """获取大学数据库"""
    universities = [
        # 985 高校
        University("清华大学", UniversityTier.TIER_985, 695, 680, "北京", "综合"),
        University("北京大学", UniversityTier.TIER_985, 690, 675, "北京", "综合"),
        University("复旦大学", UniversityTier.TIER_985, 680, 665, "上海", "综合"),
        University("上海交通大学", UniversityTier.TIER_985, 678, 660, "上海", "综合"),
        University("浙江大学", UniversityTier.TIER_985, 675, 658, "杭州", "综合"),
        University("中国科学技术大学", UniversityTier.TIER_985, 670, 650, "合肥", "理工"),
        University("南京大学", UniversityTier.TIER_985, 668, 655, "南京", "综合"),
        University("武汉大学", UniversityTier.TIER_985, 655, 640, "武汉", "综合"),
        University("华中科技大学", UniversityTier.TIER_985, 650, 635, "武汉", "理工"),
        University("中山大学", UniversityTier.TIER_985, 645, 630, "广州", "综合"),
        University("西安交通大学", UniversityTier.TIER_985, 640, 625, "西安", "综合"),
        University("哈尔滨工业大学", UniversityTier.TIER_985, 638, 620, "哈尔滨", "理工"),
        University("北京航空航天大学", UniversityTier.TIER_985, 665, 650, "北京", "理工"),
        University("同济大学", UniversityTier.TIER_985, 660, 645, "上海", "理工"),
        University("南开大学", UniversityTier.TIER_985, 650, 638, "天津", "综合"),
        University("厦门大学", UniversityTier.TIER_985, 645, 635, "厦门", "综合"),
        University("四川大学", UniversityTier.TIER_985, 640, 630, "成都", "综合"),
        University("山东大学", UniversityTier.TIER_985, 635, 625, "济南", "综合"),
        
        # 211 高校
        University("上海财经大学", UniversityTier.TIER_211, 655, 645, "上海", "财经"),
        University("中央财经大学", UniversityTier.TIER_211, 650, 640, "北京", "财经"),
        University("对外经济贸易大学", UniversityTier.TIER_211, 645, 635, "北京", "财经"),
        University("北京邮电大学", UniversityTier.TIER_211, 640, 625, "北京", "理工"),
        University("西安电子科技大学", UniversityTier.TIER_211, 630, 615, "西安", "理工"),
        University("南京航空航天大学", UniversityTier.TIER_211, 625, 610, "南京", "理工"),
        University("武汉理工大学", UniversityTier.TIER_211, 615, 600, "武汉", "理工"),
        University("西南交通大学", UniversityTier.TIER_211, 610, 595, "成都", "理工"),
        University("北京交通大学", UniversityTier.TIER_211, 620, 605, "北京", "理工"),
        University("华东理工大学", UniversityTier.TIER_211, 625, 610, "上海", "理工"),
        University("郑州大学", UniversityTier.TIER_211, 605, 590, "郑州", "综合"),
        University("河南大学", UniversityTier.TIER_DOUBLE_FIRST, 595, 580, "开封", "综合"),
        
        # 双一流高校
        University("北京科技大学", UniversityTier.TIER_DOUBLE_FIRST, 615, 600, "北京", "理工"),
        University("北京化工大学", UniversityTier.TIER_DOUBLE_FIRST, 605, 590, "北京", "理工"),
        University("南京理工大学", UniversityTier.TIER_DOUBLE_FIRST, 620, 605, "南京", "理工"),
        University("苏州大学", UniversityTier.TIER_DOUBLE_FIRST, 625, 610, "苏州", "综合"),
        University("上海大学", UniversityTier.TIER_DOUBLE_FIRST, 620, 605, "上海", "综合"),
        University("暨南大学", UniversityTier.TIER_DOUBLE_FIRST, 615, 600, "广州", "综合"),
        University("福州大学", UniversityTier.TIER_DOUBLE_FIRST, 605, 590, "福州", "理工"),
        University("南昌大学", UniversityTier.TIER_DOUBLE_FIRST, 600, 585, "南昌", "综合"),
        
        # 一本高校
        University("河南工业大学", UniversityTier.TIER_TIER1, 570, 555, "郑州", "理工"),
        University("河南理工大学", UniversityTier.TIER_TIER1, 560, 545, "焦作", "理工"),
        University("河南农业大学", UniversityTier.TIER_TIER1, 555, 540, "郑州", "农林"),
        University("河南师范大学", UniversityTier.TIER_TIER1, 565, 550, "新乡", "师范"),
        University("河南科技大学", UniversityTier.TIER_TIER1, 560, 545, "洛阳", "理工"),
        University("华北水利水电大学", UniversityTier.TIER_TIER1, 565, 550, "郑州", "理工"),
        University("河南财经政法大学", UniversityTier.TIER_TIER1, 575, 560, "郑州", "财经"),
        University("新乡医学院", UniversityTier.TIER_TIER1, 580, 565, "新乡", "医药"),
        University("郑州轻工业大学", UniversityTier.TIER_TIER1, 555, 540, "郑州", "理工"),
        University("中原工学院", UniversityTier.TIER_TIER1, 550, 535, "郑州", "理工"),
        
        # 二本高校
        University("河南工程学院", UniversityTier.TIER_TIER2, 520, 505, "郑州", "理工"),
        University("河南科技学院", UniversityTier.TIER_TIER2, 510, 495, "新乡", "农林"),
        University("洛阳师范学院", UniversityTier.TIER_TIER2, 515, 500, "洛阳", "师范"),
        University("安阳师范学院", UniversityTier.TIER_TIER2, 510, 495, "安阳", "师范"),
        University("南阳师范学院", UniversityTier.TIER_TIER2, 505, 490, "南阳", "师范"),
        University("商丘师范学院", UniversityTier.TIER_TIER2, 500, 485, "商丘", "师范"),
        
        # 三本/专科
        University("郑州科技学院", UniversityTier.TIER_TIER3, 450, 435, "郑州", "理工"),
        University("黄河科技学院", UniversityTier.TIER_TIER3, 440, 425, "郑州", "综合"),
        University("郑州工商学院", UniversityTier.TIER_TIER3, 430, 415, "郑州", "财经"),
    ]
    return universities


# ============================================================================
# --- 学生类 ---
# ============================================================================

class Student:
    def __init__(self, index: int, belongClass: 'Class', 
                 mode: GameMode = GameMode.Normal, 
                 classType: ClassType = ClassType.Science):
        self.belongClass = belongClass
        self.index = index  # 1-based 索引
        self.gender = r.choice(list(Gender))
        self.name = name_generate.generate_unique_name(self.gender.value)
        self.gameMode = mode
        self.status = Status.Normal
        self.energy = float(STUDENT_ENERGY_DEFAULT)
        self.enthusiasm = float(randomCap(self.gameMode))
        self.character = (r.random(), r.random())
        self.IQ = randomCap(self.gameMode) + 20
        
        # 座位属性
        self.seat_col: int = 0  # 1-based
        self.seat_row: int = 0  # 1-based

        # 关系初始化 (使用字典避免索引问题)
        self.relation: dict = {}
        # 初始化所有关系为 Normal
        for i in range(1, self.belongClass.studentNum + 1):
            self.relation[i] = Relations.Normal
        self.relation[self.index] = Relations.Self

        if self.gameMode == GameMode.Easy and isThisImpossible(IMPOSSIBLE_CHANCE_EASY_COMPETITION):
            self.competition = r.choice(list(Competition))

        # 科目初始化
        if classType == ClassType.Science:
            self.valid_subjects = [Subject.Chinese, Subject.Maths, Subject.English,
                                   Subject.Physics, Subject.Chemistry, Subject.Biology]
        else:
            self.valid_subjects = [Subject.Chinese, Subject.Maths, Subject.English,
                                   Subject.Politics, Subject.History, Subject.Geography]
            
        # 成长配置
        if self.gameMode == GameMode.Easy:
            base_cap = BASE_CAP_EASY
            growth_rate = GROWTH_RATE_EASY
        elif self.gameMode == GameMode.Normal:
            base_cap = BASE_CAP_NORMAL
            growth_rate = GROWTH_RATE_NORMAL
        else:
            base_cap = BASE_CAP_HARD
            growth_rate = GROWTH_RATE_HARD
            
        self.growth_rate = growth_rate
        self.learnCap: dict = {}
        for subject in self.valid_subjects:
            self.learnCap[subject] = randomGauss(base_cap, LEARN_CAP_STD, LEARN_CAP_MIN, LEARN_CAP_MAX)
            
        # 成绩追踪
        self.previous_score: float = None
        self.first_exam_score: float = None  # 【新增】第一次考试成绩
        self.score_change_factor: float = 0.0
        
        # 请假相关
        self.leave_start_week: int = None
        self.leave_end_week: int = None
        
        # 高考相关 (新增)
        self.gaokao_score: int = None  # 高考成绩
        self.admitted_university: University = None  # 录取大学

    def get_neighbors(self) -> list:
        """获取座位前后左右的同学"""
        neighbors = []
        if not self.seat_col or not self.seat_row:
            return neighbors
            
        seats = self.belongClass.seats
        c = self.seat_col - 1  # 转为 0-based
        r_idx = self.seat_row - 1  # 转为 0-based
        
        # 左
        if c > 0 and r_idx < len(seats[c-1]) and seats[c-1][r_idx] is not None:
            neighbors.append(seats[c-1][r_idx])
        # 右
        if c < SEAT_COLUMNS - 1 and r_idx < len(seats[c+1]) and seats[c+1][r_idx] is not None:
            neighbors.append(seats[c+1][r_idx])
        # 前
        if r_idx > 0 and seats[c][r_idx-1] is not None:
            neighbors.append(seats[c][r_idx-1])
        # 后
        if r_idx + 1 < len(seats[c]) and seats[c][r_idx+1] is not None:
            neighbors.append(seats[c][r_idx+1])
            
        return neighbors

    def updateWeekly(self):
        """更新学生每周状态"""
        # 1. 基础数值变化
        energy_recover = STUDENT_ENERGY_RECOVER_NORMAL
        if self.status == Status.Leave:
            energy_recover = STUDENT_ENERGY_RECOVER_LEAVE
            
        enthusiasm_decay = STUDENT_ENTHUSIASM_DECAY_BASE
        
        # 2. 成绩变化影响
        enthusiasm_decay += self.score_change_factor
        self.score_change_factor *= SCORE_CHANGE_DECAY
        
        # 3. 座位与关系影响
        neighbors = self.get_neighbors()
        hating_neighbor_penalty = 0.0
        
        for neighbor in neighbors:
            if neighbor is None or neighbor.status == Status.Dead:
                continue
                
            # 使用 index 访问关系字典 (1-based)
            rel = self.relation.get(neighbor.index, Relations.Normal)
            
            if rel == Relations.Friend or rel == Relations.Better:
                energy_recover += RELATION_FRIEND_ENERGY_GAIN
                enthusiasm_decay -= RELATION_FRIEND_ENTHUSIASM_REDUCTION
                if neighbor.enthusiasm > 80:
                    energy_recover += RELATION_FRIEND_HIGH_ENTH_GAIN
                    enthusiasm_decay -= 0.2
            elif rel == Relations.Hating or rel == Relations.Disliking:
                energy_recover -= RELATION_HATING_ENERGY_LOSS
                enthusiasm_decay += RELATION_HATING_ENTHUSIASM_INCREASE
                if neighbor.enthusiasm > 70:
                    energy_recover -= RELATION_HATING_HIGH_ENTH_PENALTY
                    enthusiasm_decay += 0.2
                if rel == Relations.Hating:
                    hating_neighbor_penalty += RELATION_HATING_SEVERE_PENALTY
            elif rel == Relations.Loving:
                if r.random() > RELATION_LOVING_POSITIVE_PROB:
                    energy_recover += 0.4
                    enthusiasm_decay -= 0.6
                else:
                    energy_recover -= 0.6
                    enthusiasm_decay -= 0.2

        energy_recover -= hating_neighbor_penalty

        # 4. 随机波动
        energy_noise = r.uniform(-ENERGY_NOISE_RANGE, ENERGY_NOISE_RANGE)
        enthusiasm_noise = r.uniform(-ENTHUSIASM_NOISE_RANGE, ENTHUSIASM_NOISE_RANGE)
        
        # 5. 应用变化
        self.energy = min(STUDENT_ENERGY_MAX, max(STUDENT_ENERGY_MIN, 
                          self.energy + energy_recover + energy_noise))
        self.enthusiasm = min(STUDENT_ENTHUSIASM_MAX, max(STUDENT_ENTHUSIASM_MIN,
                              self.enthusiasm - enthusiasm_decay + enthusiasm_noise))
        
        # 6. 学习能力增长【平衡】增加每周自然衰减
        efficiency = (self.energy / STUDENT_ENERGY_MAX) * (self.enthusiasm / STUDENT_ENTHUSIASM_MAX)
        iq_factor = self.IQ / 100.0
        
        for subject in self.valid_subjects:
            current_cap = self.learnCap[subject]
            
            # 增长
            increase = (LEARN_CAP_MAX - current_cap) * self.growth_rate * efficiency * iq_factor
            increase += r.uniform(-LEARN_INCREASE_NOISE, LEARN_INCREASE_NOISE)
            
            # 【平衡】衰减 (不学习会遗忘)
            decay = LEARN_CAP_DECAY_WEEKLY * (1.0 - efficiency)
            
            new_cap = current_cap + increase - decay
            self.learnCap[subject] = max(LEARN_CAP_MIN, min(LEARN_CAP_MAX, new_cap))

    def __str__(self):
        return self.name


# ============================================================================
# --- 班主任类 ---
# ============================================================================

class Teacher:
    def __init__(self):
        self.salary = 0
        self.health = TEACHER_HEALTH_MAX
        self.energy = TEACHER_ENERGY_DEFAULT
        self.monthly_salary = TEACHER_MONTHLY_SALARY
        self.last_salary_week = 0

    def recover_energy(self):
        """班主任每周恢复精力到满值"""
        self.energy = TEACHER_ENERGY_DEFAULT


# ============================================================================
# --- 请假请求类 ---
# ============================================================================

class LeaveRequest:
    def __init__(self, student: Student, duration: int):
        self.student = student
        self.duration = duration
        self.requested_week: int = None
        self.approved: bool = None
        self.processed: bool = False  # 是否已处理


# ============================================================================
# --- 班级类 ---
# ============================================================================

class Class:
    def __init__(self, mode: GameMode = GameMode.Normal, 
                 classType: ClassType = ClassType.Science, 
                 studentNum: int = 50):
        self.mode = mode
        self.classType = classType
        self.studentNum = studentNum
        self.ended = False

        self.students: list = [Student(i, self, self.mode, self.classType) 
                               for i in range(1, self.studentNum + 1)]
        
        # 初始化学生间的关系 (双向)
        for s1 in self.students:
            for s2 in self.students:
                if s1.index != s2.index:
                    s1.relation[s2.index] = Relations.Normal
                    s2.relation[s1.index] = Relations.Normal
        
        # 座位分配
        self._initialize_seats()

        self.contests = {
            ContestType.Mid: [i * SEMESTER_LENGTH + SEMESTER_LENGTH // 2 for i in range(0, TOTAL_SEMESTERS)],
            ContestType.End: [i * SEMESTER_LENGTH for i in range(1, TOTAL_SEMESTERS)],
            ContestType.Final: [TOTAL_SEMESTERS * SEMESTER_LENGTH]
        }
        self.contestsHistory = []
        self.week = 0
        self.studentAliveNum = self.studentNum
        
        # 班主任
        self.teacher = Teacher()
        
        # 请假管理
        self.pending_leave_requests: list = []
        self.active_leaves: dict = {}  # {student_index: end_week}
        
        # 高考相关 (新增)
        self.university_database = get_university_database()
        self.gaokao_results: list = []  # 高考录取结果
        
        # 【新增】第一次考试成绩记录 (用于结算比较)
        self.first_exam_average: float = None

    def _initialize_seats(self):
        """初始化座位表"""
        shuffled_students = self.students.copy()
        r.shuffle(shuffled_students)
        
        self.seats = [[] for _ in range(SEAT_COLUMNS)]
        
        for i, student in enumerate(shuffled_students):
            col_idx = i % SEAT_COLUMNS
            row_idx = i // SEAT_COLUMNS
            
            student.seat_col = col_idx + 1  # 1-based
            student.seat_row = row_idx + 1  # 1-based
            
            # 确保列有足够的空间
            while len(self.seats[col_idx]) <= row_idx:
                self.seats[col_idx].append(None)
            self.seats[col_idx][row_idx] = student

    def _recalculate_seats(self):
        """重新计算座位表 (处理死亡学生)"""
        alive_students = [s for s in self.students if s.status != Status.Dead]
        
        self.seats = [[] for _ in range(SEAT_COLUMNS)]
        
        for i, student in enumerate(alive_students):
            col_idx = i % SEAT_COLUMNS
            row_idx = i // SEAT_COLUMNS
            
            student.seat_col = col_idx + 1
            student.seat_row = row_idx + 1
            
            while len(self.seats[col_idx]) <= row_idx:
                self.seats[col_idx].append(None)
            self.seats[col_idx][row_idx] = student
        
        # 填充剩余位置为 None
        total_seated = len(alive_students)
        for i in range(total_seated, self.studentNum):
            col_idx = i % SEAT_COLUMNS
            row_idx = i // SEAT_COLUMNS
            while len(self.seats[col_idx]) <= row_idx:
                self.seats[col_idx].append(None)
            self.seats[col_idx][row_idx] = None

    def nextWeek(self):
        """推进一周"""
        # 【关键修改 1】检查是否有未处理请假，有则阻止时间推进
        if self.pending_leave_requests:
            print(f"\n⛔ 无法进入下一周！有 {len(self.pending_leave_requests)} 个请假申请待处理！")
            print("💡 请使用 'sl' 查看申请，'al <编号> 1/0' 处理申请后再继续！")
            return False  # 返回 False 表示时间未推进
        
        if self.ended:
            raise ValueError("game is ended")
        if self.studentAliveNum == 0:
            self.fail()
            
        self.week += 1
        
        # 发放工资
        weeks_since_last_salary = self.week - self.teacher.last_salary_week
        if weeks_since_last_salary >= WEEKS_PER_MONTH:
            self.teacher.salary += self.teacher.monthly_salary
            self.teacher.last_salary_week = self.week
            print(f"💰 班主任获得月薪 {self.teacher.monthly_salary} RMB！")
        
        print(f"\n{'='*80}")
        print(f"📅 WEEK {self.week} BEGINS")
        print(f"👨‍🏫 Teacher Salary: {self.teacher.salary} RMB | Health: {self.teacher.health} | Energy: {self.teacher.energy}")
        print(f"📝 Pending leave requests: {len(self.pending_leave_requests)} | Active leaves: {len(self.active_leaves)}")
        print(f"{'='*80}")
        
        # 检查班主任精力
        if self.teacher.energy < TEACHER_ENERGY_WARNING:
            self.teacher.health -= TEACHER_HEALTH_EXAM_COST
            print(f"⚠️ 班主任精力不足{TEACHER_ENERGY_WARNING}，血量-{TEACHER_HEALTH_EXAM_COST}！当前血量：{self.teacher.health}")
        
        # 检查班主任是否死亡
        if self.teacher.health <= 0:
            print("\n💀 班主任血量归零！游戏结束！")
            self.ended = True
            return True
            
        # 恢复班主任精力到满值
        self.teacher.recover_energy()
        print(f"🔄 班主任精力恢复至 {TEACHER_ENERGY_DEFAULT}")
        
        # 生成请假申请
        if r.random() < LEAVE_REQUEST_PROB:
            normal_students = [s for s in self.students 
                              if s.status == Status.Normal and s.index not in self.active_leaves]
            if normal_students:
                num_applicants = r.randint(1, min(LEAVE_REQUEST_MAX_STUDENTS, len(normal_students)))
                applicants = r.sample(normal_students, num_applicants)
                
                for student in applicants:
                    duration = r.randint(LEAVE_DURATION_MIN, LEAVE_DURATION_MAX)
                    req = LeaveRequest(student, duration)
                    req.requested_week = self.week
                    self.pending_leave_requests.append(req)
                    print(f"📝 学生 {student.name} 申请请假 {duration} 周！（需本周处理）")
        
        # 检查请假到期
        expired_leaves = []
        for idx, end_week in list(self.active_leaves.items()):
            if self.week >= end_week:
                student = self._get_student_by_index(idx)
                if student and student.status == Status.Leave:
                    student.status = Status.Normal
                    student.leave_start_week = None
                    student.leave_end_week = None
                    expired_leaves.append(idx)
                    print(f"✅ 学生 {student.name} 请假结束，恢复正常状态！")
        
        for idx in expired_leaves:
            del self.active_leaves[idx]
        
        # 更新学生状态
        for student in self.students:
            if student.status == Status.Dead:
                continue
                
            if student.index in self.active_leaves:
                student.enthusiasm = max(STUDENT_ENTHUSIASM_MIN, 
                                        student.enthusiasm - STUDENT_ENTHUSIASM_DECAY_LEAVE)
                print(f"  - 学生 {student.name} 请假中，积极性-{STUDENT_ENTHUSIASM_DECAY_LEAVE}")
            else:
                student.updateWeekly()
            
        # 更新关系
        self.update_relations()
            
        # 考试检查
        if self.week in self.contests[ContestType.Mid]:
            self.contest(ContestType.Mid)
        elif self.week in self.contests[ContestType.End]:
            self.contest(ContestType.End)
        elif self.week in self.contests[ContestType.Final]:
            self.last_ditch()
            
        if self.week % SEMESTER_LENGTH == 1:
            self.semesterStart()
        elif self.week % SEMESTER_LENGTH == 0:
            self.semesterEnd()
        
        return True  # 返回 True 表示时间已推进

    def _get_student_by_index(self, index: int) -> Student:
        """通过 1-based 索引获取学生"""
        if 1 <= index <= self.studentNum:
            return self.students[index - 1]
        return None

    def update_relations(self):
        """更新学生间的关系"""
        for student1 in self.students:
            if student1.status == Status.Dead or student1.index in self.active_leaves:
                continue
            for student2 in self.students:
                if student1.index == student2.index:
                    continue
                if student2.status == Status.Dead or student2.index in self.active_leaves:
                    continue
                    
                current_rel = student1.relation.get(student2.index, Relations.Normal)
                
                if current_rel == Relations.Self:
                    continue
                
                # 1. 性格相近提升关系
                char_diff = (abs(student1.character[0] - student2.character[0]) + 
                            abs(student1.character[1] - student2.character[1]))
                if char_diff < RELATION_IMPROVE_CHAR_DIFF:
                    if current_rel == Relations.Normal:
                        if r.random() < RELATION_NORMAL_TO_BETTER:
                            student1.relation[student2.index] = Relations.Better
                            student2.relation[student1.index] = Relations.Better
                    elif current_rel == Relations.Better:
                        if r.random() < RELATION_BETTER_TO_FRIEND:
                            student1.relation[student2.index] = Relations.Friend
                            student2.relation[student1.index] = Relations.Friend
                
                # 2. 随机关系变化
                if r.random() < RELATION_RANDOM_HATING:
                    student1.relation[student2.index] = Relations.Hating
                    student2.relation[student1.index] = Relations.Hating
                
                if student1.gender != student2.gender and r.random() < RELATION_LOVING_DIFFERENT_GENDER:
                    student1.relation[student2.index] = Relations.Loving
                    student2.relation[student1.index] = Relations.Loving
                
                if student1.gender == student2.gender and r.random() < RELATION_LOVING_SAME_GENDER:
                    student1.relation[student2.index] = Relations.Loving
                    student2.relation[student1.index] = Relations.Loving
                
                # 3. 邻座特殊影响
                neighbors = student1.get_neighbors()
                if student2 in neighbors:
                    if current_rel == Relations.Normal and r.random() < RELATION_NEIGHBOR_FRIEND:
                        new_rel = r.choice([Relations.Better, Relations.Friend])
                        student1.relation[student2.index] = new_rel
                        student2.relation[student1.index] = new_rel
                    elif current_rel == Relations.Normal and r.random() < RELATION_NEIGHBOR_DISLIKE:
                        student1.relation[student2.index] = Relations.Disliking
                        student2.relation[student1.index] = Relations.Disliking

    def approve_leave_request(self, request_index: int, approved: bool) -> bool:
        """处理请假申请"""
        if 0 <= request_index < len(self.pending_leave_requests):
            req = self.pending_leave_requests[request_index]
            student = req.student
            
            if approved:
                student.status = Status.Leave
                start_week = self.week
                end_week = start_week + req.duration
                self.active_leaves[student.index] = end_week
                student.leave_start_week = start_week
                student.leave_end_week = end_week
                print(f"✅ 批准学生 {student.name} 请假 {req.duration} 周！（至第 {end_week} 周）")
            else:
                student.energy = max(STUDENT_ENERGY_MIN, student.energy - 15)
                print(f"❌ 拒绝学生 {student.name} 请假申请！学生精力 -15，当前精力：{student.energy:.1f}")
            
            req.approved = approved
            req.processed = True
            self.pending_leave_requests.pop(request_index)
            return True
        else:
            print("无效的请假申请编号！")
            return False

    def _calculate_exam_score(self, student: Student, subject: Subject, base_score: int) -> float:
        """计算单科考试成绩 (提取重复逻辑)"""
        if subject not in student.learnCap:
            return 0.0
            
        # 1. 基础分：能力值映射
        base_part = student.learnCap[subject] * base_score / 100.0
        
        # 2. 积极性加成
        enthusiasm_bonus = base_score * SCORE_WEIGHT_ENTHUSIASM * (student.enthusiasm / STUDENT_ENTHUSIASM_MAX)
        
        # 3. 智商加成
        iq_bonus = base_score * SCORE_WEIGHT_IQ * (student.IQ / 100.0)
        
        # 4. 精力微调
        energy_adj = base_score * SCORE_WEIGHT_ENERGY * ((student.energy - 50) / 50.0)
        
        # 5. 随机波动
        fluctuation = r.gauss(0, base_score * SCORE_FLUCTUATION_STD)
        
        # 综合计算
        subject_score = base_part + enthusiasm_bonus + iq_bonus + energy_adj + fluctuation
        return max(0, min(base_score, subject_score))

    def _process_exam_results(self, student: Student, total_score: float, 
                             student_scores: dict, exam_results: list, 
                             class_total_sum: float, alive_count: int,
                             is_first_exam: bool = False) -> tuple:
        """处理考试结果 (提取重复逻辑)"""
        # 成绩影响机制
        prev_score = student.previous_score
        if prev_score is not None:
            score_diff = total_score - prev_score
            if score_diff > 0:
                improvement_factor = min(1.0, score_diff / SCORE_DIFF_THRESHOLD)
                student.score_change_factor = -abs(improvement_factor * SCORE_IMPROVEMENT_FACTOR)
            else:
                decline_factor = abs(score_diff) / SCORE_DIFF_THRESHOLD
                student.score_change_factor = decline_factor * SCORE_DECLINE_FACTOR
        
        student.previous_score = total_score
        
        # 【新增】记录第一次考试成绩
        if is_first_exam and student.first_exam_score is None:
            student.first_exam_score = total_score
        
        exam_results.append({
            'student_index': student.index,
            'name': student.name,
            'total_score': total_score,
            'iq': student.IQ,
            'enthusiasm': student.enthusiasm,
            'energy': student.energy,
            'scores': {k.name: v for k, v in student_scores.items()}
        })
        class_total_sum += total_score
        alive_count += 1
        
        student.energy = max(STUDENT_ENERGY_MIN, student.energy - STUDENT_ENERGY_EXAM_COST)
        
        return class_total_sum, alive_count

    def contest(self, type: ContestType):
        """进行考试"""
        print(f"\n{'='*80}")
        print(f"📝 WEEK {self.week} - {type.name} EXAMINATION")
        print(f"{'='*80}")
        
        SUBJECT_SCORES = self._get_subject_scores()

        exam_results = []
        class_total_sum = 0.0
        alive_student_count = 0
        
        # 判断是否为第一次考试
        is_first_exam = (len(self.contestsHistory) == 0)
        
        for student in self.students:
            if student.status == Status.Dead or student.index in self.active_leaves:
                continue
                
            student_scores = {}
            total_score = 0.0
            
            for subject, base_score in SUBJECT_SCORES.items():
                subject_score = self._calculate_exam_score(student, subject, base_score)
                student_scores[subject] = int(round(subject_score))
                total_score += student_scores[subject]
            
            class_total_sum, alive_student_count = self._process_exam_results(
                student, total_score, student_scores, exam_results, 
                class_total_sum, alive_student_count, is_first_exam)
            
        avg_score = class_total_sum / alive_student_count if alive_student_count > 0 else 0
        
        # 【新增】记录第一次考试平均分
        if is_first_exam and self.first_exam_average is None:
            self.first_exam_average = avg_score
            print(f"\n📊 第一次考试平均分：{avg_score:.1f} (将作为结算基准)")
            
        self._print_exam_results(exam_results, class_total_sum, alive_student_count, type)

        self.contestsHistory.append({
            'week': self.week,
            'type': type,
            'average': avg_score,
            'details': exam_results
        })

    def _get_subject_scores(self) -> dict:
        """获取科目满分配置"""
        if self.classType == ClassType.Science:
            return {
                Subject.Chinese: 150, Subject.Maths: 150, Subject.English: 150,
                Subject.Physics: 100, Subject.Chemistry: 100, Subject.Biology: 100
            }
        else:
            return {
                Subject.Chinese: 150, Subject.Maths: 150, Subject.English: 150,
                Subject.Politics: 100, Subject.History: 100, Subject.Geography: 100
            }

    def _print_exam_results(self, exam_results: list, class_total_sum: float, 
                           alive_student_count: int, type: ContestType):
        """打印考试结果"""
        avg_score = class_total_sum / alive_student_count if alive_student_count > 0 else 0
        
        exam_results.sort(key=lambda x: x['total_score'], reverse=True)
        
        if self.classType == ClassType.Science:
            subjects_header = f"{'Chin':<6} {'Math':<6} {'Eng':<6} {'Phy':<6} {'Chem':<6} {'Bio':<6}"
        else:
            subjects_header = f"{'Chin':<6} {'Math':<6} {'Eng':<6} {'Pol':<6} {'Hist':<6} {'Geo':<6}"
        
        exam_type = "Final" if type == ContestType.Final else "Examination"
        print(f"{exam_type} Results:")
        print(f"Students participated: {alive_student_count}, Average score: {avg_score:.1f}")
        print(f"Top 10 Students:")
        print(f"{'Rank':<4} {'Name':<12} {'Total':<6} {'IQ':<4} {'Enth':<6} {'Ener':<6}")
        print(f"{'':<4} {'':<12} {'':<6} {'':<4} {'':<6} {'':<6} {subjects_header}")
        print("-" * 80)
        
        for i, result in enumerate(exam_results[:10], 1):
            scores = result['scores']
            if self.classType == ClassType.Science:
                subj_line = f"{scores.get('Chinese', 0):<6} {scores.get('Maths', 0):<6} {scores.get('English', 0):<6} {scores.get('Physics', 0):<6} {scores.get('Chemistry', 0):<6} {scores.get('Biology', 0):<6}"
            else:
                subj_line = f"{scores.get('Chinese', 0):<6} {scores.get('Maths', 0):<6} {scores.get('English', 0):<6} {scores.get('Politics', 0):<6} {scores.get('History', 0):<6} {scores.get('Geography', 0):<6}"
                
            print(f"{i:<4} {result['name']:<12} {result['total_score']:<6} {result['iq']:<4} {result['enthusiasm']:<6.1f} {result['energy']:<6.1f}")
            print(f"{'':<4} {'':<12} {'':<6} {'':<4} {'':<6} {'':<6} {subj_line}")
        
        if len(exam_results) > 10:
            print(f"... and {len(exam_results)-10} more students")
        
        if exam_results:
            score_range = f"{min([e['total_score'] for e in exam_results]):<6} - {max([e['total_score'] for e in exam_results]):<6}"
            print(f"Score Range: {score_range}")
        print(f"{'='*80}\n")

    def semesterStart(self):
        print(f"📚 week: {self.week} new semester starts")

    def semesterEnd(self):
        print(f"📚 week: {self.week} semester ended")

    def fail(self):
        print("💀 All students have died! Game over.")
        self.ended = True

    def _assign_university(self, student: Student, gaokao_score: int) -> University:
        """根据高考成绩分配大学"""
        # 获取该班型可用的大学列表
        available_unis = [u for u in self.university_database 
                         if u.get_score_requirement(self.classType) <= gaokao_score + GAOKAO_UNIVERSITY_ASSIGN_RANDOM]
        
        if not available_unis:
            # 没有匹配的大学，返回最低 tier
            return self.university_database[-1]
        
        # 按分数线排序，优先匹配分数线接近的学校
        available_unis.sort(key=lambda u: u.get_score_requirement(self.classType), reverse=True)
        
        # 有一定随机性：从前 5 所匹配的学校中随机选择
        top_matches = available_unis[:min(5, len(available_unis))]
        selected_uni = r.choice(top_matches)
        
        return selected_uni

    def _calculate_gaokao_score(self, student: Student) -> int:
        """计算高考成绩"""
        # 基于平时成绩 + 随机波动
        base_score = student.previous_score if student.previous_score else 600
        # 高考成绩波动
        fluctuation = r.randint(-GAOKAO_SCORE_RANDOM_RANGE, GAOKAO_SCORE_RANDOM_RANGE)
        # 积极性影响
        enthusiasm_bonus = int((student.enthusiasm - 50) * 0.3)
        # 精力影响
        energy_bonus = int((student.energy - 50) * 0.2)
        
        gaokao_score = base_score + fluctuation + enthusiasm_bonus + energy_bonus
        gaokao_score = max(0, min(GAOKAO_TOTAL_SCORE, gaokao_score))
        
        return gaokao_score

    def last_ditch(self):
        """高考 (Final Exam)"""
        print(f"\n{'='*80}")
        print(f"🎓 WEEK {self.week} - 高考 (GAOKAO)")
        print(f"{'='*80}")
        
        SUBJECT_SCORES = self._get_subject_scores()

        exam_results = []
        class_total_sum = 0.0
        alive_student_count = 0
        
        print(f"\n📊 高考成绩计算中...")
        
        for student in self.students:
            if student.status == Status.Dead or student.index in self.active_leaves:
                continue
                
            student_scores = {}
            total_score = 0.0
            
            for subject, base_score in SUBJECT_SCORES.items():
                subject_score = self._calculate_exam_score(student, subject, base_score)
                student_scores[subject] = int(round(subject_score))
                total_score += student_scores[subject]
            
            class_total_sum, alive_student_count = self._process_exam_results(
                student, total_score, student_scores, exam_results,
                class_total_sum, alive_student_count, is_first_exam=False)
            
            # 计算高考成绩
            student.gaokao_score = self._calculate_gaokao_score(student)
            
            # 分配大学
            student.admitted_university = self._assign_university(student, student.gaokao_score)
            
            self.gaokao_results.append({
                'student': student,
                'gaokao_score': student.gaokao_score,
                'university': student.admitted_university
            })
            
            print(f"  {student.name}: 高考{student.gaokao_score}分 → {student.admitted_university}")
        
        self._print_exam_results(exam_results, class_total_sum, alive_student_count, ContestType.Final)

        self.contestsHistory.append({
            'week': self.week,
            'type': ContestType.Final,
            'average': class_total_sum / alive_student_count if alive_student_count > 0 else 0,
            'details': exam_results
        })
        
        self.ended = True

    def _generate_teaching_evaluation(self) -> tuple:
        """【修改】根据进步幅度生成教学评价"""
        if self.first_exam_average is None or not self.gaokao_results:
            return "无数据", "⚠️ 无法评价"
        
        # 计算高考平均分
        gaokao_scores = [r['gaokao_score'] for r in self.gaokao_results]
        gaokao_average = sum(gaokao_scores) / len(gaokao_scores)
        
        # 计算进步幅度
        progress = gaokao_average - self.first_exam_average
        progress_rate = progress / self.first_exam_average * 100 if self.first_exam_average > 0 else 0
        
        # 统计各层次大学录取人数
        tier_counts = {tier: 0 for tier in UniversityTier}
        for result in self.gaokao_results:
            uni = result['university']
            if uni:
                tier_counts[uni.tier] += 1
        
        total_students = len(self.gaokao_results)
        key_uni_count = (tier_counts[UniversityTier.TIER_985] + 
                        tier_counts[UniversityTier.TIER_211] + 
                        tier_counts[UniversityTier.TIER_DOUBLE_FIRST])
        key_uni_rate = key_uni_count / total_students * 100 if total_students > 0 else 0
        
        # 综合评分 (进步幅度 60% + 重点率 40%)
        composite_score = progress_rate * 3 + key_uni_rate * 2
        
        # 生成评价
        if composite_score >= 150:
            evaluation = "🏆 特级教师！学生进步显著，升学质量卓越！"
        elif composite_score >= 100:
            evaluation = "🥇 优秀教师！教学效果突出，学生大幅提升！"
        elif composite_score >= 50:
            evaluation = "🥈 合格教师！学生稳中有进，完成教学目标！"
        elif composite_score >= 0:
            evaluation = "🥉 基本合格！学生略有进步，仍有提升空间！"
        else:
            evaluation = "⚠️ 教学需改进！学生成绩退步，建议反思方法！"
        
        summary = f"首次考试平均：{self.first_exam_average:.1f} | 高考平均：{gaokao_average:.1f} | 进步：{progress:+.1f}分 ({progress_rate:+.1f}%) | 重点率：{key_uni_rate:.1f}%"
        
        return summary, evaluation

    def _print_gaokao_summary(self):
        """打印高考总结"""
        print(f"\n{'='*80}")
        print(f"🎓 高考录取结果统计")
        print(f"{'='*80}")
        
        # 统计各层次大学录取人数
        tier_counts = {tier: 0 for tier in UniversityTier}
        tier_names = {
            UniversityTier.TIER_985: "985 工程",
            UniversityTier.TIER_211: "211 工程",
            UniversityTier.TIER_DOUBLE_FIRST: "双一流",
            UniversityTier.TIER_TIER1: "一本",
            UniversityTier.TIER_TIER2: "二本",
            UniversityTier.TIER_TIER3: "三本/专科"
        }
        
        for result in self.gaokao_results:
            uni = result['university']
            if uni:
                tier_counts[uni.tier] += 1
        
        total_students = len(self.gaokao_results)
        
        print(f"\n📊 录取统计 (共{total_students}人参加高考):")
        print("-" * 60)
        for tier in UniversityTier:
            count = tier_counts[tier]
            rate = count / total_students * 100 if total_students > 0 else 0
            print(f"  {tier_names[tier]:<15} {count:>3}人  ({rate:>5.1f}%)")
        
        # 计算重点大学录取率
        key_uni_count = (tier_counts[UniversityTier.TIER_985] + 
                        tier_counts[UniversityTier.TIER_211] + 
                        tier_counts[UniversityTier.TIER_DOUBLE_FIRST])
        key_uni_rate = key_uni_count / total_students * 100 if total_students > 0 else 0
        
        print(f"\n  重点大学 (985/211/双一流) 录取率：{key_uni_rate:.1f}%")
        print(f"  一本及以上录取率：{(key_uni_count + tier_counts[UniversityTier.TIER_TIER1]) / total_students * 100:.1f}%")
        
        # 高考成绩统计
        if self.gaokao_results:
            scores = [r['gaokao_score'] for r in self.gaokao_results]
            print(f"\n📈 高考成绩统计:")
            print(f"  最高分：{max(scores)}")
            print(f"  最低分：{min(scores)}")
            print(f"  平均分：{sum(scores) / len(scores):.1f}")
        
        print(f"{'='*80}\n")
        
        # 详细录取名单
        print(f"🎓 详细录取名单:")
        print("-" * 80)
        print(f"{'姓名':<12} {'高考分':<8} {'录取大学':<25} {'层次'}")
        print("-" * 80)
        
        # 按分数排序
        sorted_results = sorted(self.gaokao_results, key=lambda x: x['gaokao_score'], reverse=True)
        
        for result in sorted_results:
            student = result['student']
            score = result['gaokao_score']
            uni = result['university']
            uni_name = uni.name if uni else "未录取"
            uni_tier = uni.tier.value if uni else "无"
            print(f"{student.name:<12} {score:<8} {uni_name:<25} {uni_tier}")
        
        print("-" * 80)

    # ========================================================================
    # 【新增】班会功能
    # ========================================================================
    
    def hold_class_meeting(self) -> bool:
        """召开班会"""
        if self.teacher.energy < TEACHER_CLASS_MEETING_ENERGY_COST:
            print(f"班主任精力不足{TEACHER_CLASS_MEETING_ENERGY_COST}，无法召开班会！")
            return False
            
        if self.teacher.salary < TEACHER_CLASS_MEETING_COST:
            print(f"资金不足！需要{TEACHER_CLASS_MEETING_COST}元，当前工资：{self.teacher.salary}元")
            return False
        
        self.teacher.energy -= TEACHER_CLASS_MEETING_ENERGY_COST
        self.teacher.salary -= TEACHER_CLASS_MEETING_COST
        
        # 随机选择班会类型
        meeting_type = r.choice(list(ClassMeetingType))
        
        print(f"\n📢 召开班会：{meeting_type.value}")
        print("-" * 60)
        
        alive_students = [s for s in self.students if s.status != Status.Dead and s.index not in self.active_leaves]
        
        if meeting_type == ClassMeetingType.CHICKEN_SOUP:
            # 鸡汤班会：积极性大幅提升，但下周精力消耗增加
            print("🍲 班主任端出一碗热气腾腾的鸡汤...")
            for student in alive_students:
                student.enthusiasm = min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + 8)
                student.score_change_factor += 0.3  # 下周积极性衰减增加
            print(f"效果：全班积极性 +8，但下周压力增大！")
            
        elif meeting_type == ClassMeetingType.THREAT:
            # 恐吓班会：积极性提升，但部分学生可能崩溃
            print("😠 班主任拍桌怒吼：'再不好好学都去搬砖！'")
            for student in alive_students:
                if r.random() < 0.1:  # 10% 概率崩溃
                    student.enthusiasm = max(STUDENT_ENTHUSIASM_MIN, student.enthusiasm - 10)
                    student.energy = max(STUDENT_ENERGY_MIN, student.energy - 5)
                    print(f"  ⚠️ {student.name} 被吓哭了！积极性 -10，精力 -5")
                else:
                    student.enthusiasm = min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + 5)
            print(f"效果：大部分学生积极性 +5，少数学生崩溃！")
            
        elif meeting_type == ClassMeetingType.AWARD:
            # 表彰班会：前 30% 学生大幅提升，后 30% 学生受打击
            print("🏆 班主任表彰优秀学生...")
            alive_students.sort(key=lambda s: s.previous_score if s.previous_score else 0, reverse=True)
            top_count = len(alive_students) // 3
            bottom_count = len(alive_students) // 3
            
            for i, student in enumerate(alive_students):
                if i < top_count:
                    student.enthusiasm = min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + 10)
                    student.energy = min(STUDENT_ENERGY_MAX, student.energy + 3)
                elif i >= len(alive_students) - bottom_count:
                    student.enthusiasm = max(STUDENT_ENTHUSIASM_MIN, student.enthusiasm - 3)
                    print(f"  😢 {student.name} 受到打击...积极性 -3")
            print(f"效果：前 30% 学生积极性 +10 精力 +3，后 30% 学生积极性 -3！")
            
        elif meeting_type == ClassMeetingType.FREE:
            # 自由班会：完全随机
            print("🎲 学生自由发言，场面一度失控...")
            effect = r.randint(-15, 15)
            for student in alive_students:
                if effect > 0:
                    student.enthusiasm = min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + effect)
                else:
                    student.enthusiasm = max(STUDENT_ENTHUSIASM_MIN, student.enthusiasm + effect)
            print(f"效果：全班积极性 {effect:+d}！(这很随机)")
            
        elif meeting_type == ClassMeetingType.COMPLAINT:
            # 吐槽大会：精力恢复，但积极性下降
            print("💬 学生轮流吐槽，班主任默默记在小本本上...")
            for student in alive_students:
                student.energy = min(STUDENT_ENERGY_MAX, student.energy + 5)
                student.enthusiasm = max(STUDENT_ENTHUSIASM_MIN, student.enthusiasm - 2)
            print(f"效果：全班精力 +5，但积极性 -2 (吐槽累了)")
            
        elif meeting_type == ClassMeetingType.SURPRISE:
            # 惊喜班会：极小概率触发超级 buff
            print("🎁 班主任突然宣布：'今天放假一天！'")
            if r.random() < 0.2:  # 20% 概率真放假
                for student in alive_students:
                    student.enthusiasm = min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + 15)
                    student.energy = min(STUDENT_ENERGY_MAX, student.energy + 10)
                print(f"🎉 效果：全班积极性 +15，精力 +10！(学生们沸腾了)")
            else:
                for student in alive_students:
                    student.enthusiasm = max(STUDENT_ENTHUSIASM_MIN, student.enthusiasm - 5)
                print(f"😅 效果：'开玩笑的，加套卷子！' 全班积极性 -5")
        
        print("-" * 60)
        print(f"💰 花费：{TEACHER_CLASS_MEETING_COST}元 | 精力：-{TEACHER_CLASS_MEETING_ENERGY_COST}")
        return True

    def randomStudent(self) -> Student:
        return r.choice([s for s in self.students if s.status != Status.Dead])

    def printSeats(self):
        if not self.students:
            print("No students.")
            return
        max_row = (self.studentNum + SEAT_COLUMNS - 1) // SEAT_COLUMNS
        print(f"\n--- 座位表 (共{self.studentNum}人，{SEAT_COLUMNS} 列) ---")
        print("讲台")
        print("-" * 60)
        for r_idx in range(1, max_row + 1):
            row_str = f"第{r_idx}排:\t"
            for c_idx in range(1, SEAT_COLUMNS + 1):
                student_list = self.seats[c_idx - 1]
                if r_idx <= len(student_list):
                    s = student_list[r_idx - 1]
                    if s is not None:
                        name_display = s.name[:NAME_DISPLAY_LENGTH]
                        row_str += f"[{name_display}]\t"
                    else:
                        row_str += "[空]\t"
                else:
                    row_str += "[空]\t"
            print(row_str)
        print("-" * 60)

    def expel_student(self, student_index: int) -> bool:
        """劝退学生"""
        if 1 <= student_index <= self.studentNum:
            student = self.students[student_index - 1]
            if student.status == Status.Dead:
                print(f"学生 {student.name} 已经被劝退了！")
                return False
            
            # 0.5概率被殴打
            if r.random() < 0.5:
                print(f"学生 {student.name} 拒绝被劝退，反而殴打了班主任！")
                self.teacher.health -= 2
                print(f"班主任血量 -2，当前血量：{self.teacher.health}")
                
                if self.teacher.health <= 0:
                    print("\n班主任因被殴打过多而倒下！游戏结束！")
                    self.ended = True
                    return False
            
            student.status = Status.Dead
            self.studentAliveNum -= 1
            
            # 更新座位表
            self._recalculate_seats()
            
            # 清理请假记录
            if student.index in self.active_leaves:
                del self.active_leaves[student.index]
            
            print(f"学生 {student.name} 被成功劝退！")
            return True
        else:
            print(f"无效的学生编号：{student_index}")
            return False

    def find_student_by_name(self, name: str) -> Student:
        for student in self.students:
            if student.name == name:
                return student
        return None

    def swap_seats(self, student1_index: int, student2_index: int) -> bool:
        """交换两个学生的座位"""
        if not (1 <= student1_index <= self.studentNum and 1 <= student2_index <= self.studentNum):
            print("学生编号超出范围！")
            return False
            
        s1 = self.students[student1_index - 1]
        s2 = self.students[student2_index - 1]
        
        if s1.status == Status.Dead or s2.status == Status.Dead:
            print("不能与已劝退的学生交换座位！")
            return False

        orig_s1_col, orig_s1_row = s1.seat_col, s1.seat_row
        orig_s2_col, orig_s2_row = s2.seat_col, s2.seat_row
        
        s1.seat_col, s1.seat_row = orig_s2_col, orig_s2_row
        s2.seat_col, s2.seat_row = orig_s1_col, orig_s1_row
        
        self.seats[orig_s1_col - 1][orig_s1_row - 1] = s2
        self.seats[orig_s2_col - 1][orig_s2_row - 1] = s1
        
        print(f"学生 {s1.name} 和 {s2.name} 的座位已交换！")
        return True

    def randomize_seats(self):
        """全班随机重排座位"""
        alive_students = [s for s in self.students if s.status != Status.Dead]
        r.shuffle(alive_students)
        
        self.seats = [[] for _ in range(SEAT_COLUMNS)]
        for i, student in enumerate(alive_students):
            col_idx = i % SEAT_COLUMNS
            row_idx = i // SEAT_COLUMNS
            student.seat_col = col_idx + 1
            student.seat_row = row_idx + 1
            while len(self.seats[col_idx]) <= row_idx:
                self.seats[col_idx].append(None)
            self.seats[col_idx][row_idx] = student
            
        # 填充剩余位置
        total_seated = len(alive_students)
        for i in range(total_seated, self.studentNum):
            col_idx = i % SEAT_COLUMNS
            row_idx = i // SEAT_COLUMNS
            while len(self.seats[col_idx]) <= row_idx:
                self.seats[col_idx].append(None)
            self.seats[col_idx][row_idx] = None
            
        print("全班座位已随机重排！")
        
    def list_alive_students(self) -> list:
        alive = [s for s in self.students if s.status != Status.Dead]
        print(f"当前存活学生 ({len(alive)}人):")
        for i, student in enumerate(alive, 1):
            status = "请假中" if student.index in self.active_leaves else "正常"
            print(f"{i}. [{student.index}] {student.name} ({status}) (能量:{student.energy:.1f}, 积极性:{student.enthusiasm:.1f})")
        return alive

    def list_dead_students(self):
        dead = [s for s in self.students if s.status == Status.Dead]
        if dead:
            print(f"已劝退学生 ({len(dead)}人):")
            for student in dead:
                print(f"- [{student.index}] {student.name}")
        else:
            print("暂无劝退学生")

    def get_week_info(self) -> str:
        semester = (self.week - 1) // SEMESTER_LENGTH + 1
        week_in_semester = (self.week - 1) % SEMESTER_LENGTH + 1
        months_passed = self.week // WEEKS_PER_MONTH
        weeks_since_month_start = self.week % WEEKS_PER_MONTH
        return f"第{semester}学期 第{week_in_semester}周 (总第{self.week}周) - 第{months_passed}个月第{weeks_since_month_start}周"

    def show_relations(self, student_index: int):
        if not (1 <= student_index <= self.studentNum):
            print(f"无效的学生编号：{student_index}")
            return
            
        student = self.students[student_index - 1]
        if student.status == Status.Dead:
            print(f"学生 {student.name} 已死亡，无法查看关系。")
            return
            
        print(f"\n{student.name} ({student.index}) 的关系状况:")
        print(f"{'关系对象':<15} {'类型':<10} {'对象编号'}")
        print("-" * 40)
        
        for other_idx, relation in student.relation.items():
            if other_idx == student.index:
                continue
            other_student = self._get_student_by_index(other_idx)
            if other_student and other_student.status != Status.Dead:
                print(f"{other_student.name:<15} {relation.name:<10} {other_idx}")

    def instigate(self, student1_index: int, student2_index: int) -> bool:
        if not (1 <= student1_index <= self.studentNum and 1 <= student2_index <= self.studentNum):
            print("学生编号超出范围！")
            return False
            
        s1 = self.students[student1_index - 1]
        s2 = self.students[student2_index - 1]
        
        if s1.status == Status.Dead or s2.status == Status.Dead:
            print("不能对已劝退的学生进行挑拨！")
            return False
            
        if s1.relation.get(s2.index) == Relations.Loving or s2.relation.get(s1.index) == Relations.Loving:
            print(f"挑拨离间情侣关系！班主任血量-{TEACHER_HEALTH_INSTIGATE_LOVING}！")
            self.teacher.health -= TEACHER_HEALTH_INSTIGATE_LOVING
            print(f"当前班主任血量：{self.teacher.health}")
        elif s1.gender == Gender.Boy and s2.gender == Gender.Boy:
            print(f"挑拨离间两个男生！班主任血量-{TEACHER_HEALTH_INSTIGATE_BOY}！")
            self.teacher.health -= TEACHER_HEALTH_INSTIGATE_BOY
            print(f"当前班主任血量：{self.teacher.health}")
        else:
            print(f"挑拨离间普通学生关系。")
        
        if self.teacher.health <= 0:
            print("\n班主任血量归零！游戏结束！")
            self.ended = True
            return False
            
        current_rel = s1.relation.get(s2.index, Relations.Normal)
        
        if r.random() < RELATION_INSTIGATE_SUCCESS:
            if current_rel == Relations.Loving:
                new_rel = Relations.Disliking
            elif current_rel == Relations.Friend:
                new_rel = Relations.Disliking
            elif current_rel == Relations.Better:
                new_rel = Relations.Normal
            elif current_rel == Relations.Normal:
                new_rel = Relations.Disliking
            elif current_rel == Relations.Disliking:
                new_rel = Relations.Hating
            else:
                new_rel = Relations.Hating
                
            s1.relation[s2.index] = new_rel
            s2.relation[s1.index] = new_rel
            
            print(f"挑拨成功！{s1.name} 和 {s2.name} 的关系从 {current_rel.name} 降为 {new_rel.name}")
            return True
        else:
            print(f"挑拨失败！{s1.name} 和 {s2.name} 的关系没有改变。")
            return False
    
    def buy_medicine(self) -> bool:
        if self.teacher.salary < TEACHER_MEDICINE_COST:
            print(f"资金不足！需要{TEACHER_MEDICINE_COST}元，当前工资：{self.teacher.salary}元")
            return False
            
        self.teacher.salary -= TEACHER_MEDICINE_COST
        self.teacher.health = min(TEACHER_HEALTH_MAX, self.teacher.health + TEACHER_MEDICINE_HEAL)
        print(f"购买药品成功！花费{TEACHER_MEDICINE_COST}元，血量+{TEACHER_MEDICINE_HEAL}，当前血量：{self.teacher.health}，剩余工资：{self.teacher.salary}")
        return True
    
    def counsel_student(self, student_index: int) -> bool:
        if not (1 <= student_index <= self.studentNum):
            print("学生编号超出范围！")
            return False
            
        student = self.students[student_index - 1]
        if student.status == Status.Dead or student.index in self.active_leaves:
            print("学生已死亡或正在请假，无法约谈！")
            return False
            
        if self.teacher.energy < TEACHER_COUNSEL_ENERGY_COST:
            print("班主任精力不足 20，无法进行约谈！")
            return False
            
        self.teacher.energy -= TEACHER_COUNSEL_ENERGY_COST
        print(f"班主任精力-{TEACHER_COUNSEL_ENERGY_COST}，当前精力：{self.teacher.energy}")
        
        success = r.random() < COUNSEL_SUCCESS_RATE
        
        if success:
            student.enthusiasm = min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + STUDENT_ENTHUSIASM_COUNSEL_GAIN)
            print(f"约谈成功！{student.name} 积极性+{STUDENT_ENTHUSIASM_COUNSEL_GAIN}，当前积极性：{student.enthusiasm:.1f}")
        else:
            self.teacher.health -= TEACHER_HEALTH_COUNSEL_FAIL
            print(f"约谈失败！{student.name} 不听劝告，还殴打了老师！班主任血量-{TEACHER_HEALTH_COUNSEL_FAIL}，当前血量：{self.teacher.health}")
            
        if self.teacher.health <= 0:
            print("\n班主任血量归零！游戏结束！")
            self.ended = True
            return False
            
        return True
    
    def organize_activity(self) -> bool:
        if self.teacher.energy < TEACHER_ACTIVITY_ENERGY_COST:
            print("班主任精力不足 60，无法组织活动！")
            return False
            
        self.teacher.energy -= TEACHER_ACTIVITY_ENERGY_COST
        print(f"班主任精力-{TEACHER_ACTIVITY_ENERGY_COST}，当前精力：{self.teacher.energy}")
        
        success = r.random() < ACTIVITY_SUCCESS_RATE
        
        if success:
            print("活动组织成功！")
            for student in self.students:
                if student.status != Status.Dead and student.index not in self.active_leaves:
                    student.enthusiasm = min(STUDENT_ENTHUSIASM_MAX, student.enthusiasm + STUDENT_ENTHUSIASM_ACTIVITY_GAIN)
                    student.energy = max(STUDENT_ENERGY_MIN, student.energy - STUDENT_ENERGY_ACTIVITY_COST)
            print(f"正常状态学生积极性+{STUDENT_ENTHUSIASM_ACTIVITY_GAIN}，精力-{STUDENT_ENERGY_ACTIVITY_COST}")
        else:
            print("活动组织失败！")
            for student in self.students:
                if student.status != Status.Dead and student.index not in self.active_leaves:
                    student.enthusiasm = max(STUDENT_ENTHUSIASM_MIN, student.enthusiasm - STUDENT_ENTHUSIASM_ACTIVITY_LOSS)
                    student.energy = max(STUDENT_ENERGY_MIN, student.energy - STUDENT_ENERGY_ACTIVITY_COST)
            print(f"正常状态学生积极性-{STUDENT_ENTHUSIASM_ACTIVITY_LOSS}，精力-{STUDENT_ENERGY_ACTIVITY_COST}")
        return True
    
    def treat_student(self, student_index: int) -> bool:
        if not (1 <= student_index <= self.studentNum):
            print("学生编号超出范围！")
            return False
            
        student = self.students[student_index - 1]
        if student.status == Status.Dead or student.index in self.active_leaves:
            print("学生已死亡或正在请假，无法请客！")
            return False
            
        if self.teacher.energy < TEACHER_TREAT_SINGLE_ENERGY_COST:
            print("班主任精力不足 30，无法请学生吃饭！")
            return False
            
        if self.teacher.salary < TEACHER_TREAT_SINGLE_COST:
            print(f"资金不足！需要{TEACHER_TREAT_SINGLE_COST}元，当前工资：{self.teacher.salary}元")
            return False
            
        self.teacher.energy -= TEACHER_TREAT_SINGLE_ENERGY_COST
        self.teacher.salary -= TEACHER_TREAT_SINGLE_COST
        student.energy = min(STUDENT_ENERGY_MAX, student.energy + STUDENT_ENERGY_TREAT_SINGLE)
        
        print(f"请{student.name}吃饭成功！花费{TEACHER_TREAT_SINGLE_COST}元，班主任精力-{TEACHER_TREAT_SINGLE_ENERGY_COST}，学生精力+{STUDENT_ENERGY_TREAT_SINGLE}")
        print(f"班主任当前精力：{self.teacher.energy}，工资：{self.teacher.salary}，学生精力：{student.energy:.1f}")
        return True
    
    def treat_class(self) -> bool:
        if self.teacher.energy < TEACHER_TREAT_CLASS_ENERGY_COST:
            print("班主任精力不足 40，无法请全班吃饭！")
            return False
            
        if self.teacher.salary < TEACHER_TREAT_CLASS_COST:
            print(f"资金不足！需要{TEACHER_TREAT_CLASS_COST}元，当前工资：{self.teacher.salary}元")
            return False
            
        self.teacher.energy -= TEACHER_TREAT_CLASS_ENERGY_COST
        self.teacher.salary -= TEACHER_TREAT_CLASS_COST
        
        for student in self.students:
            if student.status != Status.Dead and student.index not in self.active_leaves:
                student.energy = min(STUDENT_ENERGY_MAX, student.energy + STUDENT_ENERGY_TREAT_CLASS)
        
        print(f"请全班吃饭成功！花费{TEACHER_TREAT_CLASS_COST}元，班主任精力-{TEACHER_TREAT_CLASS_ENERGY_COST}，正常状态学生精力+{STUDENT_ENERGY_TREAT_CLASS}")
        print(f"班主任当前精力：{self.teacher.energy}，工资：{self.teacher.salary}")
        return True
    
    def show_teacher_status(self):
        print(f"\n--- 班主任状态 ---")
        print(f"血量：{self.teacher.health}/{TEACHER_HEALTH_MAX}")
        print(f"精力：{self.teacher.energy}/{TEACHER_ENERGY_DEFAULT}")
        print(f"工资：{self.teacher.salary} RMB")
        print(f"------------------")
    
    def show_pending_leaves(self):
        if not self.pending_leave_requests:
            print("当前没有待处理的请假申请。")
            return
        
        print(f"⚠️  待处理的请假申请 ({len(self.pending_leave_requests)} 个) - 必须本周处理:")
        for i, req in enumerate(self.pending_leave_requests):
            print(f"  [{i}] {req.student.name} 申请请假 {req.duration} 周")
    
    def print_final_summary(self):
        """【关键修改 2】游戏结束完整结算"""
        print("\n" + "="*80)
        print("🎮 游戏结束结算报告")
        print("="*80)
        
        # 1. 高考总结（如果有）
        if hasattr(self, 'gaokao_results') and self.gaokao_results:
            self._print_gaokao_summary()
        else:
            print("\n⚠️  无高考数据（可能游戏提前结束）")
        
        # 2. 班主任最终状态
        print(f"\n👨‍🏫 班主任最终状态:")
        print(f"  血量：{self.teacher.health}/{TEACHER_HEALTH_MAX}")
        print(f"  精力：{self.teacher.energy}/{TEACHER_ENERGY_DEFAULT}")
        print(f"  总工资：{self.teacher.salary} RMB")
        
        # 3. 学生存活统计
        alive_count = len([s for s in self.students if s.status != Status.Dead])
        dead_count = len([s for s in self.students if s.status == Status.Dead])
        print(f"\n👨‍🎓 学生统计:")
        print(f"  初始人数：{self.studentNum}")
        print(f"  存活人数：{alive_count}")
        print(f"  劝退人数：{dead_count}")
        print(f"  存活率：{alive_count/self.studentNum*100:.1f}%")
        
        # 4. 【修改】进步幅度评价
        print(f"\n📈 教学进步评价:")
        summary, evaluation = self._generate_teaching_evaluation()
        print(f"  {summary}")
        print(f"  📝 {evaluation}")
        
        # 5. 考试历史
        if self.contestsHistory:
            first_exam = self.contestsHistory[0]
            last_exam = self.contestsHistory[-1]
            print(f"\n📊 考试历史:")
            print(f"  首次考试 (Week {first_exam['week']}): 平均分 {first_exam['average']:.1f}")
            print(f"  最终考试 (Week {last_exam['week']}): 平均分 {last_exam['average']:.1f}")
            print(f"  总分变化：{first_exam['average'] - last_exam['average']:.1f} 分")
            print(f"  总考试次数：{len(self.contestsHistory)}")
        else:
            print("无考试记录")
        
        # 6. 游戏结束原因
        print(f"\n📋 游戏结束原因:")
        if self.teacher.health <= 0:
            print("  班主任血量归零")
        elif self.studentAliveNum == 0:
            print("  所有学生被劝退")
        elif self.week >= TOTAL_SEMESTERS * SEMESTER_LENGTH:
            print("  完成全部学期（高考结束）")
        else:
            print("  未知原因")
        
        print(f"\n{'='*80}")
        print("感谢游玩班级管理系统！")
        print(f"{'='*80}\n")
    
    def save_game(self, filename: str):
        """保存游戏状态到文件"""
        game_data = {
            'mode': self.mode.name,
            'classType': self.classType.name,
            'studentNum': self.studentNum,
            'week': self.week,
            'ended': self.ended,
            'studentAliveNum': self.studentAliveNum,
            'teacher_health': self.teacher.health,
            'teacher_energy': self.teacher.energy,
            'teacher_salary': self.teacher.salary,
            'teacher_last_salary_week': self.teacher.last_salary_week,
            'contestsHistory': self.contestsHistory,
            'pending_leave_requests': [],
            'active_leaves': self.active_leaves,
            'first_exam_average': self.first_exam_average,
            'gaokao_results': [],
            'students': []
        }
        
        # 保存请假请求
        for req in self.pending_leave_requests:
            game_data['pending_leave_requests'].append({
                'student_index': req.student.index,
                'duration': req.duration,
                'requested_week': req.requested_week,
                'approved': req.approved,
                'processed': req.processed
            })
        
        # 保存学生信息
        for student in self.students:
            student_data = {
                'index': student.index,
                'gender': student.gender.name,
                'name': student.name,
                'status': student.status.name,
                'energy': student.energy,
                'enthusiasm': student.enthusiasm,
                'character': student.character,
                'IQ': student.IQ,
                'relation': {k: v.name for k, v in student.relation.items()},
                'competition': student.competition.name if hasattr(student, 'competition') and student.competition else None,
                'learnCap': {k.name: v for k, v in student.learnCap.items()},
                'previous_score': student.previous_score,
                'first_exam_score': student.first_exam_score,
                'score_change_factor': student.score_change_factor,
                'leave_start_week': student.leave_start_week,
                'leave_end_week': student.leave_end_week,
                'seat_col': student.seat_col,
                'seat_row': student.seat_row,
                'gaokao_score': student.gaokao_score,
                'admitted_university': student.admitted_university.name if student.admitted_university else None
            }
            game_data['students'].append(student_data)
        
        # 保存高考结果
        for result in self.gaokao_results:
            game_data['gaokao_results'].append({
                'student_index': result['student'].index,
                'gaokao_score': result['gaokao_score'],
                'university': result['university'].name if result['university'] else None
            })
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(game_data, f, ensure_ascii=False, indent=2)
        
        print(f"游戏已保存到 {filename}")
    
    def load_game(self, filename: str):
        """从文件加载游戏状态"""
        with open(filename, 'r', encoding='utf-8') as f:
            game_data = json.load(f)
        
        # 设置基本属性
        self.mode = GameMode[game_data['mode']]
        self.classType = ClassType[game_data['classType']]
        self.studentNum = game_data['studentNum']
        self.week = game_data['week']
        self.ended = game_data['ended']
        self.studentAliveNum = game_data['studentAliveNum']
        self.first_exam_average = game_data['first_exam_average']
        
        # 重新创建学生
        self.students = []
        for student_data in game_data['students']:
            student = Student(student_data['index'], self, self.mode, self.classType)
            # 手动设置学生属性
            student.gender = Gender[student_data['gender']]
            student.name = student_data['name']
            student.status = Status[student_data['status']]
            student.energy = student_data['energy']
            student.enthusiasm = student_data['enthusiasm']
            student.character = tuple(student_data['character'])
            student.IQ = student_data['IQ']
            student.relation = {int(k): Relations[v] for k, v in student_data['relation'].items()}
            if student_data['competition']:
                student.competition = Competition[student_data['competition']]
            student.learnCap = {Subject[k]: v for k, v in student_data['learnCap'].items()}
            student.previous_score = student_data['previous_score']
            student.first_exam_score = student_data['first_exam_score']
            student.score_change_factor = student_data['score_change_factor']
            student.leave_start_week = student_data['leave_start_week']
            student.leave_end_week = student_data['leave_end_week']
            student.seat_col = student_data['seat_col']
            student.seat_row = student_data['seat_row']
            student.gaokao_score = student_data['gaokao_score']
            if student_data['admitted_university']:
                for uni in self.university_database:
                    if uni.name == student_data['admitted_university']:
                        student.admitted_university = uni
                        break
            
            self.students.append(student)
        
        # 设置班主任
        self.teacher.health = game_data['teacher_health']
        self.teacher.energy = game_data['teacher_energy']
        self.teacher.salary = game_data['teacher_salary']
        self.teacher.last_salary_week = game_data['teacher_last_salary_week']
        
        # 恢复考试历史
        self.contestsHistory = game_data['contestsHistory']
        
        # 恢复请假系统
        self.pending_leave_requests = []
        for req_data in game_data['pending_leave_requests']:
            student = self._get_student_by_index(req_data['student_index'])
            req = LeaveRequest(student, req_data['duration'])
            req.requested_week = req_data['requested_week']
            req.approved = req_data['approved']
            req.processed = req_data['processed']
            self.pending_leave_requests.append(req)
        
        self.active_leaves = {int(k): v for k, v in game_data['active_leaves'].items()}
        
        # 恢复高考结果
        self.gaokao_results = []
        for result_data in game_data['gaokao_results']:
            student = self._get_student_by_index(result_data['student_index'])
            university = None
            if result_data['university']:
                for uni in self.university_database:
                    if uni.name == result_data['university']:
                        university = uni
                        break
            self.gaokao_results.append({
                'student': student,
                'gaokao_score': result_data['gaokao_score'],
                'university': university
            })
        
        # 恢复座位表
        self._recalculate_seats()
        
        print(f"游戏已从 {filename} 加载")


# ============================================================================
# --- 主程序 ---
# ============================================================================

def list_save_files():
    """列出所有存档文件"""
    # os.chdir(os.path.dirname(os.path.abspath(__file__)))
    # print(os.getcwd())
    save_files = []
    for file in os.listdir('.'):
        # print(file)
        if file.endswith('.json') and file.startswith('save_'):
            save_files.append(file)
    return save_files

def main():
    print("🏫 欢迎来到班级管理系统！")
    print("\n请选择操作:")
    print("1. 新游戏")
    print("2. 载入存档")
    
    while True:
        choice = input("请输入选择 (1/2): ").strip()
        if choice == '1':
            # 新游戏
            print("\n请选择游戏难度:")
            print("1. Easy")
            print("2. Normal") 
            print("3. Hard")
            
            while True:
                difficulty_choice = input("请输入选择 (1/2/3): ").strip()
                if difficulty_choice == '1':
                    mode = GameMode.Easy
                    break
                elif difficulty_choice == '2':
                    mode = GameMode.Normal
                    break
                elif difficulty_choice == '3':
                    mode = GameMode.Hard
                    break
                else:
                    print("无效选择，请重新输入！")
            
            print("\n请选择班型:")
            print("1. 理科班")
            print("2. 文科班")
            
            while True:
                type_choice = input("请输入选择 (1/2): ").strip()
                if type_choice == '1':
                    class_type = ClassType.Science
                    break
                elif type_choice == '2':
                    class_type = ClassType.Art
                    break
                else:
                    print("无效选择，请重新输入！")
            
            print("\n请输入学生人数 (建议 10-50):")
            while True:
                try:
                    student_num = int(input("学生人数："))
                    if 1 <= student_num <= 100:
                        break
                    else:
                        print("学生人数应在 1-100 之间！")
                except ValueError:
                    print("请输入有效数字！")
            
            print(f"\n开始创建班级...")
            class1 = Class(mode, class_type, student_num)
            class1.printSeats()
            break
            
        elif choice == '2':
            # 载入存档
            save_files = list_save_files()
            if not save_files:
                print("没有找到存档文件！")
                return
            print("\n找到以下存档文件:")
            for i, file in enumerate(save_files, 1):
                print(f"{i}. {file}")
            
            while True:
                try:
                    file_choice = int(input("请选择存档文件编号: ")) - 1
                    if 0 <= file_choice < len(save_files):
                        class1 = Class()  # 创建空实例
                        class1.load_game(save_files[file_choice])
                        break
                    else:
                        print("无效选择，请重新输入！")
                except ValueError:
                    print("请输入有效数字！")
            break
        else:
            print("无效选择，请重新输入！")
    
    print("\n=== 命令说明 ===")
    print("n     - 进入下一周")
    print("nn    - 往下进行五周")
    print("s     - 往下进行十周")
    print("e     - 直接快进到游戏结束")
    print("l     - 列出存活学生")
    print("d     - 列出已劝退学生")
    print("x <num> - 劝退指定编号学生")
    print("w <num1> <num2> - 交换两个学生座位")
    print("r     - 随机重排座位")
    print("p     - 显示当前座位表")
    print("i     - 显示当前周信息")
    print("v <num> - 查看指定学生的关系状况")
    print("t <num1> <num2> - 挑拨离间两个学生")
    print("m     - 购买药品")
    print("c <num> - 约谈学生")
    print("o     - 组织活动")
    print("b     - 【新增】召开班会")
    print("ts <num> - 请学生吃饭")
    print("tc     - 请全班吃饭")
    print("st     - 显示班主任状态")
    print("sl    - 显示待处理请假申请")
    print("al <index> 1/0 - 处理请假申请 (1 批准 0 不批)")
    print("sv <filename> - 保存游戏 (例: sv mygame.json)")
    print("q     - 退出游戏")
    print("="*50)
    
    try:
        while True:
            if class1.ended:
                print("\n游戏已结束！")
                break
                
            cmd = input(f"\n当前：{class1.get_week_info()}, 存活：{class1.studentAliveNum}/{class1.studentNum} > ").strip().lower()
            
            if cmd == 'n':
                if not class1.ended:
                    class1.nextWeek()
                else:
                    print("游戏已结束！")
                    
            elif cmd == 'nn':
                weeks_to_run = 5
                count = 0
                while count < weeks_to_run and not class1.ended:
                    # 【关键修改 3】检查是否有待处理请假
                    if class1.pending_leave_requests:
                        print(f"\n⛔ 快进中断！有 {len(class1.pending_leave_requests)} 个请假申请待处理！")
                        print("💡 请先处理请假申请后再继续快进！")
                        break
                    class1.nextWeek()
                    count += 1
                if class1.pending_leave_requests and count < weeks_to_run:
                    print(f"已推进 {count} 周，剩余 {weeks_to_run - count} 周未执行")
                    
            elif cmd == 's':
                weeks_to_run = 10
                count = 0
                while count < weeks_to_run and not class1.ended:
                    # 【关键修改 3】检查是否有待处理请假
                    if class1.pending_leave_requests:
                        print(f"\n⛔ 快进中断！有 {len(class1.pending_leave_requests)} 个请假申请待处理！")
                        print("💡 请先处理请假申请后再继续快进！")
                        break
                    class1.nextWeek()
                    count += 1
                if class1.pending_leave_requests and count < weeks_to_run:
                    print(f"已推进 {count} 周，剩余 {weeks_to_run - count} 周未执行")
                    
            elif cmd == 'e':
                # 【关键修改 3】快进到结束也要检查请假
                while not class1.ended:
                    if class1.pending_leave_requests:
                        print(f"\n⛔ 快进中断！有 {len(class1.pending_leave_requests)} 个请假申请待处理！")
                        print("💡 请先处理请假申请后再继续快进！")
                        break
                    class1.nextWeek()
                    
            elif cmd == 'l':
                class1.list_alive_students()
                
            elif cmd == 'd':
                class1.list_dead_students()
                
            elif cmd.startswith('x '):
                parts = cmd.split()
                if len(parts) == 2:
                    try:
                        student_num = int(parts[1])
                        class1.expel_student(student_num)
                    except ValueError:
                        print("请输入有效的学生编号！")
                else:
                    print("用法：x <学生编号>")
                    
            elif cmd.startswith('w '):
                parts = cmd.split()
                if len(parts) == 3:
                    try:
                        num1 = int(parts[1])
                        num2 = int(parts[2])
                        class1.swap_seats(num1, num2)
                    except ValueError:
                        print("请输入有效的学生编号！")
                else:
                    print("用法：w <学生 1 编号> <学生 2 编号>")
                    
            elif cmd == 'r':
                class1.randomize_seats()
                
            elif cmd == 'p':
                class1.printSeats()
                
            elif cmd == 'i':
                print(f"当前信息：{class1.get_week_info()}, 存活：{class1.studentAliveNum}/{class1.studentNum}")
                
            elif cmd.startswith('v '):
                parts = cmd.split()
                if len(parts) == 2:
                    try:
                        student_num = int(parts[1])
                        class1.show_relations(student_num)
                    except ValueError:
                        print("请输入有效的学生编号！")
                else:
                    print("用法：v <学生编号>")
                    
            elif cmd.startswith('t '):
                parts = cmd.split()
                if len(parts) == 3:
                    try:
                        num1 = int(parts[1])
                        num2 = int(parts[2])
                        class1.instigate(num1, num2)
                    except ValueError:
                        print("请输入有效的学生编号！")
                else:
                    print("用法：t <学生 1 编号> <学生 2 编号>")
                    
            elif cmd == 'm':
                class1.buy_medicine()
                
            elif cmd.startswith('c '):
                parts = cmd.split()
                if len(parts) == 2:
                    try:
                        student_num = int(parts[1])
                        class1.counsel_student(student_num)
                    except ValueError:
                        print("请输入有效的学生编号！")
                else:
                    print("用法：c <学生编号>")
                    
            elif cmd == 'o':
                class1.organize_activity()
                
            elif cmd == 'b':  # 【新增】班会命令
                class1.hold_class_meeting()
                
            elif cmd.startswith('ts '):
                parts = cmd.split()
                if len(parts) == 2:
                    try:
                        student_num = int(parts[1])
                        class1.treat_student(student_num)
                    except ValueError:
                        print("请输入有效的学生编号！")
                else:
                    print("用法：ts <学生编号>")
                    
            elif cmd == 'tc':
                class1.treat_class()
                
            elif cmd == 'st':
                class1.show_teacher_status()
                
            elif cmd == 'sl':
                class1.show_pending_leaves()
                
            elif cmd.startswith('al '):
                parts = cmd.split()
                if len(parts) == 3:
                    try:
                        req_idx = int(parts[1])
                        approve = int(parts[2])
                        if approve in [0, 1]:
                            class1.approve_leave_request(req_idx, bool(approve))
                        else:
                            print("批准参数应为 0(不批) 或 1(批准)")
                    except ValueError:
                        print("用法：al <申请编号> <1 批准/0 不批>")
                else:
                    print("用法：al <申请编号> <1 批准/0 不批>")
                    
            elif cmd.startswith('sv '):
                parts = cmd.split()
                if len(parts) == 2:
                    filename = parts[1]
                    if not filename.endswith('.json'):
                        filename += '.json'
                    class1.save_game(filename)
                else:
                    print("用法：sv <文件名>")
                    
            elif cmd == 'q':
                print("游戏退出。")
                break
                
            else:
                print("未知命令！请输入 'n', 'nn', 's', 'e', 'l', 'd', 'x', 'w', 'r', 'p', 'i', 'v', 't', 'm', 'c', 'o', 'b', 'ts', 'tc', 'st', 'sl', 'al', 'sv', 或 'q'")
                
    except KeyboardInterrupt:
        print("\n游戏被中断。")
    except Exception as e:
        print(f"发生错误：{e}")
        import traceback
        traceback.print_exc()
    
    # 【关键修改 4】确保游戏结束结算一定会执行
    class1.print_final_summary()


if __name__ == "__main__":
    main()