export type FormDataShape = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  doorNumber: string;
  postCode: string;
  howHeard: string;
  deviceType: string;
  deviceBrand: string;
  issue: string;
  password: string;
  appleId: string;
  dataSave: 0 | 1;
  termsAccepted: 0 | 1;
};

export const emptyFormData: FormDataShape = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  doorNumber: "",
  postCode: "",
  howHeard: "",
  deviceType: "",
  deviceBrand: "",
  issue: "",
  password: "",
  appleId: "",
  dataSave: 0,
  termsAccepted: 0,
};
