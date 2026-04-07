/**
 * State Machine Logic for Caregiver Task Execution (SOP)
 */

export enum TaskState {
  PENDING = 'PENDING',             // 待接单
  ASSIGNED = 'ASSIGNED',           // 已指派/已接单
  EN_ROUTE = 'EN_ROUTE',           // 前往中
  ARRIVED = 'ARRIVED',             // GPS签到 (到达)
  FACE_VERIFIED = 'FACE_VERIFIED', // 人脸识别核验完成
  IN_PROGRESS = 'IN_PROGRESS',     // 服务中 (包含关键工序拍照、语音日志)
  COMPLETED = 'COMPLETED'          // 离家签退 (完成)
}

export type TaskAction = 
  | 'ACCEPT_TASK'
  | 'START_ROUTE'
  | 'GPS_CHECK_IN'
  | 'VERIFY_FACE'
  | 'START_SERVICE'
  | 'COMPLETE_SERVICE';

export class SOPStateMachine {
  private currentState: TaskState;

  constructor(initialState: TaskState = TaskState.PENDING) {
    this.currentState = initialState;
  }

  public getState(): TaskState {
    return this.currentState;
  }

  public transition(action: TaskAction): boolean {
    switch (this.currentState) {
      case TaskState.PENDING:
        if (action === 'ACCEPT_TASK') {
          this.currentState = TaskState.ASSIGNED;
          return true;
        }
        break;
      case TaskState.ASSIGNED:
        if (action === 'START_ROUTE') {
          this.currentState = TaskState.EN_ROUTE;
          return true;
        }
        break;
      case TaskState.EN_ROUTE:
        if (action === 'GPS_CHECK_IN') {
          this.currentState = TaskState.ARRIVED;
          return true;
        }
        break;
      case TaskState.ARRIVED:
        if (action === 'VERIFY_FACE') {
          this.currentState = TaskState.FACE_VERIFIED;
          return true;
        }
        break;
      case TaskState.FACE_VERIFIED:
        if (action === 'START_SERVICE') {
          this.currentState = TaskState.IN_PROGRESS;
          return true;
        }
        break;
      case TaskState.IN_PROGRESS:
        if (action === 'COMPLETE_SERVICE') {
          this.currentState = TaskState.COMPLETED;
          return true;
        }
        break;
      default:
        return false;
    }
    return false;
  }
}
