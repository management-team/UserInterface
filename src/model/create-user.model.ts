import { IAddress } from "./address.model";

export interface ICreateUser {
  email:      string;
  firstName:  string;
  lastName:   string;
  phoneNumber:     string;
  trainingAddress:    IAddress;
  dropdownRole: string,
  cohort: string,
  role: string,
}