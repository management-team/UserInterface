import { ICognitoUser } from '../../../model/cognito-user.model';
import { connect } from 'react-redux';
import { ManageInternalComponenet } from './manage-internal.component';
import { IState } from '../../../reducers';
import { toggleViewUserModal, selectUserForDisplay } from "../../../actions/view-user/view-user.actions"

export interface IManageInternalComponentProps {
    manageUsers: ICognitoUser[];
    manageUsersCurrentPage: number;
    manageUsersPageTotal: number;
    updateManageUsersTable: (groupName: string, email: string, pageNumber?: number) => void;
    toggleViewUserModal: () => void;
    selectUserForDisplay: (selectedUser: ICognitoUser) => void;
}

const mapStateToProps = (state: IState) => {
    return {
        manageUsers: state.managementState.manageUsers.manageUsers,
        manageUsersCurrentPage: state.managementState.manageUsers.manageUsersCurrentPage,
        manageUsersPageTotal: state.managementState.manageUsers.manageUsersPageTotal
    }
}

const mapDispatchToProps = {
    toggleViewUserModal: toggleViewUserModal,
    selectUserForDisplay: selectUserForDisplay
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageInternalComponenet)
