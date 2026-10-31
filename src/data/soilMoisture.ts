import type { FieldMoisture } from '../types/dashboard';

export const soilMoistureByField: FieldMoisture[] = [
{ fieldId: 'A', depths: [{ depth: '10 cm', value: 28 }, { depth: '30 cm', value: 34 }, { depth: '60 cm', value: 41 }] },
{ fieldId: 'B', depths: [{ depth: '10 cm', value: 23 }, { depth: '30 cm', value: 29 }, { depth: '60 cm', value: 36 }] },
{ fieldId: 'C', depths: [{ depth: '10 cm', value: 16 }, { depth: '30 cm', value: 21 }, { depth: '60 cm', value: 30 }] },
{ fieldId: 'D', depths: [{ depth: '10 cm', value: 31 }, { depth: '30 cm', value: 35 }, { depth: '60 cm', value: 39 }] }];