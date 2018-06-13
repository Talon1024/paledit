import { Gradient } from './gradient';

export type GradientOperationType = 'apply';
export class GradientOperation {
  type: GradientOperationType;
  gradient: Gradient;
}
