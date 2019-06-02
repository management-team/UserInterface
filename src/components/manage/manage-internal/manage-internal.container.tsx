import { ICognitoUser } from '../../../model/cognito-user.model';
import { connect } from 'react-redux';
import { ManageInternalComponenet } from './manage-internal.component';
import { IState } from '../../../reducers';
import { toggleViewUserModal, selectUserForDisplay} from "../../../actions/view-user/view-user.actions"
import { sortUsers } from '../../../actions/manage-users/manage-users.actions';


export interface IManageInternalComponentProps {
  manageUsers: ICognitoUser[];
  updateManageUsersTable: (groupName: string) => void;
  sortUsers: (userArray: ICognitoUser[], sortKey:string) => void;
  toggleViewUserModal: () => void;
  selectUserForDisplay: (selectedUser: ICognitoUser) => void;
  componentLoaded: boolean;
  currentRole: string
  userTableSort: string
}

const mapStateToProps = (state: IState) => {
    return {
        manageUsers: state.managementState.manageUsers.manageUsers,
        componentLoaded: state.managementState.manageUsers.componentLoaded,
        currentRole: state.managementState.manageUsers.currentRole,
        userTableSort: state.managementState.manageUsers.userTableSort
    }
}

const mapDispatchToProps = {
    toggleViewUserModal: toggleViewUserModal,
    selectUserForDisplay: selectUserForDisplay,
    sortUsers: sortUsers
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageInternalComponenet)
