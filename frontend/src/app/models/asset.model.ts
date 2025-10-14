export interface Asset {
  id: string;
  name: string;
  type: string;
  status: string;
  employeeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAssetRequest {
  name: string;
  type: string;
  status: string;
}
