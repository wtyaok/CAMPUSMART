import type { MessageType, OrderStatus, ProductStatus } from '@/types';

export const categories = ['数码电子', '图书教材', '生活用品', '运动户外', '服饰鞋包', '其他'];

export const productStatusMap: Record<ProductStatus, { label: string; type: 'primary' | 'success' | 'warning' | 'info' | 'danger' }> = {
  pending_review: { label: '待审核', type: 'warning' },
  on_sale: { label: '出售中', type: 'success' },
  locked: { label: '交易中', type: 'primary' },
  sold: { label: '已售出', type: 'info' },
  off_shelf: { label: '已下架', type: 'info' },
  rejected: { label: '审核拒绝', type: 'danger' }
};

export const orderStatusMap: Record<OrderStatus, { label: string; type: 'primary' | 'success' | 'warning' | 'info' | 'danger' }> = {
  pending_confirm: { label: '待卖家确认', type: 'warning' },
  confirmed: { label: '卖家已确认', type: 'primary' },
  completed: { label: '交易完成', type: 'success' },
  cancelled: { label: '已取消', type: 'info' },
  abnormal: { label: '异常订单', type: 'danger' }
};

export const messageTypeMap: Record<MessageType, { label: string; type: 'primary' | 'success' | 'warning' | 'info' | 'danger' }> = {
  review: { label: '审核通知', type: 'warning' },
  order: { label: '订单通知', type: 'primary' },
  system: { label: '系统通知', type: 'info' },
  abnormal: { label: '异常通知', type: 'danger' }
};

export const campusLocations = ['东区宿舍', '西区食堂', '图书馆门口', '体育馆', '南门自提点', '教学楼 A 座'];
