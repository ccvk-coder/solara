import type { AppNotification } from '../types/dashboard';

export const notifications: AppNotification[] = [
{ id: 'n1', title: 'Field C needs attention', detail: 'Soil moisture dropped below 18% in the east section.', time: '12 min ago', status: 'alert' },
{ id: 'n2', title: 'Phosphorus trending low', detail: 'Field B phosphorus at 28 ppm — consider top dressing.', time: '1 hr ago', status: 'warn' },
{ id: 'n3', title: 'Rain expected Saturday', detail: '40% chance of rain. Irrigation for Field A can be paused.', time: '3 hr ago', status: 'good' }];