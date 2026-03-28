import random

# 姓氏池
first_names = [
    "赵", "钱", "孙", "李", "周", "吴", "郑", "王", "冯", "陈", "褚", "卫", "蒋", "沈", "韩", "杨",
    "朱", "秦", "尤", "许", "何", "吕", "施", "张", "孔", "曹", "严", "华", "金", "魏", "陶", "姜",
    "戚", "谢", "邹", "喻", "柏", "水", "窦", "章", "云", "苏", "潘", "葛", "奚", "范", "彭", "郎"
]

# 男生名字池
male_names = [
    "伟杰", "浩宇", "明轩", "子轩", "宇轩", "浩然", "子涵", "俊豪", "文博", "致远",
    "天宇", "宇航", "俊杰", "志远", "子豪", "一鸣", "嘉懿", "煜城", "懿轩", "昊然",
    "泽洋", "铭泽", "子骞", "鹏涛", "翰文", "鸿涛", "烨磊", "昊天", "荣轩", "越泽"
]

# 女生名字池
female_names = [
    "雨桐", "雨萱", "雨婷", "晓萱", "可欣", "梓涵", "欣怡", "子萱", "佳怡", "若溪",
    "紫萱", "晨曦", "梦瑶", "沐晴", "心怡", "思琪", "雅静", "文静", "静怡", "秀英",
    "玉婷", "丽娜", "梦洁", "天悦", "依诺", "若男", "芷柔", "语桐", "思雨", "采薇"
]

# 用于存储已使用姓名的全局集合
_used_names = set()

def generate_unique_name(gender, reset=False):
    global _used_names
    
    if reset:
        _used_names.clear()
    
    if gender not in ['male', 'female']:
        raise ValueError("gender 必须是 'male' 或 'female'")
    
    # 选择对应的名字池
    name_pool = male_names if gender == 'male' else female_names
    
    # 计算最大可能组合数
    max_combinations = len(first_names) * len(name_pool)
    if len(_used_names) >= max_combinations:
        raise ValueError(f"{gender} 名字池已用尽，无法生成更多不重复的姓名")
    
    # 生成不重复的姓名
    max_attempts = 1000
    attempts = 0
    
    while attempts < max_attempts:
        first = random.choice(first_names)
        last = random.choice(name_pool)
        full_name = first + last
        
        if full_name not in _used_names:
            _used_names.add(full_name)
            return full_name
        
        attempts += 1
    
    raise ValueError("无法生成不重复的姓名，请检查名字池是否足够")
