// 预设力量训练动作库
export const EXERCISE_PRESETS = [
  // 胸部
  { id: 'chest-1', name: '杠铃卧推', category: '胸部', muscleGroup: '胸大肌' },
  { id: 'chest-2', name: '哑铃卧推', category: '胸部', muscleGroup: '胸大肌' },
  { id: 'chest-3', name: '上斜卧推', category: '胸部', muscleGroup: '上胸' },
  { id: 'chest-4', name: '飞鸟', category: '胸部', muscleGroup: '胸大肌' },
  { id: 'chest-5', name: '双杠臂屈伸', category: '胸部', muscleGroup: '下胸' },
  // 背部
  { id: 'back-1', name: '引体向上', category: '背部', muscleGroup: '背阔肌' },
  { id: 'back-2', name: '杠铃划船', category: '背部', muscleGroup: '背阔肌' },
  { id: 'back-3', name: '高位下拉', category: '背部', muscleGroup: '背阔肌' },
  { id: 'back-4', name: '坐姿绳索划船', category: '背部', muscleGroup: '中背' },
  { id: 'back-5', name: '硬拉', category: '背部', muscleGroup: '全身后链' },
  // 肩部
  { id: 'shoulder-1', name: '杠铃推举', category: '肩部', muscleGroup: '三角肌前束' },
  { id: 'shoulder-2', name: '哑铃侧平举', category: '肩部', muscleGroup: '三角肌中束' },
  { id: 'shoulder-3', name: '面拉', category: '肩部', muscleGroup: '三角肌后束' },
  { id: 'shoulder-4', name: '俯身飞鸟', category: '肩部', muscleGroup: '三角肌后束' },
  // 手臂
  { id: 'arm-1', name: '杠铃弯举', category: '手臂', muscleGroup: '肱二头肌' },
  { id: 'arm-2', name: '哑铃弯举', category: '手臂', muscleGroup: '肱二头肌' },
  { id: 'arm-3', name: '绳索下压', category: '手臂', muscleGroup: '肱三头肌' },
  { id: 'arm-4', name: '窄距卧推', category: '手臂', muscleGroup: '肱三头肌' },
  { id: 'arm-5', name: '锤式弯举', category: '手臂', muscleGroup: '肱肌' },
  // 腿部
  { id: 'leg-1', name: '杠铃深蹲', category: '腿部', muscleGroup: '股四头肌' },
  { id: 'leg-2', name: '腿举', category: '腿部', muscleGroup: '股四头肌' },
  { id: 'leg-3', name: '罗马尼亚硬拉', category: '腿部', muscleGroup: '腘绳肌' },
  { id: 'leg-4', name: '腿弯举', category: '腿部', muscleGroup: '腘绳肌' },
  { id: 'leg-5', name: '弓步走', category: '腿部', muscleGroup: '股四头肌' },
  { id: 'leg-6', name: '提踵', category: '腿部', muscleGroup: '小腿' },
  // 核心
  { id: 'core-1', name: '平板支撑', category: '核心', muscleGroup: '腹横肌' },
  { id: 'core-2', name: '卷腹', category: '核心', muscleGroup: '腹直肌' },
  { id: 'core-3', name: '俄罗斯转体', category: '核心', muscleGroup: '腹斜肌' },
  { id: 'core-4', name: '悬垂举腿', category: '核心', muscleGroup: '下腹' },
]

// 预设食物库
export const FOOD_PRESETS = [
  // 主食
  { id: 'food-1', name: '白米饭', calories: 116, protein: 2.6, carbs: 25.9, fat: 0.3, unit: '100g' },
  { id: 'food-2', name: '全麦面包', calories: 247, protein: 13, carbs: 41, fat: 3.4, unit: '100g' },
  { id: 'food-3', name: '燕麦', calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9, unit: '100g' },
  { id: 'food-4', name: '红薯', calories: 86, protein: 1.6, carbs: 20.1, fat: 0.1, unit: '100g' },
  { id: 'food-5', name: '意面', calories: 131, protein: 5.1, carbs: 25.1, fat: 1.1, unit: '100g' },
  { id: 'food-6', name: '玉米', calories: 112, protein: 3.3, carbs: 22.8, fat: 1.4, unit: '100g' },
  // 蛋白质
  { id: 'food-7', name: '鸡胸肉', calories: 165, protein: 31, carbs: 0, fat: 3.6, unit: '100g' },
  { id: 'food-8', name: '牛肉(瘦)', calories: 250, protein: 26, carbs: 0, fat: 15, unit: '100g' },
  { id: 'food-9', name: '三文鱼', calories: 208, protein: 20, carbs: 0, fat: 13, unit: '100g' },
  { id: 'food-10', name: '鸡蛋', calories: 155, protein: 13, carbs: 1.1, fat: 11, unit: '100g(约2个)' },
  { id: 'food-11', name: '虾仁', calories: 99, protein: 20.5, carbs: 0.2, fat: 1.4, unit: '100g' },
  { id: 'food-12', name: '豆腐', calories: 76, protein: 8.1, carbs: 1.9, fat: 4.8, unit: '100g' },
  { id: 'food-13', name: '金枪鱼罐头', calories: 116, protein: 25.9, carbs: 0, fat: 0.9, unit: '100g' },
  // 蔬菜
  { id: 'food-14', name: '西兰花', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, unit: '100g' },
  { id: 'food-15', name: '菠菜', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, unit: '100g' },
  { id: 'food-16', name: '生菜', calories: 15, protein: 1.4, carbs: 2.1, fat: 0.2, unit: '100g' },
  { id: 'food-17', name: '胡萝卜', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, unit: '100g' },
  // 水果
  { id: 'food-18', name: '香蕉', calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3, unit: '100g' },
  { id: 'food-19', name: '苹果', calories: 52, protein: 0.3, carbs: 13.8, fat: 0.2, unit: '100g' },
  { id: 'food-20', name: '蓝莓', calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3, unit: '100g' },
  // 乳制品
  { id: 'food-21', name: '脱脂牛奶', calories: 34, protein: 3.4, carbs: 5, fat: 0.1, unit: '100ml' },
  { id: 'food-22', name: '希腊酸奶', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, unit: '100g' },
  // 坚果
  { id: 'food-23', name: '杏仁', calories: 579, protein: 21.2, carbs: 21.7, fat: 49.9, unit: '100g' },
  { id: 'food-24', name: '花生酱', calories: 588, protein: 25.1, carbs: 20, fat: 50.4, unit: '100g' },
  // 补剂
  { id: 'food-25', name: '乳清蛋白粉(一勺)', calories: 120, protein: 24, carbs: 3, fat: 1.5, unit: '30g' },
]

// 有氧运动类型
export const CARDIO_TYPES = [
  { id: 'run', name: '跑步', icon: '🏃', unit: 'km' },
  { id: 'walk', name: '快走', icon: '🚶', unit: 'km' },
  { id: 'swim', name: '游泳', icon: '🏊', unit: 'm' },
  { id: 'cycle', name: '骑行', icon: '🚴', unit: 'km' },
  { id: 'jump-rope', name: '跳绳', icon: '⏭️', unit: '分钟' },
  { id: 'elliptical', name: '椭圆机', icon: '🏃', unit: '分钟' },
  { id: 'rowing', name: '划船机', icon: '🚣', unit: '分钟' },
  { id: 'hiit', name: 'HIIT', icon: '💪', unit: '分钟' },
  { id: 'stairs', name: '爬楼梯', icon: '🪜', unit: '分钟' },
]

// 餐别类型
export const MEAL_TYPES = [
  { id: 'breakfast', name: '早餐', emoji: '🌅' },
  { id: 'morning-snack', name: '加餐', emoji: '🍎' },
  { id: 'lunch', name: '午餐', emoji: '☀️' },
  { id: 'pre-workout', name: '练前', emoji: '💪' },
  { id: 'post-workout', name: '练后', emoji: '🏋️' },
  { id: 'dinner', name: '晚餐', emoji: '🌙' },
  { id: 'evening-snack', name: '夜宵', emoji: '🌛' },
]

// 目标类型
export const GOAL_TYPES = [
  { id: 'weight-loss', name: '减重', field: 'weight', icon: '⚖️', unit: 'kg' },
  { id: 'muscle-gain', name: '增肌', field: 'muscle_mass', icon: '💪', unit: 'kg' },
  { id: 'body-fat', name: '降低体脂', field: 'body_fat', icon: '📉', unit: '%' },
  { id: 'workout-streak', name: '训练 streak', field: 'workout_days', icon: '🔥', unit: '天' },
  { id: 'weekly-workouts', name: '每周训练次数', field: 'weekly_workouts', icon: '📅', unit: '次/周' },
]

// 身体测量部位
export const BODY_MEASUREMENTS = [
  { id: 'chest', name: '胸围', unit: 'cm' },
  { id: 'waist', name: '腰围', unit: 'cm' },
  { id: 'hip', name: '臀围', unit: 'cm' },
  { id: 'thigh', name: '大腿围', unit: 'cm' },
  { id: 'arm', name: '臂围', unit: 'cm' },
  { id: 'calf', name: '小腿围', unit: 'cm' },
]

// 训练分类
export const WORKOUT_CATEGORIES = ['胸部', '背部', '肩部', '手臂', '腿部', '核心', '全身']
