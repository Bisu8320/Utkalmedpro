import {UserModel} from '../models/user.model';
import ServiceRequest  from '../models/bookings.model';
import * as authUtils from '../utils/auths';
export const getUser = async (mobile: number) => {
    const user = await UserModel.findOne({ mobile });
    return user;
};

// createNewUser
export const createNewUser = async (mobile: string) => {
    const newUser = new UserModel({ mobile });
    return await newUser.save();
};
  


export const createNewServiceRequest = async (serviceRequest:any) => {
    const serviceRequestData = await ServiceRequest.create(serviceRequest);
    return serviceRequestData;
};