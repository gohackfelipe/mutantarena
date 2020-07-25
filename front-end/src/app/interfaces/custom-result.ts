export interface ICustomResult<T> {
  success: {
    code: number;
    data: T;
    time: number;
    total: number;
  };
}
