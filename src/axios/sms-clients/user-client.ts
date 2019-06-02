import { smsClient } from ".";
import { IUser } from "../../model/user.model";


const usersContext = '/user-service/users'

export const userClient = {
    saveUser(newUser: IUser) {
        return smsClient.post(usersContext, newUser);
    },
    findAllByCohortId: (cohortId: number) => {
        return smsClient.get(`${usersContext}/cohorts/${cohortId}`)
    },
    findOneByEmail(email: string) {
        return smsClient.get(usersContext + `/email/${email}`);
    },
    findOneByPartialEmail(email: string) {
        return smsClient.get(usersContext + `/email/partial/${email}`);
    },
    updateSMSUserInfo(updatedUser: IUser) {
        return smsClient.patch(usersContext, updatedUser);
    },
    findAllByEmails(emails: string[]) {
        return smsClient.post(usersContext + `/emails`, { emailList: emails });
    },
    findUsersByPartialEmail(email: string, page: number = 0) {
        return smsClient.post(`${usersContext}/email/partial`,
            {
                emailFragement: email,
                page: page
            });
    },
    findAllUsers(page: number = 0) {
        return smsClient.get(`${usersContext}/allUsers/page/${page}`);
    }
}
