import type { FieldInfo } from '../types/dashboard';

export const fieldMapImage = "/579c3de9-90d4-4e10-b3af-f99dc6e94115.jpg";


export const fields: FieldInfo[] = [
{ id: 'A', name: 'Field A', crop: 'Rice Field', status: 'good', statusLabel: 'Good', polygon: '6,22 36,12 44,46 12,54', label: { x: 13, y: 24 }, device: { solar: 86, signal: 'Strong', battery: 78 } },
{ id: 'B', name: 'Field B', crop: 'Corn Field', status: 'warn', statusLabel: 'Moderate', polygon: '44,12 80,8 84,40 48,46', label: { x: 50, y: 17 }, device: { solar: 81, signal: 'Good', battery: 64 } },
{ id: 'C', name: 'Field C', crop: 'Sugarcane Field', status: 'alert', statusLabel: 'Needs Attention', polygon: '50,50 90,42 94,88 56,94', label: { x: 56, y: 54 }, device: { solar: 72, signal: 'Weak', battery: 41 } },
{ id: 'D', name: 'Field D', crop: 'Vegetable Plot', status: 'good', statusLabel: 'Good', polygon: '10,58 46,52 50,92 16,96', label: { x: 17, y: 62 }, device: { solar: 88, signal: 'Strong', battery: 83 } }];