import { IAddress } from "./address.model";
import { IStatus } from "./status.model";

export interface IUser {
  email:      string;
  userId:     number;
  firstName:  string;
  lastName:   string;
  phoneNumber:     string;
  trainingAddress:    IAddress;
  personalAddress:    IAddress;
  role: string,
  dropdownRole: string,
  cohort: string,
  userStatus:     IStatus
  roles: string[];
}