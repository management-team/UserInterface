import * as React from 'react';
import DropdownItem from 'react-bootstrap/DropdownItem';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownMenu, DropdownToggle, Table, Input, Button } from 'reactstrap';
import { ICognitoUser, cognitoRoles } from '../../../model/cognito-user.model';
import ViewUserModal from '../view-user-modal/view-user-modal.container';
import { IManageInternalComponentProps } from './manage-internal.container';
//import Label from 'reactstrap/lib/Label';

/**
 * {v}: dropdown with further info
 * #: hoverable props
 * [... ]: button
 * 
 * `Row headers:
 * |-----------\|---------------------\|-------------\|----------\
 * |--'Admins'--|--'Staging Managers'--|--'Trainers'--|--Cohorts--|                              [*+ ]
 * [ *********************************************************************************************** ]
 * [--Cohort.Name--|--Address.alias{v}--|--Token.(){v}-- |--StartMonth--|--trainer email-v--         ]
 * [=================================================================================================|
 * [  1901-blake   |  USF               | [Get token  v] | March 2019   | [blake.kruppa@gmail.com v] |
 * [-------------------------------------------------------------------------------------------------|
 * [  1902-flake   |  Reston            | [Get token  v] | March 2019   | [flake@gmail.com v       ] |
 * [-------------------------------------------------------------------------------------------------|
 * [  1903-fake    |  USF               | [Get token  v] | March 2019   | [abatson@gmail.com v     ] |
 * [-------------------------------------------------------------------------------------------------|
 * [  1904-bake    |  Reston            | [Get token  v] | March 2019   | [fllorida.man@gmail.com v] |
 * [-------------------------------------------------------------------------------------------------|
 * [  1905-make    |  USF               | [Get token  v] | March 2019   | [blake.kruppa@gmail.com v] |
 * [ *********************************************************************************************** |
 *                                                                         [p1 ] [p2 ] ... [p4 ] [p5 ]                
 * `
 * {
 *   Cohort # {
 *     cohortDescription,
 *   }
 * 
 * }
 */

interface ManageInternalState {
    roleDropdownList: boolean;
    dropDownValue: string;
    email: string;
    selectedRole: string;
}

export class ManageInternalComponenet extends React.Component<IManageInternalComponentProps, ManageInternalState> {

    constructor(props: IManageInternalComponentProps) {
        super(props);
        this.state = {
            roleDropdownList: false,
            dropDownValue: "all",
            email: '',
            selectedRole: ''
        };
    }
    componentDidMount() {
        this.props.updateManageUsersTable("all", '', this.props.manageUsersCurrentPage);

    }
    displayUserModal = (selectedUser: ICognitoUser) => {
        this.props.selectUserForDisplay(selectedUser);
        this.props.toggleViewUserModal();
    }

    toggleDropdownList = () => {
        this.setState({
            roleDropdownList: !this.state.roleDropdownList
        });
    }
    updateDropdown = (option: string, page: number) => {
        console.log('test')
        this.props.updateManageUsersTable(option, this.state.email, page)
        this.setState({ dropDownValue: option })
    }

    getUserByEmail = (page: number) => {
        this.props.updateManageUsersTable('All', this.state.email, page);
    }

    updateValueOfSearchEmail = (e: React.FormEvent) => {
        const target = e.target as HTMLSelectElement;
        this.setState({
            email: target.value
        })
    }

    incrementPage = () => {
        if (this.props.manageUsersCurrentPage < this.props.manageUsersPageTotal - 1) {
            const newPage = this.props.manageUsersCurrentPage + 1;
            if (this.state.email) {
                this.getUserByEmail(newPage);
            } else {
                this.updateDropdown(this.state.dropDownValue, newPage);
            }
        }
    }

    decrementPage = () => {
        if (this.props.manageUsersCurrentPage > 0) {
            const newPage = this.props.manageUsersCurrentPage - 1;
            if (this.state.email) {
                this.getUserByEmail(newPage);
            } else {
                this.updateDropdown(this.state.dropDownValue, newPage);
            }
        }
    }


    // returns active if the role provided in the route is the routeName provided
    isActive = (routeName: string) => ((this.state.selectedRole === routeName) ? 'manage-user-nav-item-active' : 'manage-user-nav-item')

    render() {
        //const { createUser } = this.props;
        let path = '/management';
        const searchPage = this.props.manageUsersCurrentPage;
        return (
            <>
                <div id="manage-user-nav" className="rev-background-color manage-user-nav">
                    <div id="manage-cohorts-view-selection-container">
                        <div>View By Role:</div>
                        <Dropdown color="success" className="responsive-modal-row-item rev-btn"
                            isOpen={this.state.roleDropdownList} toggle={this.toggleDropdownList}>
                            {/* toggle={this.props.toggleViewUserModal}> */}
                            <DropdownToggle caret>
                                {this.state.dropDownValue}
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem >
                                    <Link to={path + "/manage/all"}
                                        className={`nav-link ${this.isActive('all')}`}
                                        onClick={() => this.updateDropdown('all', searchPage)}>All</Link></DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem>
                                    <Link to={path + "/manage/admin"}
                                        className={`nav-link ${this.isActive(cognitoRoles.ADMIN)}`}
                                        onClick={() => this.updateDropdown(cognitoRoles.ADMIN, searchPage)}>Admin</Link></DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem>
                                    <Link to={path + "/manage/trainer"}
                                        className={`nav-link ${this.isActive(cognitoRoles.TRAINER)}`}
                                        onClick={() => this.updateDropdown(cognitoRoles.TRAINER, searchPage)}>Trainer</Link></DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem>
                                    <Link to={path + "/manage/staging-manager"}
                                        className={`nav-link ${this.isActive(cognitoRoles.STAGING_MANAGER)}`}
                                        onClick={() => this.updateDropdown(cognitoRoles.STAGING_MANAGER, searchPage)}>Staging Manager</Link></DropdownItem>
                                <DropdownItem divider />
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div>
                        <Input
                            id="Search-user-by-partial-email-input"
                            className="responsive-modal-row-item no-backround-image"
                            placeholder="Email"
                            onChange={this.updateValueOfSearchEmail}
                            value={this.state.email}
                        />
                    </div>
                    <Button color="secondary" onClick={() => this.getUserByEmail(0)}>
                        Search
                    </Button>
                </div>



                <Table striped id="manage-users-table">
                    <ViewUserModal />
                    <thead className="rev-background-color">
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Roles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.manageUsers.map((user) =>
                                <tr key={user.email} className="rev-table-row" onClick={() => this.displayUserModal(user)}>
                                    <td>{user.firstName}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.roles.map(role => role.charAt(0).toUpperCase() + role.slice(1)).join(', ')}</td>
                                </tr>
                            )
                        }
                    </tbody>
                </Table>
                <div className='row horizontal-centering vertical-centering'>
                    <Button variant="button-color" className="rev-background-color div-child" onClick={this.decrementPage}>Prev</Button>
                    <h6 className="div-child text-style" >
                        Page {this.props.manageUsersCurrentPage + 1} of {this.props.manageUsersPageTotal}
                    </h6>
                    <Button variant="button-color" className="rev-background-color div-child" onClick={this.incrementPage}>Next</Button>
                </div>
            </>
        )
    }
}