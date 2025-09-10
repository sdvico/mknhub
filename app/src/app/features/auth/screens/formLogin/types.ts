export interface LoginFormType {
  username: string;
  password: string;
}

export interface LoginResponse {
  code: number;
  data: {
    result: number;
    token: string;
    data?: {
      msg?: string;
    };
  };
}
